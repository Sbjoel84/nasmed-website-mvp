import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import nasmedLogo from "@/assets/nasmed-logo.png";

interface Props {
  memberName: string;
  certNumber: string;
  date: string;
  membershipType: string;
  email: string;
}

// Lotus SVG watermark — matches the PDF background
function LotusWatermark() {
  return (
    <svg viewBox="0 0 400 400" style={{ width: "420px", height: "420px", opacity: 0.055 }} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(0 200 200)" />
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(30 200 200)" />
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(60 200 200)" />
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(90 200 200)" />
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(120 200 200)" />
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(150 200 200)" />
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(180 200 200)" />
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(210 200 200)" />
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(240 200 200)" />
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(270 200 200)" />
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(300 200 200)" />
      <ellipse cx="200" cy="280" rx="30" ry="120" fill="#1a3a6e" transform="rotate(330 200 200)" />
    </svg>
  );
}

function PresidentSignature() {
  return (
    <svg width="150" height="42" viewBox="0 0 150 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <path d="M 8,34 C 14,10 28,6 34,20 C 38,28 40,14 48,10 C 55,7 57,22 62,26 C 66,30 68,16 76,13 C 82,11 84,24 90,22 C 96,20 96,10 104,13 C 110,16 108,28 114,26 C 120,24 120,15 128,17 C 134,19 133,30 140,28" stroke="#1a3a6e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 6,37 Q 50,41 100,39 Q 125,38 144,36" stroke="#1a3a6e" strokeWidth="0.9" strokeLinecap="round" opacity="0.55"/>
    </svg>
  );
}

function SecretarySignature() {
  return (
    <svg width="150" height="42" viewBox="0 0 150 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <path d="M 6,30 C 12,8 24,6 28,18 C 31,26 33,12 42,10 C 50,8 50,22 56,20 C 62,18 60,8 68,10 C 75,12 74,26 80,24 C 86,22 88,12 96,14 C 102,16 100,28 106,26 C 112,24 114,14 122,16 C 128,18 126,30 132,28 C 137,26 138,18 144,20" stroke="#1a3a6e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 4,35 C 6,32 10,38 20,36 Q 70,40 144,36" stroke="#1a3a6e" strokeWidth="0.9" strokeLinecap="round" opacity="0.55"/>
    </svg>
  );
}

// FIMS-style badge (CSS recreation — original not available as asset)
function FimsBadge() {
  return (
    <div style={{
      width: "80px", height: "80px", border: "3px solid #1a3a6e", borderRadius: "6px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "white", gap: "2px",
    }}>
      <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
        {["#0081C8","#FCB131","#000","#00A651","#EE334E"].map((c, i) => (
          <div key={i} style={{ width: "12px", height: "12px", borderRadius: "50%", border: `2.5px solid ${c}`, background: "transparent" }} />
        ))}
      </div>
      <div style={{ fontSize: "11px", fontWeight: "900", color: "#1a3a6e", letterSpacing: "2px", fontFamily: "Arial, sans-serif" }}>FIMS</div>
    </div>
  );
}

// NASMED circular seal
function NasmedSeal() {
  return (
    <div style={{
      width: "84px", height: "84px", borderRadius: "50%",
      border: "3px solid #b8860b", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", background: "white",
      boxShadow: "0 0 0 1px #b8860b inset",
    }}>
      <img src={nasmedLogo} style={{ width: "42px", height: "42px", objectFit: "contain" }} alt="NASMED" />
      <div style={{ fontSize: "8px", fontWeight: "bold", color: "#1a3a6e", letterSpacing: "1px", marginTop: "2px" }}>EST. 1994</div>
    </div>
  );
}

