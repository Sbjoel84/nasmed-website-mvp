import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/lib/authService";
import { publicationService, Publication } from "@/services/publicationService";
import { toast } from "sonner";

type Section = "overview" | "profile" | "picture" | "password" | "publications";

const NAV = [
  { key: "overview" as Section,     icon: "📊", label: "Overview" },
  { key: "profile" as Section,      icon: "👤", label: "Edit Profile" },
  { key: "picture" as Section,      icon: "📷", label: "Profile Picture" },
  { key: "password" as Section,     icon: "🔒", label: "Change Password" },
  { key: "publications" as Section, icon: "📚", label: "Publications" },
];

const nigerianStates = [
  "Abuja (FCT)", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara",
];

function getLocalProfile(userId: string) {
  try { return JSON.parse(localStorage.getItem(`nasmed_profile_${userId}`) || "{}"); } catch { return {}; }
}
function saveLocalProfile(userId: string, data: Record<string, string>) {
  try {
    const existing = getLocalProfile(userId);
    localStorage.setItem(`nasmed_profile_${userId}`, JSON.stringify({ ...existing, ...data }));
  } catch { /* ignore */ }
}
function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function MemberDashboardPage() {
  const { user, signOut, updatePassword, setUserField } = useAuth();
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const local = user ? getLocalProfile(user.id) : {};

  // Profile form
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || "",
    phone: local.phone || "",
    state: local.state || "",
    specialty: local.specialty || "",
    bio: local.bio || "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(local.avatar_url || null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Password
  const [pwForm, setPwForm] = useState({ newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  // Publications
  const [publications, setPublications] = useState<Publication[]>([]);
  const [pubLoading, setPubLoading] = useState(true);
  const [pubFilter, setPubFilter] = useState("all");
  const [savedPubs, setSavedPubs] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(`nasmed_saved_pubs_${user?.id}`) || "[]")); }
    catch { return new Set(); }
  });

  useEffect(() => {
    publicationService.getPublished()
      .then(setPublications)
      .catch(() => {})
      .finally(() => setPubLoading(false));
  }, []);

  // Sync profile form when user loads
  useEffect(() => {
    if (user) {
      const loc = getLocalProfile(user.id);
      setProfileForm({
        full_name: user.full_name || "",
        phone: loc.phone || "",
        state: loc.state || "",
        specialty: loc.specialty || "",
        bio: loc.bio || "",
      });
      setAvatarUrl(loc.avatar_url || null);
    }
  }, [user?.id]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileSaving(true);
    try {
      // Update name in Supabase (best-effort)
      await authService.updateProfile(user.id, { full_name: profileForm.full_name });
      // Store extended fields locally
      saveLocalProfile(user.id, {
        phone: profileForm.phone,
        state: profileForm.state,
        specialty: profileForm.specialty,
        bio: profileForm.bio,
      });
      // Reflect name update in context
      setUserField({ full_name: profileForm.full_name });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("File too large. Max 5MB."); return; }
    setAvatarUploading(true);
    try {
      const { url, error } = await authService.uploadAvatar(user.id, file);
      if (error || !url) {
        // Fallback: use object URL stored in localStorage as base64
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          setAvatarUrl(dataUrl);
          saveLocalProfile(user.id, { avatar_url: dataUrl });
          toast.success("Profile picture updated!");
          setAvatarUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }
      setAvatarUrl(url);
      saveLocalProfile(user.id, { avatar_url: url });
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Upload failed. Try again.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError("");
    if (!pwForm.newPw || pwForm.newPw.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Passwords do not match."); return; }
    setPwLoading(true);
    try {
      const { error } = await updatePassword(pwForm.newPw);
      if (error) { setPwError(error); return; }
      toast.success("Password changed successfully!");
      setPwForm({ newPw: "", confirm: "" });
    } finally {
      setPwLoading(false);
    }
  };

  const toggleSavePub = (pubId: string) => {
    setSavedPubs(prev => {
      const next = new Set(prev);
      if (next.has(pubId)) next.delete(pubId); else next.add(pubId);
      localStorage.setItem(`nasmed_saved_pubs_${user?.id}`, JSON.stringify([...next]));
      return next;
    });
  };

  const handleDownload = async (pub: Publication) => {
    if (pub.file_url) {
      window.open(pub.file_url, "_blank");
      await publicationService.incrementDownloads(pub.id);
    } else {
      toast.info("No file attached to this publication.");
    }
  };

  const filteredPubs = publications.filter(p =>
    pubFilter === "all" ? true :
    pubFilter === "saved" ? savedPubs.has(p.id) :
    p.type.toLowerCase() === pubFilter.toLowerCase()
  );

  const pubTypes = ["all", "saved", ...Array.from(new Set(publications.map(p => p.type)))];

  const tierColor: Record<string, string> = {
    "Fellow (FNASMED)": "bg-amber-100 text-amber-700",
    "Individual Member": "bg-nasmed-green/15 text-nasmed-green",
    "Associate Member": "bg-blue-100 text-blue-700",
    "Student Membership": "bg-purple-100 text-purple-700",
    "International Membership": "bg-nasmed-navy/10 text-nasmed-navy",
  };

  return (
    <div className="pt-[78px] min-h-screen bg-nasmed-off-white flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-[200] md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-[78px] left-0 bottom-0 z-[300] w-[260px] bg-nasmed-navy flex flex-col transition-transform duration-300
        md:static md:top-auto md:bottom-auto md:z-auto md:translate-x-0 md:min-h-[calc(100vh-78px)]
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Member info */}
        <div className="p-6 border-b border-white/10 flex flex-col items-center text-center gap-3">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-[3px] border-nasmed-green" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-nasmed-green flex items-center justify-center text-white text-2xl font-bold border-[3px] border-nasmed-green/40">
                {getInitials(user?.full_name || user?.email)}
              </div>
            )}
            <button
              onClick={() => { setSection("picture"); setSidebarOpen(false); }}
              className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs shadow border-none cursor-pointer hover:bg-nasmed-off-white"
              title="Change photo"
            >📷</button>
          </div>
          <div>
            <p className="text-white font-bold text-[15px] leading-snug">{user?.full_name || user?.email}</p>
            {user?.member_number && (
              <p className="text-white/50 text-[11px] mt-0.5 font-mono">{user.member_number}</p>
            )}
            {user?.membership_type && (
              <span className={`inline-block mt-1.5 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full ${tierColor[user.membership_type] || "bg-white/10 text-white/70"}`}>
                {user.membership_type}
              </span>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map(item => (
            <button
              key={item.key}
              onClick={() => { setSection(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-6 text-[13.5px] font-medium cursor-pointer transition-all border-none bg-transparent text-left ${
                section === item.key
                  ? "bg-white/10 text-white border-l-[3px] border-nasmed-green-light"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 py-2.5 px-3 text-white/60 text-[13px] font-medium cursor-pointer border-none bg-transparent text-left hover:text-red-400 transition-all rounded-lg hover:bg-white/5"
          >
            <span className="text-base">🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-9 min-w-0">

        {/* Mobile header with hamburger */}
        <div className="flex items-center gap-4 mb-6 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-nasmed-navy text-white p-2 rounded-lg border-none cursor-pointer text-lg"
          >☰</button>
          <h1 className="font-heading text-[20px] text-nasmed-navy">{NAV.find(n => n.key === section)?.label}</h1>
        </div>

        {/* ── Overview ── */}
        {section === "overview" && (
          <div>
            <h2 className="font-heading text-[26px] text-nasmed-navy mb-1">Welcome back{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}!</h2>
            <p className="text-nasmed-text-muted text-sm mb-7">Here's your NASMED membership dashboard.</p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-green">
                <div className="text-2xl mb-2">📚</div>
                <div className="font-heading text-2xl font-bold text-nasmed-navy">{publications.length}</div>
                <div className="text-sm text-nasmed-text-muted">Available Publications</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-mid-blue">
                <div className="text-2xl mb-2">🔖</div>
                <div className="font-heading text-2xl font-bold text-nasmed-navy">{savedPubs.size}</div>
                <div className="text-sm text-nasmed-text-muted">Saved Publications</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-amber-500">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-heading text-2xl font-bold text-nasmed-navy capitalize">{user?.position || "Member"}</div>
                <div className="text-sm text-nasmed-text-muted">Role / Position</div>
              </div>
            </div>

            {/* Member info card */}
            <div className="bg-white rounded-[14px] p-6 shadow-sm mb-6">
              <h3 className="font-heading text-[17px] text-nasmed-navy mb-5 pb-3 border-b border-nasmed-gray-light">Membership Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  ["Member Number", user?.member_number || "—"],
                  ["Membership Tier", user?.membership_type || "—"],
                  ["Username", user?.username || "—"],
                  ["Email", user?.email || "—"],
                  ["State", local.state || "—"],
                  ["Specialty", local.specialty || "—"],
                ].map(([label, val]) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold tracking-wide uppercase text-nasmed-text-muted">{label}</span>
                    <span className="text-nasmed-navy font-medium">{val}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSection("profile")}
                className="mt-5 bg-transparent text-nasmed-mid-blue border border-nasmed-mid-blue py-2 px-5 rounded-lg text-[13px] font-semibold cursor-pointer hover:bg-nasmed-mid-blue hover:text-white transition-all"
              >
                Edit Profile →
              </button>
            </div>

            {/* Recent publications */}
            <div className="bg-white rounded-[14px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-[17px] text-nasmed-navy">Recent Publications</h3>
                <button onClick={() => setSection("publications")} className="text-nasmed-green text-sm font-medium hover:underline bg-transparent border-none cursor-pointer">
                  View All →
                </button>
              </div>
              {pubLoading ? (
                <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-nasmed-green border-t-transparent rounded-full animate-spin" /></div>
              ) : publications.length === 0 ? (
                <p className="text-center py-8 text-nasmed-text-muted text-sm">No publications yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publications.slice(0, 4).map(pub => (
                    <div key={pub.id} className="border border-nasmed-gray-light rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <span className="bg-nasmed-mid-blue/10 text-nasmed-mid-blue text-[11px] px-2 py-0.5 rounded font-semibold">{pub.type}</span>
                        <button onClick={() => toggleSavePub(pub.id)} className="text-lg bg-transparent border-none cursor-pointer" title={savedPubs.has(pub.id) ? "Remove bookmark" : "Save"}>
                          {savedPubs.has(pub.id) ? "🔖" : "📄"}
                        </button>
                      </div>
                      <h4 className="font-bold text-nasmed-navy text-[14px] mb-1 leading-snug">{pub.title}</h4>
                      <p className="text-[12px] text-nasmed-text-muted mb-3 line-clamp-2">{pub.description}</p>
                      <button onClick={() => handleDownload(pub)} className="text-nasmed-green text-[13px] font-medium hover:underline bg-transparent border-none cursor-pointer">
                        {pub.file_url ? "Download →" : "Read More →"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Edit Profile ── */}
        {section === "profile" && (
          <div>
            <h2 className="font-heading text-[26px] text-nasmed-navy mb-1">Edit Profile</h2>
            <p className="text-nasmed-text-muted text-sm mb-7">Update your personal and professional details.</p>
            <div className="bg-white rounded-[14px] p-8 shadow-sm max-w-[640px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))}
                    className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                    placeholder="Dr. Full Name"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">State of Practice</label>
                  <select
                    value={profileForm.state}
                    onChange={e => setProfileForm(p => ({ ...p, state: e.target.value }))}
                    className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                  >
                    <option value="">— Select State —</option>
                    {nigerianStates.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Specialty / Profession</label>
                  <input
                    type="text"
                    value={profileForm.specialty}
                    onChange={e => setProfileForm(p => ({ ...p, specialty: e.target.value }))}
                    className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                    placeholder="e.g. Sports Physician, Physiotherapist…"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Professional Bio</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                    rows={4}
                    className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue resize-y"
                    placeholder="Brief professional biography…"
                  />
                </div>
              </div>

              {/* Read-only fields */}
              <div className="mt-6 pt-5 border-t border-nasmed-gray-light">
                <p className="text-[11px] font-bold tracking-wide uppercase text-nasmed-text-muted mb-3">Account Information (read-only)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  {[
                    ["Email", user?.email],
                    ["Username", user?.username],
                    ["Member No.", user?.member_number],
                    ["Membership Tier", user?.membership_type],
                  ].map(([lbl, val]) => (
                    <div key={lbl} className="bg-nasmed-off-white rounded-lg px-4 py-2.5">
                      <p className="text-[10px] font-bold text-nasmed-text-muted uppercase tracking-wide">{lbl}</p>
                      <p className="text-nasmed-navy font-medium mt-0.5">{val || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="mt-6 bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {profileSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* ── Profile Picture ── */}
        {section === "picture" && (
          <div>
            <h2 className="font-heading text-[26px] text-nasmed-navy mb-1">Profile Picture</h2>
            <p className="text-nasmed-text-muted text-sm mb-7">Upload a photo to personalise your profile.</p>
            <div className="bg-white rounded-[14px] p-8 shadow-sm max-w-[500px]">
              {/* Current avatar */}
              <div className="flex flex-col items-center gap-5 mb-8">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-nasmed-green shadow-md" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-nasmed-green flex items-center justify-center text-white text-4xl font-bold shadow-md">
                    {getInitials(user?.full_name || user?.email)}
                  </div>
                )}
                <p className="text-nasmed-text-muted text-sm text-center">
                  {avatarUrl ? "Current profile picture" : "No photo uploaded yet"}
                </p>
              </div>

              {/* Upload zone */}
              <label className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                avatarUploading ? "border-nasmed-mid-blue bg-nasmed-mid-blue/5" : "border-nasmed-gray-light hover:border-nasmed-green hover:bg-nasmed-green/5"
              }`}>
                <span className="text-4xl">{avatarUploading ? "⏳" : "📷"}</span>
                <div className="text-center">
                  <p className="text-[14px] font-semibold text-nasmed-navy">{avatarUploading ? "Uploading…" : "Click to upload a photo"}</p>
                  <p className="text-[12px] text-nasmed-text-muted mt-1">JPG, PNG, or WEBP — max 5MB</p>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={avatarUploading}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); }}
                />
              </label>

              {avatarUrl && (
                <button
                  onClick={() => {
                    setAvatarUrl(null);
                    if (user) saveLocalProfile(user.id, { avatar_url: "" });
                    toast.success("Profile picture removed.");
                  }}
                  className="mt-4 w-full bg-transparent text-red-500 border border-red-300 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer hover:bg-red-50 transition-all"
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Change Password ── */}
        {section === "password" && (
          <div>
            <h2 className="font-heading text-[26px] text-nasmed-navy mb-1">Change Password</h2>
            <p className="text-nasmed-text-muted text-sm mb-7">Set a new password for your account.</p>
            <div className="bg-white rounded-[14px] p-8 shadow-sm max-w-[460px]">
              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">New Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    value={pwForm.newPw}
                    onChange={e => { setPwForm(p => ({ ...p, newPw: e.target.value })); setPwError(""); }}
                    placeholder="Min 8 characters"
                    className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Confirm New Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    value={pwForm.confirm}
                    onChange={e => { setPwForm(p => ({ ...p, confirm: e.target.value })); setPwError(""); }}
                    placeholder="Repeat new password"
                    className={`py-2.5 px-3.5 border-[1.5px] rounded-lg text-sm outline-none transition-colors ${
                      pwForm.confirm && pwForm.newPw !== pwForm.confirm
                        ? "border-red-400 focus:border-red-500"
                        : "border-nasmed-gray-light focus:border-nasmed-mid-blue"
                    }`}
                  />
                  {pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
                    <p className="text-[11px] text-red-500">Passwords do not match</p>
                  )}
                </div>

                {pwError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-lg">{pwError}</div>
                )}

                <div className="bg-nasmed-off-white border border-nasmed-gray-light rounded-lg p-4 text-[12px] text-nasmed-text-muted leading-relaxed">
                  Password requirements: minimum 8 characters. Use a mix of letters and numbers for a stronger password.
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={pwLoading || !pwForm.newPw || !pwForm.confirm}
                  className="w-full bg-nasmed-green text-white border-none py-3 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pwLoading ? "Updating…" : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Publications ── */}
        {section === "publications" && (
          <div>
            <h2 className="font-heading text-[26px] text-nasmed-navy mb-1">Publications</h2>
            <p className="text-nasmed-text-muted text-sm mb-7">Browse, download, and save publications to your profile.</p>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {pubTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setPubFilter(t)}
                  className={`text-[12px] font-bold px-4 py-1.5 rounded-full border cursor-pointer transition-all capitalize ${
                    pubFilter === t
                      ? "bg-nasmed-navy text-white border-nasmed-navy"
                      : "bg-white text-nasmed-text-muted border-nasmed-gray-light hover:border-nasmed-navy hover:text-nasmed-navy"
                  }`}
                >
                  {t === "all" ? "All" : t === "saved" ? `🔖 Saved (${savedPubs.size})` : t}
                </button>
              ))}
            </div>

            {pubLoading ? (
              <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-nasmed-green border-t-transparent rounded-full animate-spin" /></div>
            ) : filteredPubs.length === 0 ? (
              <div className="bg-white rounded-[14px] p-12 shadow-sm text-center text-nasmed-text-muted">
                {pubFilter === "saved" ? "No saved publications yet. Click the bookmark icon to save." : "No publications found."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredPubs.map(pub => {
                  const isSaved = savedPubs.has(pub.id);
                  return (
                    <div key={pub.id} className={`bg-white rounded-[14px] p-5 shadow-sm border-[1.5px] transition-all hover:shadow-md ${isSaved ? "border-nasmed-green/40" : "border-nasmed-gray-light"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-nasmed-mid-blue/10 text-nasmed-mid-blue text-[11px] font-bold px-2 py-0.5 rounded">{pub.type}</span>
                        <button
                          onClick={() => toggleSavePub(pub.id)}
                          className="text-xl bg-transparent border-none cursor-pointer hover:scale-110 transition-transform"
                          title={isSaved ? "Remove from profile" : "Save to profile"}
                        >
                          {isSaved ? "🔖" : "📄"}
                        </button>
                      </div>
                      <h3 className="font-bold text-nasmed-navy text-[14px] leading-snug mb-2">{pub.title}</h3>
                      <p className="text-[12px] text-nasmed-text-muted mb-4 line-clamp-3">{pub.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-nasmed-gray-light">
                        <span className="text-[11px] text-nasmed-text-muted">{pub.downloads} downloads</span>
                        <button
                          onClick={() => handleDownload(pub)}
                          className={`text-[13px] font-semibold border-none cursor-pointer px-4 py-1.5 rounded-lg transition-all ${
                            pub.file_url
                              ? "bg-nasmed-green text-white hover:bg-nasmed-green-light"
                              : "bg-nasmed-off-white text-nasmed-text-muted cursor-default"
                          }`}
                        >
                          {pub.file_url ? "Download ↓" : "No file"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
