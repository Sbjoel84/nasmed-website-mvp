import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/nasmed-logo.png";
import authService from "@/lib/authService";
import supabase from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY after processing the token in the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Also check if a session already exists (token was processed before component mounted)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }

    setIsSubmitting(true);
    const { error } = await authService.updatePassword(newPassword);
    setIsSubmitting(false);

    if (error) {
      setError(error);
    } else {
      toast.success("Password updated! Please sign in with your new password.");
      navigate("/member-login");
    }
  };

  return (
    <div className="min-h-screen bg-nasmed-off-white flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl p-10 w-full max-w-[420px] shadow-xl">
        <div className="text-center mb-8">
          <img src={logo} alt="NASMED" className="w-20 h-20 rounded-full object-cover border-[3px] border-nasmed-green-light mx-auto mb-4" />
          <h2 className="font-heading text-nasmed-navy text-[26px] mb-1.5">Set New Password</h2>
          <p className="text-nasmed-text-muted text-sm">Choose a strong password for your NASMED account</p>
        </div>

        {!ready ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 border-[3px] border-nasmed-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-nasmed-text-muted text-sm">Verifying reset link…</p>
            <p className="text-[12px] text-nasmed-text-muted mt-2">
              If this takes too long, your link may have expired.{" "}
              <button
                onClick={() => navigate("/member-login")}
                className="text-nasmed-mid-blue hover:underline bg-transparent border-none cursor-pointer text-[12px]"
              >
                Request a new one.
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 text-red-600 py-2.5 px-3.5 rounded-lg text-[13px]">{error}</div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-nasmed-navy">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-nasmed-navy">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat your new password"
                className={`py-2.5 px-3.5 border-[1.5px] rounded-lg text-sm outline-none transition-colors ${
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-red-400 focus:border-red-500"
                    : "border-nasmed-gray-light focus:border-nasmed-mid-blue"
                }`}
                required
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[11px] text-red-500">Passwords do not match</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-nasmed-green text-white border-none py-3 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {isSubmitting ? "Updating…" : "Update Password →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
