import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import logo from "@/assets/nasmed-logo.png";
import PageHeader from "@/components/PageHeader";

const DEMO_MEMBERS = [
  // Executive / founding members
  { id: "NAS-0001", name: "Prof. Adamu Ibrahim",   username: "adamu.ibrahim",   password: "nasmed2024", prof: "Orthopaedic Surgeon",    tier: "Fellow (FNASMED)",      joined: "Jan 1988", status: "active", position: "President",        mustChange: true  },
  { id: "NAS-0002", name: "Dr. Folake Adeyemi",    username: "folake.adeyemi",  password: "nasmed2024", prof: "Exercise Physiologist",   tier: "Fellow (FNASMED)",      joined: "Mar 1990", status: "active", position: "Vice President",   mustChange: true  },
  { id: "NAS-0003", name: "Dr. Chukwuma Obi",      username: "chukwuma.obi",    password: "nasmed2024", prof: "Sports Medicine",         tier: "Professional Member",   joined: "Jul 2005", status: "active", position: "General Secretary",mustChange: false },
  // Approved applicants
  { id: "NAS-0004", name: "Dr. Ezekiel Adeyemi",   username: "ezekiel.adeyemi", password: "nasmed2024", prof: "Exercise Physiologist",   tier: "Fellow (FNASMED)",      joined: "Jun 2024", status: "active", position: "",                mustChange: true  },
  { id: "NAS-0005", name: "Dr. Fatima Garba",      username: "fatima.garba",    password: "nasmed2024", prof: "Sports Surgeon",          tier: "Professional Member",   joined: "Jun 2024", status: "active", position: "",                mustChange: true  },
  // Additional active members
  { id: "NAS-0006", name: "Dr. Bola Adeyemo",      username: "bola.adeyemo",    password: "nasmed2024", prof: "Sports Physician",        tier: "Professional Member",   joined: "Feb 2018", status: "active", position: "",                mustChange: true  },
  { id: "NAS-0007", name: "Dr. Uche Nwankwo",      username: "uche.nwankwo",    password: "nasmed2024", prof: "Physiotherapist",         tier: "Associate Member",      joined: "Aug 2019", status: "active", position: "",                mustChange: true  },
  { id: "NAS-0008", name: "Dr. Fatima Ali",        username: "fatima.ali",      password: "nasmed2024", prof: "Sports Medicine",         tier: "Fellow (FNASMED)",      joined: "Nov 2015", status: "active", position: "",                mustChange: false },
  { id: "NAS-0009", name: "Dr. Segun Olumide",     username: "segun.olumide",   password: "nasmed2024", prof: "Sports Physician",        tier: "Professional Member",   joined: "Apr 2020", status: "active", position: "",                mustChange: true  },
];

