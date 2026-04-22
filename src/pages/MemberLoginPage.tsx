import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/nasmed-logo.png";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { publicationService, Publication } from "@/services/publicationService";

export default function MemberLoginPage() {
  const { user, signIn, loading: authLoading, isAdmin, updatePassword } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotErr, setForgotErr] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [passErr, setPassErr] = useState("");
  
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loadingPubs, setLoadingPubs] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      loadPublications();
    }
  }, [user, authLoading]);

  const loadPublications = async () => {
    try {
      setLoadingPubs(true);
      const data = await publicationService.getPublished();
      setPublications(data.slice(0, 4));
    } catch (error) {
      console.error("Error loading publications:", error);
    } finally {
      setLoadingPubs(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr("");
    setIsSubmitting(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setLoginErr(error);
      setIsSubmitting(false);
    } else {
      toast.success("Login successful!");
      navigate("/member-dashboard");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotErr("");
    if (!forgotEmail) { setForgotErr("Please enter your email address."); return; }
    setForgotSubmitting(true);
    const { error } = await authService.resetPasswordForEmail(forgotEmail);
    setForgotSubmitting(false);
    if (error) {
      setForgotErr(error);
    } else {
      setForgotSent(true);
    }
  };

  const handleChangePassword = async () => {
    if (oldPass.length < 8) { setPassErr("Current password is required."); return; }
    if (newPass.length < 8) { setPassErr("New password must be at least 8 characters."); return; }
    if (newPass !== confPass) { setPassErr("New passwords do not match."); return; }
    setPassErr("");
    const { error } = await updatePassword(newPass);
    if (error) {
      setPassErr(error);
    } else {
      toast.success("Password updated successfully!");
      setOldPass(""); setNewPass(""); setConfPass("");
    }
  };

  if (authLoading) {
    return <LoadingScreen message="Checking your session..." size="medium" />;
  }

  if (user) {
    return (
      <div>
        <PageHeader breadcrumb="HOME / MEMBER PORTAL" title="Member Portal" subtitle="Your NASMED member dashboard" />

        <div className="max-w-[1000px] mx-auto py-12 px-6">
          {/* Welcome bar */}
          <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue rounded-2xl p-8 flex flex-wrap items-center justify-between gap-5 mb-8">
            <div>
              <p className="text-white/60 text-[13px] mb-1">Welcome back,</p>
              <h2 className="text-white font-heading text-[26px] mb-1">{user.full_name || user.email}</h2>
              <p className="text-nasmed-green-light text-[13px] font-semibold">{user.membership_type || "Member"}</p>
            </div>
            {isAdmin && (
              <Link to="/admin" className="bg-nasmed-green text-white py-2.5 px-5 rounded-lg text-[13px] font-semibold hover:bg-nasmed-green-light">
                Go to Admin Panel →
              </Link>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-green">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-heading text-2xl font-bold text-nasmed-navy">{publications.length}</div>
              <div className="text-sm text-nasmed-text-muted">Publications Available</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-mid-blue">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-heading text-2xl font-bold text-nasmed-navy">Active</div>
              <div className="text-sm text-nasmed-text-muted">Membership Status</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-amber-500">
              <div className="text-2xl mb-2">🎓</div>
              <div className="font-heading text-2xl font-bold text-nasmed-navy">CPD</div>
              <div className="text-sm text-nasmed-text-muted">Credits Available</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="bg-white rounded-[14px] p-6 shadow-sm">
              <h3 className="font-heading text-lg text-nasmed-navy mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { to: "/publications", icon: "📰", label: "Access NASMED Publications" },
                  { to: "/store", icon: "🛒", label: "Visit Member Store" },
                  { to: "/membership", icon: "👥", label: "Membership Benefits" },
                  { to: "/news", icon: "📅", label: "Upcoming Events" },
                ].map(l => (
                  <Link key={l.to} to={l.to} className="flex items-center gap-2.5 py-2.5 px-3.5 bg-nasmed-off-white rounded-lg no-underline text-nasmed-navy text-[13px] font-medium hover:bg-nasmed-gray-light">
                    {l.icon} <span>{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[14px] p-6 shadow-sm">
              <h3 className="font-heading text-lg text-nasmed-navy mb-4">Recent Publications</h3>
              {loadingPubs ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-3 border-nasmed-green border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : publications.length > 0 ? (
                <div className="space-y-3">
                  {publications.map(pub => (
                    <div key={pub.id} className="flex items-center justify-between py-2 border-b border-nasmed-gray-light/50">
                      <div>
                        <div className="text-sm font-medium text-nasmed-navy">{pub.title}</div>
                        <div className="text-xs text-nasmed-text-muted">{pub.type}</div>
                      </div>
                      <span className="text-xs text-nasmed-text-muted">{pub.downloads} ↓</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-nasmed-text-muted text-sm">No publications available.</p>
              )}
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-[14px] p-8 shadow-sm border border-nasmed-gray-light">
            <h3 className="font-heading text-xl text-nasmed-navy mb-1.5">Change Password</h3>
            <p className="text-nasmed-text-muted text-[13px] mb-6">Choose a strong password with at least 8 characters.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Current Password</label>
                <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="Current password" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">New Password</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min 8 characters" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Confirm Password</label>
                <input type="password" value={confPass} onChange={e => setConfPass(e.target.value)} placeholder="Repeat new password" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm" />
              </div>
            </div>
            {passErr && <div className="bg-red-500/10 text-red-600 text-[13px] py-2 px-3 rounded-lg mt-3">{passErr}</div>}
            <button onClick={handleChangePassword} className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light mt-5">
              Update Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader breadcrumb="HOME / MEMBER PORTAL" title="Member Portal" subtitle="Sign in to access your NASMED member dashboard" />

      <div className="flex items-start justify-center py-16 px-6 gap-8 flex-wrap max-w-[900px] mx-auto">
        {/* Login card */}
        <div className="bg-white rounded-2xl p-10 w-full max-w-[440px] shadow-xl flex-shrink-0">
          <div className="text-center mb-8">
            <img src={logo} alt="NASMED" className="w-20 h-20 rounded-full object-cover border-[3px] border-nasmed-green-light mx-auto mb-4" />
            <h2 className="font-heading text-nasmed-navy text-[26px] mb-1.5">
              {forgotMode ? "Reset Password" : "Member Login"}
            </h2>
            <p className="text-nasmed-text-muted text-sm">
              {forgotMode ? "Enter your registered email to receive a reset link" : "Enter your NASMED credentials to access your portal"}
            </p>
          </div>

          {/* ── FORGOT PASSWORD MODE ── */}
          {forgotMode ? (
            forgotSent ? (
              <div className="text-center">
                <div className="text-5xl mb-4">📧</div>
                <h3 className="font-heading text-nasmed-navy text-lg mb-2">Check your inbox</h3>
                <p className="text-nasmed-text-muted text-[13px] leading-relaxed mb-6">
                  We've sent a password reset link to <strong>{forgotEmail}</strong>. Click the link in the email to set a new password.
                </p>
                <p className="text-[12px] text-nasmed-text-muted mb-5">Didn't receive it? Check your spam folder or try again.</p>
                <button
                  onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(""); setForgotErr(""); }}
                  className="text-nasmed-mid-blue text-sm font-semibold hover:underline bg-transparent border-none cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                {forgotErr && (
                  <div className="bg-red-500/10 text-red-600 py-2.5 px-3.5 rounded-lg text-[13px]">{forgotErr}</div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Registered Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotSubmitting}
                  className="bg-nasmed-green text-white border-none py-3 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotSubmitting ? "Sending..." : "Send Reset Link →"}
                </button>
                <button
                  type="button"
                  onClick={() => { setForgotMode(false); setForgotErr(""); }}
                  className="text-nasmed-text-muted text-sm hover:text-nasmed-navy bg-transparent border-none cursor-pointer text-center"
                >
                  ← Back to Sign In
                </button>
              </form>
            )
          ) : (
            /* ── LOGIN MODE ── */
            <>
              {loginErr && (
                <div className="bg-red-500/10 text-red-600 py-2.5 px-3.5 rounded-lg text-[13px] mb-4">
                  {loginErr}
                </div>
              )}
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Email</label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Password</label>
                    <button
                      type="button"
                      onClick={() => { setForgotMode(true); setForgotEmail(email); setLoginErr(""); }}
                      className="text-[12px] text-nasmed-mid-blue hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-nasmed-green text-white border-none py-3 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Signing in..." : "Sign In →"}
                </button>
              </form>
              <p className="text-center text-xs text-nasmed-text-muted mt-5">
                Contact the NASMED secretariat if you have not yet received your login credentials.
              </p>
            </>
          )}
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex-1 min-w-[320px]">
          <h3 className="font-heading text-nasmed-navy text-lg mb-4">Member Benefits</h3>
          <div className="space-y-4">
            {[
              { icon: "📚", title: "Publications", desc: "Access exclusive research journals and guidelines" },
              { icon: "🎓", title: "CPD Credits", desc: "Earn continuing professional development credits" },
              { icon: "👥", title: "Networking", desc: "Connect with sports medicine professionals" },
              { icon: "🏆", title: "Events", desc: "Attend conferences, workshops and seminars" },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4 p-3 bg-nasmed-off-white rounded-lg">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-nasmed-navy text-sm">{item.title}</div>
                  <div className="text-xs text-nasmed-text-muted">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}