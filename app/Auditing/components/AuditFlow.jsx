"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AUDIT_TEMPLATES } from "./templateLibrary";
import PdplWorkspace from "./PdplWorkspace";
import CstAuditWorkspace from "./CstAuditWorkspace";
import SaudiAuditWorkspace from "./SaudiAuditWorkspace";
import DynamicSaaSWorkspace from "./DynamicSaaSWorkspace";
import StaticTrackerWorkspace from "./StaticTrackerWorkspace";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  Layers,
  Workflow,
  ArrowRight,
  CheckCircle2,
  Building2,
  Cpu,
  Database,
  Grid,
  FileSpreadsheet,
  ArrowLeft,
  ChevronRight,
  Home,
  Calendar,
  Table2,
  UploadCloud,
  CheckSquare,
  MessageSquare,
  Users,
  Shield,
  FileText,
  Clock,
  Mail
} from "lucide-react";

// ─── FONTS ───────────────────────────────────────────────────────────────────
// ─── FONTS & LIQUID GLASS EFFECT STYLES ────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600;700&family=SF+Pro+Text:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body,#root{
      height:100%;
      font-family:-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif;
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
    }
    
    /* Apple Liquid Glass Morphic Utilities */
    .apple-glass {
      background: rgba(255, 255, 255, 0.76) !important;
      backdrop-filter: blur(28px) saturate(190%) !important;
      -webkit-backdrop-filter: blur(28px) saturate(190%) !important;
      border: 1px solid rgba(255, 255, 255, 0.7) !important;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9) !important;
    }
    .apple-glass-dark {
      background: linear-gradient(145deg, rgba(29, 29, 31, 0.94) 0%, rgba(18, 18, 20, 0.98) 100%) !important;
      backdrop-filter: blur(32px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(32px) saturate(180%) !important;
      border: 1px solid rgba(255, 255, 255, 0.14) !important;
      box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18) !important;
    }
    .apple-glass-card {
      background: rgba(255, 255, 255, 0.82) !important;
      backdrop-filter: blur(24px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
      border: 1px solid #D2D2D7 !important;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95) !important;
    }

    /* Apple Click Tactile Animation */
    .apple-click {
      transition: transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.16s ease !important;
    }
    .apple-click:active {
      transform: scale(0.97) !important;
    }

    /* Apple Smooth Momentum Scrolling */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #D2D2D7; border-radius: 980px; }
    ::-webkit-scrollbar-thumb:hover { background: #86868B; }

    input[type=date]::-webkit-calendar-picker-indicator{opacity:0.5;cursor:pointer;}
    @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideInRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  `}</style>
);

// ─── APPLE DESIGN TOKENS (DESIGN.md) ──────────────────────────────────────────
const C = {
  bg: "#F5F5F7",
  bg2: "#E8E8ED",
  surface: "#FFFFFF",
  surface2: "#F5F5F7",
  border: "#D2D2D7",
  border2: "#E5E5EA",
  teal: "#0071E3",
  teal2: "#0076DF",
  tealBg: "rgba(0, 113, 227, 0.08)",
  tealBorder: "rgba(0, 113, 227, 0.25)",
  amber: "#FF9500",
  amberBg: "rgba(255, 149, 0, 0.12)",
  amberBorder: "rgba(255, 149, 0, 0.25)",
  red: "#FF3B30",
  redBg: "rgba(255, 59, 48, 0.12)",
  redBorder: "rgba(255, 59, 48, 0.25)",
  blue: "#0071E3",
  blueBg: "rgba(0, 113, 227, 0.08)",
  blueBorder: "rgba(0, 113, 227, 0.25)",
  green: "#34C759",
  greenBg: "rgba(52, 199, 89, 0.12)",
  greenBorder: "rgba(52, 199, 89, 0.25)",
  purple: "#AF52DE",
  purpleBg: "rgba(175, 82, 222, 0.12)",
  purpleBorder: "rgba(175, 82, 222, 0.25)",
  text1: "#1D1D1F",
  text2: "#424245",
  text3: "#86868B",
};

const AVATAR_COLORS = ['#2563eb','#0d9488','#d97706','#dc2626','#7c3aed','#16a34a','#db2777','#0891b2','#ea580c','#4338ca'];
const MONO = "'JetBrains Mono', monospace";

// ─── FILE HELPERS ─────────────────────────────────────────────────────────────
const FILE_TYPES = {
  pdf:  {icon:'📄', color:'#dc2626', bg:'#fef2f2', border:'#fecaca', label:'PDF'},
  xlsx: {icon:'📊', color:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0', label:'Excel'},
  xls:  {icon:'📊', color:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0', label:'Excel'},
  docx: {icon:'📝', color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe', label:'Word'},
  doc:  {icon:'📝', color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe', label:'Word'},
  jpg:  {icon:'🖼', color:'#d97706', bg:'#fffbeb', border:'#fde68a', label:'Image'},
  jpeg: {icon:'🖼', color:'#d97706', bg:'#fffbeb', border:'#fde68a', label:'Image'},
  png:  {icon:'🖼', color:'#d97706', bg:'#fffbeb', border:'#fde68a', label:'Image'},
  ppt:  {icon:'📋', color:'#ea580c', bg:'#fff7ed', border:'#fed7aa', label:'PPT'},
  pptx: {icon:'📋', color:'#ea580c', bg:'#fff7ed', border:'#fed7aa', label:'PPT'},
  csv:  {icon:'📈', color:'#0d9488', bg:'#f0fdfa', border:'#99f6e4', label:'CSV'},
  txt:  {icon:'📃', color:'#475569', bg:'#f8fafc', border:'#e2e8f0', label:'Text'},
};
const getFileType = name => FILE_TYPES[name?.split('.').pop()?.toLowerCase()] || {icon:'📎',color:'#475569',bg:'#f8fafc',border:'#e2e8f0',label:'File'};
const fmtSize = bytes => bytes < 1024 ? bytes+'B' : bytes < 1048576 ? (bytes/1024).toFixed(1)+'KB' : (bytes/1048576).toFixed(1)+'MB';

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const INIT_MEMBERS = [];


const mkStep = (id,step,status,aqc,risk,assignee,due,obs='',docs=[],comments=[]) =>
  ({id,step,status,aqc,risk,assignee,due,obs,docs,comments});

const INIT_PROJECTS = [
  {
    id:1,name:'HR Audit — FY2025',unit:'Lixil Window Systems Private Limited',
    type:'hr',icon:'👤',status:'active',start:'2025-01-15',end:'2025-03-31',lead:1,
    desc:'Comprehensive audit of HR policies, recruitment, payroll, and compliance.',
    procedures:[
      {id:'p1',name:'Policies & Procedures',desc:'Review whether HR policies are documented, approved by management',steps:[
        mkStep('1.1','Obtain copy of organization chart and review for appropriate delegation and segregation of duties.','done','pass','medium',2,'2025-02-10','Organization chart obtained. Delegation matrix reviewed — minor gaps in segregation noted.',[{name:'OrgChart_FY2025.pdf',size:'245KB',type:'pdf',uploadedBy:'Priya Sharma',uploadedAt:'2025-02-10'},{name:'Delegation_Matrix.xlsx',size:'88KB',type:'xlsx',uploadedBy:'Anil Mehta',uploadedAt:'2025-02-11'}],[{author:'Priya Sharma',initials:'PS',time:'2 days ago',text:'Chart was last updated in Dec 2024. Will request latest version.'}]),
        mkStep('1.2','Verify whether POSH Internal Committee Constitution (ICC) is constituted as per law and meetings/complaints records maintained.','done','pass','high',3,'2025-02-12','ICC constituted. 4 meetings held in FY2024. Minutes available.',[{name:'ICC_Constitution.pdf',size:'112KB',type:'pdf',uploadedBy:'Rajan Verma',uploadedAt:'2025-02-12'},{name:'ICC_Meeting_Minutes_Q1.docx',size:'56KB',type:'docx',uploadedBy:'Rajan Verma',uploadedAt:'2025-02-12'},{name:'POSH_Complaint_Register.xlsx',size:'34KB',type:'xlsx',uploadedBy:'Rajan Verma',uploadedAt:'2025-02-13'}],[]),
        mkStep('1.3','Check whether whistleblower / grievance redressal mechanism exists and complaints are tracked and resolved.','progress','review','high',2,'2025-02-20','',[],[]),
        mkStep('1.4','Verify whether HR policies are approved by the Board / Senior Management and documented with version control.','done','pass','medium',4,'2025-02-15','Policies board-approved. Version control maintained.',[{name:'Board_Approval_HR_Policy.pdf',size:'320KB',type:'pdf',uploadedBy:'Sneha Gupta',uploadedAt:'2025-02-15'}],[]),
        mkStep('1.5','Formal induction process, code of conduct/ethics, Consequence management, implementation and communication not defined.','todo','pending','high',null,'2025-02-28','',[],[]),
        mkStep('1.6','Obtain copy of leave, recruitment, payroll, POSH & grievance handling policies and their periodic review process.','done','pass','low',5,'2025-02-10','All policies obtained and reviewed.',[{name:'Leave_Policy_v4.pdf',size:'98KB',type:'pdf',uploadedBy:'Deepak Joshi',uploadedAt:'2025-02-10'},{name:'Payroll_Policy.pdf',size:'145KB',type:'pdf',uploadedBy:'Deepak Joshi',uploadedAt:'2025-02-10'}],[]),
        mkStep('1.7','Verify that HR policies are properly communicated to employees, acknowledged through signed declarations, and periodically reviewed.','progress','pending','medium',6,'2025-02-25','',[],[]),
        mkStep('1.8','Assess whether implementation of policies is effective by testing sample transactions and comparing actual practice with documented procedures.','todo','pending','high',null,'2025-03-05','',[],[]),
      ]},
      {id:'p2',name:'Recruitment Process',desc:'Verify hiring is conducted against approved manpower plans',steps:[
        mkStep('2.1','Check whether Manpower budget is approved and monitoring for the same.','done','pass','medium',3,'2025-02-18','Budget approved by MD. Monthly tracking done.',[{name:'Manpower_Budget_FY25.xlsx',size:'210KB',type:'xlsx',uploadedBy:'Rajan Verma',uploadedAt:'2025-02-18'}],[]),
        mkStep('2.2','Verify recruitment is based on an approved Manpower Requisition form.','done','pass','medium',2,'2025-02-18','MRF process followed for all roles.',[],[]),
        mkStep('2.3','Verify whether job description and job specification laid down to ensure no ambiguity.','progress','review','low',7,'2025-02-22','',[],[]),
        mkStep('2.4','Check whether referral schemes in existence and compliance to the same.','todo','pending','low',null,'2025-03-01','',[],[]),
        mkStep('2.5','Confirm hiring is within approved salary band and deviations are authorized.','done','pass','high',4,'2025-02-20','3 deviations found — all authorized by HR Head.',[{name:'Salary_Band_Deviations.xlsx',size:'67KB',type:'xlsx',uploadedBy:'Sneha Gupta',uploadedAt:'2025-02-20'}],[]),
        mkStep('2.6','Review compliance with defined interview process and documentation.','progress','pending','medium',8,'2025-02-28','',[],[]),
        mkStep('2.7','Verify whether reference checks of candidates done.','todo','pending','medium',null,'2025-03-05','',[],[]),
        mkStep('2.8','Verify whether offer letters and appointment letters are issued and acknowledged by employees.','done','pass','low',9,'2025-02-15','All sampled employees have signed copies on file.',[],[]),
        mkStep('2.9','Verify whether joining documents are obtained (PAN, Aadhar, Bank details, etc.)','done','pass','medium',5,'2025-02-15','Documents collected for all joiners tested.',[],[]),
        mkStep('2.10','Check whether probation confirmation process is defined and documented.','progress','review','medium',6,'2025-03-01','',[],[]),
        mkStep('2.11','Verify payments to recruitment agencies and whether in accordance with contract.','todo','pending','high',null,'2025-03-10','',[],[]),
      ]},
      {id:'p3',name:'Payroll & Compensation',desc:'Review payroll processes, salary revisions, statutory compliance',steps:[
        mkStep('3.1','Match actual salary payments (bank transfer) with approved payroll output file and investigate discrepancies.','progress','pending','high',10,'2025-03-05','',[],[]),
        mkStep('3.2','Verify salary revision approvals and increments authorized.','todo','pending','high',null,'2025-03-10','',[],[]),
        mkStep('3.3','Check statutory deductions (PF, ESI, TDS) are correctly computed and deposited on time.','todo','pending','high',null,'2025-03-12','',[],[]),
        mkStep('3.4','Verify leave encashment calculations and approvals.','todo','pending','medium',null,'2025-03-15','',[],[]),
      ]},
    ]
  },
  {
    id:2,name:'Finance & Accounts — FY2025',unit:'Lixil Window Systems Pvt Ltd',
    type:'fin',icon:'💰',status:'active',start:'2025-01-20',end:'2025-04-15',lead:4,
    desc:'Review of financial controls, AP/AR, bank reconciliations, and expense management.',
    procedures:[
      {id:'f1',name:'Accounts Payable',desc:'Review vendor payments and invoice processing',steps:[
        mkStep('F1.1','Review vendor invoice processing and 3-way match (PO, GRN, Invoice).','done','pass','high',7,'2025-02-20','Process followed for all tested invoices.',[],[]),
        mkStep('F1.2','Verify vendor master data changes are authorized.','progress','review','high',4,'2025-02-25','',[],[]),
      ]},
    ]
  },
  {
    id:3,name:'Inventory Management — Q1 2025',unit:'Lixil Manufacturing Unit',
    type:'inv',icon:'📦',status:'review',start:'2025-02-01',end:'2025-04-30',lead:7,
    desc:'Physical verification, stock reconciliation and warehouse controls.',
    procedures:[
      {id:'i1',name:'Stock Verification',desc:'Physical count and reconciliation',steps:[
        mkStep('I1.1','Conduct physical stock count and reconcile with system records.','done','pass','high',8,'2025-03-01','Physical count matches within 0.5% variance.',[],[]),
        mkStep('I1.2','Review slow-moving and obsolete inventory provisions.','progress','pending','medium',9,'2025-03-10','',[],[]),
      ]},
    ]
  },
  {
    id:4,name:'Billing & Collections — FY2025',unit:'Lixil Sales Division',
    type:'bil',icon:'🧾',status:'active',start:'2025-02-10',end:'2025-05-15',lead:10,
    desc:'Revenue recognition, customer billing accuracy, and collections monitoring.',
    procedures:[
      {id:'b1',name:'Billing Accuracy',desc:'Verify billing matches contracts and approvals',steps:[
        mkStep('B1.1','Test sample customer invoices against contracts and price lists.','todo','pending','high',null,'2025-03-15','',[],[]),
        mkStep('B1.2','Verify credit notes are properly authorized.','todo','pending','medium',null,'2025-03-20','',[],[]),
      ]},
    ]
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function calcProgress(p) {
  const procedures = Array.isArray(p?.procedures) ? p.procedures : [];
  const all = procedures.flatMap(pr=>pr.steps || []);
  if(!all.length) return 0;
  return Math.round(all.filter(s=>s.status==='done').length/all.length*100);
}
function avatarColor(id){ return AVATAR_COLORS[(id-1)%AVATAR_COLORS.length]; }
function getProjectProcedures(project){
  return Array.isArray(project?.procedures) ? project.procedures : [];
}
function getProjectSteps(project){
  return getProjectProcedures(project).flatMap(proc => proc.steps || []);
}

// ─── BADGE MAPS ───────────────────────────────────────────────────────────────
const STATUS_MAP = {
  todo:     {label:'Not Started', bg:'#ffffff', color:'#475569', border:'#cbd5e1', dot:'#94a3b8'},
  progress: {label:'In Progress', bg:'#fff7ed', color:'#b45309', border:'#fdba74', dot:'#f59e0b'},
  done:     {label:'Completed', bg:'#f0fdf4', color:'#15803d', border:'#86efac', dot:'#22c55e'},
};
const AQC_MAP = {
  pending: {label:'Pending', bg:'#ffffff', color:'#475569', border:'#cbd5e1', dot:'#94a3b8'},
  pass:    {label:'Passed', bg:'#f0fdf4', color:'#15803d', border:'#86efac', dot:'#22c55e'},
  review:  {label:'Needs Review', bg:'#fff7ed', color:'#b45309', border:'#fdba74', dot:'#f59e0b'},
  fail:    {label:'Failed', bg:'#fef2f2', color:'#b91c1c', border:'#fca5a5', dot:'#ef4444'},
};
const RISK_MAP = {
  high:   {label:'High Risk', bg:'#fef2f2', color:'#b91c1c', border:'#fca5a5', dot:'#ef4444'},
  medium: {label:'Medium Risk', bg:'#fff7ed', color:'#b45309', border:'#fdba74', dot:'#f59e0b'},
  low:    {label:'Low Risk', bg:'#ecfeff', color:'#0f766e', border:'#67e8f9', dot:'#06b6d4'},
};
const TYPE_COLORS = {
  hr:  {accent:C.teal,   bg:C.tealBg,    border:C.tealBorder},
  fin: {accent:C.amber,  bg:C.amberBg,   border:C.amberBorder},
  inv: {accent:C.blue,   bg:C.blueBg,    border:C.blueBorder},
  bil: {accent:C.red,    bg:C.redBg,     border:C.redBorder},
  it:  {accent:C.purple, bg:C.purpleBg,  border:C.purpleBorder},
  ops: {accent:C.text2,  bg:C.bg2,       border:C.border},
};

const Badge = ({map,val,small}) => {
  const m = map[val]||map[Object.keys(map)[0]];
  return <span style={{display:'inline-flex',alignItems:'center',gap:6,padding:small?'4px 9px':'5px 11px',borderRadius:999,fontSize:small?10.5:11.5,fontWeight:700,background:m.bg,color:m.color,border:`1px solid ${m.border}`,whiteSpace:'nowrap'}}>
    <span style={{width:7,height:7,borderRadius:'50%',background:m.dot||m.color,flexShrink:0}} />
    {m.label}
  </span>;
};
const Avatar = ({member,size=28}) => (
  <div title={member.name} style={{width:size,height:size,borderRadius:'50%',background:avatarColor(member.id),display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.38,fontWeight:700,color:'#fff',flexShrink:0}}>{member.initials}</div>
);

const DrawerCardSelect=({options,val,onSelect,mapObj,cols=3})=>(
  <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:7}}>
    {options.map(k=>{
      const m=mapObj[k];const sel=val===k;
      return(
        <button key={k} onClick={()=>onSelect(k)} style={{padding:'9px 8px',borderRadius:9,fontSize:12,fontWeight:600,fontFamily:MONO,cursor:'pointer',textAlign:'center',border:sel?`2px solid ${m.border}`:`1.5px solid ${C.border}`,color:sel?m.color:C.text3,background:sel?m.bg:'#fff',boxShadow:sel?`0 2px 8px ${m.border}55`:'none',transform:sel?'translateY(-1px)':'none',transition:'all .18s'}}>
          {m.label}
        </button>
      );
    })}
  </div>
);

// ─── TOAST ────────────────────────────────────────────────────────────────────
function useToast(){
  const [toasts,setToasts]=useState([]);
  const show=useCallback((type,msg)=>{
    const id=Date.now();
    setToasts(t=>[...t,{id,type,msg}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3200);
  },[]);
  return{toasts,show};
}
const TICONS={success:'✅',error:'❌',info:'ℹ️',warning:'⚠️'};
const ToastContainer=({toasts})=>(
  <div style={{position:'fixed',bottom:24,right:24,zIndex:9999,display:'flex',flexDirection:'column',gap:8,pointerEvents:'none'}}>
    {toasts.map(t=>(
      <div key={t.id} style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:10,padding:'11px 16px',fontSize:13,color:C.text1,display:'flex',alignItems:'center',gap:10,boxShadow:'0 4px 24px rgba(0,0,0,0.1)',maxWidth:340,animation:'slideUp .3s ease'}}>
        <span>{TICONS[t.type]||TICONS.info}</span><span>{t.msg}</span>
      </div>
    ))}
  </div>
);

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const NAV_ITEMS=[
  {section:'Workspace',items:[{id:'audit categorys',icon:'◫',label:'Audit Category Library'},{id:'dashboard',icon:'⬡',label:'Dashboard'},{id:'my-tasks',icon:'◎',label:'My Tasks'}]},
  {section:'Reports',items:[{id:'export-excel',icon:'⬒',label:'Export Excel',action:true},{id:'export-pdf',icon:'⬓',label:'Export PDF',action:true}]},
  {section:'Admin',items:[{id:'team',icon:'◈',label:'Team Members'}]},
];
const Sidebar=({activeView,setView,projectCount,onExcelExport,onPdfExport})=>{
  const handleNav=id=>{if(id==='export-excel'){onExcelExport();return;}if(id==='export-pdf'){onPdfExport();return;}setView(id);};
  return(
    <aside style={{width:240,minWidth:240,background:'#fff',borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',boxShadow:'1px 0 4px rgba(0,0,0,0.04)'}}>
      <div style={{padding:'22px 20px 18px',borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,background:'linear-gradient(135deg,#0d9488,#0f766e)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800,color:'#fff',fontFamily:MONO}}>AF</div>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:C.text1,letterSpacing:'-0.3px'}}>AuditFlow</div>
            <div style={{fontSize:10,color:C.text3,fontFamily:MONO,letterSpacing:'1px',textTransform:'uppercase',marginTop:2}}>Lixil Internal Audit</div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:'14px 10px',overflowY:'auto'}}>
        {NAV_ITEMS.map(section=>(
          <div key={section.section}>
            <div style={{fontSize:10,fontFamily:MONO,letterSpacing:'1.5px',textTransform:'uppercase',color:C.text3,padding:'12px 10px 6px',fontWeight:600}}>{section.section}</div>
            {section.items.map(item=>{
              const isActive=activeView===item.id;
              return(
                <div key={item.id} onClick={()=>handleNav(item.id)}
                  onMouseEnter={e=>{if(!isActive)e.currentTarget.style.background=C.bg2;}}
                  onMouseLeave={e=>{if(!isActive)e.currentTarget.style.background='transparent';}}
                  style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:8,cursor:'pointer',color:isActive?C.teal:C.text2,fontSize:13.5,fontWeight:isActive?600:500,background:isActive?C.tealBg:'transparent',border:isActive?`1px solid ${C.tealBorder}`:'1px solid transparent',marginBottom:2,transition:'all .15s'}}>
                  <span style={{width:16,textAlign:'center',fontSize:13,color:isActive?C.teal:C.text3}}>{item.icon}</span>
                  {item.label}
                  {item.id==='dashboard'&&<span style={{marginLeft:'auto',background:C.teal,color:'#fff',fontSize:10,fontWeight:700,fontFamily:MONO,padding:'2px 6px',borderRadius:10}}>{projectCount}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{padding:14,borderTop:`1px solid ${C.border}`}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:C.bg2,borderRadius:10,border:`1px solid ${C.border}`}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#2563eb,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff'}}>AM</div>
          <div>
            <div style={{fontSize:12.5,fontWeight:600,color:C.text1}}>Admin User</div>
            <div style={{fontSize:10.5,color:C.teal,fontFamily:MONO}}>● Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard=({icon,value,label,change,changeType,accent})=>(
  <div style={{background:'rgba(255,255,255,0.85)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',border:`1px solid #D2D2D7`,borderRadius:18,padding:22,position:'relative',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.03)'}}>
    <div style={{position:'absolute',top:-10,right:-10,width:60,height:60,borderRadius:'50%',background:accent,opacity:0.06}}/>
    <div style={{fontSize:22,marginBottom:10}}>{icon}</div>
    <div style={{fontSize:28,fontWeight:700,fontFamily:"-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",color:C.text1,lineHeight:1,letterSpacing:'-0.02em'}}>{value}</div>
    <div style={{fontSize:13,color:C.text2,marginTop:6,fontWeight:500}}>{label}</div>
    <div style={{fontSize:11.5,marginTop:7,color:changeType==='up'?C.green:C.amber,fontWeight:600}}>{change}</div>
  </div>
);

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
const ProjectCard=({project,members,onClick})=>{
  const prog=calcProgress(project);
  const tc=TYPE_COLORS[project.type]||TYPE_COLORS.hr;
  const allSteps=getProjectSteps(project);
  const assigneeIds=[...new Set(allSteps.map(s=>s.assignee).filter(Boolean))].slice(0,4);
  const sb={active:{bg:C.tealBg,color:C.teal,border:C.tealBorder,label:'Active'},review:{bg:C.amberBg,color:C.amber,border:C.amberBorder,label:'Under Review'},closed:{bg:C.bg2,color:C.text3,border:C.border,label:'Closed'}}[project.status]||{bg:C.tealBg,color:C.teal,border:C.tealBorder,label:'Active'};
  return(
    <div onClick={onClick} className="apple-click" style={{background:`rgba(255,255,255,0.9)`,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',border:`1px solid #D2D2D7`,borderRadius:18,padding:24,cursor:'pointer',position:'relative',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)',transition:'all .25s cubic-bezier(0.16, 1, 0.3, 1)',minHeight:260,display:'flex',flexDirection:'column'}}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 14px 32px rgba(0,0,0,0.08)';e.currentTarget.style.borderColor='#0071E3';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)';e.currentTarget.style.borderColor='#D2D2D7';}}>
      <div style={{position:'absolute',top:-28,right:-18,width:110,height:110,borderRadius:'50%',background:`radial-gradient(circle, ${tc.accent}14 0%, transparent 70%)`}}/>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:18,position:'relative'}}>
        <div style={{width:48,height:48,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,background:'#ffffff',border:`1px solid #D2D2D7`,boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>{project.icon}</div>
        <span style={{fontSize:11,borderRadius:980,padding:'4px 12px',fontWeight:600,background:sb.bg,color:sb.color,border:`1px solid ${sb.border}`}}>{sb.label}</span>
      </div>
      <div style={{fontSize:11,color:C.teal,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>COMPANY PROJECT</div>
      <div style={{fontSize:17,fontWeight:600,color:C.text1,marginBottom:6,lineHeight:1.35,letterSpacing:'-0.015em'}}>{project.name}</div>
      <div style={{fontSize:13,color:C.text2,lineHeight:1.55,minHeight:52}}>{project.desc}</div>
      <div style={{marginTop:'auto',paddingTop:16,borderTop:`1px solid #E5E5EA`}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
          <div style={{fontSize:11,color:C.text3,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>PROGRESS</div>
          <span style={{fontSize:12,fontWeight:600,color:C.text1}}>{prog}%</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <div style={{flex:1,height:6,background:'#E8E8ED',borderRadius:980,overflow:'hidden'}}>
            <div style={{height:'100%',borderRadius:980,background:C.teal,width:`${prog}%`,transition:'width .5s ease'}}/>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center'}}>
            {assigneeIds.map((mid,i)=>{const m=members.find(t=>t.id===mid);return m?<div key={mid} title={m.name} style={{width:24,height:24,borderRadius:'50%',background:avatarColor(m.id),border:`2px solid #fff`,marginLeft:i?-6:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff'}}>{m.initials}</div>:null;})}
          </div>
          <span style={{fontSize:11.5,color:C.text3,fontWeight:500}}>{allSteps.filter(s=>s.status==='done').length}/{allSteps.length} steps</span>
        </div>
      </div>
    </div>
  );
};

const TemplateCard=({template,onClick})=>(
  <button
    type="button"
    onClick={onClick}
    className="apple-click"
    style={{
      background:'rgba(255, 255, 255, 0.85)',
      backdropFilter:'blur(24px) saturate(180%)',
      WebkitBackdropFilter:'blur(24px) saturate(180%)',
      border:'1px solid #D2D2D7',
      borderRadius:18,
      padding:'28px 26px',
      cursor:'pointer',
      position:'relative',
      overflow:'hidden',
      boxShadow:'0 2px 8px rgba(0,0,0,0.03)',
      transition:'all .25s cubic-bezier(0.16, 1, 0.3, 1)',
      textAlign:'left',
      minHeight:250,
      display:'flex',
      flexDirection:'column',
      justifyContent:'space-between'
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 14px 32px rgba(0, 113, 227, 0.12)';e.currentTarget.style.borderColor='#0071E3';}}
    onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.03)';e.currentTarget.style.borderColor='#D2D2D7';}}
  >
    <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at top right, ${template.accent}10 0%, transparent 50%)`,pointerEvents:'none'}} />
    
    <div>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:14,marginBottom:18,position:'relative'}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:52,height:52,borderRadius:14,background:'#FFFFFF',border:`1px solid #D2D2D7`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
            {template.icon}
          </div>
          <div>
            <div style={{fontSize:20,fontWeight:600,color:C.text1,lineHeight:1.2,letterSpacing:'-0.02em'}}>{template.name}</div>
            <div style={{fontSize:11.5,fontWeight:600,color:'#0071E3',marginTop:4,letterSpacing:'0.04em'}}>{template.shortCode}</div>
          </div>
        </div>
        <span style={{fontSize:11,padding:'4px 12px',borderRadius:980,fontWeight:600,background:'rgba(0, 113, 227, 0.08)',color:'#0071E3',border:'1px solid rgba(0, 113, 227, 0.2)'}}>
          {template.status}
        </span>
      </div>

      <div style={{fontSize:13.5,color:C.text2,lineHeight:1.6,position:'relative',marginTop:4}}>
        {template.description}
      </div>
    </div>

    <div style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:13,fontWeight:600,color:'#0071E3',position:'relative',marginTop:20}}>
      <span>Open audit category</span>
      <span style={{fontSize:14,transition:'transform 0.15s ease'}}>→</span>
    </div>
  </button>
);

const TableView=({project,members,onOpenTask,onAddStep,onDeleteStep,onRenameProcedure})=>{
  const [editingProc,setEditingProc]=useState(null);
  const [editingName,setEditingName]=useState('');
  const [editingDesc,setEditingDesc]=useState('');
  const th={background:C.bg2,padding:'10px 14px',textAlign:'left',fontSize:10.5,fontWeight:600,fontFamily:MONO,letterSpacing:'0.5px',textTransform:'uppercase',color:C.text3,borderBottom:`2px solid ${C.border2}`,whiteSpace:'nowrap',position:'sticky',top:0,zIndex:10};
  const td={padding:'11px 14px',borderBottom:`1px solid ${C.border}`,verticalAlign:'middle',fontSize:13};
  const editingField=(pi,field)=>editingProc&&editingProc.pi===pi&&editingProc.field===field;
  const inlineInput=(val,onChange,onCommit,onCancel,bold=false)=>(
    <input autoFocus value={val} onChange={e=>onChange(e.target.value)}
      onBlur={onCommit} onKeyDown={e=>{if(e.key==='Enter')onCommit();if(e.key==='Escape')onCancel();}}
      style={{background:'#fff',border:`2px solid ${C.teal}`,borderRadius:7,padding:'3px 10px',fontSize:bold?13.5:12,fontWeight:bold?700:400,fontStyle:bold?'normal':'italic',color:C.text1,outline:'none',fontFamily:'Sora,sans-serif',minWidth:bold?200:160}}/>
  );
  return(
    <div style={{overflowX:'auto',flex:1}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead>
          <tr>
            {['Ref','Audit Step','Status','AQC','Risk','Assigned To','Due Date','Files','Actions'].map(h=>(
              <th key={h} style={{...th,minWidth:h==='Audit Step'?280:h==='Files'?110:undefined}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {project.procedures.map((proc,pi)=>{
            const done=proc.steps.filter(s=>s.status==='done').length;
            const pct=proc.steps.length?Math.round(done/proc.steps.length*100):0;
            return[
              <tr key={proc.id} style={{background:'linear-gradient(90deg,#f0fdfa,#f8fafc)'}}>
                <td colSpan={9} style={{...td,borderLeft:`4px solid ${C.teal}`,padding:'10px 14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                    <span style={{fontSize:13,color:C.teal,fontWeight:700,fontFamily:MONO,background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:6,padding:'2px 8px',flexShrink:0}}>§{pi+1}</span>
                    {editingField(pi,'name')
                      ?inlineInput(editingName,setEditingName,()=>{if(editingName.trim())onRenameProcedure(pi,{name:editingName.trim()});setEditingProc(null);},()=>setEditingProc(null),true)
                      :<span onClick={()=>{setEditingProc({pi,field:'name'});setEditingName(proc.name);}} style={{fontSize:13.5,fontWeight:700,color:C.text1,cursor:'text',padding:'3px 7px',borderRadius:6,border:'1px solid transparent',transition:'all .15s',display:'flex',alignItems:'center',gap:5}}
                        onMouseEnter={e=>{e.currentTarget.style.border=`1px dashed ${C.teal}`;e.currentTarget.style.background='#fff';}}
                        onMouseLeave={e=>{e.currentTarget.style.border='1px solid transparent';e.currentTarget.style.background='transparent';}}>{proc.name}<span style={{fontSize:10,color:C.text3}}>✏</span></span>}
                    <span style={{color:C.text3,fontSize:12}}>—</span>
                    {editingField(pi,'desc')
                      ?inlineInput(editingDesc,setEditingDesc,()=>{onRenameProcedure(pi,{desc:editingDesc});setEditingProc(null);},()=>setEditingProc(null),false)
                      :<span onClick={()=>{setEditingProc({pi,field:'desc'});setEditingDesc(proc.desc||'');}} style={{fontSize:11.5,color:C.text3,fontStyle:'italic',cursor:'text',padding:'3px 7px',borderRadius:6,border:'1px solid transparent',transition:'all .15s',display:'flex',alignItems:'center',gap:5}}
                        onMouseEnter={e=>{e.currentTarget.style.border=`1px dashed ${C.border2}`;e.currentTarget.style.background='#fff';e.currentTarget.style.color=C.text2;}}
                        onMouseLeave={e=>{e.currentTarget.style.border='1px solid transparent';e.currentTarget.style.background='transparent';e.currentTarget.style.color=C.text3;}}>{proc.desc||<span style={{color:C.border2}}>Add description…</span>}<span style={{fontSize:10,opacity:.6}}>✏</span></span>}
                    <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:10}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:60,height:4,background:C.border2,borderRadius:2,overflow:'hidden'}}>
                          <div style={{height:'100%',background:C.teal,width:`${pct}%`,borderRadius:2,transition:'width .4s'}}/>
                        </div>
                        <span style={{fontFamily:MONO,fontSize:10.5,color:C.teal,fontWeight:600}}>{done}/{proc.steps.length}</span>
                      </div>
                      <button onClick={()=>onAddStep(pi)} style={{background:C.teal,border:'none',color:'#fff',padding:'4px 12px',borderRadius:6,fontSize:11,cursor:'pointer',fontFamily:'Sora,sans-serif',fontWeight:600}}>＋ Step</button>
                    </div>
                  </div>
                </td>
              </tr>,
              ...proc.steps.map((s,si)=>{
                const m=s.assignee?members.find(t=>t.id===s.assignee):null;
                const docCount=(s.docs||[]).length;
                return(
                  <tr key={s.id} onClick={()=>onOpenTask(pi,si)} style={{cursor:'pointer'}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bg2}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{...td,fontFamily:MONO,fontSize:11.5,color:C.text3,fontWeight:600}}>{s.id}</td>
                    <td style={{...td,color:C.text1,lineHeight:1.5,maxWidth:300}}>{s.step}</td>
                    <td style={td}><Badge map={STATUS_MAP} val={s.status}/></td>
                    <td style={td}><Badge map={AQC_MAP} val={s.aqc}/></td>
                    <td style={td}><Badge map={RISK_MAP} val={s.risk}/></td>
                    <td style={td}>
                      {m?<div style={{display:'flex',alignItems:'center',gap:7}}><Avatar member={m} size={26}/><span style={{fontSize:12,color:C.text2}}>{m.name}</span></div>
                        :<span style={{fontSize:12,color:C.text3}}>— Unassigned</span>}
                    </td>
                    <td style={{...td,fontFamily:MONO,fontSize:11.5,color:C.text3}}>{s.due||'—'}</td>
                    <td style={td}>
                      {docCount>0
                        ?<span style={{display:'inline-flex',alignItems:'center',gap:5,background:C.tealBg,color:C.teal,border:`1px solid ${C.tealBorder}`,borderRadius:20,padding:'3px 10px',fontSize:11,fontFamily:MONO,fontWeight:600,cursor:'pointer'}}>
                          📎 {docCount} {docCount===1?'file':'files'}
                        </span>
                        :<span style={{fontSize:12,color:C.text3}}>—</span>}
                    </td>
                    <td style={td} onClick={e=>e.stopPropagation()}>
                      <div style={{display:'flex',gap:5}}>
                        <button onClick={()=>onOpenTask(pi,si)} title="Edit" style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:13,color:C.text3,display:'flex',alignItems:'center',justifyContent:'center'}}>✏</button>
                        <button onClick={()=>onDeleteStep(pi,si)} title="Delete" style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.redBorder}`,background:C.redBg,cursor:'pointer',fontSize:13,color:C.red,display:'flex',alignItems:'center',justifyContent:'center'}}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ];
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── KANBAN VIEW ──────────────────────────────────────────────────────────────
const KanbanView=({project,members,onOpenTask})=>{
  const COLS=[
    {key:'todo',label:'Not Started',color:'#94a3b8'},
    {key:'progress',label:'In Progress',color:C.amber},
    {key:'done',label:'Done',color:C.green},
  ];
  const allSteps=getProjectProcedures(project).flatMap((proc,pi)=>(proc.steps || []).map((s,si)=>({...s,procName:proc.name,pi,si})));
  return(
    <div style={{display:'flex',gap:16,padding:'20px 24px',overflowX:'auto',flex:1,alignItems:'flex-start'}}>
      {COLS.map(col=>{
        const cards=allSteps.filter(s=>s.status===col.key);
        return(
          <div key={col.key} style={{minWidth:270,maxWidth:270,display:'flex',flexDirection:'column',gap:8}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'#fff',border:`1px solid ${C.border}`,borderRadius:'10px 10px 0 0',borderBottom:`2px solid ${col.color}`}}>
              <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12.5,fontWeight:700,color:C.text1}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:col.color}}/>
                {col.label}
              </div>
              <span style={{fontFamily:MONO,fontSize:11,color:C.text3,background:C.bg2,padding:'2px 7px',borderRadius:10}}>{cards.length}</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,background:C.bg2,border:`1px solid ${C.border}`,borderTop:'none',borderRadius:'0 0 10px 10px',padding:10,minHeight:100}}>
              {cards.length?cards.map(s=>{
                const m=s.assignee?members.find(t=>t.id===s.assignee):null;
                const docCount=(s.docs||[]).length;
                return(
                  <div key={s.id} onClick={()=>onOpenTask(s.pi,s.si)}
                    style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:10,padding:14,cursor:'pointer',transition:'all .2s',boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    <div style={{fontFamily:MONO,fontSize:10,color:C.text3,marginBottom:5}}>{s.procName} · {s.id}</div>
                    <div style={{fontSize:12.5,color:C.text1,lineHeight:1.4,marginBottom:10}}>{s.step.length>90?s.step.substring(0,90)+'…':s.step}</div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <Badge map={RISK_MAP} val={s.risk} small/>
                        {docCount>0&&<span style={{fontSize:10,fontFamily:MONO,color:C.teal}}>📎{docCount}</span>}
                      </div>
                      {m?<Avatar member={m} size={22}/>:<span style={{fontSize:11,color:C.text3}}>—</span>}
                    </div>
                  </div>
                );
              }):<div style={{textAlign:'center',color:C.text3,fontSize:12,padding:20}}>No items</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── TASK DRAWER (with Details / Files tabs) ──────────────────────────────────
const TaskDrawer=({open,task,procName,members,onClose,onSave})=>{
  const [form,setForm]=useState(null);
  const [drawerTab,setDrawerTab]=useState('details');
  const [commentText,setCommentText]=useState('');
  const fileInputRef=useRef(null);

  // Reset tab when task changes
  useState(()=>{if(task){setForm({...task,docs:[...(task.docs||[])],comments:[...(task.comments||[])]});setDrawerTab('details');}},[task]);
  if(!open||!task)return null;
  const ft=form||task;
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const inputStyle={background:'#fff',border:`1px solid ${C.border2}`,borderRadius:9,padding:'10px 14px',color:C.text1,fontSize:13.5,fontFamily:'Sora,sans-serif',outline:'none',width:'100%',transition:'border .2s'};
  const labelStyle={fontSize:10.5,fontWeight:700,fontFamily:MONO,color:C.text3,textTransform:'uppercase',letterSpacing:'0.8px',display:'block',marginBottom:8};

  const addComment=()=>{
    if(!commentText.trim())return;
    set('comments',[...(ft.comments||[]),{author:'Admin User',initials:'AM',time:'Just now',text:commentText.trim()}]);
    setCommentText('');
  };

  const handleFileUpload=e=>{
    const newDocs=Array.from(e.target.files).map(f=>({
      name:f.name,
      size:fmtSize(f.size),
      type:f.name.split('.').pop().toLowerCase(),
      uploadedBy:'Admin User',
      uploadedAt:new Date().toISOString().slice(0,10),
    }));
    set('docs',[...ft.docs,...newDocs]);
    e.target.value='';
  };

  const removeDoc=i=>set('docs',ft.docs.filter((_,j)=>j!==i));
  const assignedMember=ft.assignee?members.find(m=>m.id===ft.assignee):null;
  const docCount=(ft.docs||[]).length;

  // Group docs by file type for summary
  const typeGroups={};
  (ft.docs||[]).forEach(d=>{const t=getFileType(d.name);const k=t.label;typeGroups[k]=(typeGroups[k]||0)+1;});

  return(
    <>
      <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.35)',zIndex:100,backdropFilter:'blur(3px)'}}/>
      <div style={{position:'fixed',right:0,top:0,bottom:0,width:600,background:C.bg,borderLeft:`1px solid ${C.border}`,zIndex:101,display:'flex',flexDirection:'column',boxShadow:'-12px 0 50px rgba(0,0,0,0.12)',animation:'slideInRight .25s ease'}}>

        {/* ── DRAWER HEADER ── */}
        <div style={{padding:'20px 26px',borderBottom:`1px solid ${C.border}`,flexShrink:0,background:'#fff'}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:14}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
                <span style={{fontFamily:MONO,fontSize:11,color:'#fff',fontWeight:700,background:C.teal,padding:'3px 9px',borderRadius:20}}>{ft.id}</span>
                <span style={{fontFamily:MONO,fontSize:11,color:C.text3}}>{procName}</span>
                {docCount>0&&<span style={{fontFamily:MONO,fontSize:10,color:C.teal,background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:20,padding:'2px 8px'}}>📎 {docCount} file{docCount!==1?'s':''}</span>}
              </div>
              <div style={{fontSize:15,fontWeight:700,color:C.text1,lineHeight:1.4}}>{ft.step}</div>
            </div>
            <button onClick={onClose} style={{width:33,height:33,borderRadius:9,border:`1px solid ${C.border}`,background:C.bg2,cursor:'pointer',color:C.text2,fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>✕</button>
          </div>

          {/* ── TAB STRIP ── */}
          <div style={{display:'flex',gap:2,marginTop:16}}>
            {[['details','📋 Details'],['files',`📁 Files${docCount>0?' ('+docCount+')':''}`]].map(([k,l])=>(
              <button key={k} onClick={()=>setDrawerTab(k)} style={{padding:'8px 16px',borderRadius:'8px 8px 0 0',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Sora,sans-serif',border:'none',
                color:drawerTab===k?C.teal:C.text3,
                background:drawerTab===k?C.bg:'transparent',
                borderBottom:drawerTab===k?`2px solid ${C.teal}`:'2px solid transparent',
                transition:'all .15s'}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB CONTENT ── */}
        <div style={{flex:1,overflowY:'auto'}}>

          {/* ════ DETAILS TAB ════ */}
          {drawerTab==='details'&&(
            <div style={{padding:'20px 26px',display:'flex',flexDirection:'column',gap:18}}>

              {/* Step description */}
              <div style={{background:'#fff',borderRadius:12,border:`1px solid ${C.border}`,padding:'16px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                <label style={labelStyle}>Audit Step Description</label>
                <textarea value={ft.step} onChange={e=>set('step',e.target.value)} style={{...inputStyle,resize:'vertical',minHeight:72,lineHeight:1.6,border:`1px solid ${C.border}`}}/>
              </div>

              {/* Status + Risk */}
              <div style={{background:'#fff',borderRadius:12,border:`1px solid ${C.border}`,padding:'18px',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <DrawerCardSelect options={['todo','progress','done']} val={ft.status} onSelect={v=>set('status',v)} mapObj={STATUS_MAP} cols={1}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Risk Rating</label>
                    <DrawerCardSelect options={['high','medium','low']} val={ft.risk} onSelect={v=>set('risk',v)} mapObj={RISK_MAP} cols={1}/>
                  </div>
                </div>
                <div style={{marginTop:18,paddingTop:18,borderTop:`1px solid ${C.border}`}}>
                  <label style={labelStyle}>AQC — Audit Quality Check</label>
                  <DrawerCardSelect options={['pending','pass','review','fail']} val={ft.aqc} onSelect={v=>set('aqc',v)} mapObj={AQC_MAP} cols={4}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:18,paddingTop:18,borderTop:`1px solid ${C.border}`}}>
                  <div>
                    <label style={labelStyle}>Assigned To</label>
                    {assignedMember&&(
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8,background:C.bg2,borderRadius:8,padding:'7px 10px',border:`1px solid ${C.border}`}}>
                        <div style={{width:24,height:24,borderRadius:'50%',background:avatarColor(assignedMember.id),display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff',flexShrink:0}}>{assignedMember.initials}</div>
                        <span style={{fontSize:12,fontWeight:600,color:C.text1}}>{assignedMember.name}</span>
                        <span style={{fontSize:10,color:C.text3,fontFamily:MONO,marginLeft:'auto'}}>{assignedMember.role}</span>
                      </div>
                    )}
                    <select value={ft.assignee||''} onChange={e=>set('assignee',parseInt(e.target.value)||null)} style={{...inputStyle,appearance:'none',cursor:'pointer',fontSize:13,padding:'9px 13px'}}>
                      <option value=''>— Unassigned —</option>
                      {members.map(m=><option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Due Date</label>
                    <input type='date' value={ft.due||''} onChange={e=>set('due',e.target.value)} style={inputStyle}/>
                    {ft.due&&<div style={{marginTop:6,fontSize:11,color:C.text3,fontFamily:MONO}}>📅 {new Date(ft.due).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>}
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div style={{background:'#fff',borderRadius:12,border:`1px solid ${C.border}`,padding:'16px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                <label style={labelStyle}>Observations / Findings</label>
                <textarea value={ft.obs||''} onChange={e=>set('obs',e.target.value)} placeholder='Enter your audit observations, findings, and notes here...' style={{...inputStyle,resize:'vertical',minHeight:100,lineHeight:1.6,border:`1px solid ${C.border}`}}/>
              </div>

              {/* Comments */}
              <div style={{background:'#fff',borderRadius:12,border:`1px solid ${C.border}`,padding:'16px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                <label style={labelStyle}>Comments</label>
                <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:14}}>
                  {(ft.comments||[]).length===0&&<div style={{fontSize:12.5,color:C.text3,padding:'12px 0',textAlign:'center',borderBottom:`1px dashed ${C.border}`}}>No comments yet. Be the first!</div>}
                  {(ft.comments||[]).map((c,i)=>(
                    <div key={i} style={{display:'flex',gap:10}}>
                      <div style={{width:30,height:30,borderRadius:'50%',background:AVATAR_COLORS[Math.abs((c.author||'').charCodeAt(0)-65)%AVATAR_COLORS.length],display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',flexShrink:0,marginTop:2}}>{c.initials}</div>
                      <div style={{flex:1,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 14px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                          <span style={{fontSize:12.5,fontWeight:700,color:C.text1}}>{c.author}</span>
                          <span style={{fontSize:10.5,color:C.text3,fontFamily:MONO}}>{c.time}</span>
                        </div>
                        <div style={{fontSize:13,color:C.text2,lineHeight:1.55}}>{c.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',gap:10,alignItems:'flex-end'}}>
                  <textarea value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder='Add a comment...' rows={2} style={{...inputStyle,flex:1,resize:'none',border:`1px solid ${C.border}`}}/>
                  <button onClick={addComment} style={{background:C.teal,color:'#fff',border:'none',padding:'10px 16px',borderRadius:9,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Sora,sans-serif',flexShrink:0}}>↑ Send</button>
                </div>
              </div>
            </div>
          )}

          {/* ════ FILES TAB ════ */}
          {drawerTab==='files'&&(
            <div style={{padding:'20px 26px',display:'flex',flexDirection:'column',gap:18}}>

              {/* Summary bar */}
              {docCount>0&&(
                <div style={{background:'#fff',borderRadius:12,border:`1px solid ${C.border}`,padding:'14px 18px',display:'flex',alignItems:'center',gap:16,flexWrap:'wrap',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:36,height:36,borderRadius:9,background:C.tealBg,border:`1px solid ${C.tealBorder}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>📁</div>
                    <div>
                      <div style={{fontSize:16,fontWeight:800,color:C.text1,fontFamily:MONO}}>{docCount}</div>
                      <div style={{fontSize:11,color:C.text3}}>Total files</div>
                    </div>
                  </div>
                  <div style={{width:1,height:32,background:C.border}}/>
                  {Object.entries(typeGroups).map(([type,count])=>(
                    <div key={type} style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{fontSize:14}}>{FILE_TYPES[Object.keys(FILE_TYPES).find(k=>FILE_TYPES[k].label===type)]?.icon||'📎'}</span>
                      <span style={{fontSize:12,color:C.text2,fontWeight:600}}>{count} {type}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload zone */}
              <div style={{background:'#fff',borderRadius:12,border:`1px solid ${C.border}`,padding:'16px 18px',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                <label style={labelStyle}>Upload Documents</label>
                <label style={{display:'block',border:`2px dashed ${C.tealBorder}`,borderRadius:12,padding:'28px 20px',textAlign:'center',cursor:'pointer',transition:'all .2s',background:C.tealBg}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.background='#e6faf7';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.tealBorder;e.currentTarget.style.background=C.tealBg;}}>
                  <div style={{fontSize:32,marginBottom:10}}>📎</div>
                  <div style={{fontSize:14,color:C.teal,fontWeight:700,marginBottom:4}}>Click to upload or drag & drop</div>
                  <div style={{fontSize:12,color:C.text3}}>PDF, Excel, Word, Images, CSV — any size</div>
                  <input ref={fileInputRef} type='file' multiple style={{display:'none'}} onChange={handleFileUpload}/>
                </label>
              </div>

              {/* Files grid */}
              {docCount===0?(
                <div style={{textAlign:'center',padding:'40px 20px',color:C.text3,background:'#fff',borderRadius:12,border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:40,marginBottom:10,opacity:.3}}>📂</div>
                  <div style={{fontSize:14,fontWeight:600,color:C.text2,marginBottom:4}}>No files attached yet</div>
                  <div style={{fontSize:12}}>Upload documents using the zone above</div>
                </div>
              ):(
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {(ft.docs||[]).map((doc,i)=>{
                    const ft2=getFileType(doc.name);
                    return(
                      <div key={i} style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',gap:14,boxShadow:'0 1px 3px rgba(0,0,0,0.04)',transition:'all .15s'}}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=ft2.border;e.currentTarget.style.boxShadow=`0 3px 12px ${ft2.border}88`;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';}}>
                        {/* File type icon block */}
                        <div style={{width:44,height:44,borderRadius:10,background:ft2.bg,border:`1px solid ${ft2.border}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,flexShrink:0}}>
                          <span style={{fontSize:18}}>{ft2.icon}</span>
                          <span style={{fontSize:8,fontFamily:MONO,fontWeight:700,color:ft2.color,textTransform:'uppercase',letterSpacing:'0.5px'}}>{ft2.label}</span>
                        </div>
                        {/* File info */}
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13.5,fontWeight:600,color:C.text1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{doc.name}</div>
                          <div style={{display:'flex',alignItems:'center',gap:10,marginTop:4,flexWrap:'wrap'}}>
                            <span style={{fontSize:11,color:C.text3,fontFamily:MONO}}>{doc.size||'—'}</span>
                            {doc.uploadedBy&&<>
                              <span style={{fontSize:11,color:C.border2}}>·</span>
                              <span style={{fontSize:11,color:C.text3}}>by {doc.uploadedBy}</span>
                            </>}
                            {doc.uploadedAt&&<>
                              <span style={{fontSize:11,color:C.border2}}>·</span>
                              <span style={{fontSize:11,color:C.text3,fontFamily:MONO}}>{doc.uploadedAt}</span>
                            </>}
                          </div>
                        </div>
                        {/* Actions */}
                        <div style={{display:'flex',gap:6,flexShrink:0}}>
                          <button title="Download" style={{width:30,height:30,borderRadius:7,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:13,color:C.text3,display:'flex',alignItems:'center',justifyContent:'center'}}>⬇</button>
                          <button onClick={()=>removeDoc(i)} title="Remove" style={{width:30,height:30,borderRadius:7,border:`1px solid ${C.redBorder}`,background:C.redBg,cursor:'pointer',fontSize:13,color:C.red,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div style={{padding:'16px 26px',borderTop:`1px solid ${C.border}`,display:'flex',gap:10,flexShrink:0,background:'#fff'}}>
          <button onClick={()=>{onSave(ft);setForm(null);}} style={{flex:1,background:C.teal,color:'#fff',border:'none',padding:'11px 16px',borderRadius:9,fontSize:13.5,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:`0 3px 14px ${C.teal}44`}}>✓ Save Changes</button>
          <button onClick={onClose} style={{background:'#fff',color:C.text2,border:`1px solid ${C.border2}`,padding:'11px 18px',borderRadius:9,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>Cancel</button>
        </div>
      </div>
    </>
  );
};

// ─── CSV IMPORT MODAL ─────────────────────────────────────────────────────────
// CSV Schema:
//   Column A: procedure   — Procedure / group name (blank = same as previous row)
//   Column B: step        — Audit step description (required)
//   Column C: risk        — high | medium | low  (optional, default: medium)
//   Column D: assignee_id — Member ID number (optional)
//   Column E: due         — YYYY-MM-DD (optional)
//
// Example rows:
//   procedure,step,risk,assignee_id,due
//   Policies & Procedures,Obtain copy of organization chart,high,2,2025-02-10
//   ,Verify POSH Committee constitution,medium,3,2025-02-12
//   Recruitment Process,Check manpower budget approval,high,3,2025-02-18

const SAMPLE_CSV = `procedure,step,risk,assignee_id,due
Policies & Procedures,Obtain copy of organisation chart and review delegation of duties.,high,2,2025-02-10
,Verify POSH Internal Committee is constituted as per law.,high,3,2025-02-12
,Check whistleblower / grievance redressal mechanism exists.,medium,2,2025-02-20
,Verify HR policies are approved by Board / Senior Management.,medium,4,2025-02-15
Recruitment Process,Check whether Manpower budget is approved and monitored.,medium,3,2025-02-18
,Verify recruitment is based on approved Manpower Requisition form.,medium,2,2025-02-18
,Confirm hiring is within approved salary band.,high,4,2025-02-20
Payroll & Compensation,Match salary payments with approved payroll output file.,high,10,2025-03-05
,Verify salary revision approvals and increments authorized.,high,,2025-03-10
,Check statutory deductions (PF ESI TDS) computed correctly.,high,,2025-03-12`;

// ─── SHEETJS LOADER ──────────────────────────────────────────────────────────
// Dynamically load SheetJS once, cache the promise
let _xlsxPromise = null;
function loadXLSX(){
  if(_xlsxPromise) return _xlsxPromise;
  _xlsxPromise = new Promise((resolve,reject)=>{
    if(window.XLSX){resolve(window.XLSX);return;}
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload=()=>resolve(window.XLSX);
    s.onerror=()=>reject(new Error('Failed to load SheetJS'));
    document.head.appendChild(s);
  });
  return _xlsxPromise;
}

// ─── PARSE ROWS → PROCEDURES ─────────────────────────────────────────────────
// Works on a 2D array of rows (already decoded, first row = header)
function buildProceduresFromRows(rows){
  // Skip header row — detect it by checking if first cell contains "procedure" or "step"
  let startIdx = 0;
  const firstRow = (rows[0]||[]).map(c=>String(c||'').toLowerCase().trim());
  if(firstRow.includes('procedure') || firstRow.includes('step') || firstRow.includes('audit step')){
    startIdx = 1; // skip header
  }
  // Also skip the description sub-row our Excel has (row 2 in the sheet, contains "Procedure / Group Name" etc.)
  const secondRow = (rows[startIdx]||[]).map(c=>String(c||'').toLowerCase().trim());
  if(secondRow[0] && (secondRow[0].includes('group') || secondRow[0].includes('blank') || secondRow[0].includes('procedure / group'))){
    startIdx++;
  }

  const procedures=[];
  let currentProc=null;
  let currentProcName='';
  let procCounter=1;

  for(let ri=startIdx; ri<rows.length; ri++){
    const row = rows[ri];
    if(!row || row.every(c=>!c && c!==0)) continue; // skip empty rows

    const procName  = String(row[0]||'').trim();
    const stepText  = String(row[1]||'').trim();
    const riskRaw   = String(row[2]||'').toLowerCase().trim();
    const risk      = ['high','medium','low'].includes(riskRaw) ? riskRaw : 'medium';
    const assigneeId= parseInt(row[3]) || null;
    const due       = String(row[4]||'').trim();

    if(!stepText) continue; // skip rows without a step

    // Skip if it looks like the description sub-header row from our Excel audit category
    if(stepText.toLowerCase().includes('audit step description') ||
       stepText.toLowerCase().includes('[required]') ||
       stepText.toLowerCase().startsWith('procedure')) continue;

    if(procName && procName !== currentProcName){
      // New procedure group
      currentProcName = procName;
      currentProc = {
        id: 'csv_p' + Date.now() + '_' + procCounter,
        name: procName,
        desc: '',
        steps: []
      };
      procedures.push(currentProc);
      procCounter++;
    } else if(!currentProc){
      currentProc = {
        id: 'csv_p' + Date.now() + '_' + (procCounter++),
        name: 'Imported Procedure',
        desc: '',
        steps: []
      };
      procedures.push(currentProc);
    }

    const stepNum = currentProc.steps.length + 1;
    const procIdx = procedures.indexOf(currentProc) + 1;
    const newStep = mkStep(
      `${procIdx}.${stepNum}`,
      stepText, 'todo', 'pending', risk, assigneeId, due, '', [], []
    );
    currentProc.steps.push(newStep);
  }
  return procedures;
}

// ─── PARSE CSV TEXT → ROWS ────────────────────────────────────────────────────
function parseCSVText(text){
  // Strip BOM if present (common in Excel-exported CSVs)
  const cleaned = text.replace(/^\uFEFF/, '').replace(/\r\n/g,'\n').replace(/\r/g,'\n');
  const lines = cleaned.split('\n');
  const rows = lines.map(line=>{
    const cols=[];
    let cur=''; let inQ=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(ch==='"'){
        if(inQ && line[i+1]==='"'){cur+='"';i++;} // escaped quote
        else{inQ=!inQ;}
      } else if(ch===','&&!inQ){cols.push(cur);cur='';}
      else{cur+=ch;}
    }
    cols.push(cur);
    return cols.map(c=>c.trim());
  });
  return buildProceduresFromRows(rows);
}

// ─── LEGACY ALIAS ─────────────────────────────────────────────────────────────
function parseCSV(text){ return parseCSVText(text); }

const ImportModal=({open,onClose,onImport,projectName,setProjectName})=>{
  const [csvText,setCsvText]=useState('');
  const [preview,setPreview]=useState(null);
  const [parseError,setParseError]=useState('');
  const [activeTab,setActiveTab]=useState('upload'); // upload | paste | schema
  const fileRef=useRef(null);

  const doPreview=text=>{
    try{
      const procs=parseCSV(text);
      if(!procs.length){setParseError('No valid rows found. Check format.');setPreview(null);return;}
      setPreview(procs);setParseError('');
    }catch(e){setParseError('Parse error: '+e.message);setPreview(null);}
  };

  const [loading,setLoading]=useState(false);

  const handleFile=async e=>{
    const f=e.target.files[0];if(!f)return;
    e.target.value='';
    const ext=f.name.split('.').pop().toLowerCase();
    setLoading(true);setParseError('');setPreview(null);

    try{
      if(ext==='xlsx'||ext==='xls'){
        // Use SheetJS to read Excel binary
        const XLSX=await loadXLSX();
        const buf=await f.arrayBuffer();
        const wb=XLSX.read(buf,{type:'array'});
        // Use the first sheet
        const wsName=wb.SheetNames[0];
        const ws=wb.Sheets[wsName];
        // Convert to 2D array — defval:'' ensures empty cells are ''
        const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',blankrows:false});
        const procs=buildProceduresFromRows(rows);
        if(!procs.length){setParseError('No valid rows found in Excel. Check the sheet matches the schema.');setLoading(false);return;}
        setPreview(procs);setParseError('');
      } else {
        // CSV — read as text with UTF-8, fallback to latin1 if garbled
        const readAs=(encoding)=>new Promise((res,rej)=>{
          const r=new FileReader();
          r.onload=ev=>res(ev.target.result);
          r.onerror=rej;
          r.readAsText(f,encoding);
        });
        let text=await readAs('utf-8');
        // If garbled (lots of replacement chars), retry with windows-1252
        const garbledCount=(text.match(/\uFFFD/g)||[]).length;
        if(garbledCount>5) text=await readAs('windows-1252');
        setCsvText(text);
        const procs=parseCSVText(text);
        if(!procs.length){setParseError('No valid rows found. Check format.');setLoading(false);return;}
        setPreview(procs);setParseError('');
      }
    }catch(err){
      setParseError('Error reading file: '+err.message);
    }
    setLoading(false);
  };

  const downloadSample=()=>{
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([SAMPLE_CSV],{type:'text/csv'}));
    a.download='AuditFlow_Import_Template.csv';a.click();
  };

  if(!open)return null;

  const tabBtn=(k,l)=>(
    <button key={k} onClick={()=>setActiveTab(k)} style={{padding:'8px 16px',borderRadius:8,fontSize:12.5,fontWeight:600,cursor:'pointer',border:'none',fontFamily:'Sora,sans-serif',color:activeTab===k?C.teal:C.text3,background:activeTab===k?C.tealBg:'transparent',borderBottom:activeTab===k?`2px solid ${C.teal}`:'2px solid transparent',transition:'all .15s'}}>{l}</button>
  );

  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.55)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)',padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:18,width:'100%',maxWidth:680,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,0.2)',animation:'slideUp .3s ease'}}>

        {/* Header */}
        <div style={{padding:'22px 26px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:C.text1,marginBottom:4}}>⬆ Import Audit Steps</div>
            <div style={{fontSize:12.5,color:C.text3}}>Upload a CSV/Excel file to automatically build procedures and audit steps</div>
          </div>
          <button onClick={onClose} style={{width:33,height:33,borderRadius:9,border:`1px solid ${C.border}`,background:C.bg2,cursor:'pointer',fontSize:16,color:C.text2,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,padding:'14px 26px 0',borderBottom:`1px solid ${C.border}`}}>
          {tabBtn('upload','📁 Upload File')}
          {tabBtn('paste','✏ Paste CSV')}
          {tabBtn('schema','📐 Schema Guide')}
        </div>

        <div style={{padding:'20px 26px',display:'flex',flexDirection:'column',gap:16}}>

          {activeTab==='upload'&&(
            <>
              <label style={{display:'block',border:`2px dashed ${C.tealBorder}`,borderRadius:14,padding:'32px 20px',textAlign:'center',cursor:'pointer',background:loading?'#e6faf7':C.tealBg,transition:'all .2s',opacity:loading?0.7:1}}
                onMouseEnter={e=>{if(!loading){e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.background='#e6faf7';}}}
                onMouseLeave={e=>{if(!loading){e.currentTarget.style.borderColor=C.tealBorder;e.currentTarget.style.background=C.tealBg;}}}>
                <div style={{fontSize:36,marginBottom:10}}>{loading?'⏳':'📂'}</div>
                <div style={{fontSize:15,fontWeight:700,color:C.teal,marginBottom:6}}>
                  {loading?'Reading file…':'Click to choose your file'}
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,flexWrap:'wrap',marginBottom:6}}>
                  {[['📊','Excel .xlsx',C.greenBg,C.green,C.greenBorder],['📈','Excel .xls',C.greenBg,C.green,C.greenBorder],['📋','CSV .csv',C.tealBg,C.teal,C.tealBorder]].map(([icon,label,bg,color,border])=>(
                    <span key={label} style={{fontSize:11,fontFamily:MONO,fontWeight:700,background:bg,color:color,border:`1px solid ${border}`,borderRadius:6,padding:'3px 9px',display:'inline-flex',alignItems:'center',gap:4}}>{icon} {label}</span>
                  ))}
                </div>
                <div style={{fontSize:11.5,color:C.text3,marginTop:4}}>Make sure your file follows the schema in the <strong>Schema Guide</strong> tab</div>
                <input ref={fileRef} type='file' accept='.csv,.xlsx,.xls' style={{display:'none'}} onChange={handleFile} disabled={loading}/>
              </label>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{flex:1,height:1,background:C.border}}/>
                <span style={{fontSize:12,color:C.text3,fontFamily:MONO}}>OR</span>
                <div style={{flex:1,height:1,background:C.border}}/>
              </div>
              <button onClick={downloadSample} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 18px',cursor:'pointer',fontFamily:'Sora,sans-serif',fontSize:13,fontWeight:600,color:C.text2,display:'flex',alignItems:'center',gap:10,justifyContent:'center'}}>
                ⬇ Download Sample CSV Template
                <span style={{fontSize:11,color:C.text3,fontFamily:MONO}}>with example procedures & steps</span>
              </button>
            </>
          )}

          {/* PASTE tab */}
          {activeTab==='paste'&&(
            <>
              <div style={{fontSize:12.5,color:C.text3,background:C.bg2,borderRadius:8,padding:'10px 14px',fontFamily:MONO,lineHeight:1.6}}>
                Format: <strong style={{color:C.text2}}>procedure,step,risk,assignee_id,due</strong><br/>
                Leave procedure blank to add to previous group. Risk: high/medium/low.
              </div>
              <textarea value={csvText} onChange={e=>{setCsvText(e.target.value);setPreview(null);setParseError('');}}
                placeholder={SAMPLE_CSV} rows={8}
                style={{background:'#fff',border:`1.5px solid ${C.border2}`,borderRadius:10,padding:'12px 14px',color:C.text1,fontSize:12.5,fontFamily:MONO,outline:'none',resize:'vertical',lineHeight:1.6}}/>
              <button onClick={()=>doPreview(csvText)} style={{background:C.teal,color:'#fff',border:'none',borderRadius:9,padding:'10px 18px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Sora,sans-serif',alignSelf:'flex-start'}}>
                👁 Preview Import
              </button>
            </>
          )}

          {/* SCHEMA tab */}
          {activeTab==='schema'&&(
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:10,padding:'14px 16px'}}>
                <div style={{fontSize:13,fontWeight:700,color:C.teal,marginBottom:8}}>📐 CSV Column Schema</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {[
                    {col:'A',name:'procedure',required:false,type:'Text',desc:'Group / procedure name. Leave blank to continue adding steps to the previous group.'},
                    {col:'B',name:'step',required:true,type:'Text',desc:'Full audit step description. Required — rows without this are skipped.'},
                    {col:'C',name:'risk',required:false,type:'high | medium | low',desc:'Risk rating for the step. Defaults to "medium" if blank or invalid.'},
                    {col:'D',name:'assignee_id',required:false,type:'Number',desc:'Team member ID to assign. Must match an existing member ID (1–10, etc.)'},
                    {col:'E',name:'due',required:false,type:'YYYY-MM-DD',desc:'Due date in ISO format. E.g. 2025-03-15. Leave blank if not set.'},
                  ].map(row=>(
                    <div key={row.col} style={{display:'flex',gap:12,padding:'10px 12px',background:'#fff',borderRadius:8,border:`1px solid ${C.border}`,alignItems:'flex-start'}}>
                      <span style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:'#fff',background:C.teal,borderRadius:5,padding:'2px 7px',flexShrink:0,marginTop:1}}>{row.col}</span>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                          <span style={{fontSize:13,fontWeight:700,color:C.text1,fontFamily:MONO}}>{row.name}</span>
                          <span style={{fontSize:10,fontFamily:MONO,padding:'1px 6px',borderRadius:4,background:row.required?C.redBg:C.bg2,color:row.required?C.red:C.text3,border:`1px solid ${row.required?C.redBorder:C.border}`}}>{row.required?'Required':'Optional'}</span>
                          <span style={{fontSize:10.5,color:C.text3,fontFamily:MONO}}>{row.type}</span>
                        </div>
                        <div style={{fontSize:12,color:C.text2,lineHeight:1.5}}>{row.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{background:C.bg2,borderRadius:10,padding:'14px 16px'}}>
                <div style={{fontSize:12.5,fontWeight:700,color:C.text1,marginBottom:8}}>Example CSV</div>
                <pre style={{fontSize:11.5,fontFamily:MONO,color:C.text2,lineHeight:1.7,overflowX:'auto',whiteSpace:'pre-wrap'}}>
{`procedure,step,risk,assignee_id,due
Policies & Procedures,Obtain org chart and review delegation.,high,2,2025-02-10
,Verify POSH Committee is constituted per law.,high,3,2025-02-12
,Check whistleblower mechanism exists.,medium,2,2025-02-20
Recruitment Process,Check Manpower budget is approved.,medium,3,2025-02-18
,Verify recruitment uses approved MRF form.,medium,2,2025-02-18`}
                </pre>
                <button onClick={downloadSample} style={{marginTop:10,background:'#fff',border:`1px solid ${C.border}`,borderRadius:8,padding:'8px 14px',cursor:'pointer',fontFamily:'Sora,sans-serif',fontSize:12.5,fontWeight:600,color:C.text2,display:'flex',alignItems:'center',gap:8}}>
                  ⬇ Download Full Sample Template
                </button>
              </div>
            </div>
          )}

          {/* Parse error */}
          {parseError&&(
            <div style={{background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:10,padding:'12px 16px',fontSize:13,color:C.red,display:'flex',alignItems:'center',gap:10}}>
              ❌ {parseError}
            </div>
          )}

          {/* Preview */}
          {preview&&(
            <div style={{background:'#fff',border:`1px solid ${C.tealBorder}`,borderRadius:12,overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
              <div style={{padding:'12px 16px',background:C.tealBg,borderBottom:`1px solid ${C.tealBorder}`,display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.teal}}>✅ Preview</span>
                <span style={{fontFamily:MONO,fontSize:11,color:C.teal}}>{preview.length} procedure{preview.length!==1?'s':''} · {preview.reduce((a,p)=>a+p.steps.length,0)} steps</span>
              </div>
              <div style={{maxHeight:260,overflowY:'auto'}}>
                {preview.map((proc,pi)=>(
                  <div key={pi}>
                    <div style={{padding:'10px 16px',background:'linear-gradient(90deg,#f0fdfa,#f8fafc)',borderLeft:`4px solid ${C.teal}`,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:C.teal,background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:5,padding:'1px 7px'}}>§{pi+1}</span>
                      <span style={{fontSize:13,fontWeight:700,color:C.text1}}>{proc.name}</span>
                      <span style={{fontSize:11,color:C.text3,marginLeft:'auto',fontFamily:MONO}}>{proc.steps.length} steps</span>
                    </div>
                    {proc.steps.map((s,si)=>(
                      <div key={si} style={{padding:'8px 16px 8px 32px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:10}}>
                        <span style={{fontFamily:MONO,fontSize:10.5,color:C.text3,minWidth:30}}>{s.id}</span>
                        <span style={{fontSize:12.5,color:C.text1,flex:1}}>{s.step.length>80?s.step.slice(0,80)+'…':s.step}</span>
                        <Badge map={RISK_MAP} val={s.risk} small/>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{padding:'16px 26px',borderTop:`1px solid ${C.border}`,display:'flex',gap:10,justifyContent:'flex-end',background:'#fff'}}>
          <button onClick={onClose} style={{background:'transparent',color:C.text2,border:`1px solid ${C.border2}`,padding:'9px 18px',borderRadius:9,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>Cancel</button>
          <button onClick={()=>{if(!preview||!preview.length)return;onImport(preview);onClose();}}
            disabled={!preview||!preview.length}
            style={{background:preview?.length?C.teal:'#94a3b8',color:'#fff',border:'none',padding:'9px 20px',borderRadius:9,fontSize:13,fontWeight:700,cursor:preview?.length?'pointer':'not-allowed',fontFamily:'Sora,sans-serif',boxShadow:preview?.length?`0 3px 12px ${C.teal}44`:'none',transition:'all .2s'}}>
            ⬆ Import {preview?.length?`${preview.reduce((a,p)=>a+p.steps.length,0)} Steps`:''}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── NEW PROJECT MODAL ────────────────────────────────────────────────────────
const NewProjectModal=({open,members,onClose,onCreate})=>{
  const [form,setForm]=useState({
    name:'',
    projectName:'',
    projectLeader:'',
    clientName:'',
    start:'',
    end:'',
    projectLength:'',
    coordinatorName:'',
    unit:'',
    type:'hr',
    status:'active',
    lead:'',
    desc:'',
  });
  const [showImport,setShowImport]=useState(false);
  const [importedProcedures,setImportedProcedures]=useState(null);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const inputStyle={background:'#fff',border:`1px solid ${C.border2}`,borderRadius:8,padding:'9px 13px',color:C.text1,fontSize:13.5,fontFamily:'Sora,sans-serif',outline:'none',width:'100%'};
  const labelStyle={fontSize:11,fontWeight:600,fontFamily:MONO,color:C.text3,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:6};
  if(!open)return null;
  const icons={hr:'👤',fin:'💰',inv:'📦',bil:'🧾',it:'💻',ops:'⚙️'};
  return(
    <>
      <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.5)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)'}}>
        <div onClick={e=>e.stopPropagation()} style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:16,width:560,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.15)',animation:'slideUp .3s ease'}}>
          <div style={{padding:'22px 24px 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:18,fontWeight:800,color:C.text1}}>Add Audited Company</div>
              <div style={{fontSize:12,color:C.text3,marginTop:3}}>Create a company workspace inside this audit category, then optionally import steps from CSV</div>
            </div>
            <button onClick={onClose} style={{width:32,height:32,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.text2,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
          </div>
          <div style={{padding:24,display:'flex',flexDirection:'column',gap:14}}>
            <div><label style={labelStyle}>Project Name *</label><input value={form.name} onChange={e=>set('name',e.target.value)} placeholder='e.g. HR Audit — Q1 2025' style={inputStyle}/></div>
            <div><label style={labelStyle}>Unit / Entity *</label><input value={form.unit} onChange={e=>set('unit',e.target.value)} placeholder='e.g. Lixil Window Systems Private Limited' style={inputStyle}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div><label style={labelStyle}>Project Leader</label>
                <select value={form.projectLeader} onChange={e=>set('projectLeader',e.target.value)} style={{...inputStyle,appearance:'none',cursor:'pointer'}}>
                  <option value=''>Select Project Leader from HRM Team</option>
                  {members.map(m=><option key={m.id} value={m.name}>{m.name} ({m.role || 'Employee'})</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Client&apos;s Name</label><input value={form.clientName} onChange={e=>set('clientName',e.target.value)} placeholder='e.g. PW Company' style={inputStyle}/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div><label style={labelStyle}>Audit Type</label>
                <select value={form.type} onChange={e=>set('type',e.target.value)} style={{...inputStyle,appearance:'none',cursor:'pointer'}}>
                  {[['hr','👤 Human Resources'],['fin','💰 Finance & Accounts'],['inv','📦 Inventory Management'],['bil','🧾 Billing & Collection'],['it','💻 IT & Systems'],['ops','⚙️ Operations']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Status</label>
                <select value={form.status} onChange={e=>set('status',e.target.value)} style={{...inputStyle,appearance:'none',cursor:'pointer'}}>
                  <option value='active'>Active</option><option value='review'>Under Review</option><option value='closed'>Closed</option>
                </select>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div><label style={labelStyle}>Start Date</label><input type='date' value={form.start} onChange={e=>set('start',e.target.value)} style={inputStyle}/></div>
              <div><label style={labelStyle}>End Date</label><input type='date' value={form.end} onChange={e=>set('end',e.target.value)} style={inputStyle}/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div><label style={labelStyle}>Project Length</label><input value={form.projectLength} onChange={e=>set('projectLength',e.target.value)} placeholder='e.g. 45 Days' style={inputStyle}/></div>
              <div><label style={labelStyle}>Audit Coordinator</label>
                <select value={form.coordinatorName} onChange={e=>set('coordinatorName',e.target.value)} style={{...inputStyle,appearance:'none',cursor:'pointer'}}>
                  <option value=''>Select Audit Coordinator from HRM Team</option>
                  {members.map(m=><option key={m.id} value={m.name}>{m.name} ({m.role || 'Employee'})</option>)}
                </select>
              </div>
            </div>
            <div><label style={labelStyle}>Lead Auditor</label>
              <select value={form.lead} onChange={e=>set('lead',e.target.value)} style={{...inputStyle,appearance:'none',cursor:'pointer'}}>
                <option value=''>— Select Lead Auditor —</option>
                {members.map(m=><option key={m.id} value={m.id}>{m.name} ({m.role || 'Employee'})</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Description</label>
              <textarea value={form.desc} onChange={e=>set('desc',e.target.value)} placeholder='Brief description of audit scope...' rows={2} style={{...inputStyle,resize:'vertical',lineHeight:1.5}}/>
            </div>

            {/* Import CSV section */}
            <div style={{borderRadius:12,border:`2px dashed ${importedProcedures?C.tealBorder:C.border}`,padding:'16px 18px',background:importedProcedures?C.tealBg:'#fafafa',transition:'all .2s'}}>
              {importedProcedures?(
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{fontSize:24}}>✅</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13.5,fontWeight:700,color:C.teal}}>Steps imported from CSV</div>
                    <div style={{fontSize:12,color:C.text2,marginTop:3}}>{importedProcedures.length} procedure{importedProcedures.length!==1?'s':''} · {importedProcedures.reduce((a,p)=>a+p.steps.length,0)} audit steps ready</div>
                  </div>
                  <button onClick={()=>setImportedProcedures(null)} style={{fontSize:12,color:C.red,cursor:'pointer',background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:7,padding:'4px 10px',fontFamily:'Sora,sans-serif',fontWeight:600}}>Remove</button>
                </div>
              ):(
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:13.5,fontWeight:600,color:C.text2,marginBottom:4}}>📂 Import Audit Steps from CSV / Excel</div>
                  <div style={{fontSize:12,color:C.text3,marginBottom:12}}>Skip manual entry — upload a pre-filled CSV to auto-create all procedures and steps</div>
                  <button onClick={()=>setShowImport(true)} style={{background:C.teal,color:'#fff',border:'none',borderRadius:8,padding:'9px 20px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:`0 3px 10px ${C.teal}44`}}>
                    ⬆ Upload CSV / Excel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div style={{padding:'0 24px 24px',display:'flex',gap:10,justifyContent:'flex-end'}}>
            <button onClick={onClose} style={{background:'transparent',color:C.text2,border:`1px solid ${C.border2}`,padding:'9px 16px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>Cancel</button>
            <button onClick={()=>onCreate(form,importedProcedures)} style={{background:C.teal,color:'#fff',border:'none',padding:'9px 20px',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:`0 3px 12px ${C.teal}44`}}>
              {icons[form.type]} Create Project →
            </button>
          </div>
        </div>
      </div>
      {showImport&&<ImportModal open={showImport} onClose={()=>setShowImport(false)} onImport={procs=>{setImportedProcedures(procs);setShowImport(false);}}/>}
    </>
  );
};

// ─── ADD MEMBER MODAL ─────────────────────────────────────────────────────────
const AddMemberModal=({open,onClose,onAdd})=>{
  const [form,setForm]=useState({name:'',role:'Auditor',email:''});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const inputStyle={background:'#fff',border:`1px solid ${C.border2}`,borderRadius:8,padding:'9px 13px',color:C.text1,fontSize:13.5,fontFamily:'Sora,sans-serif',outline:'none',width:'100%'};
  const labelStyle={fontSize:11,fontWeight:600,fontFamily:MONO,color:C.text3,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:6};
  if(!open)return null;
  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.5)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:16,width:440,boxShadow:'0 20px 60px rgba(0,0,0,0.15)'}}>
        <div style={{padding:'22px 24px 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:18,fontWeight:700,color:C.text1}}>Add Team Member</div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.text2}}>✕</button>
        </div>
        <div style={{padding:24,display:'flex',flexDirection:'column',gap:14}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div><label style={labelStyle}>Full Name</label><input value={form.name} onChange={e=>set('name',e.target.value)} placeholder='e.g. Priya Sharma' style={inputStyle}/></div>
            <div><label style={labelStyle}>Role</label>
              <select value={form.role} onChange={e=>set('role',e.target.value)} style={{...inputStyle,appearance:'none',cursor:'pointer'}}>
                <option>Admin</option><option>Auditor</option><option>Reviewer</option>
              </select>
            </div>
          </div>
          <div><label style={labelStyle}>Email</label><input type='email' value={form.email} onChange={e=>set('email',e.target.value)} placeholder='email@lixil.com' style={inputStyle}/></div>
        </div>
        <div style={{padding:'0 24px 24px',display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{background:'transparent',color:C.text2,border:`1px solid ${C.border2}`,padding:'9px 16px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>Cancel</button>
          <button onClick={()=>onAdd(form)} style={{background:C.teal,color:'#fff',border:'none',padding:'9px 18px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>Add Member</button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function AuditFlow() {
  const [platformMode, setPlatformMode] = useState("selection"); // "selection" | "dynamic" | "classic"
  const [view, setView] = useState('templates');
  const [projects, setProjects] = useState(INIT_PROJECTS.slice(0, 1).map(project => ({ ...project, templateId: 'hr-auditing' })));
  const [auditMembers, setAuditMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState('');
  const [members, setMembers] = useState(INIT_MEMBERS);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [currentProjId, setCurrentProjId] = useState(null);
  const [activeTab, setActiveTab] = useState('table');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTask, setDrawerTask] = useState(null);
  const [drawerProcIdx, setDrawerProcIdx] = useState(null);
  const [drawerStepIdx, setDrawerStepIdx] = useState(null);
  const [newProjModal, setNewProjModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [search, setSearch] = useState('');
  const { toasts, show: showToast } = useToast();

  useEffect(() => {
    let active = true;
    const loadAuditMembers = async () => {
      try {
        setMembersLoading(true);
        setMembersError('');
        const response = await fetch('/Auditing/api/team', { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to load team members.');
        if (!active) return;
        const fetchedMembers = Array.isArray(result.members) ? result.members : [];
        setAuditMembers(fetchedMembers);
        setMembers(fetchedMembers);
      } catch (error) {
        if (!active) return;
        setMembersError(error.message || 'Failed to load team members.');
      } finally {
        if (active) setMembersLoading(false);
      }
    };
    loadAuditMembers();
    return () => {
      active = false;
    };
  }, []);

  const selectedTemplate = AUDIT_TEMPLATES.find(t => t.id === selectedTemplateId) || null;
  const isPdplTemplate = selectedTemplateId === 'pdpl-template';
  const isCstTemplate = selectedTemplateId === 'cst-audit-template';
  const isSaudiTemplate = selectedTemplateId === 'saudi-audit-template';
  const isStaticTrackerTemplate = selectedTemplateId === 'static-audit-template';
  const templateProjects = selectedTemplateId ? projects.filter(p => p.templateId === selectedTemplateId) : [];
  const backToTemplateLibrary = () => { setSelectedTemplateId(null); setCurrentProjId(null); setView('templates'); setSearch(''); };
  const currentProj = projects.find(p => p.id === currentProjId);

  const openProject = id => { setCurrentProjId(id); setView('project'); setActiveTab('table'); };
  const openTemplate = templateId => { setSelectedTemplateId(templateId); setCurrentProjId(null); setView('dashboard'); setSearch(''); };

  const openTask = (pi, si) => {
    const s = currentProj.procedures[pi].steps[si];
    setDrawerProcIdx(pi); setDrawerStepIdx(si);
    setDrawerTask({ ...s, docs: [...(s.docs || [])], comments: [...(s.comments || [])] });
    setDrawerOpen(true);
  };

  const saveTask = updated => {
    setProjects(ps => ps.map(p => {
      if (p.id !== currentProjId) return p;
      return { ...p, procedures: p.procedures.map((proc, pi) => pi !== drawerProcIdx ? proc : { ...proc, steps: proc.steps.map((s, si) => si === drawerStepIdx ? { ...s, ...updated } : s) }) };
    }));
    setDrawerOpen(false);
    showToast('success', 'Step saved successfully');
  };

  const addStep = pi => {
    setProjects(ps => ps.map(p => {
      if (p.id !== currentProjId) return p;
      const proc = p.procedures[pi];
      const parts = (proc.steps.length ? proc.steps[proc.steps.length - 1].id : pi + 1 + '.0').split('.');
      const newId = parts[0] + '.' + (parseInt(parts[1] || 0) + 1);
      const newStep = { ...mkStep(newId, 'New audit step — click to edit', 'todo', 'pending', 'medium', null, '', ''), docs: [], comments: [] };
      return { ...p, procedures: p.procedures.map((pr, i) => i === pi ? { ...pr, steps: [...pr.steps, newStep] } : pr) };
    }));
    showToast('info', 'New step added — click to edit');
  };

  const deleteStep = (pi, si) => {
    if (!window.confirm('Delete this audit step?')) return;
    setProjects(ps => ps.map(p => {
      if (p.id !== currentProjId) return p;
      return { ...p, procedures: p.procedures.map((proc, i) => i === pi ? { ...proc, steps: proc.steps.filter((_, j) => j !== si) } : proc) };
    }));
    showToast('success', 'Step deleted');
  };

  const createProject = (form, importedProcedures) => {
    const projectName = form.projectName || form.name;
    const clientName = form.clientName || form.unit;
    if (!selectedTemplateId) { showToast('error', 'Select an audit category first'); return; }
    if (!projectName || !clientName) { showToast('error', 'Project name and client name are required'); return; }
    const icons = { hr: '👤', fin: '💰', inv: '📦', bil: '🧾', it: '💻', ops: '⚙️' };
    const procs = importedProcedures || [];
    setProjects(ps => [{
      id: Date.now(),
      templateId: selectedTemplateId,
      name: projectName,
      unit: form.unit || clientName,
      clientName,
      projectLeader: form.projectLeader || '',
      projectLength: form.projectLength || '',
      coordinatorName: form.coordinatorName || '',
      type: form.type,
      icon: icons[form.type] || '??',
      status: form.status,
      start: form.start,
      end: form.end,
      lead: parseInt(form.lead) || null,
      desc: form.desc || `${selectedTemplate?.name || 'Audit'} engagement for ${clientName}`,
      procedures: procs
    }, ...ps]);
    setNewProjModal(false);
    const msg = procs.length ? `Company workspace created with ${procs.length} procedures and ${procs.reduce((a, p) => a + p.steps.length, 0)} steps from CSV` : 'Company workspace created successfully';
    showToast('success', msg);
  };

  const addMember = form => {
    if (!form.name) { showToast('error', 'Name is required'); return; }
    const initials = form.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    setMembers(ms => [...ms, { id: ms.length + 1, name: form.name, role: form.role, email: form.email, initials }]);
    setAddMemberModal(false);
    showToast('success', `${form.name} added to team`);
  };

  const importToCurrent = procs => {
    setProjects(ps => ps.map(p => {
      if (p.id !== currentProjId) return p;
      return { ...p, procedures: [...p.procedures, ...procs] };
    }));
    showToast('success', `Imported ${procs.length} procedures (${procs.reduce((a, p) => a + p.steps.length, 0)} steps)`);
  };

  const exportCurrentProject = () => {
    if (!currentProj) return;
    let csv = 'Ref,Audit Step,Status,AQC,Risk,Assigned To,Due Date,Observations,Files\n';
    currentProj.procedures.forEach(proc => {
      csv += `"PROCEDURE: ${proc.name}",,,,,,,,\n`;
      proc.steps.forEach(s => {
        const m = s.assignee ? members.find(t => t.id === s.assignee) : null;
        const fileNames = (s.docs || []).map(d => d.name).join(' | ');
        csv += `"${s.id}","${s.step.replace(/"/g, '""')}","${s.status}","${s.aqc}","${s.risk}","${m ? m.name : 'Unassigned'}","${s.due || ''}","${(s.obs || '').replace(/"/g, '""')}","${fileNames}"\n`;
      });
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${currentProj.name.replace(/ /g, '_')}_Audit.csv`; a.click();
    showToast('success', 'Export downloaded');
  };

  const filteredProjects = templateProjects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.unit.toLowerCase().includes(search.toLowerCase()) || String(p.clientName || '').toLowerCase().includes(search.toLowerCase()));
  const allSteps = templateProjects.flatMap(p => getProjectSteps(p));
  const inProgress = allSteps.filter(s => s.status === 'progress').length;
  const done = allSteps.filter(s => s.status === 'done').length;
  const totalDocs = allSteps.reduce((a, s) => a + (s.docs || []).length, 0);

  const topbarStyle = { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderBottom: `1px solid ${C.border}`, background: '#fff', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };

  // ════════════════════════════════════════════════════════════════════════════
  // 1. SELECTION SCREEN (EDITORIAL PREMIUM PLATFORM SELECTOR)
  // ════════════════════════════════════════════════════════════════════════════
  if (platformMode === "selection") {
    return (
      <div style={{
        height: "100vh",
        maxHeight: "100vh",
        overflowY: "auto",
        background: "radial-gradient(120% 85% at 50% 0%, #FFFFFF 0%, #F5F5F7 55%, #E8E8ED 100%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif",
        padding: "20px 28px 32px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        position: "relative"
      }}>
        <FontLink />
        
        {/* Soft Liquid Ambient Glow Orbs */}
        <div style={{ position: "absolute", top: -80, left: "20%", width: 500, height: 500, background: "radial-gradient(circle, rgba(0, 113, 227, 0.08) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 140, right: "15%", width: 450, height: 450, background: "radial-gradient(circle, rgba(52, 199, 89, 0.06) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        {/* Top Right Home Navigation button */}
        <div style={{ position: "absolute", top: 24, right: 32, zIndex: 10 }}>
          <Link
            href="/other-modules"
            className="apple-click"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0 18px",
              height: 38,
              borderRadius: 980,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid #D2D2D7",
              color: "#1D1D1F",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.borderColor = "#0071E3"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; e.currentTarget.style.borderColor = "#D2D2D7"; }}
          >
            <Home size={14} color="#1D1D1F" />
            <span>Other Modules</span>
          </Link>
        </div>

        <div style={{ maxWidth: 880, margin: "0 auto", width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", zIndex: 2 }}>

          {/* Header with Universe One • Audit Flow pill badge & SF Pro Headline */}
          <div style={{ textAlign: "center", margin: "46px 0 0" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 18px",
              borderRadius: 980,
              backgroundColor: "rgba(255, 255, 255, 0.82)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid #D2D2D7",
              color: "#6E6E73",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
            }}>
              <span style={{ color: "#1D1D1F" }}>Universe One</span>
              <span style={{ color: "#D2D2D7" }}>•</span>
              <span style={{ color: "#0071E3" }}>Audit Flow</span>
            </div>
            
            <h1 style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              fontSize: "44px",
              fontWeight: 600,
              color: "#1D1D1F",
              letterSpacing: "-0.025em",
              margin: 0,
              lineHeight: 1.12
            }}>
              Select Auditing Environment
            </h1>
            <p style={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#86868B",
              letterSpacing: "-0.01em",
              marginTop: 10,
              marginBottom: 0
            }}>
              Choose your auditing workspace to begin continuous monitoring or framework verification.
            </p>
          </div>

          {/* 2 Choice Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 28, marginTop: 42, marginBottom: 20 }}>
            
            {/* CARD 1: DYNAMIC AUDIT PLATFORM (LIQUID APPLE PRO DARK GLASS) */}
            <div
              onClick={() => setPlatformMode("dynamic")}
              className="apple-click"
              style={{
                background: "linear-gradient(150deg, rgba(29, 29, 31, 0.95) 0%, rgba(18, 18, 20, 0.98) 100%)",
                backdropFilter: "blur(32px) saturate(180%)",
                WebkitBackdropFilter: "blur(32px) saturate(180%)",
                borderRadius: 22,
                padding: "32px 32px 28px",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 18px 44px -10px rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.16)",
                transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                overflow: "hidden"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.008)";
                e.currentTarget.style.borderColor = "rgba(0, 113, 227, 0.6)";
                e.currentTarget.style.boxShadow = "0 28px 56px -12px rgba(0, 113, 227, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)";
                const btn = e.currentTarget.querySelector(".circle-arrow-btn");
                if (btn) { btn.style.transform = "translateX(4px) scale(1.08)"; btn.style.backgroundColor = "#0076DF"; }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.14)";
                e.currentTarget.style.boxShadow = "0 18px 44px -10px rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.16)";
                const btn = e.currentTarget.querySelector(".circle-arrow-btn");
                if (btn) { btn.style.transform = "none"; btn.style.backgroundColor = "#0071E3"; }
              }}
            >
              {/* Subtle specular sheen */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 100%)", pointerEvents: "none" }} />
              
              {/* Top Row: Number 01 & Center Circular Icon Ring */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#0071E3", letterSpacing: "-0.03em" }}>
                  01
                </div>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "rgba(0, 113, 227, 0.16)",
                  border: "1.5px solid rgba(0, 113, 227, 0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(0, 113, 227, 0.2)"
                }}>
                  <Sparkles size={22} color="#0071E3" />
                </div>
                <div style={{ width: 28 }} />
              </div>

              {/* Title */}
              <h2 style={{ fontSize: 21, fontWeight: 600, color: "#FFFFFF", textAlign: "center", margin: "8px 0 16px", letterSpacing: "-0.02em" }}>
                Dynamic Audit Platform
              </h2>

              {/* Hairline Divider */}
              <div style={{ width: "100%", height: 1, backgroundColor: "rgba(255, 255, 255, 0.12)", marginBottom: 18 }} />

              {/* Subpoints List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 24, flex: 1, paddingLeft: 8 }}>
                {[
                  { icon: <Calendar size={14} />, title: "Pre-Execution Schedule" },
                  { icon: <Mail size={14} />, title: "Automated Client Email Pipeline" },
                  { icon: <UploadCloud size={14} />, title: "Live Client IDR Portal" },
                  { icon: <CheckSquare size={14} />, title: "Audit Testing Engine" },
                  { icon: <MessageSquare size={14} />, title: "Resolution Tracker" },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 13.5, fontWeight: 500, color: "rgba(255, 255, 255, 0.9)" }}>
                    <span style={{ display: "inline-flex", color: "#0071E3", filter: "drop-shadow(0 0 6px rgba(0, 113, 227, 0.4))" }}>{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Row Action Button */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#86868B" }}>Launch Workspace</span>
                <div
                  className="circle-arrow-btn"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    backgroundColor: "#0071E3",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(0, 113, 227, 0.4)",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>

            {/* CARD 2: STATIC AUDIT PLATFORM (LIQUID APPLE PURE WHITE GLASS) */}
            <div
              onClick={() => { setPlatformMode("classic"); setView("templates"); }}
              className="apple-click"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(32px) saturate(180%)",
                WebkitBackdropFilter: "blur(32px) saturate(180%)",
                borderRadius: 22,
                border: "1px solid #D2D2D7",
                padding: "32px 32px 28px",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.05), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95)",
                transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                overflow: "hidden"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.008)";
                e.currentTarget.style.borderColor = "#0071E3";
                e.currentTarget.style.boxShadow = "0 24px 50px -10px rgba(0, 113, 227, 0.16), inset 0 1px 1px 0 rgba(255, 255, 255, 0.98)";
                const btn = e.currentTarget.querySelector(".circle-arrow-btn");
                if (btn) { btn.style.transform = "translateX(4px) scale(1.08)"; btn.style.backgroundColor = "#0071E3"; }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = "#D2D2D7";
                e.currentTarget.style.boxShadow = "0 12px 32px -8px rgba(0, 0, 0, 0.05), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95)";
                const btn = e.currentTarget.querySelector(".circle-arrow-btn");
                if (btn) { btn.style.transform = "none"; btn.style.backgroundColor = "#1D1D1F"; }
              }}
            >
              {/* Specular sheen */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, transparent 100%)", pointerEvents: "none" }} />

              {/* Top Row: Number 02 & Center Circular Icon Ring */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#1D1D1F", letterSpacing: "-0.03em" }}>
                  02
                </div>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "rgba(0, 113, 227, 0.08)",
                  border: "1.5px solid rgba(0, 113, 227, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Layers size={22} color="#0071E3" />
                </div>
                <div style={{ width: 28 }} />
              </div>

              {/* Title */}
              <h2 style={{ fontSize: 21, fontWeight: 600, color: "#1D1D1F", textAlign: "center", margin: "8px 0 16px", letterSpacing: "-0.02em" }}>
                Static Audit platform
              </h2>

              {/* Hairline Divider */}
              <div style={{ width: "100%", height: 1, backgroundColor: "#E5E5EA", marginBottom: 18 }} />

              {/* Subpoints List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 24, flex: 1, paddingLeft: 8 }}>
                {[
                  { icon: <Users size={14} />, title: "HR Audit Framework" },
                  { icon: <Shield size={14} />, title: "PDPL Compliance Matrix" },
                  { icon: <Clock size={14} />, title: "CST Gantt Execution" },
                  { icon: <FileText size={14} />, title: "Saudi Master RCM" },
                  { icon: <Layers size={14} />, title: "Isolated Categories" },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 13.5, fontWeight: 500, color: "#424245" }}>
                    <span style={{ display: "inline-flex", color: "#0071E3" }}>{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Row Action Button */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#86868B" }}>Open Frameworks</span>
                <div
                  className="circle-arrow-btn"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    backgroundColor: "#1D1D1F",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 2. DYNAMIC SAAS WORKSPACE (NEW PLATFORM)
  // ════════════════════════════════════════════════════════════════════════════
  if (platformMode === "dynamic") {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.bg, fontFamily: 'Sora,sans-serif' }}>
        <FontLink />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DynamicSaaSWorkspace onBackToTemplates={() => setPlatformMode('selection')} />
        </main>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 3. CLASSIC AUDITFLOW (ORIGINAL PLATFORM & WORKSPACES WITHOUT SIDEBAR)
  // ════════════════════════════════════════════════════════════════════════════
  if (isPdplTemplate) {
    return (
      <PdplWorkspace
        selectedTemplate={selectedTemplate}
        projects={projects}
        setProjects={setProjects}
        auditMembers={auditMembers}
        search={search}
        setSearch={setSearch}
        showToast={showToast}
        onBackToTemplates={backToTemplateLibrary}
      />
    );
  }
  if (isCstTemplate) {
    return (
      <CstAuditWorkspace
        selectedTemplate={selectedTemplate}
        projects={projects}
        setProjects={setProjects}
        auditMembers={auditMembers}
        search={search}
        setSearch={setSearch}
        showToast={showToast}
        onBackToTemplates={backToTemplateLibrary}
      />
    );
  }
  if (isSaudiTemplate) {
    return (
      <SaudiAuditWorkspace
        selectedTemplate={selectedTemplate}
        projects={projects}
        setProjects={setProjects}
        auditMembers={auditMembers}
        search={search}
        setSearch={setSearch}
        showToast={showToast}
        onBackToTemplates={backToTemplateLibrary}
      />
    );
  }
  if (isStaticTrackerTemplate) {
    return (
      <StaticTrackerWorkspace
        onBackToTemplates={backToTemplateLibrary}
        showToast={showToast}
      />
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
      <FontLink />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── TOP PLATFORM SWITCHER BANNER ── */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "12px 40px",
          flexShrink: 0,
          boxShadow: "0 1px 8px rgba(0,0,0,0.03)"
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,113,227,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldCheck size={18} color={C.blue} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.text1, letterSpacing: "-0.015em" }}>AuditFlow</div>
                <div style={{ fontSize: 11, color: C.text2, letterSpacing: "-0.01em" }}>Static Audit Platform • Universe One</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setPlatformMode("selection")}
                title="Switch between Dynamic SaaS & Classic Templates"
                className="apple-click"
                style={{
                  padding: "7px 16px",
                  borderRadius: 980,
                  border: `1px solid ${C.border}`,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  color: C.text1,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.borderColor = C.blue; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = C.border; }}
              >
                ⇄ Switch Platform
              </button>
            </div>
          </div>
        </div>

        {/* ── TEMPLATES GRID VIEW ── */}
        {view === 'templates' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '40px 40px 60px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.blue, marginBottom: 6 }}>Framework Library</div>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: C.text1, letterSpacing: '-0.03em', margin: 0, marginBottom: 8 }}>Audit Categories & Templates</h1>
                <div style={{ fontSize: 15, color: C.text2, letterSpacing: '-0.01em' }}>Select an enterprise compliance framework to launch its dedicated workspace.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
                {AUDIT_TEMPLATES.map(template => (
                  <TemplateCard key={template.id} template={template} onClick={() => openTemplate(template.id)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── DASHBOARD VIEW ── */}
        {view === 'dashboard' && selectedTemplate && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 50px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={backToTemplateLibrary} className="apple-click" style={{ border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.8)', color: C.text1, borderRadius: 980, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' }}>
                    ← Categories
                  </button>
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text1, letterSpacing: '-0.02em', margin: 0 }}>
                      {selectedTemplate.name} Workspace
                    </h2>
                    <div style={{ fontSize: 12, color: C.text2, marginTop: 2 }}>{selectedTemplate.category || 'Compliance'} Framework</div>
                  </div>
                </div>
                <button onClick={() => setNewProjModal(true)} className="apple-click" style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: 980, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 4px 14px ${C.blue}40`, transition: 'all 0.15s ease' }}>
                  ＋ Add Company Workspace
                </button>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 32 }}>
                <StatCard icon="📁" value={templateProjects.length} label="Active Companies" change={`${templateProjects.length} configured`} changeType="up" accent={C.blue} />
                <StatCard icon="📋" value={allSteps.length} label="Total Audit Steps" change={`${done} completed`} changeType="up" accent={C.emerald} />
                <StatCard icon="⏳" value={inProgress} label="In Progress Steps" change={`${allSteps.length - done - inProgress} pending`} changeType="down" accent={C.amber} />
                <StatCard icon="📎" value={totalDocs} label="Attached Evidence" change="Files tracked" changeType="up" accent={C.purple} />
              </div>

              {/* Projects list */}
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text1, letterSpacing: '-0.02em', marginBottom: 16 }}>
                Company Workspaces ({filteredProjects.length})
              </div>
              {filteredProjects.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${C.border}`, color: C.text3 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text1 }}>No company workspaces found</div>
                  <div style={{ fontSize: 13, marginTop: 4, color: C.text2 }}>Click "+ Add Company Workspace" to initialize your first audit project.</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                  {filteredProjects.map(p => (
                    <ProjectCard key={p.id} project={p} members={members} onClick={() => openProject(p.id)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PROJECT DETAILS / TABLE / KANBAN VIEW ── */}
        {view === 'project' && currentProj && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={{
              ...topbarStyle,
              backgroundColor: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: `1px solid ${C.border}`,
              padding: "12px 32px"
            }}>
              <button onClick={() => setView('dashboard')} className="apple-click" style={{ border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.8)', color: C.text1, borderRadius: 980, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                ← Projects
              </button>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.text1, letterSpacing: '-0.015em' }}>
                {currentProj.icon} {currentProj.name}
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button onClick={() => setActiveTab('table')} className="apple-click" style={{ padding: '6px 16px', borderRadius: 980, border: `1px solid ${activeTab === 'table' ? C.blue : C.border}`, background: activeTab === 'table' ? C.blueBg : '#fff', color: activeTab === 'table' ? C.blue : C.text2, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  📋 Table
                </button>
                <button onClick={() => setActiveTab('kanban')} className="apple-click" style={{ padding: '6px 16px', borderRadius: 980, border: `1px solid ${activeTab === 'kanban' ? C.blue : C.border}`, background: activeTab === 'kanban' ? C.blueBg : '#fff', color: activeTab === 'kanban' ? C.blue : C.text2, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  📊 Kanban
                </button>
                <button onClick={() => setImportModal(true)} className="apple-click" style={{ padding: '6px 16px', borderRadius: 980, border: `1px solid ${C.blueBorder}`, background: C.blueBg, color: C.blue, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  ⬆ Import CSV
                </button>
                <button onClick={exportCurrentProject} className="apple-click" style={{ padding: '6px 16px', borderRadius: 980, border: `1px solid ${C.border}`, background: '#fff', color: C.text2, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  ⬇ Export CSV
                </button>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 20 }}>
              {activeTab === 'table' && (
                <TableView
                  project={currentProj}
                  members={members}
                  onOpenTask={openTask}
                  onAddStep={addStep}
                  onDeleteStep={deleteStep}
                  onRenameProcedure={(pi, patch) => {
                    setProjects(ps => ps.map(p => {
                      if (p.id !== currentProjId) return p;
                      return { ...p, procedures: p.procedures.map((proc, i) => i === pi ? { ...proc, ...patch } : proc) };
                    }));
                  }}
                />
              )}
              {activeTab === 'kanban' && <KanbanView project={currentProj} members={members} onOpenTask={openTask} />}
            </div>
          </div>
        )}

        {/* ── TEAM VIEW ── */}
        {view === 'team' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={{ ...topbarStyle, padding: '18px 28px' }}>
              <button onClick={() => setView('dashboard')} style={{ border: `1px solid ${C.border}`, background: '#fff', color: C.text2, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                ← Back
              </button>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.text1 }}>Team Members</div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
              <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: C.bg2, color: C.text3, textAlign: 'left', textTransform: 'uppercase', fontSize: 11, fontFamily: MONO }}>
                      <th style={{ padding: '12px 16px' }}>Employee</th>
                      <th style={{ padding: '12px 16px' }}>Role</th>
                      <th style={{ padding: '12px 16px' }}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar member={m} size={30} />
                          <span style={{ fontWeight: 700, color: C.text1 }}>{m.name}</span>
                        </td>
                        <td style={{ padding: '12px 16px', color: C.text2 }}>{m.role || 'Auditor'}</td>
                        <td style={{ padding: '12px 16px', color: C.text3, fontFamily: MONO }}>{m.email || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── MY TASKS VIEW ── */}
        {view === 'my-tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={topbarStyle}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.text1 }}>Tasks Assigned to Me</div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 32, textAlign: 'center', color: C.text3 }}>
                All tasks assigned to you appear in real-time under individual project workspaces.
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Task Drawer */}
      {currentProj && <TaskDrawer open={drawerOpen} task={drawerTask} procName={currentProj.procedures[drawerProcIdx]?.name || ''} members={members} onClose={() => setDrawerOpen(false)} onSave={saveTask} />}

      {/* Import Modal */}
      {importModal && <ImportModal open={importModal} onClose={() => setImportModal(false)} onImport={importToCurrent} />}

      {/* Modals */}
      <NewProjectModal open={newProjModal} members={members} onClose={() => setNewProjModal(false)} onCreate={createProject} />
      <AddMemberModal open={addMemberModal} onClose={() => setAddMemberModal(false)} onAdd={addMember} />
      <ToastContainer toasts={toasts} />
    </div>
  );
}











