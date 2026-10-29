"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Building2,
  FileText,
  UploadCloud,
  Trash2,
  Edit3,
  Plus,
  Search,
  ArrowLeft,
  File,
  X,
  AlertCircle,
  DollarSign,
  GraduationCap,
  Save,
  Check,
  CornerDownRight,
} from "lucide-react";

// Apple-inspired Color Tokens & Styles
const C = {
  bg: "#F5F5F7",
  surface: "#FFFFFF",
  surfaceGlass: "rgba(255, 255, 255, 0.82)",
  surfaceGlassSubtle: "rgba(255, 255, 255, 0.65)",
  border: "#D2D2D7",
  borderLight: "rgba(210, 210, 215, 0.6)",
  borderSubtle: "#E5E5EA",
  text: "#1D1D1F",
  textSecondary: "#424245",
  textMuted: "#86868B",
  blue: "#0071E3",
  blueBg: "rgba(0, 113, 227, 0.08)",
  blueBorder: "rgba(0, 113, 227, 0.25)",
  green: "#34C759",
  greenBg: "rgba(52, 199, 89, 0.12)",
  greenBorder: "rgba(52, 199, 89, 0.25)",
  amber: "#FF9500",
  amberBg: "rgba(255, 149, 0, 0.12)",
  amberBorder: "rgba(255, 149, 0, 0.25)",
  red: "#FF3B30",
  redBg: "rgba(255, 59, 48, 0.12)",
  redBorder: "rgba(255, 59, 48, 0.25)",
  purple: "#AF52DE",
  purpleBg: "rgba(175, 82, 222, 0.12)",
  purpleBorder: "rgba(175, 82, 222, 0.25)",
};

const glassCardStyle = {
  background: C.surfaceGlass,
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  border: `1px solid ${C.borderLight}`,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.9)",
  borderRadius: "18px",
};

