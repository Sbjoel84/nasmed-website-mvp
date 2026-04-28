import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import logo from "@/assets/nasmed-logo.png";
import authService from "@/lib/authService";

const DEMO_APPS = [
  {
    id: "APP-001", name: "Dr. Chike Okafor", email: "chike.okafor@gmail.com", prof: "Sports Physician",
    tier: "Professional Member", state: "Lagos", date: "28/06/2024", status: "pending",
    phone: "+234 803 456 7890", altEmail: "—", qualifications: "MBBS, MSc Sports Medicine",
    workplace: "Lagos University Teaching Hospital",
    referee1: { name: "Prof. O. Makanju", email: "makanju@unilag.edu.ng", mobile: "+234 802 111 2222" },
    referee2: { name: "Dr. B.O. Onabowale", email: "onabowale@nasmed.ng", mobile: "+234 803 333 4444" },
    statement: "I am a dedicated sports medicine physician with over eight years of clinical experience in managing musculoskeletal injuries, sports-related concussions, and performance optimisation for elite and recreational athletes across Nigeria.",
    payment: "Paid", submitted: "28 Jun 2024",
  },
  {
    id: "APP-002", name: "Mrs. Abiodun Salami", email: "abiodun.salami@email.com", prof: "Physiotherapist",
    tier: "Associate Member", state: "Lagos", date: "20/06/2024", status: "pending",
    phone: "+234 806 222 3344", altEmail: "salami_abio@yahoo.com", qualifications: "BSc Physiotherapy",
    workplace: "National Orthopaedic Hospital, Lagos",
    referee1: { name: "Dr. I. Taiwo", email: "i.taiwo@luth.edu.ng", mobile: "+234 801 555 6677" },
    referee2: { name: "Dr. S. Eze", email: "s.eze@nasmed.ng", mobile: "+234 805 888 9900" },
    statement: "As a physiotherapist specialising in sports rehabilitation, I have worked extensively with Nigerian football clubs.",
    payment: "Paid", submitted: "20 Jun 2024",
  },
  {
    id: "APP-003", name: "Dr. Ezekiel Adeyemi", email: "ezekiel@email.com", prof: "Exercise Physiologist",
    tier: "Fellow (FNASMED)", state: "Enugu", date: "10/06/2024", status: "approved",
    phone: "+234 803 777 8888", altEmail: "—", qualifications: "MBBS, PhD Exercise Physiology",
    workplace: "University of Nigeria Teaching Hospital",
    referee1: { name: "Prof. C. Obiora", email: "c.obiora@unth.edu.ng", mobile: "+234 803 100 2000" },
    referee2: { name: "Dr. A. Nwosu", email: "a.nwosu@nasmed.ng", mobile: "+234 807 300 4000" },
    statement: "With a PhD in Exercise Physiology and over 15 years of research and clinical practice.",
    payment: "Paid", submitted: "10 Jun 2024",
  },
  {
    id: "APP-004", name: "Dr. Fatima Garba", email: "fatima@email.com", prof: "Sports Surgeon",
    tier: "Professional Member", state: "Kano", date: "08/06/2024", status: "approved",
    phone: "+234 811 444 5555", altEmail: "fatima.garba@kth.ng", qualifications: "MBBS, FWACS (Surgery)",
    workplace: "Kano Teaching Hospital",
    referee1: { name: "Prof. M. Dankama", email: "m.dankama@kth.edu.ng", mobile: "+234 811 600 7000" },
    referee2: { name: "Dr. Y. Aliyu", email: "y.aliyu@nasmed.ng", mobile: "+234 812 800 9000" },
    statement: "As a Fellow of the West African College of Surgeons with a subspecialty in orthopaedic sports surgery.",
    payment: "Paid", submitted: "08 Jun 2024",
  },
  {
    id: "APP-005", name: "Mr. Seun Badmos", email: "seun@email.com", prof: "Nutritionist",
    tier: "Associate Member", state: "Rivers", date: "05/06/2024", status: "rejected",
    phone: "+234 704 123 4567", altEmail: "—", qualifications: "BSc Nutrition and Dietetics",
    workplace: "Port Harcourt Sports Commission",
    referee1: { name: "Dr. T. Amadi", email: "t.amadi@uniph.edu.ng", mobile: "+234 703 111 2222" },
    referee2: { name: "Dr. C. Nwachukwu", email: "c.nwachukwu@nasmed.ng", mobile: "+234 701 333 4444" },
    statement: "I am a sports nutritionist working with the Rivers State athletics team.",
    payment: "Paid", submitted: "05 Jun 2024",
  },
  {
    id: "APP-006", name: "Dr. Halima Musa", email: "halima@email.com", prof: "Sports Psychologist",
    tier: "Professional Member", state: "Kaduna", date: "01/06/2024", status: "pending",
    phone: "+234 809 888 7766", altEmail: "halima.musa@ahms.edu.ng", qualifications: "MBBS, MSc Sports Psychology",
    workplace: "Ahmadu Bello University Medical Centre",
    referee1: { name: "Prof. D. Lawal", email: "d.lawal@abu.edu.ng", mobile: "+234 808 200 3000" },
    referee2: { name: "Dr. K. Abubakar", email: "k.abubakar@nasmed.ng", mobile: "+234 809 400 5000" },
    statement: "My work at ABU Medical Centre focuses on the psychological readiness and mental resilience of elite athletes.",
    payment: "Paid", submitted: "01 Jun 2024",
  },
  {
    id: "APP-007", name: "Dr. Tunde Olawale", email: "tunde@email.com", prof: "Physiotherapist",
    tier: "Associate Member", state: "Oyo", date: "28/05/2024", status: "pending",
    phone: "+234 812 555 6677", altEmail: "—", qualifications: "BSc, MSc Physiotherapy",
    workplace: "University College Hospital, Ibadan",
    referee1: { name: "Dr. O. Adeleke", email: "o.adeleke@uch.edu.ng", mobile: "+234 811 700 8000" },
    referee2: { name: "Dr. F. Oguntunde", email: "f.oguntunde@nasmed.ng", mobile: "+234 815 900 1000" },
    statement: "Working in one of Nigeria's foremost teaching hospitals, I have developed a strong foundation in sports rehabilitation.",
    payment: "Pending", submitted: "28 May 2024",
  },
];

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

