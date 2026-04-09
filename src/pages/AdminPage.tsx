import { useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/nasmed-logo.png";

const DEMO_APPS = [
  { id: "APP-001", name: "Dr. Adamu Yusuf", email: "adamu@email.com", prof: "Sports Physician", tier: "Professional Member", state: "Abuja (FCT)", date: "15/03/2024", status: "pending" },
  { id: "APP-002", name: "Dr. Folake Ojo", email: "folake@email.com", prof: "Physiotherapist", tier: "Associate Member", state: "Lagos", date: "12/03/2024", status: "pending" },
  { id: "APP-003", name: "Dr. Emeka Chukwu", email: "emeka@email.com", prof: "Exercise Physiologist", tier: "Fellow (FNASMED)", state: "Enugu", date: "10/03/2024", status: "approved" },
  { id: "APP-004", name: "Dr. Hassan Ibrahim", email: "hassan@email.com", prof: "Sports Surgeon", tier: "Professional Member", state: "Kano", date: "08/03/2024", status: "approved" },
  { id: "APP-005", name: "Dr. Ngozi Obi", email: "ngozi@email.com", prof: "Nutritionist", tier: "Associate Member", state: "Rivers", date: "05/03/2024", status: "rejected" },
];

const DEMO_MEMBERS = [
  { id: "NAS-0001", name: "Prof. Adamu Ibrahim", prof: "Orthopaedic Surgeon", tier: "Fellow (FNASMED)", state: "Abuja (FCT)", joined: "Jan 1988", status: "active" },
  { id: "NAS-0002", name: "Dr. Folake Adeyemi", prof: "Exercise Physiologist", tier: "Fellow (FNASMED)", state: "Lagos", joined: "Mar 1990", status: "active" },
  { id: "NAS-0003", name: "Dr. Chukwuma Obi", prof: "Sports Medicine", tier: "Professional Member", state: "Enugu", joined: "Jul 2005", status: "active" },
];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("nasmed2024");
  const [loginErr, setLoginErr] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [applications, setApplications] = useState(DEMO_APPS);

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
            <p className="text-nasmed-text-muted text-sm">Sign in to manage NASMED membership applications.</p>
          </div>
          {loginErr && <div className="bg-red-500/10 text-red-600 py-2.5 px-3.5 rounded-lg text-[13px] mb-4">Invalid credentials. Please try again.</div>}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-nasmed-navy">Username</label>
              <input type="text" value={user} onChange={e => setUser(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-nasmed-navy">Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
            </div>
            <button onClick={handleLogin} className="bg-nasmed-green text-white border-none py-3 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all w-full">Sign In →</button>
          </div>
          <p className="text-center text-xs text-nasmed-gray mt-4">Demo: admin / nasmed2024</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "applications", icon: "📋", label: "Applications" },
    { key: "members", icon: "👥", label: "Members" },
  ];

  const pendingCount = applications.filter(a => a.status === "pending").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;

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
                  onClick={() => setActiveSection(item.key)}
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
                  { num: "1,412", label: "Total Members", trend: "↑ +23 this month", color: "border-nasmed-mid-blue" },
                  { num: String(pendingCount), label: "Pending Applications", trend: "Needs Review", color: "border-nasmed-green", trendColor: "text-amber-500" },
                  { num: String(approvedCount), label: "Approved This Month", trend: "↑ New Members", color: "border-amber-500" },
                  { num: "34", label: "Renewals Due", trend: "Expiring Soon", color: "border-red-500", trendColor: "text-red-500" },
                ].map((c, i) => (
                  <div key={i} className={`bg-white rounded-xl p-6 shadow-sm border-t-4 ${c.color}`}>
                    <div className="font-heading text-[32px] font-bold text-nasmed-navy leading-none">{c.num}</div>
                    <div className="text-[13px] text-nasmed-text-muted mt-1">{c.label}</div>
                    <div className={`text-xs font-semibold mt-2 ${c.trendColor || "text-nasmed-green"}`}>{c.trend}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">Recent Applications</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {["Name", "Type", "Date", "Status", "Actions"].map(h => (
                          <th key={h} className="text-left py-2.5 px-3.5 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 5).map(a => (
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {["Name", "Email", "Profession", "Tier", "State", "Date", "Status", "Actions"].map(h => (
                          <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(a => (
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
              <p className="text-nasmed-text-muted text-sm mb-7">View all currently registered NASMED members.</p>
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {["ID", "Name", "Profession", "Tier", "State", "Joined", "Status"].map(h => (
                          <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_MEMBERS.map(m => (
                        <tr key={m.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{m.id}</td>
                          <td className="py-3 px-3 text-[13px] font-semibold">{m.name}</td>
                          <td className="py-3 px-3 text-[13px]">{m.prof}</td>
                          <td className="py-3 px-3 text-[13px]">{m.tier}</td>
                          <td className="py-3 px-3 text-[13px]">{m.state}</td>
                          <td className="py-3 px-3 text-[13px]">{m.joined}</td>
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
