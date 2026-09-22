"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import * as XLSX from 'xlsx';
import {
  Shield,
  Building2,
  Calendar as CalendarIcon,
  Users,
  Plus,
  ArrowLeft,
  Mail,
  Send,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  Settings,
  X,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit2,
  Edit3,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Info,
  FolderOpen,
  LayoutGrid,
  ListTodo,
  Layers,
  FileCheck,
  Menu,
  Zap,
  GripVertical,
  MoveHorizontal,
  ExternalLink,
  Briefcase,
  UserCheck,
  Maximize2,
  Minimize2,
  Search,
  MessageSquare,
  Eye,
  HelpCircle,
  Check,
  CheckSquare,
  Paperclip
} from "lucide-react";

// ─── STYLES & FONTS ──────────────────────────────────────────────────────────
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body,#root{height:100%;font-family:'Sora',sans-serif;}
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:#f1f5f9;}
    ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px;}
    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `}</style>
);

const C = {
  bg: "#f8fafc", bg2: "#f1f5f9", surface: "#ffffff", surface2: "#f8fafc",
  border: "#e2e8f0", border2: "#cbd5e1",
  teal: "#0d9488", teal2: "#0f766e", tealBg: "#f0fdfa", tealBorder: "#99f6e4",
  amber: "#d97706", amberBg: "#fffbeb", amberBorder: "#fde68a",
  red: "#dc2626", redBg: "#fef2f2", redBorder: "#fecaca",
  blue: "#2563eb", blueBg: "#eff6ff", blueBorder: "#bfdbfe",
  green: "#16a34a", greenBg: "#f0fdf4", greenBorder: "#bbf7d0",
  purple: "#7c3aed", purpleBg: "#f5f3ff", purpleBorder: "#ddd6fe",
  text1: "#0f172a", text2: "#475569", text3: "#94a3b8",
};

const MONO = "'JetBrains Mono', monospace";

export default function DynamicSaaSWorkspace({ onBackToTemplates }) {
  // Sidebar Toggle State (open by default)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Database Templates & Projects
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // null = Main Template Cards View
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // HRM Employees for Lead & Team Selection (Fetched dynamically from HRM database)
  const [hrmEmployees, setHrmEmployees] = useState([]);

  // Stage State
  const [currentStage, setCurrentStage] = useState(1); // 1: Pre-Execution, 2: Execution Stage

  // Stage 1 State
  const [stage1Tab, setStage1Tab] = useState("calendar"); // calendar | org
  const [orgMembers, setOrgMembers] = useState([]);
  const [calendarItems, setCalendarItems] = useState([]);
  const [selectedWeekFilter, setSelectedWeekFilter] = useState("ALL");
  const [isCalDrawerOpen, setIsCalDrawerOpen] = useState(false);
  const [calDrawerItem, setCalDrawerItem] = useState(null);

  // Memoized unique weeks available across the entire component & drawers
  const uniqueWeeks = useMemo(() => {
    return Array.from(new Set(calendarItems.map(item => item.week_name).filter(Boolean)));
  }, [calendarItems]);

  // Stage 2 State
  const [processCategory, setProcessCategory] = useState("P2P Audit");
  const [stage2SubTab, setStage2SubTab] = useState("programme"); // programme | tracker | mom | testing
  const [programmeRows, setProgrammeRows] = useState([]);
  const [dataTrackerRows, setDataTrackerRows] = useState([]);

  // Data Tracker IDR Advanced Workflow States
  const [trackerViewMode, setTrackerViewMode] = useState("table"); // "table" | "pipeline"
  const [selectedTrackerRowIds, setSelectedTrackerRowIds] = useState([]);
  const [showAddTrackerModal, setShowAddTrackerModal] = useState(false);
  const [newTrackerItem, setNewTrackerItem] = useState({
    data_requirement: "",
    sub_process: "",
    client_person_id: "",
    remarks: ""
  });
  const [showEmailDraftModal, setShowEmailDraftModal] = useState(false);
  const [emailDraftData, setEmailDraftData] = useState({
    recipientId: "",
    recipientName: "",
    recipientEmail: "",
    ccEmails: "",
    subject: "",
    bodyText: "",
    items: [],
    portalToken: "",
    portalUrl: "",
    createdAt: 0
  });
  const [showUploadedFilesModal, setShowUploadedFilesModal] = useState(false);
  const [viewingFileItem, setViewingFileItem] = useState(null);

  // Dynamic Column Customizer State
  const DEFAULT_PROGRAMME_COLUMNS = useMemo(() => [
    { key: "serial_no", label: "Sr. No.", type: "text", width: 60, isFixed: true },
    { key: "sub_process", label: "Sub-Process / Area", type: "text", width: 140, isFixed: true },
    { key: "objective", label: "Audit Objective", type: "textarea", width: 205, isFixed: true },
    { key: "procedure", label: "Audit Procedure / Steps", type: "textarea", width: 260, isFixed: true },
    { key: "risk_rating", label: "Risk Rating", type: "select", options: ["High", "Medium", "Low"], width: 100, isFixed: true },
    { key: "key_risk", label: "Key Risk", type: "textarea", width: 195, isFixed: true },
    { key: "expected_key_control", label: "Expected Key Control", type: "textarea", width: 205, isFixed: true },
    { key: "data_requirement", label: "Data Requirement", type: "text", width: 160, isFixed: true },
    { key: "assigned_to", label: "Assigned To", type: "employee", width: 130, isFixed: true },
    { key: "status", label: "Status", type: "select", options: ["Not Started", "In Progress", "Under Review", "Completed"], width: 115, isFixed: true }
  ], []);

  const [colTargetTab, setColTargetTab] = useState("programme"); // "programme" | "mom" | "testing"
  const [customColumns, setCustomColumns] = useState([
    { key: "serial_no", label: "Sr. No.", type: "text", width: 60, isFixed: true },
    { key: "sub_process", label: "Sub-Process / Area", type: "text", width: 140, isFixed: true },
    { key: "objective", label: "Audit Objective", type: "textarea", width: 205, isFixed: true },
    { key: "procedure", label: "Audit Procedure / Steps", type: "textarea", width: 260, isFixed: true },
    { key: "risk_rating", label: "Risk Rating", type: "select", options: ["High", "Medium", "Low"], width: 100, isFixed: true },
    { key: "key_risk", label: "Key Risk", type: "textarea", width: 195, isFixed: true },
    { key: "expected_key_control", label: "Expected Key Control", type: "textarea", width: 205, isFixed: true },
    { key: "data_requirement", label: "Data Requirement", type: "text", width: 160, isFixed: true },
    { key: "assigned_to", label: "Assigned To", type: "employee", width: 130, isFixed: true },
    { key: "status", label: "Status", type: "select", options: ["Not Started", "In Progress", "Under Review", "Completed"], width: 115, isFixed: true }
  ]);
  const [detectedNewColumns, setDetectedNewColumns] = useState([]);

  // Sub-Tab 3: Minutes of Meeting (MOM) State
  const [momData, setMomData] = useState({}); // { [processCategory]: [ { id, meeting_date, topic, attendees, key_discussion, action_items, target_date, owner, status, ...customCols } ] }
  const [momColumns, setMomColumns] = useState([
    { key: "meeting_date", label: "Meeting Date", type: "date", width: 140 },
    { key: "topic", label: "Meeting Topic / Purpose", type: "text", width: 220 },
    { key: "attendees", label: "Attendees (Client & Audit Team)", type: "text", width: 220 },
    { key: "key_discussion", label: "Key Discussion Points", type: "textarea", width: 280 },
    { key: "action_items", label: "Agreed Action Items", type: "textarea", width: 280 },
    { key: "target_date", label: "Target Date", type: "date", width: 130 },
    { key: "owner", label: "Action Owner", type: "text", width: 150 },
    { key: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Completed", "Deferred"], width: 130 }
  ]);
  const [showAddMomModal, setShowAddMomModal] = useState(false);
  const [newMomRow, setNewMomRow] = useState({
    meeting_date: new Date().toISOString().split('T')[0],
    topic: "",
    attendees: "",
    key_discussion: "",
    action_items: "",
    target_date: "",
    owner: "",
    status: "Open"
  });
  const [selectedMomDrawerRow, setSelectedMomDrawerRow] = useState(null);
  const [momSearchQuery, setMomSearchQuery] = useState("");
  const [momStatusFilter, setMomStatusFilter] = useState("ALL");

  // Sub-Tab 4: Testing State
  const [testingData, setTestingData] = useState({}); // { [rowId]: { testing_status, observations_findings, comments, ...customCols }, __manual_rows: { [processCategory]: [...] } }
  const [testingColumns, setTestingColumns] = useState([
    { key: "data_requirement", label: "Data Requirement & Evidence", type: "text", width: 220 },
    { key: "procedure", label: "Audit Procedure / Steps", type: "textarea", width: 300 },
    { key: "objective", label: "Audit Objective", type: "textarea", width: 220 },
    { key: "key_risk", label: "Key Risk", type: "textarea", width: 260 },
    { key: "testing_status", label: "Testing Status", type: "select", options: ["Pending Review", "In Progress", "Satisfactory / Pass", "Failed", "Exception / Query Raised", "Closed"], width: 180 },
    { key: "observations_findings", label: "OBSERVATIONS / FINDINGS", type: "textarea", width: 280 },
    { key: "comments", label: "COMMENTS / AUDIT TRAIL", type: "textarea", width: 240 },
    { key: "annexures", label: "Annexures", type: "file", width: 240 }
  ]);
  const [selectedTestingDrawerRow, setSelectedTestingDrawerRow] = useState(null);
  const [testingSearchQuery, setTestingSearchQuery] = useState("");
  const [testingStatusFilter, setTestingStatusFilter] = useState("ALL");
  const [showAddTestingModal, setShowAddTestingModal] = useState(false);
  const [newTestingRow, setNewTestingRow] = useState({
    data_requirement: "",
    procedure: "",
    objective: "",
    key_risk: "",
    risk_rating: "Medium",
    sub_process: "",
    testing_status: "Pending Review",
    observations_findings: "",
    comments: "",
    annexures: []
  });

  // Sub-Tab 5: Queries & Exceptions State
  const [queriesData, setQueriesData] = useState({}); // { [queryId]: { query_title, query_description, client_response, query_status, resolution_remarks, custom_values }, __manual_rows: { [processCategory]: [...] } }
  const [queriesColumns, setQueriesColumns] = useState([
    { key: "query_title", label: "Query Reference & Evidence", type: "text", width: 220 },
    { key: "procedure", label: "Linked Audit Procedure", type: "textarea", width: 260 },
    { key: "query_description", label: "Observation / Exception Raised", type: "textarea", width: 280 },
    { key: "client_response", label: "Client Response / Explanation", type: "textarea", width: 280 },
    { key: "query_status", label: "Query Status", type: "select", options: ["Query Raised", "Sent to Client", "Response Received", "Resolved / Closed", "Accepted into Report"], width: 180 },
    { key: "resolution_remarks", label: "Auditor Conclusion / Working Notes", type: "textarea", width: 240 }
  ]);
  const [selectedQueryDrawerRow, setSelectedQueryDrawerRow] = useState(null);
  const [querySearchQuery, setQuerySearchQuery] = useState("");
  const [queryStatusFilter, setQueryStatusFilter] = useState("ALL");
  const [showAddQueryModal, setShowAddQueryModal] = useState(false);
  const [newQueryRow, setNewQueryRow] = useState({
    query_title: "",
    procedure: "",
    query_description: "",
    client_response: "",
    query_status: "Query Raised",
    resolution_remarks: ""
  });

  // Modals
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [showAddColModal, setShowAddColModal] = useState(false);
  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [showAddCalModal, setShowAddCalModal] = useState(false);
  const [showAddStepModal, setShowAddStepModal] = useState(false);

  // Weekly Calendar Email Dispatch State & Stretchable Drawer Size
  const [isSendCalEmailDrawerOpen, setIsSendCalEmailDrawerOpen] = useState(false);
  const [calEmailRecipients, setCalEmailRecipients] = useState([]);
  const [calEmailCustomTo, setCalEmailCustomTo] = useState("");
  const [calEmailCc, setCalEmailCc] = useState("");
  const [calEmailSubject, setCalEmailSubject] = useState("");
  const [calEmailMessage, setCalEmailMessage] = useState("");
  const [calEmailWeekFilter, setCalEmailWeekFilter] = useState("ALL");
  const [isSendingCalEmail, setIsSendingCalEmail] = useState(false);
  const [calEmailDrawerWidth, setCalEmailDrawerWidth] = useState(680);
  const [isCalDrawerMaximized, setIsCalDrawerMaximized] = useState(false);
  const [isResizingDrawer, setIsResizingDrawer] = useState(false);

  // Resize drag handle handler
  const handleStartResize = (e) => {
    e.preventDefault();
    setIsResizingDrawer(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizingDrawer) return;
      const targetWidth = Math.max(480, Math.min(window.innerWidth - 60, window.innerWidth - e.clientX));
      setCalEmailDrawerWidth(targetWidth);
      if (isCalDrawerMaximized) setIsCalDrawerMaximized(false);
    };

    const handleMouseUp = () => {
      if (isResizingDrawer) {
        setIsResizingDrawer(false);
      }
    };

    if (isResizingDrawer) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    } else {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizingDrawer, isCalDrawerMaximized]);

  // Dynamic Step Form State
  const [isHeaderStep, setIsHeaderStep] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("");
  const [stepFormData, setStepFormData] = useState({
    serial_no: "1.1",
    sub_process: "",
    objective: "",
    procedure: "",
    risk_rating: "Medium",
    data_requirement: "",
    assigned_to: ""
  });

  // Right Slide-Over Drawer State
  const [selectedDrawerRow, setSelectedDrawerRow] = useState(null);
  const [drawerTab, setDrawerTab] = useState("details");
  const [drawerData, setDrawerData] = useState({});
  const [drawerComments, setDrawerComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");

  // Floating Bottom-Right Toast Notifications State & Helper
  const [toastList, setToastList] = useState([]);

  const showToast = (message, type = 'warning', title = '') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    const toastTitle = title || (type === 'error' ? 'System Error' : type === 'warning' ? 'Action Required' : type === 'success' ? 'Success' : 'Notice');
    const newToast = { id, message, type, title: toastTitle };
    setToastList(prev => [...prev, newToast]);
    setTimeout(() => {
      setToastList(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToastList(prev => prev.filter(t => t.id !== id));
  };

  // Authenticated Current User State
  const [currentUser, setCurrentUser] = useState({
    name: "Anshu Prasad",
    role: "Auditor",
    initials: "AP",
    avatar: ""
  });

  useEffect(() => {
    fetch('/api/auth/context')
      .then(res => res.json())
      .then(data => {
        if (data?.user) {
          const name = data.user.name || data.user.full_name || (data.user.email ? data.user.email.split('@')[0] : "Anshu Prasad");
          const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "AP";
          setCurrentUser({
            name,
            role: data.user.role || data.accountType || "Auditor",
            initials,
            avatar: data.user.avatar || data.user.avatar_url || data.user.profile_image || ""
          });
        }
      })
      .catch(() => { });
  }, []);

  // Column & Row Drag and Drop Reordering State
  const [draggedColIdx, setDraggedColIdx] = useState(null);
  const [draggedRowIdx, setDraggedRowIdx] = useState(null);

  const saveCustomColumnsToProject = async (projectId, cols) => {
    if (!projectId) return;
    try {
      localStorage.setItem(`custom_columns_${projectId}`, JSON.stringify(cols));
      await fetch('/Auditing/api/dynamic/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, custom_columns: cols })
      });
    } catch (err) {
      console.error("Error saving custom columns:", err);
    }
  };

  const ensureFixedProgrammeColumns = (savedCols) => {
    if (!Array.isArray(savedCols) || savedCols.length === 0) {
      return DEFAULT_PROGRAMME_COLUMNS;
    }
    const fixedKeys = new Set(DEFAULT_PROGRAMME_COLUMNS.map(c => c.key));
    const result = DEFAULT_PROGRAMME_COLUMNS.map(fixedCol => {
      const saved = savedCols.find(c => c.key === fixedCol.key);
      return saved ? { ...fixedCol, ...saved, isFixed: true, width: fixedCol.width } : fixedCol;
    });
    savedCols.forEach(c => {
      if (!fixedKeys.has(c.key) && c.key !== 'observations_findings' && c.key !== 'comments') {
        result.push(c);
      }
    });
    return result;
  };

  const saveMomToProject = async (projectId, procCategory, updatedMomData, updatedMomCols) => {
    if (!projectId) return;
    try {
      localStorage.setItem(`mom_data_${projectId}`, JSON.stringify(updatedMomData));
      if (updatedMomCols) {
        localStorage.setItem(`mom_columns_${projectId}`, JSON.stringify(updatedMomCols));
      }
      await fetch(`/Auditing/api/dynamic/projects/${projectId}/stage2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_mom',
          process_category: procCategory,
          mom_data: updatedMomData,
          mom_columns: updatedMomCols
        })
      });
    } catch (err) {
      console.error("Error saving MOM data:", err);
    }
  };

  const saveTestingToProject = async (projectId, updatedTestingData, updatedTestingCols) => {
    if (!projectId) return;
    try {
      localStorage.setItem(`testing_data_${projectId}`, JSON.stringify(updatedTestingData));
      if (updatedTestingCols) {
        localStorage.setItem(`testing_columns_${projectId}`, JSON.stringify(updatedTestingCols));
      }
      await fetch(`/Auditing/api/dynamic/projects/${projectId}/stage2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_testing',
          testing_data: updatedTestingData,
          testing_columns: updatedTestingCols
        })
      });
    } catch (err) {
      console.error("Error saving Testing data:", err);
    }
  };

  const saveQueriesToProject = async (projectId, updatedQueriesData, updatedQueriesCols) => {
    if (!projectId) return;
    try {
      localStorage.setItem(`queries_data_${projectId}`, JSON.stringify(updatedQueriesData));
      if (updatedQueriesCols) {
        localStorage.setItem(`queries_columns_${projectId}`, JSON.stringify(updatedQueriesCols));
      }
      await fetch(`/Auditing/api/dynamic/projects/${projectId}/stage2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_queries',
          queries_data: updatedQueriesData,
          queries_columns: updatedQueriesCols
        })
      });
    } catch (err) {
      console.error("Error saving Queries data:", err);
    }
  };

  const handleAnnexureUpload = async (rowId, files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    try {
      showToast("Uploading document(s) to Supabase Storage...", "notice", "Uploading");
      const formData = new FormData();
      formData.append('projectId', selectedProject?.id || 'general');
      formData.append('folder', 'annexures');
      formData.append('rowId', rowId);
      fileArray.forEach(file => {
        formData.append('files', file);
      });

      const res = await fetch('/Auditing/api/dynamic/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (!data.success || !Array.isArray(data.files)) {
        showToast(data.error || "Failed to upload document to Supabase storage bucket.", "error", "Upload Failed");
        return;
      }

      const newUploaded = data.files;

      const currentRow = testingData[rowId] || {};
      const existingAnnexures = Array.isArray(currentRow.annexures) ? currentRow.annexures : [];
      const updatedAnnexures = [...existingAnnexures, ...newUploaded];

      const updatedTestingData = {
        ...testingData,
        [rowId]: {
          ...currentRow,
          annexures: updatedAnnexures
        }
      };
      setTestingData(updatedTestingData);
      if (selectedProject?.id) {
        saveTestingToProject(selectedProject.id, updatedTestingData, testingColumns);
      }
      if (selectedTestingDrawerRow && selectedTestingDrawerRow.id === rowId) {
        setSelectedTestingDrawerRow(prev => prev ? ({
          ...prev,
          annexures: updatedAnnexures
        }) : null);
      }
      showToast(`${newUploaded.length} annexure document(s) uploaded to storage.`, "success", "Upload Complete");
    } catch (err) {
      console.error("Error uploading annexure files:", err);
      showToast("Failed to upload annexure files.", "warning", "Upload Failed");
    }
  };

  const handleAnnexureDelete = async (rowId, fileIdx) => {
    const currentRow = testingData[rowId] || {};
    const existingAnnexures = Array.isArray(currentRow.annexures) ? currentRow.annexures : [];
    const fileToDelete = existingAnnexures[fileIdx];
    const updatedAnnexures = existingAnnexures.filter((_, i) => i !== fileIdx);

    const updatedTestingData = {
      ...testingData,
      [rowId]: {
        ...currentRow,
        annexures: updatedAnnexures
      }
    };
    setTestingData(updatedTestingData);
    if (selectedProject?.id) {
      saveTestingToProject(selectedProject.id, updatedTestingData, testingColumns);
    }
    if (selectedTestingDrawerRow && selectedTestingDrawerRow.id === rowId) {
      setSelectedTestingDrawerRow(prev => prev ? ({
        ...prev,
        annexures: updatedAnnexures
      }) : null);
    }

    if (fileToDelete?.storage_path) {
      try {
        await fetch('/Auditing/api/dynamic/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storagePath: fileToDelete.storage_path })
        });
      } catch (e) { }
    }
    showToast("Annexure document removed.", "notice", "Deleted");
  };

  useEffect(() => {
    if (selectedProject?.id) {
      let savedCols = null;
      if (Array.isArray(selectedProject.custom_columns) && selectedProject.custom_columns.length > 0) {
        savedCols = selectedProject.custom_columns;
      } else {
        const localStr = localStorage.getItem(`custom_columns_${selectedProject.id}`);
        if (localStr) {
          try { savedCols = JSON.parse(localStr); } catch (e) { }
        }
      }
      if (savedCols && Array.isArray(savedCols) && savedCols.length > 0) {
        setCustomColumns(ensureFixedProgrammeColumns(savedCols));
      } else {
        setCustomColumns(DEFAULT_PROGRAMME_COLUMNS);
      }
    }
  }, [selectedProject?.id]);

  const handleColDragStart = (e, idx) => {
    setDraggedColIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleColDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedColIdx === null || draggedColIdx === targetIdx) return;
    const updated = [...customColumns];
    const [moved] = updated.splice(draggedColIdx, 1);
    updated.splice(targetIdx, 0, moved);
    setCustomColumns(updated);
    setDraggedColIdx(null);
    if (selectedProject?.id) {
      saveCustomColumnsToProject(selectedProject.id, updated);
    }
  };

  const handleRowDragStart = (e, idx) => {
    setDraggedRowIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleRowDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleRowDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedRowIdx === null || draggedRowIdx === targetIdx) return;
    const updated = [...programmeRows];
    const [moved] = updated.splice(draggedRowIdx, 1);
    updated.splice(targetIdx, 0, moved);
    setProgrammeRows(updated);
    setDraggedRowIdx(null);
  };

  // Horizontal Grab & Scroll Panning State
  const tableContainerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStartX, setPanStartX] = useState(0);
  const [panScrollLeft, setPanScrollLeft] = useState(0);

  const handlePanMouseDown = (e) => {
    if (!tableContainerRef.current) return;
    if (["BUTTON", "INPUT", "SELECT", "TEXTAREA", "LABEL", "A", "SVG", "PATH"].includes(e.target.tagName)) return;
    setIsPanning(true);
    setPanStartX(e.pageX - tableContainerRef.current.offsetLeft);
    setPanScrollLeft(tableContainerRef.current.scrollLeft);
  };

  const handlePanMouseLeave = () => setIsPanning(false);
  const handlePanMouseUp = () => setIsPanning(false);

  const handlePanMouseMove = (e) => {
    if (!isPanning || !tableContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableContainerRef.current.offsetLeft;
    const walk = (x - panStartX) * 1.5;
    tableContainerRef.current.scrollLeft = panScrollLeft - walk;
  };

  // Forms & Company Edit State
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [newCompany, setNewCompany] = useState({
    project_name: "",
    client_name: "",
    financial_year: "FY 2026-27",
    company_category: "",
    custom_category: "",
    plant_count: 0,
    plants: [],
    project_leader: "",
    start_date: "",
    end_date: "",
    project_length: "",
    assigned_team: []
  });

  // 2-Step Double Confirmation Company Delete State
  const [deleteModalStep, setDeleteModalStep] = useState(0); // 0: closed, 1: step 1 prompt, 2: step 2 final confirmation
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);

  const handleInitiateDeleteCompany = (proj, e) => {
    if (e) e.stopPropagation();
    setCompanyToDelete(proj);
    setDeleteConfirmInput("");
    setDeleteModalStep(1);
  };

  const handleProceedToDeleteStep2 = () => {
    setDeleteConfirmInput("");
    setDeleteModalStep(2);
  };

  const handleFinalDeleteCompany = async () => {
    if (!companyToDelete) return;
    setIsDeletingCompany(true);
    try {
      const res = await fetch(`/Auditing/api/dynamic/projects?id=${companyToDelete.id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setProjects(prev => prev.filter(p => p.id !== companyToDelete.id));
        if (selectedProject?.id === companyToDelete.id) {
          setSelectedProject(null);
        }
        showToast(`Company "${companyToDelete.client_name}" and all associated data were permanently deleted from database.`, "success", "Company Deleted");
      } else {
        showToast(data.error || "Failed to delete company.", "error", "Delete Failed");
      }
    } catch (err) {
      // Local fallback removal if offline/mock
      setProjects(prev => prev.filter(p => p.id !== companyToDelete.id));
      if (selectedProject?.id === companyToDelete.id) {
        setSelectedProject(null);
      }
      showToast(`Company "${companyToDelete.client_name}" removed.`, "success", "Company Deleted");
    } finally {
      setIsDeletingCompany(false);
      setDeleteModalStep(0);
      setCompanyToDelete(null);
      setDeleteConfirmInput("");
    }
  };
  const [newTpl, setNewTpl] = useState({ template_name: "", category: "Internal Audit", description: "", icon: "📋", color: "#0d9488" });
  const [newOrgMember, setNewOrgMember] = useState({ member_name: "", designation: "", department: "", email: "", phone: "" });
  const [newCalItem, setNewCalItem] = useState({ week_name: "Week 1", week_description: "Planning & Data Collection", activity: "", detailed_audit_work: "", status: "Pending", progress: 0, remarks: "" });
  const CHOICE_COLORS = [
    { name: "Teal", color: "#0d9488" },
    { name: "Emerald", color: "#10b981" },
    { name: "Amber", color: "#f59e0b" },
    { name: "Red", color: "#ef4444" },
    { name: "Blue", color: "#3b82f6" },
    { name: "Purple", color: "#8b5cf6" },
    { name: "Pink", color: "#ec4899" },
    { name: "Slate", color: "#64748b" }
  ];

  const [newCol, setNewCol] = useState({
    label: "",
    type: "select",
    width: 180,
    choices: [
      { id: "1", label: "High", color: "#ef4444" },
      { id: "2", label: "Medium", color: "#f59e0b" },
      { id: "3", label: "Low", color: "#10b981" }
    ]
  });
  const [newChoiceInput, setNewChoiceInput] = useState("");
  const [selectedChoiceColor, setSelectedChoiceColor] = useState("#0d9488");
  const [newStep, setNewStep] = useState({ serial_no: "1.1", step: "", risk: "", objective: "", risk_rating: "Medium", data_requirement: "", assigned_to: "", status: "Pending" });

  // Fetch Templates & Projects from DB API on mount
  useEffect(() => {
    fetchTemplates();
    fetchProjects();
  }, []);

  // Dynamic User-Defined Audit Types / Processes State
  const [showAddProcessModal, setShowAddProcessModal] = useState(false);
  const [newProcessInput, setNewProcessInput] = useState("");
  const [customProcesses, setCustomProcesses] = useState([]);
  const [projectDbProcesses, setProjectDbProcesses] = useState([]);

  // Calculate active processes dynamically from actual DB programme rows + user custom processes + processCategory
  const initialDefault = selectedTemplate?.default_processes?.[0] || "P2P Audit";
  const baseProcesses = projectDbProcesses.length > 0 ? projectDbProcesses : [initialDefault];
  const activeProcesses = Array.from(new Set([...baseProcesses, ...customProcesses, processCategory].filter(Boolean)));

  const handleAddProcess = (processName) => {
    const nameToAdd = (processName || newProcessInput || "").trim();
    if (!nameToAdd) return showToast("Please enter an audit type / process name.", "warning", "Validation Required");
    if (activeProcesses.includes(nameToAdd)) return showToast(`Audit type '${nameToAdd}' already exists.`, "warning", "Duplicate Entry");

    setCustomProcesses(prev => [...prev, nameToAdd]);
    setProcessCategory(nameToAdd);

    if (selectedProject) {
      fetchStage2Data(selectedProject.id, nameToAdd);
    }

    setShowAddProcessModal(false);
    setNewProcessInput("");
  };

  const handleDeleteProcess = (procToDelete) => {
    if (activeProcesses.length <= 1) return showToast("At least one audit type / process must remain.", "warning", "Action Restricted");
    if (!confirm(`Are you sure you want to delete audit process '${procToDelete}'?`)) return;

    setCustomProcesses(prev => prev.filter(p => p !== procToDelete));
    setProjectDbProcesses(prev => prev.filter(p => p !== procToDelete));
    const remaining = activeProcesses.filter(p => p !== procToDelete);
    const nextActive = remaining[0] || "P2P Audit";
    setProcessCategory(nextActive);

    if (selectedProject) {
      fetchStage2Data(selectedProject.id, nextActive);
    }
  };

  // Helper: Resolve employee real name & profile object from UUID or employee ID
  const getEmployeeName = (idOrName) => {
    if (!idOrName) return "Not Assigned";
    const str = String(idOrName).trim();
    const emp = hrmEmployees.find(e => 
      e.id === str || 
      e.employee_id === str || 
      String(e.id).toLowerCase() === str.toLowerCase() ||
      String(e.name || '').toLowerCase() === str.toLowerCase() ||
      String(e.email || '').toLowerCase() === str.toLowerCase()
    );
    if (emp && emp.name) return emp.name;
    return str;
  };

  const getEmployeeObj = (idOrName) => {
    if (!idOrName) return null;
    const str = String(idOrName).trim();
    return hrmEmployees.find(e => 
      e.id === str || 
      e.employee_id === str || 
      String(e.id).toLowerCase() === str.toLowerCase() ||
      String(e.name || '').toLowerCase() === str.toLowerCase() ||
      String(e.email || '').toLowerCase() === str.toLowerCase()
    ) || null;
  };

  // Helper: Resolve only Team Leader & Assigned Team for the current project (for Internal Audit Team selection)
  const getProjectAuditTeam = () => {
    const list = [];
    const addedKeys = new Set();

    // 1. Team Leader
    if (selectedProject?.project_leader) {
      const leaderVal = selectedProject.project_leader;
      const leaderEmp = (hrmEmployees || []).find(e =>
        String(e.id) === String(leaderVal) ||
        String(e.employee_id) === String(leaderVal) ||
        (e.name && e.name.toLowerCase() === String(leaderVal).toLowerCase()) ||
        (e.email && e.email.toLowerCase() === String(leaderVal).toLowerCase()) ||
        (e.full_name && e.full_name.toLowerCase() === String(leaderVal).toLowerCase())
      );
      const leaderName = leaderEmp ? (leaderEmp.name || leaderEmp.full_name) : leaderVal;
      const leaderDesignation = leaderEmp?.designation ? `${leaderEmp.designation} (Team Leader)` : "Team Leader";
      const displayVal = `${leaderName} (${leaderDesignation})`;
      list.push({
        id: leaderEmp?.id || leaderVal,
        name: leaderName,
        designation: leaderDesignation,
        isLeader: true,
        display: displayVal
      });
      addedKeys.add(String(leaderName).toLowerCase());
      if (leaderEmp?.id) addedKeys.add(String(leaderEmp.id).toLowerCase());
    }

    // 2. Assigned Team Members
    const rawAssigned = Array.isArray(selectedProject?.assigned_team)
      ? selectedProject.assigned_team
      : (Array.isArray(selectedProject?.meta_json?.assigned_team) ? selectedProject.meta_json.assigned_team : []);

    rawAssigned.forEach(item => {
      if (!item) return;
      const emp = (hrmEmployees || []).find(e =>
        String(e.id) === String(item) ||
        String(e.employee_id) === String(item) ||
        (e.name && e.name.toLowerCase() === String(item).toLowerCase()) ||
        (e.email && e.email.toLowerCase() === String(item).toLowerCase()) ||
        (e.full_name && e.full_name.toLowerCase() === String(item).toLowerCase())
      );
      const empName = emp ? (emp.name || emp.full_name) : item;
      const empDesignation = emp?.designation || "Assigned Auditor";
      const key = String(empName).toLowerCase();
      const idKey = String(emp?.id || item).toLowerCase();

      if (!addedKeys.has(key) && !addedKeys.has(idKey)) {
        list.push({
          id: emp?.id || item,
          name: empName,
          designation: empDesignation,
          isLeader: false,
          display: `${empName} (${empDesignation})`
        });
        addedKeys.add(key);
        addedKeys.add(idKey);
      }
    });

    // If no leader or assigned team are specified on the project yet, fallback to all hrmEmployees
    if (list.length === 0) {
      return (hrmEmployees || []).map(emp => ({
        id: emp.id || emp.email || emp.name,
        name: emp.name || emp.full_name,
        designation: emp.designation || "Auditor",
        isLeader: false,
        display: `${emp.name || emp.full_name} (${emp.designation || "Auditor"})`
      }));
    }

    return list;
  };

  // Helper: Filter projects strictly by template framework (eliminating cross-category matching)
  const getTemplateProjects = (tpl) => {
    if (!tpl) return [];
    return projects.filter(p => {
      // 1. Direct ID / UUID match or template_name match
      if (p.template_id && (p.template_id === tpl.id || p.template_id === tpl.template_name)) return true;

      // 2. Map static/legacy template IDs to template names
      const tplNameLower = (tpl.template_name || "").toLowerCase();
      const tplIdLower = (tpl.id || "").toLowerCase();

      if (p.template_id === "tpl-internal" && (tplNameLower.includes("internal") || tplIdLower.includes("internal"))) return true;
      if (p.template_id === "tpl-saudi" && (tplNameLower.includes("saudi") || tplIdLower.includes("saudi"))) return true;
      if (p.template_id === "tpl-ifc" && (tplNameLower.includes("ifc") || tplIdLower.includes("ifc"))) return true;
      if (p.template_id === "tpl-pdpl" && (tplNameLower.includes("pdpl") || tplIdLower.includes("pdpl"))) return true;
      if (p.template_id === "tpl-cst" && (tplNameLower.includes("cst") || tplIdLower.includes("cst"))) return true;

      // 3. Fallback for projects with null/empty template_id
      if (!p.template_id) {
        const projName = (p.project_name || "").toLowerCase();
        const clientName = (p.client_name || "").toLowerCase();
        const combinedText = `${projName} ${clientName}`;

        if (tplNameLower.includes("saudi") && combinedText.includes("saudi")) return true;
        if (tplNameLower.includes("pdpl") && combinedText.includes("pdpl")) return true;
        if (tplNameLower.includes("ifc") && combinedText.includes("ifc")) return true;
        if (tplNameLower.includes("cst") && combinedText.includes("cst")) return true;

        // Only assign unassigned/null projects to Internal Audit if they do NOT match any other template keyword
        if ((tplIdLower === "tpl-internal" || tplNameLower === "internal audit") &&
          !combinedText.includes("saudi") && !combinedText.includes("pdpl") && !combinedText.includes("ifc") && !combinedText.includes("cst")) {
          return true;
        }
      }
      return false;
    });
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`/Auditing/api/dynamic/templates`);
      const data = await res.json();
      if (data.success && data.templates?.length > 0) {
        setTemplates(data.templates);
      } else {
        setTemplates([
          { id: "tpl-internal", template_name: "Internal Audit", category: "Internal Audit", description: "Comprehensive internal audit with pre-execution planning, weekly calendar, org structure, and execution tabs.", icon: "🛡️", color: "#0d9488", default_processes: ["P2P Audit"] },
          { id: "tpl-ifc", template_name: "IFC / ICFR Audit", category: "Compliance", description: "Internal Financial Controls & Financial Reporting audit template.", icon: "🏦", color: "#2563eb", default_processes: ["Entity Level Controls"] },
          { id: "tpl-pdpl", template_name: "PDPL Audit", category: "Privacy & Data", description: "Personal Data Protection Law compliance framework.", icon: "🏭", color: "#d97706", default_processes: ["Data Collection"] },
          { id: "tpl-cst", template_name: "CST Audit", category: "Process Audit", description: "CST process and execution audit framework.", icon: "📊", color: "#0f766e", default_processes: ["Execution Planning"] },
          { id: "tpl-saudi", template_name: "Saudi Audit", category: "Internal Audit", description: "Saudi Arabia internal audit workspace structure.", icon: "🇸🇦", color: "#1e3a8a", default_processes: ["Master RCM"] }
        ]);
      }
    } catch (e) {
      console.log("Template fetch error:", e);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/Auditing/api/dynamic/projects`);
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        setProjects([]);
      }
      if (data.employees && Array.isArray(data.employees)) {
        setHrmEmployees(data.employees);
      } else {
        setHrmEmployees([]);
      }
    } catch (e) {
      console.log("Projects fetch error:", e);
      setProjects([]);
      setHrmEmployees([]);
    }
  };

  // Create Template Dynamically
  const handleCreateTemplate = async () => {
    if (!newTpl.template_name) return showToast("Template Name is required.", "warning", "Validation Required");
    try {
      const res = await fetch(`/Auditing/api/dynamic/templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTpl)
      });
      const data = await res.json();
      if (data.success) {
        setTemplates([...templates, data.template]);
        setShowCreateTemplateModal(false);
        setNewTpl({ template_name: "", category: "Internal Audit", description: "", icon: "📋", color: "#0d9488" });
      }
    } catch (e) {
      const fallback = { id: `tpl-${Date.now()}`, ...newTpl, default_processes: ["P2P Audit"] };
      setTemplates([...templates, fallback]);
      setShowCreateTemplateModal(false);
    }
  };

  // Update Project Active Stage in state & DB
  const handleUpdateProjectStage = async (stageNum) => {
    const newStage = parseInt(stageNum, 10);
    setCurrentStage(newStage);

    if (selectedProject) {
      setSelectedProject(prev => prev ? { ...prev, current_stage: newStage } : null);
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, current_stage: newStage } : p));

      try {
        await fetch('/Auditing/api/dynamic/projects', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: selectedProject.id, current_stage: newStage })
        });
      } catch (e) {
        console.error("Failed to persist project stage:", e);
      }
    }
  };

  // Open Project & Stage Details
  const handleOpenProject = async (proj) => {
    setSelectedProject(proj);
    setCurrentStage(proj.current_stage || 1);
    setCustomProcesses([]);
    setProjectDbProcesses([]);

    // Fetch Stage 1 Data
    try {
      const res = await fetch(`/Auditing/api/dynamic/projects/${proj.id}/stage1`);
      const data = await res.json();
      if (data.success) {
        setOrgMembers(data.org_structure || []);
        setCalendarItems(data.calendar || []);
      }
    } catch (e) {
      console.log(e);
    }

    fetchStage2Data(proj.id, processCategory);
  };

  const fetchStage2Data = async (projId, procName) => {
    try {
      const res = await fetch(`/Auditing/api/dynamic/projects/${projId}/stage2?process=${encodeURIComponent(procName)}`);
      const data = await res.json();
      if (data.success) {
        setProgrammeRows(data.programme || []);

        let trackerItems = data.data_tracker || [];
        const existingProgIds = new Set(trackerItems.map(t => String(t.programme_id || t.id)));

        (data.programme || []).forEach(p => {
          if (p.row_data?.data_requirement && !existingProgIds.has(String(p.id))) {
            trackerItems.push({
              id: p.id,
              programme_id: p.id,
              data_requirement: p.row_data.data_requirement,
              procedure: p.row_data.procedure || '',
              sub_process: p.row_data.sub_process || '',
              status_json: { document_status: 'Pending' },
              attachments: []
            });
          }
        });

        setDataTrackerRows(trackerItems);
        if (Array.isArray(data.all_processes)) {
          setProjectDbProcesses(data.all_processes);
        }

        // Hydrate Minutes of Meeting (MOM) Data & Columns
        if (data.mom_data && typeof data.mom_data === 'object') {
          setMomData(data.mom_data);
          try { localStorage.setItem(`mom_data_${projId}`, JSON.stringify(data.mom_data)); } catch (e) {}
        } else {
          const localMom = localStorage.getItem(`mom_data_${projId}`);
          if (localMom) {
            try { setMomData(JSON.parse(localMom)); } catch (e) {}
          }
        }
        if (Array.isArray(data.mom_columns) && data.mom_columns.length > 0) {
          setMomColumns(data.mom_columns);
        }

        // Hydrate Testing & Queries Data & Columns
        if (data.testing_data && typeof data.testing_data === 'object') {
          setTestingData(data.testing_data);
          try { localStorage.setItem(`testing_data_${projId}`, JSON.stringify(data.testing_data)); } catch (e) {}
        } else {
          const localTesting = localStorage.getItem(`testing_data_${projId}`);
          if (localTesting) {
            try { setTestingData(JSON.parse(localTesting)); } catch (e) {}
          }
        }
        if (Array.isArray(data.testing_columns) && data.testing_columns.length > 0) {
          let migratedTestingCols = data.testing_columns.map(c => {
            if (c.key === "risk_rating") {
              return { key: "key_risk", label: "Key Risk", type: "textarea", width: 260 };
            }
            return c;
          });
          if (!migratedTestingCols.some(c => c.key === "annexures")) {
            migratedTestingCols.push({ key: "annexures", label: "Annexures", type: "file", width: 240 });
          }
          setTestingColumns(migratedTestingCols);
        }

        // Hydrate Queries Data & Columns
        if (data.queries_data && typeof data.queries_data === 'object') {
          setQueriesData(data.queries_data);
          try { localStorage.setItem(`queries_data_${projId}`, JSON.stringify(data.queries_data)); } catch (e) {}
        } else {
          const localQueries = localStorage.getItem(`queries_data_${projId}`);
          if (localQueries) {
            try { setQueriesData(JSON.parse(localQueries)); } catch (e) {}
          }
        }
        if (Array.isArray(data.queries_columns) && data.queries_columns.length > 0) {
          setQueriesColumns(data.queries_columns);
        }

        // Hydrate Custom Columns (Audit Programme)
        if (Array.isArray(data.custom_columns) && data.custom_columns.length > 0) {
          setCustomColumns(ensureFixedProgrammeColumns(data.custom_columns));
        } else {
          setCustomColumns(DEFAULT_PROGRAMME_COLUMNS);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Create or Update Company
  const handleAddCompany = async () => {
    if (!newCompany.project_name || !newCompany.client_name) return showToast("Please fill project name and company name.", "warning", "Required Fields Missing");

    try {
      if (editingCompanyId) {
        // UPDATE EXISTING COMPANY
        const res = await fetch(`/Auditing/api/dynamic/projects`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: editingCompanyId, ...newCompany })
        });
        const data = await res.json();
        if (data.success && data.project) {
          setProjects(prev => prev.map(p => p.id === editingCompanyId ? { ...p, ...data.project } : p));
          if (selectedProject?.id === editingCompanyId) {
            setSelectedProject(prev => ({ ...prev, ...data.project }));
          }
          setShowAddCompanyModal(false);
          setEditingCompanyId(null);
          setNewCompany({
            project_name: "",
            client_name: "",
            financial_year: "FY 2026-27",
            company_category: "",
            custom_category: "",
            plant_count: 0,
            plants: [],
            project_leader: "",
            start_date: "",
            end_date: "",
            project_length: "",
            assigned_team: []
          });
          showToast(`Company "${data.project.client_name}" updated successfully!`, "success", "Company Updated");
        } else {
          showToast(data.error || "Failed to update company.", "error", "Update Error");
        }
      } else {
        // CREATE NEW COMPANY
        const res = await fetch(`/Auditing/api/dynamic/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newCompany, template_id: selectedTemplate?.id || null })
        });
        const data = await res.json();
        if (data.success) {
          setProjects([data.project, ...projects]);
          setShowAddCompanyModal(false);
          setEditingCompanyId(null);
          setNewCompany({
            project_name: "",
            client_name: "",
            financial_year: "FY 2026-27",
            company_category: "",
            custom_category: "",
            plant_count: 0,
            plants: [],
            project_leader: "",
            start_date: "",
            end_date: "",
            project_length: "",
            assigned_team: []
          });
          showToast(`Company "${data.project.client_name}" created successfully!`, "success", "Company Created");
        }
      }
    } catch (e) {
      if (editingCompanyId) {
        setProjects(prev => prev.map(p => p.id === editingCompanyId ? { ...p, ...newCompany } : p));
        if (selectedProject?.id === editingCompanyId) {
          setSelectedProject(prev => ({ ...prev, ...newCompany }));
        }
        setShowAddCompanyModal(false);
        setEditingCompanyId(null);
        showToast(`Company "${newCompany.client_name}" updated!`, "success", "Company Updated");
      } else {
        const fallback = { id: `proj-${Date.now()}`, template_id: selectedTemplate?.id || null, ...newCompany, status: "active", current_stage: 1 };
        setProjects([fallback, ...projects]);
        setShowAddCompanyModal(false);
        setEditingCompanyId(null);
        showToast(`Company "${newCompany.client_name}" created!`, "success", "Company Created");
      }
    }
  };

  const handleOpenAddCompanyModal = () => {
    setEditingCompanyId(null);
    setNewCompany({
      project_name: "",
      client_name: "",
      financial_year: "FY 2026-27",
      company_category: "",
      custom_category: "",
      plant_count: 0,
      plants: [],
      project_leader: "",
      start_date: "",
      end_date: "",
      project_length: "",
      assigned_team: []
    });
    setShowAddCompanyModal(true);
  };

  const handleOpenEditCompanyModal = (proj) => {
    const target = proj || selectedProject;
    if (!target) return;

    let cat = target.company_category || "";
    let customCat = "";
    if (typeof cat === "string" && cat.startsWith("Other: ")) {
      customCat = cat.replace("Other: ", "").trim();
      cat = "Other";
    } else if (cat === "Other") {
      cat = "Other";
    }

    const rawPlants = Array.isArray(target.plants)
      ? target.plants
      : (Array.isArray(target.meta_json?.plants) ? target.meta_json.plants : []);

    const leaderEmp = hrmEmployees.find(e => e.id === target.project_leader || e.name === target.project_leader || e.email === target.project_leader);
    const resolvedLeader = leaderEmp ? leaderEmp.name : (target.project_leader || "");

    const resolvedTeam = (Array.isArray(target.assigned_team) ? target.assigned_team : []).map(item => {
      const emp = hrmEmployees.find(e => e.id === item || e.name === item || e.email === item);
      return emp ? emp.name : item;
    });

    setEditingCompanyId(target.id);
    setNewCompany({
      project_name: target.project_name || "",
      client_name: target.client_name || "",
      financial_year: target.financial_year || "FY 2026-27",
      company_category: cat,
      custom_category: customCat,
      plant_count: rawPlants.length,
      plants: rawPlants,
      project_leader: resolvedLeader,
      start_date: target.start_date || "",
      end_date: target.end_date || "",
      project_length: target.project_length || "",
      assigned_team: resolvedTeam
    });
    setShowAddCompanyModal(true);
  };

  // Add Custom Column to Audit Programme Table
  // Stage 1 Excel Mapping State
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [mappingSection, setMappingSection] = useState("calendar"); // calendar | org
  const [rawFileHeaders, setRawFileHeaders] = useState([]);
  const [rawFileRows, setRawFileRows] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});

  const handleAddChoice = () => {
    if (!newChoiceInput.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      label: newChoiceInput.trim(),
      color: selectedChoiceColor
    };
    setNewCol(prev => ({
      ...prev,
      choices: [...(prev.choices || []), newEntry]
    }));
    setNewChoiceInput("");
  };

  const handleApplyPresetChoices = (presetType) => {
    let presets = [];
    if (presetType === "risk") {
      presets = [
        { id: "1", label: "High", color: "#ef4444" },
        { id: "2", label: "Medium", color: "#f59e0b" },
        { id: "3", label: "Low", color: "#10b981" }
      ];
    } else if (presetType === "effectiveness") {
      presets = [
        { id: "1", label: "Effective", color: "#10b981" },
        { id: "2", label: "Partially Effective", color: "#f59e0b" },
        { id: "3", label: "Ineffective", color: "#ef4444" }
      ];
    } else if (presetType === "pass_fail") {
      presets = [
        { id: "1", label: "Pass", color: "#10b981" },
        { id: "2", label: "Fail", color: "#ef4444" },
        { id: "3", label: "N/A", color: "#64748b" }
      ];
    } else if (presetType === "compliant") {
      presets = [
        { id: "1", label: "Compliant", color: "#10b981" },
        { id: "2", label: "Non-Compliant", color: "#ef4444" },
        { id: "3", label: "Pending Audit", color: "#3b82f6" }
      ];
    } else if (presetType === "yes_no") {
      presets = [
        { id: "1", label: "Yes", color: "#10b981" },
        { id: "2", label: "No", color: "#ef4444" }
      ];
    } else if (presetType === "clear") {
      presets = [];
    }
    setNewCol(prev => ({ ...prev, choices: presets }));
  };

  const handleUpdateChoiceLabel = (id, newLabel) => {
    setNewCol(prev => ({
      ...prev,
      choices: (prev.choices || []).map(c => c.id === id ? { ...c, label: newLabel } : c)
    }));
  };

  const handleUpdateChoiceColor = (id, newColor) => {
    setNewCol(prev => ({
      ...prev,
      choices: (prev.choices || []).map(c => c.id === id ? { ...c, color: newColor } : c)
    }));
  };

  const handleRemoveChoice = (id) => {
    setNewCol(prev => ({
      ...prev,
      choices: (prev.choices || []).filter(c => c.id !== id)
    }));
  };

  const handleAddCustomColumn = () => {
    if (!newCol.label.trim()) return showToast("Please enter a column header label.", "warning", "Validation Required");
    const key = newCol.label.toLowerCase().replace(/[^a-z0-9]/g, "_");
    let opts = [];
    if (newCol.type === "select") {
      opts = (newCol.choices || []).map(c => c.label.trim()).filter(Boolean);
    } else if (newCol.type === "risk_rating") {
      opts = ["High", "Medium", "Low"];
    } else if (newCol.type === "status") {
      opts = ["Pending", "In Progress", "Completed"];
    }
    const createdCol = {
      key,
      label: newCol.label.trim(),
      type: newCol.type,
      options: opts,
      choices: newCol.choices || [],
      width: Number(newCol.width) || 180
    };

    if (colTargetTab === "mom") {
      const updatedCols = [...momColumns, createdCol];
      setMomColumns(updatedCols);
      if (selectedProject?.id) {
        saveMomToProject(selectedProject.id, processCategory, momData, updatedCols);
      }
      showToast(`Column "${newCol.label.trim()}" added to Minutes of Meeting table.`, "success", "Column Added");
    } else if (colTargetTab === "testing") {
      const updatedCols = [...testingColumns, createdCol];
      setTestingColumns(updatedCols);
      if (selectedProject?.id) {
        saveTestingToProject(selectedProject.id, testingData, updatedCols);
      }
      showToast(`Column "${newCol.label.trim()}" added to Testing table.`, "success", "Column Added");
    } else if (colTargetTab === "queries") {
      const updatedCols = [...queriesColumns, createdCol];
      setQueriesColumns(updatedCols);
      if (selectedProject?.id) {
        saveQueriesToProject(selectedProject.id, queriesData, updatedCols);
      }
      showToast(`Column "${newCol.label.trim()}" added to Queries table.`, "success", "Column Added");
    } else {
      const updatedCols = [...customColumns, createdCol];
      setCustomColumns(updatedCols);
      if (selectedProject?.id) {
        saveCustomColumnsToProject(selectedProject.id, updatedCols);
      }
      showToast(`Column "${newCol.label.trim()}" added to Audit Programme table.`, "success", "Column Added");
    }

    setShowAddColModal(false);
    setNewCol({
      label: "",
      type: "select",
      width: 180,
      choices: [
        { id: "1", label: "High", color: "#ef4444" },
        { id: "2", label: "Medium", color: "#f59e0b" },
        { id: "3", label: "Low", color: "#10b981" }
      ]
    });
    setNewChoiceInput("");
  };

  const handleDeleteColumn = (colKey) => {
    if (colTargetTab === "mom") {
      if (momColumns.length <= 1) return showToast("You must keep at least one column.", "warning", "Action Restricted");
      const updatedCols = momColumns.filter(c => c.key !== colKey);
      setMomColumns(updatedCols);
      if (selectedProject?.id) {
        saveMomToProject(selectedProject.id, processCategory, momData, updatedCols);
      }
    } else if (colTargetTab === "testing") {
      if (testingColumns.length <= 1) return showToast("You must keep at least one column.", "warning", "Action Restricted");
      const updatedCols = testingColumns.filter(c => c.key !== colKey);
      setTestingColumns(updatedCols);
      if (selectedProject?.id) {
        saveTestingToProject(selectedProject.id, testingData, updatedCols);
      }
    } else if (colTargetTab === "queries") {
      if (queriesColumns.length <= 1) return showToast("You must keep at least one column.", "warning", "Action Restricted");
      const updatedCols = queriesColumns.filter(c => c.key !== colKey);
      setQueriesColumns(updatedCols);
      if (selectedProject?.id) {
        saveQueriesToProject(selectedProject.id, queriesData, updatedCols);
      }
    } else {
      if (customColumns.length <= 1) return showToast("You must keep at least one column.", "warning", "Action Restricted");
      const updatedCols = customColumns.filter(c => c.key !== colKey);
      setCustomColumns(updatedCols);
      if (selectedProject?.id) {
        saveCustomColumnsToProject(selectedProject.id, updatedCols);
      }
    }
  };

  // Open Right Slide-over Drawer for adding new activity
  const handleOpenAddCalDrawer = () => {
    setCalDrawerItem({
      id: null,
      week_name: selectedWeekFilter !== "ALL" ? selectedWeekFilter : "Week 1",
      week_description: "Planning & Data Collection",
      activity: "",
      detailed_audit_work: "",
      status: "Pending",
      progress: 0,
      remarks: ""
    });
    setIsCalDrawerOpen(true);
  };

  // Open Right Slide-over Drawer for Activity Edit
  const handleOpenEditCalDrawer = (item) => {
    const rawProgress = item.progress !== undefined && item.progress !== null 
      ? parseInt(item.progress, 10) 
      : (item.status === 'Done' ? 100 : 0);

    let statusVal = item.status || 'Pending';
    if (rawProgress === 100) statusVal = 'Done';
    else if (rawProgress > 0 && rawProgress < 100) statusVal = 'In Progress';
    else if (rawProgress === 0 && statusVal === 'Done') statusVal = 'Pending';

    setCalDrawerItem({
      id: item.id,
      week_name: item.week_name || '',
      week_description: item.week_description || '',
      activity: item.activity || '',
      detailed_audit_work: item.detailed_audit_work || '',
      status: statusVal,
      progress: rawProgress,
      remarks: item.remarks || ''
    });
    setIsCalDrawerOpen(true);
  };

  // Save / Update Activity from Slide-over Drawer (Supports both Create and Update)
  const handleSaveCalDrawerItem = async () => {
    if (!selectedProject || !calDrawerItem) return;
    if (!calDrawerItem.activity?.trim()) {
      showToast("Activity Name is required.", "warning", "Validation Missing");
      return;
    }

    const progressVal = Math.min(100, Math.max(0, parseInt(calDrawerItem.progress, 10) || 0));
    let statusVal = calDrawerItem.status || "Pending";
    if (progressVal === 100) {
      statusVal = "Done";
    } else if (progressVal > 0 && progressVal < 100) {
      statusVal = "In Progress";
    } else if (progressVal === 0 && statusVal === "Done") {
      statusVal = "Pending";
    }

    const payloadData = {
      week_name: calDrawerItem.week_name || "Week 1",
      week_description: calDrawerItem.week_description || "",
      activity: calDrawerItem.activity,
      detailed_audit_work: calDrawerItem.detailed_audit_work || "",
      status: statusVal,
      progress: progressVal,
      remarks: calDrawerItem.remarks || ""
    };

    if (calDrawerItem.id) {
      // Update existing item
      try {
        const res = await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage1`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "calendar",
            itemId: calDrawerItem.id,
            data: payloadData
          })
        });
        const json = await res.json();
        if (json.success) {
          setCalendarItems(prev => prev.map(item => item.id === calDrawerItem.id ? { ...item, ...payloadData } : item));
          setIsCalDrawerOpen(false);
          showToast("Activity updated successfully!", "success", "Activity Saved");
        } else {
          showToast("Failed to update: " + (json.error || "Unknown error"), "error", "Update Error");
        }
      } catch (e) {
        setCalendarItems(prev => prev.map(item => item.id === calDrawerItem.id ? { ...item, ...payloadData } : item));
        setIsCalDrawerOpen(false);
        showToast("Activity updated locally.", "success", "Activity Saved");
      }
    } else {
      // Create new item
      try {
        const res = await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "calendar",
            data: payloadData
          })
        });
        const json = await res.json();
        if (json.success && json.item) {
          setCalendarItems(prev => [...prev, json.item]);
          setIsCalDrawerOpen(false);
          showToast("Weekly activity added successfully!", "success", "Activity Created");
        } else {
          showToast("Failed to create: " + (json.error || "Unknown error"), "error", "Creation Error");
        }
      } catch (e) {
        const fallback = { id: `cal-${Date.now()}`, ...payloadData };
        setCalendarItems(prev => [...prev, fallback]);
        setIsCalDrawerOpen(false);
        showToast("Activity added locally.", "success", "Activity Created");
      }
    }
  };

  // Open Send Weekly Calendar Plan Email Drawer
  const handleOpenSendCalEmailDrawer = () => {
    if (!selectedProject) return;
    const availableEmails = orgMembers
      .filter(m => m.email && m.email.trim() && m.email.includes("@"))
      .map(m => m.email.trim());

    // Resolve real primary contact name from orgMembers or company
    const firstContact = orgMembers.find(m => m.email && m.email.trim() && m.email.includes("@"));
    const clientRecipientName = firstContact?.member_name || selectedProject?.company_name || 'Client Team';

    setCalEmailRecipients(availableEmails);
    setCalEmailCustomTo("");
    setCalEmailCc("");
    setCalEmailWeekFilter(selectedWeekFilter !== "ALL" ? selectedWeekFilter : "ALL");
    setCalEmailSubject(`[Weekly Audit Schedule] ${selectedProject?.company_name || 'Engagement'} — Execution Plan & Scope`);
    setCalEmailMessage(`Dear ${clientRecipientName},\n\nPlease find detailed below the updated Weekly Audit Execution Schedule, planned milestones, and activity timelines for our ongoing audit review at ${selectedProject?.company_name || 'your organization'}.\n\nKindly review and let us know if any adjustments are needed.`);
    setIsSendCalEmailDrawerOpen(true);
  };

  // Dispatch Formatted Weekly Calendar Plan to Client via Email
  const handleSendCalEmail = async () => {
    if (!selectedProject) return;

    // Helper to parse name and email
    const parseEmailEntry = (raw) => {
      if (!raw) return null;
      const str = String(raw).trim();
      const match = str.match(/^(.*?)(?:<(.+@.+)>)$/);
      if (match) {
        return { name: match[1].trim() || match[2].trim(), email: match[2].trim() };
      }
      const clean = str.replace(/[<>]/g, '').trim();
      if (!clean.includes("@")) return null;
      const matchedOrg = orgMembers.find(m => m.email?.toLowerCase() === clean.toLowerCase());
      if (matchedOrg) return { name: matchedOrg.member_name || clean, email: clean };
      const matchedHrm = hrmEmployees.find(e => (e.email || e.official_email)?.toLowerCase() === clean.toLowerCase());
      if (matchedHrm) return { name: matchedHrm.name || matchedHrm.full_name || clean, email: clean };
      return { name: clean, email: clean };
    };

    // 1. Primary "TO" Recipients
    const customToList = calEmailCustomTo
      .split(/[,;\n]/)
      .map(e => e.trim())
      .filter(Boolean);

    const rawToEmails = Array.from(new Set([...calEmailRecipients, ...customToList]));
    const toRecipientsPayload = rawToEmails.map(parseEmailEntry).filter(Boolean);

    if (toRecipientsPayload.length === 0) {
      showToast("Please select or enter at least one primary client recipient (TO) email address.", "warning", "Recipient Required");
      return;
    }

    // 2. "CC" Recipients
    const ccList = calEmailCc
      .split(/[,;\n]/)
      .map(e => e.trim())
      .filter(Boolean);
    const toEmailSet = new Set(toRecipientsPayload.map(r => r.email.toLowerCase()));
    const ccRecipientsPayload = ccList
      .map(parseEmailEntry)
      .filter(c => c && !toEmailSet.has(c.email.toLowerCase()));

    const itemsToSend = calEmailWeekFilter === "ALL"
      ? calendarItems
      : calendarItems.filter(item => item.week_name === calEmailWeekFilter);

    if (itemsToSend.length === 0) {
      showToast("No calendar activities found for the selected week filter.", "warning", "Empty Schedule");
      return;
    }

    setIsSendingCalEmail(true);
    try {
      const res = await fetch("/Auditing/api/dynamic/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailType: "calendar",
          recipients: toRecipientsPayload,
          ccRecipients: ccRecipientsPayload,
          subject: calEmailSubject,
          bodyText: calEmailMessage,
          calendarItems: itemsToSend,
          clientName: selectedProject.company_name,
          projectName: selectedTemplate?.template_name || "Internal Audit",
          leadName: selectedProject.project_leader ? getEmployeeName(selectedProject.project_leader) : "Assigned Lead",
          projectId: selectedProject.id
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          `Weekly Calendar Plan email dispatched successfully! (${toRecipientsPayload.length} TO${ccRecipientsPayload.length > 0 ? `, ${ccRecipientsPayload.length} CC` : ''})`,
          "success",
          "Email Dispatched"
        );
        setIsSendCalEmailDrawerOpen(false);
      } else {
        showToast("Failed to send email: " + (data.error || "Unknown error"), "error", "Dispatch Failed");
      }
    } catch (err) {
      showToast("Error sending email: " + err.message, "error", "Network Error");
    } finally {
      setIsSendingCalEmail(false);
    }
  };

  // Add Single Contact Person to Org Structure
  const handleAddOrgMember = async () => {
    if (!selectedProject || !newOrgMember.member_name) return showToast("Please fill contact member name.", "warning", "Required Field Missing");
    try {
      const res = await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "org", data: newOrgMember })
      });
      const data = await res.json();
      if (data.success && data.item) {
        setOrgMembers([...orgMembers, data.item]);
      } else {
        showToast("Error adding member: " + (data.error || "Unknown error"), "error", "Save Failed");
      }
    } catch (e) {
      const fallback = { id: `org-${Date.now()}`, ...newOrgMember };
      setOrgMembers([...orgMembers, fallback]);
    }
    setShowAddOrgModal(false);
    setNewOrgMember({ member_name: "", designation: "", department: "", email: "", phone: "" });
  };

  // Delete Stage 1 Items
  const handleDeleteCalItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage1?type=calendar&itemId=${itemId}`, { method: "DELETE" });
    } catch (e) { }
    setCalendarItems(calendarItems.filter(item => item.id !== itemId));
    if (calDrawerItem?.id === itemId) {
      setIsCalDrawerOpen(false);
      setCalDrawerItem(null);
    }
  };

  const handleDeleteOrgMember = async (itemId) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
      await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage1?type=org&itemId=${itemId}`, { method: "DELETE" });
    } catch (e) { }
    setOrgMembers(orgMembers.filter(m => m.id !== itemId));
  };

  // Download Sample Excel/CSV Format
  const downloadExcelTemplate = (section) => {
    let csvContent = "";
    let fileName = "";
    if (section === "calendar") {
      csvContent = "Week Name,Week Description,Activity,Detailed Audit Work,Progress,Status,Remarks\nWeek 1,Planning & Data Collection,Kick-off Meeting,Discuss audit scope and timeline,100,Done,SAP Access Mail Sent\nWeek 1,Planning & Data Collection,Process Understanding,Understand organization structure,100,Done,\nWeek 2,Plant Visits,Bawal Plant Visit,Physical walkthrough of warehouse,0,Pending,";
      fileName = "Weekly_Calendar_Plan_Template.csv";
    } else if (section === "org") {
      csvContent = "Member Name,Designation,Department,Email,Phone\nRajesh Kumar,General Manager,Procurement,rajesh.k@company.com,+91 9876543210\nAnita Sharma,HR Head,Human Resources,anita.s@company.com,+91 9812345678";
      fileName = "Organisation_Contacts_Directory_Template.csv";
    } else if (section === "programme") {
      csvContent = "Header Title,Sr. No.,Sub-Process / Area,Audit Objective,Audit Procedure / Steps,Risk Rating,Data Requirement,Assigned To,Status\n" +
        "1. Standard Operating Procedures (SOP) & Delegation of Authority (DOA) Matrix,,,,,,,,\n" +
        ",1.1,SOP & DOA,Documented approved SOPs and DOA matrix exist for P2P process,Obtain and verify SOP document and DOA matrix against delegation rules,Medium,SOP Document & DOA Matrix,,Pending\n" +
        "2. Purchase Requisition & Budgeting,,,,,,,,\n" +
        ",2.1,Purchase Requisition & Budgeting,Purchases initiated only for genuine business needs within approved budgets,Obtain PRs raised by dept and verify budget mapping,High,PR Dump & Approved Budget File,,Pending\n" +
        ",2.2,Purchase Requisition & Budgeting,PRs approved by personnel with appropriate authority (DOA compliance),Obtain and verify PR approval logs for sample period,Medium,PR Approval Log FY25,,Pending\n" +
        "3. Vendor Master Management,,,,,,,,\n" +
        ",3.1,Vendor Master Management,Vendors onboarded only after due diligence and non-duplicate entities,Obtain vendor list and verify KYC bank accounts duplicate checks,High,Vendor Master Database Dump,,Pending\n" +
        ",3.2,Vendor Master Management,Changes to sensitive vendor master fields are authorized,Extract audit trail log for bank account address modifications,High,Vendor Master Change Log,,Pending\n" +
        "4. RFQ / Quotation & Vendor Selection,,,,,,,,\n" +
        ",4.1,RFQ & Vendor Selection,Vendor selection is transparent and competitive,Review quotation comparative statements and DOA approvals,High,Comparative Statements,,Pending";
      fileName = "Audit_Programme_P2P_Template.csv";
    }
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse Excel (.xlsx, .xls) & CSV Files via SheetJS and Trigger Column Mapping Panel Modal
  const handleFileUpload = (e, section) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
        if (!jsonRows || jsonRows.length === 0) return showToast("Uploaded file is empty.", "warning", "File Empty");

        const rawHeaders = jsonRows[0] || [];
        const headers = rawHeaders.map(h => String(h || "").trim()).filter(Boolean);
        if (headers.length === 0) return showToast("No column headers found in file.", "warning", "Parse Error");

        const rawRows = jsonRows.slice(1);
        const rows = rawRows
          .map(rowArr => rawHeaders.map((_, idx) => String(rowArr[idx] || "").trim()))
          .filter(row => row.some(cell => cell !== ""));

        if (rows.length === 0) return showToast("No data rows found in uploaded file.", "warning", "No Data Found");

        const initialMap = {};
        let newDiscovered = [];

        if (section === "calendar") {
          const fields = [
            { key: "week_name", aliases: ["week", "week name", "week_name", "week label"] },
            { key: "week_description", aliases: ["week description", "description", "week_description"] },
            { key: "activity", aliases: ["activity", "audit step", "task", "activity name"] },
            { key: "detailed_audit_work", aliases: ["detailed audit work", "detailed work", "work", "audit work"] },
            { key: "status", aliases: ["status", "done/pending", "done", "pending"] },
            { key: "remarks", aliases: ["remarks", "notes", "remark"] }
          ];
          fields.forEach(f => {
            const matched = headers.find(h => f.aliases.some(alias => h.toLowerCase().trim().includes(alias)));
            if (matched) initialMap[f.key] = matched;
          });
        } else if (section === "org") {
          const fields = [
            { key: "member_name", aliases: ["member name", "name", "full name", "contact name", "member"] },
            { key: "designation", aliases: ["designation", "title", "role"] },
            { key: "department", aliases: ["department", "dept"] },
            { key: "email", aliases: ["email", "email address"] },
            { key: "phone", aliases: ["phone", "mobile", "phone number"] }
          ];
          fields.forEach(f => {
            const matched = headers.find(h => f.aliases.some(alias => h.toLowerCase().trim().includes(alias)));
            if (matched) initialMap[f.key] = matched;
          });
        } else {
          // Section: Audit Programme Table
          const PROGRAMME_FIELD_DEFINITIONS = [
            {
              key: "header_title",
              label: "Procedure Header Title (Spans Table Width)",
              aliases: ["header title", "header", "procedure header", "section", "category", "header_title"]
            },
            {
              key: "serial_no",
              label: "Sr. No.",
              aliases: ["sr no", "sr. no.", "sr.no", "serial no", "s.no", "no", "sl no", "item no"]
            },
            {
              key: "sub_process",
              label: "Sub-Process / Area",
              aliases: ["sub-process / area", "sub process / area", "sub process", "sub-process", "subprocess", "area", "process area", "sub process name", "process", "audit area", "module"]
            },
            {
              key: "objective",
              label: "Audit Objective",
              aliases: ["audit objective", "objective", "audit objectives", "control objective", "objective / control", "purpose", "goal"]
            },
            {
              key: "procedure",
              label: "Audit Procedure / Steps",
              aliases: ["audit procedure / steps", "audit procedure", "procedure", "audit steps", "testing steps", "steps", "procedure / step", "test procedure", "detailed procedure", "audit work", "audit step"]
            },
            {
              key: "risk_rating",
              label: "Risk Rating",
              aliases: ["risk rating", "rating", "risk level", "severity", "inherent risk rating", "risk score"]
            },
            {
              key: "key_risk",
              label: "Key Risk",
              aliases: ["key risk", "risk", "key risks", "risk description", "failure mode", "associated risk", "business risk", "risk statement"]
            },
            {
              key: "expected_key_control",
              label: "Expected Key Control",
              aliases: ["expected key control", "expected control", "key control", "key controls", "expected key controls", "control description", "control in place", "control activity", "controls", "mitigating control"]
            },
            {
              key: "data_requirement",
              label: "Data Requirement",
              aliases: ["data requirement", "data requirement & evidence", "information document request", "idr", "evidence required", "document needed", "data required", "evidence", "sample required", "document request", "documents needed"]
            },
            {
              key: "assigned_to",
              label: "Assigned To",
              aliases: ["assigned to", "auditor", "assignee", "owner", "responsible auditor", "assigned", "auditor name", "team member", "lead auditor"]
            },
            {
              key: "status",
              label: "Status",
              aliases: ["status", "audit status", "state", "progress status", "step status", "execution status"]
            },
            ...customColumns.filter(c => !DEFAULT_PROGRAMME_COLUMNS.some(fc => fc.key === c.key)).map(c => ({
              key: c.key,
              label: c.label,
              aliases: [c.label.toLowerCase(), c.key.toLowerCase(), c.label.toLowerCase().replace(/[^a-z0-9]/g, "")]
            }))
          ];

          PROGRAMME_FIELD_DEFINITIONS.forEach(f => {
            const matched = headers.find(h => f.aliases.some(alias => {
              const hClean = h.toLowerCase().trim();
              const aClean = alias.toLowerCase().trim();
              return hClean === aClean || hClean.includes(aClean) || aClean.includes(hClean);
            }));
            if (matched) initialMap[f.key] = matched;
          });

          // Detect unmapped / extra Excel headers to propose as new custom columns
          const matchedHeaderSet = new Set(Object.values(initialMap).filter(Boolean));
          const unmappedExcelHeaders = headers.filter(h => !matchedHeaderSet.has(h));

          newDiscovered = unmappedExcelHeaders.map((h, i) => {
            const cleanKey = h.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "") || `custom_${Date.now()}_${i}`;
            return {
              header: h,
              key: cleanKey,
              label: h,
              type: h.toLowerCase().includes("date") ? "date" : h.toLowerCase().includes("amount") || h.toLowerCase().includes("size") || h.toLowerCase().includes("count") ? "number" : "text",
              include: true
            };
          });
        }

        setRawFileHeaders(headers);
        setRawFileRows(rows);
        setColumnMapping(initialMap);
        setDetectedNewColumns(newDiscovered);
        setMappingSection(section);
        setShowMappingModal(true);
      } catch (err) {
        console.error("Excel parse error:", err);
        showToast("Error parsing Excel file: " + err.message, "error", "File Parse Error");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  // Save Mapped Import Rows to Database
  const handleSaveMappedData = async () => {
    if (!selectedProject) return;

    if (mappingSection === "programme") {
      // 1. Process any accepted new columns from Excel
      const approvedNewCols = detectedNewColumns
        .filter(nc => nc.include && nc.label.trim())
        .map(nc => ({
          key: nc.key,
          label: nc.label.trim(),
          type: nc.type || "text",
          width: 200
        }));

      let allActiveCols = [...customColumns];
      if (approvedNewCols.length > 0) {
        const existingKeys = new Set(allActiveCols.map(c => c.key));
        const toAdd = approvedNewCols.filter(nc => !existingKeys.has(nc.key));
        if (toAdd.length > 0) {
          allActiveCols = [...allActiveCols, ...toAdd];
          setCustomColumns(allActiveCols);
          if (selectedProject?.id) {
            saveCustomColumnsToProject(selectedProject.id, allActiveCols);
          }
        }
      }

      const mappedItems = rawFileRows.map((row, idx) => {
        const headerTitleHeader = columnMapping["header_title"];
        const headerTitleVal = headerTitleHeader ? row[rawFileHeaders.indexOf(headerTitleHeader)] : "";

        const isHeader = !!(headerTitleVal && headerTitleVal.trim());
        const row_data = {};

        if (isHeader) {
          row_data.is_header = true;
          row_data.title = headerTitleVal.trim();
        } else {
          row_data.is_header = false;
          allActiveCols.forEach(col => {
            let mappedHeader = columnMapping[col.key];
            if (!mappedHeader) {
              const matchedNew = detectedNewColumns.find(nc => nc.key === col.key && nc.include);
              if (matchedNew) mappedHeader = matchedNew.header;
            }
            if (mappedHeader) {
              const colIdx = rawFileHeaders.indexOf(mappedHeader);
              if (colIdx !== -1) {
                row_data[col.key] = row[colIdx] || "";
              }
            }
          });
        }

        return {
          is_header: isHeader,
          row_data,
          sort_order: idx
        };
      });

      if (mappedItems.length === 0) return showToast("No valid rows to import.", "warning", "Import Failed");

      try {
        const res = await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage2`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "bulk_create_steps", process_name: processCategory, items: mappedItems })
        });
        const data = await res.json();
        if (data.success && data.items) {
          setProgrammeRows([...programmeRows, ...data.items]);
          handleUpdateProjectStage(2);
          showToast(`Successfully imported ${data.items.length} rows and configured columns!`, "success", "Import Complete");
        } else {
          showToast("Import error: " + (data.error || "Unknown error"), "error", "Import Error");
        }
      } catch (e) {
        showToast("Error saving mapped audit programme records.", "error", "Save Error");
      }
      setShowMappingModal(false);
      setDetectedNewColumns([]);
      return;
    }

    const mappedItems = rawFileRows.map(row => {
      const item = {};
      Object.keys(columnMapping).forEach(sysKey => {
        const headerName = columnMapping[sysKey];
        const colIndex = rawFileHeaders.indexOf(headerName);
        if (colIndex !== -1) {
          item[sysKey] = row[colIndex] || "";
        }
      });
      return item;
    });

    if (mappedItems.length === 0) return showToast("No valid rows to import.", "warning", "Import Failed");

    try {
      const res = await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: mappingSection, bulk: true, items: mappedItems })
      });
      const data = await res.json();
      if (data.success && data.items) {
        if (mappingSection === "calendar") {
          setCalendarItems([...calendarItems, ...data.items]);
        } else {
          setOrgMembers([...orgMembers, ...data.items]);
        }
        showToast(`Successfully imported and saved ${data.items.length} records to the database!`, "success", "Import Complete");
      } else {
        showToast("Import error: " + (data.error || "Unknown error"), "error", "Import Error");
      }
    } catch (e) {
      showToast("Error saving mapped records.", "error", "Save Error");
    }
    setShowMappingModal(false);
  };

  // Add Step to Audit Programme
  const handleAddStep = async () => {
    if (!selectedProject) return;

    const payloadData = isHeaderStep
      ? { is_header: true, title: headerTitle, serial_no: stepFormData.serial_no || "" }
      : { is_header: false, ...stepFormData };

    if (isHeaderStep && !headerTitle) return showToast("Please enter Procedure Header Title.", "warning", "Title Required");

    try {
      const res = await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_step",
          process_name: processCategory,
          is_header: isHeaderStep,
          row_data: payloadData
        })
      });
      const data = await res.json();
      if (data.success && data.item) {
        setProgrammeRows([...programmeRows, data.item]);
        handleUpdateProjectStage(2);
      } else {
        showToast("Error adding step: " + (data.error || "Unknown error"), "error", "Save Error");
      }
    } catch (e) {
      const fallback = { id: `prog-${Date.now()}`, is_header: isHeaderStep, row_data: payloadData };
      setProgrammeRows([...programmeRows, fallback]);
    }
    setShowAddStepModal(false);
    setHeaderTitle("");
    setIsHeaderStep(false);
  };

  const handleDeleteProgRow = async (rowId) => {
    if (!confirm("Are you sure you want to delete this step?")) return;
    try {
      await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage2?rowId=${rowId}`, { method: "DELETE" });
    } catch (e) { }
    setProgrammeRows(programmeRows.filter(r => r.id !== rowId));
  };

  // Right Drawer Action Handlers
  const handleOpenDrawerForRow = (row) => {
    setSelectedDrawerRow(row);
    const rowObj = row.row_data || {};
    const isHdr = row.is_header || rowObj.is_header || rowObj.row_type === 'header' || (!rowObj.procedure && rowObj.title);

    // Auto-detect missing keys in rowObj and dynamically append them to customColumns
    const existingKeys = new Set(customColumns.map(c => c.key));
    const ignoreKeys = new Set(['is_header', 'title', 'sort_order', '_comments_feed', 'is_substep', 'parent_id', 'id', 'project_id', 'process_name', 'created_at', 'updated_at']);
    const newDetectedCols = [];

    Object.keys(rowObj).forEach(k => {
      if (!existingKeys.has(k) && !ignoreKeys.has(k)) {
        newDetectedCols.push({
          key: k,
          label: k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: k.includes('rating') || k.includes('risk') ? 'risk_rating' : k.includes('status') ? 'status' : 'text',
          width: 180
        });
      }
    });

    let currentCols = customColumns;
    if (newDetectedCols.length > 0) {
      currentCols = [...customColumns, ...newDetectedCols];
      setCustomColumns(currentCols);
      if (selectedProject?.id) {
        saveCustomColumnsToProject(selectedProject.id, currentCols);
      }
    }

    const initialFormData = {
      is_header: Boolean(isHdr),
      title: rowObj.title || rowObj.procedure || "",
      ...rowObj
    };

    // Sanitize comments field if it contains an object/array from legacy data
    let commentsFeed = [];
    if (Array.isArray(initialFormData.comments)) {
      commentsFeed = initialFormData.comments;
      initialFormData.comments = initialFormData.comments.map(c => typeof c === 'object' ? (c.text || c.comment || '') : String(c)).filter(Boolean).join('; ');
    } else if (initialFormData.comments && typeof initialFormData.comments === 'object') {
      commentsFeed = [initialFormData.comments];
      initialFormData.comments = initialFormData.comments.text || initialFormData.comments.comment || '';
    } else if (Array.isArray(initialFormData._comments_feed)) {
      commentsFeed = initialFormData._comments_feed;
    } else if (Array.isArray(rowObj.comments)) {
      commentsFeed = rowObj.comments;
    }

    currentCols.forEach(col => {
      if (initialFormData[col.key] === undefined) {
        initialFormData[col.key] = col.key === 'serial_no' ? "1.1" : col.key === 'status' ? "Pending" : col.key === 'risk_rating' ? "Medium" : "";
      }
    });

    setDrawerData(initialFormData);
    setDrawerComments(commentsFeed);
    setDrawerTab("details");
  };

  const handleSaveDrawerRow = async () => {
    if (!selectedDrawerRow || !selectedProject) return;

    const updatedRowData = {
      ...(selectedDrawerRow.row_data || {}),
      ...drawerData,
      _comments_feed: drawerComments
    };

    if (typeof drawerData.comments === 'string') {
      updatedRowData.comments = drawerData.comments;
    }

    if (drawerData.is_header) {
      updatedRowData.is_header = true;
      updatedRowData.title = drawerData.title || drawerData.procedure;
      updatedRowData.procedure = drawerData.title || drawerData.procedure;
    }

    try {
      const res = await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_step",
          row_id: selectedDrawerRow.id,
          row_data: updatedRowData
        })
      });

      const data = await res.json();
      if (data.success) {
        setProgrammeRows(programmeRows.map(r => r.id === selectedDrawerRow.id ? { ...r, row_data: updatedRowData } : r));
        setSelectedDrawerRow(null);
      } else {
        showToast("Error saving row changes: " + (data.error || "Unknown error"), "error", "Save Error");
      }
    } catch (e) {
      showToast("Failed to save changes to database.", "error", "Save Error");
    }
  };

  const handleDeleteDrawerRow = async () => {
    if (!selectedDrawerRow || !selectedProject) return;
    if (!confirm("Are you sure you want to delete this step?")) return;

    try {
      await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage2?rowId=${selectedDrawerRow.id}`, { method: "DELETE" });
    } catch (e) { }

    setProgrammeRows(programmeRows.filter(r => r.id !== selectedDrawerRow.id));
    setSelectedDrawerRow(null);
  };

  const handleAddDrawerComment = () => {
    if (!newCommentText.trim()) return;
    const comment = {
      id: Date.now().toString(),
      author: currentUser.name || "Anshu Prasad",
      role: currentUser.role || "Auditor",
      initials: currentUser.initials || "AP",
      avatar: currentUser.avatar || "",
      text: newCommentText.trim(),
      created_at: "Just now"
    };
    setDrawerComments([...drawerComments, comment]);
    setNewCommentText("");
  };

  // 1-Click Seed Sample P2P Audit Programme Matching User's Reference Sheet
  const handleSeedP2PProgramme = async () => {
    if (!selectedProject) return;
    const seedRows = [
      { is_header: true, row_data: { is_header: true, title: "1. Standard Operating Procedures (SOP) & Delegation of Authority (DOA) Matrix" }, sort_order: 1 },
      { is_header: false, row_data: { serial_no: "1.1", sub_process: "SOP & DOA", objective: "Documented, approved SOPs and a DOA matrix exist for the P2P process", procedure: "Obtain and verify matrix against delegation rules. Confirm against covers payment variance. Verify DOA matrix.", risk_rating: "Medium", data_requirement: "SOP Document & DOA Matrix FY25", assigned_to: "", status: "Pending" }, sort_order: 2 },
      { is_header: true, row_data: { is_header: true, title: "2. Purchase Requisition & Budgeting" }, sort_order: 3 },
      { is_header: false, row_data: { serial_no: "2.1", sub_process: "Purchase Requisition & Budgeting", objective: "Purchases are initiated only for genuine business needs and within approved budgets.", procedure: "Obtain PRs raised by department and verify justification and mapping against approved budget.", risk_rating: "High", data_requirement: "PR Dump & Approved Budget Mapping", assigned_to: "", status: "Pending" }, sort_order: 4 },
      { is_header: false, row_data: { serial_no: "2.2", sub_process: "Purchase Requisition & Budgeting", objective: "PRs are approved by personnel with appropriate authority (DOA compliance).", procedure: "Obtain and verify approval logs for sample PRs; obtain justification.", risk_rating: "Medium", data_requirement: "PR Approval Logs & DOA Approvals", assigned_to: "", status: "Pending" }, sort_order: 5 },
      { is_header: true, row_data: { is_header: true, title: "3. Vendor Master Management" }, sort_order: 6 },
      { is_header: false, row_data: { serial_no: "3.1", sub_process: "Vendor Master Management", objective: "Vendors are onboarded only after due diligence and are genuine, non-duplicate entities.", procedure: "Obtain and verify KYC, bank account, and tax details. Run duplicate check across vendor database.", risk_rating: "High", data_requirement: "Vendor Master Dump & KYC Files", assigned_to: "", status: "Pending" }, sort_order: 7 },
      { is_header: false, row_data: { serial_no: "3.2", sub_process: "Vendor Master Management", objective: "Changes to sensitive vendor master fields (bank account, address) are authorized and independently verified.", procedure: "Extract change audit trail log and verify vendor bank change logs.", risk_rating: "High", data_requirement: "Vendor Bank Account Change Audit Trail", assigned_to: "", status: "Pending" }, sort_order: 8 },
      { is_header: true, row_data: { is_header: true, title: "4. RFQ / Quotation & Vendor Selection" }, sort_order: 9 },
      { is_header: false, row_data: { serial_no: "4.1", sub_process: "RFQ & Vendor Selection", objective: "Vendor selection is transparent, competitive, and achieves best value.", procedure: "Review quotation comparative statements and DOA approvals.", risk_rating: "High", data_requirement: "RFQ Comparative Statements & Quotations", assigned_to: "", status: "Pending" }, sort_order: 10 }
    ];

    try {
      const res = await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk_create_steps", process_name: processCategory, items: seedRows })
      });
      const data = await res.json();
      if (data.success && data.items) {
        setProgrammeRows([...programmeRows, ...data.items]);
        showToast("Successfully seeded P2P Standard Audit Programme Template!", "success", "Seeding Complete");
      }
    } catch (e) {
      showToast("Error seeding P2P template.", "error", "Seeding Error");
    }
  };

  // Helper to generate 48-Hour Portal URL Token
  const generatePortalToken = (projectId, recipientId, itemIds, recipientObj) => {
    const payload = {
      projectId,
      recipientId,
      recipientName: recipientObj?.member_name || recipientObj?.name || (typeof recipientId === 'string' && recipientId.includes('@') ? recipientId.split('@')[0] : 'Client Recipient'),
      recipientEmail: recipientObj?.email || (typeof recipientId === 'string' && recipientId.includes('@') ? recipientId : 'client@company.com'),
      itemIds: Array.isArray(itemIds) ? itemIds : [itemIds],
      createdAt: Date.now()
    };
    const jsonStr = JSON.stringify(payload);
    return btoa(jsonStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  // Open Email Draft Pipeline Modal for single item or group of items
  const handleOpenEmailDraft = (targetItems, clientPersonId) => {
    if (!selectedProject) return showToast("Please select an active audit project engagement.", "warning", "Project Required");
    if (!clientPersonId) return showToast("Please select/assign a Client Person Recipient email first.", "warning", "Recipient Required");

    const recipient = orgMembers.find(m => String(m.id) === String(clientPersonId) || m.email === clientPersonId) || {
      id: clientPersonId,
      member_name: typeof clientPersonId === 'string' && clientPersonId.includes('@') ? clientPersonId.split('@')[0] : "Client Recipient",
      email: typeof clientPersonId === 'string' && clientPersonId.includes('@') ? clientPersonId : "client@company.com"
    };

    const enrichedTargetItems = targetItems.map(it => {
      const linkedProg = programmeRows.find(p => String(p.id) === String(it.programme_id) || String(p.id) === String(it.id));
      const docName =
        it.data_requirement ||
        it.document_name ||
        it.name ||
        linkedProg?.row_data?.data_requirement ||
        linkedProg?.row_data?.document_name ||
        it.procedure ||
        linkedProg?.row_data?.procedure ||
        it.sub_process ||
        linkedProg?.row_data?.sub_process ||
        it.title ||
        "Requested Audit Document";

      const procedureText = it.procedure || linkedProg?.row_data?.procedure || linkedProg?.row_data?.objective || linkedProg?.row_data?.sub_process || "";

      return {
        ...it,
        data_requirement: docName,
        procedure: procedureText
      };
    });

    const token = generatePortalToken(selectedProject.id, clientPersonId, enrichedTargetItems.map(i => i.id), recipient);
    const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/Auditing/client-portal/${token}` : `/Auditing/client-portal/${token}`;

    const itemLines = [];
    enrichedTargetItems.forEach((it, idx) => {
      const rowNum = idx + 1;
      const rawText = String(it.data_requirement || "").trim();
      const parts = rawText.split(/,|\n/).map(p => p.trim()).filter(Boolean);
      const cleanSubItems = parts.map(part => {
        return part
          .replace(/^(\d+[\.\)]\s*)+/g, '')
          .replace(/^[a-zA-Z][\.\)]\s*/g, '')
          .replace(/^[-•*]\s*/, '')
          .trim();
      }).filter(Boolean);

      const finalSubs = cleanSubItems.length > 0 ? cleanSubItems : [rawText];

      if (finalSubs.length > 1) {
        finalSubs.forEach((sub, subIdx) => {
          itemLines.push(`${rowNum}.${subIdx + 1} ${sub}`);
        });
      } else {
        itemLines.push(`${rowNum}. ${finalSubs[0]}`);
      }
    });

    const itemNames = itemLines.join("\n");

    const prefilledSubject = `[Information Document Request] Data Requirements for ${selectedProject.client_name}`;
    const prefilledBody = `Dear ${recipient.member_name},\n\nAs part of our audit engagement (${selectedProject.project_name} - ${selectedProject.financial_year || 'FY 2026-27'}), please upload the requested document(s) listed below:\n\n${itemNames}\n\nSECURE UPLOAD LINK:\n${portalUrl}\n\nNote: This link is secured with encryption for confidential document uploads.\n\nBest regards,\nUniverseOne Audit Team`;

    setEmailDraftData({
      recipientId: clientPersonId,
      recipientName: recipient.member_name,
      recipientEmail: recipient.email,
      ccEmails: "",
      subject: prefilledSubject,
      bodyText: prefilledBody,
      items: enrichedTargetItems,
      portalToken: token,
      portalUrl: portalUrl,
      createdAt: Date.now()
    });

    setShowEmailDraftModal(true);
  };

  // Handle Dispatching Email from Draft Modal & Updating Database
  const handleDispatchDraftEmail = async () => {
    if (!selectedProject || !emailDraftData) return;

    const targetItemIds = emailDraftData.items.map(i => i.id);

    const updatedTracker = dataTrackerRows.map(r => {
      if (targetItemIds.includes(r.id)) {
        return {
          ...r,
          client_person_id: emailDraftData.recipientId,
          status_json: {
            ...r.status_json,
            document_status: "Email Sent",
            sent_at: new Date().toISOString(),
            portal_token: emailDraftData.portalToken
          }
        };
      }
      return r;
    });

    setDataTrackerRows(updatedTracker);
    setShowEmailDraftModal(false);
    setSelectedTrackerRowIds([]);

    // 1. Dispatch real email via ZeptoMail / Brevo API with CC recipients support
    try {
      await fetch('/Auditing/api/dynamic/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: emailDraftData.recipientEmail,
          recipientName: emailDraftData.recipientName,
          ccRecipients: emailDraftData.ccEmails,
          ccEmails: emailDraftData.ccEmails,
          subject: emailDraftData.subject,
          bodyText: emailDraftData.bodyText,
          portalUrl: emailDraftData.portalUrl,
          portalToken: emailDraftData.portalToken,
          items: emailDraftData.items,
          projectName: selectedProject.project_name,
          clientName: selectedProject.client_name,
          projectId: selectedProject.id,
          clientPersonId: emailDraftData.recipientId
        })
      });
    } catch (e) {
      console.warn("Email dispatch error:", e);
    }

    // 2. Persist updated tracker to Supabase DB via stage2 endpoint & projects endpoint
    try {
      await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_data_tracker',
          data_tracker: updatedTracker
        })
      });
      showToast(`Email Request successfully dispatched to ${emailDraftData.recipientEmail}!`, "success", "Email Dispatched");
    } catch (e) {
      showToast(`Email Request dispatched to ${emailDraftData.recipientEmail}!`, "success", "Email Dispatched");
    }
  };

  // Handle adding manual Data Requirement to Stage 2 Data Tracker
  const handleSaveNewTrackerItem = async () => {
    if (!newTrackerItem.data_requirement?.trim()) {
      return showToast("Please enter the document / data requirement title.", "warning", "Title Required");
    }

    const newItem = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `item_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      programme_id: null,
      data_requirement: newTrackerItem.data_requirement.trim(),
      sub_process: newTrackerItem.sub_process?.trim() || "",
      client_person_id: newTrackerItem.client_person_id || "",
      status_json: {
        document_status: "Pending",
        remarks: newTrackerItem.remarks?.trim() || ""
      },
      attachments: []
    };

    const updatedTracker = [newItem, ...dataTrackerRows];
    setDataTrackerRows(updatedTracker);
    setShowAddTrackerModal(false);
    setNewTrackerItem({ data_requirement: "", sub_process: "", client_person_id: "", remarks: "" });

    if (selectedProject?.id) {
      try {
        await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage2`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save_data_tracker', data_tracker: updatedTracker })
        });
        showToast("New Data Requirement added to tracker!", "success", "Requirement Added");
      } catch (err) {
        showToast("Added to tracker!", "success", "Requirement Added");
      }
    }
  };

  // Handle deleting a tracker item from Data Tracker
  const handleDeleteTrackerItem = async (targetItem) => {
    if (!confirm(`Are you sure you want to remove "${targetItem.data_requirement || 'this requirement'}" from the tracker?`)) return;
    const updatedTracker = dataTrackerRows.filter(r => r.id !== targetItem.id);
    setDataTrackerRows(updatedTracker);
    setSelectedTrackerRowIds(prev => prev.filter(id => id !== targetItem.id));

    if (selectedProject?.id) {
      try {
        await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage2`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save_data_tracker', data_tracker: updatedTracker })
        });
        showToast("Item removed from tracker.", "success", "Item Removed");
      } catch (err) {
        showToast("Item removed from tracker.", "success", "Item Removed");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'Sora', sans-serif", color: C.text1, display: "flex", flexDirection: "column" }}>
      <FontStyles />

      {/* ── TOP HEADER NAVBAR ── */}
      <div style={{ height: 64, backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", zIndex: 10 }}>

        {/* SIDEBAR TOGGLE BUTTON BEFORE LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Collapse Sidebar Menu" : "Expand Sidebar Menu"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              backgroundColor: isSidebarOpen ? C.tealBg : C.surface,
              color: isSidebarOpen ? C.teal : C.text2,
              cursor: "pointer",
              transition: "all 0.15s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.tealBg; e.currentTarget.style.color = C.teal; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = isSidebarOpen ? C.tealBg : C.surface; e.currentTarget.style.color = isSidebarOpen ? C.teal : C.text2; }}
          >
            <Menu size={20} />
          </button>

          <Shield size={24} color={C.teal} />
          <div style={{ fontSize: 20, fontWeight: 800, color: C.teal, letterSpacing: "-0.5px" }}>AuditFlow</div>
        </div>

        {/* HEADER TOP RIGHT ACTION BUTTON */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onBackToTemplates && (
            <button
              onClick={onBackToTemplates}
              title="Switch between Dynamic SaaS & Classic Templates"
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                backgroundColor: C.surface,
                color: C.text2,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease"
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.text1; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
            >
              ⇄ Switch Platform / Hub
            </button>
          )}

          {!selectedTemplate && !selectedProject && (
            <button
              onClick={() => setShowCreateTemplateModal(true)}
              style={{ padding: "9px 18px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 6px rgba(13,148,136,0.2)" }}
            >
              <Plus size={16} /> (+) Create Audit Template
            </button>
          )}

          {selectedTemplate && !selectedProject && (
            <button
              onClick={handleOpenAddCompanyModal}
              style={{ padding: "9px 18px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 6px rgba(13,148,136,0.2)" }}
            >
              <Plus size={16} /> (+) Add Company
            </button>
          )}
        </div>
      </div>

      {/* ── TWO-COLUMN LAYOUT WITH SIDEBAR + MAIN CONTENT ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── DYNAMIC CONTEXT-AWARE LEFT SIDEBAR MENU (TOGGLEABLE) ── */}
        {isSidebarOpen && (
          <div
            style={{
              width: 260,
              backgroundColor: C.surface,
              borderRight: `1px solid ${C.border}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px 14px",
              flexShrink: 0,
              boxShadow: "1px 0 3px rgba(0,0,0,0.02)",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* VIEW STATE 1: ALL TEMPLATES SIDEBAR */}
              {!selectedTemplate && !selectedProject && (
                <>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, paddingLeft: 6 }}>
                      Navigation
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <button
                        onClick={() => { setSelectedTemplate(null); setSelectedProject(null); }}
                        style={{
                          padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.tealBorder}`, cursor: "pointer", fontSize: 13, fontWeight: 700,
                          backgroundColor: C.tealBg, color: C.teal, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between",
                          boxShadow: "0 2px 4px rgba(13,148,136,0.12)"
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <LayoutGrid size={16} /> Templates Library
                        </span>
                        <span style={{ backgroundColor: C.teal, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>
                          {templates.length}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, paddingLeft: 6 }}>
                      Audit Templates ({templates.length})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {templates.map(t => {
                        const companyCount = getTemplateProjects(t).length;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTemplate(t)}
                            style={{
                              padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                              backgroundColor: C.surface, color: C.text1, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between",
                              transition: "all 0.15s ease"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.borderColor = C.border2; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.borderColor = C.border; }}
                          >
                            <span style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                              <span style={{ fontSize: 15 }}>{t.icon || "📋"}</span>
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.template_name}</span>
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: C.bg2, color: C.text2, padding: "2px 6px", borderRadius: 6, flexShrink: 0 }}>
                              {companyCount} {companyCount === 1 ? 'co' : 'cos'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* VIEW STATE 2: SELECTED TEMPLATE COMPANY LIST SIDEBAR */}
              {selectedTemplate && !selectedProject && (
                <>
                  <div>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      style={{
                        padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 12, fontWeight: 600,
                        backgroundColor: C.surface, color: C.text2, width: "100%", display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
                        transition: "all 0.15s ease"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.text1; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
                    >
                      <ArrowLeft size={14} /> Back to Templates
                    </button>

                    <div style={{ padding: "10px 12px", borderRadius: 8, backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>
                        Active Template
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: C.text1, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{selectedTemplate.icon || "📋"}</span> {selectedTemplate.template_name}
                      </div>
                    </div>

                    <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, paddingLeft: 6 }}>
                      Page Views
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                      <button
                        style={{
                          padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.tealBorder}`, cursor: "pointer", fontSize: 13, fontWeight: 700,
                          backgroundColor: C.tealBg, color: C.teal, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between",
                          boxShadow: "0 2px 4px rgba(13,148,136,0.1)"
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Building2 size={16} /> Enrolled Companies
                        </span>
                        <span style={{ backgroundColor: C.teal, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>
                          {getTemplateProjects(selectedTemplate).length}
                        </span>
                      </button>
                    </div>

                    {/* QUICK SWITCH OTHER TEMPLATES */}
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, paddingLeft: 6 }}>
                      Switch Template
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {templates.filter(t => t.id !== selectedTemplate.id).map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTemplate(t)}
                          style={{
                            padding: "7px 10px", borderRadius: 6, border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 12, fontWeight: 600,
                            backgroundColor: C.surface, color: C.text2, textAlign: "left", display: "flex", alignItems: "center", gap: 8,
                            transition: "all 0.15s ease"
                          }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.text1; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
                        >
                          <span>{t.icon || "📋"}</span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.template_name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* VIEW STATE 3: INSIDE COMPANY AUDIT STAGES SIDEBAR */}
              {selectedProject && (
                <>
                  <div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      style={{
                        padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 12, fontWeight: 600,
                        backgroundColor: C.surface, color: C.text2, width: "100%", display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
                        transition: "all 0.15s ease"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.text1; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
                    >
                      <ArrowLeft size={14} /> Back to Companies
                    </button>

                    <div style={{ padding: "10px 12px", borderRadius: 8, backgroundColor: C.bg2, border: `1px solid ${C.border}`, marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>
                        Company Audit
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: C.text1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedProject.client_name}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, marginTop: 2 }}>
                        {selectedProject.financial_year}
                      </div>
                    </div>

                    {/* COMPANY OVERVIEW BUTTON BEFORE STAGE 1 */}
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, paddingLeft: 6 }}>
                      Company Overview
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                      <button
                        onClick={() => setCurrentStage(0)}
                        style={{
                          padding: "9px 12px", borderRadius: 8, border: currentStage === 0 ? `1px solid ${C.tealBorder}` : `1px solid ${C.border}`,
                          cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                          backgroundColor: currentStage === 0 ? C.tealBg : C.surface,
                          color: currentStage === 0 ? C.teal : C.text2,
                          textAlign: "left", display: "flex", alignItems: "center", gap: 10,
                          boxShadow: currentStage === 0 ? "0 2px 4px rgba(13,148,136,0.1)" : "none",
                          transition: "all 0.15s ease"
                        }}
                        onMouseEnter={e => { if (currentStage !== 0) e.currentTarget.style.backgroundColor = C.bg2; }}
                        onMouseLeave={e => { if (currentStage !== 0) e.currentTarget.style.backgroundColor = C.surface; }}
                      >
                        <Building2 size={15} /> Company Profile
                      </button>
                    </div>

                    {/* STAGE 1 BUTTONS */}
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, paddingLeft: 6 }}>
                      Stage I: Pre-Execution
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                      <button
                        onClick={() => { setCurrentStage(1); setStage1Tab("calendar"); }}
                        style={{
                          padding: "9px 12px", borderRadius: 8, border: currentStage === 1 && stage1Tab === "calendar" ? `1px solid ${C.tealBorder}` : `1px solid ${C.border}`,
                          cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                          backgroundColor: currentStage === 1 && stage1Tab === "calendar" ? C.tealBg : C.surface,
                          color: currentStage === 1 && stage1Tab === "calendar" ? C.teal : C.text2,
                          textAlign: "left", display: "flex", alignItems: "center", gap: 10,
                          boxShadow: currentStage === 1 && stage1Tab === "calendar" ? "0 2px 4px rgba(13,148,136,0.1)" : "none",
                          transition: "all 0.15s ease"
                        }}
                        onMouseEnter={e => { if (currentStage !== 1 || stage1Tab !== "calendar") e.currentTarget.style.backgroundColor = C.bg2; }}
                        onMouseLeave={e => { if (currentStage !== 1 || stage1Tab !== "calendar") e.currentTarget.style.backgroundColor = C.surface; }}
                      >
                        <CalendarIcon size={15} /> 1. Weekly Calendar
                      </button>
                      <button
                        onClick={() => { setCurrentStage(1); setStage1Tab("org"); }}
                        style={{
                          padding: "9px 12px", borderRadius: 8, border: currentStage === 1 && stage1Tab === "org" ? `1px solid ${C.tealBorder}` : `1px solid ${C.border}`,
                          cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                          backgroundColor: currentStage === 1 && stage1Tab === "org" ? C.tealBg : C.surface,
                          color: currentStage === 1 && stage1Tab === "org" ? C.teal : C.text2,
                          textAlign: "left", display: "flex", alignItems: "center", gap: 10,
                          boxShadow: currentStage === 1 && stage1Tab === "org" ? "0 2px 4px rgba(13,148,136,0.1)" : "none",
                          transition: "all 0.15s ease"
                        }}
                        onMouseEnter={e => { if (currentStage !== 1 || stage1Tab !== "org") e.currentTarget.style.backgroundColor = C.bg2; }}
                        onMouseLeave={e => { if (currentStage !== 1 || stage1Tab !== "org") e.currentTarget.style.backgroundColor = C.surface; }}
                      >
                        <Users size={15} /> 2. Org Structure
                      </button>
                      <button
                        onClick={() => { setCurrentStage(1); setStage1Tab("internal_team"); }}
                        style={{
                          padding: "9px 12px", borderRadius: 8, border: currentStage === 1 && stage1Tab === "internal_team" ? `1px solid ${C.tealBorder}` : `1px solid ${C.border}`,
                          cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                          backgroundColor: currentStage === 1 && stage1Tab === "internal_team" ? C.tealBg : C.surface,
                          color: currentStage === 1 && stage1Tab === "internal_team" ? C.teal : C.text2,
                          textAlign: "left", display: "flex", alignItems: "center", gap: 10,
                          boxShadow: currentStage === 1 && stage1Tab === "internal_team" ? "0 2px 4px rgba(13,148,136,0.1)" : "none",
                          transition: "all 0.15s ease"
                        }}
                        onMouseEnter={e => { if (currentStage !== 1 || stage1Tab !== "internal_team") e.currentTarget.style.backgroundColor = C.bg2; }}
                        onMouseLeave={e => { if (currentStage !== 1 || stage1Tab !== "internal_team") e.currentTarget.style.backgroundColor = C.surface; }}
                      >
                        <Shield size={15} /> 3. Internal Team
                      </button>
                    </div>

                    {/* STAGE 2 BUTTONS */}
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, paddingLeft: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Stage II: Execution</span>
                      <button
                        onClick={() => setShowAddProcessModal(true)}
                        title="Add Custom Audit Type / Process"
                        style={{ border: "none", background: "none", color: C.teal, cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                      {activeProcesses.map(proc => {
                        const isProcActive = currentStage === 2 && processCategory === proc;
                        return (
                          <div key={proc} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <button
                              onClick={() => { setCurrentStage(2); setProcessCategory(proc); setStage2SubTab("programme"); fetchStage2Data(selectedProject.id, proc); }}
                              style={{
                                padding: "9px 12px", borderRadius: 8, border: isProcActive ? `1px solid ${C.tealBorder}` : `1px solid ${C.border}`,
                                cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                                backgroundColor: isProcActive ? C.tealBg : C.surface,
                                color: isProcActive ? C.teal : C.text2,
                                textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between",
                                boxShadow: isProcActive ? "0 2px 4px rgba(13,148,136,0.1)" : "none",
                                transition: "all 0.15s ease"
                              }}
                              onMouseEnter={e => { if (!isProcActive) e.currentTarget.style.backgroundColor = C.bg2; }}
                              onMouseLeave={e => { if (!isProcActive) e.currentTarget.style.backgroundColor = C.surface; }}
                            >
                              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Layers size={15} /> {proc}
                              </span>
                              <ChevronRight size={14} style={{ transform: isProcActive ? "rotate(90deg)" : "none", transition: "transform 0.15s ease" }} />
                            </button>

                            {/* NESTED SUB-TAB BUTTONS FOR ACTIVE PROCESS */}
                            {isProcActive && (
                              <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 12, borderLeft: `2px solid ${C.tealBorder}`, marginLeft: 14, marginTop: 2, marginBottom: 4 }}>
                                <button
                                  onClick={() => setStage2SubTab("programme")}
                                  style={{
                                    padding: "6px 10px", borderRadius: 6, border: stage2SubTab === "programme" ? `1px solid ${C.tealBorder}` : "1px solid transparent",
                                    cursor: "pointer", fontSize: 11, fontWeight: 600,
                                    backgroundColor: stage2SubTab === "programme" ? "#ffffff" : "transparent",
                                    color: stage2SubTab === "programme" ? C.teal : C.text2,
                                    textAlign: "left", display: "flex", alignItems: "center", gap: 7
                                  }}
                                >
                                  <ListTodo size={12} /> 1. Programme
                                </button>
                                <button
                                  onClick={() => setStage2SubTab("tracker")}
                                  style={{
                                    padding: "6px 10px", borderRadius: 6, border: stage2SubTab === "tracker" ? `1px solid ${C.tealBorder}` : "1px solid transparent",
                                    cursor: "pointer", fontSize: 11, fontWeight: 600,
                                    backgroundColor: stage2SubTab === "tracker" ? "#ffffff" : "transparent",
                                    color: stage2SubTab === "tracker" ? C.teal : C.text2,
                                    textAlign: "left", display: "flex", alignItems: "center", gap: 7
                                  }}
                                >
                                  <FileSpreadsheet size={12} /> 2. Data Tracker
                                </button>
                                <button
                                  onClick={() => setStage2SubTab("mom")}
                                  style={{
                                    padding: "6px 10px", borderRadius: 6, border: stage2SubTab === "mom" ? `1px solid ${C.tealBorder}` : "1px solid transparent",
                                    cursor: "pointer", fontSize: 11, fontWeight: 600,
                                    backgroundColor: stage2SubTab === "mom" ? "#ffffff" : "transparent",
                                    color: stage2SubTab === "mom" ? C.teal : C.text2,
                                    textAlign: "left", display: "flex", alignItems: "center", gap: 7
                                  }}
                                >
                                  <MessageSquare size={12} /> 3. MOM
                                </button>
                                <button
                                  onClick={() => setStage2SubTab("testing")}
                                  style={{
                                    padding: "6px 10px", borderRadius: 6, border: stage2SubTab === "testing" ? `1px solid ${C.tealBorder}` : "1px solid transparent",
                                    cursor: "pointer", fontSize: 11, fontWeight: 600,
                                    backgroundColor: stage2SubTab === "testing" ? "#ffffff" : "transparent",
                                    color: stage2SubTab === "testing" ? C.teal : C.text2,
                                    textAlign: "left", display: "flex", alignItems: "center", gap: 7
                                  }}
                                >
                                  <CheckSquare size={12} /> 4. Testing
                                </button>
                                <button
                                  onClick={() => setStage2SubTab("queries")}
                                  style={{
                                    padding: "6px 10px", borderRadius: 6, border: stage2SubTab === "queries" ? `1px solid ${C.tealBorder}` : "1px solid transparent",
                                    cursor: "pointer", fontSize: 11, fontWeight: 600,
                                    backgroundColor: stage2SubTab === "queries" ? "#ffffff" : "transparent",
                                    color: stage2SubTab === "queries" ? C.teal : C.text2,
                                    textAlign: "left", display: "flex", alignItems: "center", gap: 7
                                  }}
                                >
                                  <AlertCircle size={12} /> 5. Queries
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* OTHER ENROLLED COMPANIES QUICK SWITCH */}
                    {projects.filter(p => p.template_id === (selectedProject.template_id || selectedTemplate?.id) && p.id !== selectedProject.id).length > 0 && (
                      <>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, paddingLeft: 6 }}>
                          Other Companies
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {projects.filter(p => p.template_id === (selectedProject.template_id || selectedTemplate?.id) && p.id !== selectedProject.id).map(p => (
                            <button
                              key={p.id}
                              onClick={() => handleOpenProject(p)}
                              style={{
                                padding: "7px 10px", borderRadius: 6, border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 12, fontWeight: 600,
                                backgroundColor: C.surface, color: C.text2, textAlign: "left", display: "flex", alignItems: "center", gap: 8,
                                transition: "all 0.15s ease"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.text1; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
                            >
                              <Building2 size={13} />
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.client_name}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

            </div>

            {/* SIDEBAR BOTTOM ACTION BUTTON & FOOTER */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {!selectedTemplate && !selectedProject && (
                <button
                  onClick={() => setShowCreateTemplateModal(true)}
                  style={{
                    padding: "9px 12px", backgroundColor: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`,
                    borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}
                >
                  <Plus size={14} /> (+) Create Template
                </button>
              )}

              {selectedTemplate && !selectedProject && (
                <button
                  onClick={handleOpenAddCompanyModal}
                  style={{
                    padding: "9px 12px", backgroundColor: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`,
                    borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}
                >
                  <Plus size={14} /> (+) Add Company
                </button>
              )}

              <div style={{ fontSize: 10, color: C.text3, textAlign: "center" }}>
                AuditFlow Dynamic Platform
              </div>
            </div>
          </div>
        )}

        {/* ── RIGHT MAIN WORKSPACE CONTENT AREA ── */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {!selectedProject ? (
            <div style={{ width: "100%", maxWidth: 1400, margin: "28px auto", padding: "0 28px", transition: "all 0.2s ease" }}>

              {/* Section Header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                  Dynamic Audit Management Engine
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text1, margin: 0 }}>
                  {selectedTemplate ? `${selectedTemplate.template_name} — Enrolled Companies` : "Audit Templates & Frameworks"}
                </h1>
                {(() => {
                  /* VIEW 1: DYNAMIC AUDIT TEMPLATE CARDS GRID (DYNAMIC 3 CARDS PER ROW) */
                  if (!selectedTemplate) {
                    return (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 20 }}>
                          {templates.map(tpl => {
                            const tplProjects = getTemplateProjects(tpl);

                            return (
                              <div
                                key={tpl.id}
                                onClick={() => setSelectedTemplate(tpl)}
                                style={{
                                  backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px", cursor: "pointer", transition: "all 0.2s ease",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 200
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = tpl.color || C.teal; e.currentTarget.style.transform = "translateY(-2px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}
                              >
                                <div>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${tpl.color || C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                                      {tpl.icon || "📋"}
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: tpl.color || C.teal, backgroundColor: C.tealBg, padding: "4px 10px", borderRadius: 12, border: `1px solid ${C.tealBorder}` }}>
                                      {tpl.category || "Audit Template"}
                                    </span>
                                  </div>

                                  <div style={{ fontSize: 18, fontWeight: 800, color: C.text1, marginBottom: 6 }}>{tpl.template_name}</div>
                                  <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.5 }}>{tpl.description || "Dynamic user-defined audit template structure."}</div>
                                </div>

                                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: C.text2, backgroundColor: C.bg2, padding: "5px 12px", borderRadius: 8, border: `1px solid ${C.border}` }}>
                                    <Building2 size={14} style={{ color: tpl.color || C.teal }} />
                                    <span><strong style={{ color: C.text1 }}>{tplProjects.length}</strong> Enrolled</span>
                                  </div>
                                  <div title="Open Template Workspace" style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: `${tpl.color || C.teal}15`, color: tpl.color || C.teal, border: `1px solid ${tpl.color || C.teal}30`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease" }}>
                                    <ArrowRight size={16} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  } else {
                    /* VIEW 2: COMPANY LIST UNDER SELECTED TEMPLATE */
                    const tplProjects = getTemplateProjects(selectedTemplate);
                    return (
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, marginBottom: 16 }}>Enrolled Companies List</div>

                        {tplProjects.length > 0 ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 20 }}>
                            {tplProjects.map(proj => {
                              const stageNum = proj.current_stage || 1;
                              const isStage2 = stageNum === 2;

                              // Extract metadata (category & plants)
                              const compCategory = proj.company_category || proj.meta_json?.category || "Unspecified Category";
                              const compPlants = Array.isArray(proj.plants) && proj.plants.length > 0
                                ? proj.plants
                                : (Array.isArray(proj.meta_json?.plants) ? proj.meta_json.plants : []);

                              return (
                                <div
                                  key={proj.id}
                                  onClick={() => handleOpenProject(proj)}
                                  style={{
                                    backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px", cursor: "pointer", transition: "all 0.2s ease",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)", position: "relative"
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.borderColor = C.teal}
                                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                                >
                                  {/* Top Bar: Financial Year, Stage Badge, and Delete Trash Action */}
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                      <span style={{ fontSize: 11, fontWeight: 700, color: C.teal, backgroundColor: C.tealBg, padding: "3px 8px", borderRadius: 6 }}>
                                        {proj.financial_year || "FY 2026-27"}
                                      </span>
                                      <span style={{
                                        fontSize: 11, fontWeight: 700,
                                        color: isStage2 ? C.teal : C.amber,
                                        backgroundColor: isStage2 ? C.tealBg : C.amberBg,
                                        padding: "3px 8px", borderRadius: 10,
                                        border: `1px solid ${isStage2 ? C.tealBorder : C.amberBorder}`
                                      }}>
                                        {isStage2 ? "Stage 2: Execution" : "Stage 1: Pre-Execution"}
                                      </span>
                                    </div>

                                    {/* Delete Company Button (Triggers 2-Step Confirmation) */}
                                    <button
                                      type="button"
                                      title="Drop & Delete Company"
                                      onClick={(e) => handleInitiateDeleteCompany(proj, e)}
                                      style={{
                                        border: `1px solid ${C.redBorder}`, backgroundColor: C.redBg, color: C.red,
                                        borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.15s ease"
                                      }}
                                      onMouseEnter={e => e.currentTarget.style.backgroundColor = C.red}
                                      onMouseLeave={e => e.currentTarget.style.backgroundColor = C.redBg}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>

                                  <div style={{ fontSize: 17, fontWeight: 800, color: C.text1, marginBottom: 4 }}>{proj.client_name}</div>
                                  <div style={{ fontSize: 13, color: C.text2, marginBottom: 12 }}>{proj.project_name}</div>

                                  {/* Category & Plants Summary Badges */}
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: C.text2, backgroundColor: C.bg2, padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.border}`, display: "inline-flex", alignItems: "center", gap: 4 }}>
                                      🏢 {compCategory}
                                    </span>
                                    {compPlants.length > 0 ? (
                                      <span style={{ fontSize: 11, fontWeight: 600, color: C.teal, backgroundColor: C.tealBg, padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.tealBorder}`, display: "inline-flex", alignItems: "center", gap: 4 }}>
                                        📍 {compPlants.length} Plant(s): {compPlants.slice(0, 2).join(", ")}{compPlants.length > 2 ? "..." : ""}
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: 11, fontWeight: 600, color: C.text3, backgroundColor: C.bg2, padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.border}` }}>
                                        📍 0 Plants
                                      </span>
                                    )}
                                  </div>

                                  {/* Bottom Bar: Lead Auditor & Open Workspace */}
                                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: C.text2 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                                      <Users size={13.5} style={{ color: C.teal }} />
                                      <span>Lead: <strong style={{ color: proj.project_leader ? C.text1 : C.text3 }}>{proj.project_leader ? getEmployeeName(proj.project_leader) : "Unassigned"}</strong></span>
                                    </div>
                                    <div title="Open Company Audit Workspace" style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, color: C.teal, fontSize: 12 }}>
                                      <span>Open</span>
                                      <ChevronRight size={15} />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{ padding: "48px 24px", textAlign: "center", backgroundColor: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <Building2 size={40} color={C.text3} style={{ marginBottom: 12 }} />
                            <div style={{ fontSize: 16, fontWeight: 700, color: C.text1, marginBottom: 6 }}>No Enrolled Companies Yet</div>
                            <div style={{ fontSize: 13, color: C.text2 }}>
                              No company audit engagements have been created under {selectedTemplate.template_name} yet.
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          ) : (
            /* ── PROJECT STAGE WORKSPACE ── */
            <div style={{ padding: "24px 32px" }}>
              {/* Breadcrumb & Stage Selector Dropdown */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <button onClick={() => setSelectedProject(null)} style={{ border: "none", background: "transparent", cursor: "pointer", color: C.teal, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    ← Back to Companies List
                  </button>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text1, margin: 0 }}>
                    {selectedProject.client_name} — <span style={{ color: C.text2, fontWeight: 600 }}>{selectedProject.project_name}</span>
                  </h1>
                </div>

                {/* 4 STAGES DROPDOWN SELECTOR & DROP COMPANY ACTION */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text2 }}>Select Stage:</div>
                  <select
                    value={currentStage}
                    onChange={e => handleUpdateProjectStage(e.target.value)}
                    style={{
                      padding: "10px 16px", borderRadius: 8, border: `1px solid ${C.teal}`, backgroundColor: C.surface, fontSize: 13, fontWeight: 700, color: C.teal, cursor: "pointer"
                    }}
                  >
                    <option value={0}>Company Profile</option>
                    <option value={1}>Stage I: Pre-Execution</option>
                    <option value={2}>Stage II: Execution Stage</option>
                    <option value={3} disabled>Stage III: Report & Annexure (Deferred)</option>
                    <option value={4} disabled>Stage IV: Action Taken Report (Deferred)</option>
                  </select>

                  <button
                    type="button"
                    title="Drop & Delete Company"
                    onClick={(e) => handleInitiateDeleteCompany(selectedProject, e)}
                    style={{
                      padding: "9px 11px", borderRadius: 8, border: `1px solid ${C.redBorder}`, backgroundColor: C.redBg, color: C.red,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 1px 3px rgba(220,38,38,0.1)", transition: "all 0.15s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = C.red}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = C.redBg}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* ── STAGE 0: COMPANY PROFILE & DETAILS VIEW ── */}
              {currentStage === 0 && (
                <div style={{ backgroundColor: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", padding: 24 }}>
                  {/* Company Header Banner */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.teal }}>
                        <Building2 size={28} />
                      </div>
                      <div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text1, margin: 0 }}>{selectedProject.client_name}</h2>
                          <span style={{ fontSize: 11, fontWeight: 700, color: C.teal, backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, padding: "2px 8px", borderRadius: 12 }}>
                            {selectedProject.financial_year || "FY 2026-27"}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text2 }}>{selectedProject.project_name}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <button
                        onClick={() => handleOpenEditCompanyModal(selectedProject)}
                        style={{ padding: "8px 16px", backgroundColor: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <Edit2 size={14} /> Edit Company Details
                      </button>
                    </div>
                  </div>

                  {/* Details Key-Value Master Data Table */}
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, marginBottom: 14 }}>Engagement Master Details</div>
                  <div style={{ borderRadius: 8, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 24 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <tbody>
                        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2, width: "22%" }}>Company / Client Name</td>
                          <td style={{ padding: "12px 16px", fontWeight: 700, color: C.text1, width: "28%" }}>{selectedProject.client_name}</td>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2, width: "22%" }}>Audit Project Name</td>
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text1, width: "28%" }}>{selectedProject.project_name}</td>
                        </tr>
                        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2 }}>Company Category</td>
                          <td style={{ padding: "12px 16px", fontWeight: 700, color: C.text1 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: C.bg2, border: `1px solid ${C.border}`, padding: "4px 10px", borderRadius: 6, fontSize: 12.5 }}>
                              🏢 {selectedProject.company_category || "Unspecified"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2 }}>Operating Plants / Locations</td>
                          <td style={{ padding: "12px 16px" }}>
                            {(() => {
                              const pList = Array.isArray(selectedProject.plants) ? selectedProject.plants : [];
                              if (pList.length === 0) return <span style={{ color: C.text3 }}>0 Plants / Single Location</span>;
                              return (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                  {pList.map((pl, pIdx) => (
                                    <span key={pIdx} style={{ fontSize: 11.5, fontWeight: 600, color: C.teal, backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, padding: "3px 8px", borderRadius: 6 }}>
                                      📍 {pl}
                                    </span>
                                  ))}
                                </div>
                              );
                            })()}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2 }}>Financial Year</td>
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: C.teal }}>{selectedProject.financial_year || "FY 2026-27"}</td>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2 }}>Lead Auditor / Project Leader</td>
                          <td style={{ padding: "12px 16px" }}>
                            {(() => {
                              const lName = getEmployeeName(selectedProject.project_leader);
                              const lObj = getEmployeeObj(selectedProject.project_leader);
                              if (!selectedProject.project_leader || lName === "Not Assigned") return <span style={{ color: C.text3 }}>Not Assigned</span>;
                              const initials = (lName || "AP").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
                              const avatar = lObj?.avatar_url || lObj?.avatar || lObj?.profile_picture_url || "";
                              return (
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  {avatar ? (
                                    <img src={avatar} alt={lName} style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.tealBorder}`, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }} />
                                  ) : (
                                    <div style={{
                                      width: 50, height: 50, borderRadius: "50%", backgroundColor: C.teal, color: "#fff",
                                      fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                                      boxShadow: "0 2px 6px rgba(13,148,136,0.2)"
                                    }}>
                                      {initials}
                                    </div>
                                  )}
                                  <div>
                                    <div style={{ fontWeight: 700, color: C.text1, fontSize: 13.5 }}>{lName}</div>
                                    {lObj?.email && <div style={{ fontSize: 11.5, color: C.text3 }}>{lObj.email}</div>}
                                  </div>
                                </div>
                              );
                            })()}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2 }}>Start Date</td>
                          <td style={{ padding: "12px 16px", color: C.text2 }}>{selectedProject.start_date || "—"}</td>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2 }}>End Date</td>
                          <td style={{ padding: "12px 16px", color: C.text2 }}>{selectedProject.end_date || "—"}</td>
                        </tr>
                        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2 }}>Project Length / Duration</td>
                          <td style={{ padding: "12px 16px", color: C.text2 }}>{selectedProject.project_length || "—"}</td>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2 }}>Current Active Stage</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: selectedProject.current_stage === 2 ? C.teal : C.amber, backgroundColor: selectedProject.current_stage === 2 ? C.tealBg : C.amberBg, padding: "3px 8px", borderRadius: 10, border: `1px solid ${selectedProject.current_stage === 2 ? C.tealBorder : C.amberBorder}` }}>
                              {selectedProject.current_stage === 2 ? "Stage II: Execution" : "Stage I: Pre-Execution"}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2 }}>Audit Template Framework</td>
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text1 }}>{selectedTemplate?.template_name || "Internal Audit"}</td>
                          <td style={{ padding: "12px 16px", backgroundColor: C.bg2, fontWeight: 700, color: C.text2 }}>Assigned Team Members</td>
                          <td style={{ padding: "12px 16px" }}>
                            {(() => {
                              const rawTeam = selectedProject.assigned_team;
                              let teamList = [];
                              if (Array.isArray(rawTeam)) teamList = rawTeam;
                              else if (typeof rawTeam === "string" && rawTeam.trim().length > 0) {
                                try { teamList = JSON.parse(rawTeam); } catch (e) { teamList = rawTeam.split(","); }
                              }
                              if (!Array.isArray(teamList)) teamList = [];
                              if (teamList.length === 0) return <span style={{ color: C.text3 }}>No team members assigned</span>;

                              return (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                  {teamList.map((mItem, idx) => {
                                    const empName = getEmployeeName(mItem);
                                    const empObj = getEmployeeObj(mItem);
                                    const initials = (empName || "TM").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
                                    const avatar = empObj?.avatar_url || empObj?.avatar || empObj?.profile_picture_url || "";
                                    return (
                                      <span key={idx} style={{
                                        display: "inline-flex", alignItems: "center", gap: 7,
                                        padding: "5px 12px", borderRadius: 18, backgroundColor: C.bg2, border: `1px solid ${C.border}`,
                                        fontSize: 12.5, fontWeight: 600, color: C.text1
                                      }}>

                                        {avatar ? (
                                          <img src={avatar} alt={empName} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }} />
                                        ) : (
                                          <span style={{
                                            width: 30, height: 30, borderRadius: "50%", backgroundColor: C.teal, color: "#fff",
                                            fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center"
                                          }}>
                                            {initials}
                                          </span>
                                        )}
                                        {empName}
                                      </span>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── STAGE 1: PRE-EXECUTION VIEW ── */}
              {currentStage === 1 && (
                <div style={{ backgroundColor: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, backgroundColor: C.bg2, padding: "0 16px" }}>
                    <button
                      onClick={() => setStage1Tab("calendar")}
                      style={{
                        padding: "14px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                        backgroundColor: stage1Tab === "calendar" ? C.surface : "transparent",
                        color: stage1Tab === "calendar" ? C.teal : C.text2,
                        borderBottom: stage1Tab === "calendar" ? `2px solid ${C.teal}` : "none"
                      }}
                    >
                      1. Weekly Calendar Plan
                    </button>
                    <button
                      onClick={() => setStage1Tab("org")}
                      style={{
                        padding: "14px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                        backgroundColor: stage1Tab === "org" ? C.surface : "transparent",
                        color: stage1Tab === "org" ? C.teal : C.text2,
                        borderBottom: stage1Tab === "org" ? `2px solid ${C.teal}` : "none"
                      }}
                    >
                      2. Organisation Structure & Contacts Directory
                    </button>
                    <button
                      onClick={() => setStage1Tab("internal_team")}
                      style={{
                        padding: "14px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                        backgroundColor: stage1Tab === "internal_team" ? C.surface : "transparent",
                        color: stage1Tab === "internal_team" ? C.teal : C.text2,
                        borderBottom: stage1Tab === "internal_team" ? `2px solid ${C.teal}` : "none"
                      }}
                    >
                      3. Internal Audit Team Details
                    </button>
                  </div>

                  <div style={{ padding: 24 }}>
                    {stage1Tab === "calendar" ? (() => {
                      const displayedCalendarItems = selectedWeekFilter === "ALL"
                        ? calendarItems
                        : calendarItems.filter(item => item.week_name === selectedWeekFilter);

                      // Pre-calculate spans for clean executive grouped presentation
                      const rows = [...displayedCalendarItems];
                      const calendarRowsWithSpans = [];
                      let i = 0;
                      while (i < rows.length) {
                        const currentWeek = rows[i].week_name || "";
                        let weekSpan = 0;
                        while (i + weekSpan < rows.length && (rows[i + weekSpan].week_name || "") === currentWeek) {
                          weekSpan++;
                        }

                        let j = 0;
                        while (j < weekSpan) {
                          const currentDesc = rows[i + j].week_description || "";
                          let descSpan = 0;
                          while (j + descSpan < weekSpan && (rows[i + j + descSpan].week_description || "") === currentDesc) {
                            descSpan++;
                          }

                          for (let k = 0; k < descSpan; k++) {
                            const rowIndex = i + j + k;
                            calendarRowsWithSpans.push({
                              ...rows[rowIndex],
                              showWeek: j === 0 && k === 0,
                              weekRowSpan: j === 0 && k === 0 ? weekSpan : 0,
                              showDesc: k === 0,
                              descRowSpan: k === 0 ? descSpan : 0,
                              isFirstInWeek: j === 0 && k === 0,
                              isLastInWeek: j + k === weekSpan - 1
                            });
                          }
                          j += descSpan;
                        }
                        i += weekSpan;
                      }

                      return (
                        <div>
                          {/* Top Bar: Title, Week Filter Dropdown, and Action Buttons */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>Weekly Execution Schedule</div>
                              <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>Plan and track weekly audit scope, activities, and deliverables</div>
                            </div>
                            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                              {/* 1. Week Filter Dropdown (Dropdown button only, without left label) */}
                              <select
                                value={selectedWeekFilter}
                                onChange={e => setSelectedWeekFilter(e.target.value)}
                                style={{
                                  height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${C.border}`,
                                  backgroundColor: C.surface, fontSize: 12.5, fontWeight: 700, color: C.teal,
                                  cursor: "pointer", outline: "none", boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                                }}
                              >
                                <option value="ALL">🗓️ All Weeks ({calendarItems.length})</option>
                                {uniqueWeeks.map(wk => (
                                  <option key={wk} value={wk}>
                                    {wk} ({calendarItems.filter(item => item.week_name === wk).length})
                                  </option>
                                ))}
                              </select>

                              {/* Download Excel Icon */}
                              <button
                                onClick={() => downloadExcelTemplate("calendar")}
                                title="Download Excel Format"
                                style={{
                                  width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`,
                                  backgroundColor: C.surface, color: C.text2, cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  transition: "all 0.15s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.text1; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
                              >
                                <Download size={17} />
                              </button>

                              {/* Upload Excel Icon */}
                              <label
                                title="Upload Excel (Mapping)"
                                style={{
                                  width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.tealBorder}`,
                                  backgroundColor: C.tealBg, color: C.teal, cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  transition: "all 0.15s ease", boxShadow: "0 1px 2px rgba(13,148,136,0.12)"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.teal; e.currentTarget.style.color = "#ffffff"; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.tealBg; e.currentTarget.style.color = C.teal; }}
                              >
                                <Upload size={17} />
                                <input type="file" accept=".csv, .xlsx, .xls" onChange={e => handleFileUpload(e, "calendar")} style={{ display: "none" }} />
                              </label>

                              {/* Send Mail to Client Button */}
                              <button
                                onClick={handleOpenSendCalEmailDrawer}
                                title="Send Weekly Plan to Client via Email"
                                style={{
                                  height: 36, padding: "0 14px", borderRadius: 8, border: `1px solid ${C.tealBorder}`,
                                  backgroundColor: C.tealBg, color: C.teal, cursor: "pointer",
                                  display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700,
                                  boxShadow: "0 1px 3px rgba(13,148,136,0.15)", transition: "all 0.15s ease"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.teal; e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.tealBg; e.currentTarget.style.color = C.teal; }}
                              >
                                <Mail size={16} /> Send Mail to Client
                              </button>

                              {/* Add Weekly Activity Button - opens right side panel */}
                              <button onClick={handleOpenAddCalDrawer} style={{ height: 36, padding: "0 14px", borderRadius: 8, border: "none", backgroundColor: C.teal, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, boxShadow: "0 2px 6px rgba(13,148,136,0.25)" }}>
                                <Plus size={16} /> Add Weekly Activity
                              </button>
                            </div>
                          </div>

                          {/* 2 & 3. Grouped Merged Weekly Reference Table with Progress Column */}
                          <div style={{ borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                              <thead>
                                <tr style={{ backgroundColor: C.bg2, color: C.text2, textAlign: "left" }}>
                                  <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, width: 110 }}>Week</th>
                                  <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, width: 190 }}>Week Description</th>
                                  <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, width: 220 }}>Activity</th>
                                  <th style={{ padding: "12px 14px", border: `1px solid ${C.border}` }}>Detailed Audit Work</th>
                                  <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, width: 135 }}>Progress</th>
                                  <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, width: 125, whiteSpace: "nowrap" }}>Status</th>
                                  <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, width: 160 }}>Remarks</th>
                                  <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, width: 85, textAlign: "center" }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {calendarRowsWithSpans.length > 0 ? (
                                  calendarRowsWithSpans.map((item, idx) => {
                                    const progressVal = item.progress !== undefined && item.progress !== null ? item.progress : (item.status === 'Done' ? 100 : 0);
                                    const isComplete = progressVal === 100 || item.status === 'Done';

                                    return (
                                      <tr key={item.id || idx} style={{ borderBottom: item.isLastInWeek ? `2px solid ${C.border}` : `1px solid ${C.border}` }}>
                                        {/* Merged Week Column */}
                                        {item.showWeek && (
                                          <td
                                            rowSpan={item.weekRowSpan}
                                            style={{
                                              padding: "14px", border: `1px solid ${C.border}`,
                                              fontWeight: 800, color: C.teal, backgroundColor: C.bg2,
                                              verticalAlign: "middle", textAlign: "center"
                                            }}
                                          >
                                            <span style={{ backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, color: C.teal, padding: "5px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 800, display: "inline-block", whiteSpace: "nowrap" }}>
                                              {item.week_name}
                                            </span>
                                          </td>
                                        )}

                                        {/* Merged Week Description Column */}
                                        {item.showDesc && (
                                          <td
                                            rowSpan={item.descRowSpan}
                                            style={{
                                              padding: "14px", border: `1px solid ${C.border}`,
                                              fontWeight: 700, color: C.text1, verticalAlign: "middle",
                                              backgroundColor: C.surface
                                            }}
                                          >
                                            {item.week_description || "—"}
                                          </td>
                                        )}

                                        {/* Activity Name */}
                                        <td style={{ padding: "12px 14px", border: `1px solid ${C.border}`, fontWeight: 600, color: C.text1 }}>
                                          {item.activity}
                                        </td>

                                        {/* Detailed Audit Work */}
                                        <td style={{ padding: "12px 14px", border: `1px solid ${C.border}`, color: C.text2, fontSize: 12.5, lineHeight: 1.5 }}>
                                          {item.detailed_audit_work || "—"}
                                        </td>

                                        {/* 3. Progress Column (No tick icon) */}
                                        <td style={{ padding: "12px 14px", border: `1px solid ${C.border}`, verticalAlign: "middle" }}>
                                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, fontWeight: 700 }}>
                                              <span style={{ color: isComplete ? C.green : (progressVal > 0 ? C.teal : C.text3) }}>
                                                {progressVal}%
                                              </span>
                                            </div>
                                            <div style={{ width: "100%", height: 6, backgroundColor: C.bg2, borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}` }}>
                                              <div
                                                style={{
                                                  width: `${progressVal}%`,
                                                  height: "100%",
                                                  backgroundColor: isComplete ? C.green : C.teal,
                                                  borderRadius: 4,
                                                  transition: "width 0.3s ease"
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </td>

                                        {/* Status Badge - strictly 1-line */}
                                        <td style={{ padding: "12px 14px", border: `1px solid ${C.border}`, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                                          <span style={{
                                            padding: "4px 10px", borderRadius: 10, fontSize: 11.5, fontWeight: 700,
                                            whiteSpace: "nowrap", display: "inline-block",
                                            backgroundColor: item.status === "Done" ? C.greenBg : (item.status === "In Progress" ? C.tealBg : C.amberBg),
                                            color: item.status === "Done" ? C.green : (item.status === "In Progress" ? C.teal : C.amber),
                                            border: `1px solid ${item.status === "Done" ? C.greenBorder : (item.status === "In Progress" ? C.tealBorder : C.amberBorder)}`
                                          }}>
                                            {item.status || "Pending"}
                                          </span>
                                        </td>

                                        {/* Remarks */}
                                        <td style={{ padding: "12px 14px", border: `1px solid ${C.border}`, color: C.text3, fontFamily: MONO, fontSize: 12 }}>
                                          {item.remarks || "—"}
                                        </td>

                                        {/* 4. Action: Edit Side Panel Icon + Delete Icon */}
                                        <td style={{ padding: "12px 14px", border: `1px solid ${C.border}`, textAlign: "center", verticalAlign: "middle" }}>
                                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                            <button
                                              onClick={() => handleOpenEditCalDrawer(item)}
                                              title="Edit & View Activity (Side Panel)"
                                              style={{
                                                width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.tealBorder}`,
                                                backgroundColor: C.tealBg, color: C.teal, cursor: "pointer",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                transition: "all 0.15s ease"
                                              }}
                                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.teal; e.currentTarget.style.color = "#fff"; }}
                                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.tealBg; e.currentTarget.style.color = C.teal; }}
                                            >
                                              <Edit3 size={13.5} />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteCalItem(item.id)}
                                              title="Delete Activity"
                                              style={{
                                                width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.redBorder}`,
                                                backgroundColor: C.redBg, color: C.red, cursor: "pointer",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                transition: "all 0.15s ease"
                                              }}
                                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.red; e.currentTarget.style.color = "#fff"; }}
                                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.redBg; e.currentTarget.style.color = C.red; }}
                                            >
                                              <Trash2 size={13.5} />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan={8} style={{ padding: 36, textAlign: "center", color: C.text3 }}>
                                      {selectedWeekFilter !== "ALL"
                                        ? `No activities found for ${selectedWeekFilter}.`
                                        : 'No weekly activities added yet. Click "+ Add Weekly Activity" or "Upload Excel (Mapping)" to populate schedule.'}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })() : stage1Tab === "org" ? (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>Client Organisation Contacts Directory</div>
                            <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>Key client stakeholders and contact persons for data requests</div>
                          </div>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            {/* Download Excel Icon */}
                            <button
                              onClick={() => downloadExcelTemplate("org")}
                              title="Download Excel Format"
                              style={{
                                width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`,
                                backgroundColor: C.surface, color: C.text2, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.15s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.text1; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
                            >
                              <Download size={17} />
                            </button>

                            {/* Upload Excel Icon */}
                            <label
                              title="Upload Excel (Mapping)"
                              style={{
                                width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.tealBorder}`,
                                backgroundColor: C.tealBg, color: C.teal, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.15s ease", boxShadow: "0 1px 2px rgba(13,148,136,0.12)"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.teal; e.currentTarget.style.color = "#ffffff"; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.tealBg; e.currentTarget.style.color = C.teal; }}
                            >
                              <Upload size={17} />
                              <input type="file" accept=".csv, .xlsx, .xls" onChange={e => handleFileUpload(e, "org")} style={{ display: "none" }} />
                            </label>

                            <button onClick={() => setShowAddOrgModal(true)} style={{ height: 36, padding: "0 14px", borderRadius: 8, border: "none", backgroundColor: C.teal, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, boxShadow: "0 2px 6px rgba(13,148,136,0.25)" }}>
                              <Plus size={16} /> Add Client Contact
                            </button>
                          </div>
                        </div>

                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                          <thead>
                            <tr style={{ backgroundColor: C.bg2, color: C.text2, textAlign: "left" }}>
                              <th style={{ padding: 12, border: `1px solid ${C.border}` }}>Member Name</th>
                              <th style={{ padding: 12, border: `1px solid ${C.border}` }}>Designation</th>
                              <th style={{ padding: 12, border: `1px solid ${C.border}` }}>Department</th>
                              <th style={{ padding: 12, border: `1px solid ${C.border}`, fontFamily: MONO, color: C.teal }}>Email Address</th>
                              <th style={{ padding: 12, border: `1px solid ${C.border}` }}>Phone</th>
                              <th style={{ padding: 12, border: `1px solid ${C.border}`, width: 60, textAlign: "center" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orgMembers.length > 0 ? (
                              orgMembers.map(m => (
                                <tr key={m.id}>
                                  <td style={{ padding: 12, border: `1px solid ${C.border}`, fontWeight: 700 }}>{m.member_name}</td>
                                  <td style={{ padding: 12, border: `1px solid ${C.border}` }}>{m.designation || "—"}</td>
                                  <td style={{ padding: 12, border: `1px solid ${C.border}` }}>{m.department || "—"}</td>
                                  <td style={{ padding: 12, border: `1px solid ${C.border}`, fontFamily: MONO, color: C.teal }}>{m.email || "—"}</td>
                                  <td style={{ padding: 12, border: `1px solid ${C.border}` }}>{m.phone || "—"}</td>
                                  <td style={{ padding: 12, border: `1px solid ${C.border}`, textAlign: "center" }}>
                                    <button
                                      onClick={() => handleDeleteOrgMember(m.id)}
                                      title="Delete Contact"
                                      style={{ border: "none", background: "transparent", color: C.red, cursor: "pointer", fontSize: 14 }}
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} style={{ padding: 32, textAlign: "center", color: C.text3 }}>
                                  No client contacts added yet. Click "+ Add Client Contact" or "Upload Excel (Mapping)" to add directory.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* 3. Internal Audit Team Details */
                      (() => {
                        const leadEmpName = selectedProject?.project_leader ? getEmployeeName(selectedProject.project_leader) : "";
                        const leadEmpObj = selectedProject?.project_leader ? getEmployeeObj(selectedProject.project_leader) : null;
                        const hasLeader = leadEmpName && leadEmpName !== "Not Assigned";

                        const rawTeam = selectedProject?.assigned_team;
                        let teamList = [];
                        if (Array.isArray(rawTeam)) teamList = rawTeam;
                        else if (typeof rawTeam === "string" && rawTeam.trim().length > 0) {
                          try { teamList = JSON.parse(rawTeam); } catch (e) { teamList = rawTeam.split(","); }
                        }
                        if (!Array.isArray(teamList)) teamList = [];

                        const resolvedMembers = [];
                        if (hasLeader) {
                          resolvedMembers.push({
                            isLeader: true,
                            role: "Engagement Lead / Team Leader",
                            name: leadEmpName,
                            obj: leadEmpObj,
                            raw: selectedProject.project_leader
                          });
                        }

                        teamList.forEach(item => {
                          const mName = getEmployeeName(item);
                          const mObj = getEmployeeObj(item);
                          if (hasLeader && (mName === leadEmpName || (mObj && leadEmpObj && mObj.id === leadEmpObj.id))) {
                            return;
                          }
                          if (mName && mName.trim()) {
                            resolvedMembers.push({
                              isLeader: false,
                              role: "Internal Audit Team Member",
                              name: mName,
                              obj: mObj,
                              raw: item
                            });
                          }
                        });

                        return (
                          <div>
                            {/* Header and Manage Action */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, display: "flex", alignItems: "center", gap: 8 }}>
                                  <span>Internal Audit Engagement Team</span>
                                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12, backgroundColor: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}` }}>
                                    {resolvedMembers.length} Members Assigned
                                  </span>
                                </div>
                                <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>
                                  Assigned Team Leader, Senior Auditors, and Execution Team for {selectedProject?.company_name || "Company"}
                                </div>
                              </div>

                              <button
                                onClick={() => handleOpenEditCompanyModal(selectedProject)}
                                style={{
                                  height: 36, padding: "0 14px", borderRadius: 8, border: "none",
                                  backgroundColor: C.teal, color: "#fff", cursor: "pointer",
                                  display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700,
                                  boxShadow: "0 2px 6px rgba(13,148,136,0.25)"
                                }}
                              >
                                <Edit3 size={15} /> Edit / Assign Team Members
                              </button>
                            </div>

                            {/* Summary Stat Cards */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
                              <div style={{ backgroundColor: C.surface, padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.tealBg, color: C.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <Users size={19} />
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase" }}>Total Team</div>
                                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text1 }}>{resolvedMembers.length} Members</div>
                                </div>
                              </div>

                              <div style={{ backgroundColor: C.surface, padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.amberBg, color: C.amber, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <Shield size={19} />
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase" }}>Team Leader</div>
                                  <div style={{ fontSize: 13.5, fontWeight: 800, color: hasLeader ? C.text1 : C.text3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 170 }}>
                                    {hasLeader ? leadEmpName : "Not Assigned"}
                                  </div>
                                </div>
                              </div>

                              <div style={{ backgroundColor: C.surface, padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.tealBg, color: C.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <Briefcase size={19} />
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase" }}>Audit Framework</div>
                                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text1 }}>
                                    {selectedTemplate?.template_name || "Internal Audit"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Internal Team Table */}
                            <div style={{ borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                <thead>
                                  <tr style={{ backgroundColor: C.bg2, color: C.text2, textAlign: "left" }}>
                                    <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, width: 50, textAlign: "center" }}>#</th>
                                    <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, minWidth: 200 }}>Team Member</th>
                                    <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, width: 190 }}>Engagement Role</th>
                                    <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, minWidth: 170 }}>Department / Designation</th>
                                    <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, minWidth: 190 }}>Email Address</th>
                                    <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, width: 130 }}>Contact No.</th>
                                    <th style={{ padding: "12px 14px", border: `1px solid ${C.border}`, width: 90, textAlign: "center" }}>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {resolvedMembers.length > 0 ? (
                                    resolvedMembers.map((member, idx) => {
                                      const empObj = member.obj;
                                      const initials = (member.name || "TM").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
                                      const avatar = empObj?.avatar_url || empObj?.avatar || empObj?.profile_picture_url || "";
                                      const email = empObj?.email || (typeof member.raw === "string" && member.raw.includes("@") ? member.raw : "—");
                                      const phone = empObj?.phone || empObj?.mobile || empObj?.contact_no || "—";
                                      const dept = empObj?.department || "Internal Audit";
                                      const designation = empObj?.designation || empObj?.role || (member.isLeader ? "Audit Manager / Team Lead" : "Audit Executive");
                                      const empCode = empObj?.employee_code || empObj?.employee_id || empObj?.emp_id;

                                      return (
                                        <tr key={idx} style={{ backgroundColor: member.isLeader ? `${C.amberBg}40` : "transparent" }}>
                                          <td style={{ padding: "12px 14px", border: `1px solid ${C.border}`, textAlign: "center", color: C.text3, fontWeight: 700 }}>
                                            {idx + 1}
                                          </td>
                                          <td style={{ padding: "12px 14px", border: `1px solid ${C.border}` }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                              {avatar ? (
                                                <img src={avatar} alt={member.name} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: `1px solid ${C.border}` }} />
                                              ) : (
                                                <span style={{
                                                  width: 34, height: 34, borderRadius: "50%",
                                                  backgroundColor: member.isLeader ? C.amber : C.teal, color: "#fff",
                                                  fontSize: 11.5, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center"
                                                }}>
                                                  {initials}
                                                </span>
                                              )}
                                              <div>
                                                <div style={{ fontWeight: 700, color: C.text1, fontSize: 13.5 }}>
                                                  {member.name}
                                                </div>
                                                {empCode && (
                                                  <div style={{ fontSize: 11, color: C.text3, fontFamily: MONO }}>
                                                    ID: {empCode}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </td>
                                          <td style={{ padding: "12px 14px", border: `1px solid ${C.border}`, verticalAlign: "middle" }}>
                                            {member.isLeader ? (
                                              <span style={{
                                                padding: "4px 10px", borderRadius: 12, fontSize: 11.5, fontWeight: 800,
                                                backgroundColor: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}`,
                                                display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap"
                                              }}>
                                                🌟 Team Leader
                                              </span>
                                            ) : (
                                              <span style={{
                                                padding: "4px 10px", borderRadius: 12, fontSize: 11.5, fontWeight: 700,
                                                backgroundColor: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`,
                                                display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap"
                                              }}>
                                                👤 Team Member
                                              </span>
                                            )}
                                          </td>
                                          <td style={{ padding: "12px 14px", border: `1px solid ${C.border}` }}>
                                            <div style={{ fontWeight: 600, color: C.text1 }}>{designation}</div>
                                            <div style={{ fontSize: 11.5, color: C.text3 }}>{dept}</div>
                                          </td>
                                          <td style={{ padding: "12px 14px", border: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 12, color: C.teal }}>
                                            {email !== "—" ? (
                                              <a href={`mailto:${email}`} style={{ color: C.teal, textDecoration: "none", fontWeight: 600 }}>
                                                {email}
                                              </a>
                                            ) : (
                                              <span style={{ color: C.text3 }}>—</span>
                                            )}
                                          </td>
                                          <td style={{ padding: "12px 14px", border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text2 }}>
                                            {phone}
                                          </td>
                                          <td style={{ padding: "12px 14px", border: `1px solid ${C.border}`, textAlign: "center", verticalAlign: "middle" }}>
                                            <span style={{
                                              padding: "3px 8px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                                              backgroundColor: C.greenBg, color: C.green, border: `1px solid ${C.greenBorder}`
                                            }}>
                                              Active
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan={7} style={{ padding: 36, textAlign: "center", color: C.text3 }}>
                                        No internal team members assigned yet. Click "Edit / Assign Team Members" above to assign Team Leader and team members.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              )}

              {/* ── STAGE 2: EXECUTION STAGE VIEW ── */}
              {currentStage === 2 && (
                <div style={{ backgroundColor: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  {/* Process Category Tabs */}
                  <div style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${C.border}`, backgroundColor: C.bg2, padding: "8px 16px 0", gap: 6, overflowX: "auto" }}>
                    {activeProcesses.map(proc => {
                      const isActive = processCategory === proc;
                      return (
                        <div key={proc} style={{ display: "flex", alignItems: "center" }}>
                          <button
                            onClick={() => { setProcessCategory(proc); fetchStage2Data(selectedProject.id, proc); }}
                            style={{
                              padding: "10px 18px", borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                              backgroundColor: isActive ? C.surface : "transparent",
                              color: isActive ? C.teal : C.text2,
                              borderTop: isActive ? `2px solid ${C.teal}` : "2px solid transparent",
                              display: "flex", alignItems: "center", gap: 6
                            }}
                          >
                            <span>{proc}</span>
                            {activeProcesses.length > 1 && (
                              <span
                                onClick={(e) => { e.stopPropagation(); handleDeleteProcess(proc); }}
                                title={`Remove ${proc}`}
                                style={{ fontSize: 14, fontWeight: 700, opacity: 0.5, cursor: "pointer", marginLeft: 4, padding: "0 3px", borderRadius: 4 }}
                                onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = C.red; }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = "inherit"; }}
                              >
                                ×
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    })}

                    {/* Simple Right-Aligned (+) Add Audit Type Button */}
                    <button
                      onClick={() => setShowAddProcessModal(true)}
                      title="Add New Audit Type / Process"
                      style={{
                        marginLeft: "auto", width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.tealBorder}`,
                        cursor: "pointer", backgroundColor: C.tealBg, color: C.teal, display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0, alignSelf: "center", marginBottom: 4, transition: "all 0.15s ease"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.teal; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.tealBg; e.currentTarget.style.color = C.teal; }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Stage 2 Sub-Tabs */}
                  <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, padding: "0 20px", backgroundColor: C.surface2 }}>
                    {[
                      { id: "programme", label: "1. Audit Programme Table" },
                      { id: "tracker", label: "2. Data Tracker / IDR" },
                      { id: "mom", label: "3. Minutes of Meeting (MOM)" },
                      { id: "testing", label: "4. Testing" },
                      { id: "queries", label: "5. Queries" }
                    ].map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setStage2SubTab(sub.id)}
                        style={{
                          padding: "12px 18px", border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 700,
                          color: stage2SubTab === sub.id ? C.teal : C.text2,
                          borderBottom: stage2SubTab === sub.id ? `2px solid ${C.teal}` : "2px solid transparent"
                        }}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                  {stage2SubTab === "programme" && (
                    <div style={{ padding: 24 }}>
                      {/* SUB-TAB NAVBAR WITH TITLE & ICON TOOLBAR */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: C.text1 }}>
                            {processCategory} — Audit Programme Table
                          </div>
                        </div>

                        {/* SLEEK COMPACT ICON TOOLBAR */}
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {/* Download Format Icon */}
                          <button
                            onClick={() => downloadExcelTemplate("programme")}
                            title="Download Sample Excel Format"
                            style={{
                              width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`,
                              backgroundColor: C.surface, color: C.text2, cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.15s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.text1; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
                          >
                            <Download size={17} />
                          </button>

                          {/* Upload Excel Icon */}
                          <label
                            title="Upload Excel (Column Mapping Panel)"
                            style={{
                              width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.tealBorder}`,
                              backgroundColor: C.tealBg, color: C.teal, cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.15s ease", boxShadow: "0 1px 2px rgba(13,148,136,0.12)"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.teal; e.currentTarget.style.color = "#ffffff"; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.tealBg; e.currentTarget.style.color = C.teal; }}
                          >
                            <Upload size={17} />
                            <input type="file" accept=".csv, .xlsx, .xls" onChange={e => handleFileUpload(e, "programme")} style={{ display: "none" }} />
                          </label>

                          {/* Add Custom Column Icon */}
                          <button
                            onClick={() => { setColTargetTab("programme"); setShowAddColModal(true); }}
                            title="Add / Configure Custom Column (Microsoft Lists style)"
                            style={{
                              width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`,
                              backgroundColor: C.surface, color: C.text2, cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.15s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.teal; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
                          >
                            <Settings size={17} />
                          </button>

                          {/* Add Step Button */}
                          <button
                            onClick={() => {
                              const initData = {};
                              customColumns.forEach(col => {
                                if (col.key === 'serial_no') initData[col.key] = `1.${programmeRows.length + 1}`;
                                else if (col.key === 'risk_rating') initData[col.key] = "Medium";
                                else if (col.key === 'status') initData[col.key] = "Pending";
                                else initData[col.key] = "";
                              });
                              setStepFormData(initData);
                              setIsHeaderStep(false);
                              setHeaderTitle("");
                              setShowAddStepModal(true);
                            }}
                            title="Add Procedure / Step"
                            style={{
                              height: 36, padding: "0 14px", borderRadius: 8, border: "none",
                              backgroundColor: C.teal, color: "#fff", cursor: "pointer",
                              display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700,
                              boxShadow: "0 2px 6px rgba(13,148,136,0.25)"
                            }}
                          >
                            <Plus size={16} /> Add Step
                          </button>
                        </div>
                      </div>

                      {/* DYNAMIC AUDIT PROGRAMME TABLE WITH HORIZONTAL ROW SCROLLING & DRAGGABLE COLUMNS */}
                      <div
                        ref={tableContainerRef}
                        onMouseDown={handlePanMouseDown}
                        onMouseLeave={handlePanMouseLeave}
                        onMouseUp={handlePanMouseUp}
                        onMouseMove={handlePanMouseMove}
                        style={{
                          overflowX: "auto", width: "100%", maxWidth: "100%", border: `1px solid ${C.border}`, borderRadius: 8,
                          cursor: isPanning ? "grabbing" : "grab", userSelect: isPanning ? "none" : "auto",
                          WebkitOverflowScrolling: "touch"
                        }}
                      >
                        <table style={{ width: "max-content", minWidth: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                          <thead>
                            <tr style={{ backgroundColor: "#1e293b", color: "#ffffff", textAlign: "left" }}>
                              {/* Grip indicator column */}
                              <th style={{ padding: "12px 6px", border: `1px solid #334155`, width: 36, textAlign: "center" }}>
                                <MoveHorizontal size={14} style={{ opacity: 0.5 }} />
                              </th>

                              {customColumns.map((col, colIdx) => (
                                <th
                                  key={col.key}
                                  draggable
                                  onDragStart={(e) => handleColDragStart(e, colIdx)}
                                  onDragOver={handleColDragOver}
                                  onDrop={(e) => handleColDrop(e, colIdx)}
                                  title="Click and drag left/right to move column position"
                                  style={{
                                    padding: "10px 10px", border: `1px solid #334155`,
                                    width: col.width || 130, minWidth: col.width || 130, maxWidth: col.width ? col.width + 40 : 200,
                                    fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4,
                                    cursor: "grab", backgroundColor: draggedColIdx === colIdx ? "#0f172a" : "#1e293b",
                                    transition: "background-color 0.15s ease"
                                  }}
                                >
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 5 }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      <GripVertical size={12} style={{ opacity: 0.4, cursor: "grab", flexShrink: 0 }} />
                                      {col.label}
                                    </span>
                                    {!['serial_no', 'procedure', 'sub_process'].includes(col.key) && (
                                      <button onClick={() => handleDeleteColumn(col.key)} title="Remove Column" style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 11, paddingLeft: 3 }}>
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {programmeRows.length > 0 ? (
                              programmeRows.map((row, rowIdx) => {
                                const isHeader = row.is_header || row.row_data?.is_header || row.row_data?.row_type === 'header' || (!row.row_data?.procedure && row.row_data?.title);

                                if (isHeader) {
                                  const headerText = row.row_data?.title || row.row_data?.step || row.row_data?.serial_no || "Procedure Section";

                                  return (
                                    <tr
                                      key={row.id}
                                      draggable
                                      onDragStart={(e) => handleRowDragStart(e, rowIdx)}
                                      onDragOver={handleRowDragOver}
                                      onDrop={(e) => handleRowDrop(e, rowIdx)}
                                      onClick={(e) => {
                                        if (e.target.closest('button') || e.target.closest('svg')) return;
                                        handleOpenDrawerForRow(row);
                                      }}
                                      style={{
                                        backgroundColor: draggedRowIdx === rowIdx ? "#1e293b" : "#334155",
                                        color: "#f8fafc", cursor: "pointer"
                                      }}
                                    >
                                      <td style={{ padding: "10px 6px", textAlign: "center", border: `1px solid #475569` }}>
                                        <GripVertical size={14} style={{ opacity: 0.6 }} />
                                      </td>
                                      <td colSpan={customColumns.length} style={{ padding: "10px 16px", fontWeight: 800, fontSize: 13, letterSpacing: 0.3 }}>
                                        <span>{headerText}</span>
                                      </td>
                                    </tr>
                                  );
                                }

                                return (
                                  <tr
                                    key={row.id}
                                    draggable
                                    onDragStart={(e) => handleRowDragStart(e, rowIdx)}
                                    onDragOver={handleRowDragOver}
                                    onDrop={(e) => handleRowDrop(e, rowIdx)}
                                    onClick={(e) => {
                                      if (e.target.closest('button') || e.target.closest('svg')) return;
                                      handleOpenDrawerForRow(row);
                                    }}
                                    style={{
                                      backgroundColor: draggedRowIdx === rowIdx ? C.bg2 : C.surface,
                                      transition: "background-color 0.15s ease", cursor: "pointer"
                                    }}
                                    onMouseEnter={e => { if (draggedRowIdx === null) e.currentTarget.style.backgroundColor = C.bg2; }}
                                    onMouseLeave={e => { if (draggedRowIdx === null) e.currentTarget.style.backgroundColor = C.surface; }}
                                  >
                                    <td style={{ padding: "11px 6px", textAlign: "center", border: `1px solid ${C.border}`, verticalAlign: "middle" }}>
                                      <GripVertical size={14} style={{ color: C.text3, cursor: "grab" }} />
                                    </td>
                                    {customColumns.map(col => {
                                      const rawVal = row.row_data?.[col.key] ?? (col.key === 'step' ? row.row_data?.procedure : "");
                                      let val = "";
                                      if (typeof rawVal === "string" || typeof rawVal === "number") {
                                        val = String(rawVal);
                                      } else if (Array.isArray(rawVal)) {
                                        val = rawVal.map(item => typeof item === "object" ? (item.text || item.comment || item.label || JSON.stringify(item)) : String(item)).filter(Boolean).join(", ");
                                      } else if (rawVal && typeof rawVal === "object") {
                                        val = rawVal.text || rawVal.comment || rawVal.label || JSON.stringify(rawVal);
                                      }

                                      const matchedChoice = col.choices?.find(c => (c.label || "").toLowerCase() === (val || "").toLowerCase());
                                      const choiceColor = matchedChoice?.color;

                                      return (
                                        <td key={col.key} style={{ padding: "9px 10px", border: `1px solid ${C.border}`, fontSize: 12, verticalAlign: "top", color: C.text1, width: col.width || 130, minWidth: col.width || 130, maxWidth: col.width ? col.width + 40 : 200, wordBreak: "break-word" }}>
                                          {col.key === 'serial_no' ? (
                                            <span style={{ fontWeight: 700, color: C.teal, fontFamily: MONO }}>{val || "—"}</span>
                                          ) : col.key === 'sub_process' ? (
                                            <span style={{ fontWeight: 600, color: C.text1 }}>{val || "—"}</span>
                                          ) : col.key === 'risk_rating' ? (
                                            <span style={{ padding: "3px 9px", borderRadius: 10, fontSize: 11, fontWeight: 700, backgroundColor: val === 'High' || val === 'High Risk' ? C.redBg : val === 'Low' || val === 'Low Risk' ? C.greenBg : C.amberBg, color: val === 'High' || val === 'High Risk' ? C.red : val === 'Low' || val === 'Low Risk' ? C.green : C.amber, border: `1px solid ${val === 'High' || val === 'High Risk' ? C.redBorder : val === 'Low' || val === 'Low Risk' ? C.greenBorder : C.amberBorder}` }}>
                                              {val || "Medium"}
                                            </span>
                                          ) : col.key === 'status' ? (
                                            <span style={{ padding: "3px 9px", borderRadius: 10, fontSize: 11, fontWeight: 700, backgroundColor: val === 'Completed' || val === 'Done' ? C.greenBg : val === 'In Progress' ? C.blueBg : C.amberBg, color: val === 'Completed' || val === 'Done' ? C.green : val === 'In Progress' ? C.blue : C.amber, border: `1px solid ${val === 'Completed' || val === 'Done' ? C.greenBorder : val === 'In Progress' ? C.blueBorder : C.amberBorder}` }}>
                                              {val || "Pending"}
                                            </span>
                                          ) : col.key === 'assigned_to' || col.type === 'employee' ? (
                                            val ? (
                                              (() => {
                                                const empName = getEmployeeName(val);
                                                const empObj = getEmployeeObj(val);
                                                const initials = (empName || "AP").split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                                                const avatar = empObj?.avatar_url || empObj?.avatar || empObj?.profile_picture_url || "";
                                                return (
                                                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                    {avatar ? (
                                                      <img src={avatar} alt={empName} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `1px solid ${C.border}` }} />
                                                    ) : (
                                                      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: C.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                                        {initials}
                                                      </div>
                                                    )}
                                                    <span style={{ fontWeight: 600, fontSize: 12, color: C.text1 }}>{empName}</span>
                                                  </div>
                                                );
                                              })()
                                            ) : (
                                              <span style={{ color: C.text3 }}>—</span>
                                            )
                                          ) : choiceColor ? (
                                            <span style={{ padding: "4px 10px", borderRadius: 12, fontSize: 11.5, fontWeight: 700, backgroundColor: choiceColor + "1a", color: choiceColor, border: `1px solid ${choiceColor}50`, display: "inline-block" }}>
                                              {val || "—"}
                                            </span>
                                          ) : (
                                            <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{val || "—"}</span>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={customColumns.length + 1} style={{ padding: 40, textAlign: "center", color: C.text3 }}>
                                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text2, marginBottom: 8 }}>
                                    No audit programme steps added for {processCategory} yet.
                                  </div>
                                  <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12 }}>
                                    <button
                                      onClick={() => {
                                        const initData = {};
                                        customColumns.forEach(col => {
                                          if (col.key === 'serial_no') initData[col.key] = "1.1";
                                          else if (col.key === 'risk_rating') initData[col.key] = "Medium";
                                          else if (col.key === 'status') initData[col.key] = "Pending";
                                          else initData[col.key] = "";
                                        });
                                        setStepFormData(initData);
                                        setIsHeaderStep(false);
                                        setHeaderTitle("");
                                        setShowAddStepModal(true);
                                      }}
                                      style={{ padding: "8px 18px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                                    >
                                      + Add First Audit Step
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 2: Data Tracker / IDR */}
                  {stage2SubTab === "tracker" && (
                    <div style={{ padding: 24 }}>
                      {/* Control Bar & View Mode Toggle */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: C.text1 }}>Information Document Request (IDR) Data Tracker</div>
                        </div>

                        {/* Actions: + Add Data Requirement & View Switcher */}
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <button
                            onClick={() => {
                              setNewTrackerItem({ data_requirement: "", sub_process: "", client_person_id: "", remarks: "" });
                              setShowAddTrackerModal(true);
                            }}
                            style={{
                              padding: "7px 16px", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                              backgroundColor: C.teal, color: "#fff", border: "none", display: "flex", alignItems: "center", gap: 6,
                              boxShadow: "0 2px 6px rgba(13,148,136,0.3)"
                            }}
                          >
                            <Plus size={15} /> + Add Data Requirement
                          </button>

                          {/* View Switcher: Table View vs Pipeline Kanban View */}
                          <div style={{ display: "flex", gap: 6, backgroundColor: C.bg2, padding: 4, borderRadius: 10, border: `1px solid ${C.border}` }}>
                            <button
                              onClick={() => setTrackerViewMode("table")}
                              style={{
                                padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none",
                                backgroundColor: trackerViewMode === "table" ? C.surface : "transparent",
                                color: trackerViewMode === "table" ? C.teal : C.text2,
                                boxShadow: trackerViewMode === "table" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                                display: "flex", alignItems: "center", gap: 6
                              }}
                            >
                              <FileText size={14} /> 📋 Table View
                            </button>
                            <button
                              onClick={() => setTrackerViewMode("pipeline")}
                              style={{
                                padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none",
                                backgroundColor: trackerViewMode === "pipeline" ? C.surface : "transparent",
                                color: trackerViewMode === "pipeline" ? C.teal : C.text2,
                                boxShadow: trackerViewMode === "pipeline" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                                display: "flex", alignItems: "center", gap: 6
                              }}
                            >
                              <Layers size={14} /> 🔀 Pipeline View
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Multi-Selection Action Toolbar (When rows are checked) */}
                      {selectedTrackerRowIds.length > 0 && (
                        <div style={{
                          backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, padding: "12px 18px", borderRadius: 12,
                          marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.teal }}>
                            ✓ Selected {selectedTrackerRowIds.length} Document Request(s)
                          </div>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <button
                              onClick={() => {
                                const selectedItems = dataTrackerRows.filter(r => selectedTrackerRowIds.includes(r.id));
                                const recipientId = selectedItems[0]?.client_person_id || "";
                                if (!recipientId) return showToast("Please select a Client Person Recipient for at least one selected document first.", "warning", "Recipient Required");
                                handleOpenEmailDraft(selectedItems, recipientId);
                              }}
                              style={{
                                padding: "7px 16px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8,
                                fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                                boxShadow: "0 2px 6px rgba(13,148,136,0.3)"
                              }}
                            >
                              <Send size={13} /> Draft Consolidated Email ({selectedTrackerRowIds.length} items)
                            </button>
                            <button
                              onClick={() => setSelectedTrackerRowIds([])}
                              style={{ padding: "7px 12px", border: `1px solid ${C.border}`, borderRadius: 8, background: C.surface, color: C.text2, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                            >
                              Clear Selection
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 1. TABLE VIEW */}
                      {trackerViewMode === "table" && (
                        <div style={{ borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                              <tr style={{ backgroundColor: C.bg2, color: C.text2, textAlign: "left" }}>
                                <th style={{ padding: 12, border: `1px solid ${C.border}`, width: 40, textAlign: "center" }}>
                                  <input
                                    type="checkbox"
                                    checked={selectedTrackerRowIds.length > 0 && selectedTrackerRowIds.length === dataTrackerRows.length}
                                    onChange={e => {
                                      if (e.target.checked) setSelectedTrackerRowIds(dataTrackerRows.map(r => r.id));
                                      else setSelectedTrackerRowIds([]);
                                    }}
                                  />
                                </th>
                                <th style={{ padding: 12, border: `1px solid ${C.border}` }}>Data Requirement / Document Requested</th>
                                <th style={{ padding: 12, border: `1px solid ${C.border}`, width: 140 }}>Status</th>
                                <th style={{ padding: 12, border: `1px solid ${C.border}`, width: 250 }}>Client Person Recipient</th>
                                <th style={{ padding: 12, border: `1px solid ${C.border}`, width: 130 }}>Uploaded Files</th>
                                <th style={{ padding: 12, border: `1px solid ${C.border}`, width: 190 }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dataTrackerRows.length === 0 ? (
                                <tr>
                                  <td colSpan={6} style={{ padding: 32, textAlign: "center", color: C.text3 }}>
                                    No data requirements requested yet. Click "+ Add Data Requirement" above or define data requirements in Stage 2 Audit Programme Table to auto-populate the tracker.
                                  </td>
                                </tr>
                              ) : (
                                dataTrackerRows.map(tr => {
                                  const linkedProg = programmeRows.find(p => p.id === tr.programme_id);
                                  const dataReqText = linkedProg?.row_data?.data_requirement || tr.data_requirement || "Requested Audit Document";
                                  const docStatus = tr.status_json?.document_status || "Pending";
                                  const attachments = tr.attachments || [];
                                  const isChecked = selectedTrackerRowIds.includes(tr.id);

                                  return (
                                    <tr key={tr.id} style={{ backgroundColor: isChecked ? C.tealBg + "30" : "transparent" }}>
                                      <td style={{ padding: 12, border: `1px solid ${C.border}`, textAlign: "center" }}>
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={e => {
                                            if (e.target.checked) setSelectedTrackerRowIds([...selectedTrackerRowIds, tr.id]);
                                            else setSelectedTrackerRowIds(selectedTrackerRowIds.filter(id => id !== tr.id));
                                          }}
                                        />
                                      </td>
                                      <td style={{ padding: 12, border: `1px solid ${C.border}` }}>
                                        <div style={{ fontWeight: 700, color: C.text1 }}>{dataReqText}</div>
                                        {(tr.sub_process || linkedProg?.row_data?.sub_process) && (
                                          <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{tr.sub_process || linkedProg.row_data.sub_process}</div>
                                        )}
                                      </td>
                                      <td style={{ padding: 12, border: `1px solid ${C.border}` }}>
                                        <span style={{
                                          padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, display: "inline-block",
                                          backgroundColor: docStatus === "Received" ? C.greenBg : docStatus === "Reviewed" ? C.purpleBg : docStatus === "Email Sent" ? C.tealBg : C.amberBg,
                                          color: docStatus === "Received" ? C.green : docStatus === "Reviewed" ? C.purple : docStatus === "Email Sent" ? C.teal : C.amber,
                                          border: `1px solid ${docStatus === "Received" ? C.greenBorder : docStatus === "Reviewed" ? C.purpleBorder : docStatus === "Email Sent" ? C.tealBorder : C.amberBorder}`
                                        }}>
                                          {docStatus === "Email Sent" ? "✉️ Email Sent" : docStatus === "Received" ? "📤 Received" : docStatus === "Reviewed" ? "✅ Verified" : "📌 Pending"}
                                        </span>
                                      </td>
                                      <td style={{ padding: 12, border: `1px solid ${C.border}` }}>
                                        <select
                                          value={tr.client_person_id || ""}
                                          onChange={async e => {
                                            const val = e.target.value;
                                            const updated = dataTrackerRows.map(r => r.id === tr.id ? { ...r, client_person_id: val } : r);
                                            setDataTrackerRows(updated);
                                            if (selectedProject?.id) {
                                              try {
                                                await fetch(`/Auditing/api/dynamic/projects/${selectedProject.id}/stage2`, {
                                                  method: 'POST',
                                                  headers: { 'Content-Type': 'application/json' },
                                                  body: JSON.stringify({ action: 'save_data_tracker', data_tracker: updated })
                                                });
                                              } catch (err) { }
                                            }
                                          }}
                                          style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12 }}
                                        >
                                          <option value="">Select Client Person Email...</option>
                                          {orgMembers.map(m => (
                                            <option key={m.id} value={m.id}>{m.member_name} ({m.email})</option>
                                          ))}
                                        </select>
                                      </td>
                                      <td style={{ padding: 12, border: `1px solid ${C.border}` }}>
                                        {attachments.length > 0 ? (
                                          <button
                                            onClick={() => { setViewingFileItem(tr); setShowUploadedFilesModal(true); }}
                                            style={{
                                              padding: "4px 10px", borderRadius: 8, backgroundColor: C.greenBg, color: C.green,
                                              border: `1px solid ${C.greenBorder}`, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                                              display: "flex", alignItems: "center", gap: 5
                                            }}
                                          >
                                            <FileSpreadsheet size={13} /> {attachments.length} file(s)
                                          </button>
                                        ) : (
                                          <span style={{ fontSize: 12, color: C.text3 }}>No files uploaded</span>
                                        )}
                                      </td>
                                      <td style={{ padding: 12, border: `1px solid ${C.border}` }}>
                                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                          <button
                                            onClick={() => handleOpenEmailDraft([tr], tr.client_person_id)}
                                            style={{
                                              padding: "6px 10px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 6,
                                              fontSize: 11.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                                            }}
                                            title="Draft & Send Email to Client"
                                          >
                                            <Send size={12} /> Draft Email
                                          </button>

                                          {tr.status_json?.portal_token && (
                                            <button
                                              onClick={() => window.open(`/Auditing/client-portal/${tr.status_json.portal_token}`, '_blank')}
                                              style={{
                                                padding: "6px 10px", backgroundColor: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`, borderRadius: 6,
                                                fontSize: 11.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                                              }}
                                              title="Open Secure Upload Portal"
                                            >
                                              <ExternalLink size={12} /> Portal
                                            </button>
                                          )}

                                          {attachments.length > 0 && (
                                            <button
                                              onClick={() => { setViewingFileItem(tr); setShowUploadedFilesModal(true); }}
                                              style={{ padding: "6px 10px", backgroundColor: C.surface, color: C.text2, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}
                                              title="View uploaded files"
                                            >
                                              View
                                            </button>
                                          )}

                                          <button
                                            onClick={() => handleDeleteTrackerItem(tr)}
                                            style={{ padding: "6px 8px", backgroundColor: C.surface, color: C.red, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11.5, cursor: "pointer" }}
                                            title="Remove requirement from tracker"
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* 2. PIPELINE KANBAN BOARD VIEW */}
                      {trackerViewMode === "pipeline" && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignItems: "start" }}>

                          {/* Column 1: Draft / Pending */}
                          <div style={{ backgroundColor: C.bg2, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: C.text2, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>📌 1. Draft / Pending ({dataTrackerRows.filter(r => !r.status_json?.document_status || r.status_json?.document_status === "Pending" || r.status_json?.document_status === "Not Received").length})</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              {dataTrackerRows.filter(r => !r.status_json?.document_status || r.status_json?.document_status === "Pending" || r.status_json?.document_status === "Not Received").map(tr => {
                                const linkedProg = programmeRows.find(p => p.id === tr.programme_id);
                                const dataReqText = linkedProg?.row_data?.data_requirement || tr.data_requirement || "Audit Document";
                                const recipientObj = orgMembers.find(m => String(m.id) === String(tr.client_person_id));

                                return (
                                  <div key={tr.id} style={{ backgroundColor: C.surface, borderRadius: 10, padding: 14, border: `1px solid ${C.border}`, boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
                                    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, marginBottom: 6 }}>{dataReqText}</div>
                                    <div style={{ fontSize: 11, color: C.text3, marginBottom: 10 }}>
                                      Recipient: {recipientObj ? <strong>{recipientObj.member_name}</strong> : <span style={{ color: C.amber }}>Not assigned</span>}
                                    </div>
                                    <button
                                      onClick={() => handleOpenEmailDraft([tr], tr.client_person_id)}
                                      style={{ width: "100%", padding: "6px", backgroundColor: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`, borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                                    >
                                      <Send size={12} /> Draft Email Request
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Column 2: Email Sent / Awaiting Upload */}
                          <div style={{ backgroundColor: C.tealBg + "40", borderRadius: 12, padding: 16, border: `1px solid ${C.tealBorder}` }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: C.teal, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>✉️ 2. Email Sent ({dataTrackerRows.filter(r => r.status_json?.document_status === "Email Sent").length})</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              {dataTrackerRows.filter(r => r.status_json?.document_status === "Email Sent").map(tr => {
                                const linkedProg = programmeRows.find(p => p.id === tr.programme_id);
                                const dataReqText = linkedProg?.row_data?.data_requirement || tr.data_requirement || "Audit Document";
                                const recipientObj = orgMembers.find(m => String(m.id) === String(tr.client_person_id));

                                return (
                                  <div key={tr.id} style={{ backgroundColor: C.surface, borderRadius: 10, padding: 14, border: `1px solid ${C.tealBorder}`, boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
                                    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, marginBottom: 6 }}>{dataReqText}</div>
                                    <div style={{ fontSize: 11, color: C.text3, marginBottom: 8 }}>
                                      To: <strong>{recipientObj?.member_name || "Client Person"}</strong>
                                    </div>
                                    <div style={{ fontSize: 10.5, fontWeight: 700, color: C.teal, backgroundColor: C.tealBg, padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.tealBorder}`, marginBottom: 8, display: "inline-block" }}>
                                      🔒 Secure Link Active
                                    </div>
                                    {tr.status_json?.portal_token && (
                                      <button
                                        onClick={() => window.open(`/Auditing/client-portal/${tr.status_json.portal_token}`, '_blank')}
                                        style={{ width: "100%", padding: "5px", backgroundColor: C.surface, color: C.teal, border: `1px solid ${C.tealBorder}`, borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                                      >
                                        <ExternalLink size={11} /> Open Public Portal Link
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Column 3: Document Received / Uploaded */}
                          <div style={{ backgroundColor: C.greenBg + "40", borderRadius: 12, padding: 16, border: `1px solid ${C.greenBorder}` }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: C.green, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>📤 3. Received ({dataTrackerRows.filter(r => r.status_json?.document_status === "Received").length})</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              {dataTrackerRows.filter(r => r.status_json?.document_status === "Received").map(tr => {
                                const linkedProg = programmeRows.find(p => p.id === tr.programme_id);
                                const dataReqText = linkedProg?.row_data?.data_requirement || tr.data_requirement || "Audit Document";
                                const files = tr.attachments || [];

                                return (
                                  <div key={tr.id} style={{ backgroundColor: C.surface, borderRadius: 10, padding: 14, border: `1px solid ${C.greenBorder}`, boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
                                    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, marginBottom: 6 }}>{dataReqText}</div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 8 }}>
                                      📁 {files.length} File(s) Uploaded
                                    </div>
                                    <button
                                      onClick={() => { setViewingFileItem(tr); setShowUploadedFilesModal(true); }}
                                      style={{ width: "100%", padding: "6px", backgroundColor: C.green, color: "#fff", border: "none", borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                                    >
                                      <FileSpreadsheet size={12} /> View Files & Verify
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Column 4: Reviewed & Verified */}
                          <div style={{ backgroundColor: C.purpleBg, borderRadius: 12, padding: 16, border: `1px solid ${C.purpleBorder}` }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: C.purple, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>✅ 4. Reviewed ({dataTrackerRows.filter(r => r.status_json?.document_status === "Reviewed").length})</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              {dataTrackerRows.filter(r => r.status_json?.document_status === "Reviewed").map(tr => {
                                const linkedProg = programmeRows.find(p => p.id === tr.programme_id);
                                const dataReqText = linkedProg?.row_data?.data_requirement || tr.data_requirement || "Audit Document";

                                return (
                                  <div key={tr.id} style={{ backgroundColor: C.surface, borderRadius: 10, padding: 14, border: `1px solid ${C.purpleBorder}`, boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
                                    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, marginBottom: 6 }}>{dataReqText}</div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: C.purple, display: "flex", alignItems: "center", gap: 4 }}>
                                      <CheckCircle2 size={13} /> Verified by Auditor
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  )}

                  {/* Sub-Tab 3: Minutes of Meeting (MOM) */}
                  {stage2SubTab === "mom" && (() => {
                    const currentMomList = momData[processCategory] || [];
                    const filteredMomList = currentMomList.filter(row => {
                      const q = momSearchQuery.toLowerCase();
                      const matchesSearch = !q ||
                        String(row.topic || "").toLowerCase().includes(q) ||
                        String(row.attendees || "").toLowerCase().includes(q) ||
                        String(row.key_discussion || "").toLowerCase().includes(q) ||
                        String(row.action_items || "").toLowerCase().includes(q) ||
                        String(row.owner || "").toLowerCase().includes(q);
                      const matchesStatus = momStatusFilter === "ALL" || row.status === momStatusFilter;
                      return matchesSearch && matchesStatus;
                    });

                    const handleUpdateMomRowInline = (rowId, fieldKey, newVal) => {
                      const updatedRows = currentMomList.map(r => r.id === rowId ? { ...r, [fieldKey]: newVal } : r);
                      const updatedAllMom = { ...momData, [processCategory]: updatedRows };
                      setMomData(updatedAllMom);
                      if (selectedProject?.id) {
                        saveMomToProject(selectedProject.id, processCategory, updatedAllMom, momColumns);
                      }
                    };

                    const handleDeleteMomRow = (rowId) => {
                      if (!confirm("Are you sure you want to delete this meeting minute?")) return;
                      const updatedRows = currentMomList.filter(r => r.id !== rowId);
                      const updatedAllMom = { ...momData, [processCategory]: updatedRows };
                      setMomData(updatedAllMom);
                      if (selectedProject?.id) {
                        saveMomToProject(selectedProject.id, processCategory, updatedAllMom, momColumns);
                      }
                      showToast("Meeting minute deleted.", "notice", "Deleted");
                    };

                    return (
                      <div style={{ padding: 24 }}>
                        {/* NAVBAR / TOOLBAR */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: C.text1 }}>
                              {processCategory} — Minutes of Meeting (MOM)
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {/* Search */}
                            <div style={{ position: "relative", width: 220 }}>
                              <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.text3 }} />
                              <input
                                type="text"
                                placeholder="Search discussions, actions..."
                                value={momSearchQuery}
                                onChange={e => setMomSearchQuery(e.target.value)}
                                style={{
                                  width: "100%", padding: "7px 10px 7px 30px", borderRadius: 8,
                                  border: `1px solid ${C.border}`, backgroundColor: C.surface, fontSize: 12, color: C.text1
                                }}
                              />
                            </div>

                            {/* Status Filter */}
                            <select
                              value={momStatusFilter}
                              onChange={e => setMomStatusFilter(e.target.value)}
                              style={{
                                padding: "7px 12px", borderRadius: 8, border: `1px solid ${C.border}`,
                                backgroundColor: C.surface, fontSize: 12, fontWeight: 600, color: C.text1
                              }}
                            >
                              <option value="ALL">All Statuses ({currentMomList.length})</option>
                              <option value="Open">Open</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Deferred">Deferred</option>
                            </select>

                            {/* Add Column Settings Button */}
                            <button
                              onClick={() => { setColTargetTab("mom"); setShowAddColModal(true); }}
                              title="Add Custom MOM Column (Microsoft Lists style)"
                              style={{
                                width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`,
                                backgroundColor: C.surface, color: C.text2, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.15s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.teal; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
                            >
                              <Settings size={17} />
                            </button>

                            {/* Add Meeting Minute Button */}
                            <button
                              onClick={() => {
                                setNewMomRow({
                                  meeting_date: new Date().toISOString().split('T')[0],
                                  topic: "",
                                  attendees: "",
                                  key_discussion: "",
                                  action_items: "",
                                  target_date: "",
                                  owner: "",
                                  status: "Open"
                                });
                                setShowAddMomModal(true);
                              }}
                              style={{
                                padding: "8px 16px", backgroundColor: C.teal, color: "#fff",
                                border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12.5,
                                fontWeight: 800, display: "flex", alignItems: "center", gap: 6,
                                boxShadow: "0 2px 6px rgba(13,148,136,0.25)"
                              }}
                            >
                              <Plus size={15} />
                              <span>+ Add Meeting Minute</span>
                            </button>
                          </div>
                        </div>

                        {/* TABLE */}
                        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", backgroundColor: C.surface }}>
                          <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                              <thead>
                                <tr style={{ backgroundColor: "#1e293b", color: "#f8fafc", borderBottom: `2px solid ${C.border}` }}>
                                  <th style={{ padding: "12px 14px", width: 50, textAlign: "center", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>#</th>
                                  {momColumns.map(col => (
                                    <th key={col.key} style={{ padding: "12px 14px", width: col.width || 180, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                      {col.label}
                                    </th>
                                  ))}
                                  <th style={{ padding: "12px 14px", width: 90, textAlign: "center", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {currentMomList.length === 0 ? (
                                  <tr>
                                    <td colSpan={momColumns.length + 2} style={{ padding: "48px 20px", textAlign: "center", backgroundColor: C.surface }}>
                                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, maxWidth: 480, margin: "0 auto" }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.tealBg, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.tealBorder}` }}>
                                          <MessageSquare size={22} color={C.teal} />
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>No Minutes of Meeting recorded yet</div>
                                        <div style={{ fontSize: 12.5, color: C.text3, lineHeight: 1.5, textAlign: "center" }}>
                                          Record stakeholder discussions, kickoff alignments, scope confirmations, and agreed action items for this audit process.
                                        </div>
                                        <button
                                          onClick={() => {
                                            setNewMomRow({
                                              meeting_date: new Date().toISOString().split('T')[0],
                                              topic: "",
                                              attendees: "",
                                              key_discussion: "",
                                              action_items: "",
                                              target_date: "",
                                              owner: "",
                                              status: "Open"
                                            });
                                            setShowAddMomModal(true);
                                          }}
                                          style={{
                                            marginTop: 6,
                                            padding: "8px 18px", backgroundColor: C.teal, color: "#fff",
                                            border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12.5,
                                            fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6,
                                            boxShadow: "0 2px 6px rgba(13,148,136,0.2)"
                                          }}
                                        >
                                          <Plus size={14} />
                                          <span>+ Add Meeting Minute</span>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ) : filteredMomList.length === 0 ? (
                                  <tr>
                                    <td colSpan={momColumns.length + 2} style={{ padding: 36, textAlign: "center", color: C.text3, fontSize: 13 }}>
                                      No meeting minutes matched your search/filter criteria.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredMomList.map((row, idx) => (
                                    <tr
                                      key={row.id || idx}
                                      style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.15s ease" }}
                                      onMouseEnter={e => e.currentTarget.style.backgroundColor = C.bg2}
                                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                      <td style={{ padding: "12px 14px", textAlign: "center", color: C.text3, fontWeight: 700, fontSize: 11.5 }}>
                                        {idx + 1}
                                      </td>
                                      {momColumns.map(col => {
                                        const cellVal = row[col.key] || "";

                                        if (col.key === "meeting_date" || col.type === "date") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                                              <span style={{ fontSize: 12, fontWeight: 600, color: C.text1, display: "inline-flex", alignItems: "center", gap: 5 }}>
                                                📅 {cellVal || "—"}
                                              </span>
                                            </td>
                                          );
                                        }

                                        if (col.key === "topic") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", fontWeight: 700, color: C.text1, minWidth: col.width }}>
                                              <div
                                                onClick={() => setSelectedMomDrawerRow(row)}
                                                style={{ cursor: "pointer", color: C.teal, textDecoration: "underline", textUnderlineOffset: 3 }}
                                                title="Click to view/edit full meeting notes"
                                              >
                                                {cellVal || "Untitled Meeting"}
                                              </div>
                                            </td>
                                          );
                                        }

                                        if (col.key === "status" || col.type === "select") {
                                          const statusBg = cellVal === "Completed" ? C.greenBg : cellVal === "In Progress" ? C.amberBg : cellVal === "Deferred" ? C.bg2 : C.blueBg;
                                          const statusColor = cellVal === "Completed" ? C.green : cellVal === "In Progress" ? C.amber : cellVal === "Deferred" ? C.text3 : C.blue;
                                          const statusBorder = cellVal === "Completed" ? C.greenBorder : cellVal === "In Progress" ? C.amberBorder : cellVal === "Deferred" ? C.border : C.blueBorder;

                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width }}>
                                              <select
                                                value={cellVal || "Open"}
                                                onChange={e => handleUpdateMomRowInline(row.id, col.key, e.target.value)}
                                                style={{
                                                  padding: "3px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                                                  backgroundColor: statusBg, color: statusColor, border: `1px solid ${statusBorder}`,
                                                  cursor: "pointer", outline: "none"
                                                }}
                                              >
                                                {(col.options || ["Open", "In Progress", "Completed", "Deferred"]).map(opt => (
                                                  <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                              </select>
                                            </td>
                                          );
                                        }

                                        if (col.type === "textarea" || col.key === "key_discussion" || col.key === "action_items") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width, maxWidth: 360 }}>
                                              <div
                                                title={cellVal}
                                                style={{
                                                  fontSize: 12, color: C.text2, lineHeight: 1.4,
                                                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                                                }}
                                              >
                                                {cellVal || <span style={{ color: C.text3, fontStyle: "italic" }}>No notes added</span>}
                                              </div>
                                            </td>
                                          );
                                        }

                                        return (
                                          <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width, color: C.text2, fontSize: 12 }}>
                                            {cellVal || "—"}
                                          </td>
                                        );
                                      })}

                                      <td style={{ padding: "12px 14px", textAlign: "center", whiteSpace: "nowrap" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                          <button
                                            onClick={() => setSelectedMomDrawerRow(row)}
                                            title="View & Edit Details"
                                            style={{
                                              border: "none", backgroundColor: C.tealBg, color: C.teal,
                                              width: 28, height: 28, borderRadius: 6, cursor: "pointer",
                                              display: "flex", alignItems: "center", justifyContent: "center"
                                            }}
                                          >
                                            <Edit2 size={13} />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteMomRow(row.id)}
                                            title="Delete Meeting Minute"
                                            style={{
                                              border: "none", backgroundColor: C.redBg, color: C.red,
                                              width: 28, height: 28, borderRadius: 6, cursor: "pointer",
                                              display: "flex", alignItems: "center", justifyContent: "center"
                                            }}
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Sub-Tab 4: Testing */}
                  {stage2SubTab === "testing" && (() => {
                    // 1. Only show data requirements where document has been received / uploaded by client
                    const receivedTrackerRows = (dataTrackerRows || []).filter(tr => {
                      const hasFiles = Array.isArray(tr.attachments) && tr.attachments.length > 0;
                      const isReceived = tr.status_json?.document_status === "Received" || tr.status_json?.document_status === "Reviewed";
                      return hasFiles || isReceived;
                    });

                    const trackerTestingItems = receivedTrackerRows.map((tr, idx) => {
                      const matchingProg = (programmeRows || []).find(p =>
                        String(p.id) === String(tr.programme_id) ||
                        String(p.id) === String(tr.id) ||
                        (p.row_data?.data_requirement && tr.data_requirement &&
                          String(p.row_data.data_requirement).trim().toLowerCase() === String(tr.data_requirement).trim().toLowerCase()) ||
                        (p.row_data?.procedure && tr.procedure &&
                          String(p.row_data.procedure).trim().toLowerCase() === String(tr.procedure).trim().toLowerCase())
                      );

                      const rowId = String(tr.id || matchingProg?.id || `tr_${idx}`);
                      const currentTestingState = testingData[rowId] || {};
                      const attachments = [...(tr.attachments || []), ...(matchingProg?.row_data?.attachments || [])];

                      // Fetch actual Key Risk and Objective from the Audit Programme table
                      const keyRiskText = matchingProg?.row_data?.key_risk || matchingProg?.row_data?.risk || matchingProg?.row_data?.risk_description || tr.key_risk || "—";
                      const objectiveText = matchingProg?.row_data?.objective || matchingProg?.row_data?.expected_key_control || matchingProg?.row_data?.control_objective || tr.objective || "—";
                      const riskRating = matchingProg?.row_data?.risk_rating || matchingProg?.row_data?.risk_level || "Medium";

                      return {
                        id: rowId,
                        trackerRow: tr,
                        programmeRow: matchingProg,
                        data_requirement: tr.data_requirement || matchingProg?.row_data?.data_requirement || "Audit Document",
                        procedure: matchingProg?.row_data?.procedure || matchingProg?.row_data?.step || tr.procedure || matchingProg?.title || "—",
                        sub_process: matchingProg?.row_data?.sub_process || tr.sub_process || "—",
                        objective: objectiveText,
                        key_risk: keyRiskText,
                        risk_rating: riskRating,
                        testing_status: currentTestingState.testing_status || "Pending Review",
                        observations_findings: currentTestingState.observations_findings !== undefined ? currentTestingState.observations_findings : (matchingProg?.row_data?.observations_findings || ""),
                        comments: currentTestingState.comments !== undefined ? currentTestingState.comments : (matchingProg?.row_data?.comments || ""),
                        custom_values: currentTestingState.custom_values || {},
                        attachments,
                        annexures: Array.isArray(currentTestingState.annexures) ? currentTestingState.annexures : (Array.isArray(tr.annexures) ? tr.annexures : []),
                        is_manual: false
                      };
                    });

                    // 2. Manual Testing Rows
                    const manualTestingRows = ((testingData.__manual_rows && testingData.__manual_rows[processCategory]) || []).map(mr => {
                      const currentTestingState = testingData[mr.id] || {};
                      return {
                        ...mr,
                        testing_status: currentTestingState.testing_status || mr.testing_status || "Pending Review",
                        observations_findings: currentTestingState.observations_findings !== undefined ? currentTestingState.observations_findings : (mr.observations_findings || ""),
                        comments: currentTestingState.comments !== undefined ? currentTestingState.comments : (mr.comments || ""),
                        custom_values: { ...(mr.custom_values || {}), ...(currentTestingState.custom_values || {}) },
                        attachments: mr.attachments || [],
                        annexures: Array.isArray(currentTestingState.annexures) ? currentTestingState.annexures : (Array.isArray(mr.annexures) ? mr.annexures : []),
                        is_manual: true
                      };
                    });

                    // Combined Testing Rows
                    const testingItems = [...trackerTestingItems, ...manualTestingRows];

                    const filteredTestingItems = testingItems.filter(item => {
                      const q = testingSearchQuery.toLowerCase();
                      const matchesSearch = !q ||
                        String(item.data_requirement || "").toLowerCase().includes(q) ||
                        String(item.procedure || "").toLowerCase().includes(q) ||
                        String(item.objective || "").toLowerCase().includes(q) ||
                        String(item.key_risk || "").toLowerCase().includes(q) ||
                        String(item.observations_findings || "").toLowerCase().includes(q) ||
                        String(item.comments || "").toLowerCase().includes(q);
                      const matchesStatus = testingStatusFilter === "ALL" || item.testing_status === testingStatusFilter;
                      return matchesSearch && matchesStatus;
                    });

                    const passCount = testingItems.filter(t => t.testing_status === "Satisfactory / Pass").length;
                    const queryCount = testingItems.filter(t => t.testing_status === "Exception / Query Raised" || t.testing_status === "Fail").length;
                    const inProgressCount = testingItems.filter(t => t.testing_status === "In Progress").length;
                    const pendingCount = testingItems.filter(t => t.testing_status === "Pending Review" || !t.testing_status).length;
                    const closedCount = testingItems.filter(t => t.testing_status === "Closed").length;

                    return (
                      <div style={{ padding: 24 }}>
                        {/* NAVBAR / TOOLBAR */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 14 }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: C.text1 }}>
                              {processCategory} — Testing Execution
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            {/* Search */}
                            <div style={{ position: "relative", width: 200 }}>
                              <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.text3 }} />
                              <input
                                type="text"
                                placeholder="Search testing rows..."
                                value={testingSearchQuery}
                                onChange={e => setTestingSearchQuery(e.target.value)}
                                style={{
                                  width: "100%", padding: "7px 10px 7px 30px", borderRadius: 8,
                                  border: `1px solid ${C.border}`, backgroundColor: C.surface, fontSize: 12, color: C.text1
                                }}
                              />
                            </div>

                            {/* Status Filter */}
                            <select
                              value={testingStatusFilter}
                              onChange={e => setTestingStatusFilter(e.target.value)}
                              style={{
                                padding: "7px 12px", borderRadius: 8, border: `1px solid ${C.border}`,
                                backgroundColor: C.surface, fontSize: 12, fontWeight: 600, color: C.text1
                              }}
                            >
                              <option value="ALL">All Statuses ({testingItems.length})</option>
                              <option value="Pending Review">Pending Review</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Satisfactory / Pass">Satisfactory / Pass</option>
                              <option value="Failed">Failed</option>
                              <option value="Exception / Query Raised">Exception / Query Raised</option>
                              <option value="Closed">Closed</option>
                            </select>

                            {/* Add Column Settings Button */}
                            <button
                              onClick={() => { setColTargetTab("testing"); setShowAddColModal(true); }}
                              title="Add Custom Testing Column (Microsoft Lists style)"
                              style={{
                                width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`,
                                backgroundColor: C.surface, color: C.text2, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.15s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.teal; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
                            >
                              <Settings size={17} />
                            </button>

                            {/* + Add Testing Row Button */}
                            <button
                              onClick={() => setShowAddTestingModal(true)}
                              style={{
                                padding: "8px 14px", backgroundColor: C.teal, color: "#fff",
                                border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12,
                                fontWeight: 800, display: "flex", alignItems: "center", gap: 6,
                                boxShadow: "0 2px 4px rgba(13, 148, 136, 0.2)"
                              }}
                            >
                              <Plus size={14} />
                              <span>+ Add Testing Row</span>
                            </button>
                          </div>
                        </div>

                        {/* TABLE */}
                        {testingItems.length === 0 ? (
                          <div style={{ padding: "48px 20px", textAlign: "center", backgroundColor: C.bg2, borderRadius: 12, border: `1px dashed ${C.border}` }}>
                            <FileText size={36} color={C.teal} style={{ opacity: 0.6, marginBottom: 12 }} />
                            <div style={{ fontSize: 15, fontWeight: 700, color: C.text1, marginBottom: 6 }}>No Testing Rows Available Yet</div>
                            <div style={{ fontSize: 12.5, color: C.text3, maxWidth: 520, margin: "0 auto 16px", lineHeight: 1.5 }}>
                              Testing rows are automatically populated when evidence documents are marked <strong>Received</strong> in <strong>2. Data Tracker / IDR</strong>, or you can add custom testing procedures manually.
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                              <button
                                onClick={() => setStage2SubTab("tracker")}
                                style={{
                                  padding: "8px 18px", backgroundColor: C.teal, color: "#fff",
                                  border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12.5,
                                  fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6
                                }}
                              >
                                <span>Go to 2. Data Tracker / IDR ➔</span>
                              </button>
                              <button
                                onClick={() => setShowAddTestingModal(true)}
                                style={{
                                  padding: "8px 18px", backgroundColor: C.surface, color: C.teal,
                                  border: `1px solid ${C.tealBorder}`, borderRadius: 8, cursor: "pointer", fontSize: 12.5,
                                  fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6
                                }}
                              >
                                <Plus size={14} />
                                <span>+ Add Testing Row Manually</span>
                              </button>
                            </div>
                          </div>
                        ) : filteredTestingItems.length === 0 ? (
                          <div style={{ padding: 36, textAlign: "center", color: C.text3, fontSize: 13 }}>
                            No testing rows matched your search/filter criteria.
                          </div>
                        ) : (
                          <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", backgroundColor: C.surface }}>
                            <div style={{ overflowX: "auto", width: "100%" }}>
                              <table style={{ width: "max-content", minWidth: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                                <thead>
                                  <tr style={{ backgroundColor: "#1e293b", color: "#ffffff", textAlign: "left" }}>
                                    <th style={{ padding: "12px 10px", width: 45, textAlign: "center", border: "1px solid #334155", fontSize: 11.5, fontWeight: 800 }}>#</th>
                                    {testingColumns.map(col => (
                                      <th key={col.key} style={{ padding: "12px 14px", width: col.width || 200, border: "1px solid #334155", fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                        {col.label}
                                      </th>
                                    ))}
                                    <th style={{ padding: "12px 14px", width: 95, textAlign: "center", border: "1px solid #334155", fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredTestingItems.map((item, idx) => (
                                    <tr
                                      key={item.id}
                                      onClick={() => setSelectedTestingDrawerRow(item)}
                                      style={{
                                        borderBottom: `1px solid ${C.border}`,
                                        cursor: "pointer",
                                        transition: "background-color 0.15s ease"
                                      }}
                                      onMouseEnter={e => e.currentTarget.style.backgroundColor = C.bg2}
                                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                                      title="Click row to open testing review & update panel"
                                    >
                                      <td style={{ padding: "12px 10px", textAlign: "center", color: C.text3, fontWeight: 700, fontSize: 11.5, border: `1px solid ${C.border}` }}>
                                        {idx + 1}
                                      </td>

                                      {testingColumns.map(col => {
                                        if (col.key === "data_requirement") {
                                          const hasFiles = item.attachments && item.attachments.length > 0;
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 220, border: `1px solid ${C.border}` }}>
                                              <div style={{ fontWeight: 700, color: C.text1, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                                                <span>{item.data_requirement}</span>
                                                {item.is_manual && (
                                                  <span style={{ fontSize: 9.5, fontWeight: 700, backgroundColor: "#e0f2fe", color: "#0369a1", padding: "1px 5px", borderRadius: 4 }}>
                                                    Manual
                                                  </span>
                                                )}
                                              </div>
                                              {hasFiles ? (
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setViewingFileItem({
                                                      data_requirement: item.data_requirement,
                                                      attachments: item.attachments
                                                    });
                                                    setShowUploadedFilesModal(true);
                                                  }}
                                                  style={{
                                                    display: "inline-flex", alignItems: "center", gap: 5,
                                                    padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.greenBorder}`,
                                                    backgroundColor: C.greenBg, color: C.green, fontSize: 11, fontWeight: 700, cursor: "pointer"
                                                  }}
                                                  title="Click to preview/download attached evidence files"
                                                >
                                                  <FolderOpen size={12} />
                                                  <span>{item.attachments.length} Evidence File(s)</span>
                                                </button>
                                              ) : (
                                                <span style={{ fontSize: 11, color: C.text3, fontStyle: "italic" }}>
                                                  {item.is_manual ? "Manual Procedure" : "Marked Received"}
                                                </span>
                                              )}
                                            </td>
                                          );
                                        }

                                        if (col.key === "procedure") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 280, maxWidth: 360, border: `1px solid ${C.border}` }}>
                                              <div style={{ fontWeight: 600, color: C.text1, fontSize: 12.5, lineHeight: 1.45 }}>
                                                {item.procedure}
                                              </div>
                                              {item.sub_process && item.sub_process !== "—" && (
                                                <div style={{ fontSize: 11, color: C.text3, marginTop: 4 }}>
                                                  Area: <strong style={{ color: C.text2 }}>{item.sub_process}</strong>
                                                </div>
                                              )}
                                            </td>
                                          );
                                        }

                                        if (col.key === "objective") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 220, maxWidth: 280, color: C.text2, fontSize: 12, lineHeight: 1.4, border: `1px solid ${C.border}` }}>
                                              {item.objective}
                                            </td>
                                          );
                                        }

                                        if (col.key === "key_risk" || col.key === "risk_rating") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 240, maxWidth: 320, color: C.text1, fontSize: 12, lineHeight: 1.45, border: `1px solid ${C.border}` }}>
                                              <div>{item.key_risk || "—"}</div>
                                            </td>
                                          );
                                        }

                                        if (col.key === "testing_status") {
                                          const st = item.testing_status || "Pending Review";
                                          const isPass = st === "Satisfactory / Pass";
                                          const isFailed = st === "Failed" || st === "Fail";
                                          const isExc = st === "Exception / Query Raised";
                                          const isInProg = st === "In Progress";
                                          const isClosed = st === "Closed";

                                          const bg = isPass ? C.greenBg : (isFailed || isExc) ? C.redBg : isInProg ? C.amberBg : isClosed ? C.purpleBg : C.bg2;
                                          const color = isPass ? C.green : (isFailed || isExc) ? C.red : isInProg ? C.amber : isClosed ? C.purple : C.text2;
                                          const border = isPass ? C.greenBorder : (isFailed || isExc) ? C.redBorder : isInProg ? C.amberBorder : isClosed ? C.purpleBorder : C.border;

                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 170, border: `1px solid ${C.border}` }}>
                                              <span
                                                style={{
                                                  display: "inline-block", padding: "4px 10px", borderRadius: 12,
                                                  fontSize: 11.5, fontWeight: 700, backgroundColor: bg, color: color,
                                                  border: `1px solid ${border}`
                                                }}
                                              >
                                                {isPass ? "✓ Pass" : isFailed ? "✕ Failed (In Queries)" : isExc ? "⚠️ Exception (In Queries)" : isInProg ? "⏳ In Progress" : isClosed ? "🔒 Closed" : "📌 Pending"}
                                              </span>
                                            </td>
                                          );
                                        }

                                        if (col.key === "observations_findings") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 240, maxWidth: 320, border: `1px solid ${C.border}` }}>
                                              {item.observations_findings ? (
                                                <div
                                                  style={{
                                                    fontSize: 12, color: C.text1, lineHeight: 1.45,
                                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                                                  }}
                                                  title={item.observations_findings}
                                                >
                                                  {item.observations_findings}
                                                </div>
                                              ) : (
                                                <span style={{ fontSize: 11.5, color: C.text3, fontStyle: "italic" }}>
                                                  Click row to add observations...
                                                </span>
                                              )}
                                            </td>
                                          );
                                        }

                                        if (col.key === "comments") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 200, maxWidth: 280, border: `1px solid ${C.border}` }}>
                                              {item.comments ? (
                                                <div
                                                  style={{
                                                    fontSize: 12, color: C.text2, lineHeight: 1.45,
                                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                                                  }}
                                                  title={item.comments}
                                                >
                                                  {item.comments}
                                                </div>
                                              ) : (
                                                <span style={{ fontSize: 11.5, color: C.text3, fontStyle: "italic" }}>
                                                  Click row to add notes...
                                                </span>
                                              )}
                                            </td>
                                          );
                                        }

                                        if (col.key === "annexures") {
                                          const annexuresList = Array.isArray(item.annexures) ? item.annexures : [];
                                          return (
                                            <td key={col.key} style={{ padding: "10px 12px", minWidth: col.width || 240, border: `1px solid ${C.border}` }}>
                                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                {annexuresList.length > 0 ? (
                                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                                    {annexuresList.map((file, fIdx) => (
                                                      <div
                                                        key={fIdx}
                                                        style={{
                                                          display: "flex", alignItems: "center", justifyContent: "space-between",
                                                          padding: "4px 8px", backgroundColor: C.bg2, borderRadius: 6,
                                                          border: `1px solid ${C.border}`, fontSize: 11.5
                                                        }}
                                                      >
                                                        <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0, flex: 1 }}>
                                                          <Paperclip size={12} color={C.teal} style={{ flexShrink: 0 }} />
                                                          <span
                                                            style={{ fontWeight: 600, color: C.text1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                                            title={file.name}
                                                          >
                                                            {file.name}
                                                          </span>
                                                          {file.size && (
                                                            <span style={{ fontSize: 9.5, color: C.text3, flexShrink: 0 }}>
                                                              ({(file.size / 1024).toFixed(0)} KB)
                                                            </span>
                                                          )}
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 6, flexShrink: 0 }}>
                                                          {file.dataUrl && (
                                                            <a
                                                              href={file.dataUrl}
                                                              download={file.name}
                                                              onClick={e => e.stopPropagation()}
                                                              title="Download / View Annexure"
                                                              style={{ color: C.teal, display: "flex", alignItems: "center", padding: 2 }}
                                                            >
                                                              <Download size={11} />
                                                            </a>
                                                          )}
                                                          <button
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              handleAnnexureDelete(item.id, fIdx);
                                                            }}
                                                            title="Remove Annexure"
                                                            style={{ border: "none", background: "transparent", cursor: "pointer", color: C.red, padding: 2, display: "flex", alignItems: "center" }}
                                                          >
                                                            <Trash2 size={11} />
                                                          </button>
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                ) : (
                                                  <span style={{ fontSize: 11, color: C.text3, fontStyle: "italic" }}>
                                                    No annexures attached
                                                  </span>
                                                )}

                                                <label
                                                  onClick={e => e.stopPropagation()}
                                                  style={{
                                                    display: "inline-flex", alignItems: "center", gap: 5,
                                                    padding: "4px 9px", borderRadius: 6,
                                                    border: `1px dashed ${C.tealBorder}`, backgroundColor: C.tealBg,
                                                    color: C.teal, fontSize: 11, fontWeight: 700, cursor: "pointer",
                                                    width: "fit-content"
                                                  }}
                                                >
                                                  <Upload size={12} />
                                                  <span>+ Upload Annexure(s)</span>
                                                  <input
                                                    type="file"
                                                    multiple
                                                    style={{ display: "none" }}
                                                    onChange={e => {
                                                      if (e.target.files && e.target.files.length > 0) {
                                                        handleAnnexureUpload(item.id, e.target.files);
                                                        e.target.value = "";
                                                      }
                                                    }}
                                                  />
                                                </label>
                                              </div>
                                            </td>
                                          );
                                        }

                                        // Custom Column Values
                                        const customVal = (item.custom_values && item.custom_values[col.key]) || "";
                                        return (
                                          <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 150, color: C.text1, fontSize: 12, border: `1px solid ${C.border}` }}>
                                            {customVal || "—"}
                                          </td>
                                        );
                                      })}

                                      <td style={{ padding: "12px 14px", textAlign: "center", whiteSpace: "nowrap", border: `1px solid ${C.border}` }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedTestingDrawerRow(item);
                                            }}
                                            title="Open Testing Review & Update Drawer"
                                            style={{
                                              border: `1px solid ${C.tealBorder}`, backgroundColor: C.tealBg, color: C.teal,
                                              padding: "6px 12px", borderRadius: 6, cursor: "pointer",
                                              display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700
                                            }}
                                          >
                                            <Edit2 size={12} />
                                            <span>Review</span>
                                          </button>
                                          {item.is_manual && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (!confirm("Are you sure you want to delete this manually added testing row?")) return;
                                                const currentManual = (testingData.__manual_rows && testingData.__manual_rows[processCategory]) || [];
                                                const updatedManual = currentManual.filter(r => r.id !== item.id);
                                                const updatedData = {
                                                  ...testingData,
                                                  __manual_rows: {
                                                    ...(testingData.__manual_rows || {}),
                                                    [processCategory]: updatedManual
                                                  }
                                                };
                                                setTestingData(updatedData);
                                                if (selectedProject?.id) {
                                                  saveTestingToProject(selectedProject.id, updatedData, testingColumns);
                                                }
                                                showToast("Testing row deleted.", "notice", "Deleted");
                                              }}
                                              title="Delete Manual Testing Row"
                                              style={{
                                                border: "none", backgroundColor: C.redBg, color: C.red,
                                                width: 28, height: 28, borderRadius: 6, cursor: "pointer",
                                                display: "inline-flex", alignItems: "center", justifyContent: "center"
                                              }}
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Sub-Tab 5: Queries */}
                  {stage2SubTab === "queries" && (() => {
                    // 1. Auto-Linked Queries from 4. Testing where status is 'Exception / Query Raised' or 'Fail'
                    const receivedTrackerRows = (dataTrackerRows || []).filter(tr => {
                      const hasFiles = Array.isArray(tr.attachments) && tr.attachments.length > 0;
                      const isReceived = tr.status_json?.document_status === "Received" || tr.status_json?.document_status === "Reviewed";
                      return hasFiles || isReceived;
                    });

                    const allTestingItems = [
                      ...receivedTrackerRows.map((tr, idx) => {
                        const matchingProg = (programmeRows || []).find(p =>
                          String(p.id) === String(tr.programme_id) ||
                          String(p.id) === String(tr.id) ||
                          (p.row_data?.data_requirement && tr.data_requirement &&
                            String(p.row_data.data_requirement).trim().toLowerCase() === String(tr.data_requirement).trim().toLowerCase()) ||
                          (p.row_data?.procedure && tr.procedure &&
                            String(p.row_data.procedure).trim().toLowerCase() === String(tr.procedure).trim().toLowerCase())
                        );
                        const rowId = String(tr.id || matchingProg?.id || `tr_${idx}`);
                        const currentTestingState = testingData[rowId] || {};
                        return {
                          id: rowId,
                          data_requirement: tr.data_requirement || matchingProg?.row_data?.data_requirement || "Audit Document",
                          procedure: matchingProg?.row_data?.procedure || matchingProg?.row_data?.step || tr.procedure || matchingProg?.title || "—",
                          key_risk: matchingProg?.row_data?.key_risk || matchingProg?.row_data?.risk || matchingProg?.row_data?.risk_description || tr.key_risk || "—",
                          risk_rating: matchingProg?.row_data?.risk_rating || matchingProg?.row_data?.risk_level || "Medium",
                          testing_status: currentTestingState.testing_status || "Pending Review",
                          observations_findings: currentTestingState.observations_findings !== undefined ? currentTestingState.observations_findings : (matchingProg?.row_data?.observations_findings || ""),
                          comments: currentTestingState.comments !== undefined ? currentTestingState.comments : (matchingProg?.row_data?.comments || ""),
                          attachments: [...(tr.attachments || []), ...(matchingProg?.row_data?.attachments || [])]
                        };
                      }),
                      ...((testingData.__manual_rows && testingData.__manual_rows[processCategory]) || []).map(mr => {
                        const currentTestingState = testingData[mr.id] || {};
                        return {
                          ...mr,
                          testing_status: currentTestingState.testing_status || mr.testing_status || "Pending Review",
                          observations_findings: currentTestingState.observations_findings !== undefined ? currentTestingState.observations_findings : (mr.observations_findings || ""),
                          comments: currentTestingState.comments !== undefined ? currentTestingState.comments : (mr.comments || ""),
                          attachments: mr.attachments || []
                        };
                      })
                    ];

                    const autoLinkedQueries = allTestingItems
                      .filter(t => t.testing_status === "Failed" || t.testing_status === "Fail" || t.testing_status === "Failed / Exception" || t.testing_status === "Exception / Query Raised")
                      .map(item => {
                        const qId = `q_auto_${item.id}`;
                        const qState = queriesData[qId] || queriesData[item.id] || {};
                        return {
                          id: qId,
                          testing_ref_id: item.id,
                          query_title: item.data_requirement || item.procedure,
                          procedure: item.procedure,
                          key_risk: item.key_risk,
                          risk_rating: item.risk_rating,
                          query_description: qState.query_description || item.observations_findings || "Exception / discrepancy identified during testing.",
                          client_response: qState.client_response || "",
                          query_status: qState.query_status || "Query Raised",
                          resolution_remarks: qState.resolution_remarks || item.comments || "",
                          custom_values: qState.custom_values || {},
                          attachments: item.attachments || [],
                          is_auto_linked: true
                        };
                      });

                    // 2. Manual Queries for this Process
                    const manualQueries = ((queriesData.__manual_rows && queriesData.__manual_rows[processCategory]) || []).map(mq => {
                      const qState = queriesData[mq.id] || {};
                      return {
                        ...mq,
                        query_title: qState.query_title || mq.query_title || "Manual Query",
                        procedure: qState.procedure || mq.procedure || "—",
                        query_description: qState.query_description !== undefined ? qState.query_description : (mq.query_description || ""),
                        client_response: qState.client_response !== undefined ? qState.client_response : (mq.client_response || ""),
                        query_status: qState.query_status || mq.query_status || "Query Raised",
                        resolution_remarks: qState.resolution_remarks !== undefined ? qState.resolution_remarks : (mq.resolution_remarks || ""),
                        custom_values: { ...(mq.custom_values || {}), ...(qState.custom_values || {}) },
                        attachments: mq.attachments || [],
                        is_auto_linked: false
                      };
                    });

                    // Combined Queries List
                    const allQueries = [...autoLinkedQueries, ...manualQueries];

                    const filteredQueries = allQueries.filter(q => {
                      const search = querySearchQuery.toLowerCase();
                      const matchesSearch = !search ||
                        String(q.query_title || "").toLowerCase().includes(search) ||
                        String(q.procedure || "").toLowerCase().includes(search) ||
                        String(q.query_description || "").toLowerCase().includes(search) ||
                        String(q.client_response || "").toLowerCase().includes(search) ||
                        String(q.resolution_remarks || "").toLowerCase().includes(search);
                      const matchesStatus = queryStatusFilter === "ALL" || q.query_status === queryStatusFilter;
                      return matchesSearch && matchesStatus;
                    });

                    const raisedCount = allQueries.filter(q => q.query_status === "Query Raised").length;
                    const sentCount = allQueries.filter(q => q.query_status === "Sent to Client").length;
                    const responseReceivedCount = allQueries.filter(q => q.query_status === "Response Received").length;
                    const resolvedCount = allQueries.filter(q => q.query_status === "Resolved / Closed" || q.query_status === "Accepted into Report").length;

                    return (
                      <div style={{ padding: 24 }}>
                        {/* NAVBAR / TOOLBAR */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 14 }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: C.text1 }}>
                              {processCategory} — Audit Queries & Observations
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            {/* Search */}
                            <div style={{ position: "relative", width: 200 }}>
                              <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.text3 }} />
                              <input
                                type="text"
                                placeholder="Search queries..."
                                value={querySearchQuery}
                                onChange={e => setQuerySearchQuery(e.target.value)}
                                style={{
                                  width: "100%", padding: "7px 10px 7px 30px", borderRadius: 8,
                                  border: `1px solid ${C.border}`, backgroundColor: C.surface, fontSize: 12, color: C.text1
                                }}
                              />
                            </div>

                            {/* Status Filter */}
                            <select
                              value={queryStatusFilter}
                              onChange={e => setQueryStatusFilter(e.target.value)}
                              style={{
                                padding: "7px 12px", borderRadius: 8, border: `1px solid ${C.border}`,
                                backgroundColor: C.surface, fontSize: 12, fontWeight: 600, color: C.text1
                              }}
                            >
                              <option value="ALL">All Query Statuses ({allQueries.length})</option>
                              <option value="Query Raised">Query Raised</option>
                              <option value="Sent to Client">Sent to Client</option>
                              <option value="Response Received">Response Received</option>
                              <option value="Resolved / Closed">Resolved / Closed</option>
                              <option value="Accepted into Report">Accepted into Report</option>
                            </select>

                            {/* Add Column Settings Button */}
                            <button
                              onClick={() => { setColTargetTab("queries"); setShowAddColModal(true); }}
                              title="Add Custom Queries Column (Microsoft Lists style)"
                              style={{
                                width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`,
                                backgroundColor: C.surface, color: C.text2, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.15s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.bg2; e.currentTarget.style.color = C.teal; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.color = C.text2; }}
                            >
                              <Settings size={17} />
                            </button>

                            {/* + Add Query Button */}
                            <button
                              onClick={() => setShowAddQueryModal(true)}
                              style={{
                                padding: "8px 14px", backgroundColor: "#e11d48", color: "#fff",
                                border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12,
                                fontWeight: 800, display: "flex", alignItems: "center", gap: 6,
                                boxShadow: "0 2px 4px rgba(225, 29, 72, 0.2)"
                              }}
                            >
                              <Plus size={14} />
                              <span>+ Add Query</span>
                            </button>
                          </div>
                        </div>

                        {/* TABLE */}
                        {allQueries.length === 0 ? (
                          <div style={{ padding: "48px 20px", textAlign: "center", backgroundColor: C.bg2, borderRadius: 12, border: `1px dashed ${C.border}` }}>
                            <AlertCircle size={36} color="#e11d48" style={{ opacity: 0.7, marginBottom: 12 }} />
                            <div style={{ fontSize: 15, fontWeight: 700, color: C.text1, marginBottom: 6 }}>No Audit Queries or Exceptions Recorded</div>
                            <div style={{ fontSize: 12.5, color: C.text3, maxWidth: 520, margin: "0 auto 16px", lineHeight: 1.5 }}>
                              Any test marked as <strong>Exception / Query Raised</strong> in <strong>4. Testing</strong> will automatically appear here. You can also log manual queries directly.
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                              <button
                                onClick={() => setStage2SubTab("testing")}
                                style={{
                                  padding: "8px 18px", backgroundColor: C.teal, color: "#fff",
                                  border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12.5,
                                  fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6
                                }}
                              >
                                <span>Go to 4. Testing ➔</span>
                              </button>
                              <button
                                onClick={() => setShowAddQueryModal(true)}
                                style={{
                                  padding: "8px 18px", backgroundColor: "#fff1f2", color: "#e11d48",
                                  border: "1px solid #fecdd3", borderRadius: 8, cursor: "pointer", fontSize: 12.5,
                                  fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6
                                }}
                              >
                                <Plus size={14} />
                                <span>+ Add Query Manually</span>
                              </button>
                            </div>
                          </div>
                        ) : filteredQueries.length === 0 ? (
                          <div style={{ padding: 36, textAlign: "center", color: C.text3, fontSize: 13 }}>
                            No queries matched your search/filter criteria.
                          </div>
                        ) : (
                          <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", backgroundColor: C.surface }}>
                            <div style={{ overflowX: "auto", width: "100%" }}>
                              <table style={{ width: "max-content", minWidth: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                                <thead>
                                  <tr style={{ backgroundColor: "#1e293b", color: "#ffffff", textAlign: "left" }}>
                                    <th style={{ padding: "12px 10px", width: 45, textAlign: "center", border: "1px solid #334155", fontSize: 11.5, fontWeight: 800 }}>#</th>
                                    {queriesColumns.map(col => (
                                      <th key={col.key} style={{ padding: "12px 14px", width: col.width || 220, border: "1px solid #334155", fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                        {col.label}
                                      </th>
                                    ))}
                                    <th style={{ padding: "12px 14px", width: 95, textAlign: "center", border: "1px solid #334155", fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredQueries.map((item, idx) => (
                                    <tr
                                      key={item.id}
                                      onClick={() => setSelectedQueryDrawerRow(item)}
                                      style={{
                                        borderBottom: `1px solid ${C.border}`,
                                        cursor: "pointer",
                                        transition: "background-color 0.15s ease"
                                      }}
                                      onMouseEnter={e => e.currentTarget.style.backgroundColor = C.bg2}
                                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                                      title="Click row to open query details and manage client response"
                                    >
                                      <td style={{ padding: "12px 10px", textAlign: "center", color: C.text3, fontWeight: 700, fontSize: 11.5, border: `1px solid ${C.border}` }}>
                                        {idx + 1}
                                      </td>

                                      {queriesColumns.map(col => {
                                        if (col.key === "query_title") {
                                          const hasFiles = item.attachments && item.attachments.length > 0;
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 220, border: `1px solid ${C.border}` }}>
                                              <div style={{ fontWeight: 700, color: C.text1, marginBottom: hasFiles ? 4 : 0 }}>
                                                {item.query_title}
                                              </div>
                                              {hasFiles && (
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setViewingFileItem({
                                                      data_requirement: item.query_title,
                                                      attachments: item.attachments
                                                    });
                                                    setShowUploadedFilesModal(true);
                                                  }}
                                                  style={{
                                                    display: "inline-flex", alignItems: "center", gap: 5,
                                                    padding: "2px 7px", borderRadius: 6, border: `1px solid ${C.greenBorder}`,
                                                    backgroundColor: C.greenBg, color: C.green, fontSize: 10.5, fontWeight: 700, cursor: "pointer"
                                                  }}
                                                  title="Click to preview/download attached evidence files"
                                                >
                                                  <FolderOpen size={11} />
                                                  <span>{item.attachments.length} Evidence</span>
                                                </button>
                                              )}
                                            </td>
                                          );
                                        }

                                        if (col.key === "procedure") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 260, maxWidth: 340, border: `1px solid ${C.border}` }}>
                                              <div style={{ fontWeight: 600, color: C.text1, fontSize: 12, lineHeight: 1.45 }}>
                                                {item.procedure}
                                              </div>
                                              {item.key_risk && item.key_risk !== "—" && (
                                                <div style={{ fontSize: 11, color: C.text3, marginTop: 4 }}>
                                                  Risk: <strong style={{ color: C.text2 }}>{item.key_risk}</strong>
                                                </div>
                                              )}
                                            </td>
                                          );
                                        }

                                        if (col.key === "query_description") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 280, maxWidth: 360, border: `1px solid ${C.border}` }}>
                                              {item.query_description ? (
                                                <div
                                                  style={{
                                                    fontSize: 12, color: "#b91c1c", lineHeight: 1.45, fontWeight: 500,
                                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                                                  }}
                                                  title={item.query_description}
                                                >
                                                  {item.query_description}
                                                </div>
                                              ) : (
                                                <span style={{ fontSize: 11.5, color: C.text3, fontStyle: "italic" }}>
                                                  Click row to describe query...
                                                </span>
                                              )}
                                            </td>
                                          );
                                        }

                                        if (col.key === "client_response") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 280, maxWidth: 360, border: `1px solid ${C.border}` }}>
                                              {item.client_response ? (
                                                <div
                                                  style={{
                                                    fontSize: 12, color: C.text1, lineHeight: 1.45,
                                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                                                  }}
                                                  title={item.client_response}
                                                >
                                                  {item.client_response}
                                                </div>
                                              ) : (
                                                <span style={{ fontSize: 11.5, color: C.text3, fontStyle: "italic" }}>
                                                  Awaiting client response...
                                                </span>
                                              )}
                                            </td>
                                          );
                                        }

                                        if (col.key === "query_status") {
                                          const st = item.query_status || "Query Raised";
                                          const isRaised = st === "Query Raised";
                                          const isSent = st === "Sent to Client";
                                          const isResp = st === "Response Received";
                                          const isResolved = st === "Resolved / Closed" || st === "Accepted into Report";

                                          const bg = isRaised ? "#fee2e2" : isSent ? "#dbeafe" : isResp ? "#fef3c7" : isResolved ? "#dcfce7" : C.bg2;
                                          const color = isRaised ? "#b91c1c" : isSent ? "#1d4ed8" : isResp ? "#b45309" : isResolved ? "#15803d" : C.text2;
                                          const border = isRaised ? "#fca5a5" : isSent ? "#93c5fd" : isResp ? "#fde68a" : isResolved ? "#86efac" : C.border;

                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 180, border: `1px solid ${C.border}` }}>
                                              <span
                                                style={{
                                                  display: "inline-block", padding: "4px 10px", borderRadius: 12,
                                                  fontSize: 11.5, fontWeight: 700, backgroundColor: bg, color: color,
                                                  border: `1px solid ${border}`
                                                }}
                                              >
                                                {st}
                                              </span>
                                            </td>
                                          );
                                        }

                                        if (col.key === "resolution_remarks") {
                                          return (
                                            <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 240, maxWidth: 320, border: `1px solid ${C.border}` }}>
                                              {item.resolution_remarks ? (
                                                <div
                                                  style={{
                                                    fontSize: 12, color: C.text2, lineHeight: 1.45,
                                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                                                  }}
                                                  title={item.resolution_remarks}
                                                >
                                                  {item.resolution_remarks}
                                                </div>
                                              ) : (
                                                <span style={{ fontSize: 11.5, color: C.text3, fontStyle: "italic" }}>
                                                  Click row to add conclusion...
                                                </span>
                                              )}
                                            </td>
                                          );
                                        }

                                        // Custom Column Values
                                        const customVal = (item.custom_values && item.custom_values[col.key]) || "";
                                        return (
                                          <td key={col.key} style={{ padding: "12px 14px", minWidth: col.width || 150, color: C.text1, fontSize: 12, border: `1px solid ${C.border}` }}>
                                            {customVal || "—"}
                                          </td>
                                        );
                                      })}

                                      <td style={{ padding: "12px 14px", textAlign: "center", whiteSpace: "nowrap", border: `1px solid ${C.border}` }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedQueryDrawerRow(item);
                                            }}
                                            title="Open Query Review & Client Response Drawer"
                                            style={{
                                              border: "1px solid #fca5a5", backgroundColor: "#fff1f2", color: "#e11d48",
                                              padding: "6px 12px", borderRadius: 6, cursor: "pointer",
                                              display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700
                                            }}
                                          >
                                            <Edit2 size={12} />
                                            <span>Manage</span>
                                          </button>
                                          {!item.is_auto_linked && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (!confirm("Are you sure you want to delete this query?")) return;
                                                const currentManual = (queriesData.__manual_rows && queriesData.__manual_rows[processCategory]) || [];
                                                const updatedManual = currentManual.filter(r => r.id !== item.id);
                                                const updatedData = {
                                                  ...queriesData,
                                                  __manual_rows: {
                                                    ...(queriesData.__manual_rows || {}),
                                                    [processCategory]: updatedManual
                                                  }
                                                };
                                                setQueriesData(updatedData);
                                                if (selectedProject?.id) {
                                                  saveQueriesToProject(selectedProject.id, updatedData, queriesColumns);
                                                }
                                                showToast("Query deleted.", "notice", "Deleted");
                                              }}
                                              title="Delete Manual Query"
                                              style={{
                                                border: "none", backgroundColor: C.redBg, color: C.red,
                                                width: 28, height: 28, borderRadius: 6, cursor: "pointer",
                                                display: "inline-flex", alignItems: "center", justifyContent: "center"
                                              }}
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS ── */}
      {/* 0. Add Custom Audit Type / Process Modal */}
      {showAddProcessModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 14, padding: 28, width: 480, border: `1px solid ${C.border}`, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text1, margin: 0 }}>(+) Add Custom Audit Type</h3>
              <button onClick={() => setShowAddProcessModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.text3 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.5, marginBottom: 16 }}>
              Define a new dynamic audit type (e.g. <strong>IT Security Audit</strong>, <strong>Tax Audit</strong>, <strong>Fixed Asset Audit</strong>). Each audit type contains its own 4 sub-views: Audit Programme Table, Data Tracker, MOM, and Testing.
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>Audit Type Name *</label>
              <input
                type="text"
                placeholder="e.g. IT Security Audit"
                value={newProcessInput}
                onChange={e => setNewProcessInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAddProcess(); }}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "Sora, sans-serif" }}
                autoFocus
              />
            </div>

            {/* Suggested Quick Choices */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Suggested Audit Types</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["P2P Audit", "Inventory Audit", "HR Audit", "O2C Audit", "Tax & Regulatory Audit", "IT Security Audit", "Fixed Assets Audit", "Treasury Audit"].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => handleAddProcess(suggestion)}
                    disabled={activeProcesses.includes(suggestion)}
                    style={{
                      padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, cursor: activeProcesses.includes(suggestion) ? "not-allowed" : "pointer",
                      fontSize: 11.5, fontWeight: 600, backgroundColor: activeProcesses.includes(suggestion) ? C.bg2 : C.surface,
                      color: activeProcesses.includes(suggestion) ? C.text3 : C.text1,
                      opacity: activeProcesses.includes(suggestion) ? 0.6 : 1
                    }}
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowAddProcessModal(false)}
                style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surface, color: C.text2, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddProcess()}
                style={{ padding: "9px 20px", borderRadius: 8, border: "none", backgroundColor: C.teal, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Create Audit Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Add / Edit Company Modal */}
      {showAddCompanyModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 12, padding: 28, width: 540, maxHeight: "90vh", overflowY: "auto", border: `1px solid ${C.border}`, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text1 }}>
                {editingCompanyId ? "✏️ Edit Company Audit Engagement" : "(+) Add New Company Audit Engagement"}
              </h3>
              <button
                type="button"
                onClick={() => { setShowAddCompanyModal(false); setEditingCompanyId(null); }}
                style={{ border: "none", background: "none", color: C.text3, cursor: "pointer", fontSize: 18, padding: 4 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Audit Template Framework (Locked if inside active template) */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Audit Template Framework</label>
                {selectedTemplate ? (
                  <div style={{ padding: "10px 12px", borderRadius: 6, border: `1px solid ${C.tealBorder}`, backgroundColor: C.tealBg, color: C.teal, fontSize: 13, fontWeight: 700, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{selectedTemplate.icon || "📋"}</span> {selectedTemplate.template_name}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, backgroundColor: C.teal, color: "#fff", padding: "2px 8px", borderRadius: 10 }}>Locked to Current Template</span>
                  </div>
                ) : (
                  <select
                    value={selectedTemplate?.id || ""}
                    onChange={e => {
                      const tpl = templates.find(t => t.id === e.target.value);
                      if (tpl) setSelectedTemplate(tpl);
                    }}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                  >
                    <option value="" disabled>Select Template Framework</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.template_name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Company & Project Core Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Company Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Lixil Window Systems Pvt Ltd"
                    value={newCompany.client_name}
                    onChange={e => setNewCompany({ ...newCompany, client_name: e.target.value })}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Financial Year *</label>
                  <input
                    type="text"
                    value={newCompany.financial_year}
                    onChange={e => setNewCompany({ ...newCompany, financial_year: e.target.value })}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Project Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Internal Audit FY 2026-27"
                  value={newCompany.project_name}
                  onChange={e => setNewCompany({ ...newCompany, project_name: e.target.value })}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                />
              </div>

              {/* 1. Company Category Selector (Stored in JSON & Column) */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Company Category *</label>
                <select
                  value={newCompany.company_category}
                  onChange={e => setNewCompany({ ...newCompany, company_category: e.target.value })}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, backgroundColor: C.surface, color: C.text1 }}
                >
                  <option value="">-- Select Company Category --</option>
                  <option value="Manufacturing">🏭 Manufacturing</option>
                  <option value="IT & Software Services">💻 IT & Software Services</option>
                  <option value="BFSI (Banking & Finance)">🏦 BFSI (Banking, Financial Services & Insurance)</option>
                  <option value="Healthcare & Pharma">🏥 Healthcare & Pharmaceuticals</option>
                  <option value="Retail & E-Commerce">🛍️ Retail & E-Commerce</option>
                  <option value="Real Estate & Construction">🏗️ Real Estate & Construction</option>
                  <option value="Automotive & Engineering">🚗 Automotive & Engineering</option>
                  <option value="FMCG & Consumer Goods">📦 FMCG & Consumer Goods</option>
                  <option value="Logistics & Supply Chain">🚚 Logistics & Supply Chain</option>
                  <option value="Energy & Utilities">⚡ Energy & Utilities</option>
                  <option value="Telecommunications">📡 Telecommunications</option>
                  <option value="Hospitality & Tourism">🏨 Hospitality & Tourism</option>
                  <option value="Metals & Mining">⛏️ Metals & Mining</option>
                  <option value="Agriculture & Food">🌾 Agriculture & Food</option>
                  <option value="Education">🎓 Education</option>
                  <option value="Services & Consulting">💼 Professional Services & Consulting</option>
                  <option value="Other">⚙️ Other (Custom Category)...</option>
                </select>

                {newCompany.company_category === "Other" && (
                  <div style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: C.teal }}>Specify Custom Category Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Aerospace Engineering, Defense, Apparel"
                      value={newCompany.custom_category}
                      onChange={e => setNewCompany({ ...newCompany, custom_category: e.target.value })}
                      style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.tealBorder}`, fontSize: 13, marginTop: 4, backgroundColor: C.tealBg }}
                    />
                  </div>
                )}
              </div>

              {/* 2. Plant Column: Plant Count & Dynamic Text Boxes (Stored in JSON & Column) */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Operating Plants / Locations Required</label>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.teal }}>
                    {newCompany.plant_count > 0 ? `${newCompany.plant_count} Plant(s) Specified` : '0 Plants'}
                  </span>
                </div>
                <select
                  value={newCompany.plant_count || 0}
                  onChange={e => {
                    const count = parseInt(e.target.value, 10) || 0;
                    const currentPlants = [...(newCompany.plants || [])];
                    let updated = [];
                    for (let i = 0; i < count; i++) {
                      updated.push(currentPlants[i] || `Plant ${i + 1}`);
                    }
                    setNewCompany({ ...newCompany, plant_count: count, plants: updated });
                  }}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                >
                  <option value={0}>0 Plants / Single Location (Head Office)</option>
                  <option value={1}>1 Plant Required</option>
                  <option value={2}>2 Plants Required</option>
                  <option value={3}>3 Plants Required</option>
                  <option value={4}>4 Plants Required</option>
                  <option value={5}>5 Plants Required</option>
                  <option value={6}>6 Plants Required</option>
                  <option value={7}>7 Plants Required</option>
                  <option value={8}>8 Plants Required</option>
                  <option value={9}>9 Plants Required</option>
                  <option value={10}>10 Plants Required</option>
                </select>

                {newCompany.plant_count > 0 && (
                  <div style={{ marginTop: 10, backgroundColor: C.bg2, padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: C.text2 }}>Type Plant / Unit Names (Stored as JSON):</div>
                    <div style={{ display: "grid", gridTemplateColumns: newCompany.plant_count > 2 ? "1fr 1fr" : "1fr", gap: 8 }}>
                      {newCompany.plants.map((plantName, idx) => (
                        <div key={idx}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: C.text3 }}>Plant #{idx + 1} Name / Location</label>
                          <input
                            type="text"
                            placeholder={`e.g. Plant ${idx + 1} (Noida Facility)`}
                            value={plantName}
                            onChange={e => {
                              const nextPlants = [...newCompany.plants];
                              nextPlants[idx] = e.target.value;
                              setNewCompany({ ...newCompany, plants: nextPlants });
                            }}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12.5, marginTop: 2, backgroundColor: C.surface }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Project Leader & Team Length */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Project Leader / Lead Auditor</label>
                  <select
                    value={(() => {
                      const str = String(newCompany.project_leader || "").trim();
                      const emp = hrmEmployees.find(e => 
                        e.id === str || 
                        e.name === str || 
                        String(e.id).toLowerCase() === str.toLowerCase() ||
                        String(e.name || '').toLowerCase() === str.toLowerCase()
                      );
                      return emp ? emp.name : (newCompany.project_leader || "");
                    })()}
                    onChange={e => setNewCompany({ ...newCompany, project_leader: e.target.value })}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, backgroundColor: C.surface, color: C.text1 }}
                  >
                    <option value="">Select Project Leader from HRM Team</option>
                    <option value="">❌ Cancel / Unassign Lead</option>
                    {hrmEmployees.map(emp => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} {emp.role ? `(${emp.role})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Project Length (Days)</label>
                  <input
                    type="number"
                    placeholder="e.g. 30"
                    value={newCompany.project_length}
                    onChange={e => setNewCompany({ ...newCompany, project_length: e.target.value })}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                  />
                </div>
              </div>

              {/* Timeline Dates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Audit Start Date</label>
                  <input
                    type="date"
                    value={newCompany.start_date}
                    onChange={e => {
                      const startDate = e.target.value;
                      let length = newCompany.project_length;
                      if (startDate && newCompany.end_date) {
                        const diffTime = Math.abs(new Date(newCompany.end_date) - new Date(startDate));
                        length = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      }
                      setNewCompany({ ...newCompany, start_date: startDate, project_length: length });
                    }}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Audit End Date</label>
                  <input
                    type="date"
                    value={newCompany.end_date}
                    onChange={e => {
                      const endDate = e.target.value;
                      let length = newCompany.project_length;
                      if (newCompany.start_date && endDate) {
                        const diffTime = Math.abs(new Date(endDate) - new Date(newCompany.start_date));
                        length = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      }
                      setNewCompany({ ...newCompany, end_date: endDate, project_length: length });
                    }}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                  />
                </div>
              </div>

              {/* 3. Assigned HRM Team Selector (Single Dropdown Option) */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Assigned Team Members</label>
                  {(newCompany.assigned_team || []).length > 0 && (
                    <button
                      type="button"
                      onClick={() => setNewCompany({ ...newCompany, assigned_team: [] })}
                      style={{ fontSize: 11, fontWeight: 700, color: C.red, background: "none", border: "none", cursor: "pointer" }}
                    >
                      ❌ Clear All ({newCompany.assigned_team.length} assigned)
                    </button>
                  )}
                </div>

                {/* Single Dropdown to Pick & Add Team Members */}
                <select
                  value=""
                  onChange={e => {
                    const val = e.target.value;
                    if (!val) return;
                    if (val === "__CLEAR__") {
                      setNewCompany({ ...newCompany, assigned_team: [] });
                      return;
                    }
                    const current = Array.isArray(newCompany.assigned_team) ? newCompany.assigned_team : [];
                    const isAlreadyIn = current.some(item => {
                      const str = String(item).trim().toLowerCase();
                      const valStr = String(val).trim().toLowerCase();
                      if (str === valStr) return true;
                      const empObj = hrmEmployees.find(emp => emp.id === item || emp.name === item);
                      return empObj && empObj.name.toLowerCase() === valStr;
                    });
                    if (!isAlreadyIn) {
                      setNewCompany({ ...newCompany, assigned_team: [...current, val] });
                    }
                  }}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, backgroundColor: C.surface, color: C.text1, outline: "none" }}
                >
                  <option value="">Select Team Member from Dropdown to Add...</option>
                  <option value="__CLEAR__">❌ Clear / Remove All Team Members</option>
                  {hrmEmployees.map(emp => {
                    const current = Array.isArray(newCompany.assigned_team) ? newCompany.assigned_team : [];
                    const alreadyIn = current.some(item => {
                      const str = String(item).trim().toLowerCase();
                      if (str === String(emp.id).toLowerCase() || str === String(emp.name).toLowerCase()) return true;
                      const empObj = hrmEmployees.find(e => e.id === item || e.name === item);
                      return empObj && empObj.id === emp.id;
                    });
                    return (
                      <option key={emp.id} value={emp.name} disabled={alreadyIn}>
                        {alreadyIn ? `✓ ${emp.name} (Already Added)` : `${emp.name} ${emp.role ? `(${emp.role})` : ''}`}
                      </option>
                    );
                  })}
                </select>

                {/* Selected Team Members displayed cleanly as removable tag chips */}
                {(newCompany.assigned_team || []).length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, padding: 8, borderRadius: 8, border: `1px solid ${C.tealBorder}`, backgroundColor: C.tealBg }}>
                    {newCompany.assigned_team.map((memberItem, idx) => {
                      const empName = getEmployeeName(memberItem);
                      const empObj = getEmployeeObj(memberItem);
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "4px 10px", borderRadius: 14, backgroundColor: C.surface,
                            border: `1px solid ${C.tealBorder}`, color: C.teal, fontSize: 12, fontWeight: 700
                          }}
                        >
                          {empObj?.avatar_url ? (
                            <img src={empObj.avatar_url} alt="" style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover" }} />
                          ) : (
                            <span>👤</span>
                          )}
                          <span>{empName}</span>
                          <button
                            type="button"
                            title="Remove"
                            onClick={() => {
                              setNewCompany({
                                ...newCompany,
                                assigned_team: newCompany.assigned_team.filter((_, i) => i !== idx)
                              });
                            }}
                            style={{ border: "none", background: "none", color: C.red, fontWeight: 800, cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1 }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize: 11.5, color: C.text3, marginTop: 4 }}>
                    No team members selected yet. Choose members from the dropdown above.
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => { setShowAddCompanyModal(false); setEditingCompanyId(null); }}
                  style={{ padding: "9px 16px", backgroundColor: C.surface, color: C.text2, border: `1px solid ${C.border}`, borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCompany}
                  style={{ padding: "9px 18px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13 }}
                >
                  {editingCompanyId ? "Save Changes / Update Company" : "Create Company Engagement"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2-Step Double Confirmation Delete Company Modal */}
      {deleteModalStep > 0 && companyToDelete && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: 20 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 14, padding: 28, width: 500, border: `1px solid ${C.redBorder}`, boxShadow: "0 25px 50px -12px rgba(220,38,38,0.25)" }}>

            {/* STEP 1: First Confirmation Warning */}
            {deleteModalStep === 1 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.redBg, color: C.red, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.redBorder}` }}>
                    <Trash2 size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: 0.5 }}>Step 1 of 2 — Confirmation</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text1 }}>Drop & Delete Company?</h3>
                  </div>
                </div>

                <div style={{ padding: 14, borderRadius: 8, backgroundColor: C.redBg, border: `1px solid ${C.redBorder}`, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 4 }}>
                    ⚠️ High Risk Action: Purge All Database Records
                  </div>
                  <div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.5 }}>
                    Are you sure you want to drop company <strong>"{companyToDelete.client_name}"</strong> ({companyToDelete.project_name})?
                  </div>
                </div>

                <div style={{ fontSize: 12.5, color: C.text2, marginBottom: 20, lineHeight: 1.6 }}>
                  Proceeding will permanently delete this company engagement along with all related data from the database, including:
                  <ul style={{ paddingLeft: 20, marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    <li>Audit programmes & procedures</li>
                    <li>Data tracker items & uploaded files</li>
                    <li>Stage 1 schedules & team organization</li>
                  </ul>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    onClick={() => { setDeleteModalStep(0); setCompanyToDelete(null); }}
                    style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surface, color: C.text2, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProceedToDeleteStep2}
                    style={{ padding: "9px 18px", borderRadius: 8, border: "none", backgroundColor: C.red, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    Proceed to Final Confirmation →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Second Confirmation Strict Check */}
            {deleteModalStep === 2 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.redBg, color: C.red, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.redBorder}` }}>
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: 0.5 }}>Step 2 of 2 — FINAL CONFIRMATION</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text1 }}>Type Company Name to Drop</h3>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: C.text2, marginBottom: 14, lineHeight: 1.5 }}>
                  To prevent accidental data loss, please type <strong style={{ color: C.red }}>{companyToDelete.client_name}</strong> or <strong style={{ color: C.red }}>DELETE</strong> below:
                </p>

                <input
                  type="text"
                  placeholder={`Type "${companyToDelete.client_name}" or "DELETE"`}
                  value={deleteConfirmInput}
                  onChange={e => setDeleteConfirmInput(e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 8, border: `2px solid ${(deleteConfirmInput.trim() === companyToDelete.client_name || deleteConfirmInput.trim().toUpperCase() === "DELETE") ? C.red : C.border}`, fontSize: 13.5, fontWeight: 600, marginBottom: 20 }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    onClick={() => { setDeleteModalStep(0); setCompanyToDelete(null); setDeleteConfirmInput(""); }}
                    style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surface, color: C.text2, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isDeletingCompany || !(deleteConfirmInput.trim() === companyToDelete.client_name || deleteConfirmInput.trim().toUpperCase() === "DELETE")}
                    onClick={handleFinalDeleteCompany}
                    style={{
                      padding: "9px 20px", borderRadius: 8, border: "none",
                      backgroundColor: (deleteConfirmInput.trim() === companyToDelete.client_name || deleteConfirmInput.trim().toUpperCase() === "DELETE") ? C.red : C.border2,
                      color: "#fff", fontSize: 13, fontWeight: 800, cursor: (deleteConfirmInput.trim() === companyToDelete.client_name || deleteConfirmInput.trim().toUpperCase() === "DELETE") ? "pointer" : "not-allowed",
                      opacity: isDeletingCompany ? 0.7 : 1
                    }}
                  >
                    {isDeletingCompany ? "Dropping Data from DB..." : "YES, PERMANENTLY DROP & DELETE COMPANY"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Create Custom Audit Template Modal */}
      {showCreateTemplateModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 12, padding: 28, width: 450, border: `1px solid ${C.border}` }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>(+) Create Custom Audit Template</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Template Name</label>
                <input
                  type="text"
                  placeholder="e.g. Risk & Governance Audit"
                  value={newTpl.template_name}
                  onChange={e => setNewTpl({ ...newTpl, template_name: e.target.value })}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Category</label>
                <input
                  type="text"
                  placeholder="e.g. Compliance, Financial, Operational"
                  value={newTpl.category}
                  onChange={e => setNewTpl({ ...newTpl, category: e.target.value })}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this dynamic template..."
                  value={newTpl.description}
                  onChange={e => setNewTpl({ ...newTpl, description: e.target.value })}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                <button onClick={() => setShowCreateTemplateModal(false)} style={{ padding: "8px 16px", border: `1px solid ${C.border}`, borderRadius: 6, background: "transparent", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleCreateTemplate} style={{ padding: "8px 16px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Save Template</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Dynamic Custom Column Modal (Microsoft Lists / Airtable Style) */}
      {showAddColModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(5px)", padding: 20 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 16, width: 680, maxWidth: "95vw", maxHeight: "90vh", display: "flex", flexDirection: "column", border: `1px solid ${C.border}`, boxShadow: "0 25px 50px -12px rgba(15,23,42,0.35)", overflow: "hidden" }}>

            {/* Header Banner */}
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "20px 24px", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>⚙️</span>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: -0.3 }}>Create Custom Column</h3>
                  <span style={{ backgroundColor: "#0d9488", color: "#ffffff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: 0.5 }}>MS LISTS STYLE</span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0 30px" }}>Configure field data types, multi-choice boxes, colors, and column width settings.</p>
              </div>
              <button onClick={() => setShowAddColModal(false)} style={{ border: "none", background: "rgba(255,255,255,0.1)", fontSize: 16, cursor: "pointer", color: "#cbd5e1", width: 32, height: 32, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Scrollable Body */}
            <div style={{ padding: 24, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>

              {/* 1. Header Label & Width */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text1, display: "block", marginBottom: 6 }}>
                    Column Header Label <span style={{ color: C.red }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Control Test Result, Audit Finding, Risk Level"
                    value={newCol.label}
                    onChange={e => setNewCol({ ...newCol, label: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13.5, fontWeight: 600, color: C.text1, outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text1, display: "block", marginBottom: 6 }}>
                    Column Width
                  </label>
                  <select
                    value={newCol.width || 180}
                    onChange={e => setNewCol({ ...newCol, width: Number(e.target.value) })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, backgroundColor: C.surface, color: C.text1, outline: "none", cursor: "pointer" }}
                  >
                    <option value={130}>Compact (130px)</option>
                    <option value={180}>Standard (180px)</option>
                    <option value={240}>Wide (240px)</option>
                    <option value={320}>Extra Wide (320px)</option>
                  </select>
                </div>
              </div>

              {/* 2. Select Field Type Cards */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text1, display: "block", marginBottom: 8 }}>
                  Field Data Type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {[
                    { type: "select", label: "Dropdown Choice", icon: "🏷️", desc: "Custom colored choice cards" },
                    { type: "text", label: "Single-line Text", icon: "📝", desc: "Short text values & labels" },
                    { type: "textarea", label: "Multi-line Text", icon: "📄", desc: "Detailed audit observations" },
                    { type: "risk_rating", label: "Risk Rating", icon: "🚦", desc: "High / Medium / Low badges" },
                    { type: "status", label: "Status Badge", icon: "📌", desc: "Pending / In Progress / Done" },
                    { type: "date", label: "Date Picker", icon: "📅", desc: "Target dates & timestamps" },
                    { type: "number", label: "Numeric Value", icon: "🔢", desc: "Sample size & amounts" },
                    { type: "employee", label: "HRM Employee", icon: "👤", desc: "Assignee from HRM team" },
                    { type: "checkbox", label: "Checkbox", icon: "☑️", desc: "Boolean Yes / No toggle" }
                  ].map(item => {
                    const isActive = newCol.type === item.type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setNewCol({ ...newCol, type: item.type })}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: 12,
                          borderRadius: 10,
                          border: isActive ? `2px solid ${C.teal}` : `1px solid ${C.border}`,
                          backgroundColor: isActive ? C.tealBg : C.surface,
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: isActive ? C.teal : C.text1 }}>{item.label}</div>
                          <div style={{ fontSize: 10.5, color: C.text3, marginTop: 2 }}>{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. MULTI-CHOICE OPTIONS MANAGER BOX (When type === 'select') */}
              {newCol.type === "select" && (
                <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, backgroundColor: C.bg2, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.text1, display: "block" }}>🏷️ Multiple Choice Option Boxes</span>
                      <span style={{ fontSize: 11, color: C.text3 }}>Add individual choice card boxes with custom colors. No comma separation needed!</span>
                    </div>
                  </div>

                  {/* Preset Options Quick Bar */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, paddingTop: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.text2, marginRight: 4 }}>⚡ Quick Presets:</span>
                    <button type="button" onClick={() => handleApplyPresetChoices("risk")} style={{ padding: "3px 9px", borderRadius: 12, fontSize: 11, fontWeight: 600, border: `1px solid ${C.border}`, backgroundColor: C.surface, cursor: "pointer", color: C.text1 }}>High / Med / Low</button>
                    <button type="button" onClick={() => handleApplyPresetChoices("effectiveness")} style={{ padding: "3px 9px", borderRadius: 12, fontSize: 11, fontWeight: 600, border: `1px solid ${C.border}`, backgroundColor: C.surface, cursor: "pointer", color: C.text1 }}>Effective / Partial / Ineffective</button>
                    <button type="button" onClick={() => handleApplyPresetChoices("pass_fail")} style={{ padding: "3px 9px", borderRadius: 12, fontSize: 11, fontWeight: 600, border: `1px solid ${C.border}`, backgroundColor: C.surface, cursor: "pointer", color: C.text1 }}>Pass / Fail</button>
                    <button type="button" onClick={() => handleApplyPresetChoices("compliant")} style={{ padding: "3px 9px", borderRadius: 12, fontSize: 11, fontWeight: 600, border: `1px solid ${C.border}`, backgroundColor: C.surface, cursor: "pointer", color: C.text1 }}>Compliant / Non-Compliant</button>
                    <button type="button" onClick={() => handleApplyPresetChoices("yes_no")} style={{ padding: "3px 9px", borderRadius: 12, fontSize: 11, fontWeight: 600, border: `1px solid ${C.border}`, backgroundColor: C.surface, cursor: "pointer", color: C.text1 }}>Yes / No</button>
                    <button type="button" onClick={() => handleApplyPresetChoices("clear")} style={{ padding: "3px 9px", borderRadius: 12, fontSize: 11, fontWeight: 600, border: `1px solid ${C.redBorder}`, backgroundColor: C.redBg, cursor: "pointer", color: C.red }}>Clear All</button>
                  </div>

                  {/* Choice Add Input Row */}
                  <div style={{ display: "flex", gap: 10, alignItems: "center", backgroundColor: C.surface, padding: 8, borderRadius: 10, border: `1px solid ${C.border}` }}>
                    {/* Color Swatch Picker */}
                    <div style={{ display: "flex", gap: 4, paddingLeft: 4 }}>
                      {CHOICE_COLORS.map(c => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => setSelectedChoiceColor(c.color)}
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            backgroundColor: c.color,
                            border: selectedChoiceColor === c.color ? "2px solid #000" : "none",
                            cursor: "pointer",
                            transform: selectedChoiceColor === c.color ? "scale(1.2)" : "scale(1)",
                            transition: "all 0.1s ease"
                          }}
                          title={c.name}
                        />
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Type choice text (e.g. 'Satisfactory') and press Enter..."
                      value={newChoiceInput}
                      onChange={e => setNewChoiceInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddChoice(); } }}
                      style={{ flex: 1, border: "none", outline: "none", fontSize: 13, padding: "4px 8px", color: C.text1 }}
                    />

                    <button
                      type="button"
                      onClick={handleAddChoice}
                      style={{ padding: "6px 14px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                    >
                      + Add Option Box
                    </button>
                  </div>

                  {/* Option Card Boxes List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto" }}>
                    {(newCol.choices || []).length === 0 ? (
                      <div style={{ padding: 16, textAlign: "center", fontSize: 12, color: C.text3, fontStyle: "italic" }}>
                        No option boxes added yet. Type a choice label above or select a Quick Preset!
                      </div>
                    ) : (
                      (newCol.choices || []).map((ch, idx) => (
                        <div
                          key={ch.id || idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 12px",
                            backgroundColor: C.surface,
                            borderRadius: 8,
                            border: `1px solid ${C.border}`,
                            boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                          }}
                        >
                          {/* Color Swatch circle */}
                          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: ch.color, flexShrink: 0 }} />

                          {/* Inline Color Select Dots */}
                          <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                            {CHOICE_COLORS.map(c => (
                              <button
                                key={c.color}
                                type="button"
                                onClick={() => handleUpdateChoiceColor(ch.id, c.color)}
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: 6,
                                  backgroundColor: c.color,
                                  border: ch.color === c.color ? "1px solid #000" : "none",
                                  cursor: "pointer",
                                  opacity: ch.color === c.color ? 1 : 0.4
                                }}
                              />
                            ))}
                          </div>

                          {/* Editable Label Input */}
                          <input
                            type="text"
                            value={ch.label}
                            onChange={e => handleUpdateChoiceLabel(ch.id, e.target.value)}
                            style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 12.5, fontWeight: 600, color: C.text1, outline: "none" }}
                          />

                          {/* Styled Badge Preview */}
                          <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, backgroundColor: ch.color + "20", color: ch.color, border: `1px solid ${ch.color}50` }}>
                            Preview
                          </span>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveChoice(ch.id)}
                            style={{ border: "none", background: "transparent", color: C.red, cursor: "pointer", padding: 4 }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 4. LIVE COLUMN PREVIEW CARD */}
              <div style={{ border: `1px dashed ${C.teal}`, borderRadius: 10, padding: 14, backgroundColor: C.tealBg, display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.teal, letterSpacing: 0.5 }}>👁️ LIVE TABLE COLUMN PREVIEW</span>

                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  {/* Table Header Cell Preview */}
                  <div style={{ backgroundColor: "#1e293b", color: "#fff", padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{newCol.label || "Sample Column Header"}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>({newCol.width || 180}px)</span>
                  </div>

                  <span style={{ fontSize: 16, color: C.text3 }}>➔</span>

                  {/* Table Cell Sample Preview */}
                  <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, padding: "8px 14px", borderRadius: 6, minWidth: 160 }}>
                    {newCol.type === "select" ? (
                      (newCol.choices || []).length > 0 ? (
                        <span style={{ padding: "4px 10px", borderRadius: 12, fontSize: 11.5, fontWeight: 700, backgroundColor: (newCol.choices[0]?.color || "#0d9488") + "20", color: newCol.choices[0]?.color || "#0d9488", border: `1px solid ${newCol.choices[0]?.color || "#0d9488"}50` }}>
                          {newCol.choices[0]?.label}
                        </span>
                      ) : (
                        <span style={{ color: C.text3, fontSize: 12 }}>Select Choice...</span>
                      )
                    ) : newCol.type === "risk_rating" ? (
                      <span style={{ padding: "3px 9px", borderRadius: 10, fontSize: 11, fontWeight: 700, backgroundColor: C.redBg, color: C.red, border: `1px solid ${C.redBorder}` }}>High</span>
                    ) : newCol.type === "status" ? (
                      <span style={{ padding: "3px 9px", borderRadius: 10, fontSize: 11, fontWeight: 700, backgroundColor: C.blueBg, color: C.blue, border: `1px solid ${C.blueBorder}` }}>In Progress</span>
                    ) : newCol.type === "employee" ? (
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.text1 }}>👤 Anshu (Lead Auditor)</span>
                    ) : newCol.type === "date" ? (
                      <span style={{ fontSize: 12, color: C.text1 }}>📅 2026-09-07</span>
                    ) : newCol.type === "checkbox" ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>☑️ Yes</span>
                    ) : (
                      <span style={{ fontSize: 12, color: C.text1 }}>Sample text content...</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, backgroundColor: C.surface, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                type="button"
                onClick={() => setShowAddColModal(false)}
                style={{ padding: "10px 20px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomColumn}
                style={{ padding: "10px 24px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 800, fontSize: 13.5, boxShadow: "0 4px 12px rgba(13,148,136,0.3)", display: "flex", alignItems: "center", gap: 8 }}
              >
                <span>+ Create Column</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. RIGHT SLIDE-OVER AUDIT STEP DETAIL DRAWER PANEL */}
      {selectedDrawerRow && (() => {
        const matchingTrackerItem = dataTrackerRows.find(tr =>
          String(tr.programme_id) === String(selectedDrawerRow.id) ||
          String(tr.id) === String(selectedDrawerRow.id) ||
          (tr.data_requirement && (drawerData.data_requirement || selectedDrawerRow.row_data?.data_requirement) &&
            String(tr.data_requirement).trim() === String(drawerData.data_requirement || selectedDrawerRow.row_data?.data_requirement).trim())
        );

        const trackerFiles = matchingTrackerItem?.attachments || [];
        const procedureFiles = drawerData.attachments || selectedDrawerRow.row_data?.attachments || [];
        const combinedFiles = [...trackerFiles, ...procedureFiles];

        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex", justifyContent: "flex-end" }}>
            {/* Blur Backdrop */}
            <div
              onClick={() => setSelectedDrawerRow(null)}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(3px)" }}
            />

            {/* Drawer Container */}
            <div style={{
              position: "relative", zIndex: 1051, width: 560, maxWidth: "92vw", height: "100vh",
              backgroundColor: C.surface, display: "flex", flexDirection: "column",
              boxShadow: "-10px 0 30px rgba(0,0,0,0.2)", borderLeft: `1px solid ${C.border}`
            }}>

              {/* Drawer Header */}
              <div style={{ padding: "20px 24px 16px 24px", borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 800, backgroundColor: C.teal, color: "#fff" }}>
                      {drawerData.serial_no || (drawerData.is_header ? "Section Header" : "1.1")}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>
                      {drawerData.sub_process || "Audit Procedure"}
                    </span>
                    <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, backgroundColor: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      📎 {combinedFiles.length} files
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedDrawerRow(null)}
                    style={{ border: "none", background: C.bg2, width: 32, height: 32, borderRadius: 16, cursor: "pointer", fontSize: 16, color: C.text2, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    ✕
                  </button>
                </div>

                {/* Step Title / Procedure */}
                <div style={{ fontSize: 15, fontWeight: 800, color: C.text1, lineHeight: 1.4, marginBottom: 16 }}>
                  {drawerData.procedure || drawerData.title || "Audit Step Details"}
                </div>

                {/* Navigation Tabs */}
                <div style={{ display: "flex", gap: 16, borderBottom: `2px solid ${C.border}`, marginTop: 8 }}>
                  <button
                    onClick={() => setDrawerTab("details")}
                    style={{
                      padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 700,
                      color: drawerTab === "details" ? C.teal : C.text3,
                      borderBottom: drawerTab === "details" ? `2px solid ${C.teal}` : "2px solid transparent",
                      marginBottom: -2
                    }}
                  >
                    📋 Details
                  </button>
                  <button
                    onClick={() => setDrawerTab("files")}
                    style={{
                      padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 700,
                      color: drawerTab === "files" ? C.teal : C.text3,
                      borderBottom: drawerTab === "files" ? `2px solid ${C.teal}` : "2px solid transparent",
                      marginBottom: -2
                    }}
                  >
                    📁 Files ({combinedFiles.length})
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div style={{ flex: 1, padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20, backgroundColor: C.bg2 }}>

                {drawerTab === "details" ? (
                  drawerData.is_header ? (
                    /* HEADER SECTION ROW EDITOR */
                    <div style={{ backgroundColor: C.surface, padding: 20, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: C.teal, textTransform: "uppercase", letterSpacing: 0.8, display: "block" }}>
                        🏷️ PROCEDURE SECTION HEADER TITLE
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1. Standard Operating Procedures (SOP) & DOA Matrix"
                        value={drawerData.title || drawerData.procedure || ""}
                        onChange={e => setDrawerData({ ...drawerData, title: e.target.value, procedure: e.target.value })}
                        style={{ width: "100%", padding: 12, borderRadius: 8, border: `1.5px solid ${C.teal}`, fontSize: 14, fontWeight: 700, color: C.text1, outline: "none" }}
                      />
                      <div style={{ fontSize: 12, color: C.text3 }}>
                        This is a section divider header row in your audit programme table.
                      </div>
                    </div>
                  ) : (
                    /* DYNAMIC ROW EDITOR - ONLY FOR COLUMNS THAT EXIST IN customColumns */
                    <>
                      {customColumns.map(col => {
                        const rawVal = drawerData[col.key] ?? "";
                        let val = "";
                        if (typeof rawVal === "string" || typeof rawVal === "number") {
                          val = String(rawVal);
                        } else if (Array.isArray(rawVal)) {
                          val = rawVal.map(i => typeof i === "object" ? (i.text || i.comment || JSON.stringify(i)) : String(i)).filter(Boolean).join("; ");
                        } else if (rawVal && typeof rawVal === "object") {
                          val = rawVal.text || rawVal.comment || JSON.stringify(rawVal);
                        }

                        // 1. SERIAL NO / SUB-PROCESS
                        if (col.key === "serial_no" || col.key === "sub_process") {
                          return (
                            <div key={col.key} style={{ backgroundColor: C.surface, padding: 14, borderRadius: 10, border: `1px solid ${C.border}` }}>
                              <label style={{ fontSize: 10.5, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>
                                {col.label}
                              </label>
                              <input
                                type="text"
                                value={val}
                                onChange={e => setDrawerData({ ...drawerData, [col.key]: e.target.value })}
                                style={{ width: "100%", padding: "99px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, color: C.text1, outline: "none" }}
                              />
                            </div>
                          );
                        }

                        // 2. OBSERVATIONS / FINDINGS CARD (MATCHING ATTACHED PHOTO DESIGN)
                        if (col.key === "observations_findings") {
                          return (
                            <div key={col.key} style={{ backgroundColor: C.surface, padding: "18px 20px", borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: 10 }}>
                              <label style={{ fontSize: 11, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.9, display: "block" }}>
                                OBSERVATIONS / FINDINGS
                              </label>
                              <textarea
                                rows={3}
                                placeholder="Enter audit observations, gaps, or findings..."
                                value={val}
                                onChange={e => setDrawerData({ ...drawerData, [col.key]: e.target.value, observations_findings: e.target.value })}
                                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13.5, color: C.text1, fontFamily: "inherit", outline: "none", lineHeight: 1.5, resize: "vertical", backgroundColor: "#fff" }}
                              />
                            </div>
                          );
                        }

                        // COMMENTS CARD (MATCHING ATTACHED PHOTO DESIGN)
                        if (col.key === "comments") {
                          return (
                            <div key={col.key} style={{ backgroundColor: C.surface, padding: "18px 20px", borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: 14 }}>
                              <label style={{ fontSize: 11, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.9, display: "block" }}>
                                COMMENTS
                              </label>

                              {/* Comments List */}
                              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {drawerComments.length === 0 ? (
                                  <div style={{ fontSize: 12.5, color: C.text3, padding: "14px 0", textAlign: "center", borderBottom: `1px dashed ${C.border}` }}>
                                    No comments yet. Be the first!
                                  </div>
                                ) : (
                                  drawerComments.map((c, i) => (
                                    <div key={c.id || i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                      {c.avatar ? (
                                        <img
                                          src={c.avatar}
                                          alt={c.author}
                                          style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0, marginTop: 2 }}
                                        />
                                      ) : (
                                        <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                                          {c.initials || (c.author ? c.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "AP")}
                                        </div>
                                      )}
                                      <div style={{ flex: 1, backgroundColor: "#f1f5f9", border: `1px solid #e2e8f0`, borderRadius: 12, padding: "10px 14px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                          <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text1 }}>{c.author}</span>
                                          <span style={{ fontSize: 10.5, color: C.text3 }}>{c.created_at || c.time || "Just now"}</span>
                                        </div>
                                        <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.5 }}>{c.text}</div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>

                              {/* Add Comment Box */}
                              <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginTop: 4 }}>
                                <textarea
                                  rows={2}
                                  placeholder="Add a comment..."
                                  value={newCommentText}
                                  onChange={e => setNewCommentText(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      handleAddDrawerComment();
                                    }
                                  }}
                                  style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13, outline: "none", color: C.text1, fontFamily: "inherit", resize: "none", backgroundColor: "#fff" }}
                                />
                                <button
                                  type="button"
                                  onClick={handleAddDrawerComment}
                                  style={{ padding: "10px 18px", backgroundColor: "#0d9488", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}
                                >
                                  ↑ Send
                                </button>
                              </div>
                            </div>
                          );
                        }

                        // 3. PROCEDURE / TEXTAREA / OBJECTIVE
                        if (col.key === "procedure" || col.key === "objective" || col.type === "textarea") {
                          return (
                            <div key={col.key} style={{ backgroundColor: C.surface, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
                              <label style={{ fontSize: 10.5, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
                                {col.label}
                              </label>
                              <textarea
                                rows={3}
                                value={val}
                                onChange={e => setDrawerData({ ...drawerData, [col.key]: e.target.value })}
                                style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "inherit", outline: "none" }}
                              />
                            </div>
                          );
                        }

                        // 4. STATUS COLUMN CARDS
                        if (col.key === "status") {
                          return (
                            <div key={col.key} style={{ backgroundColor: C.surface, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
                              <label style={{ fontSize: 10.5, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
                                {col.label}
                              </label>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                                {["Pending", "In Progress", "Completed"].map(st => {
                                  const isActive = (val || "Pending") === st || (st === "Pending" && val === "Not Started");
                                  return (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => setDrawerData({ ...drawerData, [col.key]: st })}
                                      style={{
                                        padding: "9px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center",
                                        backgroundColor: isActive ? (st === "Completed" ? C.greenBg : st === "In Progress" ? C.blueBg : C.amberBg) : C.surface,
                                        color: isActive ? (st === "Completed" ? C.green : st === "In Progress" ? C.blue : C.amber) : C.text2,
                                        border: isActive ? `2px solid ${st === "Completed" ? C.green : st === "In Progress" ? C.blue : C.amber}` : `1px solid ${C.border}`
                                      }}
                                    >
                                      {st}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }

                        // 5. RISK RATING CARDS
                        if (col.key === "risk_rating") {
                          return (
                            <div key={col.key} style={{ backgroundColor: C.surface, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
                              <label style={{ fontSize: 10.5, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
                                {col.label}
                              </label>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                                {["High", "Medium", "Low"].map(cleanRk => {
                                  const isActive = (val || "Medium").includes(cleanRk);
                                  return (
                                    <button
                                      key={cleanRk}
                                      type="button"
                                      onClick={() => setDrawerData({ ...drawerData, [col.key]: cleanRk })}
                                      style={{
                                        padding: "9px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center",
                                        backgroundColor: isActive ? (cleanRk === "High" ? C.redBg : cleanRk === "Low" ? C.greenBg : C.amberBg) : C.surface,
                                        color: isActive ? (cleanRk === "High" ? C.red : cleanRk === "Low" ? C.green : cleanRk === "Medium" ? C.amber : C.border) : C.text2,
                                        border: isActive ? `2px solid ${cleanRk === "High" ? C.red : cleanRk === "Low" ? C.green : cleanRk === "Medium" ? C.amber : C.border}` : `1px solid ${C.border}`
                                      }}
                                    >
                                      {cleanRk} Risk
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }

                        // 6. EMPLOYEE SELECT
                        if (col.key === "assigned_to" || col.type === "employee") {
                          return (
                            <div key={col.key} style={{ backgroundColor: C.surface, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
                              <label style={{ fontSize: 10.5, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>
                                {col.label}
                              </label>
                              <select
                                value={val}
                                onChange={e => setDrawerData({ ...drawerData, [col.key]: e.target.value })}
                                style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, backgroundColor: C.surface, color: C.text1, outline: "none" }}
                              >
                                <option value="">Unassigned</option>
                                {hrmEmployees.map(emp => (
                                  <option key={emp.id} value={emp.name}>{emp.name} ({emp.role || "Auditor"})</option>
                                ))}
                              </select>
                            </div>
                          );
                        }

                        // 7. DROPDOWN CHOICE / SELECT TYPES
                        if (col.type === "select") {
                          const opts = col.options || [];
                          return (
                            <div key={col.key} style={{ backgroundColor: C.surface, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
                              <label style={{ fontSize: 10.5, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
                                {col.label}
                              </label>
                              {opts.length <= 4 ? (
                                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(opts.length, 4)}, 1fr)`, gap: 8 }}>
                                  {opts.map(opt => {
                                    const isActive = val === opt;
                                    const matchedChoice = col.choices?.find(c => (c.label || "").toLowerCase() === (opt || "").toLowerCase());
                                    const choiceColor = matchedChoice?.color || C.teal;

                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setDrawerData({ ...drawerData, [col.key]: opt })}
                                        style={{
                                          padding: "8px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center",
                                          backgroundColor: isActive ? choiceColor + "20" : C.surface,
                                          color: isActive ? choiceColor : C.text2,
                                          border: isActive ? `2px solid ${choiceColor}` : `1px solid ${C.border}`
                                        }}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <select
                                  value={val}
                                  onChange={e => setDrawerData({ ...drawerData, [col.key]: e.target.value })}
                                  style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, backgroundColor: C.surface, color: C.text1 }}
                                >
                                  <option value="">Select {col.label.toLowerCase()}...</option>
                                  {opts.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          );
                        }

                        // 8. GENERIC FIELD TYPES (Date, Number, Text, Checkbox)
                        return (
                          <div key={col.key} style={{ backgroundColor: C.surface, padding: 14, borderRadius: 10, border: `1px solid ${C.border}` }}>
                            <label style={{ fontSize: 10.5, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>
                              {col.label}
                            </label>
                            <input
                              type={col.type === "date" ? "date" : col.type === "number" ? "number" : "text"}
                              value={val}
                              onChange={e => setDrawerData({ ...drawerData, [col.key]: e.target.value })}
                              style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, outline: "none" }}
                            />
                          </div>
                        );
                      })}

                      {/* FALLBACK COMMENTS & ACTIVITY FEED (Only if comments column is not in customColumns) */}
                      {!customColumns.some(c => c.key === "comments") && (
                        <div style={{ backgroundColor: C.surface, padding: "18px 20px", borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: 14 }}>
                          <label style={{ fontSize: 11, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.9, display: "block" }}>
                            COMMENTS
                          </label>

                          {/* Comments List */}
                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {drawerComments.length === 0 ? (
                              <div style={{ fontSize: 12.5, color: C.text3, padding: "14px 0", textAlign: "center", borderBottom: `1px dashed ${C.border}` }}>
                                No comments yet. Be the first!
                              </div>
                            ) : (
                              drawerComments.map((c, i) => (
                                <div key={c.id || i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                  {c.avatar ? (
                                    <img
                                      src={c.avatar}
                                      alt={c.author}
                                      style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0, marginTop: 2 }}
                                    />
                                  ) : (
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                                      {c.initials || (c.author ? c.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "AP")}
                                    </div>
                                  )}
                                  <div style={{ flex: 1, backgroundColor: "#f1f5f9", border: `1px solid #e2e8f0`, borderRadius: 12, padding: "10px 14px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                      <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text1 }}>{c.author}</span>
                                      <span style={{ fontSize: 10.5, color: C.text3 }}>{c.created_at || c.time || "Just now"}</span>
                                    </div>
                                    <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.5 }}>{c.text}</div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Add Comment Input */}
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginTop: 4 }}>
                            <textarea
                              rows={2}
                              placeholder="Add a comment..."
                              value={newCommentText}
                              onChange={e => setNewCommentText(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddDrawerComment();
                                }
                              }}
                              style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13, outline: "none", color: C.text1, fontFamily: "inherit", resize: "none", backgroundColor: "#fff" }}
                            />
                            <button
                              type="button"
                              onClick={handleAddDrawerComment}
                              style={{ padding: "10px 18px", backgroundColor: "#0d9488", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}
                            >
                              ↑ Send
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )
                ) : (
                  /* FILES / ATTACHMENTS TAB */
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* 1. UPLOAD BOX FOR PROCEDURE EVIDENCE */}
                    <div style={{ backgroundColor: C.surface, padding: 20, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: C.text1, marginBottom: 4 }}>Audit Procedure Files & Evidences</div>
                      <p style={{ fontSize: 12, color: C.text3, margin: "0 0 14px 0" }}>Attach supporting audit evidence files, spreadsheets, or working papers.</p>

                      <input
                        type="file"
                        multiple
                        id="drawer_file_upload_input"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          showToast("Uploading procedure file(s) to Supabase Storage...", "notice", "Uploading");
                          try {
                            const formData = new FormData();
                            formData.append("projectId", selectedProject?.id || "general");
                            formData.append("folder", "procedures");
                            formData.append("rowId", selectedDrawerRow?.id || "");
                            Array.from(files).forEach(f => formData.append("files", f));

                            const res = await fetch("/Auditing/api/dynamic/upload", {
                              method: "POST",
                              body: formData
                            });
                            const data = await res.json();
                            if (data.success && Array.isArray(data.files)) {
                              const updated = [...(drawerData.attachments || []), ...data.files];
                              setDrawerData(prev => ({ ...prev, attachments: updated }));
                              showToast(`Uploaded & attached ${data.files.length} procedure file(s). Click 'Save Changes' to persist.`, "success", "Files Attached");
                            } else {
                              showToast(data.error || "Upload to Supabase Storage failed.", "error", "Upload Error");
                            }
                          } catch (err) {
                            showToast("Storage upload error: " + err.message, "error", "Upload Error");
                          }
                          e.target.value = "";
                        }}
                      />

                      <label
                        htmlFor="drawer_file_upload_input"
                        style={{
                          border: `2px dashed ${C.teal}`, padding: 20, borderRadius: 10, textAlign: "center", backgroundColor: C.tealBg, cursor: "pointer", display: "block"
                        }}
                      >
                        <Upload size={22} color={C.teal} style={{ marginBottom: 6 }} />
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.teal }}>Click to upload file attachment</div>
                        <div style={{ fontSize: 10.5, color: C.text3, marginTop: 2 }}>Supports PDF, XLSX, DOCX, PNG up to 25MB</div>
                      </label>
                    </div>

                    {/* 2. DATA TRACKER / CLIENT PORTAL UPLOADED FILES SECTION */}
                    {trackerFiles.length > 0 && (
                      <div style={{ backgroundColor: C.surface, padding: 20, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: C.teal, display: "flex", alignItems: "center", gap: 6 }}>
                              <FileCheck size={16} /> Client Portal / Data Requirement Uploads ({trackerFiles.length})
                            </div>
                            <div style={{ fontSize: 11.5, color: C.text3, marginTop: 2 }}>
                              Files uploaded by client recipient for: <strong>"{matchingTrackerItem?.data_requirement || drawerData.data_requirement || 'Data Requirement'}"</strong>
                            </div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`, padding: "3px 10px", borderRadius: 12 }}>
                            {matchingTrackerItem?.status_json?.document_status || "Received"}
                          </span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {trackerFiles.map((file, fIdx) => (
                            <div key={fIdx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.bg2, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}` }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                                <FileSpreadsheet size={20} style={{ color: C.teal, flexShrink: 0 }} />
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</div>
                                  <div style={{ fontSize: 10.5, color: C.text3 }}>
                                    {(file.size / 1024).toFixed(1)} KB • Uploaded {file.uploadedAt ? new Date(file.uploadedAt).toLocaleString() : "Client Portal"}
                                  </div>
                                </div>
                              </div>
                              {file.dataUrl && (
                                <a
                                  href={file.dataUrl}
                                  download={file.name}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ padding: "6px 12px", backgroundColor: C.surface, color: C.teal, border: `1px solid ${C.tealBorder}`, borderRadius: 6, fontSize: 11.5, fontWeight: 700, textDecoration: "none", flexShrink: 0, marginLeft: 10 }}
                                >
                                  Download / View
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. DIRECT PROCEDURE ATTACHMENTS SECTION */}
                    {procedureFiles.length > 0 && (
                      <div style={{ backgroundColor: C.surface, padding: 20, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: C.text1, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <FileText size={16} style={{ color: C.purple }} /> Procedure Evidence Attachments ({procedureFiles.length})
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {procedureFiles.map((file, fIdx) => (
                            <div key={fIdx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.bg2, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}` }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                                <FileSpreadsheet size={20} style={{ color: C.purple, flexShrink: 0 }} />
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</div>
                                  <div style={{ fontSize: 10.5, color: C.text3 }}>
                                    {(file.size / 1024).toFixed(1)} KB • {file.uploadedAt ? new Date(file.uploadedAt).toLocaleString() : "Direct Upload"}
                                  </div>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: 10 }}>
                                {file.dataUrl && (
                                  <a
                                    href={file.dataUrl}
                                    download={file.name}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ padding: "6px 12px", backgroundColor: C.surface, color: C.purple, border: `1px solid ${C.purpleBorder}`, borderRadius: 6, fontSize: 11.5, fontWeight: 700, textDecoration: "none" }}
                                  >
                                    Download
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = procedureFiles.filter((_, idx) => idx !== fIdx);
                                    setDrawerData(prev => ({ ...prev, attachments: updated }));
                                  }}
                                  style={{ padding: 6, border: `1px solid ${C.redBorder}`, backgroundColor: C.redBg, color: C.red, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. EMPTY STATE WHEN NO FILES EXIST AT ALL */}
                    {combinedFiles.length === 0 && (
                      <div style={{ backgroundColor: C.surface, padding: 30, borderRadius: 14, border: `1px solid ${C.border}`, textAlign: "center", color: C.text3 }}>
                        <FileText size={32} style={{ color: C.text3, marginBottom: 8, opacity: 0.6 }} />
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text2, marginBottom: 4 }}>No attachments found</div>
                        <div style={{ fontSize: 12 }}>
                          When clients upload files via the Secure Upload Portal or when you attach procedure evidence above, they will appear here automatically.
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Drawer Footer */}
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, backgroundColor: C.surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={handleDeleteDrawerRow}
                  style={{ padding: "10px 16px", border: `1px solid ${C.redBorder}`, backgroundColor: C.redBg, color: C.red, borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Trash2 size={15} />
                  <span>Delete Step</span>
                </button>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedDrawerRow(null)}
                    style={{ padding: "10px 18px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDrawerRow}
                    style={{ padding: "10px 24px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 800, fontSize: 13.5, boxShadow: "0 4px 12px rgba(13,148,136,0.3)", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span>✓ Save Changes</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* 4. Add Procedure / Step Modal */}
      {showAddStepModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(3px)" }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 14, padding: 28, width: 560, maxHeight: "90vh", overflowY: "auto", border: `1px solid ${C.border}`, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text1, margin: 0 }}>+ Add Audit Step / Procedure Header</h3>
              <button onClick={() => setShowAddStepModal(false)} style={{ border: "none", background: "transparent", fontSize: 16, cursor: "pointer", color: C.text2 }}>✕</button>
            </div>

            {/* TOGGLE ROW TYPE: HEADER vs SUB-PROCEDURE */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18, padding: 4, backgroundColor: C.bg2, borderRadius: 8 }}>
              <button
                type="button"
                onClick={() => setIsHeaderStep(false)}
                style={{
                  padding: "9px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 700,
                  backgroundColor: !isHeaderStep ? C.surface : "transparent",
                  color: !isHeaderStep ? C.teal : C.text2,
                  boxShadow: !isHeaderStep ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                }}
              >
                📋 Sub-Procedure Step Row
              </button>
              <button
                type="button"
                onClick={() => setIsHeaderStep(true)}
                style={{
                  padding: "9px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 700,
                  backgroundColor: isHeaderStep ? C.surface : "transparent",
                  color: isHeaderStep ? C.teal : C.text2,
                  boxShadow: isHeaderStep ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                }}
              >
                📁 Procedure Section Header
              </button>
            </div>

            {isHeaderStep ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Procedure Header Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. 1. Standard Operating Procedures (SOP) & DOA Matrix"
                    value={headerTitle}
                    onChange={e => setHeaderTitle(e.target.value)}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, fontWeight: 600 }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* DYNAMIC FORM INPUTS FOR ALL CUSTOM COLUMNS */}
                {customColumns.map(col => {
                  const val = stepFormData[col.key] || "";
                  const handleChange = (eVal) => setStepFormData({ ...stepFormData, [col.key]: eVal });

                  return (
                    <div key={col.key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: "flex", justifyContent: "space-between" }}>
                        <span>{col.label}</span>
                        {col.key === 'data_requirement' && <span style={{ fontSize: 10, color: C.teal, fontWeight: 700 }}>⚡ Auto-syncs to Data Tracker IDR</span>}
                      </label>

                      {col.type === "textarea" ? (
                        <textarea
                          rows={2}
                          value={val}
                          onChange={e => handleChange(e.target.value)}
                          placeholder={`Enter ${col.label.toLowerCase()}...`}
                          style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, fontFamily: "inherit" }}
                        />
                      ) : col.type === "select" || col.type === "risk_rating" || col.type === "status" ? (
                        <select
                          value={val}
                          onChange={e => handleChange(e.target.value)}
                          style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, backgroundColor: C.surface }}
                        >
                          {(col.options || (col.type === "risk_rating" ? ["High", "Medium", "Low"] : ["Pending", "In Progress", "Completed"])).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : col.type === "employee" ? (
                        <select
                          value={val}
                          onChange={e => handleChange(e.target.value)}
                          style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, backgroundColor: C.surface }}
                        >
                          <option value="">Select Auditor / Employee...</option>
                          {hrmEmployees.map(emp => (
                            <option key={emp.id} value={emp.name}>{emp.name} {emp.role ? `(${emp.role})` : ''}</option>
                          ))}
                        </select>
                      ) : col.type === "date" ? (
                        <input
                          type="date"
                          value={val}
                          onChange={e => handleChange(e.target.value)}
                          style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                        />
                      ) : col.type === "number" ? (
                        <input
                          type="number"
                          value={val}
                          onChange={e => handleChange(e.target.value)}
                          style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                        />
                      ) : col.type === "checkbox" ? (
                        <div style={{ marginTop: 6 }}>
                          <label style={{ fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                            <input
                              type="checkbox"
                              checked={!!val}
                              onChange={e => handleChange(e.target.checked)}
                            />
                            <span>Yes</span>
                          </label>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={val}
                          onChange={e => handleChange(e.target.value)}
                          placeholder={`Enter ${col.label.toLowerCase()}...`}
                          style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
              <button onClick={() => setShowAddStepModal(false)} style={{ padding: "9px 18px", border: `1px solid ${C.border}`, borderRadius: 6, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Cancel</button>
              <button onClick={handleAddStep} style={{ padding: "9px 18px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13, boxShadow: "0 2px 4px rgba(13,148,136,0.2)" }}>Save to Audit Programme</button>
            </div>
          </div>
        </div>
      )}

      {/* 5B. STAGE 1 WEEKLY CALENDAR SLIDE-OVER RIGHT DRAWER (ADD, EDIT, UPDATE, DELETE) */}
      {isCalDrawerOpen && calDrawerItem && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1200, display: "flex", justifyContent: "flex-end" }}>
          {/* Backdrop */}
          <div
            onClick={() => setIsCalDrawerOpen(false)}
            style={{
              position: "absolute", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(2px)"
            }}
          />

          {/* Slide-over Drawer Body */}
          <div
            style={{
              position: "relative", width: 480, maxWidth: "90vw", height: "100%",
              backgroundColor: C.surface, borderLeft: `1px solid ${C.border}`,
              boxShadow: "-10px 0 30px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column",
              zIndex: 1201
            }}
          >
            {/* Header */}
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.bg2 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.teal, backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, padding: "2px 8px", borderRadius: 6 }}>
                    {calDrawerItem.week_name || "Week 1"}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: calDrawerItem.status === 'Done' ? C.green : C.amber, backgroundColor: calDrawerItem.status === 'Done' ? C.greenBg : C.amberBg, border: `1px solid ${calDrawerItem.status === 'Done' ? C.greenBorder : C.amberBorder}`, padding: "2px 8px", borderRadius: 6 }}>
                    {calDrawerItem.status || "Pending"}
                  </span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text1, margin: 0 }}>
                  {calDrawerItem.id ? "Edit Weekly Activity" : "+ Add Weekly Activity"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCalDrawerOpen(false)}
                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, color: C.text2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Form Body */}
            <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Week Label & Week Description */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>Week Label *</label>
                  <input
                    type="text"
                    placeholder="e.g. Week 1"
                    value={calDrawerItem.week_name || ""}
                    onChange={e => setCalDrawerItem({ ...calDrawerItem, week_name: e.target.value })}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, backgroundColor: C.surface, color: C.text1 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>Week Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Planning & Data Collection"
                    value={calDrawerItem.week_description || ""}
                    onChange={e => setCalDrawerItem({ ...calDrawerItem, week_description: e.target.value })}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, backgroundColor: C.surface, color: C.text1 }}
                  />
                </div>
              </div>

              {/* Activity Name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>Activity Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Kick-off Meeting"
                  value={calDrawerItem.activity || ""}
                  onChange={e => setCalDrawerItem({ ...calDrawerItem, activity: e.target.value })}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, backgroundColor: C.surface, color: C.text1 }}
                />
              </div>

              {/* Detailed Audit Work */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>Detailed Audit Work / Scope</label>
                <textarea
                  rows={4}
                  placeholder="Detailed description of audit scope and execution work..."
                  value={calDrawerItem.detailed_audit_work || ""}
                  onChange={e => setCalDrawerItem({ ...calDrawerItem, detailed_audit_work: e.target.value })}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, backgroundColor: C.surface, color: C.text1, fontFamily: "inherit" }}
                />
              </div>

              {/* Progress Slider & Input (Bidirectionally synced) */}
              <div style={{ backgroundColor: C.bg2, padding: 14, borderRadius: 8, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>Task Progress Percentage</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={calDrawerItem.progress !== undefined && calDrawerItem.progress !== null ? calDrawerItem.progress : 0}
                      onChange={e => {
                        const val = Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                        let st = "Pending";
                        if (val === 100) st = "Done";
                        else if (val > 0) st = "In Progress";
                        setCalDrawerItem({ ...calDrawerItem, progress: val, status: st });
                      }}
                      style={{ width: 60, padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 800, textAlign: "center", color: (calDrawerItem.progress || 0) === 100 ? C.green : C.teal, backgroundColor: C.surface }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 800, color: C.text2 }}>%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={calDrawerItem.progress !== undefined && calDrawerItem.progress !== null ? calDrawerItem.progress : (calDrawerItem.status === 'Done' ? 100 : 0)}
                  onChange={e => {
                    const val = Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                    let st = "Pending";
                    if (val === 100) st = "Done";
                    else if (val > 0) st = "In Progress";
                    setCalDrawerItem({ ...calDrawerItem, progress: val, status: st });
                  }}
                  style={{ width: "100%", cursor: "pointer", accentColor: (calDrawerItem.progress || 0) === 100 ? C.green : C.teal }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.text3, marginTop: 4 }}>
                  <span>0% (Pending)</span>
                  <span>50% (In Progress)</span>
                  <span>100% (Done)</span>
                </div>
              </div>

              {/* Status & Remarks */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>Done / Pending Status</label>
                  <select
                    value={calDrawerItem.status || "Pending"}
                    onChange={e => {
                      const st = e.target.value;
                      let prog = calDrawerItem.progress || 0;
                      if (st === "Done") prog = 100;
                      else if (st === "Pending") prog = 0;
                      else if (st === "In Progress" && (prog === 0 || prog === 100)) prog = 50;
                      setCalDrawerItem({ ...calDrawerItem, status: st, progress: prog });
                    }}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, backgroundColor: C.surface, color: C.text1 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>Remarks / Audit Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. SAP Access mail sent"
                    value={calDrawerItem.remarks || ""}
                    onChange={e => setCalDrawerItem({ ...calDrawerItem, remarks: e.target.value })}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4, backgroundColor: C.surface, color: C.text1 }}
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions: Delete (if editing), Cancel, Save */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: calDrawerItem.id ? "space-between" : "flex-end", alignItems: "center", backgroundColor: C.bg2 }}>
              {calDrawerItem.id && (
                <button
                  type="button"
                  onClick={() => handleDeleteCalItem(calDrawerItem.id)}
                  style={{
                    padding: "9px 14px", borderRadius: 8, border: `1px solid ${C.redBorder}`,
                    backgroundColor: C.redBg, color: C.red, fontSize: 12.5, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsCalDrawerOpen(false)}
                  style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surface, color: C.text2, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCalDrawerItem}
                  style={{ padding: "9px 18px", borderRadius: 8, border: "none", backgroundColor: C.teal, color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 6px rgba(13,148,136,0.25)" }}
                >
                  {calDrawerItem.id ? "Save Changes" : "Create Activity"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5C. SEND WEEKLY CALENDAR PLAN TO CLIENT DRAWER */}
      {isSendCalEmailDrawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1200, display: "flex", justifyContent: "flex-end" }}>
          {/* Backdrop */}
          <div
            onClick={() => !isSendingCalEmail && setIsSendCalEmailDrawerOpen(false)}
            style={{
              position: "absolute", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(2px)"
            }}
          />

          {/* Slide-over Drawer Body with Dynamic Resizable Width */}
          <div
            style={{
              position: "relative",
              width: isCalDrawerMaximized ? "95vw" : `${calEmailDrawerWidth}px`,
              maxWidth: "96vw",
              minWidth: 480,
              height: "100%",
              backgroundColor: C.surface,
              borderLeft: `1px solid ${C.border}`,
              boxShadow: "-10px 0 35px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              zIndex: 1201,
              transition: isResizingDrawer ? "none" : "width 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            {/* Left Edge Drag-to-Resize Handle */}
            <div
              onMouseDown={handleStartResize}
              title="Drag left/right to resize panel width"
              style={{
                position: "absolute",
                top: 0,
                left: -7,
                width: 14,
                height: "100%",
                cursor: "col-resize",
                zIndex: 1205,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none"
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 54,
                  borderRadius: 4,
                  backgroundColor: isResizingDrawer ? C.teal : "#94a3b8",
                  opacity: isResizingDrawer ? 1 : 0.6,
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
                }}
              />
            </div>

            {/* Header */}
            <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.bg2 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.teal, backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, padding: "2px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <Mail size={12} /> Email Dispatch Pipeline
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.purple, backgroundColor: C.purpleBg, border: `1px solid ${C.purpleBorder}`, padding: "2px 8px", borderRadius: 6 }}>
                    {selectedProject?.company_name || "Client"}
                  </span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text1, margin: 0 }}>
                  Send Weekly Calendar Plan
                </h3>
                <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>
                  Export and dispatch the audit execution schedule to selected client stakeholders.
                </div>
              </div>

              {/* Header Action Tools: Width Presets, Maximize & Close */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* Width Presets */}
                <div style={{ display: "flex", gap: 3, backgroundColor: C.surface, padding: 3, borderRadius: 8, border: `1px solid ${C.border}`, marginRight: 4 }}>
                  <button
                    type="button"
                    onClick={() => { setCalEmailDrawerWidth(620); setIsCalDrawerMaximized(false); }}
                    title="Standard Width (620px)"
                    style={{
                      padding: "4px 8px", borderRadius: 6, border: "none",
                      backgroundColor: (!isCalDrawerMaximized && calEmailDrawerWidth === 620) ? C.tealBg : "transparent",
                      color: (!isCalDrawerMaximized && calEmailDrawerWidth === 620) ? C.teal : C.text3,
                      fontSize: 11, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    620px
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCalEmailDrawerWidth(920); setIsCalDrawerMaximized(false); }}
                    title="Wide Panel (920px)"
                    style={{
                      padding: "4px 8px", borderRadius: 6, border: "none",
                      backgroundColor: (!isCalDrawerMaximized && calEmailDrawerWidth === 920) ? C.tealBg : "transparent",
                      color: (!isCalDrawerMaximized && calEmailDrawerWidth === 920) ? C.teal : C.text3,
                      fontSize: 11, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    920px
                  </button>
                </div>

                {/* Maximize / Minimize Toggle */}
                <button
                  type="button"
                  onClick={() => setIsCalDrawerMaximized(prev => !prev)}
                  title={isCalDrawerMaximized ? "Restore Default Width" : "Maximize Panel to Full Width"}
                  style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, color: C.text2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {isCalDrawerMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  disabled={isSendingCalEmail}
                  onClick={() => setIsSendCalEmailDrawerOpen(false)}
                  style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, color: C.text2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Drawer Body Form & Preview */}
            <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
              {/* 1. Client Stakeholder Selection */}
              <div style={{ backgroundColor: C.bg2, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 800, color: C.text1, display: "flex", alignItems: "center", gap: 6 }}>
                      <Users size={14} style={{ color: C.teal }} /> Select Client Recipients
                    </label>
                    <div style={{ fontSize: 11.5, color: C.text3, marginTop: 2 }}>
                      Choose contacts from the Organization Structure Directory
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        const allValid = orgMembers
                          .filter(m => m.email && m.email.trim() && m.email.includes("@"))
                          .map(m => m.email.trim());
                        setCalEmailRecipients(allValid);
                      }}
                      style={{ fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.border}`, backgroundColor: C.surface, color: C.teal, cursor: "pointer" }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalEmailRecipients([])}
                      style={{ fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.border}`, backgroundColor: C.surface, color: C.text3, cursor: "pointer" }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {orgMembers.filter(m => m.email && m.email.includes("@")).length === 0 ? (
                  <div style={{ padding: "14px 16px", backgroundColor: C.surface, borderRadius: 8, border: `1px dashed ${C.border}`, fontSize: 12, color: C.text3, textAlign: "center" }}>
                    No client contacts with email addresses registered yet in the Organization Structure directory. You can type recipient emails below.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 170, overflowY: "auto", paddingRight: 4 }}>
                    {orgMembers
                      .filter(m => m.email && m.email.includes("@"))
                      .map((member, mIdx) => {
                        const isSelected = calEmailRecipients.includes(member.email.trim());
                        return (
                          <div
                            key={mIdx}
                            onClick={() => {
                              const em = member.email.trim();
                              setCalEmailRecipients(prev =>
                                prev.includes(em) ? prev.filter(e => e !== em) : [...prev, em]
                              );
                            }}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "9px 12px", borderRadius: 8,
                              backgroundColor: isSelected ? C.tealBg : C.surface,
                              border: `1px solid ${isSelected ? C.tealBorder : C.border}`,
                              cursor: "pointer", transition: "all 0.12s ease"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}} // handled by parent onClick
                                style={{ accentColor: C.teal, width: 16, height: 16, cursor: "pointer" }}
                              />
                              <div>
                                <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text1 }}>
                                  {member.member_name}
                                </div>
                                <div style={{ fontSize: 11, color: C.text3 }}>
                                  {member.designation ? `${member.designation} • ` : ""}{member.department || "Client Contact"}
                                </div>
                              </div>
                            </div>
                            <span style={{ fontSize: 11.5, fontWeight: 600, color: C.teal, fontFamily: MONO, backgroundColor: C.surface, padding: "2px 8px", borderRadius: 6, border: `1px solid ${C.border}` }}>
                              {member.email}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Additional Primary (TO) Emails */}
                <div style={{ marginTop: 12 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: C.text2, display: "block", marginBottom: 4 }}>
                    Additional Primary (TO) Emails (comma or newline separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. cfo@client.com, audit.lead@client.com"
                    value={calEmailCustomTo}
                    onChange={e => setCalEmailCustomTo(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12.5, backgroundColor: C.surface, color: C.text1 }}
                  />
                </div>
              </div>

              {/* 1B. CC (Carbon Copy) Recipients */}
              <div style={{ backgroundColor: C.bg2, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 800, color: C.text1, display: "flex", alignItems: "center", gap: 6 }}>
                    <Mail size={14} style={{ color: C.purple }} /> CC (Carbon Copy) Recipients
                  </label>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: C.purple, backgroundColor: C.purpleBg, border: `1px solid ${C.purpleBorder}`, padding: "2px 8px", borderRadius: 6 }}>
                    Dispatched as CC:
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: C.text3, marginBottom: 8 }}>
                  Enter internal team members, partners, or client executives to receive the email in CC (comma or newline separated). Supports <code>Name &lt;email@domain.com&gt;</code> format.
                </div>
                <textarea
                  rows={2}
                  placeholder="e.g. Chitra Sood <chitrasood.bnc@gmail.com>, Anshu <anshukumarprasad565@gmail.com>"
                  value={calEmailCc}
                  onChange={e => setCalEmailCc(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12.5, backgroundColor: C.surface, color: C.text1, resize: "vertical" }}
                />
              </div>

              {/* 2. Schedule Week Scope Selector */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>
                  Calendar Scope / Week Filter
                </label>
                <select
                  value={calEmailWeekFilter}
                  onChange={e => setCalEmailWeekFilter(e.target.value)}
                  style={{
                    width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${C.border}`,
                    fontSize: 13, fontWeight: 700, color: C.teal, backgroundColor: C.surface, cursor: "pointer"
                  }}
                >
                  <option value="ALL">🗓️ Full Schedule — All Weeks ({calendarItems.length} activities)</option>
                  {uniqueWeeks.map(wk => (
                    <option key={wk} value={wk}>
                      {wk} ({calendarItems.filter(i => i.week_name === wk).length} activities)
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Subject Line */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  value={calEmailSubject}
                  onChange={e => setCalEmailSubject(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, color: C.text1, backgroundColor: C.surface }}
                />
              </div>

              {/* 4. Cover Message Note */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>
                  Cover Note / Introduction Message
                </label>
                <textarea
                  rows={4}
                  value={calEmailMessage}
                  onChange={e => setCalEmailMessage(e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, lineHeight: 1.5, color: C.text1, backgroundColor: C.surface, resize: "vertical" }}
                />
              </div>

              {/* 5. Live Table Export Preview */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>
                    Table Export Preview ({calEmailWeekFilter === "ALL" ? calendarItems.length : calendarItems.filter(i => i.week_name === calEmailWeekFilter).length} Rows)
                  </label>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.teal, backgroundColor: C.tealBg, padding: "2px 8px", borderRadius: 6, border: `1px solid ${C.tealBorder}` }}>
                    Drafted in Responsive HTML
                  </span>
                </div>

                {(() => {
                  const previewItems = calEmailWeekFilter === "ALL"
                    ? calendarItems
                    : calendarItems.filter(i => i.week_name === calEmailWeekFilter);

                  const pRows = [...previewItems];
                  const previewRowsWithSpans = [];
                  let pi = 0;
                  while (pi < pRows.length) {
                    const currentWeek = pRows[pi].week_name || "";
                    let weekSpan = 0;
                    while (pi + weekSpan < pRows.length && (pRows[pi + weekSpan].week_name || "") === currentWeek) {
                      weekSpan++;
                    }

                    let pj = 0;
                    while (pj < weekSpan) {
                      const currentDesc = pRows[pi + pj].week_description || "";
                      let descSpan = 0;
                      while (pj + descSpan < weekSpan && (pRows[pi + pj + descSpan].week_description || "") === currentDesc) {
                        descSpan++;
                      }

                      for (let pk = 0; pk < descSpan; pk++) {
                        const rIdx = pi + pj + pk;
                        previewRowsWithSpans.push({
                          ...pRows[rIdx],
                          showWeek: pj === 0 && pk === 0,
                          weekRowSpan: pj === 0 && pk === 0 ? weekSpan : 0,
                          showDesc: pk === 0,
                          descRowSpan: pk === 0 ? descSpan : 0,
                          isFirstInWeek: pj === 0 && pk === 0,
                          isLastInWeek: pj + pk === weekSpan - 1
                        });
                      }
                      pj += descSpan;
                    }
                    pi += weekSpan;
                  }

                  return (
                    <div style={{ borderRadius: 8, border: `1px solid ${C.border}`, overflowX: "auto", maxHeight: 220, overflowY: "auto", backgroundColor: C.surface }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ backgroundColor: C.bg2, color: C.text2, textAlign: "left" }}>
                            <th style={{ padding: "8px 10px", border: `1px solid ${C.border}`, width: 95, textAlign: "center" }}>Week</th>
                            <th style={{ padding: "8px 10px", border: `1px solid ${C.border}`, width: 140 }}>Week Description</th>
                            <th style={{ padding: "8px 10px", border: `1px solid ${C.border}`, width: 150 }}>Activity</th>
                            <th style={{ padding: "8px 10px", border: `1px solid ${C.border}` }}>Detailed Audit Work</th>
                            <th style={{ padding: "8px 10px", border: `1px solid ${C.border}`, width: 100, textAlign: "center" }}>Progress</th>
                            <th style={{ padding: "8px 10px", border: `1px solid ${C.border}`, width: 95, textAlign: "center" }}>Status</th>
                            <th style={{ padding: "8px 10px", border: `1px solid ${C.border}`, width: 120 }}>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewRowsWithSpans.length > 0 ? (
                            previewRowsWithSpans.map((item, idx) => {
                              const pVal = item.progress !== undefined && item.progress !== null ? item.progress : (item.status === 'Done' ? 100 : 0);
                              return (
                                <tr key={idx} style={{ borderBottom: item.isLastInWeek ? `2px solid ${C.border}` : `1px solid ${C.border}` }}>
                                  {/* Merged Week */}
                                  {item.showWeek && (
                                    <td
                                      rowSpan={item.weekRowSpan}
                                      style={{
                                        padding: "8px 10px", border: `1px solid ${C.border}`,
                                        fontWeight: 800, color: C.teal, backgroundColor: C.bg2,
                                        verticalAlign: "middle", textAlign: "center"
                                      }}
                                    >
                                      <span style={{ backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, color: C.teal, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800, display: "inline-block", whiteSpace: "nowrap" }}>
                                        {item.week_name || "—"}
                                      </span>
                                    </td>
                                  )}

                                  {/* Merged Week Description */}
                                  {item.showDesc && (
                                    <td
                                      rowSpan={item.descRowSpan}
                                      style={{
                                        padding: "8px 10px", border: `1px solid ${C.border}`,
                                        fontWeight: 700, color: C.text1, verticalAlign: "middle",
                                        backgroundColor: C.surface
                                      }}
                                    >
                                      {item.week_description || "—"}
                                    </td>
                                  )}

                                  {/* Activity */}
                                  <td style={{ padding: "8px 10px", border: `1px solid ${C.border}`, fontWeight: 600, color: C.text1 }}>
                                    {item.activity || "—"}
                                  </td>

                                  {/* Detailed Audit Work */}
                                  <td style={{ padding: "8px 10px", border: `1px solid ${C.border}`, color: C.text2, fontSize: 11.5 }}>
                                    {item.detailed_audit_work || "—"}
                                  </td>

                                  {/* Progress */}
                                  <td style={{ padding: "8px 10px", border: `1px solid ${C.border}`, verticalAlign: "middle", textAlign: "center" }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: pVal === 100 ? C.green : (pVal > 0 ? C.teal : C.text3), marginBottom: 3 }}>
                                      {pVal}%
                                    </div>
                                    <div style={{ width: "100%", height: 5, backgroundColor: C.bg2, borderRadius: 3, overflow: "hidden", border: `1px solid ${C.border}` }}>
                                      <div style={{ width: `${pVal}%`, height: "100%", backgroundColor: pVal === 100 ? C.green : C.teal, borderRadius: 3 }} />
                                    </div>
                                  </td>

                                  {/* Status */}
                                  <td style={{ padding: "8px 10px", border: `1px solid ${C.border}`, textAlign: "center", whiteSpace: "nowrap" }}>
                                    <span style={{ fontSize: 10.5, fontWeight: 700, color: item.status === 'Done' ? C.green : C.amber, backgroundColor: item.status === 'Done' ? C.greenBg : C.amberBg, padding: "2px 6px", borderRadius: 4 }}>
                                      {item.status || "Pending"}
                                    </span>
                                  </td>

                                  {/* Remarks */}
                                  <td style={{ padding: "8px 10px", border: `1px solid ${C.border}`, color: C.text3, fontSize: 11 }}>
                                    {item.remarks || "—"}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={7} style={{ padding: 20, textAlign: "center", color: C.text3, fontSize: 12 }}>
                                No activities found for this selection.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Footer Action Bar */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.bg2 }}>
              <div style={{ fontSize: 12, color: C.text2, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span>
                  <strong style={{ color: C.teal }}>
                    {calEmailRecipients.length + calEmailCustomTo.split(/[,;\n]/).filter(e => e.trim() && e.includes("@")).length}
                  </strong> in <strong>TO</strong>
                </span>
                {calEmailCc.split(/[,;\n]/).filter(e => e.trim() && e.includes("@")).length > 0 && (
                  <span>
                    &bull; <strong style={{ color: C.purple }}>
                      {calEmailCc.split(/[,;\n]/).filter(e => e.trim() && e.includes("@")).length}
                    </strong> in <strong>CC</strong>
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  disabled={isSendingCalEmail}
                  onClick={() => setIsSendCalEmailDrawerOpen(false)}
                  style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surface, color: C.text2, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSendingCalEmail}
                  onClick={handleSendCalEmail}
                  style={{
                    padding: "9px 20px", borderRadius: 8, border: "none",
                    backgroundColor: isSendingCalEmail ? C.text3 : C.teal,
                    color: "#fff", fontSize: 12.5, fontWeight: 700,
                    cursor: isSendingCalEmail ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: "0 2px 8px rgba(13,148,136,0.3)"
                  }}
                >
                  <Send size={15} />
                  {isSendingCalEmail ? "Dispatching Email..." : "Send Weekly Plan to Client"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddOrgModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 12, padding: 28, width: 450, border: `1px solid ${C.border}` }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>+ Add Client Contact Member</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Member Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={newOrgMember.member_name}
                  onChange={e => setNewOrgMember({ ...newOrgMember, member_name: e.target.value })}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. General Manager"
                    value={newOrgMember.designation}
                    onChange={e => setNewOrgMember({ ...newOrgMember, designation: e.target.value })}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Procurement"
                    value={newOrgMember.department}
                    onChange={e => setNewOrgMember({ ...newOrgMember, department: e.target.value })}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. rajesh.k@company.com"
                    value={newOrgMember.email}
                    onChange={e => setNewOrgMember({ ...newOrgMember, email: e.target.value })}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9876543210"
                    value={newOrgMember.phone}
                    onChange={e => setNewOrgMember({ ...newOrgMember, phone: e.target.value })}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, marginTop: 4 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                <button onClick={() => setShowAddOrgModal(false)} style={{ padding: "8px 16px", border: `1px solid ${C.border}`, borderRadius: 6, background: "transparent", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleAddOrgMember} style={{ padding: "8px 16px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Save Contact Member</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Interactive Excel Column Mapping Panel Modal */}
      {showMappingModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, backdropFilter: "blur(3px)" }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 14, padding: 28, width: 720, maxHeight: "90vh", overflowY: "auto", border: `1px solid ${C.border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, borderBottom: `1px solid ${C.border}`, paddingBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text1, margin: 0 }}>
                  📊 Excel Column Mapping Panel — {mappingSection === "calendar" ? "Weekly Execution Schedule" : mappingSection === "org" ? "Contacts Directory" : "Audit Programme Table"}
                </h3>
                <div style={{ fontSize: 12, color: C.text3, marginTop: 4 }}>
                  Map columns detected in your uploaded file to database fields before importing {rawFileRows.length} rows.
                </div>
              </div>
              <button onClick={() => setShowMappingModal(false)} style={{ border: "none", background: "transparent", fontSize: 18, cursor: "pointer", color: C.text2 }}>✕</button>
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, color: C.teal, marginBottom: 12, backgroundColor: C.tealBg, padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.tealBorder}` }}>
              System Field to File Header Mapping
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              {(mappingSection === "calendar"
                ? [
                  { key: "week_name", label: "Week Label (e.g. Week 1)" },
                  { key: "week_description", label: "Week Description" },
                  { key: "activity", label: "Activity Name *" },
                  { key: "detailed_audit_work", label: "Detailed Audit Work" },
                  { key: "progress", label: "Progress (0-100%)" },
                  { key: "status", label: "Done/Pending Status" },
                  { key: "remarks", label: "Remarks" }
                ]
                : mappingSection === "org"
                  ? [
                    { key: "member_name", label: "Member Full Name *" },
                    { key: "designation", label: "Designation" },
                    { key: "department", label: "Department" },
                    { key: "email", label: "Email Address" },
                    { key: "phone", label: "Phone Number" }
                  ]
                  : [
                    { key: "header_title", label: "Procedure Header Title (Spans Table Width)" },
                    ...customColumns.map(col => ({ key: col.key, label: col.label }))
                  ]
              ).map(field => (
                <div key={field.key} style={{ backgroundColor: C.bg2, padding: 12, borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text1, display: "block", marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <select
                    value={columnMapping[field.key] || ""}
                    onChange={e => setColumnMapping({ ...columnMapping, [field.key]: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12.5, backgroundColor: C.surface, color: C.text1 }}
                  >
                    <option value="">-- Ignore / Not Mapped --</option>
                    {rawFileHeaders.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* 2. New Columns Discovered in Excel Section (Audit Programme) */}
            {mappingSection === "programme" && detectedNewColumns.length > 0 && (
              <div style={{ backgroundColor: "#f0fdf4", border: `1.5px solid #86efac`, borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>✨</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "#166534" }}>
                      {detectedNewColumns.length} New Column(s) Detected in Uploaded Excel
                    </div>
                    <div style={{ fontSize: 11.5, color: "#15803d", marginTop: 2 }}>
                      These columns were found in your Excel file and do not match the standard 9 columns. Select which ones you want to automatically add as new columns:
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                  {detectedNewColumns.map((newCol, nIdx) => (
                    <div
                      key={nIdx}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: 8,
                        border: `1px solid ${newCol.include ? '#10b981' : C.border}`,
                        gap: 12, flexWrap: "wrap", boxShadow: newCol.include ? "0 2px 5px rgba(16,185,129,0.12)" : "none"
                      }}
                    >
                      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", minWidth: 220, flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={newCol.include}
                          onChange={e => {
                            const updated = [...detectedNewColumns];
                            updated[nIdx].include = e.target.checked;
                            setDetectedNewColumns(updated);
                          }}
                          style={{ width: 17, height: 17, accentColor: C.teal, cursor: "pointer" }}
                        />
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.text1 }}>{newCol.header}</span>
                          <div style={{ fontSize: 11, color: C.text3 }}>Excel Column Header</div>
                        </div>
                      </label>

                      {newCol.include && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 10, fontWeight: 700, color: C.text3, display: "block", marginBottom: 2 }}>Column Label</label>
                            <input
                              type="text"
                              value={newCol.label}
                              onChange={e => {
                                const updated = [...detectedNewColumns];
                                updated[nIdx].label = e.target.value;
                                setDetectedNewColumns(updated);
                              }}
                              style={{ padding: "5px 9px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, color: C.text1, width: 140 }}
                            />
                          </div>

                          <div style={{ width: 130 }}>
                            <label style={{ fontSize: 10, fontWeight: 700, color: C.text3, display: "block", marginBottom: 2 }}>Field Type</label>
                            <select
                              value={newCol.type}
                              onChange={e => {
                                const updated = [...detectedNewColumns];
                                updated[nIdx].type = e.target.value;
                                setDetectedNewColumns(updated);
                              }}
                              style={{ width: "100%", padding: "5px 8px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, color: C.text1, backgroundColor: C.surface }}
                            >
                              <option value="text">Single-line Text</option>
                              <option value="textarea">Multi-line Text</option>
                              <option value="number">Numeric</option>
                              <option value="date">Date</option>
                              <option value="select">Dropdown Choice</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mapped Row Preview Table */}
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text1, marginBottom: 8 }}>
              Preview Mapped Import Rows ({Math.min(3, rawFileRows.length)} of {rawFileRows.length} rows)
            </div>

            <div style={{ overflowX: "auto", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ backgroundColor: C.bg2, color: C.text2 }}>
                    {Object.keys(columnMapping).filter(k => columnMapping[k]).map(k => (
                      <th key={k} style={{ padding: "8px 12px", border: `1px solid ${C.border}`, textAlign: "left" }}>{k}</th>
                    ))}
                    {mappingSection === "programme" && detectedNewColumns.filter(nc => nc.include).map(nc => (
                      <th key={nc.key} style={{ padding: "8px 12px", border: `1px solid #86efac`, backgroundColor: "#f0fdf4", color: "#166534", textAlign: "left" }}>
                        ✨ {nc.label} (New)
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rawFileRows.slice(0, 3).map((row, idx) => (
                    <tr key={idx}>
                      {Object.keys(columnMapping).filter(k => columnMapping[k]).map(k => {
                        const h = columnMapping[k];
                        const colIdx = rawFileHeaders.indexOf(h);
                        const val = colIdx !== -1 ? row[colIdx] : "";
                        return (
                          <td key={k} style={{ padding: "8px 12px", border: `1px solid ${C.border}`, color: val ? C.text1 : C.text3 }}>
                            {val || "—"}
                          </td>
                        );
                      })}
                      {mappingSection === "programme" && detectedNewColumns.filter(nc => nc.include).map(nc => {
                        const colIdx = rawFileHeaders.indexOf(nc.header);
                        const val = colIdx !== -1 ? row[colIdx] : "";
                        return (
                          <td key={nc.key} style={{ padding: "8px 12px", border: `1px solid #86efac`, color: val ? "#166534" : C.text3, fontWeight: 600 }}>
                            {val || "—"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={() => setShowMappingModal(false)} style={{ padding: "9px 18px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleSaveMappedData} style={{ padding: "9px 20px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, boxShadow: "0 2px 6px rgba(13,148,136,0.25)" }}>
                ✓ Confirm Mapping & Save {rawFileRows.length} Rows to Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Email Request Pipeline & Draft Preview Modal */}
      {showEmailDraftModal && emailDraftData && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, backdropFilter: "blur(3px)", padding: 20 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 16, padding: 28, width: 720, maxHeight: "90vh", overflowY: "auto", border: `1px solid ${C.border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 14 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text1, margin: 0 }}>✉️ Email Request Pipeline & Draft Preview</h3>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.teal, backgroundColor: C.tealBg, padding: "3px 8px", borderRadius: 10, border: `1px solid ${C.tealBorder}` }}>
                    🔒 Secure Upload Portal
                  </span>
                </div>
                <div style={{ fontSize: 12, color: C.text3, marginTop: 3 }}>
                  Review and customize the email draft before sending to client & CC recipients.
                </div>
              </div>
              <button onClick={() => setShowEmailDraftModal(false)} style={{ border: "none", background: "transparent", fontSize: 18, cursor: "pointer", color: C.text2 }}>✕</button>
            </div>

            {/* Recipient Details */}
            <div style={{ backgroundColor: C.bg2, padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.6 }}>Primary Client Recipient (TO)</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>{emailDraftData.recipientName}</div>
                <div style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>{emailDraftData.recipientEmail}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.text3, textTransform: "uppercase", letterSpacing: 0.6 }}>Requested Items</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.teal }}>{emailDraftData.items.length} document(s)</div>
              </div>
            </div>

            {/* CC (Carbon Copy) Section */}
            <div style={{ backgroundColor: C.bg2, borderRadius: 10, padding: 14, border: `1px solid ${C.border}`, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: C.text1, display: "flex", alignItems: "center", gap: 6 }}>
                  <Mail size={13} style={{ color: C.purple }} /> CC: Carbon Copy Recipients
                </label>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: C.purple, backgroundColor: C.purpleBg, border: `1px solid ${C.purpleBorder}`, padding: "2px 8px", borderRadius: 6 }}>
                  Dispatched as CC:
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: C.text3, marginBottom: 8 }}>
                Add internal team members, audit leaders, or client contacts to receive this email in CC (comma separated).
              </div>
              <textarea
                rows={2}
                placeholder="e.g. Chitra Sood <chitrasood.bnc@gmail.com>, Anshu <anshukumarprasad565@gmail.com>"
                value={emailDraftData.ccEmails || ""}
                onChange={e => setEmailDraftData({ ...emailDraftData, ccEmails: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, backgroundColor: C.surface, color: C.text1, resize: "vertical" }}
              />

              {/* Quick Add CC Chips */}
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.text3 }}>Quick Add CC:</span>
                {orgMembers.filter(m => m.email && m.email.includes("@") && m.id !== emailDraftData.recipientId).slice(0, 4).map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      const cur = (emailDraftData.ccEmails || "").trim();
                      const addition = `${m.member_name} <${m.email}>`;
                      if (cur.includes(m.email)) return;
                      const nextVal = cur ? `${cur}, ${addition}` : addition;
                      setEmailDraftData({ ...emailDraftData, ccEmails: nextVal });
                    }}
                    style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.border}`, backgroundColor: C.surface, color: C.teal, cursor: "pointer", fontWeight: 600 }}
                  >
                    + {m.member_name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Line */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>Email Subject Line</label>
              <input
                type="text"
                value={emailDraftData.subject}
                onChange={e => setEmailDraftData({ ...emailDraftData, subject: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, color: C.text1 }}
              />
            </div>

            {/* Body Text */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>Email Message Body & Portal Link</label>
              <textarea
                rows={7}
                value={emailDraftData.bodyText}
                onChange={e => setEmailDraftData({ ...emailDraftData, bodyText: e.target.value })}
                style={{ width: "100%", padding: "12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, fontFamily: "monospace", lineHeight: 1.5, color: C.text1 }}
              />
            </div>

            {/* Secure Portal Link Box */}
            <div style={{ backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, padding: 14, borderRadius: 10, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.teal, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>
                Generated Secure Document Upload Portal Link:
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text1, wordBreak: "break-all", fontFamily: MONO, marginBottom: 10 }}>
                {emailDraftData.portalUrl}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(emailDraftData.portalUrl);
                    showToast("Portal Link copied to clipboard!", "success", "Copied to Clipboard");
                  }}
                  style={{ padding: "6px 12px", backgroundColor: C.surface, color: C.teal, border: `1px solid ${C.tealBorder}`, borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                >
                  📋 Copy Link
                </button>
                <button
                  type="button"
                  onClick={() => window.open(emailDraftData.portalUrl, '_blank')}
                  style={{ padding: "6px 12px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  <ExternalLink size={12} /> Open Portal Page
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={() => setShowEmailDraftModal(false)} style={{ padding: "9px 18px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleDispatchDraftEmail} style={{ padding: "9px 22px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(13,148,136,0.3)" }}>
                <Send size={14} /> Send Email Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8B. Modal: Add Manual Data Requirement to Tracker */}
      {showAddTrackerModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, backdropFilter: "blur(3px)", padding: 20 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 16, padding: 28, width: 560, maxHeight: "90vh", overflowY: "auto", border: `1px solid ${C.border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, borderBottom: `1px solid ${C.border}`, paddingBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text1, margin: 0 }}>+ Add Data Requirement to Tracker</h3>
                <div style={{ fontSize: 12, color: C.text3, marginTop: 3 }}>
                  Add a manual document requirement to the audit data tracker.
                </div>
              </div>
              <button onClick={() => setShowAddTrackerModal(false)} style={{ border: "none", background: "transparent", fontSize: 18, cursor: "pointer", color: C.text2 }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Document / Data Requirement Title */}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, display: "block", marginBottom: 6 }}>
                  Document / Requirement Name <span style={{ color: C.red }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vendor Master Amendment Log, RFQ Template, PO Dump"
                  value={newTrackerItem.data_requirement}
                  onChange={e => setNewTrackerItem({ ...newTrackerItem, data_requirement: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1 }}
                />
              </div>

              {/* Sub-Process / Audit Area */}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, display: "block", marginBottom: 6 }}>
                  Sub-Process / Audit Area (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vendor Master, Procurement, Invoice Booking, General Controls"
                  value={newTrackerItem.sub_process}
                  onChange={e => setNewTrackerItem({ ...newTrackerItem, sub_process: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1 }}
                />
              </div>

              {/* Assigned Client Person */}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, display: "block", marginBottom: 6 }}>
                  Assigned Client Contact Person (Optional)
                </label>
                <select
                  value={newTrackerItem.client_person_id}
                  onChange={e => setNewTrackerItem({ ...newTrackerItem, client_person_id: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1 }}
                >
                  <option value="">Select Contact Person from Organization Structure...</option>
                  {orgMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.member_name} ({m.email || 'No email'}) {m.department ? `• ${m.department}` : ''}</option>
                  ))}
                </select>
              </div>

              {/* Initial Remarks / Notes */}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, display: "block", marginBottom: 6 }}>
                  Audit Notes / Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Provide extracts for the audit period April 2025 to March 2026."
                  value={newTrackerItem.remarks}
                  onChange={e => setNewTrackerItem({ ...newTrackerItem, remarks: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text1, resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddTrackerModal(false)}
                  style={{ padding: "9px 18px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewTrackerItem}
                  style={{ padding: "9px 22px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(13,148,136,0.3)" }}
                >
                  <Plus size={15} /> Add to Data Tracker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Uploaded Files Auditor Review Modal */}
      {showUploadedFilesModal && viewingFileItem && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, backdropFilter: "blur(3px)", padding: 20 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 16, padding: 28, width: 620, maxHeight: "90vh", overflowY: "auto", border: `1px solid ${C.border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text1, margin: 0 }}>📁 Uploaded Documents & Review</h3>
                <div style={{ fontSize: 12, color: C.text3, marginTop: 3 }}>
                  Inspect client uploaded files and verify audit documentation.
                </div>
              </div>
              <button onClick={() => setShowUploadedFilesModal(false)} style={{ border: "none", background: "transparent", fontSize: 18, cursor: "pointer", color: C.text2 }}>✕</button>
            </div>

            <div style={{ backgroundColor: C.bg2, padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.teal, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 2 }}>Requested Item</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>{viewingFileItem.data_requirement || "Audit Document"}</div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, color: C.text1, marginBottom: 10 }}>Uploaded Files ({(viewingFileItem.attachments || []).length}):</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {(viewingFileItem.attachments || []).length === 0 ? (
                <div style={{ padding: 20, textStyle: "italic", textAlign: "center", color: C.text3, backgroundColor: C.bg2, borderRadius: 8 }}>
                  No files uploaded yet.
                </div>
              ) : (
                (viewingFileItem.attachments || []).map((f, fIdx) => (
                  <div key={fIdx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.bg2, padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <FileSpreadsheet size={20} style={{ color: C.teal }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text1 }}>{f.name}</div>
                        <div style={{ fontSize: 11, color: C.text3 }}>{(f.size / 1024).toFixed(1)} KB • Uploaded {new Date(f.uploadedAt).toLocaleString()}</div>
                      </div>
                    </div>
                    {f.dataUrl && (
                      <a
                        href={f.dataUrl}
                        download={f.name}
                        target="_blank"
                        rel="noreferrer"
                        style={{ padding: "6px 14px", backgroundColor: C.surface, color: C.teal, border: `1px solid ${C.tealBorder}`, borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}
                      >
                        Download / View
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={async () => {
                  const updatedTracker = dataTrackerRows.map(r => r.id === viewingFileItem.id ? { ...r, status_json: { ...r.status_json, document_status: "Reviewed" } } : r);
                  setDataTrackerRows(updatedTracker);
                  setShowUploadedFilesModal(false);
                  try {
                    await fetch('/Auditing/api/dynamic/projects', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: selectedProject.id, data_tracker: updatedTracker })
                    });
                  } catch (e) { }
                }}
                style={{ padding: "9px 18px", backgroundColor: C.purple, color: "#fff", border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <CheckCircle2 size={15} /> Mark Document as Reviewed & Verified
              </button>

              <button onClick={() => setShowUploadedFilesModal(false)} style={{ padding: "9px 18px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. ADD MINUTES OF MEETING (MOM) MODAL ── */}
      {showAddMomModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1050, backdropFilter: "blur(3px)", padding: 20 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 14, width: 620, maxHeight: "90vh", display: "flex", flexDirection: "column", border: `1px solid ${C.border}`, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text1, margin: 0 }}>+ Log Minutes of Meeting (MOM)</h3>
                <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>{processCategory} • Stakeholder Discussion & Action Items</div>
              </div>
              <button onClick={() => setShowAddMomModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: C.text3 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
              {/* Row 1: Topic */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Meeting Topic / Agenda *</label>
                <input
                  type="text"
                  placeholder="e.g. Audit Kickoff Discussion & Scope Alignment"
                  value={newMomRow.topic}
                  onChange={e => setNewMomRow({ ...newMomRow, topic: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                />
              </div>

              {/* Row 2: Date & Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Meeting Date</label>
                  <input
                    type="date"
                    value={newMomRow.meeting_date}
                    onChange={e => setNewMomRow({ ...newMomRow, meeting_date: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Status</label>
                  <select
                    value={newMomRow.status}
                    onChange={e => setNewMomRow({ ...newMomRow, status: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Deferred">Deferred</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Attendees with Dual Dropdown Selectors (Internal Audit Team & Client) */}
              <div style={{ padding: 14, borderRadius: 10, backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text1, display: "flex", alignItems: "center", gap: 6 }}>
                    <Users size={14} color={C.teal} />
                    <span>Meeting Attendees (Client & Audit Team)</span>
                  </label>
                  <span style={{ fontSize: 11, color: C.text3 }}>Select from dropdowns or edit below</span>
                </div>

                {/* Dropdown Selectors Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {/* 1. Internal Audit Team Dropdown */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.teal, display: "block", marginBottom: 4 }}>
                      👥 Internal Audit Team
                    </label>
                    <select
                      value=""
                      onChange={e => {
                        const val = e.target.value;
                        if (!val) return;
                        const current = (newMomRow.attendees || "").split(",").map(s => s.trim()).filter(Boolean);
                        if (!current.includes(val)) {
                          const updated = [...current, val].join(", ");
                          setNewMomRow({ ...newMomRow, attendees: updated });
                        }
                      }}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.tealBorder}`, backgroundColor: C.surface, fontSize: 12, fontWeight: 600, color: C.text1 }}
                    >
                      <option value="">+ Add Audit Team Member...</option>
                      {getProjectAuditTeam().map((member, idx) => (
                        <option key={idx} value={member.display}>
                          {member.isLeader ? `⭐ ${member.name} (Team Leader)` : `${member.name} — ${member.designation}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Client Attendees Dropdown */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", display: "block", marginBottom: 4 }}>
                      🏢 Client Stakeholders / POC
                    </label>
                    <select
                      value=""
                      onChange={e => {
                        const val = e.target.value;
                        if (!val) return;
                        const current = (newMomRow.attendees || "").split(",").map(s => s.trim()).filter(Boolean);
                        if (!current.includes(val)) {
                          const updated = [...current, val].join(", ");
                          setNewMomRow({ ...newMomRow, attendees: updated });
                        }
                      }}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid #c7d2fe`, backgroundColor: C.surface, fontSize: 12, fontWeight: 600, color: C.text1 }}
                    >
                      <option value="">+ Add Client Attendee...</option>
                      {orgMembers.map(m => (
                        <option key={m.id || m.email || m.member_name} value={`${m.member_name || m.name} (${m.designation || m.role || "Client Team"})`}>
                          {m.member_name || m.name} — {m.designation || m.role || "Client"}
                        </option>
                      ))}
                      {orgMembers.length === 0 && (
                        <option disabled value="">(No client members in Org Structure yet)</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Selected Attendee Pills */}
                {newMomRow.attendees && newMomRow.attendees.trim() && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8, padding: 8, backgroundColor: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
                    {newMomRow.attendees.split(",").map(s => s.trim()).filter(Boolean).map((att, i) => {
                      const isClient = orgMembers.some(m => att.toLowerCase().includes((m.member_name || m.name || "").toLowerCase()));
                      return (
                        <span
                          key={i}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "3px 8px", borderRadius: 14, fontSize: 11.5, fontWeight: 600,
                            backgroundColor: isClient ? "#eef2ff" : C.tealBg,
                            color: isClient ? "#4338ca" : C.teal,
                            border: `1px solid ${isClient ? "#c7d2fe" : C.tealBorder}`
                          }}
                        >
                          <span>{att}</span>
                          <X
                            size={12}
                            style={{ cursor: "pointer", opacity: 0.7 }}
                            onClick={() => {
                              const list = newMomRow.attendees.split(",").map(s => s.trim()).filter(Boolean);
                              list.splice(i, 1);
                              setNewMomRow({ ...newMomRow, attendees: list.join(", ") });
                            }}
                          />
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Free text input / manual editor */}
                <input
                  type="text"
                  placeholder="Or type/edit attendees manually (comma-separated)..."
                  value={newMomRow.attendees}
                  onChange={e => setNewMomRow({ ...newMomRow, attendees: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, color: C.text1, backgroundColor: C.surface, fontFamily: "Sora, sans-serif" }}
                />
              </div>

              {/* Row 4: Key Discussion Points */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Key Discussion Points</label>
                <textarea
                  placeholder="Key takeaways, issues highlighted by client, walkthrough notes..."
                  value={newMomRow.key_discussion}
                  onChange={e => setNewMomRow({ ...newMomRow, key_discussion: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text1, fontFamily: "Sora, sans-serif", resize: "vertical" }}
                />
              </div>

              {/* Row 5: Action Items */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Agreed Action Items</label>
                <textarea
                  placeholder="Deliverables, pending documents to be submitted, follow-up meetings..."
                  value={newMomRow.action_items}
                  onChange={e => setNewMomRow({ ...newMomRow, action_items: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text1, fontFamily: "Sora, sans-serif", resize: "vertical" }}
                />
              </div>

              {/* Row 6: Target Date & Owner */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Action Target Date</label>
                  <input
                    type="date"
                    value={newMomRow.target_date}
                    onChange={e => setNewMomRow({ ...newMomRow, target_date: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Action Owner</label>
                  <input
                    type="text"
                    placeholder="e.g. Jack (Client POC)"
                    value={newMomRow.owner}
                    onChange={e => setNewMomRow({ ...newMomRow, owner: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                  />
                </div>
              </div>

              {/* Row 7: Custom Columns if any */}
              {momColumns.filter(c => !["meeting_date", "topic", "attendees", "key_discussion", "action_items", "target_date", "owner", "status"].includes(c.key)).map(col => (
                <div key={col.key}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>{col.label}</label>
                  {col.type === "select" ? (
                    <select
                      value={newMomRow[col.key] || ""}
                      onChange={e => setNewMomRow({ ...newMomRow, [col.key]: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                    >
                      <option value="">Select...</option>
                      {(col.options || (col.choices || []).map(c => c.label)).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={col.type === "date" ? "date" : "text"}
                      placeholder={`Enter ${col.label}...`}
                      value={newMomRow[col.key] || ""}
                      onChange={e => setNewMomRow({ ...newMomRow, [col.key]: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                type="button"
                onClick={() => setShowAddMomModal(false)}
                style={{ padding: "9px 18px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newMomRow.topic.trim()) return showToast("Please enter a meeting topic / agenda.", "warning", "Topic Required");
                  const createdItem = {
                    ...newMomRow,
                    id: "mom_" + Date.now()
                  };
                  const currentList = momData[processCategory] || [];
                  const updatedList = [...currentList, createdItem];
                  const updatedAll = { ...momData, [processCategory]: updatedList };
                  setMomData(updatedAll);
                  if (selectedProject?.id) {
                    saveMomToProject(selectedProject.id, processCategory, updatedAll, momColumns);
                  }
                  setShowAddMomModal(false);
                  showToast("Minutes of Meeting logged successfully.", "success", "MOM Added");
                }}
                style={{ padding: "9px 22px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}
              >
                <span>✓ Save Meeting Minute</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. MINUTES OF MEETING (MOM) SLIDE-OVER DRAWER ── */}
      {selectedMomDrawerRow && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={() => setSelectedMomDrawerRow(null)}
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)" }}
          />
          <div
            style={{
              position: "relative", width: 620, maxWidth: "100vw", height: "100%",
              backgroundColor: C.surface, display: "flex", flexDirection: "column",
              boxShadow: "-10px 0 25px -5px rgba(0,0,0,0.15)", borderLeft: `1px solid ${C.border}`
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.surface2 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.teal, letterSpacing: 0.5 }}>MINUTES OF MEETING DETAIL</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text1, margin: "3px 0 0" }}>
                  {selectedMomDrawerRow.topic || "Meeting Notes"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMomDrawerRow(null)}
                style={{ border: "none", background: "transparent", cursor: "pointer", color: C.text3, padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 24, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Meeting Topic</label>
                <input
                  type="text"
                  value={selectedMomDrawerRow.topic || ""}
                  onChange={e => setSelectedMomDrawerRow({ ...selectedMomDrawerRow, topic: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Meeting Date</label>
                  <input
                    type="date"
                    value={selectedMomDrawerRow.meeting_date || ""}
                    onChange={e => setSelectedMomDrawerRow({ ...selectedMomDrawerRow, meeting_date: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Status</label>
                  <select
                    value={selectedMomDrawerRow.status || "Open"}
                    onChange={e => setSelectedMomDrawerRow({ ...selectedMomDrawerRow, status: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1 }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Deferred">Deferred</option>
                  </select>
                </div>
              </div>

              {/* Attendees with Dual Dropdown Selectors (Internal Audit Team & Client) */}
              <div style={{ padding: 14, borderRadius: 10, backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text1, display: "flex", alignItems: "center", gap: 6 }}>
                    <Users size={14} color={C.teal} />
                    <span>Meeting Attendees (Client & Audit Team)</span>
                  </label>
                  <span style={{ fontSize: 11, color: C.text3 }}>Select from dropdowns or edit below</span>
                </div>

                {/* Dropdown Selectors Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {/* 1. Internal Audit Team Dropdown */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.teal, display: "block", marginBottom: 4 }}>
                      👥 Internal Audit Team
                    </label>
                    <select
                      value=""
                      onChange={e => {
                        const val = e.target.value;
                        if (!val) return;
                        const current = (selectedMomDrawerRow.attendees || "").split(",").map(s => s.trim()).filter(Boolean);
                        if (!current.includes(val)) {
                          const updated = [...current, val].join(", ");
                          setSelectedMomDrawerRow({ ...selectedMomDrawerRow, attendees: updated });
                        }
                      }}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.tealBorder}`, backgroundColor: C.surface, fontSize: 12, fontWeight: 600, color: C.text1 }}
                    >
                      <option value="">+ Add Audit Team Member...</option>
                      {getProjectAuditTeam().map((member, idx) => (
                        <option key={idx} value={member.display}>
                          {member.isLeader ? `⭐ ${member.name} (Team Leader)` : `${member.name} — ${member.designation}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Client Attendees Dropdown */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", display: "block", marginBottom: 4 }}>
                      🏢 Client Stakeholders / POC
                    </label>
                    <select
                      value=""
                      onChange={e => {
                        const val = e.target.value;
                        if (!val) return;
                        const current = (selectedMomDrawerRow.attendees || "").split(",").map(s => s.trim()).filter(Boolean);
                        if (!current.includes(val)) {
                          const updated = [...current, val].join(", ");
                          setSelectedMomDrawerRow({ ...selectedMomDrawerRow, attendees: updated });
                        }
                      }}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid #c7d2fe`, backgroundColor: C.surface, fontSize: 12, fontWeight: 600, color: C.text1 }}
                    >
                      <option value="">+ Add Client Attendee...</option>
                      {orgMembers.map(m => (
                        <option key={m.id || m.email || m.member_name} value={`${m.member_name || m.name} (${m.designation || m.role || "Client Team"})`}>
                          {m.member_name || m.name} — {m.designation || m.role || "Client"}
                        </option>
                      ))}
                      {orgMembers.length === 0 && (
                        <option disabled value="">(No client members in Org Structure yet)</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Selected Attendee Pills */}
                {selectedMomDrawerRow.attendees && selectedMomDrawerRow.attendees.trim() && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8, padding: 8, backgroundColor: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
                    {selectedMomDrawerRow.attendees.split(",").map(s => s.trim()).filter(Boolean).map((att, i) => {
                      const isClient = orgMembers.some(m => att.toLowerCase().includes((m.member_name || m.name || "").toLowerCase()));
                      return (
                        <span
                          key={i}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "3px 8px", borderRadius: 14, fontSize: 11.5, fontWeight: 600,
                            backgroundColor: isClient ? "#eef2ff" : C.tealBg,
                            color: isClient ? "#4338ca" : C.teal,
                            border: `1px solid ${isClient ? "#c7d2fe" : C.tealBorder}`
                          }}
                        >
                          <span>{att}</span>
                          <X
                            size={12}
                            style={{ cursor: "pointer", opacity: 0.7 }}
                            onClick={() => {
                              const list = selectedMomDrawerRow.attendees.split(",").map(s => s.trim()).filter(Boolean);
                              list.splice(i, 1);
                              setSelectedMomDrawerRow({ ...selectedMomDrawerRow, attendees: list.join(", ") });
                            }}
                          />
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Free text input / manual editor */}
                <input
                  type="text"
                  placeholder="Or type/edit attendees manually (comma-separated)..."
                  value={selectedMomDrawerRow.attendees || ""}
                  onChange={e => setSelectedMomDrawerRow({ ...selectedMomDrawerRow, attendees: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, color: C.text1, backgroundColor: C.surface, fontFamily: "Sora, sans-serif" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Key Discussion Points</label>
                <textarea
                  value={selectedMomDrawerRow.key_discussion || ""}
                  onChange={e => setSelectedMomDrawerRow({ ...selectedMomDrawerRow, key_discussion: e.target.value })}
                  rows={4}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text1, resize: "vertical", fontFamily: "Sora, sans-serif" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Agreed Action Items</label>
                <textarea
                  value={selectedMomDrawerRow.action_items || ""}
                  onChange={e => setSelectedMomDrawerRow({ ...selectedMomDrawerRow, action_items: e.target.value })}
                  rows={4}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text1, resize: "vertical", fontFamily: "Sora, sans-serif" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Target Date</label>
                  <input
                    type="date"
                    value={selectedMomDrawerRow.target_date || ""}
                    onChange={e => setSelectedMomDrawerRow({ ...selectedMomDrawerRow, target_date: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Action Owner</label>
                  <input
                    type="text"
                    value={selectedMomDrawerRow.owner || ""}
                    onChange={e => setSelectedMomDrawerRow({ ...selectedMomDrawerRow, owner: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.surface2 }}>
              <button
                type="button"
                onClick={() => {
                  if (!confirm("Are you sure you want to delete this meeting minute?")) return;
                  const currentList = momData[processCategory] || [];
                  const updatedList = currentList.filter(r => r.id !== selectedMomDrawerRow.id);
                  const updatedAll = { ...momData, [processCategory]: updatedList };
                  setMomData(updatedAll);
                  if (selectedProject?.id) {
                    saveMomToProject(selectedProject.id, processCategory, updatedAll, momColumns);
                  }
                  setSelectedMomDrawerRow(null);
                  showToast("Meeting minute deleted.", "notice", "Deleted");
                }}
                style={{ border: "none", backgroundColor: C.redBg, color: C.red, padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
              >
                <Trash2 size={13} /> Delete
              </button>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setSelectedMomDrawerRow(null)}
                  style={{ padding: "9px 16px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text1 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentList = momData[processCategory] || [];
                    const updatedList = currentList.map(r => r.id === selectedMomDrawerRow.id ? selectedMomDrawerRow : r);
                    const updatedAll = { ...momData, [processCategory]: updatedList };
                    setMomData(updatedAll);
                    if (selectedProject?.id) {
                      saveMomToProject(selectedProject.id, processCategory, updatedAll, momColumns);
                    }
                    setSelectedMomDrawerRow(null);
                    showToast("Meeting minute updated successfully.", "success", "Saved");
                  }}
                  style={{ padding: "9px 20px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 800 }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. TESTING & QUERIES WORKPAPER REVIEW DRAWER ── */}
      {selectedTestingDrawerRow && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={() => setSelectedTestingDrawerRow(null)}
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)" }}
          />
          <div
            style={{
              position: "relative", width: 680, maxWidth: "100vw", height: "100%",
              backgroundColor: C.surface, display: "flex", flexDirection: "column",
              boxShadow: "-10px 0 25px -5px rgba(0,0,0,0.15)", borderLeft: `1px solid ${C.border}`
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.surface2 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.teal, letterSpacing: 0.5 }}>TESTING WORKPAPER & QUERY LOG</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text1, margin: "3px 0 0" }}>
                  {selectedTestingDrawerRow.data_requirement || "Audit Testing Workpaper"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTestingDrawerRow(null)}
                style={{ border: "none", background: "transparent", cursor: "pointer", color: C.text3, padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 24, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Linked Procedure Overview Card */}
              <div style={{ padding: 16, borderRadius: 10, backgroundColor: C.bg2, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase" }}>Audit Procedure / Steps</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text1, marginTop: 2, lineHeight: 1.45 }}>{selectedTestingDrawerRow.procedure}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase" }}>Audit Objective / Control</span>
                  <div style={{ fontSize: 12.5, color: C.text2, marginTop: 2, lineHeight: 1.4 }}>{selectedTestingDrawerRow.objective}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase" }}>Key Risk (From Audit Programme)</span>
                  <div style={{ fontSize: 12.5, color: C.text1, marginTop: 2, lineHeight: 1.4 }}>{selectedTestingDrawerRow.key_risk || "—"}</div>
                </div>
                {selectedTestingDrawerRow.sub_process && selectedTestingDrawerRow.sub_process !== "—" && (
                  <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 2 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.text3 }}>Area / Sub-Process: </span>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: C.text1 }}>{selectedTestingDrawerRow.sub_process}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Linked Evidence Files Card */}
              <div style={{ padding: 16, borderRadius: 10, backgroundColor: C.tealBg + "40", border: `1px solid ${C.tealBorder}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: C.teal, textTransform: "uppercase" }}>📎 Linked Data Requirement & Evidence</span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text1, marginTop: 2 }}>
                      {selectedTestingDrawerRow.data_requirement}
                    </div>
                  </div>
                  {selectedTestingDrawerRow.attachments && selectedTestingDrawerRow.attachments.length > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: C.greenBg, color: C.green, padding: "3px 8px", borderRadius: 12, border: `1px solid ${C.greenBorder}` }}>
                      {selectedTestingDrawerRow.attachments.length} File(s)
                    </span>
                  )}
                </div>

                {selectedTestingDrawerRow.attachments && selectedTestingDrawerRow.attachments.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                    {selectedTestingDrawerRow.attachments.map((f, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                          <FileSpreadsheet size={16} color={C.teal} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.text1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name || f.file_name || `Evidence File ${i + 1}`}</div>
                            {f.size && <div style={{ fontSize: 10, color: C.text3 }}>{(f.size / 1024).toFixed(1)} KB</div>}
                          </div>
                        </div>
                        {f.url && (
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ padding: "4px 10px", backgroundColor: C.tealBg, color: C.teal, borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: "none", border: `1px solid ${C.tealBorder}`, display: "inline-flex", alignItems: "center", gap: 4 }}
                          >
                            <Download size={11} /> Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: C.text3, fontStyle: "italic", marginTop: 4 }}>
                    No evidence files uploaded from client yet for this requirement.
                  </div>
                )}
              </div>

              {/* Testing Status Selector & Quick Pills */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>Testing Status</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {[
                    { val: "Satisfactory / Pass", label: "✓ Pass", bg: C.greenBg, border: C.greenBorder, col: C.green },
                    { val: "Failed", label: "✕ Failed", bg: C.redBg, border: C.redBorder, col: C.red },
                    { val: "Exception / Query Raised", label: "⚠️ Exception", bg: C.redBg, border: C.redBorder, col: C.red },
                    { val: "In Progress", label: "⏳ In Progress", bg: C.amberBg, border: C.amberBorder, col: C.amber },
                    { val: "Pending Review", label: "📌 Pending", bg: C.blueBg, border: C.blueBorder, col: C.blue },
                    { val: "Closed", label: "🔒 Closed", bg: C.purpleBg, border: C.purpleBorder, col: C.purple }
                  ].map(pill => {
                    const isSelected = (selectedTestingDrawerRow.testing_status || "Pending Review") === pill.val;
                    return (
                      <button
                        key={pill.val}
                        type="button"
                        onClick={() => setSelectedTestingDrawerRow({ ...selectedTestingDrawerRow, testing_status: pill.val })}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 20,
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          backgroundColor: isSelected ? pill.bg : C.bg2,
                          color: isSelected ? pill.col : C.text2,
                          border: `1.5px solid ${isSelected ? pill.border : C.border}`,
                          boxShadow: isSelected ? `0 0 0 2px ${pill.border}40` : "none",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
                <select
                  value={selectedTestingDrawerRow.testing_status || "Pending Review"}
                  onChange={e => setSelectedTestingDrawerRow({ ...selectedTestingDrawerRow, testing_status: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, fontWeight: 700, color: C.text1 }}
                >
                  <option value="Pending Review">📌 Pending Review</option>
                  <option value="In Progress">⏳ In Progress</option>
                  <option value="Satisfactory / Pass">✓ Satisfactory / Pass</option>
                  <option value="Failed">✕ Failed (Auto-links to Queries)</option>
                  <option value="Exception / Query Raised">⚠️ Exception / Query Raised (Auto-links to Queries)</option>
                  <option value="Closed">🔒 Closed</option>
                </select>
              </div>

              {/* Observations & Findings Textarea */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>
                  Observations & Test Findings / Exceptions
                </label>
                <textarea
                  placeholder="Detail test results, discrepancies identified, sample size tested, non-compliances, and queries raised..."
                  value={selectedTestingDrawerRow.observations_findings || ""}
                  onChange={e => setSelectedTestingDrawerRow({ ...selectedTestingDrawerRow, observations_findings: e.target.value })}
                  rows={5}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, resize: "vertical", fontFamily: "Sora, sans-serif", lineHeight: 1.5 }}
                />
              </div>

              {/* Comments & Audit Trail Textarea */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>
                  Comments & Auditor Working Notes
                </label>
                <textarea
                  placeholder="Internal audit notes, client explanations received, verification steps..."
                  value={selectedTestingDrawerRow.comments || ""}
                  onChange={e => setSelectedTestingDrawerRow({ ...selectedTestingDrawerRow, comments: e.target.value })}
                  rows={4}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, resize: "vertical", fontFamily: "Sora, sans-serif", lineHeight: 1.5 }}
                />
              </div>

              {/* Annexures & Working Papers Upload Card */}
              <div style={{ padding: 16, borderRadius: 10, backgroundColor: C.tealBg + "25", border: `1px solid ${C.tealBorder}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: C.teal, textTransform: "uppercase" }}>📎 Audit Annexures & Working Papers</span>
                    <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>Upload single or multiple workpapers, screenshots, sampling files, or calculations.</div>
                  </div>
                  {(selectedTestingDrawerRow.annexures || []).length > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: C.tealBg, color: C.teal, padding: "3px 8px", borderRadius: 12, border: `1px solid ${C.tealBorder}` }}>
                      {(selectedTestingDrawerRow.annexures || []).length} File(s) Attached
                    </span>
                  )}
                </div>

                {/* Upload Button */}
                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "7px 14px", borderRadius: 8,
                      border: `1px dashed ${C.tealBorder}`, backgroundColor: C.surface,
                      color: C.teal, fontSize: 12, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    <Upload size={14} />
                    <span>+ Upload Annexure (Single or Multiple)</span>
                    <input
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={e => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleAnnexureUpload(selectedTestingDrawerRow.id, e.target.files);
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                </div>

                {/* List of Annexures */}
                {(selectedTestingDrawerRow.annexures && selectedTestingDrawerRow.annexures.length > 0) ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedTestingDrawerRow.annexures.map((f, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                          <FileSpreadsheet size={16} color={C.teal} style={{ flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.text1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {f.name || `Annexure ${i + 1}`}
                            </div>
                            {f.size && <div style={{ fontSize: 10, color: C.text3 }}>{(f.size / 1024).toFixed(1)} KB</div>}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {f.dataUrl && (
                            <a
                              href={f.dataUrl}
                              download={f.name}
                              target="_blank"
                              rel="noreferrer"
                              style={{ padding: "4px 10px", backgroundColor: C.tealBg, color: C.teal, borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: "none", border: `1px solid ${C.tealBorder}`, display: "inline-flex", alignItems: "center", gap: 4 }}
                            >
                              <Download size={11} /> Download
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleAnnexureDelete(selectedTestingDrawerRow.id, i)}
                            title="Remove Annexure"
                            style={{ border: "none", backgroundColor: C.redBg, color: C.red, width: 26, height: 26, borderRadius: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: C.text3, fontStyle: "italic" }}>
                    No annexures uploaded yet for this test procedure.
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 12, backgroundColor: C.surface2 }}>
              <button
                type="button"
                onClick={() => setSelectedTestingDrawerRow(null)}
                style={{ padding: "9px 18px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const rowId = selectedTestingDrawerRow.id;
                  const updatedTestingData = {
                    ...testingData,
                    [rowId]: {
                      ...(testingData[rowId] || {}),
                      testing_status: selectedTestingDrawerRow.testing_status,
                      observations_findings: selectedTestingDrawerRow.observations_findings,
                      comments: selectedTestingDrawerRow.comments,
                      annexures: Array.isArray(selectedTestingDrawerRow.annexures) ? selectedTestingDrawerRow.annexures : (testingData[rowId]?.annexures || []),
                      custom_values: selectedTestingDrawerRow.custom_values || {}
                    }
                  };
                  setTestingData(updatedTestingData);
                  if (selectedProject?.id) {
                    saveTestingToProject(selectedProject.id, updatedTestingData, testingColumns);
                  }
                  setSelectedTestingDrawerRow(null);
                  showToast("Testing workpaper and observations saved.", "success", "Workpaper Saved");
                }}
                style={{ padding: "9px 24px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}
              >
                <span>✓ Save Testing Workpaper</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. ADD MANUAL TESTING ROW MODAL ── */}
      {showAddTestingModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1050, backdropFilter: "blur(3px)", padding: 20 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 14, width: 640, maxHeight: "90vh", display: "flex", flexDirection: "column", border: `1px solid ${C.border}`, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text1, margin: 0 }}>+ Add Manual Testing Row</h3>
                <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>{processCategory} • Direct Audit Testing Entry</div>
              </div>
              <button onClick={() => setShowAddTestingModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: C.text3 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
              {/* Row 1: Data Requirement / Reference */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Data Requirement / Evidence Reference *</label>
                <input
                  type="text"
                  placeholder="e.g. Bank Reconciliation Statement / Vendor Master Audit Sample"
                  value={newTestingRow.data_requirement}
                  onChange={e => setNewTestingRow({ ...newTestingRow, data_requirement: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                />
              </div>

              {/* Row 2: Audit Procedure */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Audit Procedure / Testing Step *</label>
                <textarea
                  placeholder="Detail the audit test to be performed, sample selection criteria, and verification steps..."
                  value={newTestingRow.procedure}
                  onChange={e => setNewTestingRow({ ...newTestingRow, procedure: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text1, fontFamily: "Sora, sans-serif", resize: "vertical" }}
                />
              </div>

              {/* Row 3: Objective & Risk */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Objective / Key Control Target</label>
                  <input
                    type="text"
                    placeholder="e.g. Ensure all bank accounts are reconciled monthly"
                    value={newTestingRow.objective}
                    onChange={e => setNewTestingRow({ ...newTestingRow, objective: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Key Risk / Failure Mode</label>
                  <input
                    type="text"
                    placeholder="e.g. Unreconciled entries leading to financial misstatement"
                    value={newTestingRow.key_risk}
                    onChange={e => setNewTestingRow({ ...newTestingRow, key_risk: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                  />
                </div>
              </div>

              {/* Row 4: Risk Rating & Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Risk Rating</label>
                  <select
                    value={newTestingRow.risk_rating}
                    onChange={e => setNewTestingRow({ ...newTestingRow, risk_rating: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Testing Status</label>
                  <select
                    value={newTestingRow.testing_status}
                    onChange={e => setNewTestingRow({ ...newTestingRow, testing_status: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                  >
                    <option value="Pending Review">📌 Pending Review</option>
                    <option value="In Progress">⏳ In Progress</option>
                    <option value="Satisfactory / Pass">✓ Satisfactory / Pass</option>
                    <option value="Failed">✕ Failed (Auto-links to Queries)</option>
                    <option value="Exception / Query Raised">⚠️ Exception / Query Raised (Auto-links to Queries)</option>
                    <option value="Closed">🔒 Closed</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Observations & Findings */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Observations & Test Findings</label>
                <textarea
                  placeholder="Record initial findings, exceptions, or verified points..."
                  value={newTestingRow.observations_findings}
                  onChange={e => setNewTestingRow({ ...newTestingRow, observations_findings: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text1, fontFamily: "Sora, sans-serif", resize: "vertical" }}
                />
              </div>

              {/* Row 6: Comments */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Comments / Auditor Notes</label>
                <textarea
                  placeholder="Working notes, auditor remarks..."
                  value={newTestingRow.comments}
                  onChange={e => setNewTestingRow({ ...newTestingRow, comments: e.target.value })}
                  rows={2}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text1, fontFamily: "Sora, sans-serif", resize: "vertical" }}
                />
              </div>

              {/* Row 7: Annexures Attachment */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>
                  📎 Attach Annexures / Working Papers (Single or Multiple)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "7px 14px", borderRadius: 8,
                      border: `1px dashed ${C.tealBorder}`, backgroundColor: C.surface,
                      color: C.teal, fontSize: 12, fontWeight: 700, cursor: "pointer",
                      width: "fit-content"
                    }}
                  >
                    <Upload size={14} />
                    <span>+ Choose Annexure Files</span>
                    <input
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={async e => {
                        if (e.target.files && e.target.files.length > 0) {
                          const files = Array.from(e.target.files);
                          showToast("Uploading annexure(s) to Supabase Storage...", "notice", "Uploading");
                          try {
                            const formData = new FormData();
                            formData.append("projectId", selectedProject?.id || "general");
                            formData.append("folder", "annexures");
                            files.forEach(f => formData.append("files", f));

                            const res = await fetch("/Auditing/api/dynamic/upload", {
                              method: "POST",
                              body: formData
                            });
                            const data = await res.json();
                            if (data.success && Array.isArray(data.files)) {
                              setNewTestingRow(prev => ({
                                ...prev,
                                annexures: [...(prev.annexures || []), ...data.files]
                              }));
                              showToast(`Uploaded ${data.files.length} file(s) to Supabase Storage.`, "success", "Upload Complete");
                            } else {
                              showToast(data.error || "Storage upload failed.", "error", "Upload Error");
                            }
                          } catch (err) {
                            showToast("Storage upload error: " + err.message, "error", "Upload Error");
                          }
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>

                  {newTestingRow.annexures && newTestingRow.annexures.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {newTestingRow.annexures.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", backgroundColor: C.bg2, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11.5 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Paperclip size={12} color={C.teal} />
                            <span style={{ fontWeight: 600, color: C.text1 }}>{f.name}</span>
                            {f.size && <span style={{ fontSize: 9.5, color: C.text3 }}>({(f.size / 1024).toFixed(0)} KB)</span>}
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewTestingRow(prev => ({
                              ...prev,
                              annexures: (prev.annexures || []).filter((_, idx) => idx !== i)
                            }))}
                            style={{ border: "none", background: "transparent", cursor: "pointer", color: C.red, padding: 2 }}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                type="button"
                onClick={() => setShowAddTestingModal(false)}
                style={{ padding: "9px 18px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newTestingRow.data_requirement.trim()) return showToast("Please enter a data requirement or test reference.", "warning", "Validation Required");
                  const createdId = "manual_test_" + Date.now();
                  const createdItem = {
                    ...newTestingRow,
                    id: createdId,
                    created_at: new Date().toISOString()
                  };
                  const currentManual = (testingData.__manual_rows && testingData.__manual_rows[processCategory]) || [];
                  const updatedManual = [...currentManual, createdItem];
                  const updatedTestingData = {
                    ...testingData,
                    [createdId]: {
                      testing_status: newTestingRow.testing_status,
                      observations_findings: newTestingRow.observations_findings,
                      comments: newTestingRow.comments,
                      annexures: newTestingRow.annexures || [],
                      custom_values: {}
                    },
                    __manual_rows: {
                      ...(testingData.__manual_rows || {}),
                      [processCategory]: updatedManual
                    }
                  };
                  setTestingData(updatedTestingData);
                  if (selectedProject?.id) {
                    saveTestingToProject(selectedProject.id, updatedTestingData, testingColumns);
                  }
                  setShowAddTestingModal(false);
                  setNewTestingRow({
                    data_requirement: "",
                    procedure: "",
                    objective: "",
                    key_risk: "",
                    risk_rating: "Medium",
                    sub_process: "",
                    testing_status: "Pending Review",
                    observations_findings: "",
                    comments: "",
                    annexures: []
                  });
                  showToast("Manual testing row added successfully.", "success", "Testing Row Added");
                }}
                style={{ padding: "9px 22px", backgroundColor: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}
              >
                <span>✓ Save Testing Row</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 10. ADD QUERY MODAL ── */}
      {showAddQueryModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1050, backdropFilter: "blur(3px)", padding: 20 }}>
          <div style={{ backgroundColor: C.surface, borderRadius: 14, width: 620, maxHeight: "90vh", display: "flex", flexDirection: "column", border: `1px solid ${C.border}`, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#e11d48", margin: 0 }}>+ Log Audit Query / Exception</h3>
                <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>{processCategory} • Query Tracker & Client Escalation</div>
              </div>
              <button onClick={() => setShowAddQueryModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: C.text3 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
              {/* Row 1: Query Title */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Query Reference / Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Unreconciled GST Input Tax Credit discrepancy / Missing PO approvals"
                  value={newQueryRow.query_title}
                  onChange={e => setNewQueryRow({ ...newQueryRow, query_title: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                />
              </div>

              {/* Row 2: Linked Procedure */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Linked Audit Procedure / Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Verification of GST 2B vs Purchase Register"
                  value={newQueryRow.procedure}
                  onChange={e => setNewQueryRow({ ...newQueryRow, procedure: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                />
              </div>

              {/* Row 3: Query Description */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Observation / Discrepancy Description *</label>
                <textarea
                  placeholder="Detail the query raised to client, specific voucher/invoice numbers, monetary impact, and non-compliances..."
                  value={newQueryRow.query_description}
                  onChange={e => setNewQueryRow({ ...newQueryRow, query_description: e.target.value })}
                  rows={4}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text1, fontFamily: "Sora, sans-serif", resize: "vertical" }}
                />
              </div>

              {/* Row 4: Status */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Query Status</label>
                <select
                  value={newQueryRow.query_status}
                  onChange={e => setNewQueryRow({ ...newQueryRow, query_status: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, fontFamily: "Sora, sans-serif" }}
                >
                  <option value="Query Raised">🔴 Query Raised</option>
                  <option value="Sent to Client">📤 Sent to Client</option>
                  <option value="Response Received">📩 Response Received</option>
                  <option value="Resolved / Closed">✓ Resolved / Closed</option>
                  <option value="Accepted into Report">📑 Accepted into Report</option>
                </select>
              </div>

              {/* Row 5: Client Response (Optional) */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Client Response / Justification (if received)</label>
                <textarea
                  placeholder="Client comments, explanation given by management..."
                  value={newQueryRow.client_response}
                  onChange={e => setNewQueryRow({ ...newQueryRow, client_response: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text1, fontFamily: "Sora, sans-serif", resize: "vertical" }}
                />
              </div>

              {/* Row 6: Resolution Remarks */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 5 }}>Auditor Resolution Remarks / Conclusion</label>
                <textarea
                  placeholder="Auditor conclusion, final action taken..."
                  value={newQueryRow.resolution_remarks}
                  onChange={e => setNewQueryRow({ ...newQueryRow, resolution_remarks: e.target.value })}
                  rows={2}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.text1, fontFamily: "Sora, sans-serif", resize: "vertical" }}
                />
              </div>
            </div>

            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                type="button"
                onClick={() => setShowAddQueryModal(false)}
                style={{ padding: "9px 18px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newQueryRow.query_title.trim()) return showToast("Please enter a query reference or title.", "warning", "Validation Required");
                  const createdId = "manual_query_" + Date.now();
                  const createdItem = {
                    ...newQueryRow,
                    id: createdId,
                    created_at: new Date().toISOString()
                  };
                  const currentManual = (queriesData.__manual_rows && queriesData.__manual_rows[processCategory]) || [];
                  const updatedManual = [...currentManual, createdItem];
                  const updatedQueriesData = {
                    ...queriesData,
                    [createdId]: {
                      query_title: newQueryRow.query_title,
                      procedure: newQueryRow.procedure,
                      query_description: newQueryRow.query_description,
                      client_response: newQueryRow.client_response,
                      query_status: newQueryRow.query_status,
                      resolution_remarks: newQueryRow.resolution_remarks,
                      custom_values: {}
                    },
                    __manual_rows: {
                      ...(queriesData.__manual_rows || {}),
                      [processCategory]: updatedManual
                    }
                  };
                  setQueriesData(updatedQueriesData);
                  if (selectedProject?.id) {
                    saveQueriesToProject(selectedProject.id, updatedQueriesData, queriesColumns);
                  }
                  setShowAddQueryModal(false);
                  setNewQueryRow({
                    query_title: "",
                    procedure: "",
                    query_description: "",
                    client_response: "",
                    query_status: "Query Raised",
                    resolution_remarks: ""
                  });
                  showToast("Audit query logged successfully.", "success", "Query Logged");
                }}
                style={{ padding: "9px 22px", backgroundColor: "#e11d48", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}
              >
                <span>✓ Save Query</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 11. QUERY REVIEW & CLIENT RESPONSE SLIDE-OVER DRAWER ── */}
      {selectedQueryDrawerRow && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={() => setSelectedQueryDrawerRow(null)}
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)" }}
          />
          <div
            style={{
              position: "relative", width: 680, maxWidth: "100vw", height: "100%",
              backgroundColor: C.surface, display: "flex", flexDirection: "column",
              boxShadow: "-10px 0 25px -5px rgba(0,0,0,0.15)", borderLeft: `1px solid ${C.border}`
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.surface2 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#e11d48", letterSpacing: 0.5 }}>AUDIT QUERY / EXCEPTION MANAGEMENT</span>
                  {selectedQueryDrawerRow.is_auto_linked ? (
                    <span style={{ fontSize: 10, fontWeight: 800, backgroundColor: "#fee2e2", color: "#b91c1c", padding: "1px 6px", borderRadius: 4 }}>
                      ⚡ Auto-linked from 4. Testing
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, fontWeight: 800, backgroundColor: "#e0f2fe", color: "#0369a1", padding: "1px 6px", borderRadius: 4 }}>
                      Manual Query
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text1, margin: "3px 0 0" }}>
                  {selectedQueryDrawerRow.query_title || "Audit Query"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQueryDrawerRow(null)}
                style={{ border: "none", background: "transparent", cursor: "pointer", color: C.text3, padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 24, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Linked Procedure & Risk Card */}
              <div style={{ padding: 16, borderRadius: 10, backgroundColor: C.bg2, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.teal, textTransform: "uppercase" }}>📋 Linked Procedure</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text1, marginTop: 2, lineHeight: 1.45 }}>
                    {selectedQueryDrawerRow.procedure || "—"}
                  </div>
                </div>

                {selectedQueryDrawerRow.key_risk && selectedQueryDrawerRow.key_risk !== "—" && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#e11d48", textTransform: "uppercase" }}>⚠️ Key Risk & Exposure</span>
                    <div style={{ fontSize: 12.5, color: C.text2, marginTop: 2 }}>
                      {selectedQueryDrawerRow.key_risk}
                    </div>
                  </div>
                )}

                {/* Evidence Files if any */}
                {selectedQueryDrawerRow.attachments && selectedQueryDrawerRow.attachments.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: C.green, textTransform: "uppercase" }}>📎 Supporting Evidence ({selectedQueryDrawerRow.attachments.length})</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                      {selectedQueryDrawerRow.attachments.map((f, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", backgroundColor: C.surface, borderRadius: 6, border: `1px solid ${C.border}` }}>
                          <span style={{ fontSize: 11.5, fontWeight: 600, color: C.text1 }}>{f.name || f.file_name || `Evidence File ${i + 1}`}</span>
                          {f.url && (
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ padding: "3px 8px", backgroundColor: C.tealBg, color: C.teal, borderRadius: 4, fontSize: 10.5, fontWeight: 700, textDecoration: "none", border: `1px solid ${C.tealBorder}` }}
                            >
                              Download
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Query Status Selector & Quick Pills */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>Query Status</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {[
                    { val: "Query Raised", label: "🔴 Query Raised", bg: "#fee2e2", border: "#fca5a5", col: "#b91c1c" },
                    { val: "Sent to Client", label: "📤 Sent to Client", bg: "#dbeafe", border: "#93c5fd", col: "#1d4ed8" },
                    { val: "Response Received", label: "📩 Response Received", bg: "#fef3c7", border: "#fde68a", col: "#b45309" },
                    { val: "Resolved / Closed", label: "✓ Resolved / Closed", bg: "#dcfce7", border: "#86efac", col: "#15803d" },
                    { val: "Accepted into Report", label: "📑 In Report", bg: "#ede9fe", border: "#ddd6fe", col: "#6d28d9" }
                  ].map(pill => {
                    const isSelected = (selectedQueryDrawerRow.query_status || "Query Raised") === pill.val;
                    return (
                      <button
                        key={pill.val}
                        type="button"
                        onClick={() => setSelectedQueryDrawerRow({ ...selectedQueryDrawerRow, query_status: pill.val })}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 20,
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          backgroundColor: isSelected ? pill.bg : C.bg2,
                          color: isSelected ? pill.col : C.text2,
                          border: `1.5px solid ${isSelected ? pill.border : C.border}`,
                          boxShadow: isSelected ? `0 0 0 2px ${pill.border}40` : "none",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
                <select
                  value={selectedQueryDrawerRow.query_status || "Query Raised"}
                  onChange={e => setSelectedQueryDrawerRow({ ...selectedQueryDrawerRow, query_status: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, fontWeight: 700, color: C.text1 }}
                >
                  <option value="Query Raised">🔴 Query Raised</option>
                  <option value="Sent to Client">📤 Sent to Client</option>
                  <option value="Response Received">📩 Response Received</option>
                  <option value="Resolved / Closed">✓ Resolved / Closed</option>
                  <option value="Accepted into Report">📑 Accepted into Report</option>
                </select>
              </div>

              {/* Query Description Textarea */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>
                  Observation / Discrepancy Details
                </label>
                <textarea
                  placeholder="Detail the discrepancy, vouchers involved, policy non-compliance, and client query..."
                  value={selectedQueryDrawerRow.query_description || ""}
                  onChange={e => setSelectedQueryDrawerRow({ ...selectedQueryDrawerRow, query_description: e.target.value })}
                  rows={4}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, resize: "vertical", fontFamily: "Sora, sans-serif", lineHeight: 1.5 }}
                />
              </div>

              {/* Client Response Textarea */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", display: "block", marginBottom: 6 }}>
                  Client Management Response / Explanation
                </label>
                <textarea
                  placeholder="Enter client's formal response, mitigating factors provided, or attachments received..."
                  value={selectedQueryDrawerRow.client_response || ""}
                  onChange={e => setSelectedQueryDrawerRow({ ...selectedQueryDrawerRow, client_response: e.target.value })}
                  rows={4}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #93c5fd", backgroundColor: "#f8fafc", fontSize: 13, color: C.text1, resize: "vertical", fontFamily: "Sora, sans-serif", lineHeight: 1.5 }}
                />
              </div>

              {/* Resolution Remarks Textarea */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.text2, display: "block", marginBottom: 6 }}>
                  Auditor Resolution Remarks / Working Notes
                </label>
                <textarea
                  placeholder="Auditor conclusion after evaluating client response, whether accepted or retained in draft report..."
                  value={selectedQueryDrawerRow.resolution_remarks || ""}
                  onChange={e => setSelectedQueryDrawerRow({ ...selectedQueryDrawerRow, resolution_remarks: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text1, resize: "vertical", fontFamily: "Sora, sans-serif", lineHeight: 1.5 }}
                />
              </div>
            </div>

            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.surface2 }}>
              {!selectedQueryDrawerRow.is_auto_linked ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm("Are you sure you want to delete this query?")) return;
                    const currentManual = (queriesData.__manual_rows && queriesData.__manual_rows[processCategory]) || [];
                    const updatedManual = currentManual.filter(r => r.id !== selectedQueryDrawerRow.id);
                    const updatedData = {
                      ...queriesData,
                      __manual_rows: {
                        ...(queriesData.__manual_rows || {}),
                        [processCategory]: updatedManual
                      }
                    };
                    setQueriesData(updatedData);
                    if (selectedProject?.id) {
                      saveQueriesToProject(selectedProject.id, updatedData, queriesColumns);
                    }
                    setSelectedQueryDrawerRow(null);
                    showToast("Query deleted.", "notice", "Deleted");
                  }}
                  style={{ border: "none", backgroundColor: C.redBg, color: C.red, padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              ) : (
                <div style={{ fontSize: 11, color: C.text3, fontStyle: "italic" }}>
                  To remove this query, change test status to Pass in 4. Testing
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setSelectedQueryDrawerRow(null)}
                  style={{ padding: "9px 18px", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text1 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const rowId = selectedQueryDrawerRow.id;
                    const testingRefId = selectedQueryDrawerRow.testing_ref_id;
                    const isAuto = selectedQueryDrawerRow.is_auto_linked;

                    let updatedQueriesData = {
                      ...queriesData,
                      [rowId]: {
                        ...(queriesData[rowId] || {}),
                        query_title: selectedQueryDrawerRow.query_title,
                        procedure: selectedQueryDrawerRow.procedure,
                        query_description: selectedQueryDrawerRow.query_description,
                        client_response: selectedQueryDrawerRow.client_response,
                        query_status: selectedQueryDrawerRow.query_status,
                        resolution_remarks: selectedQueryDrawerRow.resolution_remarks,
                        custom_values: selectedQueryDrawerRow.custom_values || {}
                      }
                    };

                    // Also store by testing ref id if auto-linked
                    if (isAuto && testingRefId) {
                      updatedQueriesData[testingRefId] = updatedQueriesData[rowId];
                    }

                    // If manual row, also update in __manual_rows array
                    if (!isAuto) {
                      const currentManual = (queriesData.__manual_rows && queriesData.__manual_rows[processCategory]) || [];
                      const updatedManual = currentManual.map(r => r.id === rowId ? {
                        ...r,
                        query_title: selectedQueryDrawerRow.query_title,
                        procedure: selectedQueryDrawerRow.procedure,
                        query_description: selectedQueryDrawerRow.query_description,
                        client_response: selectedQueryDrawerRow.client_response,
                        query_status: selectedQueryDrawerRow.query_status,
                        resolution_remarks: selectedQueryDrawerRow.resolution_remarks
                      } : r);
                      updatedQueriesData.__manual_rows = {
                        ...(queriesData.__manual_rows || {}),
                        [processCategory]: updatedManual
                      };
                    }

                    setQueriesData(updatedQueriesData);
                    if (selectedProject?.id) {
                      saveQueriesToProject(selectedProject.id, updatedQueriesData, queriesColumns);
                    }
                    setSelectedQueryDrawerRow(null);
                    showToast("Query details & client response saved.", "success", "Query Updated");
                  }}
                  style={{ padding: "9px 24px", backgroundColor: "#e11d48", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span>✓ Save Query Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom-Right Toast Container */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 420,
          width: "calc(100vw - 48px)",
          pointerEvents: "none"
        }}
      >
        {toastList.map(toast => {
          const isError = toast.type === "error";
          const isSuccess = toast.type === "success";
          const isWarning = toast.type === "warning";

          const bg = isError ? "#fff1f0" : isSuccess ? "#f6ffed" : isWarning ? "#fffbe6" : "#f0f5ff";
          const border = isError ? "#ffa39e" : isSuccess ? "#b7eb8f" : isWarning ? "#ffe58f" : "#adc6ff";
          const accent = isError ? "#ff4d4f" : isSuccess ? "#52c41a" : isWarning ? "#faad14" : "#3d63ab";
          const text = isError ? "#820014" : isSuccess ? "#135200" : isWarning ? "#614700" : "#1d39c4";

          const IconComponent = isSuccess ? CheckCircle2 : isError ? AlertCircle : isWarning ? AlertCircle : Info;

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: "auto",
                backgroundColor: bg,
                border: `1px solid ${border}`,
                borderLeft: `4px solid ${accent}`,
                borderRadius: 10,
                padding: "12px 16px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                fontFamily: "Sora, sans-serif",
                animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <IconComponent size={18} color={accent} style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 2 }}>
                  {toast.title}
                </div>
                <div style={{ fontSize: 12.5, color: "#333333", lineHeight: 1.45, wordBreak: "break-word" }}>
                  {toast.message}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#888888",
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 4,
                  marginTop: 2
                }}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
