import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

const DEFAULT_TEMPLATES = [
  {
    id: "tpl-internal",
    template_name: "Internal Audit",
    category: "Internal Audit",
    description: "Comprehensive internal audit with pre-execution planning, weekly calendar, org structure, and process execution.",
    icon: "🛡️",
    color: "#0d9488",
    default_processes: ["P2P Audit"]
  },
  {
    id: "tpl-ifc",
    template_name: "IFC / ICFR",
    category: "Compliance",
    description: "Internal Financial Controls and Financial Reporting audit structure.",
    icon: "🏦",
    color: "#2563eb",
    default_processes: ["Entity Level Controls"]
  },
  {
    id: "tpl-pdpl",
    template_name: "PDPL Audit",
    category: "Privacy & Data",
    description: "Personal Data Protection Law audit framework.",
    icon: "🏭",
    color: "#d97706",
    default_processes: ["Data Collection"]
  },
  {
    id: "tpl-cst",
    template_name: "CST Audit",
    category: "Process Audit",
    description: "CST process and execution audit framework.",
    icon: "📊",
    color: "#0f766e",
    default_processes: ["Execution Planning"]
  },
  {
    id: "tpl-saudi",
    template_name: "Saudi Audit",
    category: "Internal Audit",
    description: "Saudi Arabia internal audit workspace structure.",
    icon: "🇸🇦",
    color: "#1e3a8a",
    default_processes: ["Master RCM"]
  }
];

export async function GET() {
  try {
    const supabase = adminClient;
    let { data, error } = await supabase.from('audit_templates').select('*').order('created_at', { ascending: true });
    
    if (!error && (!data || data.length === 0)) {
      // Auto-seed default templates into database
      const toInsert = DEFAULT_TEMPLATES.map(({ id, ...rest }) => rest);
      const { data: seeded } = await supabase.from('audit_templates').insert(toInsert).select();
      if (seeded && seeded.length > 0) {
        data = seeded;
      }
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, templates: DEFAULT_TEMPLATES });
    }
    
    return NextResponse.json({ success: true, templates: data });
  } catch (err) {
    return NextResponse.json({ success: true, templates: DEFAULT_TEMPLATES });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { template_name, category, description, icon, color, default_processes } = body;
    
    if (!template_name) {
      return NextResponse.json({ success: false, error: "Template name is required" }, { status: 400 });
    }

    const supabase = adminClient;
    const { data, error } = await supabase.from('audit_templates').insert([{
      template_name,
      category: category || 'Internal Audit',
      description: description || '',
      icon: icon || '📋',
      color: color || '#0d9488',
      default_processes: default_processes || ["P2P Audit"]
    }]).select().single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, template: data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
