import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

function getModuleAccessRecord(employee) {
  if (!employee?.module_access) return null;
  return Array.isArray(employee.module_access)
    ? employee.module_access[0] || null
    : employee.module_access;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fy = searchParams.get('fy');

    const supabase = adminClient;
    let query = supabase.from('audit_projects').select('*').order('created_at', { ascending: false });

    if (fy) {
      query = query.eq('financial_year', fy);
    }

    const [{ data: projects }, { data: rawEmployees }] = await Promise.all([
      query,
      supabase.from('hrm_employees').select(`
        id,
        name,
        email,
        role,
        profile_picture_url,
        employee_id
      `).order('name', { ascending: true })
    ]);

    const employees = (rawEmployees || []).map(e => ({
      id: e.id,
      name: e.name || e.email || 'Employee',
      email: e.email,
      role: e.role,
      avatar_url: e.profile_picture_url || '',
      employee_id: e.employee_id
    }));

    return NextResponse.json({
      success: true,
      projects: projects || [],
      employees: employees
    });
  } catch (err) {
    return NextResponse.json({ success: true, projects: [], employees: [] });
  }
}

const isValidUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      template_id,
      project_name,
      client_name,
      financial_year,
      project_leader,
      start_date,
      end_date,
      project_length,
      assigned_team,
      company_category,
      custom_category,
      plants
    } = body;

    if (!project_name || !client_name) {
      return NextResponse.json({ success: false, error: "Project Name and Client Name are required" }, { status: 400 });
    }

    const supabase = adminClient;

    // Fetch HRM employees to map names <-> UUIDs
    const { data: rawEmployees } = await supabase
      .from('hrm_employees')
      .select('id, name, email');

    const empMap = new Map();
    (rawEmployees || []).forEach(e => {
      empMap.set(e.id, e.id);
      if (e.name) empMap.set(e.name.toLowerCase().trim(), e.id);
    });

    // Resolve project_leader UUID
    let resolvedLeader = null;
    if (project_leader) {
      if (isValidUuid(project_leader)) {
        resolvedLeader = project_leader;
      } else {
        resolvedLeader = empMap.get(String(project_leader).toLowerCase().trim()) || null;
      }
    }

    // Resolve assigned_team UUIDs array
    let resolvedTeam = [];
    if (Array.isArray(assigned_team)) {
      resolvedTeam = assigned_team
        .map(member => {
          if (isValidUuid(member)) return member;
          return empMap.get(String(member).toLowerCase().trim()) || null;
        })
        .filter(Boolean);
    } else if (typeof assigned_team === 'string' && assigned_team.trim()) {
      resolvedTeam = assigned_team
        .split(',')
        .map(s => s.trim())
        .map(member => {
          if (isValidUuid(member)) return member;
          return empMap.get(member.toLowerCase()) || null;
        })
        .filter(Boolean);
    }

    // Resolve template_id UUID
    const resolvedTemplateId = isValidUuid(template_id) ? template_id : null;

    const categoryVal = company_category === "Other"
      ? (custom_category ? `Other: ${custom_category.trim()}` : "Other")
      : (company_category || null);

    const plantList = Array.isArray(plants)
      ? plants.map(p => String(p).trim()).filter(Boolean)
      : [];

    const metaObj = {
      category: categoryVal,
      plant_count: plantList.length,
      plants: plantList
    };

    let insertPayload = {
      template_id: resolvedTemplateId,
      project_name,
      client_name,
      financial_year: financial_year || 'FY 2026-27',
      project_leader: resolvedLeader,
      start_date: start_date || null,
      end_date: end_date || null,
      project_length: project_length ? parseInt(project_length, 10) : 0,
      assigned_team: resolvedTeam,
      company_category: categoryVal,
      plants: plantList,
      current_stage: 1,
      status: 'active'
    };

    let { data, error } = await supabase.from('audit_projects').insert([insertPayload]).select().single();

    // If explicit column error occurs (e.g. company_category / plants column missing in DB schema), retry with custom_columns fallback
    if (error && (error.code === '42703' || error.message?.includes('column'))) {
      delete insertPayload.company_category;
      delete insertPayload.plants;
      insertPayload.custom_columns = [
        { key: "__company_meta", category: categoryVal, plants: plantList }
      ];
      const retry = await supabase.from('audit_projects').insert([insertPayload]).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("Error inserting audit_project:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (data) {
      if (!data.company_category) data.company_category = categoryVal;
      if (!data.plants || data.plants.length === 0) data.plants = plantList;
    }

    return NextResponse.json({ success: true, project: data });
  } catch (err) {
    console.error("POST /Auditing/api/dynamic/projects error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const {
      projectId,
      id,
      project_name,
      client_name,
      financial_year,
      project_leader,
      start_date,
      end_date,
      project_length,
      assigned_team,
      company_category,
      custom_category,
      plants,
      current_stage,
      status,
      custom_columns,
      data_tracker
    } = body;
    const targetProjectId = projectId || id;

    if (!targetProjectId) {
      return NextResponse.json({ success: false, error: "projectId or id is required" }, { status: 400 });
    }

    const supabase = adminClient;
    const updateData = {};

    if (project_name !== undefined) updateData.project_name = project_name;
    if (client_name !== undefined) updateData.client_name = client_name;
    if (financial_year !== undefined) updateData.financial_year = financial_year;
    if (start_date !== undefined) updateData.start_date = start_date || null;
    if (end_date !== undefined) updateData.end_date = end_date || null;
    if (project_length !== undefined) updateData.project_length = project_length ? parseInt(project_length, 10) : 0;
    if (current_stage !== undefined) updateData.current_stage = parseInt(current_stage, 10);
    if (status !== undefined) updateData.status = status;
    if (custom_columns !== undefined) {
      updateData.custom_columns = custom_columns;
    }
    if (data_tracker !== undefined) updateData.data_tracker = data_tracker;

    // Fetch HRM employees to map names <-> UUIDs if project_leader or assigned_team is passed
    if (project_leader !== undefined || assigned_team !== undefined || custom_columns !== undefined) {
      const { data: projMeta } = await supabase.from('audit_projects').select('meta_json').eq('id', targetProjectId).single();
      const existingMeta = projMeta?.meta_json || {};
      if (custom_columns !== undefined) {
        updateData.meta_json = {
          ...existingMeta,
          custom_columns: custom_columns
        };
      }
    }

    if (project_leader !== undefined || assigned_team !== undefined) {
      const { data: rawEmployees } = await supabase
        .from('hrm_employees')
        .select('id, name, email');

      const empMap = new Map();
      (rawEmployees || []).forEach(e => {
        empMap.set(e.id, e.id);
        if (e.name) empMap.set(e.name.toLowerCase().trim(), e.id);
      });

      if (project_leader !== undefined) {
        if (!project_leader || project_leader === '__UNASSIGNED__') {
          updateData.project_leader = null;
        } else if (isValidUuid(project_leader)) {
          updateData.project_leader = project_leader;
        } else {
          updateData.project_leader = empMap.get(String(project_leader).toLowerCase().trim()) || null;
        }
      }

      if (assigned_team !== undefined) {
        let resolvedTeam = [];
        if (Array.isArray(assigned_team)) {
          resolvedTeam = assigned_team
            .map(member => {
              if (isValidUuid(member)) return member;
              return empMap.get(String(member).toLowerCase().trim()) || null;
            })
            .filter(Boolean);
        } else if (typeof assigned_team === 'string' && assigned_team.trim()) {
          resolvedTeam = assigned_team
            .split(',')
            .map(s => s.trim())
            .map(member => {
              if (isValidUuid(member)) return member;
              return empMap.get(member.toLowerCase()) || null;
            })
            .filter(Boolean);
        }
        updateData.assigned_team = resolvedTeam;
      }
    }

    if (company_category !== undefined || custom_category !== undefined) {
      const categoryVal = company_category === "Other"
        ? (custom_category ? `Other: ${custom_category.trim()}` : "Other")
        : (company_category || null);
      updateData.company_category = categoryVal;
    }

    if (plants !== undefined) {
      updateData.plants = Array.isArray(plants)
        ? plants.map(p => String(p).trim()).filter(Boolean)
        : [];
    }

    updateData.updated_at = new Date().toISOString();

    let { data, error } = await supabase
      .from('audit_projects')
      .update(updateData)
      .eq('id', targetProjectId)
      .select()
      .single();

    // If explicit column error occurs for company_category / plants / custom_columns, fallback gracefully
    if (error && (error.code === '42703' || error.message?.includes('column'))) {
      const catVal = updateData.company_category;
      const plVal = updateData.plants;
      delete updateData.company_category;
      delete updateData.plants;
      delete updateData.custom_columns;
      delete updateData.data_tracker;
      
      const retry = await supabase
        .from('audit_projects')
        .update(updateData)
        .eq('id', targetProjectId)
        .select()
        .single();

      data = retry.data;
      error = retry.error;

      if (data) {
        if (catVal) data.company_category = catVal;
        if (plVal) data.plants = plVal;
      }
    }

    if (error) {
      console.error("Error updating audit_project:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: data });
  } catch (err) {
    console.error("PATCH /Auditing/api/dynamic/projects error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
    }

    const supabase = adminClient;

    // Purge related records from stage tables
    await Promise.allSettled([
      supabase.from('audit_programmes').delete().eq('project_id', id),
      supabase.from('audit_stage1_org').delete().eq('project_id', id),
      supabase.from('audit_stage1_calendar').delete().eq('project_id', id),
      supabase.from('audit_data_tracker').delete().eq('project_id', id),
      supabase.from('audit_documents').delete().eq('project_id', id),
    ]);

    // Delete company project record from database
    const { error } = await supabase
      .from('audit_projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting audit_project:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("DELETE /Auditing/api/dynamic/projects error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