export default function MemberLoginPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [member, setMember] = useState<typeof DEMO_MEMBERS[0] | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState(false);
  const [members, setMembers] = useState(DEMO_MEMBERS);

  const [oldPass, setOldPass]   = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confPass, setConfPass] = useState("");
  const [passErr, setPassErr]   = useState("");

  const handleLogin = () => {
    const found = members.find(m => m.username === username && m.password === password);
    if (!found) { setLoginErr(true); return; }
    setLoginErr(false);
    setMember(found);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setMember(null);
    setUsername("");
    setPassword("");
    setOldPass(""); setNewPass(""); setConfPass(""); setPassErr("");
  };

  const handleChangePassword = () => {
    if (!member) return;
    if (oldPass !== member.password) { setPassErr("Current password is incorrect."); return; }
    if (newPass.length < 8) { setPassErr("New password must be at least 8 characters."); return; }
    if (newPass !== confPass) { setPassErr("New passwords do not match."); return; }
    setPassErr("");
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, password: newPass, mustChange: false } : m));
    setMember(prev => prev ? { ...prev, password: newPass, mustChange: false } : prev);
    setOldPass(""); setNewPass(""); setConfPass("");
    toast.success("Password updated successfully!");
  };

  return (
    <div>
      <PageHeader breadcrumb="HOME / MEMBER PORTAL" title="Member Portal" subtitle="Sign in to access your NASMED member dashboard" />

      {/* ── Login form ── */}
      {!loggedIn ? (
        <div className="flex items-start justify-center py-16 px-6 gap-8 flex-wrap max-w-[1100px] mx-auto">

          {/* Login card */}
          <div className="bg-white rounded-2xl p-10 w-full max-w-[440px] shadow-xl flex-shrink-0">
            <div className="text-center mb-8">
              <img src={logo} alt="NASMED" className="w-20 h-20 rounded-full object-cover border-[3px] border-nasmed-green-light mx-auto mb-4" />
              <h2 className="font-heading text-nasmed-navy text-[26px] mb-1.5">Member Login</h2>
              <p className="text-nasmed-text-muted text-sm">Enter your NASMED credentials to access your portal</p>
            </div>
            {loginErr && (
              <div className="bg-red-500/10 text-red-600 py-2.5 px-3.5 rounded-lg text-[13px] mb-4">
                Invalid username or password. Please try again.
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Username</label>
                <input
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. adamu.ibrahim"
                  className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
              </div>
              <button onClick={handleLogin} className="bg-nasmed-green text-white border-none py-3 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all w-full">
                Sign In →
              </button>
            </div>
            <p className="text-center text-xs text-nasmed-text-muted mt-5">
              Contact the NASMED secretariat if you have not yet received your login credentials.
            </p>
          </div>

          {/* Credentials reference table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex-1 min-w-[320px]">
            <div className="bg-nasmed-navy px-6 py-4">
              <h3 className="font-heading text-white text-[16px]">Member Login Credentials</h3>
              <p className="text-white/50 text-[12px] mt-0.5">All passwords default to <code className="bg-white/15 px-1.5 py-0.5 rounded text-nasmed-green-light">nasmed2024</code> — members must change on first login</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Name", "Username", "Tier", "Must Change"].map(h => (
                      <th key={h} className="text-left py-2.5 px-4 text-[11px] font-bold text-nasmed-text-muted tracking-wide uppercase border-b border-nasmed-gray-light bg-nasmed-off-white">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEMO_MEMBERS.map(m => (
                    <tr key={m.id} className="hover:bg-nasmed-off-white border-b border-nasmed-gray-light/50">
                      <td className="py-2.5 px-4 text-[13px] font-semibold text-nasmed-navy">{m.name}</td>
                      <td className="py-2.5 px-4">
                        <code className="bg-nasmed-off-white text-nasmed-mid-blue text-[12px] py-0.5 px-2 rounded font-mono">{m.username}</code>
                      </td>
                      <td className="py-2.5 px-4 text-[12px] text-nasmed-text-muted">{m.tier}</td>
                      <td className="py-2.5 px-4">
                        <span className={`text-[11px] font-bold ${m.mustChange ? "text-amber-600" : "text-nasmed-green"}`}>
                          {m.mustChange ? "⚠ Yes" : "✓ No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      ) : member && (

        /* ── Member dashboard ── */
        <div className="max-w-[900px] mx-auto py-12 px-6">

          {/* Welcome bar */}
          <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue rounded-2xl p-8 flex flex-wrap items-center justify-between gap-5 mb-8">
            <div>
              <p className="text-white/60 text-[13px] mb-1">Welcome back,</p>
              <h2 className="text-white font-heading text-[26px] mb-1">{member.name}</h2>
              <p className="text-nasmed-green-light text-[13px] font-semibold">{member.position || member.tier}</p>
            </div>
            <button onClick={handleLogout} className="bg-white/15 text-white border border-white/25 py-2.5 px-5 rounded-lg text-[13px] font-semibold cursor-pointer hover:bg-white/25 transition-all">
              Sign Out
            </button>
          </div>

          {/* Must-change warning */}
          {member.mustChange && (
            <div className="bg-amber-500/15 border-[1.5px] border-amber-500/40 rounded-[10px] p-4 mb-6 flex items-center gap-3">
              <span className="text-[22px]">⚠️</span>
              <div>
                <strong className="text-amber-700 text-sm">Password Change Required</strong>
                <p className="text-amber-800 text-[13px] mt-0.5">Your account is using the default password. Please change it using the form below before proceeding.</p>
              </div>
            </div>
          )}

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
            <div className="bg-white rounded-[14px] p-6 shadow-sm border border-nasmed-gray-light">
              <h3 className="text-[14px] font-bold text-nasmed-mid-blue tracking-wide uppercase mb-4 pb-2.5 border-b border-nasmed-gray-light">Member Profile</h3>
              {[
                ["Member ID",  member.id],
                ["Username",   member.username],
                ["Profession", member.prof],
                ["Tier",       member.tier],
                ["Joined",     member.joined],
                ["Status",     member.status],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 text-[13px] mb-2">
                  <span className="text-nasmed-gray min-w-[100px]">{label}:</span>
                  <strong className="text-nasmed-navy capitalize">{value}</strong>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-[14px] p-6 shadow-sm border border-nasmed-gray-light">
              <h3 className="text-[14px] font-bold text-nasmed-mid-blue tracking-wide uppercase mb-4 pb-2.5 border-b border-nasmed-gray-light">Quick Links</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { to: "/publications", icon: "📰", label: "Access NASMED Publications" },
                  { to: "/store",        icon: "🛒", label: "Visit Member Store" },
                  { to: "/membership",   icon: "👥", label: "Membership Benefits" },
                  { to: "/news",         icon: "📅", label: "Upcoming Events" },
                ].map(l => (
                  <Link key={l.to} to={l.to} className="flex items-center gap-2.5 py-2.5 px-3.5 bg-nasmed-off-white rounded-lg no-underline text-nasmed-navy text-[13px] font-medium hover:bg-nasmed-gray-light transition-colors">
                    {l.icon} <span>{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-[14px] p-8 shadow-sm border border-nasmed-gray-light">
            <h3 className="font-heading text-xl text-nasmed-navy mb-1.5">Change Password</h3>
            <p className="text-nasmed-text-muted text-[13px] mb-6">Choose a strong password with at least 8 characters.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Current Password</label>
                <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="Current password" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">New Password</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min 8 characters" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Confirm Password</label>
                <input type="password" value={confPass} onChange={e => setConfPass(e.target.value)} placeholder="Repeat new password" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
              </div>
            </div>
            {passErr && <div className="bg-red-500/10 text-red-600 text-[13px] py-2 px-3 rounded-lg mt-3">{passErr}</div>}
            <button onClick={handleChangePassword} className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all mt-5">
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
