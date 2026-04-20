import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import logo from "@/assets/nasmed-logo.png";

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
  { id: "NAS-0001", name: "Prof. Adamu Ibrahim", username: "adamu.ibrahim", password: "nasmed2024", prof: "Orthopaedic Surgeon", tier: "Fellow (FNASMED)", state: "Abuja (FCT)", joined: "Jan 1988", status: "active", position: "President", mustChange: true },
  { id: "NAS-0002", name: "Dr. Folake Adeyemi", username: "folake.adeyemi", password: "nasmed2024", prof: "Exercise Physiologist", tier: "Fellow (FNASMED)", state: "Lagos", joined: "Mar 1990", status: "active", position: "Vice President", mustChange: true },
  { id: "NAS-0003", name: "Dr. Chukwuma Obi", username: "chukwuma.obi", password: "nasmed2024", prof: "Sports Medicine", tier: "Professional Member", state: "Enugu", joined: "Jul 2005", status: "active", position: "General Secretary", mustChange: false },
  { id: "NAS-0004", name: "Dr. B.O. Onabowale", username: "bo.onabowale", password: "nasmed94!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Lagos", joined: "Jan 1994", status: "active", position: "President", mustChange: true },
  { id: "NAS-0005", name: "Dr. Senbanjo", username: "senbanjo", password: "nasmed94!", prof: "Medical Doctor", tier: "Professional Member", state: "Lagos", joined: "Jan 1994", status: "active", position: "1st Vice President", mustChange: true },
  { id: "NAS-0006", name: "Dr. Nana Yesufu", username: "nana.yesufu", password: "nasmed94!", prof: "Medical Doctor", tier: "Fellow (FNASMED)", state: "Lagos", joined: "Jan 1994", status: "active", position: "3rd Vice President", mustChange: true },
];

const DEMO_PUBLICATIONS = [
  { id: "PUB-001", title: "NASMED Clinical Guidelines for Sports Injury Management", type: "Guidelines", date: "Dec 2024", downloads: 234, status: "published" },
  { id: "PUB-002", title: "Quarterly Sports Medicine Journal - Q4 2024", type: "Journal", date: "Oct 2024", downloads: 567, status: "published" },
  { id: "PUB-003", title: "Concussion Management Protocol for Nigerian Athletes", type: "Protocol", date: "Sep 2024", downloads: 892, status: "published" },
  { id: "PUB-004", title: "Exercise Prescription for Chronic Disease Management", type: "Research", date: "Aug 2024", downloads: 445, status: "published" },
  { id: "PUB-005", title: "NASMED Newsletter - January 2025", type: "Newsletter", date: "Jan 2025", downloads: 123, status: "draft" },
];

const DEMO_SUBSCRIPTIONS = [
  { id: "SUB-001", member: "Prof. Adamu Ibrahim", tier: "Fellow (FNASMED)", start: "Jan 2024", expiry: "Jan 2025", status: "active", amount: "₦50,000" },
  { id: "SUB-002", member: "Dr. Folake Adeyemi", tier: "Fellow (FNASMED)", start: "Mar 2024", expiry: "Mar 2025", status: "active", amount: "₦50,000" },
  { id: "SUB-003", member: "Dr. Chukwuma Obi", tier: "Professional Member", start: "Jul 2024", expiry: "Jul 2025", status: "active", amount: "₦30,000" },
  { id: "SUB-004", member: "Dr. Bola Adeyemo", tier: "Professional Member", start: "Apr 2023", expiry: "Apr 2024", status: "expired", amount: "₦30,000" },
  { id: "SUB-005", member: "Dr. Uche Nwankwo", tier: "Associate Member", start: "May 2023", expiry: "May 2024", status: "expired", amount: "₦15,000" },
];

const DEMO_RENEWALS = [
  { id: "NAS-0012", name: "Dr. Bola Adeyemo", tier: "Professional Member", expiry: "Apr 15, 2024", days: 12 },
  { id: "NAS-0018", name: "Dr. Uche Nwankwo", tier: "Associate Member", expiry: "Apr 20, 2024", days: 17 },
  { id: "NAS-0025", name: "Dr. Fatima Ali", tier: "Fellow (FNASMED)", expiry: "May 01, 2024", days: 28 },
];

