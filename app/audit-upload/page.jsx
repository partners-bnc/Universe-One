"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PublicAuditUploadPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState({});

  useEffect(() => {
    if (!token) {
      setError("No upload token provided. Please use the valid link sent to your email.");
      setLoading(false);
      return;
    }

    fetch(`/api/public/audit-upload?token=${token}`)
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.success) {
          setError(resData.error || "Failed to load upload request details.");
        } else {
          setData(resData);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleFileUpload = async (trackerId, file) => {
    if (!file) return;
    setUploadingId(trackerId);

    const formData = new FormData();
    formData.append("token", token);
    formData.append("trackerId", trackerId);
    formData.append("file", file);

    try {
      const res = await fetch("/api/public/audit-upload", {
        method: "POST",
        body: formData,
      });
      const resData = await res.json();
      if (resData.success) {
        setUploadSuccess((prev) => ({ ...prev, [trackerId]: true }));
        // Refresh items
        fetch(`/api/public/audit-upload?token=${token}`)
          .then((r) => r.json())
          .then((d) => d.success && setData(d));
      } else {
        alert("Upload failed: " + (resData.error || "Unknown error"));
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Sora', sans-serif",
        padding: "40px 20px",
        color: "#0f172a",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            backgroundColor: "#0d9488",
            padding: "32px 36px",
            color: "#ffffff",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", opacity: 0.8, marginBottom: 4 }}>
            Secure Audit Document Portal
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
            {data?.project_name || "Audit Information Document Request"}
          </h1>
          <div style={{ fontSize: 13, marginTop: 8, opacity: 0.9 }}>
            Client: <strong>{data?.client_name || "Valued Client"}</strong>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: "36px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Loading request details...</div>
            </div>
          ) : error ? (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 12,
                padding: "24px",
                color: "#dc2626",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Access Restricted</div>
              <div style={{ fontSize: 14 }}>{error}</div>
            </div>
          ) : (
            <>
              {/* Expiry Banner */}
              <div
                style={{
                  backgroundColor: "#f0fdfa",
                  border: "1px solid #99f6e4",
                  borderRadius: 10,
                  padding: "16px 20px",
                  fontSize: 13,
                  color: "#0f766e",
                  marginBottom: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  🔒 Secure link expires on:{" "}
                  <strong>{new Date(data.expires_at).toLocaleString()}</strong> (24-hour validity)
                </div>
              </div>

              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#0f172a" }}>
                Requested Audit Documents ({data.tracker_items?.length || 0})
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {data.tracker_items?.map((item, idx) => {
                  const attachments = Array.isArray(item.attachments) ? item.attachments : [];
                  const isReceived = item.status_json?.document_status === "Received" || attachments.length > 0;

                  return (
                    <div
                      key={item.id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        padding: "20px",
                        backgroundColor: "#f8fafc",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", textTransform: "uppercase", marginBottom: 4 }}>
                            Requirement #{idx + 1}
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>
                            {item.data_requirement || "Audit File Requirement"}
                          </div>
                        </div>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: isReceived ? "#f0fdf4" : "#fffbeb",
                            color: isReceived ? "#16a34a" : "#d97706",
                            border: `1px solid ${isReceived ? "#bbf7d0" : "#fde68a"}`,
                          }}
                        >
                          {isReceived ? "✓ Received" : "Pending Upload"}
                        </span>
                      </div>

                      {/* Attached Files List */}
                      {attachments.length > 0 && (
                        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed #cbd5e1" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                            Uploaded Files:
                          </div>
                          {attachments.map((att, i) => (
                            <div
                              key={i}
                              style={{
                                fontSize: 13,
                                color: "#2563eb",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginTop: 4,
                              }}
                            >
                              📄 <a href={att.url} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>{att.name}</a> ({att.size})
                            </div>
                          ))}
                        </div>
                      )}

                      {/* File Input */}
                      <div style={{ marginTop: 16 }}>
                        <label
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 16px",
                            backgroundColor: uploadingId === item.id ? "#e2e8f0" : "#0d9488",
                            color: uploadingId === item.id ? "#64748b" : "#ffffff",
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: uploadingId === item.id ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {uploadingId === item.id ? "Uploading File..." : "📁 Upload Document"}
                          <input
                            type="file"
                            disabled={uploadingId === item.id}
                            style={{ display: "none" }}
                            onChange={(e) => handleFileUpload(item.id, e.target.files?.[0])}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