export function CertificateFrame({ memberName, certNumber, date, membershipType }: Omit<Props, "email">) {
  return (
    <div
      id="nasmed-certificate"
      style={{
        width: "794px", height: "562px",
        border: "14px solid #1a3a6e",
        padding: "28px 40px 24px",
        background: "#ffffff",
        position: "relative",
        fontFamily: "'Times New Roman', Times, Georgia, serif",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Lotus watermark */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -46%)", zIndex: 0, pointerEvents: "none" }}>
        <LotusWatermark />
      </div>

      {/* All content above watermark */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <img src={nasmedLogo} style={{ height: "72px", width: "72px", objectFit: "contain" }} alt="NASMED" />
          <h1 style={{
            color: "#b8860b", fontSize: "26px", letterSpacing: "5px",
            fontFamily: "'Times New Roman', Times, serif", fontWeight: "bold",
            textAlign: "center", flex: 1, margin: "0 16px", lineHeight: 1.2,
          }}>
            MEMBERSHIP CERTIFICATE
          </h1>
          <FimsBadge />
        </div>

        {/* Cert number — right-aligned */}
        <div style={{ textAlign: "right", fontSize: "12px", color: "#555", marginBottom: "10px" }}>
          Cert No. {certNumber}
        </div>

        {/* THIS CERTIFIES THAT */}
        <div style={{ textAlign: "center", letterSpacing: "4px", color: "#666", fontSize: "12px", marginBottom: "18px" }}>
          THIS CERTIFIES THAT
        </div>

        {/* Member name */}
        <div style={{
          textAlign: "center", fontSize: "30px", color: "#1a3a6e",
          fontFamily: "'Times New Roman', Times, serif", marginBottom: "14px",
          fontStyle: "italic", letterSpacing: "1px",
        }}>
          {memberName || "Member Name"}
        </div>

        {/* Body */}
        <div style={{ textAlign: "center", fontSize: "14px", color: "#444", lineHeight: "1.85", marginBottom: "10px" }}>
          Has successfully met the requirements of membership in<br />
          the <span style={{ fontWeight: "bold" }}>NIGERIA ASSOCIATION OF SPORTS MEDICINE</span><br />
          On this day
        </div>

        {/* Date */}
        <div style={{ textAlign: "center", letterSpacing: "3px", color: "#444", fontSize: "13px", marginBottom: "auto" }}>
          {date}
        </div>

        {/* Footer: signatures + seal */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "12px" }}>
          {/* President */}
          <div style={{ textAlign: "center", width: "180px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0px" }}>
              <PresidentSignature />
            </div>
            <div style={{ borderBottom: "1.5px solid #333", marginBottom: "5px" }} />
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#1a3a6e", display: "block" }}>Dr. Olajide Joseph Adebola</span>
            <span style={{ fontSize: "11px", color: "#666" }}>President, NASMED</span>
          </div>

          <NasmedSeal />

          {/* Secretary-General */}
          <div style={{ textAlign: "center", width: "180px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0px" }}>
              <SecretarySignature />
            </div>
            <div style={{ borderBottom: "1.5px solid #333", marginBottom: "5px" }} />
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#1a3a6e", display: "block" }}>Secretary-General</span>
            <span style={{ fontSize: "11px", color: "#666" }}>Secretary-General, NASMED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MembershipCertificate({ memberName, certNumber, date, membershipType, email }: Props) {
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const getCertificateCanvas = async () => {
    const el = document.getElementById("nasmed-certificate");
    if (!el) throw new Error("Certificate element not found");
    return html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#fff" });
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const canvas = await getCertificateCanvas();
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [794, 562] });
      pdf.addImage(imgData, "JPEG", 0, 0, 794, 562);
      pdf.save(`NASMED_Membership_Certificate_${memberName.replace(/\s+/g, "_")}.pdf`);
      toast.success("Certificate downloaded!");
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast.error("Email service not configured. Please download your certificate instead.");
      return;
    }

    setSending(true);
    try {
      const canvas = await getCertificateCanvas();
      const imageData = canvas.toDataURL("image/jpeg", 0.9);

      await emailjs.send(serviceId, templateId, {
        to_email: email,
        member_name: memberName,
        cert_number: certNumber,
        membership_type: membershipType,
        issue_date: date,
        certificate_image: imageData,
      }, publicKey);

      toast.success(`Certificate sent to ${email}!`);
    } catch {
      toast.error("Failed to send email. Please download your certificate instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Certificate preview — scaled down for screen */}
      <div style={{ transform: "scale(0.72)", transformOrigin: "top center", marginBottom: "-100px" }}>
        <CertificateFrame
          memberName={memberName}
          certNumber={certNumber}
          date={date}
          membershipType={membershipType}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 bg-nasmed-navy text-white border-none py-3.5 px-6 rounded-lg text-[15px] font-semibold cursor-pointer hover:opacity-90 transition-all disabled:opacity-50"
        >
          {downloading ? "Generating…" : "⬇ Download Certificate (PDF)"}
        </button>
        <button
          onClick={handleSendEmail}
          disabled={sending}
          className="flex-1 flex items-center justify-center gap-2 bg-nasmed-green text-white border-none py-3.5 px-6 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all disabled:opacity-50"
        >
          {sending ? "Sending…" : "✉ Send to My Email"}
        </button>
      </div>

      <p className="text-xs text-nasmed-text-muted text-center max-w-sm">
        Your certificate will also be available in your member portal once your membership is activated.
      </p>
    </div>
  );
}