const nigerianStates = [
  "Abuja (FCT)", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

type App = typeof DEMO_APPS[0];
type Publication = typeof DEMO_PUBLICATIONS[0];
type Subscription = typeof DEMO_SUBSCRIPTIONS[0];

export default function AdminPage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  // All hooks must be declared before any conditional returns (React rules of hooks)
  const [activeSection, setActiveSection] = useState("dashboard");
  const [applications, setApplications] = useState(DEMO_APPS);
  const [members, setMembers] = useState(DEMO_MEMBERS_INIT);
  const [publications, setPublications] = useState(DEMO_PUBLICATIONS);
  const [subscriptions, setSubscriptions] = useState(DEMO_SUBSCRIPTIONS);
  const [search, setSearch] = useState("");
  const [totalMembers, setTotalMembers] = useState(1433);
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
  const [editMember, setEditMember] = useState<typeof DEMO_MEMBERS_INIT[0] | null>(null);

  // Redirect if not authenticated or not admin
  if (loading) {
    return <LoadingScreen message="Verifying admin access..." size="medium" />;
  }

  if (!user) {
    navigate("/member-login");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="pt-[78px] min-h-screen bg-nasmed-off-white flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 w-full max-w-[440px] shadow-xl text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="font-heading text-nasmed-navy text-[26px] mb-2">Access Denied</h2>
          <p className="text-nasmed-text-muted text-sm mb-6">You do not have admin privileges. Only administrators can access this portal.</p>

          {/* Debug Info */}
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

  const handleAction = (id: string, action: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: action === "approve" ? "approved" : "rejected" } : a));
    if (viewApp?.id === id) setViewApp(prev => prev ? { ...prev, status: action === "approve" ? "approved" : "rejected" } : null);
    toast.success(action === "approve" ? "Application approved & member notified!" : "Application rejected & member notified.");
  };

  const addMember = () => {
    if (!afFname || !afLname) { toast.error("Please fill in required fields."); return; }
    const m = {
      id: "NAS-" + (totalMembers + 1).toString().padStart(4, "0"),
      name: "Dr. " + afFname + " " + afLname,
      username: (afFname + "." + afLname).toLowerCase(),
      password: "nasmed2024",
      prof: afProf || "Professional",
      tier: afTier, state: afState,
      joined: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      status: "active", position: "", mustChange: true,
    };
    setMembers(prev => [m, ...prev]);
    setTotalMembers(prev => prev + 1);
    toast.success(`Member ${m.name} registered!`);
    setAfFname(""); setAfLname(""); setAfEmail(""); setAfPhone(""); setAfProf("");
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
    const p: Publication = {
      id: "PUB-" + (publications.length + 1).toString().padStart(3, "0"),
      title: pubTitle,
      type: pubType,
      date: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      downloads: 0,
      status: "published",
    };
    setPublications(prev => [p, ...prev]);
    toast.success(`Publication "${p.title}" created!`);
    setPubTitle(""); setPubContent("");
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
              <button onClick={signOut} className="w-full flex items-center gap-2.5 py-2.5 px-6 text-white/65 text-[13.5px] font-medium cursor-pointer border-none bg-transparent text-left hover:bg-white/5 hover:text-white mt-8">
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
                  { num: totalMembers.toLocaleString(), label: "Total Members", trend: "↑ +23 this month", color: "border-nasmed-mid-blue" },
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
                    <thead><tr>{["Name", "Email", "Profession", "Tier", "State", "Date", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {filterRows(applications, ["name", "email", "prof"]).map(a => (
                        <tr key={a.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[13px] font-semibold">{a.name}</td>
                          <td className="py-3 px-3 text-[13px]">{a.email}</td>
                          <td className="py-3 px-3 text-[13px]">{a.prof}</td>
                          <td className="py-3 px-3 text-[13px]">{a.tier}</td>
                          <td className="py-3 px-3 text-[13px]">{a.state}</td>
                          <td className="py-3 px-3 text-[13px]">{a.date}</td>
                          <td className="py-3 px-3">{statusBadge(a.status)}</td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1.5 items-center">
                              <button onClick={() => setViewApp(a)} className="bg-nasmed-mid-blue text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80">View</button>
                              {a.status === "pending" && <>
                                <button onClick={() => handleAction(a.id, "approve")} className="bg-nasmed-green text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-nasmed-green-light">✓</button>
                                <button onClick={() => handleAction(a.id, "reject")} className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600">✗</button>
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
                    <thead><tr>{["ID", "Title", "Type", "Date", "Downloads", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {filterRows(publications, ["title", "type"]).map(p => (
                        <tr key={p.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{p.id}</td>
                          <td className="py-3 px-3 text-[13px] font-semibold max-w-[200px] truncate">{p.title}</td>
                          <td className="py-3 px-3 text-[13px]">{p.type}</td>
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

          {/* ── Credentials ── */}
          {activeSection === "credentials" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Member Credentials</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">View and manage member login credentials for the Member Portal.</p>
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
            </div>
            <div className="flex items-center gap-3 px-7 py-4 border-t border-nasmed-gray-light bg-white">
              <button onClick={() => setViewApp(null)} className="py-3 px-6 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[14px] font-semibold cursor-pointer hover:bg-nasmed-off-white bg-white">Close</button>
              {viewApp.status === "pending" && (
                <>
                  <button onClick={() => { handleAction(viewApp.id, "approve"); setViewApp(null); }} className="flex-1 py-3 rounded-lg bg-nasmed-green text-white border-none text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light">✓ Approve</button>
                  <button onClick={() => { handleAction(viewApp.id, "reject"); setViewApp(null); }} className="flex-1 py-3 rounded-lg bg-red-500 text-white border-none text-[14px] font-bold cursor-pointer hover:bg-red-600">✗ Reject</button>
                </>
              )}
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