const DEMO_PUBLICATIONS = [
  { id: "PUB-001", title: "NASMED Clinical Guidelines for Sports Injury Management", type: "Guidelines", date: "Dec 2024", downloads: 234, status: "published", access: "subscribed", price: "", fileName: "" },
  { id: "PUB-002", title: "Quarterly Sports Medicine Journal - Q4 2024", type: "Journal", date: "Oct 2024", downloads: 567, status: "published", access: "paid", price: "₦2,500", fileName: "" },
  { id: "PUB-003", title: "Concussion Management Protocol for Nigerian Athletes", type: "Protocol", date: "Sep 2024", downloads: 892, status: "published", access: "free", price: "", fileName: "" },
  { id: "PUB-004", title: "Exercise Prescription for Chronic Disease Management", type: "Research", date: "Aug 2024", downloads: 445, status: "published", access: "subscribed", price: "", fileName: "" },
  { id: "PUB-005", title: "NASMED Newsletter - January 2025", type: "Newsletter", date: "Jan 2025", downloads: 123, status: "draft", access: "free", price: "", fileName: "" },
];

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

type App = typeof DEMO_APPS[0];
type Publication = typeof DEMO_PUBLICATIONS[0];
type Subscription = { id: string; member: string; tier: string; start: string; expiry: string; status: string; amount: string };

const LOCAL_ADMIN_PASSWORD = "nasmed@admin2024";

