"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Shield,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Trash2,
  Send,
  Lock,
  User,
  CheckSquare,
  Building2,
  FileCheck,
  Image as ImageIcon,
  Archive,
  FileCode,
  File
} from "lucide-react";

const getFileIcon = (fileName = "") => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['xlsx', 'xls', 'csv', 'tsv'].includes(ext)) {
    return <FileSpreadsheet size={14} style={{ color: "#16a34a", flexShrink: 0 }} />;
  }
  if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext)) {
    return <ImageIcon size={14} style={{ color: "#2563eb", flexShrink: 0 }} />;
  }
  if (['pdf'].includes(ext)) {
    return <FileText size={14} style={{ color: "#dc2626", flexShrink: 0 }} />;
  }
  if (['doc', 'docx', 'rtf', 'txt', 'odt'].includes(ext)) {
    return <FileText size={14} style={{ color: "#0284c7", flexShrink: 0 }} />;
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return <Archive size={14} style={{ color: "#d97706", flexShrink: 0 }} />;
  }
  return <File size={14} style={{ color: "#64748b", flexShrink: 0 }} />;
};

const C = {
  bg: "#f8fafc", bg2: "#f1f5f9", surface: "#ffffff",
  border: "#e2e8f0", border2: "#cbd5e1",
  teal: "#0d9488", tealBg: "#f0fdfa", tealBorder: "#99f6e4",
  amber: "#d97706", amberBg: "#fffbeb", amberBorder: "#fde68a",
  red: "#dc2626", redBg: "#fef2f2", redBorder: "#fecaca",
  green: "#16a34a", greenBg: "#f0fdf4", greenBorder: "#bbf7d0",
  blue: "#2563eb", blueBg: "#eff6ff", blueBorder: "#bfdbfe",
  purple: "#7c3aed", purpleBg: "#f5f3ff", purpleBorder: "#ddd6fe",
  text1: "#0f172a", text2: "#475569", text3: "#94a3b8",
};

