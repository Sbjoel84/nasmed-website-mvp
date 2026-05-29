import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import logo from "@/assets/nasmed-logo.png";
import authService from "@/lib/authService";
import supabase from "@/lib/supabaseClient";
import html2canvas from "html2canvas";
import emailjs from "@emailjs/browser";
import { CertificateFrame } from "@/components/MembershipCertificate";
import applicationService, { Application } from "@/services/applicationService";
import userService from "@/services/userService";
import publicationService from "@/services/publicationService";
import transactionService from "@/services/transactionService";

// ── DEMO_MEMBERS_INIT kept ONLY for the "Initialize All Accounts" one-time seeding tool ──
const DEMO_MEMBERS_INIT = [
  { id: "NASMED/24/0001", name: "Prof. Olatunde Oyebisi Makanju", username: "olatunde.makanju", email: "olatunde.makanju@yahoo.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Lagos", joined: "Jan 2024", status: "active", position: "Immediate Past President", mustChange: true },
  { id: "NASMED/24/0002", name: "Dr. Obinnaya Francis Udugwu", username: "obinnaya.udugwu", email: "obinnaya.udugwu@uniport.edu.ng", password: "nasmed2024!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Rivers", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0003", name: "Dr. Kweku Tandoh", username: "tkweks", email: "tkweks@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0004", name: "Dr. Jimi Osinaike", username: "jimisayoosinaike", email: "jimisayoosinaike@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0005", name: "Prof. Kayode Oke", username: "kayode.oke", email: "kayode.oke@uniben.edu", password: "nasmed2024!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Edo", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0006", name: "Dr. Effi Ita Usen", username: "eleknigerialtd", email: "eleknigerialtd@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Akwa Ibom", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0007", name: "Dr. Solomon Omiken Okoro", username: "omisokoro", email: "omisokoro@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0008", name: "Dr. Habu Dahiru", username: "drhabudahiru54", email: "drhabudahiru54@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Abuja (FCT)", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0009", name: "Dr. John Babatunde Akinbinu", username: "abembeinfo", email: "abembeinfo@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0010", name: "Dr. Moses Aghedo", username: "aghedomoses23", email: "aghedomoses23@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Edo", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0011", name: "Prof. Temitope Oluwagbenga Alonge", username: "temitopealonge", email: "temitopealonge@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Oyo", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0012", name: "Dr. Mazeed Alaba Oloko", username: "mazeedoloko", email: "mazeedoloko@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0013", name: "Mrs. Abimbola Olasumbo Olasupo", username: "abimbolaolasupo68", email: "abimbolaolasupo68@gmail.com", password: "nasmed2024!", prof: "Allied Health", tier: "Associate Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0014", name: "Dr. Opemipo Ade-Akingboye", username: "adeakingboyeot", email: "adeakingboyeot@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0015", name: "Dr. Michael Kayode", username: "drseyi.kayode", email: "drseyi.kayode@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0016", name: "Dr. Sikuade Oladimeji Jagun", username: "sjagun42", email: "sjagun42@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Ogun", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0017", name: "Dr. Tijjani Bashir Ibrahim", username: "teejaybash54", email: "teejaybash54@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Kano", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0018", name: "Pharm. Oluwafemi Ayorinde", username: "joayorinde2002", email: "joayorinde2002@gmail.com", password: "nasmed2024!", prof: "Pharmacist", tier: "Associate Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0019", name: "Dr. Abdulkadir Musa Mu'azu", username: "taniyare43", email: "taniyare43@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Abuja (FCT)", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0020", name: "Dr. Kolawole Mustapha", username: "mustaphaphysiotherapy", email: "mustaphaphysiotherapy@gmail.com", password: "nasmed2024!", prof: "Physiotherapist", tier: "Individual Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0021", name: "Dr. Kenechukwu John Anieze", username: "kerenke25", email: "kerenke25@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Enugu", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0022", name: "Dr. Marian Mkpo Odu", username: "mixidoo", email: "mixidoo@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Akwa Ibom", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0023", name: "Dr. Akinwumi Kolawole Amao", username: "akin.amao", email: "akin.amao@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0024", name: "PT. Oluwabunmi Michael Bamidele", username: "michealbam11", email: "michealbam11@gmail.com", password: "nasmed2024!", prof: "Physiotherapist", tier: "Associate Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0025", name: "Dr. Niran Adeniji", username: "niranadeadeniji", email: "niranadeadeniji@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0026", name: "Dr. Ummukulthoum Bakare", username: "ummubakare", email: "ummubakare@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0027", name: "Dr. Olajide Joseph Adebola", username: "oladebola", email: "oladebola@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Lagos", joined: "Jan 2024", status: "active", position: "President", mustChange: true },
  { id: "NASMED/24/0028", name: "Prof. Kenneth Anugweje", username: "kanugweje", email: "kanugweje@hotmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Rivers", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0029", name: "Dr. Olanrewaju Olabode Glover", username: "lanreglover2005", email: "lanreglover2005@yahoo.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0030", name: "Mr. Iyanuoluwa Alonge", username: "iyanuoluwaalonge", email: "iyanuoluwaalonge@gmail.com", password: "nasmed2024!", prof: "Allied Health", tier: "Associate Member", state: "Oyo", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0031", name: "Dr. Akin George", username: "akinsg2000", email: "akinsg2000@yahoo.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Lagos", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0032", name: "Dr. Henry Chidebere Uche", username: "hennolimit", email: "hennolimit@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Anambra", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0033", name: "Dr. Adebukola Olurotimi Bojuwoye", username: "jacobojuwoye", email: "jacobojuwoye@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Lagos", joined: "Jan 2024", status: "active", position: "1st Vice President", mustChange: true },
  { id: "NASMED/24/0034", name: "Mrs. Monica Peter Ekpeyong", username: "emisca2010", email: "emisca2010@yahoo.com", password: "nasmed2024!", prof: "Allied Health", tier: "Associate Member", state: "Cross River", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0035", name: "Dr. Sunday Baderinwa Adewale", username: "drbadewale", email: "drbadewale@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Ogun", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0036", name: "Dr. Sunday Onimisi Salami", username: "sunnysalami", email: "sunnysalami@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Kogi", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0037", name: "PT. Judith Amaka Enebe", username: "amakaenebe14", email: "amakaenebe14@gmail.com", password: "nasmed2024!", prof: "Physiotherapist", tier: "Associate Member", state: "Abuja (FCT)", joined: "Jan 2024", status: "active", position: "Treasurer", mustChange: true },
  { id: "NASMED/24/0038", name: "Dr. Phillip Alexander", username: "alexanderphilipomede", email: "alexanderphilipomede@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Delta", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0039", name: "Dr. Francis Onyebuchi Okanu", username: "okanuf", email: "okanuf@gmail.com", password: "nasmed2024!", prof: "Medical Doctor", tier: "Individual Member", state: "Imo", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0040", name: "PT. Ekundayo Ogunkunle", username: "ekundayoogunkunle", email: "ekundayoogunkunle@gmail.com", password: "nasmed2024!", prof: "Physiotherapist", tier: "Associate Member", state: "Ogun", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0041", name: "PT. Nnenna Ngozi Dike", username: "ngozinnenna78", email: "ngozinnenna78@gmail.com", password: "nasmed2024!", prof: "Physiotherapist", tier: "Associate Member", state: "Enugu", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
  { id: "NASMED/24/0042", name: "Mrs. Salamatu Suleiman Kpautagi", username: "salamatukpautagi", email: "salamatukpautagi@gmail.com", password: "nasmed2024!", prof: "Allied Health", tier: "Associate Member", state: "Plateau", joined: "Jan 2024", status: "active", position: "Member", mustChange: true },
];

// ── Display types matching existing JSX field references ──
interface DisplayApp {
  id: string; name: string; email: string; prof: string; tier: string;
  state: string; date: string; status: string; phone: string; altEmail: string;
  qualifications: string; workplace: string;
  referee1: { name: string; email: string; mobile: string };
  referee2: { name: string; email: string; mobile: string };
  statement: string; payment: string; submitted: string;
  receiptUrl?: string; receiptName?: string;
}

interface DisplayMember {
  id: string;   // member_number (for display)
  _dbId: string; // Supabase UUID (for DB ops)
  name: string; username: string; email: string; password: string;
  prof: string; tier: string; state: string; joined: string;
  status: string; position: string; mustChange: boolean;
}

interface DisplayPub {
  id: string; title: string; type: string; date: string;
  downloads: number; status: string; access: string; price: string; fileName: string;
}

interface DisplayTxn {
  id: string; ref: string; member: string; email: string; tier: string;
  amount: string; currency: string; method: string; status: string;
  description: string; date: string; type: string;
  receiptUrl?: string; receiptName?: string;
}

function toDisplayApp(a: Application): DisplayApp {
  return {
    id: a.id,
    name: a.full_name,
    email: a.email,
    prof: a.profession || "",
    tier: a.membership_type || "",
    state: a.state || "",
    date: new Date(a.created_at).toLocaleDateString("en-GB"),
    status: a.status,
    phone: a.phone || "",
    altEmail: "",
    qualifications: a.qualifications || "",
    workplace: a.workplace || "",
    referee1: { name: a.referee1_name || "", email: a.referee1_email || "", mobile: a.referee1_phone || "" },
    referee2: { name: a.referee2_name || "", email: a.referee2_email || "", mobile: a.referee2_phone || "" },
    statement: a.statement || "",
    payment: a.payment_status === "paid" ? "Paid" : "Pending",
    submitted: new Date(a.created_at).toLocaleDateString("en-GB"),
    receiptUrl: (a as unknown as Record<string, string>).payment_receipt_url || undefined,
  };
}

function toDisplayMember(p: ReturnType<typeof Object.assign>): DisplayMember {
  return {
    id: p.member_number || p.id,
    _dbId: p.id,
    name: p.full_name || "",
    username: p.username || "",
    email: p.email || "",
    password: "nasmed2024!",
    prof: p.profession || p.membership_type || "",
    tier: p.membership_type || "",
    state: p.state || "",
    joined: p.created_at ? new Date(p.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
    status: p.status || "active",
    position: p.position || "",
    mustChange: p.must_change_password ?? false,
  };
}

function toDisplayPub(p: Record<string, unknown>): DisplayPub {
  const createdAt = p.created_at as string | undefined;
  const fileUrl = p.file_url as string | undefined;
  return {
    id: p.id as string,
    title: (p.title as string) || "",
    type: (p.type as string) || "",
    date: createdAt ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
    downloads: (p.downloads as number) || 0,
    status: (p.status as string) || "draft",
    access: (p.access as string) || "free",
    price: (p.price as string) || "",
    fileName: (p.file_name as string) || (fileUrl ? fileUrl.split("/").pop() || "" : ""),
  };
}

function toDisplayTxn(t: Record<string, unknown>): DisplayTxn {
  const createdAt = t.created_at as string | undefined;
  return {
    id: t.id as string,
    ref: (t.payment_ref as string) || "",
    member: (t.member_name as string) || "",
    email: (t.email as string) || "",
    tier: (t.membership_type as string) || "",
    amount: (t.amount as string) || "",
    currency: (t.currency as string) || "NGN",
    method: (t.payment_method as string) || "",
    status: (t.status as string) || "pending",
    description: (t.description as string) || "",
    date: createdAt ? new Date(createdAt).toLocaleDateString("en-GB") : "",
    type: (t.type as string) || "membership",
    receiptUrl: (t.receipt_url as string) || undefined,
    receiptName: (t.receipt_name as string) || undefined,
  };
}

const TIER_AMOUNTS: Record<string, string> = {
  "Fellow (FNASMED)": "₦250,000",
  "Individual Member": "₦25,000",
  "Associate Member": "₦150,000",
  "Student Membership": "₦2,500",
  "International Membership": "$50",
};

const nigerianStates = [
  "Abuja (FCT)", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

type Subscription = { id: string; member: string; tier: string; start: string; expiry: string; status: string; amount: string };

const LOCAL_ADMIN_PASSWORD = "nasmed@admin2024";

export default function AdminPage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [localAuth, setLocalAuth] = useState(() => sessionStorage.getItem("nasmed_admin") === "1");
  const [localPw, setLocalPw] = useState("");
  const [localErr, setLocalErr] = useState("");

  const [activeSection, setActiveSection] = useState("dashboard");
  const [applications, setApplications] = useState<DisplayApp[]>([]);
  const [members, setMembers] = useState<DisplayMember[]>([]);
  const [publications, setPublications] = useState<DisplayPub[]>([]);
  const [transactions, setTransactions] = useState<DisplayTxn[]>([]);
  const [search, setSearch] = useState("");

  const subscriptions: Subscription[] = members.map(m => {
    const parts = m.joined.split(" ");
    const expiry = parts.length === 2 ? `${parts[0]} ${parseInt(parts[1]) + 1}` : m.joined;
    return {
      id: m.id,
      member: m.name,
      tier: m.tier,
      start: m.joined,
      expiry,
      status: m.status,
      amount: TIER_AMOUNTS[m.tier] ?? "₦25,000",
    };
  });

  const [viewApp, setViewApp] = useState<DisplayApp | null>(null);
  const [afFname, setAfFname] = useState("");
  const [afLname, setAfLname] = useState("");
  const [afEmail, setAfEmail] = useState("");
  const [afPhone, setAfPhone] = useState("");
  const [afProf, setAfProf] = useState("");
  const [afTier, setAfTier] = useState("Professional Member");
  const [afState, setAfState] = useState("");
  const [pubTitle, setPubTitle] = useState("");
  const [pubType, setPubType] = useState("Guidelines");
  const [pubContent, setPubContent] = useState("");
  const [pubAccess, setPubAccess] = useState("free");
  const [pubPrice, setPubPrice] = useState("");
  const [pubFile, setPubFile] = useState<File | null>(null);
  const [editMember, setEditMember] = useState<DisplayMember | null>(null);
  const [txnTypeFilter, setTxnTypeFilter] = useState<"all" | "membership" | "contribution">("all");

  const canAccess = localAuth || (!loading && isAdmin);

  const [initProgress, setInitProgress] = useState<{ done: number; total: number; running: boolean; log: string[] }>({ done: 0, total: 0, running: false, log: [] });
  const [approvedCreds, setApprovedCreds] = useState<{ name: string; username: string; nasmedEmail: string; memberNumber: string; password: string } | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [certToSend, setCertToSend] = useState<{ name: string; certNumber: string; date: string; tier: string; email: string } | null>(null);

  // Certificate email effect
  useEffect(() => {
    if (!certToSend) return;
    const timer = setTimeout(async () => {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;
      if (!serviceId || !templateId || !publicKey) {
        toast.info("EmailJS not configured — certificate not emailed.");
        setCertToSend(null);
        return;
      }
      try {
        const el = document.getElementById("admin-cert-hidden");
        if (!el) throw new Error("cert element missing");
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#fff" });
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        await emailjs.send(serviceId, templateId, {
          to_email: certToSend.email,
          member_name: certToSend.name,
          cert_number: certToSend.certNumber,
          membership_type: certToSend.tier,
          issue_date: certToSend.date,
          certificate_image: imageData,
        }, publicKey);
        toast.success(`Membership certificate emailed to ${certToSend.email}`);
      } catch {
        toast.error("Could not send certificate email — check EmailJS config.");
      } finally {
        setCertToSend(null);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [certToSend]);

  // Real-time data loading
  useEffect(() => {
    if (!canAccess) return;

    const loadAll = () => {
      applicationService.getAll().then(data => setApplications(data.map(toDisplayApp))).catch(() => {});
      userService.getAll().then(data => setMembers(data.filter(p => p.role === "member").map(toDisplayMember))).catch(() => {});
      publicationService.getAll().then(data => setPublications(data.map(d => toDisplayPub(d as unknown as Record<string, unknown>)))).catch(() => {});
      transactionService.getAll().then(data => setTransactions(data.map(d => toDisplayTxn(d as unknown as Record<string, unknown>)))).catch(() => {});
    };

    loadAll();

    const appSub = applicationService.subscribeToChanges(() => {
      applicationService.getAll().then(data => setApplications(data.map(toDisplayApp))).catch(() => {});
    });
    const memberSub = userService.subscribeToChanges(() => {
      userService.getAll().then(data => setMembers(data.filter(p => p.role === "member").map(toDisplayMember))).catch(() => {});
    });
    const pubSub = publicationService.subscribeToChanges(() => {
      publicationService.getAll().then(data => setPublications(data.map(d => toDisplayPub(d as unknown as Record<string, unknown>)))).catch(() => {});
    });
    const txnSub = transactionService.subscribeToChanges(() => {
      transactionService.getAll().then(data => setTransactions(data.map(d => toDisplayTxn(d as unknown as Record<string, unknown>)))).catch(() => {});
    });

    return () => {
      supabase.removeChannel(appSub);
      supabase.removeChannel(memberSub);
      supabase.removeChannel(pubSub);
      supabase.removeChannel(txnSub);
    };
  }, [canAccess]);

  const initializeMemberAccounts = async () => {
    if (!confirm(`This will create Supabase auth accounts for all ${DEMO_MEMBERS_INIT.length} members. Existing accounts will be skipped. Continue?`)) return;
    setInitProgress({ done: 0, total: DEMO_MEMBERS_INIT.length, running: true, log: [] });
    const log: string[] = [];
    for (let i = 0; i < DEMO_MEMBERS_INIT.length; i++) {
      const m = DEMO_MEMBERS_INIT[i];
      const { error } = await authService.signUpMember(
        m.email, m.password, m.name, m.tier, m.username, m.id, m.position,
      );
      if (error && !error.toLowerCase().includes("already registered") && !error.toLowerCase().includes("user already")) {
        log.push(`❌ ${m.username}: ${error}`);
      } else {
        log.push(`✓ ${m.username}`);
      }
      setInitProgress({ done: i + 1, total: DEMO_MEMBERS_INIT.length, running: i + 1 < DEMO_MEMBERS_INIT.length, log: [...log] });
    }
    toast.success("Member account initialization complete!");
  };

  if (!canAccess && !loading) {
    const handleLocalLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (localPw === LOCAL_ADMIN_PASSWORD) {
        sessionStorage.setItem("nasmed_admin", "1");
        setLocalAuth(true);
        setLocalErr("");
      } else {
        setLocalErr("Incorrect password. Please try again.");
      }
    };

    return (
      <div className="pt-[78px] min-h-screen bg-nasmed-off-white flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 w-full max-w-[400px] shadow-xl text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="font-heading text-nasmed-navy text-[24px] mb-1">Admin Portal</h2>
          <p className="text-nasmed-text-muted text-sm mb-7">Enter your admin password to continue.</p>
          <form onSubmit={handleLocalLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={localPw}
              onChange={e => setLocalPw(e.target.value)}
              placeholder="Admin password"
              className="py-3 px-4 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
              autoFocus
            />
            {localErr && <p className="text-red-500 text-xs">{localErr}</p>}
            <button type="submit" className="bg-nasmed-green text-white border-none py-3 px-6 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen message="Verifying admin access..." size="medium" />;
  }

  if (!canAccess) {
    return (
      <div className="pt-[78px] min-h-screen bg-nasmed-off-white flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 w-full max-w-[440px] shadow-xl text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="font-heading text-nasmed-navy text-[26px] mb-2">Access Denied</h2>
          <p className="text-nasmed-text-muted text-sm mb-6">You do not have admin privileges.</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left text-xs">
            <strong>Debug Info:</strong><br/>
            Email: {user?.email}<br/>
            Role: {user?.role || 'No role set'}<br/>
            isAdmin: {isAdmin ? 'Yes' : 'No'}<br/>
            User ID: {user?.id}
          </div>
          <button
            onClick={() => signOut()}
            className="bg-nasmed-green text-white border-none py-3 px-6 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const handleAction = async (id: string, action: string) => {
    const newStatus = action === "approve" ? "approved" : "rejected";

    if (action === "approve") {
      const app = applications.find(a => a.id === id);
      if (app) {
        setApprovingId(id);
        const alreadyApproved = applications.filter(a => a.status === "approved").length;
        const year = new Date().getFullYear().toString().slice(2);
        const seq = (42 + alreadyApproved + 1).toString().padStart(4, "0");
        const memberNumber = `NASMED/${year}/${seq}`;
        const username = await authService.generateUniqueUsername(app.name);
        const nasmedEmail = `${username}@nasmed.com`;
        await authService.activateMember(app.email, username, memberNumber, "Member", app.tier);
        setApprovedCreds({ name: app.name, username, nasmedEmail, memberNumber, password: "nasmed2024!" });
        const newMember: DisplayMember = {
          id: memberNumber,
          _dbId: "",
          name: app.name,
          username,
          email: app.email,
          password: "nasmed2024!",
          prof: app.prof,
          tier: app.tier,
          state: app.state,
          joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          status: "active",
          position: "Member",
          mustChange: true,
        };
        setMembers(prev => prev.some(m => m.email === app.email) ? prev : [newMember, ...prev]);
        setApprovingId(null);
        const certDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
        setCertToSend({ name: app.name, certNumber: memberNumber, date: certDate, tier: app.tier, email: app.email });
        toast.success(`${app.name} approved! Sending membership certificate to ${app.email}…`);
      }
    }

    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (viewApp?.id === id) setViewApp(prev => prev ? { ...prev, status: newStatus } : null);
    applicationService.updateStatus(id, newStatus as "approved" | "rejected").catch(() => {});
    if (action !== "approve") toast.success("Application rejected & member notified.");
  };

  const addMember = async () => {
    if (!afFname || !afLname) { toast.error("Please fill in required fields."); return; }
    const defaultPassword = "nasmed2024!";
    const name = `${afFname} ${afLname}`;
    const username = (afFname + "." + afLname).toLowerCase().replace(/\s+/g, "");
    try {
      const { error } = await authService.signUpMember(
        afEmail, defaultPassword, name, afTier, username, "", "",
      );
      if (error && !error.toLowerCase().includes("already registered")) {
        toast.error(`Failed to create member account: ${error}`);
        return;
      }
      toast.success(`Member ${name} registered! They can log in with their email and 'nasmed2024!'.`);
      setAfFname(""); setAfLname(""); setAfEmail(""); setAfPhone(""); setAfProf("");
    } catch {
      toast.error("Failed to register member.");
    }
  };

  const handleConfirmTransaction = async (txnId: string) => {
    try {
      await transactionService.updateStatus(txnId, "confirmed");
      setTransactions(prev => prev.map(t => t.id === txnId ? { ...t, status: "confirmed" } : t));
      toast.success("Payment confirmed successfully!");
    } catch {
      toast.error("Failed to confirm transaction.");
    }
  };

  const deleteMember = async (dbId: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        await userService.delete(dbId);
        setMembers(prev => prev.filter(m => m._dbId !== dbId));
        toast.success("Member deleted successfully");
      } catch {
        toast.error("Failed to delete member.");
      }
    }
  };

  const saveMember = async () => {
    if (!editMember) return;
    try {
      if (editMember._dbId) {
        await userService.update(editMember._dbId, {
          full_name: editMember.name,
          profession: editMember.prof,
          membership_type: editMember.tier,
          state: editMember.state,
          position: editMember.position,
          status: editMember.status as "active" | "inactive" | "suspended",
        });
      }
      setMembers(prev => prev.map(m => m._dbId === editMember._dbId ? editMember : m));
      setEditMember(null);
      toast.success("Member updated successfully");
    } catch {
      toast.error("Failed to update member.");
    }
  };

  const addPublication = async () => {
    if (!pubTitle) { toast.error("Please enter a title."); return; }
    if (pubAccess === "paid" && !pubPrice) { toast.error("Please enter a price for paid publications."); return; }
    try {
      const pub = await publicationService.create({
        title: pubTitle,
        type: pubType as "Guidelines" | "Journal" | "Protocol" | "Research" | "Newsletter" | "Report",
        description: pubContent,
        status: "published",
      }, pubFile || undefined);
      await publicationService.update(pub.id, {
        access: pubAccess,
        price: pubAccess === "paid" ? pubPrice : "",
        file_name: pubFile?.name || "",
      } as Parameters<typeof publicationService.update>[1]);
      const dispPub = toDisplayPub({
        ...pub,
        access: pubAccess,
        price: pubAccess === "paid" ? pubPrice : "",
        file_name: pubFile?.name || "",
      } as unknown as Record<string, unknown>);
      setPublications(prev => [dispPub, ...prev]);
      toast.success(`Publication "${pubTitle}" created!`);
      setPubTitle(""); setPubContent(""); setPubPrice(""); setPubFile(null); setPubAccess("free");
    } catch {
      toast.error("Failed to create publication.");
    }
  };

  const deletePublication = async (id: string) => {
    if (confirm("Are you sure you want to delete this publication?")) {
      try {
        await publicationService.delete(id);
        setPublications(prev => prev.filter(p => p.id !== id));
        toast.success("Publication deleted");
      } catch {
        toast.error("Failed to delete publication.");
      }
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-500/15 text-amber-600",
      approved: "bg-nasmed-green/15 text-nasmed-green",
      rejected: "bg-red-500/15 text-red-600",
      active: "bg-nasmed-mid-blue/10 text-nasmed-mid-blue",
      expired: "bg-red-500/15 text-red-600",
      published: "bg-nasmed-green/15 text-nasmed-green",
      draft: "bg-amber-500/15 text-amber-600",
      free: "bg-emerald-500/15 text-emerald-600",
      paid: "bg-amber-500/15 text-amber-600",
      subscribed: "bg-nasmed-mid-blue/10 text-nasmed-mid-blue",
    };
    return <span className={`py-1 px-2.5 rounded-full text-[11px] font-bold tracking-wide capitalize ${map[s] || ""}`}>{s}</span>;
  };

  const pendingCount = applications.filter(a => a.status === "pending").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;

  const sidebarItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "applications", icon: "📋", label: "Applications" },
    { key: "members", icon: "👥", label: "Members" },
    { key: "publications", icon: "📚", label: "Publications" },
    { key: "subscriptions", icon: "💳", label: "Subscriptions" },
    { key: "transactions", icon: "💰", label: "Transactions" },
    { key: "credentials", icon: "🔑", label: "Credentials" },
  ];

  const filterRows = (rows: unknown[], keys: string[]) => {
    if (!search) return rows;
    const s = search.toLowerCase();
    return rows.filter(r => keys.some(k => String((r as Record<string, unknown>)[k] || "").toLowerCase().includes(s)));
  };

  const field = (label: string, value: string) => (
    <div className="flex flex-col gap-1 p-4 border border-nasmed-gray-light rounded-lg bg-nasmed-off-white/40">
      <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-nasmed-text-muted">{label}</span>
      <span className="text-[14px] font-medium text-nasmed-navy">{value || "—"}</span>
    </div>
  );

  return (
    <div className="pt-[78px] bg-nasmed-off-white min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-[calc(100vh-78px)]">

        {/* Sidebar */}
        <div className="bg-nasmed-navy py-7 hidden md:block">
          <div className="px-6 pb-6 border-b border-white/10">
            <h3 className="text-white text-[15px] font-bold">NASMED Admin</h3>
            <p className="text-white/40 text-xs mt-0.5">Management Portal</p>
          </div>
          <ul className="list-none py-4">
            {sidebarItems.map(item => (
              <li key={item.key}>
                <button
                  onClick={() => { setActiveSection(item.key); setSearch(""); }}
                  className={`w-full flex items-center gap-2.5 py-2.5 px-6 text-[13.5px] font-medium cursor-pointer transition-all border-none bg-transparent text-left ${activeSection === item.key ? "bg-white/10 text-white border-l-[3px] border-nasmed-green-light" : "text-white/65 hover:bg-white/5 hover:text-white"}`}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>{item.label}
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => { sessionStorage.removeItem("nasmed_admin"); setLocalAuth(false); if (user) signOut(); }} className="w-full flex items-center gap-2.5 py-2.5 px-6 text-white/65 text-[13.5px] font-medium cursor-pointer border-none bg-transparent text-left hover:bg-white/5 hover:text-white mt-8">
                <span className="text-base w-5 text-center">🚪</span>Sign Out
              </button>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="p-6 md:p-9">

          {/* ── Dashboard ── */}
          {activeSection === "dashboard" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Dashboard Overview</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">Welcome back. Here's a summary of NASMED activity.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
                {[
                  { num: members.length.toLocaleString(), label: "Total Members", trend: `${members.length} registered`, color: "border-nasmed-mid-blue" },
                  { num: String(pendingCount), label: "Pending Applications", trend: "Needs Review", color: "border-nasmed-green", trendColor: "text-amber-500" },
                  { num: String(approvedCount), label: "Approved This Month", trend: "↑ New Members", color: "border-amber-500" },
                  { num: String(subscriptions.filter(s => s.status === "active").length), label: "Active Subscriptions", trend: "Revenue: ₦1.2M", color: "border-nasmed-green", trendColor: "text-nasmed-green" },
                ].map((c, i) => (
                  <div key={i} className={`bg-white rounded-xl p-6 shadow-sm border-t-4 ${c.color}`}>
                    <div className="font-heading text-[32px] font-bold text-nasmed-navy leading-none">{c.num}</div>
                    <div className="text-[13px] text-nasmed-text-muted mt-1">{c.label}</div>
                    <div className={`text-xs font-semibold mt-2 ${c.trendColor || "text-nasmed-green"}`}>{c.trend}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-9">
                <button onClick={() => setActiveSection("applications")} className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-green hover:shadow-md transition-all text-left">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-bold text-nasmed-navy">Review Applications</div>
                  <div className="text-sm text-nasmed-text-muted">{pendingCount} pending</div>
                </button>
                <button onClick={() => setActiveSection("publications")} className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-mid-blue hover:shadow-md transition-all text-left">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="font-bold text-nasmed-navy">Create Publication</div>
                  <div className="text-sm text-nasmed-text-muted">Add new content</div>
                </button>
                <button onClick={() => setActiveSection("members")} className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-amber-500 hover:shadow-md transition-all text-left">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-bold text-nasmed-navy">Manage Members</div>
                  <div className="text-sm text-nasmed-text-muted">{members.length} total</div>
                </button>
              </div>

              {/* Recent Activity — from live applications */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">Recent Activity</h3>
                {applications.slice(0, 4).length > 0 ? (
                  <div className="space-y-4">
                    {applications.slice(0, 4).map((a, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-nasmed-off-white transition-all">
                        <div className="w-10 h-10 bg-nasmed-off-white rounded-full flex items-center justify-center text-lg">📝</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-nasmed-navy">New membership application</div>
                          <div className="text-xs text-nasmed-text-muted">{a.name}</div>
                        </div>
                        <div className="text-xs text-nasmed-text-muted">{a.date}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-nasmed-text-muted text-center py-6">No recent activity.</p>
                )}
              </div>
            </>
          )}

          {/* ── Applications ── */}
          {activeSection === "applications" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Membership Applications</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">Review and process all incoming membership applications.</p>
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-nasmed-navy">All Applications</h3>
                  <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[220px] focus:border-nasmed-mid-blue" placeholder="Search by name, email..." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead><tr>{["Name", "Email", "Tier", "State", "Date", "Payment", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {(filterRows(applications, ["name", "email", "prof", "tier"]) as DisplayApp[]).map(a => (
                        <tr key={a.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[13px] font-semibold">{a.name}</td>
                          <td className="py-3 px-3 text-[13px]">{a.email}</td>
                          <td className="py-3 px-3 text-[13px]">{a.tier}</td>
                          <td className="py-3 px-3 text-[13px]">{a.state}</td>
                          <td className="py-3 px-3 text-[13px]">{a.date}</td>
                          <td className="py-3 px-3">
                            <span className={`py-1 px-2 rounded-full text-[11px] font-bold ${a.payment === "Paid" ? "bg-nasmed-green/15 text-nasmed-green" : "bg-gray-100 text-gray-500"}`}>
                              {a.payment}
                            </span>
                          </td>
                          <td className="py-3 px-3">{statusBadge(a.status)}</td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1.5 items-center">
                              <button onClick={() => setViewApp(a)} className="bg-nasmed-mid-blue text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80">View</button>
                              {a.status === "pending" && <>
                                <button onClick={() => handleAction(a.id, "approve")} disabled={approvingId === a.id} className="bg-nasmed-green text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-nasmed-green-light disabled:opacity-50">{approvingId === a.id ? "…" : "✓"}</button>
                                <button onClick={() => handleAction(a.id, "reject")} disabled={!!approvingId} className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600 disabled:opacity-50">✗</button>
                              </>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {applications.length === 0 && (
                    <div className="text-center py-10 text-nasmed-text-muted text-[13px]">No applications yet.</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Members ── */}
          {activeSection === "members" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Active Members</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">View and manage all currently registered NASMED members.</p>
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-nasmed-navy">Member Directory</h3>
                  <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[220px] focus:border-nasmed-mid-blue" placeholder="Search members..." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead><tr>{["ID", "Name", "Profession", "Tier", "State", "Joined", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {(filterRows(members, ["name", "prof", "tier"]) as DisplayMember[]).map(m => (
                        <tr key={m._dbId || m.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{m.id}</td>
                          <td className="py-3 px-3 text-[13px] font-semibold">{m.name}</td>
                          <td className="py-3 px-3 text-[13px]">{m.prof}</td>
                          <td className="py-3 px-3 text-[13px]">{m.tier}</td>
                          <td className="py-3 px-3 text-[13px]">{m.state}</td>
                          <td className="py-3 px-3 text-[13px]">{m.joined}</td>
                          <td className="py-3 px-3">{statusBadge(m.status)}</td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => setEditMember(m)} className="bg-nasmed-mid-blue text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80">Edit</button>
                              <button onClick={() => deleteMember(m._dbId || m.id)} className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600">🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {members.length === 0 && (
                    <div className="text-center py-10 text-nasmed-text-muted text-[13px]">No members yet. Use the Credentials section to initialize accounts.</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Publications ── */}
          {activeSection === "publications" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Publications</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">Create, manage and publish content for NASMED members.</p>

              {/* Create New Publication */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm mb-8">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">Create New Publication</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Title <span className="text-red-600">*</span></label>
                    <input type="text" value={pubTitle} onChange={e => setPubTitle(e.target.value)} placeholder="Publication title" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Type</label>
                    <select value={pubType} onChange={e => setPubType(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue">
                      <option>Guidelines</option>
                      <option>Journal</option>
                      <option>Protocol</option>
                      <option>Research</option>
                      <option>Newsletter</option>
                      <option>Report</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Description / Abstract</label>
                    <textarea value={pubContent} onChange={e => setPubContent(e.target.value)} placeholder="Enter description or abstract..." className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue min-h-[100px]" />
                  </div>

                  {/* Document Upload */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Document / File</label>
                    <label className={`flex items-center gap-3 py-3 px-4 border-[1.5px] border-dashed rounded-lg cursor-pointer transition-all ${pubFile ? "border-nasmed-green bg-nasmed-green/5" : "border-nasmed-gray-light hover:border-nasmed-mid-blue hover:bg-nasmed-off-white"}`}>
                      <span className="text-xl">{pubFile ? "📄" : "📁"}</span>
                      <div className="flex-1 min-w-0">
                        {pubFile
                          ? <><p className="text-sm font-semibold text-nasmed-navy truncate">{pubFile.name}</p><p className="text-xs text-nasmed-text-muted">{(pubFile.size / 1024).toFixed(0)} KB</p></>
                          : <><p className="text-sm text-nasmed-text-muted">Click to upload PDF, Word, or other document</p><p className="text-xs text-nasmed-text-muted">PDF, DOC, DOCX, PPT up to 50MB</p></>
                        }
                      </div>
                      {pubFile && <button type="button" onClick={e => { e.preventDefault(); setPubFile(null); }} className="text-red-400 hover:text-red-600 text-lg leading-none border-none bg-transparent cursor-pointer">✕</button>}
                      <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={e => setPubFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>

                  {/* Access Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Access Type <span className="text-red-600">*</span></label>
                    <div className="flex gap-3 flex-wrap">
                      {[
                        { value: "free", label: "Free", icon: "🔓", desc: "Anyone can access" },
                        { value: "paid", label: "Paid", icon: "💳", desc: "One-time purchase" },
                        { value: "subscribed", label: "Members Only", icon: "🔐", desc: "Active subscribers" },
                      ].map(opt => (
                        <label key={opt.value} className={`flex-1 min-w-[140px] flex items-start gap-2.5 p-3.5 rounded-lg border-[1.5px] cursor-pointer transition-all ${pubAccess === opt.value ? "border-nasmed-mid-blue bg-nasmed-mid-blue/5" : "border-nasmed-gray-light hover:border-nasmed-mid-blue/40"}`}>
                          <input type="radio" name="pubAccess" value={opt.value} checked={pubAccess === opt.value} onChange={() => setPubAccess(opt.value)} className="mt-0.5 accent-nasmed-mid-blue" />
                          <div>
                            <div className="text-[13px] font-semibold text-nasmed-navy">{opt.icon} {opt.label}</div>
                            <div className="text-[11px] text-nasmed-text-muted">{opt.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price — only shown for paid */}
                  {pubAccess === "paid" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-nasmed-navy">Price <span className="text-red-600">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nasmed-text-muted text-sm font-medium">₦</span>
                        <input type="text" value={pubPrice} onChange={e => setPubPrice(e.target.value)} placeholder="e.g. 2,500" className="w-full py-2.5 pl-8 pr-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={addPublication} className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all mt-5">Publish →</button>
              </div>

              {/* Existing Publications */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-nasmed-navy">All Publications</h3>
                  <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[220px] focus:border-nasmed-mid-blue" placeholder="Search publications..." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead><tr>{["ID", "Title", "Type", "Access", "Price", "File", "Date", "Downloads", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {(filterRows(publications, ["title", "type", "access"]) as DisplayPub[]).map(p => (
                        <tr key={p.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{p.id.slice(0, 8)}…</td>
                          <td className="py-3 px-3 text-[13px] font-semibold max-w-[180px] truncate">{p.title}</td>
                          <td className="py-3 px-3 text-[13px]">{p.type}</td>
                          <td className="py-3 px-3">{statusBadge(p.access)}</td>
                          <td className="py-3 px-3 text-[13px] font-medium">{p.access === "paid" && p.price ? `₦${p.price}` : "—"}</td>
                          <td className="py-3 px-3 text-[12px] max-w-[120px] truncate">{p.fileName ? <span title={p.fileName} className="flex items-center gap-1 text-nasmed-mid-blue">📄 {p.fileName}</span> : <span className="text-nasmed-text-muted">—</span>}</td>
                          <td className="py-3 px-3 text-[13px]">{p.date}</td>
                          <td className="py-3 px-3 text-[13px]">{p.downloads}</td>
                          <td className="py-3 px-3">{statusBadge(p.status)}</td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => toast.info(`Viewing ${p.title}`)} className="bg-nasmed-mid-blue text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80">View</button>
                              <button onClick={() => deletePublication(p.id)} className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600">🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {publications.length === 0 && (
                    <div className="text-center py-10 text-nasmed-text-muted text-[13px]">No publications yet.</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Subscriptions ── */}
          {activeSection === "subscriptions" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Subscriptions</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">Manage member subscriptions and renewals.</p>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
                <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-green">
                  <div className="font-heading text-[28px] font-bold text-nasmed-navy">{subscriptions.filter(s => s.status === "active").length}</div>
                  <div className="text-[13px] text-nasmed-text-muted">Active Subscriptions</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-red-500">
                  <div className="font-heading text-[28px] font-bold text-nasmed-navy">{subscriptions.filter(s => s.status === "expired").length}</div>
                  <div className="text-[13px] text-nasmed-text-muted">Expired</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-mid-blue">
                  <div className="font-heading text-[28px] font-bold text-nasmed-navy">₦{(subscriptions.filter(s => s.status === "active").length * 35000).toLocaleString()}</div>
                  <div className="text-[13px] text-nasmed-text-muted">Monthly Revenue (est.)</div>
                </div>
              </div>

              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-nasmed-navy">All Subscriptions</h3>
                  <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[220px] focus:border-nasmed-mid-blue" placeholder="Search..." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead><tr>{["ID", "Member", "Tier", "Start Date", "Expiry Date", "Amount", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {(filterRows(subscriptions, ["member", "tier"]) as Subscription[]).map(s => (
                        <tr key={s.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{s.id}</td>
                          <td className="py-3 px-3 text-[13px] font-semibold">{s.member}</td>
                          <td className="py-3 px-3 text-[13px]">{s.tier}</td>
                          <td className="py-3 px-3 text-[13px]">{s.start}</td>
                          <td className="py-3 px-3 text-[13px]">{s.expiry}</td>
                          <td className="py-3 px-3 text-[13px] font-medium">{s.amount}</td>
                          <td className="py-3 px-3">{statusBadge(s.status)}</td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => toast.info(`Renewing ${s.member}`)} className="bg-nasmed-green text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:bg-nasmed-green-light">Renew</button>
                              <button onClick={() => toast.info(`Sending reminder to ${s.member}`)} className="bg-nasmed-mid-blue text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80">✉️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ── Transactions ── */}
          {activeSection === "transactions" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Transactions</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">All payment records — membership registrations and additional contributions.</p>

              {/* Bank Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="bg-white rounded-[14px] p-6 shadow-sm border-t-4 border-nasmed-mid-blue">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-bold tracking-[1.5px] uppercase bg-nasmed-mid-blue/10 text-nasmed-mid-blue px-2.5 py-1 rounded-full">Naira Account (NGN)</span>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Account Name</span><span className="font-bold text-nasmed-navy">NASMED</span></div>
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Account Number</span><span className="font-bold text-nasmed-navy tracking-widest">0227297914</span></div>
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Bank</span><span className="font-bold text-nasmed-navy">Union Bank of Nigeria</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-[14px] p-6 shadow-sm border-t-4 border-amber-500">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-bold tracking-[1.5px] uppercase bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">Dollar Account (USD)</span>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Account Name</span><span className="font-bold text-nasmed-navy">NASMED</span></div>
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Account Number</span><span className="font-bold text-nasmed-navy tracking-widest">0227342474</span></div>
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Bank</span><span className="font-bold text-nasmed-navy">Union Bank of Nigeria</span></div>
                  </div>
                </div>
              </div>

              {/* Summary cards */}
              {(() => {
                const pending = transactions.filter(t => t.status === "awaiting_confirmation");
                const confirmed = transactions.filter(t => t.status === "confirmed");
                const contributions = transactions.filter(t => t.type === "contribution");
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Total Payments", value: transactions.length, color: "border-nasmed-mid-blue" },
                      { label: "Awaiting Confirmation", value: pending.length, color: "border-amber-500" },
                      { label: "Confirmed", value: confirmed.length, color: "border-nasmed-green" },
                      { label: "Contributions", value: contributions.length, color: "border-purple-500" },
                    ].map(c => (
                      <div key={c.label} className={`bg-white rounded-xl p-4 shadow-sm border-t-4 ${c.color}`}>
                        <div className="text-2xl font-bold text-nasmed-navy">{c.value}</div>
                        <div className="text-[12px] text-nasmed-text-muted mt-0.5">{c.label}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Transaction Records */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-nasmed-navy">Payment Records</h3>
                    <div className="flex gap-1 ml-2">
                      {(["all", "membership", "contribution"] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setTxnTypeFilter(f)}
                          className={`text-[11px] font-bold px-3 py-1 rounded-full border cursor-pointer transition-all ${txnTypeFilter === f ? "bg-nasmed-navy text-white border-nasmed-navy" : "bg-transparent text-nasmed-text-muted border-nasmed-gray-light hover:border-nasmed-navy hover:text-nasmed-navy"}`}
                        >
                          {f === "all" ? "All" : f === "membership" ? "Membership" : "Contributions"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => { transactionService.getAll().then(data => setTransactions(data.map(d => toDisplayTxn(d as unknown as Record<string, unknown>)))).catch(() => {}); }}
                      className="text-[12px] text-nasmed-mid-blue border border-nasmed-mid-blue/30 py-1 px-3 rounded cursor-pointer bg-transparent hover:bg-nasmed-mid-blue/5"
                    >↻ Refresh</button>
                    <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[180px] focus:border-nasmed-mid-blue" placeholder="Search..." />
                  </div>
                </div>

                {(() => {
                  const filtered = transactions
                    .filter(t => txnTypeFilter === "all" || t.type === txnTypeFilter)
                    .filter(t => !search || ["member","email","tier","ref","description"].some(k => String((t as unknown as Record<string,unknown>)[k]||"").toLowerCase().includes(search.toLowerCase())));
                  return filtered.length === 0 ? (
                    <div className="text-center py-12 text-nasmed-text-muted text-[13px]">No transactions found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            {["Reference", "Member", "Category", "Amount", "Method", "Description", "Receipt", "Status", "Date", "Action"].map(h => (
                              <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(t => (
                            <tr key={t.id} className="hover:bg-nasmed-off-white border-b border-nasmed-gray-light/40 last:border-0">
                              <td className="py-3 px-3 text-[11px] font-mono text-nasmed-text-muted">{t.ref || "—"}</td>
                              <td className="py-3 px-3">
                                <div className="text-[13px] font-semibold text-nasmed-navy">{t.member || "—"}</div>
                                <div className="text-[11px] text-nasmed-text-muted">{t.email}</div>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`py-0.5 px-2 rounded-full text-[10px] font-bold ${t.type === "contribution" ? "bg-purple-500/10 text-purple-700" : "bg-nasmed-mid-blue/10 text-nasmed-mid-blue"}`}>
                                  {t.type === "contribution" ? "Contribution" : "Membership"}
                                </span>
                                <div className="text-[12px] text-nasmed-text-muted mt-0.5">{t.tier || "—"}</div>
                              </td>
                              <td className="py-3 px-3 text-[13px] font-bold text-nasmed-navy whitespace-nowrap">{t.amount || "—"} <span className="text-[11px] font-normal text-nasmed-text-muted">{t.currency}</span></td>
                              <td className="py-3 px-3">
                                <span className={`py-1 px-2 rounded-full text-[11px] font-bold ${t.method === "Paystack" ? "bg-[#0BA4DB]/10 text-[#0993c5]" : "bg-amber-500/10 text-amber-700"}`}>
                                  {t.method || "—"}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-[12px] text-nasmed-text-muted max-w-[140px] truncate" title={t.description}>
                                {t.description || "—"}
                              </td>
                              <td className="py-3 px-3">
                                {t.receiptUrl ? (
                                  <a href={t.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-nasmed-mid-blue hover:underline whitespace-nowrap">
                                    {(t.receiptName || "receipt").endsWith(".pdf") ? "📋 PDF" : "🖼️ Image"}
                                  </a>
                                ) : (
                                  <span className="text-[11px] text-nasmed-text-muted">None</span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                {statusBadge(t.status === "confirmed" ? "approved" : t.status === "awaiting_confirmation" ? "pending" : t.status)}
                              </td>
                              <td className="py-3 px-3 text-[12px] text-nasmed-text-muted whitespace-nowrap">{t.date || "—"}</td>
                              <td className="py-3 px-3">
                                {t.status === "awaiting_confirmation" ? (
                                  <button
                                    onClick={() => handleConfirmTransaction(t.id)}
                                    className="bg-nasmed-green text-white border-none py-1.5 px-3 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-nasmed-green-light whitespace-nowrap"
                                  >
                                    ✓ Confirm
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-nasmed-text-muted">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {/* ── Credentials ── */}
          {activeSection === "credentials" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Member Credentials</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">View and manage member login credentials for the Member Portal.</p>

              {/* Initialize Member Accounts */}
              <div className="bg-amber-50 border border-amber-200 rounded-[14px] p-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-[17px] text-nasmed-navy mb-1">Initialize Member Accounts</h3>
                    <p className="text-[13px] text-nasmed-text-muted max-w-[520px]">
                      Creates Supabase auth accounts for all {DEMO_MEMBERS_INIT.length} members using their username and default password (<code className="bg-amber-100 px-1 rounded">nasmed2024!</code>). Members will be required to change their password on first login. Existing accounts are skipped.
                    </p>
                  </div>
                  <button
                    onClick={initializeMemberAccounts}
                    disabled={initProgress.running}
                    className="shrink-0 bg-nasmed-green text-white border-none py-3 px-6 rounded-lg text-[14px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {initProgress.running ? `Creating... (${initProgress.done}/${initProgress.total})` : "Initialize All Accounts →"}
                  </button>
                </div>

                {initProgress.log.length > 0 && (
                  <div className="mt-4 bg-white border border-amber-200 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                    <p className="text-[11px] font-bold text-nasmed-text-muted uppercase tracking-wide mb-2">Progress Log</p>
                    {initProgress.log.map((line, i) => (
                      <p key={i} className={`text-[12px] font-mono ${line.startsWith("❌") ? "text-red-600" : "text-nasmed-green"}`}>{line}</p>
                    ))}
                    {!initProgress.running && (
                      <p className="text-[13px] font-semibold text-nasmed-navy mt-2">Done — {initProgress.done}/{initProgress.total} accounts processed.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead><tr>{["ID", "Name", "Position", "Username", "Password", "Must Change", "Status"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {members.map(m => (
                        <tr key={m._dbId || m.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{m.id}</td>
                          <td className="py-3 px-3 text-[13px] font-semibold">{m.name}</td>
                          <td className="py-3 px-3 text-xs text-nasmed-text-muted">{m.position || m.prof}</td>
                          <td className="py-3 px-3"><code className="bg-nasmed-off-white py-0.5 px-2 rounded text-xs">{m.username}</code></td>
                          <td className="py-3 px-3"><code className="bg-nasmed-off-white py-0.5 px-2 rounded text-xs">{m.password}</code></td>
                          <td className="py-3 px-3"><span className={`text-[11px] font-bold ${m.mustChange ? "text-amber-600" : "text-nasmed-green"}`}>{m.mustChange ? "YES" : "No"}</span></td>
                          <td className="py-3 px-3">{statusBadge(m.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {members.length === 0 && (
                    <div className="text-center py-10 text-nasmed-text-muted text-[13px]">No member accounts yet. Click "Initialize All Accounts" above.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Application Review Modal */}
      {viewApp && (
        <div className="fixed inset-0 bg-black/60 z-[3000] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setViewApp(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-[760px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-nasmed-gray-light flex-shrink-0">
              <h2 className="font-heading text-nasmed-navy text-[17px] font-bold">Application Review — {viewApp.name}</h2>
              <button onClick={() => setViewApp(null)} className="w-8 h-8 rounded-full border border-nasmed-gray-light bg-white text-nasmed-text-muted flex items-center justify-center text-lg cursor-pointer hover:bg-nasmed-off-white">✕</button>
            </div>
            <div className="flex items-center gap-3 px-7 py-3.5 border-b border-nasmed-gray-light bg-nasmed-off-white/60 flex-shrink-0">
              <span className={`flex items-center gap-1.5 py-1 px-3 rounded-full text-[12px] font-bold border ${viewApp.status === "pending" ? "border-amber-400 text-amber-600" : viewApp.status === "approved" ? "border-nasmed-green text-nasmed-green" : "border-red-400 text-red-600"}`}>
                {viewApp.status.charAt(0).toUpperCase() + viewApp.status.slice(1)}
              </span>
              <span className="py-1 px-3 rounded-full text-[12px] font-bold border border-nasmed-mid-blue text-nasmed-mid-blue">{viewApp.tier}</span>
              <span className={`py-1 px-3 rounded-full text-[12px] font-bold border ${viewApp.payment === "Paid" ? "border-nasmed-green text-nasmed-green" : "border-amber-400 text-amber-600"}`}>
                {viewApp.payment === "Paid" ? "✓ Paid" : "⏳ Pending"}
              </span>
            </div>
            <div className="overflow-y-auto flex-1 px-7 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {field("Full Name", viewApp.name)}
                {field("Email", viewApp.email)}
                {field("Phone", viewApp.phone)}
                {field("State", viewApp.state)}
                {field("Profession", viewApp.prof)}
                {field("Qualifications", viewApp.qualifications)}
                {field("Workplace", viewApp.workplace)}
              </div>
              <div className="mt-6">
                <p className="text-[11px] font-bold tracking-[2px] uppercase text-nasmed-mid-blue mb-3">Candidate Statement</p>
                <div className="border border-nasmed-gray-light rounded-lg p-4 bg-nasmed-off-white/40 text-sm">{viewApp.statement}</div>
              </div>

              {/* Payment Receipt */}
              <div className="mt-6">
                <p className="text-[11px] font-bold tracking-[2px] uppercase text-nasmed-mid-blue mb-3">Payment Receipt</p>
                {viewApp.receiptUrl ? (
                  <div className="border border-nasmed-green/30 rounded-lg p-4 bg-nasmed-green/5 flex items-center gap-4">
                    <span className="text-3xl">{(viewApp.receiptName || "").endsWith(".pdf") ? "📋" : "🖼️"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-nasmed-navy truncate">{viewApp.receiptName || "Payment Receipt"}</p>
                      <p className="text-[11px] text-nasmed-green font-semibold mt-0.5">Receipt submitted by applicant</p>
                    </div>
                    <a
                      href={viewApp.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-nasmed-navy text-white text-[12px] font-semibold py-2 px-4 rounded-lg hover:opacity-90 no-underline"
                    >
                      {(viewApp.receiptName || "").endsWith(".pdf") ? "Open PDF" : "View Image"}
                    </a>
                  </div>
                ) : (
                  <div className="border border-nasmed-gray-light rounded-lg p-4 bg-nasmed-off-white/40 text-[13px] text-nasmed-text-muted">
                    No receipt uploaded yet.
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 px-7 py-4 border-t border-nasmed-gray-light bg-white">
              <button onClick={() => setViewApp(null)} className="py-3 px-6 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[14px] font-semibold cursor-pointer hover:bg-nasmed-off-white bg-white">Close</button>
              {viewApp.status === "pending" && (
                <>
                  <button onClick={async () => { await handleAction(viewApp.id, "approve"); setViewApp(null); }} disabled={!!approvingId} className="flex-1 py-3 rounded-lg bg-nasmed-green text-white border-none text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light disabled:opacity-50">{approvingId === viewApp.id ? "Approving…" : "✓ Approve"}</button>
                  <button onClick={() => { handleAction(viewApp.id, "reject"); setViewApp(null); }} disabled={!!approvingId} className="flex-1 py-3 rounded-lg bg-red-500 text-white border-none text-[14px] font-bold cursor-pointer hover:bg-red-600 disabled:opacity-50">✗ Reject</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approved Credentials Modal */}
      {approvedCreds && (
        <div className="fixed inset-0 bg-black/70 z-[4000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[480px] shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue p-7 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="font-heading text-white text-[20px] mb-1">Application Approved</h2>
              <p className="text-white/70 text-[13px]">{approvedCreds.name} is now an active member</p>
            </div>
            <div className="p-7 flex flex-col gap-4">
              <p className="text-[13px] text-nasmed-text-muted text-center">Share these login credentials with the member. They will be required to change their password on first login.</p>
              <div className="bg-nasmed-off-white rounded-xl p-5 flex flex-col gap-3 border border-nasmed-gray-light">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-nasmed-text-muted">Member No.</span>
                  <code className="text-[13px] font-mono font-bold text-nasmed-navy">{approvedCreds.memberNumber}</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-nasmed-text-muted">Username</span>
                  <code className="text-[13px] font-mono font-bold text-nasmed-navy">{approvedCreds.username}</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-nasmed-text-muted">NASMED ID</span>
                  <code className="text-[13px] font-mono font-bold text-nasmed-mid-blue">{approvedCreds.nasmedEmail}</code>
                </div>
                <div className="flex justify-between items-center border-t border-nasmed-gray-light pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-nasmed-text-muted">Default Password</span>
                  <code className="text-[13px] font-mono font-bold text-amber-600">{approvedCreds.password}</code>
                </div>
              </div>
              <button
                onClick={() => {
                  const text = `NASMED Member Login Credentials\n\nMember No: ${approvedCreds.memberNumber}\nUsername: ${approvedCreds.username}\nNASMED ID: ${approvedCreds.nasmedEmail}\nPassword: ${approvedCreds.password}\n\nPlease log in at the NASMED Member Portal and change your password on first sign-in.`;
                  navigator.clipboard?.writeText(text);
                  toast.success("Credentials copied to clipboard!");
                }}
                className="w-full py-2.5 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[13px] font-semibold bg-white cursor-pointer hover:bg-nasmed-off-white"
              >
                Copy Credentials
              </button>
              <button
                onClick={() => setApprovedCreds(null)}
                className="w-full py-3 rounded-lg bg-nasmed-green text-white border-none text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editMember && (
        <div className="fixed inset-0 bg-black/60 z-[3000] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setEditMember(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-nasmed-gray-light">
              <h2 className="font-heading text-nasmed-navy text-lg font-bold">Edit Member</h2>
              <button onClick={() => setEditMember(null)} className="w-8 h-8 rounded-full border border-nasmed-gray-light bg-white text-nasmed-text-muted flex items-center justify-center cursor-pointer hover:bg-nasmed-off-white">✕</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Full Name</label>
                  <input type="text" value={editMember.name} onChange={e => setEditMember({...editMember, name: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Profession</label>
                  <input type="text" value={editMember.prof} onChange={e => setEditMember({...editMember, prof: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Tier</label>
                  <select value={editMember.tier} onChange={e => setEditMember({...editMember, tier: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm">
                    <option>Associate Member</option>
                    <option>Individual Member</option>
                    <option>Fellow (FNASMED)</option>
                    <option>Student Membership</option>
                    <option>International Membership</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">State</label>
                  <input type="text" value={editMember.state} onChange={e => setEditMember({...editMember, state: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Position</label>
                  <input type="text" value={editMember.position} onChange={e => setEditMember({...editMember, position: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Status</label>
                  <select value={editMember.status} onChange={e => setEditMember({...editMember, status: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm">
                    <option>active</option>
                    <option>inactive</option>
                    <option>suspended</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-nasmed-gray-light">
              <button onClick={() => setEditMember(null)} className="py-2.5 px-5 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[14px] font-semibold bg-white cursor-pointer hover:bg-nasmed-off-white">Cancel</button>
              <button onClick={saveMember} className="flex-1 py-2.5 rounded-lg bg-nasmed-green text-white border-none text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden certificate frame used for email capture */}
      {certToSend && (
        <div style={{ position: "fixed", left: "-9999px", top: 0, visibility: "hidden", pointerEvents: "none" }}>
          <div id="admin-cert-hidden">
            <CertificateFrame
              memberName={certToSend.name}
              certNumber={certToSend.certNumber}
              date={certToSend.date}
              membershipType={certToSend.tier}
            />
          </div>
        </div>
      )}
    </div>
  );
}
