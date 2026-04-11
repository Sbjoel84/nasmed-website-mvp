import { useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/nasmed-logo.png";

const DEMO_APPS = [
  { id: "APP-001", name: "Dr. Adamu Yusuf", email: "adamu@email.com", prof: "Sports Physician", tier: "Professional Member", state: "Abuja (FCT)", date: "15/03/2024", status: "pending" },
  { id: "APP-002", name: "Dr. Folake Ojo", email: "folake@email.com", prof: "Physiotherapist", tier: "Associate Member", state: "Lagos", date: "12/03/2024", status: "pending" },
  { id: "APP-003", name: "Dr. Emeka Chukwu", email: "emeka@email.com", prof: "Exercise Physiologist", tier: "Fellow (FNASMED)", state: "Enugu", date: "10/03/2024", status: "approved" },
  { id: "APP-004", name: "Dr. Hassan Ibrahim", email: "hassan@email.com", prof: "Sports Surgeon", tier: "Professional Member", state: "Kano", date: "08/03/2024", status: "approved" },
  { id: "APP-005", name: "Dr. Ngozi Obi", email: "ngozi@email.com", prof: "Nutritionist", tier: "Associate Member", state: "Rivers", date: "05/03/2024", status: "rejected" },
  { id: "APP-006", name: "Dr. Aisha Mohammed", email: "aisha@email.com", prof: "Sports Psychologist", tier: "Professional Member", state: "Kaduna", date: "01/03/2024", status: "pending" },
  { id: "APP-007", name: "Dr. Biodun Akintola", email: "biodun@email.com", prof: "Physiotherapist", tier: "Associate Member", state: "Oyo", date: "28/02/2024", status: "pending" },
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

  // Add member form
  const [afFname, setAfFname] = useState("");
  const [afLname, setAfLname] = useState("");
  const [afEmail, setAfEmail] = useState("");
  const [afPhone, setAfPhone] = useState("");
  const [afProf, setAfProf] = useState("");
  const [afTier, setAfTier] = useState("Professional Member");
  const [afState, setAfState] = useState("");

  const handleLogin = () => {
    if (user === "admin" && pass === "nasmed2024") {
      setLoggedIn(true);
      setLoginErr(false);
    } else {
      setLoginErr(true);
    }
  };

  const handleAction = (id: string, action: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: action === "approve" ? "approved" : "rejected" } : a));
    toast.success(action === "approve" ? "Application approved!" : "Application rejected.");
  };

  const addMember = () => {
    if (!afFname || !afLname) { toast.error("Please fill in required fields."); return; }
    const m = {
      id: "NAS-" + (totalMembers + 1).toString().padStart(4, "0"),
      name: "Dr. " + afFname + " " + afLname,
      username: (afFname + "." + afLname).toLowerCase(),
      password: "nasmed2024",
      prof: afProf || "Professional",
      tier: afTier,
      state: afState,
      joined: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      status: "active",
      position: "",
      mustChange: true,
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
    return <span className={`py-1 px-2.5 rounded-full text-[11px] font-bold tracking-wide ${map[s] || ""}`}>{s}</span>;
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
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
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
                  className={`w-full flex items-center gap-2.5 py-2.5 px-6 text-[13.5px] font-medium cursor-pointer transition-all border-none bg-transparent text-left
                    ${activeSection === item.key ? "bg-white/10 text-white border-l-[3px] border-nasmed-green-light" : "text-white/65 hover:bg-white/5 hover:text-white"}`}
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
                    <thead><tr>{["Name", "Type", "Date", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3.5 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {filterRows(applications.slice(0, 5), ["name", "tier"]).map(a => (
                        <tr key={a.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3.5 text-[13px] font-semibold">{a.name}</td>
                          <td className="py-3 px-3.5 text-[13px]">{a.tier}</td>
                          <td className="py-3 px-3.5 text-[13px]">{a.date}</td>
                          <td className="py-3 px-3.5">{statusBadge(a.status)}</td>
                          <td className="py-3 px-3.5">
                            {a.status === "pending" && (
                              <div className="flex gap-1.5">
                                <button onClick={() => handleAction(a.id, "approve")} className="bg-nasmed-green text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:bg-nasmed-green-light">✓ Approve</button>
                                <button onClick={() => handleAction(a.id, "reject")} className="bg-red-500 text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600">✗ Reject</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

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
                            {a.status === "pending" && (
                              <div className="flex gap-1.5">
                                <button onClick={() => handleAction(a.id, "approve")} className="bg-nasmed-green text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:bg-nasmed-green-light">✓</button>
                                <button onClick={() => handleAction(a.id, "reject")} className="bg-red-500 text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600">✗</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

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
                            <button onClick={() => toast.info(`Member profile: ${m.name}`)} className="bg-nasmed-mid-blue text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:bg-accent">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

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
                <button onClick={addMember} className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all mt-6">
                  Register Member →
                </button>
              </div>
            </>
          )}

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
    </div>
  );
}