export default function ClientPortalUploadPage() {
  const params = useParams();
  const token = params?.token || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [portalData, setPortalData] = useState(null);

  // File uploads map per itemId: { [itemId]: Array<{ name, size, type, dataUrl, uploadedAt }> }
  const [uploadsMap, setUploadsMap] = useState({});
  const [submittingItemId, setSubmittingItemId] = useState(null);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Google Drive / Cloud Link State
  const [driveUrl, setDriveUrl] = useState("");
  const [driveNotes, setDriveNotes] = useState("");
  const [isSubmittingDrive, setIsSubmittingDrive] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No access token provided");
      setLoading(false);
      return;
    }

    fetch(`/Auditing/api/dynamic/client-portal?token=${encodeURIComponent(token)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          setError(data.error || "Failed to load portal");
        } else {
          setPortalData(data);

          // Initialize existing attachments map
          const initMap = {};
          (data.requestedItems || []).forEach(item => {
            initMap[item.id] = item.attachments || [];
          });
          setUploadsMap(initMap);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Network error loading portal");
        setLoading(false);
      });
  }, [token]);

  const handleFileSelect = (itemId, files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    setUploadsMap(prev => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), ...fileArray]
    }));
  };

  const handleRemoveFile = (itemId, fileIdx) => {
    setUploadsMap(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || []).filter((_, idx) => idx !== fileIdx)
    }));
  };

  const uploadFilesToStorage = async (itemId, filesToUpload) => {
    const formData = new FormData();
    formData.append('projectId', portalData?.project?.id || 'general');
    formData.append('folder', 'data-tracker');
    formData.append('rowId', itemId);

    filesToUpload.forEach(f => {
      formData.append('files', f);
    });

    const res = await fetch('/Auditing/api/dynamic/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!data.success || !Array.isArray(data.files)) {
      throw new Error(data.error || 'Failed to upload document to Supabase storage bucket');
    }
    return data.files;
  };

  const [submitProgressText, setSubmitProgressText] = useState("");

  const handleSubmitItemFiles = async (itemId) => {
    const filesToUpload = uploadsMap[itemId] || [];
    if (filesToUpload.length === 0) {
      alert("Please select or drop at least one file before submitting.");
      return;
    }

    setSubmittingItemId(itemId);
    setSuccessMessage("");

    try {
      // 1. Upload files to Supabase Storage bucket auditing-documents
      const uploadedStorageFiles = await uploadFilesToStorage(itemId, filesToUpload);

      // 2. Link uploaded storage file metadata in database
      const res = await fetch("/Auditing/api/dynamic/client-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          itemId,
          files: uploadedStorageFiles
        })
      });

      const data = await res.json();
      if (!data.success) {
        alert(`Error: ${data.error}`);
      } else {
        setSuccessMessage("✅ Upload Done! Document(s) successfully transmitted to the Audit Team.");
        setPortalData(prev => ({
          ...prev,
          requestedItems: (prev.requestedItems || []).map(it =>
            it.id === itemId ? { ...it, status: "Under Review" } : it
          )
        }));
      }
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmittingItemId(null);
    }
  };

  const handleSubmitAllDocuments = async () => {
    const itemsToSubmit = (portalData?.requestedItems || []).filter(it => (uploadsMap[it.id] || []).length > 0);
    const hasDriveUrl = !!driveUrl.trim();

    if (itemsToSubmit.length === 0 && !hasDriveUrl) {
      alert("Please upload documents or provide a Google Drive / Cloud link before submitting.");
      return;
    }

    setIsSubmittingAll(true);
    setSuccessMessage("");
    setSubmitProgressText("Preparing submission...");

    try {
      let submittedDocsCount = 0;
      // 1. Submit file uploads item by item
      for (let i = 0; i < itemsToSubmit.length; i++) {
        const item = itemsToSubmit[i];
        const filesToUpload = uploadsMap[item.id] || [];
        setSubmitProgressText(`Uploading document ${i + 1} of ${itemsToSubmit.length}: ${item.data_requirement}...`);

        const uploadedStorageFiles = await uploadFilesToStorage(item.id, filesToUpload);

        await fetch("/Auditing/api/dynamic/client-portal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            itemId: item.id,
            files: uploadedStorageFiles
          })
        });
        submittedDocsCount += filesToUpload.length;
      }

      // 2. Also submit Google Drive link if provided in the input
      if (hasDriveUrl) {
        setSubmitProgressText("Submitting Google Drive / Cloud folder link...");
        await fetch("/Auditing/api/dynamic/client-portal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            action: "submit_drive_link",
            driveUrl: driveUrl.trim(),
            driveNotes: driveNotes.trim()
          })
        });
      }

      setSuccessMessage(
        hasDriveUrl && submittedDocsCount > 0
          ? "✅ Upload Done! All documents and Google Drive folder link successfully transmitted to the Audit Team."
          : hasDriveUrl
          ? "✅ Upload Done! Google Drive folder link successfully transmitted to the Audit Team."
          : "✅ Upload Done! All uploaded documents successfully stored and transmitted to the Audit Team."
      );

      setPortalData(prev => ({
        ...prev,
        requestedItems: (prev.requestedItems || []).map(it => {
          const hasNewUpload = (uploadsMap[it.id] || []).length > 0;
          return {
            ...it,
            status: hasNewUpload ? "Under Review" : it.status
          };
        })
      }));
    } catch (err) {
      alert(`Error submitting documents: ${err.message}`);
    } finally {
      setIsSubmittingAll(false);
      setSubmitProgressText("");
    }
  };

  // Handle Google Drive / Cloud Link Submission
  const handleSubmitDriveLink = async (e) => {
    e?.preventDefault();
    const cleanUrl = driveUrl.trim();
    if (!cleanUrl) {
      alert("Please enter a valid Google Drive, OneDrive, or Dropbox folder URL.");
      return;
    }

    setIsSubmittingDrive(true);
    setSuccessMessage("");

    try {
      const res = await fetch("/Auditing/api/dynamic/client-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          action: "submit_drive_link",
          driveUrl: cleanUrl,
          driveNotes: driveNotes.trim()
        })
      });

      const data = await res.json();
      if (!data.success) {
        alert(`Error: ${data.error}`);
      } else {
        setSuccessMessage("✅ Upload Done! Google Drive / Cloud folder link successfully transmitted to the Audit Team.");
        setPortalData(prev => ({
          ...prev,
          requestedItems: (prev.requestedItems || []).map(it => ({
            ...it,
            status: "Under Review"
          }))
        }));
      }
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmittingDrive(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora, sans-serif" }}>
        <div style={{ textAlign: "center", color: C.text2 }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${C.teal}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Opening Secure Document Upload Portal...</div>
        </div>
      </div>
    );
  }

  if (error || !portalData) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Sora, sans-serif" }}>
        <div style={{ backgroundColor: C.surface, borderRadius: 16, padding: 36, maxWidth: 480, width: "100%", border: `1px solid ${C.redBorder}`, textAlign: "center", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: C.redBg, color: C.red, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <AlertCircle size={28} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text1, marginBottom: 8 }}>Portal Access Error</h2>
          <p style={{ fontSize: 13.5, color: C.text2, lineHeight: 1.5, marginBottom: 24 }}>
            {error || "Invalid or corrupt security token."}
          </p>
          <div style={{ fontSize: 12, color: C.text3 }}>Please request a fresh secure upload link from your Lead Auditor.</div>
        </div>
      </div>
    );
  }

  const { project, recipient, requestedItems } = portalData;

  // Calculate Progress Stats
  const totalCount = requestedItems.length;
  const completedCount = requestedItems.filter(it => it.status === "Received" || (uploadsMap[it.id] || []).length > 0).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalAttachedFiles = Object.values(uploadsMap).reduce((acc, curr) => acc + (curr || []).length, 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, color: C.text1, fontFamily: "Sora, sans-serif", padding: "32px 20px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        
        {/* Header Bar */}
        <div style={{ backgroundColor: C.surface, borderRadius: 16, padding: "28px 32px", border: `1px solid ${C.border}`, boxShadow: "0 4px 16px rgba(0,0,0,0.03)", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal, fontWeight: 700, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
                <Shield size={16} /> Information Document Request (IDR) Client Portal
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text1, margin: 0 }}>{project?.client_name || "Client Engagement"}</h1>
              <div style={{ fontSize: 13.5, color: C.text2, marginTop: 4 }}>
                Audit Project: <strong>{project?.project_name}</strong> ({project?.financial_year || "FY 2026-27"})
              </div>
            </div>

            {/* Active Secure Portal Badge */}
            <div style={{
              backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, padding: "10px 18px", borderRadius: 12,
              display: "flex", alignItems: "center", gap: 10
            }}>
              <Shield size={18} style={{ color: C.teal }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: C.teal, textTransform: "uppercase", letterSpacing: 0.6 }}>Active Portal</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text1 }}>
                  Permanent Secure Link
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 20, paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: C.text2, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <User size={15} style={{ color: C.teal }} />
              <span>Assigned Recipient: <strong>{recipient?.member_name || recipient?.name || "Client Contact"}</strong> ({recipient?.email || "client@company.com"})</span>
            </div>
            
            {/* Clear Non-Tech Friendly Bank-Grade Security Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.teal, fontWeight: 700, backgroundColor: C.tealBg, padding: "5px 12px", borderRadius: 8, border: `1px solid ${C.tealBorder}` }}>
              <Lock size={14} /> 100% Secure & Confidential Encrypted Upload
            </div>
          </div>
        </div>

        {/* Global Notification Banner */}
        {successMessage && (
          <div style={{ backgroundColor: C.greenBg, border: `1px solid ${C.greenBorder}`, color: C.green, padding: "14px 20px", borderRadius: 12, marginBottom: 24, fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle2 size={18} /> {successMessage}
          </div>
        )}

        {/* Upload Checklist Progress Bar Card */}
        <div style={{ backgroundColor: C.surface, borderRadius: 14, padding: 20, border: `1px solid ${C.border}`, marginBottom: 24, boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text1, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckSquare size={18} style={{ color: C.teal }} /> Document Checklist Progress
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: completedCount === totalCount && totalCount > 0 ? C.green : C.teal }}>
              {completedCount} of {totalCount} Completed ({progressPercent}%)
            </div>
          </div>
          
          <div style={{ width: "100%", height: 10, backgroundColor: C.bg2, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", backgroundColor: completedCount === totalCount && totalCount > 0 ? C.green : C.teal, borderRadius: 10, transition: "width 0.3s ease" }} />
          </div>
        </div>

        {/* Audit Document Requirements Table (Strictly 4 Columns with Single Line Status Pill) */}
        <div style={{ backgroundColor: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: C.bg2, color: C.text2, textAlign: "left", borderBottom: `2px solid ${C.border}` }}>
                <th style={{ padding: "14px 20px", fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Doc Name</th>
                <th style={{ padding: "14px 20px", width: 180, textAlign: "center", fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>Status</th>
                <th style={{ padding: "14px 20px", width: 340, fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>Upload Button</th>
                <th style={{ padding: "14px 20px", width: 130, textAlign: "center", fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>Submit</th>
              </tr>
            </thead>
            <tbody>
              {requestedItems.map((item, idx) => {
                const files = uploadsMap[item.id] || [];
                const isItemDone = item.status === "Received" || files.length > 0;
                const isSubmittingThis = submittingItemId === item.id;

                return (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: isItemDone ? C.greenBg + "15" : "transparent" }}>
                    
                    {/* 1. Doc Name Column (Clean Data Requirement Title Only) */}
                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>
                        Item #{idx + 1}
                      </div>
                      {(() => {
                        const rawText = String(item.data_requirement || "").trim();
                        const parts = rawText.split(/,|\n/).map(p => p.trim()).filter(Boolean);
                        const cleanSubs = parts.map(part => part.replace(/^(\d+[\.\)]\s*)+/g, '').replace(/^[a-zA-Z][\.\)]\s*/g, '').replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
                        const finalSubs = cleanSubs.length > 0 ? cleanSubs : [rawText];

                        if (finalSubs.length > 1) {
                          return (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                              {finalSubs.map((sub, sIdx) => (
                                <div key={sIdx} style={{ fontSize: 13.5, fontWeight: 600, color: C.text1, display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontSize: 11.5, fontWeight: 800, color: C.teal, backgroundColor: C.tealBg, padding: "2px 7px", borderRadius: 5, border: `1px solid ${C.tealBorder}` }}>
                                    {idx + 1}.{sIdx + 1}
                                  </span>
                                  <span>{sub}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return (
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: C.text1, lineHeight: 1.4 }}>
                            {finalSubs[0]}
                          </div>
                        );
                      })()}
                    </td>

                    {/* 2. Status Column (Strict Single-line Pill) */}
                    <td style={{ padding: "16px 20px", textAlign: "center", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                      {item.status === "Received" ? (
                        <span style={{
                          padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                          backgroundColor: C.greenBg, color: C.green, border: `1px solid ${C.greenBorder}`,
                          display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap"
                        }}>
                          <CheckCircle2 size={14} /> Transmitted
                        </span>
                      ) : files.length > 0 ? (
                        <span style={{
                          padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                          backgroundColor: C.blueBg, color: C.blue, border: `1px solid ${C.blueBorder}`,
                          display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap"
                        }}>
                          <FileCheck size={14} /> {files.length} File(s) Attached
                        </span>
                      ) : (
                        <span style={{
                          padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                          backgroundColor: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}`,
                          display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap"
                        }}>
                          <Clock size={14} /> Pending Upload
                        </span>
                      )}
                    </td>

                    {/* 3. Upload Button Column (Sleek Compact Layout) */}
                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                      <input
                        type="file"
                        multiple
                        id={`tbl_file_${item.id}`}
                        style={{ display: "none" }}
                        onChange={e => handleFileSelect(item.id, e.target.files)}
                      />
                      
                      <label
                        htmlFor={`tbl_file_${item.id}`}
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
                          backgroundColor: C.tealBg, border: `1px solid ${C.tealBorder}`, color: C.teal, fontSize: 12, fontWeight: 700, cursor: "pointer",
                          transition: "all 0.15s ease", marginBottom: files.length > 0 ? 8 : 0, whiteSpace: "nowrap"
                        }}
                      >
                        <Upload size={14} /> Choose / Drop File(s)
                      </label>

                      {/* Attached File Cards */}
                      {files.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                          {files.map((f, fIdx) => (
                            <div key={fIdx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.bg2, padding: "6px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11.5 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
                                {getFileIcon(f.name)}
                                <span style={{ fontWeight: 600, color: C.text1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: 200 }}>{f.name}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveFile(item.id, fIdx)}
                                style={{ background: "none", border: "none", color: C.red, cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
                                title="Remove file"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* 4. Submit Column */}
                    <td style={{ padding: "16px 20px", textAlign: "center", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => handleSubmitItemFiles(item.id)}
                        disabled={isSubmittingThis || files.length === 0}
                        style={{
                          padding: "8px 16px", borderRadius: 8, backgroundColor: files.length > 0 ? C.teal : C.bg2,
                          color: files.length > 0 ? "#fff" : C.text3, border: `1px solid ${files.length > 0 ? C.teal : C.border}`,
                          fontSize: 12, fontWeight: 700, cursor: files.length > 0 && !isSubmittingThis ? "pointer" : "not-allowed",
                          display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.15s ease",
                          boxShadow: files.length > 0 ? "0 2px 6px rgba(13,148,136,0.2)" : "none"
                        }}
                      >
                        {isSubmittingThis ? (
                          <>
                            <div style={{ width: 12, height: 12, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send size={13} />
                            <span>Submit</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* OR Provide Google Drive / Cloud Folder Link Section */}
        <div style={{ backgroundColor: C.surface, borderRadius: 16, padding: "26px 30px", border: `1px solid ${C.tealBorder}`, marginTop: 24, boxShadow: "0 4px 16px rgba(13,148,136,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: C.tealBg, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.tealBorder}` }}>
              <Building2 size={18} style={{ color: C.teal }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.text1 }}>Or Provide Google Drive / Cloud Folder Link</div>
              <div style={{ fontSize: 12.5, color: C.text2, marginTop: 2 }}>If your audit documents are already organized in a shared cloud folder (Google Drive, OneDrive, Dropbox, or SharePoint), paste the link below:</div>
            </div>
          </div>

          <form onSubmit={handleSubmitDriveLink} style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.text1, display: "block", marginBottom: 6 }}>
                Shared Cloud Folder URL <span style={{ color: C.red }}>*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/drive/folders/... or OneDrive / Dropbox link"
                value={driveUrl}
                onChange={e => setDriveUrl(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`,
                  fontSize: 13.5, color: C.text1, outline: "none", backgroundColor: C.bg,
                  transition: "border-color 0.15s ease", fontFamily: "inherit"
                }}
                onFocus={e => e.target.style.borderColor = C.teal}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.text1, display: "block", marginBottom: 6 }}>
                Access Notes / Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., General access enabled, contains FY 2026-27 documents"
                value={driveNotes}
                onChange={e => setDriveNotes(e.target.value)}
                style={{
                  width: "100%", padding: "10px 16px", borderRadius: 10, border: `1px solid ${C.border}`,
                  fontSize: 13, color: C.text1, outline: "none", backgroundColor: C.bg,
                  transition: "border-color 0.15s ease", fontFamily: "inherit"
                }}
                onFocus={e => e.target.style.borderColor = C.teal}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <button
                type="submit"
                disabled={isSubmittingDrive || !driveUrl.trim()}
                style={{
                  padding: "11px 24px", borderRadius: 10,
                  backgroundColor: driveUrl.trim() && !isSubmittingDrive ? C.teal : C.border2,
                  color: "#fff", border: "none", fontSize: 13.5, fontWeight: 700,
                  cursor: driveUrl.trim() && !isSubmittingDrive ? "pointer" : "not-allowed",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  boxShadow: driveUrl.trim() ? "0 4px 12px rgba(13,148,136,0.25)" : "none",
                  transition: "all 0.15s ease"
                }}
              >
                {isSubmittingDrive ? (
                  <>
                    <div style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                    <span>Submitting Cloud Link...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Submit Google Drive Link</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Clean Master Submit Action Footer Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "18px 26px", backgroundColor: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, flexWrap: "wrap", gap: 14 }}>
          <div style={{ fontSize: 13, color: C.text2 }}>
            Total documents attached: <strong>{totalAttachedFiles} file(s)</strong> across <strong>{completedCount} of {totalCount}</strong> requirement(s)
            {driveUrl.trim() && <span style={{ color: C.teal, fontWeight: 700, marginLeft: 8 }}>• Cloud Folder Link Included</span>}
          </div>
          <button
            onClick={handleSubmitAllDocuments}
            disabled={isSubmittingAll || (totalAttachedFiles === 0 && !driveUrl.trim())}
            style={{
              padding: "11px 26px", borderRadius: 10,
              backgroundColor: (totalAttachedFiles > 0 || driveUrl.trim()) && !isSubmittingAll ? C.teal : C.border2,
              color: "#fff", border: "none", fontSize: 13.5, fontWeight: 700,
              cursor: (totalAttachedFiles > 0 || driveUrl.trim()) && !isSubmittingAll ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: (totalAttachedFiles > 0 || driveUrl.trim()) ? "0 4px 12px rgba(13,148,136,0.25)" : "none"
            }}
          >
            {isSubmittingAll ? (
              <>
                <div style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                <span>{submitProgressText || "Submitting All Submissions..."}</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Submit All Uploaded Documents {driveUrl.trim() ? "& Link" : ""}</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Text */}
        <div style={{ textAlign: "center", marginTop: 32, fontSize: 12.5, color: C.text3, fontWeight: 600 }}>
          Powered by Universeone Audit Engine • Confidential Audit Data Portal
        </div>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
