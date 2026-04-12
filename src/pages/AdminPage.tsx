import { useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/nasmed-logo.png";

const DEMO_APPS = [
  {
    id: "APP-001", name: "Dr. Chike Okafor", email: "chike.okafor@gmail.com", prof: "Sports Physician",
    tier: "Professional Member", state: "Lagos", date: "28/06/2024", status: "pending",
    phone: "+234 803 456 7890", altEmail: "—", qualifications: "MBBS, MSc Sports Medicine",
    workplace: "Lagos University Teaching Hospital",
    referee1: { name: "Prof. O. Makanju", email: "makanju@unilag.edu.ng", mobile: "+234 802 111 2222" },
    referee2: { name: "Dr. B.O. Onabowale", email: "onabowale@nasmed.ng", mobile: "+234 803 333 4444" },
    statement: "I am a dedicated sports medicine physician with over eight years of clinical experience in managing musculoskeletal injuries, sports-related concussions, and performance optimisation for elite and recreational athletes across Nigeria. My interest in joining NASMED stems from a desire to contribute to the professionalisation of sports medicine practice in Nigeria and to benefit from the rich network of colleagues who share the same commitment to athlete welfare. I have completed my MBBS at the University of Lagos and subsequently obtained an MSc in Sports Medicine from the University of Bath, UK. I am committed to upholding the highest ethical standards and to contributing actively to NASMED's research and continuing professional development programmes.",
    payment: "Paid", submitted: "28 Jun 2024",
  },
  {
    id: "APP-002", name: "Mrs. Abiodun Salami", email: "abiodun.salami@email.com", prof: "Physiotherapist",
    tier: "Associate Member", state: "Lagos", date: "20/06/2024", status: "pending",
    phone: "+234 806 222 3344", altEmail: "salami_abio@yahoo.com", qualifications: "BSc Physiotherapy",
    workplace: "National Orthopaedic Hospital, Lagos",
    referee1: { name: "Dr. I. Taiwo", email: "i.taiwo@luth.edu.ng", mobile: "+234 801 555 6677" },
    referee2: { name: "Dr. S. Eze", email: "s.eze@nasmed.ng", mobile: "+234 805 888 9900" },
    statement: "As a physiotherapist specialising in sports rehabilitation, I have worked extensively with Nigerian football clubs and track-and-field athletes. I believe NASMED membership will enhance my professional credibility and give me access to evidence-based resources that directly improve patient outcomes.",
    payment: "Paid", submitted: "20 Jun 2024",
  },
  {
    id: "APP-003", name: "Dr. Ezekiel Adeyemi", email: "ezekiel@email.com", prof: "Exercise Physiologist",
    tier: "Fellow (FNASMED)", state: "Enugu", date: "10/06/2024", status: "approved",
    phone: "+234 803 777 8888", altEmail: "—", qualifications: "MBBS, PhD Exercise Physiology",
    workplace: "University of Nigeria Teaching Hospital",
    referee1: { name: "Prof. C. Obiora", email: "c.obiora@unth.edu.ng", mobile: "+234 803 100 2000" },
    referee2: { name: "Dr. A. Nwosu", email: "a.nwosu@nasmed.ng", mobile: "+234 807 300 4000" },
    statement: "With a PhD in Exercise Physiology and over 15 years of research and clinical practice, I seek fellowship status to contribute to NASMED's academic leadership and mentor the next generation of sports medicine professionals in South-East Nigeria.",
    payment: "Paid", submitted: "10 Jun 2024",
  },
  {
    id: "APP-004", name: "Dr. Fatima Garba", email: "fatima@email.com", prof: "Sports Surgeon",
    tier: "Professional Member", state: "Kano", date: "08/06/2024", status: "approved",
    phone: "+234 811 444 5555", altEmail: "fatima.garba@kth.ng", qualifications: "MBBS, FWACS (Surgery)",
    workplace: "Kano Teaching Hospital",
    referee1: { name: "Prof. M. Dankama", email: "m.dankama@kth.edu.ng", mobile: "+234 811 600 7000" },
    referee2: { name: "Dr. Y. Aliyu", email: "y.aliyu@nasmed.ng", mobile: "+234 812 800 9000" },
    statement: "As a Fellow of the West African College of Surgeons with a subspecialty in orthopaedic sports surgery, I look forward to contributing my surgical expertise to NASMED's multidisciplinary approach to athlete care in Northern Nigeria.",
    payment: "Paid", submitted: "08 Jun 2024",
  },
  {
    id: "APP-005", name: "Mr. Seun Badmos", email: "seun@email.com", prof: "Nutritionist",
    tier: "Associate Member", state: "Rivers", date: "05/06/2024", status: "rejected",
    phone: "+234 704 123 4567", altEmail: "—", qualifications: "BSc Nutrition and Dietetics",
    workplace: "Port Harcourt Sports Commission",
    referee1: { name: "Dr. T. Amadi", email: "t.amadi@uniph.edu.ng", mobile: "+234 703 111 2222" },
    referee2: { name: "Dr. C. Nwachukwu", email: "c.nwachukwu@nasmed.ng", mobile: "+234 701 333 4444" },
    statement: "I am a sports nutritionist working with the Rivers State athletics team. I wish to join NASMED to formally align my practice with sports medicine standards and gain access to structured CPD opportunities.",
    payment: "Paid", submitted: "05 Jun 2024",
  },
  {
    id: "APP-006", name: "Dr. Halima Musa", email: "halima@email.com", prof: "Sports Psychologist",
    tier: "Professional Member", state: "Kaduna", date: "01/06/2024", status: "pending",
    phone: "+234 809 888 7766", altEmail: "halima.musa@ahms.edu.ng", qualifications: "MBBS, MSc Sports Psychology",
    workplace: "Ahmadu Bello University Medical Centre",
    referee1: { name: "Prof. D. Lawal", email: "d.lawal@abu.edu.ng", mobile: "+234 808 200 3000" },
    referee2: { name: "Dr. K. Abubakar", email: "k.abubakar@nasmed.ng", mobile: "+234 809 400 5000" },
    statement: "My work at ABU Medical Centre focuses on the psychological readiness and mental resilience of elite athletes. Joining NASMED as a Professional Member will allow me to collaborate with colleagues across disciplines to deliver truly holistic athlete care.",
    payment: "Paid", submitted: "01 Jun 2024",
  },
  {
    id: "APP-007", name: "Dr. Tunde Olawale", email: "tunde@email.com", prof: "Physiotherapist",
    tier: "Associate Member", state: "Oyo", date: "28/05/2024", status: "pending",
    phone: "+234 812 555 6677", altEmail: "—", qualifications: "BSc, MSc Physiotherapy",
    workplace: "University College Hospital, Ibadan",
    referee1: { name: "Dr. O. Adeleke", email: "o.adeleke@uch.edu.ng", mobile: "+234 811 700 8000" },
    referee2: { name: "Dr. F. Oguntunde", email: "f.oguntunde@nasmed.ng", mobile: "+234 815 900 1000" },
    statement: "Working in one of Nigeria's foremost teaching hospitals, I have developed a strong foundation in sports rehabilitation. NASMED membership will help me formalise my sports medicine pathway and contribute to the growing community of practitioners in South-West Nigeria.",
    payment: "Pending", submitted: "28 May 2024",
  },
];

const DEMO_MEMBERS_INIT = [
  { id: "NAS-0001", name: "Prof. Adamu Ibrahim", username: "adamu.ibrahim", password: "nasmed2024", prof: "Orthopaedic Surgeon", tier: "Fellow (FNASMED)", state: "Abuja (FCT)", joined: "Jan 1988", status: "active", position: "President", mustChange: true },
  { id: "NAS-0002", name: "Dr. Folake Adeyemi", username: "folake.adeyemi", password: "nasmed2024", prof: "Exercise Physiologist", tier: "Fellow (FNASMED)", state: "Lagos", joined: "Mar 1990", status: "active", position: "Vice President", mustChange: true },
  { id: "NAS-0003", name: "Dr. Chukwuma Obi", username: "chukwuma.obi", password: "nasmed2024", prof: "Sports Medicine", tier: "Professional Member", state: "Enugu", joined: "Jul 2005", status: "active", position: "General Secretary", mustChange: false },
];

const DEMO_RENEWALS = [
  { id: "NAS-0012", name: "Dr. Bola Adeyemo", tier: "Professional Member", expiry: "Apr 15, 2024", days: 12 },
  { id: "NAS-0018", name: "Dr. Uche Nwankwo", tier: "Associate Member", expiry: "Apr 20, 2024", days: 17 },
  { id: "NAS-0025", name: "Dr. Fatima Ali", tier: "Fellow (FNASMED)", expiry: "May 01, 2024", days: 28 },
  { id: "NAS-0033", name: "Dr. Segun Olumide", tier: "Professional Member", expiry: "May 10, 2024", days: 37 },
];

const nigerianStates = [
  "Abuja (FCT)", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

type App = typeof DEMO_APPS[0];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("nasmed2024");
  const [loginErr, setLoginErr] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [applications, setApplications] = useState(DEMO_APPS);
  const [members, setMembers] = useState(DEMO_MEMBERS_INIT);
  const [search, setSearch] = useState("");
  const [totalMembers, setTotalMembers] = useState(1412);

  // View application modal
  const [viewApp, setViewApp] = useState<App | null>(null);

  // Add member form
  const [afFname, setAfFname] = useState("");
  const [afLname, setAfLname] = useState("");
  const [afEmail, setAfEmail] = useState("");
  const [afPhone, setAfPhone] = useState("");
  const [afProf, setAfProf] = useState("");
  const [afTier, setAfTier] = useState("Professional Member");
  const [afState, setAfState] = useState("");

  const handleLogin = () => {
    if (user === "admin" && pass === "nasmed2024") { setLoggedIn(true); setLoginErr(false); }
    else setLoginErr(true);
  };

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

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-500/15 text-amber-600",
      approved: "bg-nasmed-green/15 text-nasmed-green",
      rejected: "bg-red-500/15 text-red-600",
      active: "bg-nasmed-mid-blue/10 text-nasmed-mid-blue",
    };
    return <span className={`py-1 px-2.5 rounded-full text-[11px] font-bold tracking-wide capitalize ${map[s] || ""}`}>{s}</span>;
  };

  if (!loggedIn) {
    return (
      <div className="pt-[78px] min-h-screen bg-nasmed-off-white flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 w-full max-w-[440px] shadow-xl">
          <div className="text-center mb-8">
            <img src={logo} alt="NASMED" className="w-20 h-20 rounded-full object-cover border-[3px] border-nasmed-green-light mx-auto mb-4" />
            <h2 className="font-heading text-nasmed-navy text-[26px] mb-1.5">Admin Portal</h2>
            <p className="text-nasmed-text-muted text-sm">Sign in to manage NASMED membership applications and records.</p>
          </div>
          {loginErr && <div className="bg-red-500/10 text-red-600 py-2.5 px-3.5 rounded-lg text-[13px] mb-4">Invalid credentials. Please try again.</div>}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-nasmed-navy">Username</label>
              <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="admin" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-nasmed-navy">Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <button onClick={handleLogin} className="bg-nasmed-green text-white border-none py-3 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all w-full">Sign In →</button>
          </div>
          <p className="text-center text-xs text-nasmed-gray mt-4">Demo: admin / nasmed2024</p>
        </div>
      </div>
    );
  }

  const pendingCount = applications.filter(a => a.status === "pending").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;

  const sidebarItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "applications", icon: "📋", label: "Applications" },
    { key: "members", icon: "👥", label: "Members" },
    { key: "renewals", icon: "🔄", label: "Renewals" },
    { key: "addmember", icon: "➕", label: "Add Member" },
    { key: "credentials", icon: "⚙️", label: "Settings" },
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
              <button onClick={() => setLoggedIn(false)} className="w-full flex items-center gap-2.5 py-2.5 px-6 text-white/65 text-[13.5px] font-medium cursor-pointer border-none bg-transparent text-left hover:bg-white/5 hover:text-white mt-8">
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
              <p className="text-nasmed-text-muted text-sm mb-7">Welcome back. Here's a summary of NASMED membership activity.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
                {[
                  { num: totalMembers.toLocaleString(), label: "Total Members", trend: "↑ +23 this month", color: "border-nasmed-mid-blue" },
                  { num: String(pendingCount), label: "Pending Applications", trend: "Needs Review", color: "border-nasmed-green", trendColor: "text-amber-500" },
                  { num: String(approvedCount), label: "Approved This Month", trend: "↑ New Members", color: "border-amber-500" },
                  { num: String(DEMO_RENEWALS.length), label: "Renewals Due", trend: "Expiring Soon", color: "border-red-500", trendColor: "text-red-500" },
                ].map((c, i) => (
                  <div key={i} className={`bg-white rounded-xl p-6 shadow-sm border-t-4 ${c.color}`}>
                    <div className="font-heading text-[32px] font-bold text-nasmed-navy leading-none">{c.num}</div>
                    <div className="text-[13px] text-nasmed-text-muted mt-1">{c.label}</div>
                    <div className={`text-xs font-semibold mt-2 ${c.trendColor || "text-nasmed-green"}`}>{c.trend}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-nasmed-navy">Recent Applications</h3>
                  <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[220px] focus:border-nasmed-mid-blue" placeholder="Search..." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead><tr>{["Name", "Type", "Date", "Status"].map(h => <th key={h} className="text-left py-2.5 px-3.5 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {filterRows(applications.slice(0, 5), ["name", "tier"]).map(a => (
                        <tr key={a.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3.5 text-[13px] font-semibold">{a.name}</td>
                          <td className="py-3 px-3.5 text-[13px]">{a.tier}</td>
                          <td className="py-3 px-3.5 text-[13px]">{a.date}</td>
                          <td className="py-3 px-3.5">{statusBadge(a.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                            <button onClick={() => toast.info(`Member profile: ${m.name}`)} className="bg-nasmed-mid-blue text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ── Renewals ── */}
          {activeSection === "renewals" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Membership Renewals</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">Members with subscriptions expiring in the next 60 days.</p>
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-nasmed-navy">Renewals Due</h3>
                  <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[220px] focus:border-nasmed-mid-blue" placeholder="Search..." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead><tr>{["Member ID", "Name", "Tier", "Expiry Date", "Days Left", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {filterRows(DEMO_RENEWALS, ["name", "tier"]).map(r => (
                        <tr key={r.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{r.id}</td>
                          <td className="py-3 px-3 text-[13px] font-semibold">{r.name}</td>
                          <td className="py-3 px-3 text-[13px]">{r.tier}</td>
                          <td className="py-3 px-3 text-[13px]">{r.expiry}</td>
                          <td className="py-3 px-3"><span className={`font-bold ${r.days < 30 ? "text-red-600" : "text-amber-600"}`}>{r.days} days</span></td>
                          <td className="py-3 px-3">
                            <button onClick={() => toast.success(`Reminder sent to ${r.name}`)} className="bg-nasmed-green text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:bg-nasmed-green-light">Send Reminder</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ── Add Member ── */}
          {activeSection === "addmember" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Register New Member</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">Manually add a new member to the NASMED directory.</p>
              <div className="bg-white rounded-[14px] p-8 shadow-sm max-w-[700px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">First Name <span className="text-red-600">*</span></label>
                    <input type="text" value={afFname} onChange={e => setAfFname(e.target.value)} placeholder="First name" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Last Name <span className="text-red-600">*</span></label>
                    <input type="text" value={afLname} onChange={e => setAfLname(e.target.value)} placeholder="Last name" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Email</label>
                    <input type="email" value={afEmail} onChange={e => setAfEmail(e.target.value)} placeholder="email@example.com" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Phone</label>
                    <input type="tel" value={afPhone} onChange={e => setAfPhone(e.target.value)} placeholder="+234..." className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Profession</label>
                    <input type="text" value={afProf} onChange={e => setAfProf(e.target.value)} placeholder="e.g. Sports Physician" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Membership Tier</label>
                    <select value={afTier} onChange={e => setAfTier(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue">
                      <option>Associate Member</option>
                      <option>Professional Member</option>
                      <option>Fellow (FNASMED)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[13px] font-semibold text-nasmed-navy">State of Practice</label>
                    <select value={afState} onChange={e => setAfState(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue">
                      <option value="">— Select State —</option>
                      {nigerianStates.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={addMember} className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all mt-6">Register Member →</button>
              </div>
            </>
          )}

          {/* ── Settings / Credentials ── */}
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

      {/* ══════════════════════════════════════════════════
          APPLICATION REVIEW MODAL
      ══════════════════════════════════════════════════ */}
      {viewApp && (
        <div
          className="fixed inset-0 bg-black/60 z-[3000] flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setViewApp(null); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-[760px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

            {/* ── Modal Header ── */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-nasmed-gray-light flex-shrink-0">
              <h2 className="font-heading text-nasmed-navy text-[17px] font-bold leading-snug">
                Application Review — {viewApp.name} — Full Application Review
              </h2>
              <button onClick={() => setViewApp(null)} className="w-8 h-8 rounded-full border border-nasmed-gray-light bg-white text-nasmed-text-muted flex items-center justify-center text-lg cursor-pointer hover:bg-nasmed-off-white transition-all flex-shrink-0 ml-4">✕</button>
            </div>

            {/* ── Status bar ── */}
            <div className="flex items-center justify-between px-7 py-3.5 border-b border-nasmed-gray-light bg-nasmed-off-white/60 flex-shrink-0 flex-wrap gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`flex items-center gap-1.5 py-1 px-3 rounded-full text-[12px] font-bold border ${
                  viewApp.status === "pending" ? "border-amber-400 text-amber-600 bg-amber-50" :
                  viewApp.status === "approved" ? "border-nasmed-green text-nasmed-green bg-nasmed-green/5" :
                  "border-red-400 text-red-600 bg-red-50"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${viewApp.status === "pending" ? "bg-amber-500" : viewApp.status === "approved" ? "bg-nasmed-green" : "bg-red-500"}`} />
                  {viewApp.status.charAt(0).toUpperCase() + viewApp.status.slice(1)}
                </span>
                <span className="py-1 px-3 rounded-full text-[12px] font-bold border border-nasmed-mid-blue text-nasmed-mid-blue bg-nasmed-mid-blue/5">
                  {viewApp.tier}
                </span>
                <span className={`py-1 px-3 rounded-full text-[12px] font-bold border ${viewApp.payment === "Paid" ? "border-nasmed-green text-nasmed-green bg-nasmed-green/5" : "border-amber-400 text-amber-600 bg-amber-50"}`}>
                  Payment: {viewApp.payment === "Paid" ? "✓" : "⏳"} {viewApp.payment}
                </span>
              </div>
              <span className="text-[12px] text-nasmed-text-muted">Submitted: {viewApp.submitted}</span>
            </div>

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1 px-7 py-6 flex flex-col gap-7">

              {/* Section A */}
              <div>
                <p className="text-[11px] font-bold tracking-[2px] uppercase text-nasmed-mid-blue mb-4 pb-2 border-b border-nasmed-gray-light">
                  Section A — Contact Details & Personal Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {field("Full Name", viewApp.name)}
                  {field("Personal Email", viewApp.email)}
                  {field("Mobile Number", viewApp.phone)}
                  {field("Alternate Email", viewApp.altEmail)}
                  {field("State of Practice", viewApp.state)}
                  {field("Profession / Specialty", viewApp.prof)}
                  {field("Qualifications", viewApp.qualifications)}
                  {field("Place of Work", viewApp.workplace)}
                </div>
              </div>

              {/* Referee Details */}
              <div>
                <p className="text-[11px] font-bold tracking-[2px] uppercase text-nasmed-mid-blue mb-4 pb-2 border-b border-nasmed-gray-light">
                  Referee Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ label: "Referee 1", ref: viewApp.referee1 }, { label: "Referee 2", ref: viewApp.referee2 }].map(({ label, ref }) => (
                    <div key={label} className="border border-nasmed-gray-light rounded-lg p-4 bg-nasmed-off-white/40">
                      <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-nasmed-mid-blue mb-3">{label}</p>
                      <div className="flex flex-col gap-1.5 text-[13px]">
                        <div className="grid grid-cols-[60px_1fr] gap-1">
                          <span className="text-nasmed-text-muted font-medium">Name:</span>
                          <span className="text-nasmed-navy font-semibold">{ref.name}</span>
                        </div>
                        <div className="grid grid-cols-[60px_1fr] gap-1">
                          <span className="text-nasmed-text-muted font-medium">Email:</span>
                          <span className="text-nasmed-navy">{ref.email}</span>
                        </div>
                        <div className="grid grid-cols-[60px_1fr] gap-1">
                          <span className="text-nasmed-text-muted font-medium">Mobile:</span>
                          <span className="text-nasmed-navy">{ref.mobile}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Candidate Statement */}
              <div>
                <p className="text-[11px] font-bold tracking-[2px] uppercase text-nasmed-mid-blue mb-4 pb-2 border-b border-nasmed-gray-light">
                  Candidate Statement ({viewApp.tier})
                </p>
                <div className="border border-nasmed-gray-light rounded-lg p-4 bg-nasmed-off-white/40">
                  <p className="text-[13.5px] text-nasmed-navy leading-relaxed">{viewApp.statement}</p>
                </div>
              </div>

              {/* Declaration */}
              <div>
                <p className="text-[11px] font-bold tracking-[2px] uppercase text-nasmed-mid-blue mb-4 pb-2 border-b border-nasmed-gray-light">
                  Declaration & Payment
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {field("Declaration Signed", "Yes — I agree to uphold NASMED's code of conduct")}
                  {field("Payment Status", viewApp.payment === "Paid" ? "✓ Payment confirmed" : "⏳ Awaiting payment")}
                </div>
              </div>

            </div>

            {/* ── Footer actions ── */}
            <div className="flex items-center gap-3 px-7 py-4 border-t border-nasmed-gray-light bg-white flex-shrink-0">
              <button
                onClick={() => setViewApp(null)}
                className="py-3 px-6 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[14px] font-semibold cursor-pointer hover:bg-nasmed-off-white transition-all bg-white"
              >
                Close
              </button>
              {viewApp.status === "pending" && (
                <>
                  <button
                    onClick={() => { handleAction(viewApp.id, "approve"); setViewApp(null); }}
                    className="flex-1 py-3 rounded-lg bg-nasmed-green text-white border-none text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light transition-all"
                  >
                    ✓ Approve & Notify
                  </button>
                  <button
                    onClick={() => { handleAction(viewApp.id, "reject"); setViewApp(null); }}
                    className="flex-1 py-3 rounded-lg bg-red-500 text-white border-none text-[14px] font-bold cursor-pointer hover:bg-red-600 transition-all"
                  >
                    ✗ Reject & Notify
                  </button>
                </>
              )}
              {viewApp.status !== "pending" && (
                <span className={`text-[13px] font-semibold ml-2 ${viewApp.status === "approved" ? "text-nasmed-green" : "text-red-500"}`}>
                  This application has been {viewApp.status}.
                </span>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