export default function StaticTrackerWorkspace({ onBackToTemplates, showToast }) {
  const [trackers, setTrackers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrackerId, setSelectedTrackerId] = useState(null);
  const [activeTab, setActiveTab] = useState("ngo"); // "ngo" | "student" | "financials" | "details"
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "answered" | "pending" | "with_docs"
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingTracker, setEditingTracker] = useState(null);
  const [uploadingFor, setUploadingFor] = useState(null); // { questionId, sectionType }
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // New/Edit Company Form State
  const [companyForm, setCompanyForm] = useState({
    company_name: "",
    csr_donor: "",
    project_name: "",
    status: "in_progress",
    ngo_address: "",
    csr_grant_amount: "",
    reported_beneficiaries: "",
    project_objective: "",
    visit_objective: "",
  });

  const fileInputRef = useRef(null);

  const fetchTrackers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/Auditing/api/static-tracker");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load static trackers");
      setTrackers(data.trackers || []);
      if (data.trackers?.length > 0 && !selectedTrackerId) {
        setSelectedTrackerId(data.trackers[0].id);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedTrackerId]);

  // Load trackers on mount
  useEffect(() => {
    fetchTrackers();
  }, [fetchTrackers]);

  const currentTracker = useMemo(() => {
    return trackers.find((t) => t.id === selectedTrackerId) || null;
  }, [trackers, selectedTrackerId]);

  // Handle Explicit Save Tracker
  const handleSaveTracker = async () => {
    if (!currentTracker) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/Auditing/api/static-tracker/${currentTracker.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: currentTracker.company_name,
          csr_donor: currentTracker.csr_donor,
          project_name: currentTracker.project_name,
          status: currentTracker.status,
          company_details: currentTracker.company_details,
          expense_data: currentTracker.expense_data,
          invoice_data: currentTracker.invoice_data,
          ngo_questions: currentTracker.ngo_questions,
          student_questions: currentTracker.student_questions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save tracker");

      setTrackers((prev) =>
        prev.map((t) => (t.id === currentTracker.id ? data.tracker : t))
      );
      setHasUnsavedChanges(false);
      if (showToast) showToast("success", "Tracker & all questions saved successfully");
    } catch (err) {
      console.error(err);
      if (showToast) showToast("error", err.message || "Failed to save tracker");
    } finally {
      setIsSaving(false);
    }
  };

  // Modify question list locally
  const updateQuestionsList = (sectionType, updaterFn) => {
    if (!currentTracker) return;
    const questionsKey = sectionType === "ngo" ? "ngo_questions" : "student_questions";
    const currentList = currentTracker[questionsKey] || [];
    const updatedList = updaterFn(currentList);

    setTrackers((prev) =>
      prev.map((t) =>
        t.id === currentTracker.id ? { ...t, [questionsKey]: updatedList } : t
      )
    );
    setHasUnsavedChanges(true);
  };

  // Question Title Edit
  const handleQuestionTitleChange = (sectionType, questionId, newTitle) => {
    updateQuestionsList(sectionType, (list) =>
      list.map((q) => (q.id === questionId ? { ...q, question: newTitle } : q))
    );
  };

  // Main Question Answer Change
  const handleMainAnswerChange = (sectionType, questionId, newAnswer) => {
    updateQuestionsList(sectionType, (list) =>
      list.map((q) => (q.id === questionId ? { ...q, answer: newAnswer } : q))
    );
  };

  // Subquestion Title Edit
  const handleSubQuestionTitleChange = (sectionType, parentId, subId, newTitle) => {
    updateQuestionsList(sectionType, (list) =>
      list.map((q) => {
        if (q.id === parentId) {
          const subs = (q.sub_questions || []).map((sub) =>
            sub.id === subId ? { ...sub, question: newTitle } : sub
          );
          return { ...q, sub_questions: subs };
        }
        return q;
      })
    );
  };

  // Subquestion Answer Edit
  const handleSubAnswerChange = (sectionType, parentId, subId, newAnswer) => {
    updateQuestionsList(sectionType, (list) =>
      list.map((q) => {
        if (q.id === parentId) {
          const subs = (q.sub_questions || []).map((sub) =>
            sub.id === subId ? { ...sub, answer: newAnswer } : sub
          );
          return { ...q, sub_questions: subs };
        }
        return q;
      })
    );
  };

  // Add new main question / section
  const handleAddMainQuestion = (sectionType) => {
    updateQuestionsList(sectionType, (list) => {
      const newId = `${sectionType}_q_${Date.now()}`;
      const newQ = {
        id: newId,
        code: `Section ${list.length + 1}`,
        question: "New Assessment Section / Main Question",
        answer: "",
        documents: [],
        sub_questions: [],
      };
      return [...list, newQ];
    });
  };

  // Add subquestion under a main question
  const handleAddSubQuestion = (sectionType, parentId) => {
    updateQuestionsList(sectionType, (list) =>
      list.map((q) => {
        if (q.id === parentId) {
          const subs = q.sub_questions || [];
          const parentNum = q.code?.replace(/\D/g, "") || "1";
          const newSubId = `sub_${Date.now()}`;
          const newSub = {
            id: newSubId,
            code: `${parentNum}.${subs.length + 1}`,
            question: "New specific sub-question prompt...",
            answer: "",
            documents: [],
          };
          return { ...q, sub_questions: [...subs, newSub] };
        }
        return q;
      })
    );
  };

  // Delete main question
  const handleDeleteMainQuestion = (sectionType, questionId) => {
    if (!confirm("Are you sure you want to delete this question and all its sub-questions?")) return;
    updateQuestionsList(sectionType, (list) => list.filter((q) => q.id !== questionId));
  };

  // Delete subquestion
  const handleDeleteSubQuestion = (sectionType, parentId, subId) => {
    if (!confirm("Delete this sub-question?")) return;
    updateQuestionsList(sectionType, (list) =>
      list.map((q) => {
        if (q.id === parentId) {
          return {
            ...q,
            sub_questions: (q.sub_questions || []).filter((sub) => sub.id !== subId),
          };
        }
        return q;
      })
    );
  };

  // Document Upload Handlers
  const triggerFileUpload = (sectionType, questionId) => {
    setUploadingFor({ sectionType, questionId });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !uploadingFor || !currentTracker) return;

    const { sectionType, questionId } = uploadingFor;
    const formData = new FormData();
    formData.append("sectionType", sectionType);
    formData.append("questionId", questionId);

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) {
        alert(`File "${files[i].name}" exceeds the 5 MB limit.`);
        return;
      }
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch(
        `/Auditing/api/static-tracker/${currentTracker.id}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setTrackers((prev) =>
        prev.map((t) => (t.id === currentTracker.id ? data.tracker : t))
      );
      if (showToast) showToast("success", "Document uploaded successfully");
    } catch (err) {
      console.error(err);
      if (showToast) showToast("error", err.message || "Failed to upload document");
    } finally {
      setUploadingFor(null);
    }
  };

  // Remove Document Handler
  const handleRemoveDocument = async (sectionType, questionId, documentId) => {
    if (!confirm("Remove this document?")) return;
    try {
      const res = await fetch(
        `/Auditing/api/static-tracker/${currentTracker.id}/upload`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionType, questionId, documentId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      setTrackers((prev) =>
        prev.map((t) => (t.id === currentTracker.id ? data.tracker : t))
      );
      if (showToast) showToast("success", "Document removed");
    } catch (err) {
      console.error(err);
      if (showToast) showToast("error", err.message || "Failed to delete document");
    }
  };

  // Create / Update Company Modal
  const openCreateModal = () => {
    setEditingTracker(null);
    setCompanyForm({
      company_name: "",
      csr_donor: "",
      project_name: "",
      status: "in_progress",
      ngo_address: "",
      csr_grant_amount: "",
      reported_beneficiaries: "",
      project_objective: "",
      visit_objective: "",
    });
    setIsCompanyModalOpen(true);
  };

  const openEditModal = (tracker) => {
    setEditingTracker(tracker);
    const details = tracker.company_details || {};
    setCompanyForm({
      company_name: tracker.company_name || "",
      csr_donor: tracker.csr_donor || "",
      project_name: tracker.project_name || "",
      status: tracker.status || "in_progress",
      ngo_address: details.ngo_address || "",
      csr_grant_amount: details.csr_grant_amount || "",
      reported_beneficiaries: details.reported_beneficiaries || "",
      project_objective: details.project_objective || "",
      visit_objective: details.visit_objective || "",
    });
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    if (!companyForm.company_name.trim()) {
      alert("Company Name is required.");
      return;
    }

    const payload = {
      company_name: companyForm.company_name.trim(),
      csr_donor: companyForm.csr_donor.trim(),
      project_name: companyForm.project_name.trim(),
      status: companyForm.status,
      company_details: {
        ...(editingTracker?.company_details || {}),
        ngo_address: companyForm.ngo_address.trim(),
        csr_grant_amount: companyForm.csr_grant_amount ? Number(companyForm.csr_grant_amount) : null,
        reported_beneficiaries: companyForm.reported_beneficiaries.trim(),
        project_objective: companyForm.project_objective.trim(),
        visit_objective: companyForm.visit_objective.trim(),
      },
    };

    try {
      if (editingTracker) {
        const res = await fetch(`/Auditing/api/static-tracker/${editingTracker.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Update failed");
        setTrackers((prev) =>
          prev.map((t) => (t.id === editingTracker.id ? data.tracker : t))
        );
        if (showToast) showToast("success", "Company updated");
      } else {
        payload.ngo_questions = [];
        payload.student_questions = [];
        payload.expense_data = [];
        payload.invoice_data = [];

        const res = await fetch("/Auditing/api/static-tracker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Creation failed");
        setTrackers((prev) => [...prev, data.tracker]);
        setSelectedTrackerId(data.tracker.id);
        if (showToast) showToast("success", "Company created successfully");
      }
      setIsCompanyModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save company");
    }
  };

  // Delete Company Tracker
  const handleDeleteCompany = async (id, name) => {
    if (!confirm(`Are you sure you want to delete the tracker for "${name}"?`)) return;
    try {
      const res = await fetch(`/Auditing/api/static-tracker/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setTrackers((prev) => prev.filter((t) => t.id !== id));
      if (selectedTrackerId === id) {
        const remaining = trackers.filter((t) => t.id !== id);
        setSelectedTrackerId(remaining[0]?.id || null);
      }
      if (showToast) showToast("success", "Company tracker deleted");
    } catch (err) {
      console.error(err);
      if (showToast) showToast("error", err.message || "Delete failed");
    }
  };

  // Metrics calculations (counting all questions + subquestions)
  const metrics = useMemo(() => {
    let totalQuestions = 0;
    let answeredQuestions = 0;

    const countItems = (list = []) => {
      list.forEach((q) => {
        if (q.sub_questions && q.sub_questions.length > 0) {
          q.sub_questions.forEach((sub) => {
            totalQuestions++;
            if (sub.answer && sub.answer.trim().length > 0) answeredQuestions++;
          });
        } else {
          totalQuestions++;
          if (q.answer && q.answer.trim().length > 0) answeredQuestions++;
        }
      });
    };

    if (currentTracker) {
      countItems(currentTracker.ngo_questions);
      countItems(currentTracker.student_questions);
    }

    const percent = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
    return { totalQuestions, answeredQuestions, percent };
  }, [currentTracker]);

  // Questions filtering based on active tab, search, and filter status
  const currentQuestions = useMemo(() => {
    if (!currentTracker) return [];
    const list =
      activeTab === "ngo"
        ? currentTracker.ngo_questions || []
        : currentTracker.student_questions || [];

    return list.filter((item) => {
      const qText = (item.question || "").toLowerCase();
      const codeText = (item.code || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      // Check subquestions matching
      const hasMatchingSub = (item.sub_questions || []).some(
        (s) =>
          s.question?.toLowerCase().includes(query) ||
          s.answer?.toLowerCase().includes(query)
      );

      const matchesSearch = !query || qText.includes(query) || codeText.includes(query) || hasMatchingSub;
      if (!matchesSearch) return false;

      // Filter status logic
      if (filterStatus === "all") return true;

      const hasSubs = item.sub_questions && item.sub_questions.length > 0;
      if (hasSubs) {
        if (filterStatus === "answered") {
          return item.sub_questions.some((s) => s.answer?.trim().length > 0);
        }
        if (filterStatus === "pending") {
          return item.sub_questions.some((s) => !s.answer?.trim());
        }
        if (filterStatus === "with_docs") {
          return item.sub_questions.some((s) => s.documents?.length > 0);
        }
      } else {
        const isAns = item.answer && item.answer.trim().length > 0;
        const hasDoc = item.documents && item.documents.length > 0;
        if (filterStatus === "answered") return isAns;
        if (filterStatus === "pending") return !isAns;
        if (filterStatus === "with_docs") return hasDoc;
      }

      return true;
    });
  }, [currentTracker, activeTab, searchQuery, filterStatus]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Hidden file input for document upload */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />

      {/* ─── TOP APP BAR ────────────────────────────────────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          background: C.surfaceGlass,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: `1px solid ${C.borderLight}`,
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {onBackToTemplates && (
            <button
              onClick={onBackToTemplates}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                borderRadius: 10,
                border: `1px solid ${C.borderSubtle}`,
                background: "#FFF",
                color: C.textSecondary,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.border)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.borderSubtle)}
            >
              <ArrowLeft size={14} />
              <span>Templates</span>
            </button>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: 8,
                background: C.blueBg,
                color: C.blue,
              }}
            >
              <Building2 size={16} />
            </span>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", margin: 0 }}>
                Static Audit Tracker
              </h1>
              <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>
                Universe One • CSR Assessment & Beneficiary Verification
              </p>
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Explicit Save Tracker Button */}
          {currentTracker && (
            <button
              onClick={handleSaveTracker}
              disabled={isSaving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 10,
                background: hasUnsavedChanges ? C.blue : "#FFFFFF",
                color: hasUnsavedChanges ? "#FFFFFF" : C.textSecondary,
                border: hasUnsavedChanges ? "none" : `1px solid ${C.borderSubtle}`,
                fontSize: 13,
                fontWeight: 600,
                cursor: isSaving ? "not-allowed" : "pointer",
                boxShadow: hasUnsavedChanges ? "0 2px 10px rgba(0, 113, 227, 0.28)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              {isSaving ? (
                <>
                  <Check size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={14} color={hasUnsavedChanges ? "#FFFFFF" : C.blue} />
                  <span>{hasUnsavedChanges ? "Save Changes *" : "Saved"}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={openCreateModal}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 10,
              background: C.blue,
              color: "#FFF",
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0, 113, 227, 0.25)",
            }}
          >
            <Plus size={15} />
            <span>Add Company</span>
          </button>
        </div>
      </header>

      {/* ─── MAIN WORKSPACE BODY ────────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ─── LEFT SIDEBAR: COMPANIES LIST (CRUD) ────────────────────── */}
        <aside
          style={{
            width: 310,
            background: C.surfaceGlassSubtle,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRight: `1px solid ${C.borderLight}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Companies Header */}
          <div
            style={{
              padding: "16px 18px",
              borderBottom: `1px solid ${C.borderLight}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Companies ({trackers.length})
              </span>
              <p style={{ fontSize: 11, color: C.textSecondary, margin: "2px 0 0 0" }}>
                Select a company to view tracker
              </p>
            </div>
            <button
              onClick={openCreateModal}
              title="Add New Company"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: `1px solid ${C.borderSubtle}`,
                background: "#FFF",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.blue,
                cursor: "pointer",
              }}
            >
              <Plus size={15} />
            </button>
          </div>

          {/* Companies Scrollable List */}
          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {loading && (
              <div style={{ padding: 24, textAlign: "center", color: C.textMuted, fontSize: 13 }}>
                Loading companies...
              </div>
            )}

            {!loading && trackers.length === 0 && (
              <div style={{ padding: 28, textAlign: "center", color: C.textMuted, fontSize: 13 }}>
                <Building2 size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                <p style={{ margin: "0 0 10px 0" }}>No companies found.</p>
                <button
                  onClick={openCreateModal}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: C.blueBg,
                    color: C.blue,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Create Company
                </button>
              </div>
            )}

            {trackers.map((t) => {
              const isSelected = t.id === selectedTrackerId;
              let compTotal = 0;
              let compDone = 0;

              const countT = (list = []) => {
                list.forEach((q) => {
                  if (q.sub_questions && q.sub_questions.length > 0) {
                    q.sub_questions.forEach((s) => {
                      compTotal++;
                      if (s.answer && s.answer.trim().length > 0) compDone++;
                    });
                  } else {
                    compTotal++;
                    if (q.answer && q.answer.trim().length > 0) compDone++;
                  }
                });
              };
              countT(t.ngo_questions);
              countT(t.student_questions);

              const percent = compTotal > 0 ? Math.round((compDone / compTotal) * 100) : 0;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTrackerId(t.id)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.45)",
                    border: isSelected ? `1.5px solid ${C.blue}` : `1px solid ${C.borderLight}`,
                    boxShadow: isSelected
                      ? "0 4px 16px rgba(0, 113, 227, 0.08), 0 1px 3px rgba(0,0,0,0.02)"
                      : "0 1px 2px rgba(0,0,0,0.02)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0, lineHeight: 1.3 }}>
                        {t.company_name}
                      </h3>
                      {t.project_name && (
                        <p style={{ fontSize: 11, color: C.blue, fontWeight: 500, margin: "2px 0 0 0" }}>
                          {t.project_name}
                        </p>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(t);
                        }}
                        title="Edit Company Details"
                        style={{
                          background: "none",
                          border: "none",
                          color: C.textMuted,
                          cursor: "pointer",
                          padding: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCompany(t.id, t.company_name);
                        }}
                        title="Delete Company"
                        style={{
                          background: "none",
                          border: "none",
                          color: C.textMuted,
                          cursor: "pointer",
                          padding: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {t.csr_donor && (
                    <p style={{ fontSize: 11, color: C.textMuted, margin: "6px 0 0 0" }}>
                      Donor: <span style={{ color: C.textSecondary }}>{t.csr_donor}</span>
                    </p>
                  )}

                  {/* Progress indicator */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
                      <span>Progress</span>
                      <span style={{ fontWeight: 600, color: percent === 100 ? C.green : C.text }}>
                        {compDone}/{compTotal} ({percent}%)
                      </span>
                    </div>
                    <div
                      style={{
                        height: 5,
                        width: "100%",
                        background: "#E5E5EA",
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${percent}%`,
                          background: percent === 100 ? C.green : C.blue,
                          borderRadius: 99,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Metrics Bar at bottom of sidebar */}
          <div
            style={{
              padding: "14px 18px",
              borderTop: `1px solid ${C.borderLight}`,
              background: C.surfaceGlass,
              fontSize: 11,
              color: C.textMuted,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Current Company Progress</span>
            <span style={{ fontWeight: 600, color: C.text }}>
              {metrics.answeredQuestions} / {metrics.totalQuestions} ({metrics.percent}%)
            </span>
          </div>
        </aside>

        {/* ─── RIGHT MAIN VIEW: TRACKER WORKSPACE ────────────────────── */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: C.bg,
          }}
        >
          {error && (
            <div
              style={{
                margin: 16,
                padding: "12px 16px",
                borderRadius: 12,
                background: C.redBg,
                border: `1px solid ${C.redBorder}`,
                color: C.red,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {!currentTracker ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.textMuted,
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Building2 size={42} style={{ opacity: 0.3 }} />
              <p style={{ fontSize: 15, margin: 0 }}>Select or create a company to view questions and answers</p>
            </div>
          ) : (
            <>
              {/* Tracker Top Bar with Company Header & Tab Bar */}
              <div
                style={{
                  padding: "18px 28px 0 28px",
                  background: C.surfaceGlass,
                  borderBottom: `1px solid ${C.borderLight}`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, color: C.text }}>
                        {currentTracker.company_name}
                      </h2>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 99,
                          background: currentTracker.status === "completed" ? C.greenBg : C.blueBg,
                          color: currentTracker.status === "completed" ? C.green : C.blue,
                          border: `1px solid ${currentTracker.status === "completed" ? C.greenBorder : C.blueBorder}`,
                          textTransform: "capitalize",
                        }}
                      >
                        {currentTracker.status?.replace("_", " ")}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6, fontSize: 12, color: C.textSecondary }}>
                      {currentTracker.project_name && (
                        <span>
                          <strong>Project:</strong> {currentTracker.project_name}
                        </span>
                      )}
                      {currentTracker.csr_donor && (
                        <span>
                          <strong>Donor:</strong> {currentTracker.csr_donor}
                        </span>
                      )}
                      {currentTracker.company_details?.financial_year && (
                        <span>
                          <strong>Period:</strong> {currentTracker.company_details.financial_year}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => openEditModal(currentTracker)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 12px",
                        borderRadius: 10,
                        border: `1px solid ${C.borderSubtle}`,
                        background: "#FFF",
                        color: C.textSecondary,
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      <Edit3 size={13} />
                      <span>Edit Details</span>
                    </button>
                  </div>
                </div>

                {/* Apple-style Glass Tabs */}
                <div style={{ display: "flex", gap: 24 }}>
                  {[
                    { id: "ngo", label: "NGO Questions", icon: FileText, count: (currentTracker.ngo_questions || []).length },
                    { id: "student", label: "Student Questions", icon: GraduationCap, count: (currentTracker.student_questions || []).length },
                    { id: "financials", label: "Financials & Expenses", icon: DollarSign },
                    { id: "details", label: "Company Overview", icon: Building2 },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 4px 12px 4px",
                          border: "none",
                          borderBottom: isActive ? `2px solid ${C.blue}` : "2px solid transparent",
                          background: "transparent",
                          color: isActive ? C.blue : C.textSecondary,
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Icon size={15} />
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span
                            style={{
                              fontSize: 11,
                              padding: "1px 6px",
                              borderRadius: 99,
                              background: isActive ? C.blueBg : "#E5E5EA",
                              color: isActive ? C.blue : C.textMuted,
                              fontWeight: 600,
                            }}
                          >
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content Container */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
                {/* ─── TAB 1 & 2: NGO & STUDENT QUESTIONS ───────────────────────── */}
                {(activeTab === "ngo" || activeTab === "student") && (
                  <div>
                    {/* Filter, Search Bar & Add Main Question Button */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 16,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, maxWidth: 450 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            borderRadius: 10,
                            background: "#FFF",
                            border: `1px solid ${C.borderSubtle}`,
                            flex: 1,
                          }}
                        >
                          <Search size={14} color={C.textMuted} />
                          <input
                            type="text"
                            placeholder="Search questions or answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                              border: "none",
                              outline: "none",
                              fontSize: 13,
                              color: C.text,
                              width: "100%",
                              background: "transparent",
                            }}
                          />
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery("")}
                              style={{ border: "none", background: "none", cursor: "pointer", color: C.textMuted, padding: 0 }}
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>

                        {/* Filter pills */}
                        <div style={{ display: "flex", gap: 6 }}>
                          {[
                            { id: "all", label: "All" },
                            { id: "answered", label: "Answered" },
                            { id: "pending", label: "Pending" },
                            { id: "with_docs", label: "With Docs" },
                          ].map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setFilterStatus(f.id)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 8,
                                border: filterStatus === f.id ? `1px solid ${C.blueBorder}` : `1px solid ${C.borderSubtle}`,
                                background: filterStatus === f.id ? C.blueBg : "#FFF",
                                color: filterStatus === f.id ? C.blue : C.textSecondary,
                                fontSize: 11,
                                fontWeight: 500,
                                cursor: "pointer",
                              }}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddMainQuestion(activeTab)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "8px 14px",
                          borderRadius: 10,
                          background: "#FFF",
                          border: `1px solid ${C.borderSubtle}`,
                          color: C.text,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                        }}
                      >
                        <Plus size={14} color={C.blue} />
                        <span>Add Section / Question</span>
                      </button>
                    </div>

                    {/* Question Cards List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {currentQuestions.length === 0 ? (
                        <div
                          style={{
                            padding: 40,
                            textAlign: "center",
                            background: C.surfaceGlass,
                            borderRadius: 16,
                            border: `1px solid ${C.borderLight}`,
                            color: C.textMuted,
                          }}
                        >
                          <FileText size={32} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
                          <p style={{ margin: 0, fontSize: 13 }}>No questions found matching your filter</p>
                        </div>
                      ) : (
                        currentQuestions.map((mainQ, idx) => {
                          const hasSubQuestions = mainQ.sub_questions && mainQ.sub_questions.length > 0;
                          const mainDocs = mainQ.documents || [];

                          return (
                            <div
                              key={mainQ.id}
                              style={{
                                ...glassCardStyle,
                                padding: "22px 24px",
                                transition: "all 0.15s ease",
                              }}
                            >
                              {/* ── Main Question Header ───────────────────────── */}
                              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1 }}>
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: "4px 9px",
                                      borderRadius: 8,
                                      background: C.blueBg,
                                      color: C.blue,
                                      fontSize: 11,
                                      fontWeight: 700,
                                      border: `1px solid ${C.blueBorder}`,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {mainQ.code || `Section ${idx + 1}`}
                                  </span>

                                  <div style={{ flex: 1 }}>
                                    {/* Editable Main Question Title */}
                                    <textarea
                                      rows={2}
                                      value={mainQ.question || ""}
                                      onChange={(e) => handleQuestionTitleChange(activeTab, mainQ.id, e.target.value)}
                                      placeholder="Main question or section title..."
                                      style={{
                                        width: "100%",
                                        padding: "6px 10px",
                                        borderRadius: 8,
                                        border: `1px solid transparent`,
                                        background: "transparent",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: C.text,
                                        lineHeight: 1.35,
                                        outline: "none",
                                        boxSizing: "border-box",
                                        fontFamily: "inherit",
                                        resize: "vertical",
                                        transition: "all 0.15s ease",
                                      }}
                                      onFocus={(e) => {
                                        e.target.style.background = "#FFF";
                                        e.target.style.borderColor = C.blue;
                                      }}
                                      onBlur={(e) => {
                                        e.target.style.background = "transparent";
                                        e.target.style.borderColor = "transparent";
                                      }}
                                    />

                                    {/* Verification note if present */}
                                    {mainQ.documents_to_verify && (
                                      <p style={{ fontSize: 11, color: C.purple, fontWeight: 500, margin: "2px 0 0 10px" }}>
                                        📌 Verification check: {mainQ.documents_to_verify}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <button
                                    onClick={() => handleAddSubQuestion(activeTab, mainQ.id)}
                                    title="Add Sub-question under this section"
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 4,
                                      padding: "5px 10px",
                                      borderRadius: 8,
                                      background: "#FFF",
                                      border: `1px solid ${C.borderSubtle}`,
                                      color: C.blue,
                                      fontSize: 11,
                                      fontWeight: 600,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <Plus size={12} />
                                    <span>Add Sub-question</span>
                                  </button>

                                  <button
                                    onClick={() => handleDeleteMainQuestion(activeTab, mainQ.id)}
                                    title="Delete main section"
                                    style={{
                                      border: "none",
                                      background: "none",
                                      color: C.textMuted,
                                      cursor: "pointer",
                                      padding: 4,
                                      borderRadius: 6,
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* ── CASE 1: MAIN QUESTION HAS NO SUBQUESTIONS (Standalone Question) ── */}
                              {!hasSubQuestions && (
                                <div style={{ marginTop: 14 }}>
                                  <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, display: "block", marginBottom: 6 }}>
                                    Response / Assessment Answer:
                                  </label>
                                  <textarea
                                    rows={3}
                                    placeholder="Type answer, observation or feedback here..."
                                    value={mainQ.answer || ""}
                                    onChange={(e) => handleMainAnswerChange(activeTab, mainQ.id, e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "10px 14px",
                                      borderRadius: 12,
                                      border: `1px solid ${C.borderSubtle}`,
                                      background: "#FFFFFF",
                                      fontSize: 13,
                                      color: C.text,
                                      lineHeight: 1.45,
                                      outline: "none",
                                      boxSizing: "border-box",
                                      fontFamily: "inherit",
                                      resize: "vertical",
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = C.blue)}
                                    onBlur={(e) => (e.target.style.borderColor = C.borderSubtle)}
                                  />

                                  {/* Document Upload for Standalone Question */}
                                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                                      {mainDocs.map((doc) => (
                                        <div
                                          key={doc.id}
                                          style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 6,
                                            padding: "4px 8px",
                                            borderRadius: 8,
                                            background: "#FFF",
                                            border: `1px solid ${C.borderSubtle}`,
                                            fontSize: 11,
                                          }}
                                        >
                                          <File size={12} color={C.blue} />
                                          <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ color: C.blue, textDecoration: "none", fontWeight: 500, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                          >
                                            {doc.name || doc.file_name}
                                          </a>
                                          <button
                                            onClick={() => handleRemoveDocument(activeTab, mainQ.id, doc.id)}
                                            style={{ border: "none", background: "none", cursor: "pointer", color: C.textMuted, padding: 2 }}
                                          >
                                            <X size={11} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>

                                    <button
                                      onClick={() => triggerFileUpload(activeTab, mainQ.id)}
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5,
                                        padding: "5px 10px",
                                        borderRadius: 8,
                                        background: C.blueBg,
                                        color: C.blue,
                                        border: `1px solid ${C.blueBorder}`,
                                        fontSize: 11,
                                        fontWeight: 500,
                                        cursor: "pointer",
                                      }}
                                    >
                                      <UploadCloud size={13} />
                                      <span>Upload Document (≤ 5MB)</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* ── CASE 2: MAIN QUESTION HAS SUBQUESTIONS ── */}
                              {hasSubQuestions && (
                                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                                  {mainQ.sub_questions.map((sub, sIdx) => {
                                    const subDocs = sub.documents || [];
                                    const isSubAnswered = sub.answer && sub.answer.trim().length > 0;

                                    return (
                                      <div
                                        key={sub.id}
                                        style={{
                                          padding: "16px 18px",
                                          borderRadius: 14,
                                          background: "rgba(255, 255, 255, 0.7)",
                                          border: `1px solid ${isSubAnswered ? C.greenBorder : C.borderLight}`,
                                          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                                        }}
                                      >
                                        {/* Subquestion Header */}
                                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1 }}>
                                            <span
                                              style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                padding: "2px 7px",
                                                borderRadius: 6,
                                                background: isSubAnswered ? C.greenBg : "#F2F2F7",
                                                color: isSubAnswered ? C.green : C.textSecondary,
                                                fontSize: 11,
                                                fontWeight: 700,
                                                border: `1px solid ${isSubAnswered ? C.greenBorder : C.borderSubtle}`,
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              {sub.code || `${idx + 1}.${sIdx + 1}`}
                                            </span>

                                            {/* Editable Subquestion Prompt */}
                                            <textarea
                                              rows={2}
                                              value={sub.question || ""}
                                              onChange={(e) =>
                                                handleSubQuestionTitleChange(
                                                  activeTab,
                                                  mainQ.id,
                                                  sub.id,
                                                  e.target.value
                                                )
                                              }
                                              placeholder="Sub-question prompt..."
                                              style={{
                                                width: "100%",
                                                padding: "4px 8px",
                                                borderRadius: 6,
                                                border: "1px solid transparent",
                                                background: "transparent",
                                                fontSize: 13,
                                                fontWeight: 500,
                                                color: C.text,
                                                lineHeight: 1.4,
                                                outline: "none",
                                                boxSizing: "border-box",
                                                fontFamily: "inherit",
                                                resize: "vertical",
                                              }}
                                              onFocus={(e) => {
                                                e.target.style.background = "#FFF";
                                                e.target.style.borderColor = C.blue;
                                              }}
                                              onBlur={(e) => {
                                                e.target.style.background = "transparent";
                                                e.target.style.borderColor = "transparent";
                                              }}
                                            />
                                          </div>

                                          <button
                                            onClick={() => handleDeleteSubQuestion(activeTab, mainQ.id, sub.id)}
                                            title="Delete sub-question"
                                            style={{
                                              border: "none",
                                              background: "none",
                                              color: C.textMuted,
                                              cursor: "pointer",
                                              padding: 3,
                                            }}
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </div>

                                        {/* Subquestion Answer Textarea */}
                                        <div style={{ marginTop: 10 }}>
                                          <textarea
                                            rows={2}
                                            placeholder="Enter answer for this sub-question..."
                                            value={sub.answer || ""}
                                            onChange={(e) =>
                                              handleSubAnswerChange(
                                                activeTab,
                                                mainQ.id,
                                                sub.id,
                                                e.target.value
                                              )
                                            }
                                            style={{
                                              width: "100%",
                                              padding: "8px 12px",
                                              borderRadius: 10,
                                              border: `1px solid ${C.borderSubtle}`,
                                              background: "#FFFFFF",
                                              fontSize: 12,
                                              color: C.text,
                                              lineHeight: 1.4,
                                              outline: "none",
                                              boxSizing: "border-box",
                                              fontFamily: "inherit",
                                              resize: "vertical",
                                            }}
                                            onFocus={(e) => (e.target.style.borderColor = C.blue)}
                                            onBlur={(e) => (e.target.style.borderColor = C.borderSubtle)}
                                          />
                                        </div>

                                        {/* Subquestion Document Upload & List */}
                                        <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                                            {subDocs.length === 0 ? (
                                              <span style={{ fontSize: 11, color: C.textMuted }}>No documents attached</span>
                                            ) : (
                                              subDocs.map((doc) => (
                                                <div
                                                  key={doc.id}
                                                  style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 5,
                                                    padding: "3px 8px",
                                                    borderRadius: 6,
                                                    background: "#FFF",
                                                    border: `1px solid ${C.borderSubtle}`,
                                                    fontSize: 11,
                                                  }}
                                                >
                                                  <File size={11} color={C.blue} />
                                                  <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{ color: C.blue, textDecoration: "none", fontWeight: 500, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                                  >
                                                    {doc.name || doc.file_name}
                                                  </a>
                                                  <button
                                                    onClick={() => handleRemoveDocument(activeTab, sub.id, doc.id)}
                                                    style={{ border: "none", background: "none", cursor: "pointer", color: C.textMuted, padding: 1 }}
                                                  >
                                                    <X size={10} />
                                                  </button>
                                                </div>
                                              ))
                                            )}
                                          </div>

                                          <button
                                            onClick={() => triggerFileUpload(activeTab, sub.id)}
                                            style={{
                                              display: "inline-flex",
                                              alignItems: "center",
                                              gap: 4,
                                              padding: "4px 8px",
                                              borderRadius: 6,
                                              background: C.blueBg,
                                              color: C.blue,
                                              border: `1px solid ${C.blueBorder}`,
                                              fontSize: 10,
                                              fontWeight: 600,
                                              cursor: "pointer",
                                            }}
                                          >
                                            <UploadCloud size={12} />
                                            <span>Upload (≤ 5MB)</span>
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}

                                  {/* Bottom add subquestion link */}
                                  <div style={{ marginTop: 4 }}>
                                    <button
                                      onClick={() => handleAddSubQuestion(activeTab, mainQ.id)}
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        border: `1px dashed ${C.blueBorder}`,
                                        background: "transparent",
                                        color: C.blue,
                                        fontSize: 12,
                                        fontWeight: 500,
                                        cursor: "pointer",
                                      }}
                                    >
                                      <CornerDownRight size={13} />
                                      <span>+ Add Another Sub-question</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* ─── TAB 3: FINANCIALS & EXPENSES ───────────────────────── */}
                {activeTab === "financials" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ ...glassCardStyle, padding: "22px 24px" }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 14px 0" }}>
                        CSR Grant & Budget Summary
                      </h3>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                        <div style={{ padding: 14, borderRadius: 12, background: "#FFF", border: `1px solid ${C.borderSubtle}` }}>
                          <span style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase" }}>Total Grant Amount</span>
                          <p style={{ fontSize: 18, fontWeight: 700, color: C.blue, margin: "4px 0 0 0" }}>
                            ₹{Number(currentTracker.company_details?.csr_grant_amount || currentTracker.company_details?.total_project_grant || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div style={{ padding: 14, borderRadius: 12, background: "#FFF", border: `1px solid ${C.borderSubtle}` }}>
                          <span style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase" }}>Beneficiaries</span>
                          <p style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "4px 0 0 0" }}>
                            {currentTracker.company_details?.reported_beneficiaries || currentTracker.company_details?.total_beneficiaries || "—"}
                          </p>
                        </div>
                        {currentTracker.company_details?.scholarship_per_student && (
                          <div style={{ padding: 14, borderRadius: 12, background: "#FFF", border: `1px solid ${C.borderSubtle}` }}>
                            <span style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase" }}>Per Student Scholarship</span>
                            <p style={{ fontSize: 18, fontWeight: 700, color: C.green, margin: "4px 0 0 0" }}>
                              ₹{Number(currentTracker.company_details.scholarship_per_student).toLocaleString("en-IN")}
                            </p>
                          </div>
                        )}
                        {currentTracker.company_details?.programme_management_cost && (
                          <div style={{ padding: 14, borderRadius: 12, background: "#FFF", border: `1px solid ${C.borderSubtle}` }}>
                            <span style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase" }}>Management Cost</span>
                            <p style={{ fontSize: 16, fontWeight: 600, color: C.textSecondary, margin: "4px 0 0 0" }}>
                              {currentTracker.company_details.programme_management_cost}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ledger-based Expense Heads (Raise India) */}
                    {currentTracker.expense_data && currentTracker.expense_data.length > 0 && (
                      <div style={{ ...glassCardStyle, padding: "22px 24px" }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 14px 0" }}>
                          Ledger-Based Expense Heads & Verification Checks
                        </h3>
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                              <tr style={{ borderBottom: `1.5px solid ${C.borderLight}`, textAlign: "left", color: C.textMuted }}>
                                <th style={{ padding: "10px 12px" }}>Expense Head</th>
                                <th style={{ padding: "10px 12px" }}>Vendor</th>
                                <th style={{ padding: "10px 12px" }}>Checks to be Performed</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentTracker.expense_data.map((exp, idx) => (
                                <tr key={idx} style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
                                  <td style={{ padding: "12px", fontWeight: 600, color: C.text }}>{exp.expense_head}</td>
                                  <td style={{ padding: "12px", color: C.blue, fontWeight: 500 }}>{exp.vendor}</td>
                                  <td style={{ padding: "12px", color: C.textSecondary }}>{exp.check_description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* FY Invoices Table (Raise India) */}
                    {currentTracker.invoice_data && currentTracker.invoice_data.length > 0 && (
                      <div style={{ ...glassCardStyle, padding: "22px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
                            Invoices & Bill Records ({currentTracker.invoice_data.length} records)
                          </h3>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>
                            Total: ₹
                            {currentTracker.invoice_data
                              .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0)
                              .toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                            <thead>
                              <tr style={{ borderBottom: `1.5px solid ${C.borderLight}`, textAlign: "left", color: C.textMuted }}>
                                <th style={{ padding: "8px 10px" }}>#</th>
                                <th style={{ padding: "8px 10px" }}>Invoice Date</th>
                                <th style={{ padding: "8px 10px" }}>Vendor Name</th>
                                <th style={{ padding: "8px 10px" }}>Particulars</th>
                                <th style={{ padding: "8px 10px" }}>Invoice No</th>
                                <th style={{ padding: "8px 10px", textAlign: "right" }}>Amount (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentTracker.invoice_data.map((inv, idx) => (
                                <tr key={idx} style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
                                  <td style={{ padding: "10px", color: C.textMuted }}>{inv.sr_no || idx + 1}</td>
                                  <td style={{ padding: "10px", color: C.textSecondary }}>{inv.invoice_date}</td>
                                  <td style={{ padding: "10px", fontWeight: 600, color: C.text }}>{inv.vendor_name}</td>
                                  <td style={{ padding: "10px", color: C.textSecondary }}>{inv.particulars}</td>
                                  <td style={{ padding: "10px", fontFamily: "monospace", color: C.blue }}>{inv.bill_invoice_number}</td>
                                  <td style={{ padding: "10px", textAlign: "right", fontWeight: 600, color: C.text }}>
                                    ₹{Number(inv.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── TAB 4: COMPANY DETAILS OVERVIEW ───────────────────────── */}
                {activeTab === "details" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ ...glassCardStyle, padding: "24px 28px" }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px 0" }}>Company Profile & Project Scope</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        <div>
                          <span style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase" }}>NGO / Company Name</span>
                          <p style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "3px 0 0 0" }}>{currentTracker.company_name}</p>
                        </div>
                        <div>
                          <span style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase" }}>CSR Donor</span>
                          <p style={{ fontSize: 15, fontWeight: 600, color: C.blue, margin: "3px 0 0 0" }}>{currentTracker.csr_donor || "—"}</p>
                        </div>
                        <div>
                          <span style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase" }}>Project Name</span>
                          <p style={{ fontSize: 14, fontWeight: 500, color: C.text, margin: "3px 0 0 0" }}>{currentTracker.project_name || "—"}</p>
                        </div>
                        <div>
                          <span style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase" }}>Registered NGO Address</span>
                          <p style={{ fontSize: 13, color: C.textSecondary, margin: "3px 0 0 0", whiteSpace: "pre-line" }}>
                            {currentTracker.company_details?.ngo_address || "—"}
                          </p>
                        </div>
                      </div>

                      <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${C.borderLight}` }}>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary, margin: "0 0 6px 0" }}>
                          Project Objective:
                        </h4>
                        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.5, margin: 0 }}>
                          {currentTracker.company_details?.project_objective || "Not specified."}
                        </p>
                      </div>

                      <div style={{ marginTop: 16 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary, margin: "0 0 6px 0" }}>
                          Surprise Visit Objective:
                        </h4>
                        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.5, margin: 0 }}>
                          {currentTracker.company_details?.visit_objective || "Not specified."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* ─── ADD / EDIT COMPANY MODAL ───────────────────────────────────── */}
      {isCompanyModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
          onClick={() => setIsCompanyModalOpen(false)}
        >
          <div
            style={{
              ...glassCardStyle,
              background: "#FFFFFF",
              width: 520,
              maxWidth: "92vw",
              padding: 28,
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
                {editingTracker ? "Edit Company Details" : "Add New Company Tracker"}
              </h3>
              <button
                onClick={() => setIsCompanyModalOpen(false)}
                style={{ border: "none", background: "none", cursor: "pointer", color: C.textMuted }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, display: "block", marginBottom: 4 }}>
                  Company / NGO Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyForm.company_name}
                  onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                  placeholder="e.g. Raise India Foundation"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 10,
                    border: `1px solid ${C.borderSubtle}`,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, display: "block", marginBottom: 4 }}>
                    CSR Donor
                  </label>
                  <input
                    type="text"
                    value={companyForm.csr_donor}
                    onChange={(e) => setCompanyForm({ ...companyForm, csr_donor: e.target.value })}
                    placeholder="e.g. Baxter India Pvt Ltd"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 10,
                      border: `1px solid ${C.borderSubtle}`,
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, display: "block", marginBottom: 4 }}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={companyForm.project_name}
                    onChange={(e) => setCompanyForm({ ...companyForm, project_name: e.target.value })}
                    placeholder="e.g. Shikshalaya"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 10,
                      border: `1px solid ${C.borderSubtle}`,
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, display: "block", marginBottom: 4 }}>
                    CSR Grant Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={companyForm.csr_grant_amount}
                    onChange={(e) => setCompanyForm({ ...companyForm, csr_grant_amount: e.target.value })}
                    placeholder="e.g. 864000"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 10,
                      border: `1px solid ${C.borderSubtle}`,
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, display: "block", marginBottom: 4 }}>
                    Reported Beneficiaries
                  </label>
                  <input
                    type="text"
                    value={companyForm.reported_beneficiaries}
                    onChange={(e) => setCompanyForm({ ...companyForm, reported_beneficiaries: e.target.value })}
                    placeholder="e.g. 150 Students"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 10,
                      border: `1px solid ${C.borderSubtle}`,
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, display: "block", marginBottom: 4 }}>
                  NGO Address
                </label>
                <textarea
                  rows={2}
                  value={companyForm.ngo_address}
                  onChange={(e) => setCompanyForm({ ...companyForm, ngo_address: e.target.value })}
                  placeholder="Address..."
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: `1px solid ${C.borderSubtle}`,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: `1px solid ${C.borderSubtle}`,
                    background: "#FFF",
                    color: C.textSecondary,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    background: C.blue,
                    color: "#FFF",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {editingTracker ? "Save Changes" : "Create Tracker"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
