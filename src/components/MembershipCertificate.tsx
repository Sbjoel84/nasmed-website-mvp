import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import nasmedLogo from "@/assets/nasmed-logo.png";
import signaturePresident from "@/assets/signature-president.jpg";
import signatureSecretary from "@/assets/signature-secretary.jpg";
import nasmedSeal from "@/assets/nasmed-seal.jpg";

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

        {/* Header — NASMED logo centered at top */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "6px", gap: "4px" }}>
          <img src={nasmedLogo} style={{ height: "70px", width: "70px", objectFit: "contain" }} alt="NASMED" />
          <h1 style={{
            color: "#b8860b", fontSize: "26px", letterSpacing: "5px",
            fontFamily: "'Times New Roman', Times, serif", fontWeight: "bold",
            textAlign: "center", margin: 0, lineHeight: 1.2,
          }}>
            MEMBERSHIP CERTIFICATE
          </h1>
        </div>

        {/* Cert number — right-aligned */}
        <div style={{ textAlign: "right", fontSize: "12px", color: "#555", marginBottom: "8px" }}>
          Cert No. {certNumber}
        </div>

        {/* THIS CERTIFIES THAT */}
        <div style={{ textAlign: "center", letterSpacing: "4px", color: "#666", fontSize: "12px", marginBottom: "16px" }}>
          THIS CERTIFIES THAT
        </div>

        {/* Member name */}
        <div style={{
          textAlign: "center", fontSize: "30px", color: "#1a3a6e",
          fontFamily: "'Times New Roman', Times, serif", marginBottom: "12px",
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

        {/* Membership type tag */}
        {membershipType && (
          <div style={{ textAlign: "center", fontSize: "11px", color: "#b8860b", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
            {membershipType}
          </div>
        )}

        {/* Footer: signatures + seal */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "4px" }}>

          {/* President */}
          <div style={{ textAlign: "center", width: "190px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "2px" }}>
              <img
                src={signaturePresident}
                alt="President signature"
                style={{ height: "44px", maxWidth: "170px", objectFit: "contain", objectPosition: "bottom" }}
              />
            </div>
            <div style={{ borderBottom: "1.5px solid #333", marginBottom: "5px" }} />
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#1a3a6e", display: "block" }}>Dr. Olajide Joseph Adebola</span>
            <span style={{ fontSize: "11px", color: "#666" }}>President, NASMED</span>
          </div>

          {/* NASMED Seal */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "4px" }}>
            <img
              src={nasmedSeal}
              alt="NASMED Seal"
              style={{ width: "88px", height: "88px", objectFit: "contain" }}
            />
          </div>

          {/* Secretary-General */}
          <div style={{ textAlign: "center", width: "190px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "2px" }}>
              <img
                src={signatureSecretary}
                alt="Secretary-General signature"
                style={{ height: "44px", maxWidth: "170px", objectFit: "contain", objectPosition: "bottom" }}
              />
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
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 bg-nasmed-navy text-white border-none py-3.5 px-6 rounded-lg text-[15px] font-semibold cursor-pointer hover:opacity-90 transition-all disabled:opacity-50"
        >
          {downloading ? "Generating…" : "⬇ Download Certificate (PDF)"}
        </button>
        <button
          type="button"
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
