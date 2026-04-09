import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import logo from "@/assets/nasmed-logo.png";
import PageHeader from "@/components/PageHeader";

const DEMO_MEMBERS = [
  { id: "NAS-0001", name: "Prof. Adamu Ibrahim", username: "adamu.ibrahim", password: "nasmed2024", prof: "Orthopaedic Surgeon", tier: "Fellow (FNASMED)", joined: "Jan 1988", status: "active", position: "President", mustChange: true },
  { id: "NAS-0002", name: "Dr. Folake Adeyemi", username: "folake.adeyemi", password: "nasmed2024", prof: "Exercise Physiologist", tier: "Fellow (FNASMED)", joined: "Mar 1990", status: "active", position: "Vice President", mustChange: true },
  { id: "NAS-0003", name: "Dr. Chukwuma Obi", username: "chukwuma.obi", password: "nasmed2024", prof: "Sports Medicine", tier: "Professional Member", joined: "Jul 2005", status: "active", position: "General Secretary", mustChange: false },
];

export default function MemberLoginPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [member, setMember] = useState<typeof DEMO_MEMBERS[0] | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState(false);
  const [members, setMembers] = useState(DEMO_MEMBERS);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [passErr, setPassErr] = useState("");

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

      {!loggedIn ? (
        <div className="flex items-center justify-center py-20 px-6">
          <div className="bg-white rounded-2xl p-12 w-full max-w-[460px] shadow-xl">
            <div className="text-center mb-8">
              <img src={logo} alt="NASMED" className="w-20 h-20 rounded-full object-cover border-[3px] border-nasmed-green-light mx-auto mb-4" />
              <h2 className="font-heading text-nasmed-navy text-[26px] mb-1.5">Member Login</h2>
              <p className="text-nasmed-text-muted text-sm">Enter your NASMED credentials to access your portal</p>
            </div>
            {loginErr && <div className="bg-red-500/10 text-red-600 py-2.5 px-3.5 rounded-lg text-[13px] mb-4">Invalid username or password.</div>}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
              </div>
              <button onClick={handleLogin} className="bg-nasmed-green text-white border-none py-3 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all w-full">Sign In →</button>
            </div>
            <p className="text-center text-xs text-nasmed-gray mt-4">
              Demo: adamu.ibrahim / nasmed2024
            </p>
          </div>
        </div>
      ) : member && (
        <div className="max-w-[900px] mx-auto py-12 px-6">
          {/* Welcome bar */}
          <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue rounded-2xl p-8 flex flex-wrap items-center justify-between gap-5 mb-8">
            <div>
              <p className="text-white/60 text-[13px] mb-1">Welcome back,</p>
              <h2 className="text-white font-heading text-[26px] mb-1">{member.name}</h2>
              <p className="text-nasmed-green-light text-[13px] font-semibold">{member.position}</p>
            </div>
            <button onClick={handleLogout} className="bg-white/15 text-white border border-white/25 py-2.5 px-5 rounded-lg text-[13px] font-semibold cursor-pointer">Sign Out</button>
          </div>

          {member.mustChange && (
            <div className="bg-amber-500/15 border-[1.5px] border-amber-500/40 rounded-[10px] p-4 mb-6 flex items-center gap-3">
              <span className="text-[22px]">⚠️</span>
              <div>
                <strong className="text-amber-700 text-sm">Password Change Required</strong>
                <p className="text-amber-800 text-[13px] mt-0.5">Please change your default password using the form below.</p>
              </div>
            </div>
          )}

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
            <div className="bg-white rounded-[14px] p-6 shadow-sm border border-nasmed-gray-light">
              <h3 className="text-[14px] font-bold text-nasmed-mid-blue tracking-wide uppercase mb-4 pb-2.5 border-b border-nasmed-gray-light">Member Profile</h3>
              {[
                ["Member ID", member.id],
                ["Username", member.username],
                ["Profession", member.prof],
                ["Tier", member.tier],
                ["Joined", member.joined],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 text-[13px] mb-2">
                  <span className="text-nasmed-gray min-w-[100px]">{label}:</span>
                  <strong className="text-nasmed-navy">{value}</strong>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-[14px] p-6 shadow-sm border border-nasmed-gray-light">
              <h3 className="text-[14px] font-bold text-nasmed-mid-blue tracking-wide uppercase mb-4 pb-2.5 border-b border-nasmed-gray-light">Quick Links</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { to: "/publications", icon: "📰", label: "Access NASMED Publications" },
                  { to: "/store", icon: "🛒", label: "Visit Member Store" },
                  { to: "/membership", icon: "👥", label: "Membership Benefits" },
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
            {passErr && <div className="text-red-600 text-[13px] mt-2">{passErr}</div>}
            <button onClick={handleChangePassword} className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all mt-4">
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
