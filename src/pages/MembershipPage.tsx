import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { applicationService } from "@/services/applicationService";
import transactionService from "@/services/transactionService";
import authService from "@/lib/authService";
import supabase from "@/lib/supabaseClient";
import PaystackPop from "@paystack/inline-js";
import MembershipCertificate from "@/components/MembershipCertificate";
import MemberBenefitsSection from "@/components/MemberBenefitsSection";

const nigerianStates = [
  "Abuja (FCT)", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const benefits = [
  { icon: "🎓", title: "Professional Development", desc: "Access accredited CPD programmes, workshops, and certification courses to stay at the forefront of sports medicine.", tags: ["CPD", "Workshops", "Certification"], gradient: "from-nasmed-mid-blue to-nasmed-blue" },
  { icon: "📰", title: "Publications & Research", desc: "Full access to the Nigerian Journal of Sports Medicine, research databases, and peer-reviewed publications.", tags: ["Journals", "Research", "Databases"], gradient: "from-nasmed-green to-emerald-700" },
  { icon: "🌍", title: "Networking & Community", desc: "Connect with 1,400+ sports medicine professionals across Nigeria and internationally through events and forums.", tags: ["Events", "Forums", "Contacts"], gradient: "from-purple-700 to-purple-500" },
  { icon: "📣", title: "Advocacy & Representation", desc: "Benefit from a unified voice that advocates for members' interests and works to influence policy and industry standards.", tags: ["Policy", "Lobbying", "Standards"], gradient: "from-amber-700 to-amber-500" },
  { icon: "🏷️", title: "Discounted Services & Events", desc: "Enjoy exclusive discounts on seminars, certification programmes, and professional events.", tags: ["Discounts", "Seminars", "Savings"], gradient: "from-red-600 to-red-400" },
  { icon: "💼", title: "Career Support", desc: "Access mentorship programmes, career counselling, and job placement services.", tags: ["Mentorship", "Counselling", "Placement"], gradient: "from-cyan-700 to-cyan-500" },
  { icon: "🏅", title: "Recognition & Awards", desc: "Get recognised for your contributions through award programmes and public acknowledgements.", tags: ["Awards", "Recognition", "Profile"], gradient: "from-emerald-800 to-emerald-600" },
];

// color themes: card / topBar / tag / price / button
const planColors: Record<string, { card: string; topBar: string; tag: string; price: string; btn: string; check: string }> = {
  "Student Membership":   { card: "border-purple-400 bg-purple-50/40 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1",  topBar: "bg-purple-500",  tag: "bg-purple-100 text-purple-700",  price: "text-purple-600",  btn: "border-purple-400 text-purple-700 hover:bg-purple-500 hover:text-white",  check: "text-purple-500" },
  "Associate Member":     { card: "border-blue-400 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1",                      topBar: "bg-blue-500",    tag: "bg-blue-100 text-blue-700",      price: "text-blue-600",    btn: "border-blue-400 text-blue-700 hover:bg-blue-500 hover:text-white",        check: "text-blue-500" },
  "Individual Member":    { card: "border-nasmed-green hover:border-emerald-600 hover:shadow-xl hover:-translate-y-1",               topBar: "bg-nasmed-green",tag: "bg-green-100 text-nasmed-green", price: "text-nasmed-green",btn: "border-nasmed-green text-nasmed-green hover:bg-nasmed-green hover:text-white", check: "text-nasmed-green" },
  "Fellow (FNASMED)":     { card: "border-amber-500 bg-amber-50/30 hover:border-amber-600 hover:shadow-xl hover:-translate-y-1",     topBar: "bg-gradient-to-r from-amber-400 to-yellow-500", tag: "bg-amber-100 text-amber-700", price: "text-amber-600", btn: "border-amber-500 text-amber-700 hover:bg-amber-500 hover:text-white", check: "text-amber-500" },
  "International Membership": { card: "bg-nasmed-navy border-nasmed-mid-blue shadow-[0_20px_56px_rgba(26,58,110,0.3)]", topBar: "bg-gradient-to-r from-nasmed-green to-nasmed-mid-blue", tag: "bg-nasmed-green/25 text-nasmed-green-light", price: "text-nasmed-green-light", btn: "bg-nasmed-green border-nasmed-green text-white hover:bg-nasmed-green-light hover:border-nasmed-green-light", check: "text-nasmed-green-light" },
};

const membershipPlans = [
  { tier: "Student Membership",      tag: "UNDERGRADUATE ONLY", price: "₦2,500",   period: " one-time", currency: "NGN", note: "For undergraduate students only. Admission letter required. Membership expires at end of programme.", features: ["Digital membership card", "Newsletter access", "Annual conference discount", "Student research resources", "Mentorship access", "Expires with programme duration"] },
  { tier: "Associate Member",        tag: "ASSOCIATE",          price: "₦150,000", period: "/year",     currency: "NGN", note: "", features: ["Member directory listing", "Newsletter access", "Annual conference discount", "Digital membership card"] },
  { tier: "Individual Member",       tag: "INDIVIDUAL",         price: "₦25,000",  period: "/year",     currency: "NGN", note: "", features: ["Full member directory listing", "Journal & publication access", "CPD programme access", "Voting rights", "Professional recognition", "Annual conference access"] },
  { tier: "Fellow (FNASMED)",        tag: "PREMIUM",            price: "₦250,000", period: "/year",     currency: "NGN", note: "", features: ["All Individual Member benefits", "FNASMED designation", "Leadership eligibility", "International liaison", "Priority event access", "Mentorship programme"] },
  { tier: "International Membership",tag: "INTERNATIONAL",      price: "$50",      period: "/year",     currency: "USD", note: "", features: ["Global member directory listing", "Digital membership card", "International journal access", "Online CPD access", "Cross-border networking", "FIMS affiliate benefits"] },
];

const otherPayments = [
  { label: "Annual Dues", price: "₦25,000", desc: "Annual renewal dues for existing members", icon: "📅" },
  { label: "Welfare Contribution", price: "Open Amount", desc: "Support fellow members through our welfare fund", icon: "🤝" },
  { label: "Donations", price: "Open Amount", desc: "Contribute to NASMED's mission and programmes", icon: "💚" },
];

// ── Update these with NASMED's actual bank account details ──
const BANK_ACCOUNTS = {
  NGN: {
    bankName: "Union Bank",
    accountName: "Nigerian Association of Sports Medicine",
    accountNumber: "0227297914",
    sortCode: "055",
  },
  USD: {
    bankName: "Zenith Bank (Domiciliary)",
    accountName: "Nigerian Association of Sports Medicine",
    accountNumber: "0000000000", // ← replace with actual USD account number
    swiftCode: "ZEIBNGLA",
    sortCode: "057",
  },
};

export default function MembershipPage() {
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certNumber] = useState(() => {
    const yr = new Date().getFullYear().toString().slice(-2);
    const seq = String(Math.floor(1000 + Math.random() * 9000));
    return `NASMED/${yr}/${seq}`;
  });
  const [currentAppId, setCurrentAppId] = useState("");
  const plansRef = useRef<HTMLElement>(null);

  // Receipt upload state for Additional Contributions simple pay
  const [simpleReceiptUrl, setSimpleReceiptUrl] = useState("");
  const [simpleReceiptName, setSimpleReceiptName] = useState("");
  const [simpleReceiptUploading, setSimpleReceiptUploading] = useState(false);
  const [simpleReceiptError, setSimpleReceiptError] = useState("");
  const [simplePayTxnRef, setSimplePayTxnRef] = useState("");
  const [step, setStep] = useState(1);
  const [paymentDone, setPaymentDone] = useState(false);
  const [cardData, setCardData] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [cardError, setCardError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'bank_transfer' | 'ussd' | null>(null);
  const [bankReceiptUrl, setBankReceiptUrl] = useState("");
  const [bankReceiptName, setBankReceiptName] = useState("");
  const [bankReceiptUploading, setBankReceiptUploading] = useState(false);
  const [bankReceiptError, setBankReceiptError] = useState("");
  const [bankTxnRef, setBankTxnRef] = useState("");
  const [bankRefInput, setBankRefInput] = useState("");   // user-entered txn reference for bank transfer
  const [ussdBank, setUssdBank] = useState("");
  const [ussdRef, setUssdRef] = useState("");
  const [ussdSaved, setUssdSaved] = useState(false);

  // Simple payment modal state (Additional Contributions)
  const [showSimplePay, setShowSimplePay] = useState(false);
  const [simplePayItem, setSimplePayItem] = useState<{ label: string; price: string; desc: string; icon: string } | null>(null);
  const [simplePayStep, setSimplePayStep] = useState<1 | 2 | 3>(1);
  const [simplePayData, setSimplePayData] = useState({ name: "", email: "", amount: "", description: "" });
  const [simplePayErr, setSimplePayErr] = useState("");
  const [formData, setFormData] = useState({
    fullName: "", mobile: "", email: "", email2: "", state: "", category: "",
    password: "", confirmPassword: "",
    ref1Name: "", ref1Email: "", ref1Mobile: "",
    ref2Name: "", ref2Email: "", ref2Mobile: "",
    statement: "", agreed: false,
    institution: "", programme: "", graduationDate: "", admissionLetter: "",
  });

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      setFormData(prev => ({ ...prev, category: plan }));
      setStep(1);
      setShowForm(true);
    }
  }, [searchParams]);

  const selectPlan = (tier: string) => {
    setFormData(prev => ({ ...prev, category: tier }));
    setStep(1);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setStep(1);
    setPaymentDone(false);
    setCardData({ name: "", number: "", expiry: "", cvv: "" });
    setCardError("");
    setPaymentMethod(null);
    setBankReceiptUrl("");
    setBankReceiptName("");
    setBankReceiptUploading(false);
    setBankReceiptError("");
    setBankTxnRef("");
    setBankRefInput("");
    setUssdBank("");
    setUssdRef("");
    setUssdSaved(false);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleCardPay = () => {
    const rawNumber = cardData.number.replace(/\s/g, "");
    if (!cardData.name.trim()) { setCardError("Please enter the cardholder name."); return; }
    if (rawNumber.length < 16) { setCardError("Please enter a valid 16-digit card number."); return; }
    if (!cardData.expiry.match(/^\d{2}\/\d{2}$/)) { setCardError("Please enter expiry date as MM/YY."); return; }
    const [mm] = cardData.expiry.split("/").map(Number);
    if (mm < 1 || mm > 12) { setCardError("Expiry month must be between 01 and 12."); return; }
    if (cardData.cvv.length < 3) { setCardError("Please enter a valid 3 or 4-digit CVV."); return; }
    setCardError("");
    handlePaystack();
  };

  const openSimplePay = (item: typeof otherPayments[0]) => {
    setSimplePayItem(item);
    setSimplePayData({
      name: "",
      email: "",
      amount: item.price === "Open Amount" ? "" : item.price.replace("₦", "").replace(/,/g, ""),
      description: "",
    });
    setSimplePayErr("");
    setSimplePayStep(1);
    setShowSimplePay(true);
  };

  const closeSimplePay = () => {
    setShowSimplePay(false);
    setSimplePayStep(1);
  };

  const handleSimplePayProceed = () => {
    if (!simplePayData.name.trim()) { setSimplePayErr("Please enter your full name."); return; }
    if (!simplePayData.email.trim()) { setSimplePayErr("Please enter your email address."); return; }
    if (!simplePayData.amount || isNaN(Number(simplePayData.amount.replace(/,/g, ""))) || Number(simplePayData.amount.replace(/,/g, "")) <= 0) {
      setSimplePayErr("Please enter a valid amount."); return;
    }
    setSimplePayErr("");
    setSimplePayStep(2);
  };

  const saveSimpleTransaction = (ref: string, method: string, status: string) => {
    setSimplePayTxnRef(ref);
    setSimpleReceiptUrl("");
    setSimpleReceiptName("");
    transactionService.create({
      payment_ref: ref,
      member_name: simplePayData.name,
      email: simplePayData.email,
      membership_type: simplePayItem?.label || "",
      amount: `₦${Number(simplePayData.amount.replace(/,/g, "")).toLocaleString()}`,
      currency: "NGN",
      payment_method: method,
      status,
      type: "contribution",
      description: simplePayData.description || "",
    }).catch(() => {});
  };

  const handleSimpleReceiptUpload = async (file: File) => {
    setSimpleReceiptUploading(true);
    setSimpleReceiptError("");
    try {
      const ext = file.name.split(".").pop();
      const fileName = `receipts/contrib-${simplePayTxnRef || Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("receipts").upload(fileName, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from("receipts").getPublicUrl(fileName);
      setSimpleReceiptUrl(publicUrl);
      setSimpleReceiptName(file.name);
      if (simplePayTxnRef) {
        transactionService.updateReceiptByRef(simplePayTxnRef, publicUrl, file.name).catch(() => {});
      }
      toast.success("Receipt uploaded!");
    } catch {
      setSimpleReceiptError("Upload failed. Ensure a 'receipts' bucket exists in Supabase, or email receipt to info@nasmed.org.");
    } finally {
      setSimpleReceiptUploading(false);
    }
  };

  const handleSimplePaystack = () => {
    const amountKobo = Math.round(Number(simplePayData.amount.replace(/,/g, "")) * 100);
    if (!amountKobo || amountKobo <= 0) { toast.error("Invalid amount."); return; }
    const popup = new PaystackPop();
    popup.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string,
      email: simplePayData.email,
      amount: amountKobo,
      currency: "NGN",
      metadata: { full_name: simplePayData.name, payment_type: simplePayItem?.label },
      onSuccess: (transaction: Record<string, unknown>) => {
        const ref = (transaction?.reference as string) || ("PSK-" + Date.now());
        saveSimpleTransaction(ref, "Paystack", "confirmed");
        toast.success("Payment successful! Thank you.");
        setSimplePayStep(3);
      },
      onCancel: () => { toast.error("Payment cancelled."); },
    });
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.category) {
      toast.error("Please complete all required fields.");
      setStep(1);
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      setStep(1);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setStep(1);
      return;
    }
    if (!formData.agreed) {
      toast.error("Please agree to the declarations before submitting.");
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const app = await applicationService.create({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.mobile,
        profession: formData.category,
        membership_type: formData.category,
        state: formData.state,
        qualifications: "",
        workplace: "",
        referee1_name: formData.ref1Name || "",
        referee1_email: formData.ref1Email || "",
        referee1_phone: formData.ref1Mobile || "",
        referee2_name: formData.ref2Name || "",
        referee2_email: formData.ref2Email || "",
        referee2_phone: formData.ref2Mobile || "",
        statement: formData.statement,
      });
      setCurrentAppId(app.id);

      // Create Supabase auth account — best-effort, never blocks submission
      authService.signUp(formData.email, formData.password, formData.fullName, formData.category)
        .then(({ error }) => {
          if (error && !error.toLowerCase().includes("already registered")) {
            console.warn("Supabase account creation failed:", error);
          } else {
            authService.setInitialUsername(formData.email, formData.fullName).catch(() => {});
          }
        })
        .catch(() => {});

      toast.success("Application submitted! Please complete your payment.");
      setStep(5);
    } catch (err: unknown) {
      // Supabase throws PostgrestError objects — extract code + message
      const supaErr = err as Record<string, unknown>;
      const code = typeof supaErr?.code === 'string' ? supaErr.code : '';
      const msg = typeof supaErr?.message === 'string'
        ? supaErr.message
        : err instanceof Error ? err.message : String(err);

      console.error('Application submission error:', { code, msg, raw: err });

      if (code === '42P01' || msg.toLowerCase().includes('relation') || msg.toLowerCase().includes('does not exist')) {
        // PostgreSQL 42P01 = undefined_table
        toast.error(
          'The "applications" table is missing from your Supabase database. Run supabase-complete-setup.sql in your Supabase SQL editor, then try again.',
          { duration: 10000 }
        );
      } else if (code === '42501' || code === 'PGRST301' || msg.toLowerCase().includes('row-level security') || msg.toLowerCase().includes('permission denied')) {
        // RLS blocking the insert
        toast.error(
          'Database permission denied. The RLS policy on the applications table may be missing. Run supabase-complete-setup.sql again.',
          { duration: 10000 }
        );
      } else if (code === '23505' || msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
        toast.error('An application with this email already exists. Contact info@nasmed.org if this is a mistake.');
      } else if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
        toast.error('Network error — check your internet connection and try again.');
      } else {
        // Show the real Supabase error so the user can report it
        toast.error(`Submission failed (${code || 'ERR'}): ${msg.slice(0, 200)}`, { duration: 10000 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const allPlans = [
    ...membershipPlans,
    ...otherPayments.map(o => ({ tier: o.label, price: o.price, period: "", currency: "NGN", tag: "", features: [], featured: false })),
  ];
  const planPrice = allPlans.find(p => p.tier === formData.category)?.price ?? "";

  const planAmountKobo: Record<string, number> = {
    "Student Membership": 250000,
    "Associate Member": 15000000,
    "Individual Member": 2500000,
    "Professional Member": 4500000,
    "Fellow (FNASMED)": 25000000,
    "International Membership": 5000,   // $50 in USD cents
    "Annual Dues": 2500000,
  };

  const saveTransaction = (ref: string, method: string, status: string) => {
    transactionService.create({
      payment_ref: ref,
      member_name: formData.fullName,
      email: formData.email,
      membership_type: formData.category,
      amount: planPrice,
      currency: formData.category === "International Membership" ? "USD" : "NGN",
      payment_method: method,
      status,
      type: "membership",
      description: "",
      application_id: currentAppId || undefined,
    }).catch(() => {});
    if (currentAppId && status === "confirmed") {
      applicationService.updatePayment(currentAppId, ref, method).catch(() => {});
    }
  };

  const handleBankReceiptUpload = async (file: File) => {
    setBankReceiptUploading(true);
    setBankReceiptError("");
    try {
      const ext = file.name.split(".").pop();
      const ref = bankRefInput.trim() || `BNK-${currentAppId || Date.now()}`;
      setBankTxnRef(ref);
      const fileName = `receipts/member-${ref}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("receipts").upload(fileName, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from("receipts").getPublicUrl(fileName);
      setBankReceiptUrl(publicUrl);
      setBankReceiptName(file.name);
      saveTransaction(ref, "Bank Transfer", "awaiting_confirmation");
      toast.success("Receipt uploaded! Admin will verify and activate your membership.");
    } catch {
      setBankReceiptError("Upload failed. Ensure a 'receipts' storage bucket exists in Supabase, or email your receipt to info@nasmed.org.");
    } finally {
      setBankReceiptUploading(false);
    }
  };

  const handlePaystack = () => {
    const isInternational = formData.category === "International Membership";
    const amount = planAmountKobo[formData.category];
    if (!amount) { toast.error("Please select a valid membership plan."); return; }

    const popup = new PaystackPop();
    popup.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string,
      email: formData.email,
      amount,
      currency: isInternational ? "USD" : "NGN",
      metadata: { full_name: formData.fullName, membership_type: formData.category },
      onSuccess: (transaction: Record<string, unknown>) => {
        const ref = (transaction?.reference as string) || ("PSK-" + Date.now());
        saveTransaction(ref, "Paystack", "confirmed");
        setPaymentDone(true);
        toast.success("Payment successful! Your membership will be activated shortly.");
        setStep(6);
      },
      onCancel: () => {
        toast.error("Payment cancelled.");
      },
    });
  };

  const wordCount = formData.statement.trim().split(/\s+/).filter(w => w).length;

  return (
    <div>
      <PageHeader breadcrumb="HOME / MEMBERSHIP" title="Membership" subtitle="Join NASMED and become part of Nigeria's leading sports medicine community" />

      {/* Benefits CTA Banner */}
      <section className="bg-gradient-to-br from-nasmed-navy via-[#163060] to-[#0d2044] py-16 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(13,153,102,0.18),transparent_70%)]" />
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-[1]">
          <div>
            <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-xs font-bold tracking-[1.5px] uppercase py-1.5 px-4 rounded-full mb-5">Member Benefits</span>
            <h2 className="font-heading text-white font-bold leading-tight mb-4" style={{ fontSize: 'clamp(24px, 3vw, 38px)' }}>
              Why Join NASMED?
            </h2>
            <p className="text-white/65 text-[15px] leading-relaxed">Unlock a world of professional growth, research access, and collaborative opportunities.</p>
          </div>
          <div className="flex flex-col gap-3.5">
            {["Access to peer-reviewed research & journals", "Accredited CPD programmes nationwide", "International networking opportunities", "Professional recognition & career support"].map((c) => (
              <div key={c} className="flex items-center gap-3 text-white/85 text-[15px]">
                <span className="w-7 h-7 rounded-full bg-nasmed-green text-white flex items-center justify-center text-[13px] font-bold shrink-0">✓</span>
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="bg-nasmed-off-white py-20 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl overflow-hidden shadow-md border border-nasmed-gray-light transition-all hover:-translate-y-1.5 hover:shadow-xl flex flex-col">
                <div className={`p-7 flex items-center justify-center bg-gradient-to-br ${b.gradient}`}>
                  <span className="text-4xl drop-shadow-lg">{b.icon}</span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-heading text-[17px] font-bold text-nasmed-navy mb-2.5 leading-snug">{b.title}</h3>
                  <p className="text-[13px] text-nasmed-text-muted leading-relaxed flex-1 mb-4">{b.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {b.tags.map((t) => (
                      <span key={t} className="bg-nasmed-gray-light text-nasmed-text-muted text-[11px] font-semibold py-0.5 px-2.5 rounded-full tracking-wide">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {/* Impact CTA card */}
            <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue rounded-2xl overflow-hidden shadow-xl flex flex-col items-center justify-center p-8 text-center">
              <div className="text-[44px] mb-3.5">🎯</div>
              <h3 className="text-white font-heading text-xl mb-3">Your Impact Starts Here</h3>
              <p className="text-white/70 text-[13px] leading-relaxed mb-5">Become a Member Today and join the leading community of professionals.</p>
              <button onClick={() => selectPlan('')} className="btn-primary border-none">Become a Member →</button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY JOIN — member benefits section */}
      <MemberBenefitsSection
        onBecomeMember={() => selectPlan("")}
        onViewPlans={() => plansRef.current?.scrollIntoView({ behavior: "smooth" })}
      />

      {/* MEMBERSHIP PLANS */}
      <section ref={plansRef} className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="section-label">Choose Your Plan</div>
        <h2 className="section-title">Membership Plans</h2>
        <p className="section-sub">Select a plan to begin your registration.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {membershipPlans.map((card) => {
            const c = planColors[card.tier];
            const isIntl = card.tier === "International Membership";
            return (
              <div key={card.tier} className={`rounded-2xl p-8 relative overflow-hidden transition-all border-[1.5px] ${c.card}`}>
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${c.topBar}`} />
                <span className={`text-[10px] font-bold tracking-[2px] uppercase py-1 px-2.5 rounded inline-block mb-4 ${c.tag}`}>{card.tag}</span>
                <h3 className={`font-heading text-[22px] font-bold mb-2 ${isIntl ? "text-white" : "text-nasmed-navy"}`}>{card.tier}</h3>
                <div className={`text-[34px] font-bold my-2.5 ${c.price}`}>
                  {card.price}<span className={`text-[13px] font-normal ${isIntl ? "text-white/60" : "text-nasmed-text-muted"}`}>{card.period}</span>
                </div>
                {card.note && (
                  <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 leading-snug">
                    ⚠ {card.note}
                  </div>
                )}
                <ul className="list-none mb-7 flex flex-col gap-2.5">
                  {card.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-[13px] ${isIntl ? "text-white/75" : "text-nasmed-text-muted"}`}>
                      <span className={`font-bold text-xs ${c.check}`}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => selectPlan(card.tier)}
                  className={`block w-full text-center py-3 rounded-lg font-semibold text-[13px] transition-all border-2 cursor-pointer bg-transparent ${c.btn}`}
                >
                  Select Plan →
                </button>
              </div>
            );
          })}
        </div>

        {/* OTHER PAYMENTS */}
        <div className="mt-16">
          <div className="section-label">Other Payments</div>
          <h2 className="section-title">Additional Contributions</h2>
          <p className="section-sub">Annual dues, welfare contributions, and donations for existing and prospective members.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
            {otherPayments.map((item) => (
              <div key={item.label} className="bg-white border-[1.5px] border-nasmed-gray-light rounded-2xl p-7 hover:border-nasmed-mid-blue hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-heading text-[19px] font-bold text-nasmed-navy mb-1">{item.label}</h3>
                <div className="text-[28px] font-bold text-nasmed-mid-blue my-2">
                  {item.price === "Open Amount" ? <span className="text-[18px] text-nasmed-text-muted font-medium italic">Enter amount</span> : item.price}
                </div>
                <p className="text-[13px] text-nasmed-text-muted mb-6 leading-relaxed">{item.desc}</p>
                <button
                  onClick={() => openSimplePay(item)}
                  className="block w-full text-center py-3 rounded-lg font-semibold text-[13px] transition-all border-2 cursor-pointer border-nasmed-gray-light text-nasmed-navy hover:border-nasmed-mid-blue hover:text-nasmed-mid-blue bg-transparent"
                >
                  Pay Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="bg-nasmed-navy py-10 px-6 md:px-12 grid grid-cols-2 md:grid-cols-4">
        {[
          { num: "7", label: "Core Member Benefits" },
          { num: "1,400+", label: "Active Members Nationwide" },
          { num: "36", label: "States Represented" },
          { num: "35+", label: "Years of Excellence" },
        ].map((s, i) => (
          <div key={i} className={`text-center px-5 ${i < 3 ? "border-r border-white/10" : ""}`}>
            <div className="font-heading text-4xl font-bold text-nasmed-green-light leading-none mb-1.5">{s.num}</div>
            <div className="text-white/50 text-[13px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* REGISTRATION FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[1100] flex items-start justify-center pt-[90px] pb-8 px-4 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeForm} />

          {/* Modal content */}
          <div className="relative z-10 w-full max-w-[900px] animate-scale-in">
            {/* Close button */}
            <button
              onClick={closeForm}
              className="absolute -top-2 -right-2 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-nasmed-navy hover:bg-nasmed-off-white transition-colors cursor-pointer text-lg font-bold border-none"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <h2 className="font-heading text-white text-[28px] font-bold mb-2">NASMED Membership Application</h2>
              <p className="text-white/60 text-[14px]">
                {formData.category ? `Applying for: ${formData.category}` : "Complete the form below to apply"}
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-6 gap-0">
              {["Contact Details", "Qualifications", "Eligibility", "Review", "Payment"].map((label, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => i + 1 <= step && i + 1 < 5 && setStep(i + 1)}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[15px] border-2 transition-all ${
                      i + 1 === step ? "bg-nasmed-mid-blue text-white border-nasmed-mid-blue shadow-[0_0_16px_rgba(42,100,180,0.4)]" :
                      i + 1 < step ? "bg-nasmed-green text-white border-nasmed-green" :
                      "bg-white/10 text-white/40 border-white/20"
                    }`}>
                      {i + 1 < step ? "✓" : ["A", "B", "C", "✓", "💳"][i]}
                    </div>
                    <span className={`text-xs font-semibold tracking-wide hidden md:block ${
                      i + 1 <= step ? "text-white" : "text-white/30"
                    }`}>{label}</span>
                  </div>
                  {i < 4 && <div className={`flex-1 h-0.5 mx-2 mb-5 max-w-[60px] transition-colors ${i + 1 < step ? "bg-nasmed-green" : "bg-white/15"}`} />}
                </div>
              ))}
            </div>

            {step === 6 ? (
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-blue p-7">
                  <span className="inline-block bg-nasmed-green/30 text-nasmed-green-light text-[11px] font-bold tracking-[2px] uppercase py-1 px-3 rounded mb-3">Payment Received</span>
                  <h3 className="text-white font-heading text-[22px] mb-1.5">🎉 Application Submitted!</h3>
                  <p className="text-white/65 text-[13px]">Your payment has been recorded. Admin will verify and confirm your registration.</p>
                </div>
                <div className="p-8 flex flex-col items-center gap-6">
                  {/* Status indicator */}
                  <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-4xl">
                    ⏳
                  </div>
                  <div className="text-center max-w-[480px]">
                    <h4 className="font-heading text-nasmed-navy text-[20px] font-bold mb-3">Pending Admin Verification</h4>
                    <p className="text-[14px] text-nasmed-text-muted leading-relaxed">
                      Thank you, <strong>{formData.fullName}</strong>. Your payment and application are now under review by the NASMED admin team.
                    </p>
                  </div>

                  {/* Steps */}
                  <div className="w-full max-w-[440px] flex flex-col gap-3">
                    {[
                      { icon: "✅", label: "Payment recorded", done: true },
                      { icon: "🔍", label: "Admin verifies payment & registration", done: false },
                      { icon: "📧", label: "Membership certificate sent to your email", done: false },
                    ].map((s, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.done ? "bg-nasmed-green/8 border-nasmed-green/30" : "bg-nasmed-off-white border-nasmed-gray-light"}`}>
                        <span className="text-xl shrink-0">{s.icon}</span>
                        <span className={`text-[13px] font-semibold ${s.done ? "text-nasmed-green" : "text-nasmed-text-muted"}`}>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-nasmed-mid-blue/5 border border-nasmed-mid-blue/20 rounded-xl p-4 text-[13px] text-nasmed-text-muted text-center leading-relaxed max-w-[440px]">
                    Your membership certificate will be <strong>emailed to {formData.email}</strong> once your payment is confirmed and registration approved by admin (typically within <strong>5–10 business days</strong>).
                  </div>
                </div>
                <div className="flex items-center justify-end px-7 py-4 border-t border-nasmed-gray-light bg-nasmed-off-white">
                  <button onClick={closeForm} className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-sm font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all">
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-blue p-7">
                  <span className="inline-block bg-nasmed-green/30 text-nasmed-green-light text-[11px] font-bold tracking-[2px] uppercase py-1 px-3 rounded mb-3">
                    {step === 5 ? "Payment" : `Section ${["A", "B", "C", "Review"][step - 1]}`}
                  </span>
                  <h3 className="text-white font-heading text-[22px] mb-1.5">
                    {["Contact Details & General Statement", "Educational Qualifications", "Executive Eligibility", "Review & Submit", "Complete Your Payment"][step - 1]}
                  </h3>
                  <p className="text-white/65 text-[13px]">
                    {["To be completed by all applicants", "Maximum 50 points in this category", "For Executive Pathway applicants", "Please review your information", "Choose a payment method to activate your membership"][step - 1]}
                  </p>
                </div>

                <div className="p-9 max-h-[50vh] overflow-y-auto">
                  {step === 1 && (
                    <div className="space-y-6">
                      <h4 className="text-[15px] font-bold text-nasmed-navy pb-2.5 border-b-2 border-nasmed-gray-light">1. Candidate Contact Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-full flex flex-col gap-1.5">
                          <label className="text-[13px] font-semibold text-nasmed-navy">Full Name <span className="text-red-600">*</span></label>
                          <input type="text" value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="e.g. Dr. John Adebayo" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-semibold text-nasmed-navy">Mobile Number <span className="text-red-600">*</span></label>
                          <input type="tel" value={formData.mobile} onChange={e => updateField('mobile', e.target.value)} placeholder="+234 xxx xxx xxxx" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-semibold text-nasmed-navy">Email <span className="text-red-600">*</span></label>
                          <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="your@email.com" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                        </div>

                        {/* Login password — spans full row */}
                        <div className="col-span-full">
                          <div className="flex items-center gap-3 my-1">
                            <div className="h-px flex-1 bg-nasmed-gray-light" />
                            <span className="text-[11px] font-bold text-nasmed-text-muted uppercase tracking-widest">Create Your Login Password</span>
                            <div className="h-px flex-1 bg-nasmed-gray-light" />
                          </div>
                          <p className="text-[12px] text-nasmed-text-muted mt-1 mb-3">You'll use this email + password to log into your member dashboard after approval.</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-semibold text-nasmed-navy">Password <span className="text-red-600">*</span></label>
                          <input type="password" value={formData.password} onChange={e => updateField('password', e.target.value)} placeholder="Min 8 characters" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-semibold text-nasmed-navy">Confirm Password <span className="text-red-600">*</span></label>
                          <input type="password" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} placeholder="Repeat your password" className={`py-2.5 px-3.5 border-[1.5px] rounded-lg text-sm outline-none transition-colors ${formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-red-400 focus:border-red-500" : "border-nasmed-gray-light focus:border-nasmed-mid-blue"}`} />
                          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="text-[11px] text-red-500">Passwords do not match</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-semibold text-nasmed-navy">State of Practice <span className="text-red-600">*</span></label>
                          <select value={formData.state} onChange={e => updateField('state', e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors">
                            <option value="">— Select State —</option>
                            {nigerianStates.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-semibold text-nasmed-navy">Membership Category <span className="text-red-600">*</span></label>
                          <select value={formData.category} onChange={e => updateField('category', e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors">
                            <option value="">— Select Category —</option>
                            <option>Student Membership</option>
                            <option>Associate Member</option>
                            <option>Individual Member</option>
                            <option>Fellow (FNASMED)</option>
                            <option>International Membership</option>
                          </select>

                          {/* Student-specific fields */}
                          {formData.category === "Student Membership" && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg space-y-4">
                              <p className="text-[12px] text-yellow-800 font-semibold">🎓 Student Membership is for undergraduate programmes only. Postgraduate or other students must register as Individual Member. Your membership expires at the end of your programme. An admission letter is required.</p>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-nasmed-navy">Institution / University <span className="text-red-600">*</span></label>
                                <input type="text" value={formData.institution || ""} onChange={e => updateField('institution', e.target.value)} placeholder="e.g. University of Lagos" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-nasmed-navy">Undergraduate Programme <span className="text-red-600">*</span></label>
                                <input type="text" value={formData.programme || ""} onChange={e => updateField('programme', e.target.value)} placeholder="e.g. MBBS, BSc Sports Science, BPharm" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-nasmed-navy">Expected Graduation Date <span className="text-red-600">*</span></label>
                                <input type="month" value={formData.graduationDate || ""} onChange={e => updateField('graduationDate', e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-nasmed-navy">Admission Letter <span className="text-red-600">*</span></label>
                                <label className={`flex items-center gap-3 py-3 px-4 border-[1.5px] border-dashed rounded-lg cursor-pointer transition-all ${formData.admissionLetter ? "border-yellow-400 bg-yellow-50" : "border-nasmed-gray-light hover:border-yellow-400"}`}>
                                  <span className="text-xl">{formData.admissionLetter ? "📄" : "📎"}</span>
                                  <div className="flex-1 min-w-0">
                                    {formData.admissionLetter
                                      ? <p className="text-sm font-semibold text-nasmed-navy truncate">{formData.admissionLetter}</p>
                                      : <><p className="text-sm text-nasmed-text-muted">Upload admission letter (JPG, PNG, PDF)</p><p className="text-xs text-nasmed-text-muted">Must clearly show your name, institution & programme</p></>
                                    }
                                  </div>
                                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={e => updateField('admissionLetter', e.target.files?.[0]?.name || "")} />
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <h4 className="text-[15px] font-bold text-nasmed-navy pb-2.5 border-b-2 border-nasmed-gray-light mt-8">2. Candidate Statement</h4>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-nasmed-navy">Professional Statement <span className="text-red-600">*</span></label>
                        <textarea value={formData.statement} onChange={e => updateField('statement', e.target.value)} rows={5} placeholder="Describe your contribution to sports medicine..." className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors resize-y" />
                        <div className={`text-right text-xs ${wordCount > 200 ? "text-red-600" : "text-nasmed-gray"}`}>{wordCount} / 200 words</div>
                      </div>

                      <div className="bg-nasmed-mid-blue/5 border border-nasmed-mid-blue/15 rounded-xl p-6 mt-6">
                        <h4 className="text-nasmed-navy text-sm font-bold mb-3.5">Signed Declaration</h4>
                        <label className="flex items-start gap-2.5 text-[13px] text-nasmed-text-muted cursor-pointer font-bold">
                          <input type="checkbox" checked={formData.agreed} onChange={e => updateField('agreed', e.target.checked)} className="w-4 h-4 mt-0.5 accent-nasmed-green" />
                          <span className="text-nasmed-navy text-sm">Yes, I agree with all declarations and confirm information is accurate.</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="bg-nasmed-green/5 border border-nasmed-green/20 rounded-lg p-4 text-[13px] text-nasmed-text-muted leading-relaxed">
                        <strong>Eligible Fields:</strong> Clinical medicine, dentistry, pharmacy, nursing; Allied medical disciplines; Physiotherapy; Health & Physical Education; Occupational & Rehabilitation practitioners.
                      </div>
                      <h4 className="text-[15px] font-bold text-nasmed-navy pb-2.5 border-b-2 border-nasmed-gray-light">B1 — Higher Education Qualifications</h4>
                      <p className="text-[13px] text-nasmed-text-muted">Enter your qualifications, awarding institution, and year. Maximum 50 points total.</p>
                      {["Unit of Study (3pts)", "Associate Degree (5pts)", "Bachelor's Degree (10pts)", "Master's Degree (30pts)", "Doctorate (40pts)"].map((q) => (
                        <div key={q} className="flex gap-3 items-start bg-nasmed-off-white p-4 rounded-lg border border-nasmed-gray-light">
                          <div className="flex-[3] text-[13px] font-semibold text-nasmed-navy">{q}</div>
                          <textarea className="flex-[3] py-2 px-2.5 border-[1.5px] border-nasmed-gray-light rounded-md text-[13px] resize-y outline-none focus:border-nasmed-mid-blue" rows={2} placeholder="Institution, qualification, year..." />
                          <input type="number" className="w-[60px] py-2 border-[1.5px] border-nasmed-gray-light rounded-md text-sm font-bold text-center outline-none focus:border-nasmed-green" min={0} placeholder="0" />
                        </div>
                      ))}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="bg-nasmed-green/5 border border-nasmed-green/20 rounded-lg p-4 text-[13px] text-nasmed-text-muted leading-relaxed">
                        <strong>Associate Members:</strong> Exclusive to organisations in eligible sports medicine fields.<br />
                        <strong>Honorary Members:</strong> By appointment for persons who have rendered exceptional services.
                      </div>
                      <h4 className="text-[15px] font-bold text-nasmed-navy pb-2.5 border-b-2 border-nasmed-gray-light">1. Place of Work / Organisation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-full flex flex-col gap-1.5">
                          <label className="text-[13px] font-semibold text-nasmed-navy">Organisation Name</label>
                          <input type="text" placeholder="Hospital, clinic, institution, or sports organisation" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-semibold text-nasmed-navy">Your Job Title / Role</label>
                          <input type="text" placeholder="e.g. Chief Sports Physician" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-semibold text-nasmed-navy">Organisation Type</label>
                          <select className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors">
                            <option value="">— Select Type —</option>
                            <option>Hospital / Clinic</option>
                            <option>Academic / Research Institution</option>
                            <option>Sports Organisation</option>
                            <option>Ministry of Health</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-4">
                        <label className="text-[13px] font-semibold text-nasmed-navy">Supporting Statement (optional)</label>
                        <textarea rows={4} placeholder="Provide any additional context..." className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors resize-y" />
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-4">
                      <div className="bg-nasmed-off-white border border-nasmed-gray-light rounded-[10px] p-5">
                        <h4 className="text-[13px] font-bold text-nasmed-mid-blue tracking-wide uppercase mb-3 pb-2 border-b border-nasmed-gray-light">Section A — Contact Details</h4>
                        {[
                          ["Full Name", formData.fullName],
                          ["Email", formData.email],
                          ["Login Password", formData.password ? "••••••••" : "—"],
                          ["Mobile", formData.mobile],
                          ["State", formData.state],
                          ["Category", formData.category],
                        ].map(([label, value]) => (
                          <div key={label} className="flex gap-4 text-[13px] mb-2">
                            <span className="text-nasmed-gray min-w-[140px]">{label}:</span>
                            <span className="text-nasmed-text font-medium">{value || "—"}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-nasmed-green/5 border border-nasmed-green/25 rounded-xl p-6 mt-7">
                        <h4 className="text-nasmed-green text-sm font-bold mb-3">✓ Final Confirmation</h4>
                        <p className="text-[13px] text-nasmed-text-muted leading-relaxed">By clicking "Submit Application" you confirm that all information provided is accurate and you agree to all declarations.</p>
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-5">

                      {/* Amount due */}
                      {planPrice && (
                        <div className="bg-nasmed-navy/5 border border-nasmed-navy/15 rounded-xl p-4 flex items-center justify-between">
                          <span className="text-[13px] text-nasmed-text-muted font-medium">Amount due — {formData.category}</span>
                          <span className="text-[24px] font-bold text-nasmed-navy">{planPrice}</span>
                        </div>
                      )}

                      {/* Required payment notice */}
                      <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <span className="text-lg shrink-0">🔒</span>
                        <p className="text-[12px] text-red-700 font-semibold leading-relaxed">Payment is required to complete registration. Your application will not be submitted without a confirmed payment or uploaded proof of payment.</p>
                      </div>

                      {/* Success banners */}
                      {paymentDone && (
                        <div className="flex items-center gap-3 bg-nasmed-green/10 border-2 border-nasmed-green/40 rounded-xl p-4">
                          <span className="text-2xl">✅</span>
                          <div>
                            <p className="text-[14px] font-bold text-nasmed-green">Online Payment Successful!</p>
                            <p className="text-[12px] text-nasmed-green/80">Click Continue below to complete your registration.</p>
                          </div>
                        </div>
                      )}
                      {bankReceiptUrl && (
                        <div className="flex items-center gap-3 bg-nasmed-green/10 border-2 border-nasmed-green/40 rounded-xl p-4">
                          <span className="text-2xl">📄</span>
                          <div>
                            <p className="text-[14px] font-bold text-nasmed-green">Receipt Uploaded — {bankReceiptName}</p>
                            <p className="text-[12px] text-nasmed-green/80">Ref: {bankTxnRef || bankRefInput} · Admin will verify and activate your membership.</p>
                          </div>
                        </div>
                      )}
                      {ussdSaved && (
                        <div className="flex items-center gap-3 bg-nasmed-green/10 border-2 border-nasmed-green/40 rounded-xl p-4">
                          <span className="text-2xl">📱</span>
                          <div>
                            <p className="text-[14px] font-bold text-nasmed-green">USSD Payment Recorded!</p>
                            <p className="text-[12px] text-nasmed-green/80">Ref: {ussdRef} · Admin will verify and activate your membership.</p>
                          </div>
                        </div>
                      )}

                      {!paymentDone && !bankReceiptUrl && !ussdSaved && (
                        <>
                          {/* Payment method selector */}
                          <div>
                            <p className="text-[13px] font-bold text-nasmed-navy mb-3">Choose Payment Method <span className="text-red-500">*</span></p>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { method: 'paystack' as const, icon: '💳', label: 'Pay Online', desc: 'Card · Bank · Transfer' },
                                { method: 'bank_transfer' as const, icon: '🏦', label: 'Bank Transfer', desc: 'Upload receipt + ref' },
                                { method: 'ussd' as const, icon: '📱', label: 'USSD', desc: 'Dial shortcode & enter ref' },
                              ].map(opt => (
                                <button
                                  key={opt.method}
                                  type="button"
                                  onClick={() => setPaymentMethod(opt.method)}
                                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer bg-transparent ${paymentMethod === opt.method ? 'border-nasmed-mid-blue bg-nasmed-mid-blue/5 shadow-sm' : 'border-nasmed-gray-light hover:border-nasmed-mid-blue/50'}`}
                                >
                                  <div className="text-2xl mb-1.5">{opt.icon}</div>
                                  <div className="font-bold text-[13px] text-nasmed-navy">{opt.label}</div>
                                  <div className="text-[11px] text-nasmed-text-muted mt-0.5">{opt.desc}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* ── Paystack (Online Card/Bank) ── */}
                          {paymentMethod === 'paystack' && (
                            <div className="border-2 border-[#0BA4DB] rounded-2xl overflow-hidden">
                              <div className="bg-gradient-to-r from-[#0BA4DB] to-[#0781b0] px-5 py-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-[20px]">💳</span>
                                  <span className="font-bold text-[14px] text-white">Secure Online Payment via Paystack</span>
                                </div>
                                <div className="flex gap-1.5">
                                  <div className="bg-white/20 text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide">VISA</div>
                                  <div className="bg-white/20 text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide">MC</div>
                                  <div className="bg-white/20 text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide">VERVE</div>
                                </div>
                              </div>
                              <div className="p-6 flex flex-col gap-4 bg-white">
                                <p className="text-[13px] text-nasmed-text-muted leading-relaxed">Paystack securely handles your payment. You can pay with <strong>debit/credit card</strong>, <strong>bank transfer</strong>, or <strong>USSD</strong> through the Paystack checkout.</p>

                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[12px] font-bold text-nasmed-navy uppercase tracking-wide">Cardholder / Account Name <span className="text-red-500">*</span></label>
                                  <input type="text" value={cardData.name} onChange={e => setCardData(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" className="py-3 px-4 border-2 border-nasmed-gray-light rounded-lg text-[14px] outline-none focus:border-[#0BA4DB] transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[12px] font-bold text-nasmed-navy uppercase tracking-wide">Card Number (optional — for reference)</label>
                                  <div className="relative">
                                    <input type="text" inputMode="numeric" value={cardData.number} onChange={e => setCardData(p => ({ ...p, number: formatCardNumber(e.target.value) }))} placeholder="0000  0000  0000  0000" maxLength={19} className="w-full py-3 px-4 pr-12 border-2 border-nasmed-gray-light rounded-lg text-[15px] font-mono tracking-widest outline-none focus:border-[#0BA4DB] transition-colors" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[18px] opacity-40">💳</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[12px] font-bold text-nasmed-navy uppercase tracking-wide">Expiry Date</label>
                                    <input type="text" inputMode="numeric" value={cardData.expiry} onChange={e => setCardData(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} placeholder="MM / YY" maxLength={5} className="py-3 px-4 border-2 border-nasmed-gray-light rounded-lg text-[14px] font-mono outline-none focus:border-[#0BA4DB] transition-colors text-center" />
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[12px] font-bold text-nasmed-navy uppercase tracking-wide">CVV</label>
                                    <input type="password" inputMode="numeric" value={cardData.cvv} onChange={e => setCardData(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="•••" maxLength={4} className="py-3 px-4 border-2 border-nasmed-gray-light rounded-lg text-[14px] font-mono outline-none focus:border-[#0BA4DB] transition-colors text-center" />
                                  </div>
                                </div>
                                {cardError && (
                                  <div className="flex items-center gap-2 bg-red-50 border border-red-300 rounded-lg px-3 py-2.5 text-[13px] text-red-700 font-semibold">
                                    <span>⚠</span> {cardError}
                                  </div>
                                )}
                                <div className="flex items-start gap-2 text-[11px] text-nasmed-text-muted bg-nasmed-off-white rounded-lg p-3">
                                  <span className="shrink-0">🔒</span>
                                  <span>Your payment is processed securely by Paystack. NASMED does not store card information. You will be charged <strong>{planPrice}</strong> upon clicking Pay Now.</span>
                                </div>
                                <button type="button" onClick={handleCardPay} className="w-full bg-[#0BA4DB] hover:bg-[#0781b0] text-white font-bold text-[15px] py-4 rounded-xl transition-colors border-none cursor-pointer flex items-center justify-center gap-2 shadow-md">
                                  🔒 Pay {planPrice} Now →
                                </button>
                              </div>
                            </div>
                          )}

                          {/* ── Bank Transfer ── */}
                          {paymentMethod === 'bank_transfer' && (
                            <div className="space-y-4">
                              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-[12px] text-amber-800 leading-relaxed">
                                <strong>How it works:</strong> Transfer the exact amount shown above to the account below. Then enter your transaction reference and upload your receipt. Admin will verify within 3–5 business days.
                              </div>

                              {/* Bank account details */}
                              {formData.category !== "International Membership" ? (
                                <div className="border-2 border-nasmed-gray-light rounded-xl overflow-hidden">
                                  <div className="bg-gradient-to-r from-nasmed-navy to-nasmed-mid-blue px-5 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-[17px]">🏦</span>
                                      <span className="font-bold text-[14px] text-white">Naira Account (NGN)</span>
                                    </div>
                                    <span className="text-[11px] text-nasmed-green-light font-bold tracking-wide uppercase bg-nasmed-green/25 px-2.5 py-0.5 rounded-full">Local Transfer</span>
                                  </div>
                                  <div className="bg-white divide-y divide-nasmed-gray-light">
                                    {[
                                      { label: "Bank", value: BANK_ACCOUNTS.NGN.bankName, copy: false },
                                      { label: "Account Name", value: BANK_ACCOUNTS.NGN.accountName, copy: false },
                                      { label: "Account No.", value: BANK_ACCOUNTS.NGN.accountNumber, copy: true },
                                      { label: "Sort Code", value: BANK_ACCOUNTS.NGN.sortCode, copy: false },
                                    ].map(row => (
                                      <div key={row.label} className="flex items-center justify-between px-5 py-3">
                                        <span className="text-[12px] text-nasmed-text-muted font-semibold uppercase tracking-wide">{row.label}</span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[14px] font-bold text-nasmed-navy">{row.value}</span>
                                          {row.copy && (
                                            <button type="button" onClick={() => { navigator.clipboard.writeText(row.value); toast.success("Copied!"); }} className="text-[11px] text-nasmed-mid-blue font-semibold bg-nasmed-mid-blue/10 px-2 py-0.5 rounded cursor-pointer border-none hover:bg-nasmed-mid-blue/20">Copy</button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="border-2 border-amber-300 rounded-xl overflow-hidden">
                                  <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-[17px]">🌐</span>
                                      <span className="font-bold text-[14px] text-white">Dollar Account (USD)</span>
                                    </div>
                                    <span className="text-[11px] text-white font-bold tracking-wide uppercase bg-white/20 px-2.5 py-0.5 rounded-full">International</span>
                                  </div>
                                  <div className="bg-white divide-y divide-nasmed-gray-light">
                                    {[
                                      { label: "Bank", value: BANK_ACCOUNTS.USD.bankName, copy: false },
                                      { label: "Account Name", value: BANK_ACCOUNTS.USD.accountName, copy: false },
                                      { label: "Account No.", value: BANK_ACCOUNTS.USD.accountNumber, copy: true },
                                      { label: "SWIFT Code", value: BANK_ACCOUNTS.USD.swiftCode, copy: true },
                                      { label: "Sort Code", value: BANK_ACCOUNTS.USD.sortCode, copy: false },
                                    ].map(row => (
                                      <div key={row.label} className="flex items-center justify-between px-5 py-3">
                                        <span className="text-[12px] text-amber-700/70 font-semibold uppercase tracking-wide">{row.label}</span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[14px] font-bold text-amber-900">{row.value}</span>
                                          {row.copy && (
                                            <button type="button" onClick={() => { navigator.clipboard.writeText(row.value); toast.success("Copied!"); }} className="text-[11px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded cursor-pointer border-none hover:bg-amber-200">Copy</button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* User-entered transfer details */}
                              <div className="border-2 border-nasmed-green/30 rounded-xl overflow-hidden bg-white">
                                <div className="bg-nasmed-green/8 px-5 py-3 border-b border-nasmed-green/20">
                                  <p className="font-bold text-[14px] text-nasmed-navy">Enter Your Transfer Details <span className="text-red-500">*</span></p>
                                  <p className="text-[11px] text-nasmed-text-muted mt-0.5">Both fields are required before you can proceed.</p>
                                </div>
                                <div className="p-5 space-y-4">
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[12px] font-bold text-nasmed-navy uppercase tracking-wide">Transaction Reference / Narration <span className="text-red-500">*</span></label>
                                    <input
                                      type="text"
                                      value={bankRefInput}
                                      onChange={e => setBankRefInput(e.target.value)}
                                      placeholder="e.g. NXP/FBN/2406/123456 or your bank alert reference"
                                      className="py-3 px-4 border-2 border-nasmed-gray-light rounded-lg text-[13px] outline-none focus:border-nasmed-green transition-colors"
                                    />
                                    <p className="text-[11px] text-nasmed-text-muted">Copy the reference from your bank alert SMS or receipt.</p>
                                  </div>

                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[12px] font-bold text-nasmed-navy uppercase tracking-wide">Upload Transfer Receipt <span className="text-red-500">*</span></label>
                                    {bankReceiptName ? (
                                      <div className="flex items-center gap-3 bg-nasmed-green/10 border-2 border-nasmed-green/30 rounded-xl p-3.5">
                                        <span className="text-xl">{bankReceiptName.endsWith(".pdf") ? "📋" : "🖼️"}</span>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-[13px] font-semibold text-nasmed-navy truncate">{bankReceiptName}</p>
                                          <p className="text-[11px] text-nasmed-green font-semibold">✓ Receipt uploaded</p>
                                        </div>
                                        <label className="text-[11px] text-nasmed-mid-blue font-semibold bg-nasmed-mid-blue/10 px-2.5 py-1 rounded cursor-pointer hover:bg-nasmed-mid-blue/20">
                                          Change
                                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" disabled={bankReceiptUploading} onChange={e => { const f = e.target.files?.[0]; if (f) handleBankReceiptUpload(f); }} />
                                        </label>
                                      </div>
                                    ) : (
                                      <label className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${bankReceiptUploading ? "border-nasmed-mid-blue bg-nasmed-mid-blue/5" : !bankRefInput.trim() ? "border-nasmed-gray-light opacity-60 cursor-not-allowed" : "border-nasmed-gray-light hover:border-nasmed-green"}`}>
                                        <span className="text-2xl">{bankReceiptUploading ? "⏳" : "📎"}</span>
                                        <div className="flex-1">
                                          <p className="text-[13px] font-semibold text-nasmed-navy">
                                            {bankReceiptUploading ? "Uploading…" : !bankRefInput.trim() ? "Enter transaction reference above first" : "Click to upload your transfer receipt"}
                                          </p>
                                          <p className="text-[11px] text-nasmed-text-muted">PDF, JPG, or PNG — screenshots accepted</p>
                                        </div>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" disabled={bankReceiptUploading || !bankRefInput.trim()} onChange={e => { const f = e.target.files?.[0]; if (f) handleBankReceiptUpload(f); }} />
                                      </label>
                                    )}
                                    {bankReceiptError && <p className="text-[11px] text-red-600 mt-1">{bankReceiptError}</p>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── USSD ── */}
                          {paymentMethod === 'ussd' && (
                            <div className="space-y-4">
                              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 text-[12px] text-purple-800 leading-relaxed">
                                <strong>How it works:</strong> Dial your bank's USSD code below, complete the transfer to our account, then enter your transaction reference or confirmation code here.
                              </div>

                              {/* USSD codes table */}
                              <div className="border-2 border-purple-200 rounded-xl overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-700 to-purple-500 px-5 py-3">
                                  <p className="font-bold text-[14px] text-white">📱 USSD Codes for Nigerian Banks</p>
                                </div>
                                <div className="bg-white divide-y divide-nasmed-gray-light">
                                  {[
                                    { bank: "GTBank", code: "*737#", note: "Send Money → Other Banks" },
                                    { bank: "Zenith Bank", code: "*966#", note: "Transfer to Other Banks" },
                                    { bank: "Access Bank", code: "*901#", note: "Transfer to Other Banks" },
                                    { bank: "UBA", code: "*919#", note: "Fund Transfer" },
                                    { bank: "First Bank", code: "*894#", note: "Pay Bills → Transfers" },
                                    { bank: "Stanbic IBTC", code: "*909#", note: "Payments & Transfers" },
                                    { bank: "Sterling Bank", code: "*822#", note: "Transfer" },
                                    { bank: "Union Bank", code: "*826#", note: "Transfer Funds" },
                                  ].map(b => (
                                    <div key={b.bank} className="flex items-center justify-between px-5 py-2.5">
                                      <span className="text-[13px] font-semibold text-nasmed-navy min-w-[120px]">{b.bank}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-[15px] text-purple-700">{b.code}</span>
                                        <button type="button" onClick={() => { navigator.clipboard.writeText(b.code); toast.success(`${b.bank} USSD code copied!`); }} className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-1.5 py-0.5 rounded cursor-pointer border-none hover:bg-purple-200">Copy</button>
                                      </div>
                                      <span className="text-[11px] text-nasmed-text-muted hidden sm:block">{b.note}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="px-5 py-3 bg-amber-50 border-t border-amber-200">
                                  <p className="text-[11px] text-amber-800"><strong>Transfer to:</strong> {BANK_ACCOUNTS.NGN.accountNumber} ({BANK_ACCOUNTS.NGN.bankName}) — {BANK_ACCOUNTS.NGN.accountName} · Amount: <strong>{planPrice}</strong></p>
                                </div>
                              </div>

                              {/* USSD details entry */}
                              <div className="border-2 border-purple-300 rounded-xl overflow-hidden bg-white">
                                <div className="bg-purple-50 px-5 py-3 border-b border-purple-200">
                                  <p className="font-bold text-[14px] text-nasmed-navy">Confirm Your USSD Payment <span className="text-red-500">*</span></p>
                                  <p className="text-[11px] text-nasmed-text-muted mt-0.5">Enter the details from your USSD completion message.</p>
                                </div>
                                <div className="p-5 space-y-4">
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[12px] font-bold text-nasmed-navy uppercase tracking-wide">Your Bank <span className="text-red-500">*</span></label>
                                    <select
                                      title="Your Bank"
                                      value={ussdBank}
                                      onChange={e => setUssdBank(e.target.value)}
                                      className="py-3 px-4 border-2 border-nasmed-gray-light rounded-lg text-[13px] outline-none focus:border-purple-500 transition-colors"
                                    >
                                      <option value="">— Select your bank —</option>
                                      {["GTBank", "Zenith Bank", "Access Bank", "UBA", "First Bank", "Stanbic IBTC", "Sterling Bank", "Union Bank", "Other"].map(b => (
                                        <option key={b}>{b}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[12px] font-bold text-nasmed-navy uppercase tracking-wide">Transaction Reference / Confirmation Code <span className="text-red-500">*</span></label>
                                    <input
                                      type="text"
                                      value={ussdRef}
                                      onChange={e => setUssdRef(e.target.value)}
                                      placeholder="e.g. 000012345678 or reference from SMS"
                                      className="py-3 px-4 border-2 border-nasmed-gray-light rounded-lg text-[13px] outline-none focus:border-purple-500 transition-colors font-mono"
                                    />
                                    <p className="text-[11px] text-nasmed-text-muted">Found in the USSD completion message or bank SMS alert.</p>
                                  </div>
                                  <button
                                    type="button"
                                    disabled={!ussdBank || !ussdRef.trim()}
                                    onClick={() => {
                                      const ref = `USSD-${ussdRef.trim()}`;
                                      saveTransaction(ref, `USSD (${ussdBank})`, "awaiting_confirmation");
                                      setUssdSaved(true);
                                      toast.success("USSD payment recorded! Admin will verify and activate your membership.");
                                    }}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-bold text-[14px] py-3.5 rounded-xl transition-colors border-none cursor-pointer"
                                  >
                                    📱 Confirm USSD Payment →
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                    </div>
                  )}

                </div>

                {/* Nav buttons */}
                <div className="flex items-center justify-between p-5 bg-nasmed-off-white border-t border-nasmed-gray-light">
                  {step > 1 && step < 5 ? (
                    <button onClick={() => setStep(step - 1)} className="bg-transparent text-nasmed-text-muted border-[1.5px] border-nasmed-gray-light py-3 px-6 rounded-lg text-sm font-semibold cursor-pointer hover:border-nasmed-mid-blue hover:text-nasmed-mid-blue transition-all">← Back</button>
                  ) : <div />}
                  {step < 4 ? (
                    <button onClick={() => setStep(step + 1)} className="bg-nasmed-mid-blue text-white border-none py-3 px-7 rounded-lg text-sm font-semibold cursor-pointer hover:bg-accent transition-all">
                      Next →
                    </button>
                  ) : step === 4 ? (
                    <button onClick={handleSubmit} disabled={isSubmitting} className="bg-nasmed-green text-white border-none py-3.5 px-11 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSubmitting ? "Submitting..." : "Submit Application →"}
                    </button>
                  ) : step === 5 ? (
                    <button
                      type="button"
                      disabled={!paymentDone && !(paymentMethod === 'bank_transfer' && !!bankRefInput.trim() && !!bankReceiptUrl) && !ussdSaved}
                      onClick={() => setStep(6)}
                      title={(!paymentDone && !(paymentMethod === 'bank_transfer' && !!bankRefInput.trim() && !!bankReceiptUrl) && !ussdSaved) ? "Complete payment to proceed" : ""}
                      className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-nasmed-green-light"
                    >
                      {paymentDone ? "Continue →" : (paymentMethod === 'bank_transfer' && bankRefInput.trim() && bankReceiptUrl) || ussdSaved ? "Submit for Review →" : "🔒 Complete Payment First"}
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SIMPLE PAYMENT MODAL (Additional Contributions) ── */}
      {showSimplePay && simplePayItem && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSimplePay} />

          <div className="relative z-10 w-full max-w-[480px]">
            {/* Close */}
            <button
              onClick={closeSimplePay}
              className="absolute -top-2 -right-2 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-nasmed-navy hover:bg-nasmed-off-white transition-colors cursor-pointer text-lg font-bold border-none"
            >
              ✕
            </button>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-blue p-7">
                <div className="text-3xl mb-2">{simplePayItem.icon}</div>
                <h3 className="text-white font-heading text-[22px] mb-1">{simplePayItem.label}</h3>
                <p className="text-white/65 text-[13px]">{simplePayItem.desc}</p>
              </div>

              {/* Step 1 — Details */}
              {simplePayStep === 1 && (
                <div className="p-8 flex flex-col gap-5">
                  {simplePayErr && (
                    <div className="bg-red-500/10 text-red-600 py-2.5 px-3.5 rounded-lg text-[13px]">{simplePayErr}</div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Full Name <span className="text-red-600">*</span></label>
                    <input
                      type="text"
                      value={simplePayData.name}
                      onChange={e => setSimplePayData(p => ({ ...p, name: e.target.value }))}
                      placeholder="Your full name"
                      className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Email Address <span className="text-red-600">*</span></label>
                    <input
                      type="email"
                      value={simplePayData.email}
                      onChange={e => setSimplePayData(p => ({ ...p, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">
                      Amount (₦) <span className="text-red-600">*</span>
                      {simplePayItem.price !== "Open Amount" && (
                        <span className="ml-2 text-nasmed-green font-normal">Recommended: {simplePayItem.price}</span>
                      )}
                    </label>
                    <input
                      type="number"
                      value={simplePayData.amount}
                      onChange={e => setSimplePayData(p => ({ ...p, amount: e.target.value }))}
                      placeholder="Enter amount in Naira"
                      className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors"
                      min="1"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">
                      Purpose / Description <span className="text-nasmed-text-muted font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={simplePayData.description}
                      onChange={e => setSimplePayData(p => ({ ...p, description: e.target.value }))}
                      rows={3}
                      placeholder="Briefly describe the reason for this contribution…"
                      className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSimplePayProceed}
                    className="bg-nasmed-green text-white border-none py-3 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all w-full mt-1"
                  >
                    Proceed to Payment →
                  </button>
                </div>
              )}

              {/* Step 2 — Payment Options */}
              {simplePayStep === 2 && (
                <div className="p-8 flex flex-col gap-5">
                  <div className="bg-nasmed-navy/5 border border-nasmed-navy/15 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] text-nasmed-text-muted">{simplePayData.name} — {simplePayItem.label}</span>
                      <span className="text-[22px] font-bold text-nasmed-navy">₦{Number(simplePayData.amount).toLocaleString()}</span>
                    </div>
                    {simplePayData.description && (
                      <p className="text-[12px] text-nasmed-text-muted italic mt-1">"{simplePayData.description}"</p>
                    )}
                  </div>

                  {/* Bank Transfer */}
                  <div className="border-2 border-nasmed-gray-light rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-nasmed-navy to-nasmed-mid-blue px-5 py-3 flex items-center gap-3">
                      <span className="text-[18px]">🏦</span>
                      <span className="font-bold text-[14px] text-white">Direct Bank Transfer</span>
                    </div>
                    <div className="p-5 space-y-4">
                      {/* NGN Account */}
                      <div className="rounded-lg border border-nasmed-gray-light overflow-hidden">
                        <div className="bg-nasmed-off-white px-4 py-2 border-b border-nasmed-gray-light">
                          <span className="text-[11px] font-bold tracking-[1.5px] uppercase bg-nasmed-mid-blue/10 text-nasmed-mid-blue px-2.5 py-0.5 rounded-full">Naira Account (NGN)</span>
                        </div>
                        <div className="bg-white divide-y divide-nasmed-gray-light">
                          {[
                            { label: "Bank", value: BANK_ACCOUNTS.NGN.bankName, copy: false },
                            { label: "Account Name", value: BANK_ACCOUNTS.NGN.accountName, copy: false },
                            { label: "Account No.", value: BANK_ACCOUNTS.NGN.accountNumber, copy: true },
                            { label: "Sort Code", value: BANK_ACCOUNTS.NGN.sortCode, copy: false },
                          ].map(row => (
                            <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                              <span className="text-[12px] text-nasmed-text-muted font-semibold uppercase tracking-wide">{row.label}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-bold text-nasmed-navy">{row.value}</span>
                                {row.copy && (
                                  <button type="button" onClick={() => { navigator.clipboard.writeText(row.value); toast.success("Copied!"); }} className="text-[11px] text-nasmed-mid-blue font-semibold bg-nasmed-mid-blue/10 px-1.5 py-0.5 rounded cursor-pointer border-none hover:bg-nasmed-mid-blue/20">Copy</button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* USD Account */}
                      <div className="rounded-lg border border-amber-200 overflow-hidden">
                        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
                          <span className="text-[11px] font-bold tracking-[1.5px] uppercase bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">Dollar Account (USD)</span>
                        </div>
                        <div className="bg-white divide-y divide-nasmed-gray-light">
                          {[
                            { label: "Bank", value: BANK_ACCOUNTS.USD.bankName, copy: false },
                            { label: "Account Name", value: BANK_ACCOUNTS.USD.accountName, copy: false },
                            { label: "Account No.", value: BANK_ACCOUNTS.USD.accountNumber, copy: true },
                            { label: "SWIFT Code", value: BANK_ACCOUNTS.USD.swiftCode, copy: true },
                            { label: "Sort Code", value: BANK_ACCOUNTS.USD.sortCode, copy: false },
                          ].map(row => (
                            <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                              <span className="text-[12px] text-amber-700/70 font-semibold uppercase tracking-wide">{row.label}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-bold text-amber-900">{row.value}</span>
                                {row.copy && (
                                  <button type="button" onClick={() => { navigator.clipboard.writeText(row.value); toast.success("Copied!"); }} className="text-[11px] text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.5 rounded cursor-pointer border-none hover:bg-amber-200">Copy</button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          saveSimpleTransaction("BNK-" + Date.now(), "Bank Transfer", "awaiting_confirmation");
                          setSimplePayStep(3);
                        }}
                        className="w-full bg-nasmed-navy text-white border-none py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer hover:bg-nasmed-mid-blue transition-all"
                      >
                        I've Transferred — Upload Receipt →
                      </button>
                    </div>
                  </div>

                  {/* Paystack */}
                  <div className="border-2 border-nasmed-gray-light rounded-xl overflow-hidden">
                    <div className="bg-nasmed-off-white px-5 py-3 flex items-center gap-3 border-b border-nasmed-gray-light">
                      <span className="text-[18px]">💳</span>
                      <span className="font-bold text-[14px] text-nasmed-navy">Pay Online via Paystack</span>
                    </div>
                    <div className="p-5 flex items-center gap-4">
                      <p className="text-[13px] text-nasmed-text-muted flex-1">Pay securely with card, bank transfer, or USSD.</p>
                      <button
                        onClick={handleSimplePaystack}
                        className="shrink-0 bg-[#0BA4DB] hover:bg-[#0993c5] text-white font-semibold text-[13px] py-2.5 px-6 rounded-lg transition-colors border-none cursor-pointer"
                      >
                        Pay with Paystack →
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setSimplePayStep(1)}
                    className="text-nasmed-text-muted text-sm hover:text-nasmed-navy bg-transparent border-none cursor-pointer text-center"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {/* Step 3 — Success */}
              {simplePayStep === 3 && (
                <div className="p-8 flex flex-col gap-5">
                  <div className="text-center">
                    <div className="text-5xl mb-3">🎉</div>
                    <h3 className="font-heading text-nasmed-navy text-[22px] mb-2">Thank You!</h3>
                    <p className="text-nasmed-text-muted text-[13px] leading-relaxed">
                      Your <strong>{simplePayItem.label}</strong> payment of <strong>₦{Number(simplePayData.amount).toLocaleString()}</strong> has been recorded.
                    </p>
                    {simplePayData.description && (
                      <p className="text-[12px] text-nasmed-text-muted italic mt-1">"{simplePayData.description}"</p>
                    )}
                  </div>

                  {/* Receipt upload — shown only for bank transfers */}
                  {simplePayTxnRef.startsWith("BNK-") && (
                    <div className="border-2 border-nasmed-green/40 rounded-xl overflow-hidden">
                      <div className="bg-nasmed-green/8 px-4 py-3 flex items-center gap-2 border-b border-nasmed-green/20">
                        <span className="text-[16px]">📄</span>
                        <span className="font-bold text-[13px] text-nasmed-navy">Upload Payment Receipt <span className="font-normal text-nasmed-text-muted">(optional)</span></span>
                      </div>
                      <div className="p-4">
                        {simpleReceiptUrl ? (
                          <div className="flex items-center gap-3 bg-nasmed-green/10 border border-nasmed-green/30 rounded-lg px-3 py-2.5">
                            <span className="text-xl">{simpleReceiptName.endsWith(".pdf") ? "📋" : "🖼️"}</span>
                            <p className="text-[12px] font-semibold text-nasmed-navy flex-1 truncate">{simpleReceiptName}</p>
                            <a href={simpleReceiptUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-nasmed-mid-blue font-semibold hover:underline shrink-0">View</a>
                          </div>
                        ) : (
                          <label className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${simpleReceiptUploading ? "border-nasmed-mid-blue" : "border-nasmed-gray-light hover:border-nasmed-green"}`}>
                            <span className="text-2xl">{simpleReceiptUploading ? "⏳" : "📎"}</span>
                            <div>
                              <p className="text-[13px] font-semibold text-nasmed-navy">{simpleReceiptUploading ? "Uploading…" : "Upload bank transfer receipt"}</p>
                              <p className="text-[11px] text-nasmed-text-muted">PDF, JPG, or PNG</p>
                            </div>
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" disabled={simpleReceiptUploading} onChange={e => { const f = e.target.files?.[0]; if (f) handleSimpleReceiptUpload(f); }} />
                          </label>
                        )}
                        {simpleReceiptError && <p className="text-[11px] text-red-600 mt-2">{simpleReceiptError}</p>}
                      </div>
                    </div>
                  )}

                  <p className="text-[12px] text-nasmed-text-muted text-center">
                    A confirmation will be sent to <strong>{simplePayData.email}</strong> once payment is verified by admin.
                  </p>
                  <button
                    onClick={closeSimplePay}
                    className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-sm font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all w-full"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