export default function AdminPage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Local admin auth fallback (used when Supabase auth is unavailable)
  const [localAuth, setLocalAuth] = useState(() => sessionStorage.getItem("nasmed_admin") === "1");
  const [localPw, setLocalPw] = useState("");
  const [localErr, setLocalErr] = useState("");

  // All hooks must be declared before any conditional returns (React rules of hooks)
  const [activeSection, setActiveSection] = useState("dashboard");
  const [applications, setApplications] = useState<typeof DEMO_APPS[0][]>(() => {
    try {
      const stored: typeof DEMO_APPS[0][] = JSON.parse(localStorage.getItem("nasmed_applications") || "[]");
      const storedIds = new Set(stored.map(a => a.id));
      const demo = DEMO_APPS.filter(a => !storedIds.has(a.id));
      return [...stored, ...demo];
    } catch {
      return [...DEMO_APPS];
    }
  });
  const [members, setMembers] = useState(DEMO_MEMBERS_INIT);
  const [publications, setPublications] = useState(DEMO_PUBLICATIONS);
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
  const [viewApp, setViewApp] = useState<App | null>(null);
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
  const [editMember, setEditMember] = useState<typeof DEMO_MEMBERS_INIT[0] | null>(null);
  const [transactions, setTransactions] = useState<Record<string, unknown>[]>(() => {
    try { return JSON.parse(localStorage.getItem("nasmed_transactions") || "[]"); } catch { return []; }
  });
  const [txnTypeFilter, setTxnTypeFilter] = useState<"all" | "membership" | "contribution">("all");

  const canAccess = localAuth || (!loading && isAdmin);

  const [initProgress, setInitProgress] = useState<{ done: number; total: number; running: boolean; log: string[] }>({ done: 0, total: 0, running: false, log: [] });
  const [approvedCreds, setApprovedCreds] = useState<{ name: string; username: string; nasmedEmail: string; memberNumber: string; password: string } | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

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

  // Show local login form if not authenticated via Supabase and not locally authenticated
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
        const newMember = {
          id: memberNumber,
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
      }
    }

    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (viewApp?.id === id) setViewApp(prev => prev ? { ...prev, status: newStatus } : null);
    try {
      const stored: Record<string, unknown>[] = JSON.parse(localStorage.getItem("nasmed_applications") || "[]");
      const updated = stored.map(a => a.id === id ? { ...a, status: newStatus } : a);
      localStorage.setItem("nasmed_applications", JSON.stringify(updated));
    } catch { /* ignore */ }
    if (action !== "approve") toast.success("Application rejected & member notified.");
  };

  const addMember = () => {
    if (!afFname || !afLname) { toast.error("Please fill in required fields."); return; }
    const m = {
      id: "NAS-" + (members.length + 1).toString().padStart(4, "0"),
      name: "Dr. " + afFname + " " + afLname,
      username: (afFname + "." + afLname).toLowerCase(),
      password: "nasmed2024",
      prof: afProf || "Professional",
      tier: afTier, state: afState,
      joined: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      status: "active", position: "", mustChange: true,
    };
    setMembers(prev => [m, ...prev]);
    toast.success(`Member ${m.name} registered!`);
    setAfFname(""); setAfLname(""); setAfEmail(""); setAfPhone(""); setAfProf("");
  };

  const handleConfirmTransaction = (ref: string) => {
    try {
      const txns: Record<string, unknown>[] = JSON.parse(localStorage.getItem("nasmed_transactions") || "[]");
      const updated = txns.map(t => t.ref === ref ? { ...t, status: "confirmed" } : t);
      localStorage.setItem("nasmed_transactions", JSON.stringify(updated));
      setTransactions(updated);
      toast.success("Payment confirmed successfully!");
    } catch { /* ignore */ }
  };

  const deleteMember = (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      setMembers(prev => prev.filter(m => m.id !== id));
      toast.success("Member deleted successfully");
    }
  };

  const saveMember = () => {
    if (!editMember) return;
    setMembers(prev => prev.map(m => m.id === editMember.id ? editMember : m));
    setEditMember(null);
    toast.success("Member updated successfully");
  };

  const addPublication = () => {
    if (!pubTitle) { toast.error("Please enter a title."); return; }
    if (pubAccess === "paid" && !pubPrice) { toast.error("Please enter a price for paid publications."); return; }
    const p: Publication = {
      id: "PUB-" + (publications.length + 1).toString().padStart(3, "0"),
      title: pubTitle,
      type: pubType,
      date: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      downloads: 0,
      status: "published",
      access: pubAccess,
      price: pubAccess === "paid" ? pubPrice : "",
      fileName: pubFile ? pubFile.name : "",
    };
    setPublications(prev => [p, ...prev]);
    toast.success(`Publication "${p.title}" created!`);
    setPubTitle(""); setPubContent(""); setPubPrice(""); setPubFile(null); setPubAccess("free");
  };

  const deletePublication = (id: string) => {
    if (confirm("Are you sure you want to delete this publication?")) {
      setPublications(prev => prev.filter(p => p.id !== id));
      toast.success("Publication deleted");
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

  const filterRows = (rows: any[], keys: string[]) => {
    if (!search) return rows;
    const s = search.toLowerCase();
    return rows.filter(r => keys.some(k => String(r[k] || "").toLowerCase().includes(s)));
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

              {/* Recent Activity */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: "New membership application", user: "Dr. Halima Musa", time: "2 hours ago", icon: "📝" },
                    { action: "Publication downloaded", user: "Prof. Adamu Ibrahim", time: "5 hours ago", icon: "📥" },
                    { action: "Subscription renewed", user: "Dr. Folake Adeyemi", time: "1 day ago", icon: "💳" },
                    { action: "Member profile updated", user: "Dr. Chukwuma Obi", time: "2 days ago", icon: "✏️" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-nasmed-off-white transition-all">
                      <div className="w-10 h-10 bg-nasmed-off-white rounded-full flex items-center justify-center text-lg">{activity.icon}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-nasmed-navy">{activity.action}</div>
                        <div className="text-xs text-nasmed-text-muted">{activity.user}</div>
                      </div>
                      <div className="text-xs text-nasmed-text-muted">{activity.time}</div>
                    </div>
                  ))}
                </div>
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
                      {filterRows(applications, ["name", "email", "prof", "tier"]).map(a => (
                        <tr key={a.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[13px] font-semibold">{a.name}</td>
                          <td className="py-3 px-3 text-[13px]">{a.email}</td>
                          <td className="py-3 px-3 text-[13px]">{a.tier}</td>
                          <td className="py-3 px-3 text-[13px]">{a.state}</td>
                          <td className="py-3 px-3 text-[13px]">{a.date}</td>
                          <td className="py-3 px-3">
                            <span className={`py-1 px-2 rounded-full text-[11px] font-bold ${(a as Record<string, unknown>).payment === "Paid" ? "bg-nasmed-green/15 text-nasmed-green" : (a as Record<string, unknown>).payment === "Transfer Pending" ? "bg-amber-500/15 text-amber-600" : "bg-gray-100 text-gray-500"}`}>
                              {String((a as Record<string, unknown>).payment || "Pending")}
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
                      {filterRows(members, ["name", "prof", "tier"]).map(m => (
                        <tr key={m.id} className="hover:bg-nasmed-off-white">
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
                              <button onClick={() => deleteMember(m.id)} className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600">🗑</button>
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
                      {filterRows(publications, ["title", "type", "access"]).map(p => (
                        <tr key={p.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{p.id}</td>
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
                      {filterRows(subscriptions, ["member", "tier"]).map(s => (
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
              <p className="text-nasmed-text-muted text-sm mb-7">All payment records — membership registrations and additional contributions. Confirm bank transfers after verifying receipt.</p>

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
                const all = transactions;
                const pending = all.filter(t => t.status === "awaiting_confirmation");
                const confirmed = all.filter(t => t.status === "confirmed");
                const contributions = all.filter(t => t.type === "contribution");
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Total Payments", value: all.length, color: "border-nasmed-mid-blue" },
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
                    {/* Type filter tabs */}
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
                      onClick={() => { try { setTransactions(JSON.parse(localStorage.getItem("nasmed_transactions") || "[]")); } catch { /* ignore */ } }}
                      className="text-[12px] text-nasmed-mid-blue border border-nasmed-mid-blue/30 py-1 px-3 rounded cursor-pointer bg-transparent hover:bg-nasmed-mid-blue/5"
                    >↻ Refresh</button>
                    <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[180px] focus:border-nasmed-mid-blue" placeholder="Search..." />
                  </div>
                </div>

                {(() => {
                  const filtered = transactions
                    .filter(t => txnTypeFilter === "all" || t.type === txnTypeFilter)
                    .filter(t => !search || ["member","email","tier","ref","description"].some(k => String(t[k]||"").toLowerCase().includes(search.toLowerCase())));
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
                          {filtered.map((t, i) => (
                            <tr key={i} className="hover:bg-nasmed-off-white border-b border-nasmed-gray-light/40 last:border-0">
                              <td className="py-3 px-3 text-[11px] font-mono text-nasmed-text-muted">{String(t.ref || "—")}</td>
                              <td className="py-3 px-3">
                                <div className="text-[13px] font-semibold text-nasmed-navy">{String(t.member || "—")}</div>
                                <div className="text-[11px] text-nasmed-text-muted">{String(t.email || "")}</div>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`py-0.5 px-2 rounded-full text-[10px] font-bold ${t.type === "contribution" ? "bg-purple-500/10 text-purple-700" : "bg-nasmed-mid-blue/10 text-nasmed-mid-blue"}`}>
                                  {t.type === "contribution" ? "Contribution" : "Membership"}
                                </span>
                                <div className="text-[12px] text-nasmed-text-muted mt-0.5">{String(t.tier || "—")}</div>
                              </td>
                              <td className="py-3 px-3 text-[13px] font-bold text-nasmed-navy whitespace-nowrap">{String(t.amount || "—")} <span className="text-[11px] font-normal text-nasmed-text-muted">{String(t.currency || "NGN")}</span></td>
                              <td className="py-3 px-3">
                                <span className={`py-1 px-2 rounded-full text-[11px] font-bold ${t.method === "Paystack" ? "bg-[#0BA4DB]/10 text-[#0993c5]" : "bg-amber-500/10 text-amber-700"}`}>
                                  {String(t.method || "—")}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-[12px] text-nasmed-text-muted max-w-[140px] truncate" title={String(t.description || "")}>
                                {String(t.description || "—")}
                              </td>
                              <td className="py-3 px-3">
                                {t.receiptUrl ? (
                                  <a href={String(t.receiptUrl)} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-nasmed-mid-blue hover:underline whitespace-nowrap">
                                    {String(t.receiptName || "receipt").endsWith(".pdf") ? "📋 PDF" : "🖼️ Image"}
                                  </a>
                                ) : (
                                  <span className="text-[11px] text-nasmed-text-muted">None</span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                {statusBadge(t.status === "confirmed" ? "approved" : t.status === "awaiting_confirmation" ? "pending" : String(t.status || "pending"))}
                              </td>
                              <td className="py-3 px-3 text-[12px] text-nasmed-text-muted whitespace-nowrap">{String(t.date || "—")}</td>
                              <td className="py-3 px-3">
                                {t.status === "awaiting_confirmation" ? (
                                  <button
                                    onClick={() => handleConfirmTransaction(String(t.ref))}
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
                        <tr key={m.id} className="hover:bg-nasmed-off-white">
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
                {(viewApp as any).receiptUrl ? (
                  <div className="border border-nasmed-green/30 rounded-lg p-4 bg-nasmed-green/5 flex items-center gap-4">
                    <span className="text-3xl">{((viewApp as any).receiptName || "").endsWith(".pdf") ? "📋" : "🖼️"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-nasmed-navy truncate">{(viewApp as any).receiptName || "Payment Receipt"}</p>
                      <p className="text-[11px] text-nasmed-green font-semibold mt-0.5">Receipt submitted by applicant</p>
                    </div>
                    <a
                      href={(viewApp as any).receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-nasmed-navy text-white text-[12px] font-semibold py-2 px-4 rounded-lg hover:opacity-90 no-underline"
                    >
                      {((viewApp as any).receiptName || "").endsWith(".pdf") ? "Open PDF" : "View Image"}
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
                    <option>Professional Member</option>
                    <option>Fellow (FNASMED)</option>
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
    </div>
  );
}