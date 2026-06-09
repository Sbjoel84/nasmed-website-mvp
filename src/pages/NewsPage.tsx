import { useState, useEffect } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import supabase from "@/lib/supabaseClient";
import newsService, { NewsPost, NewsEvent } from "@/services/newsService";
import eventRegistrationService from "@/services/eventRegistrationService";
import transactionService from "@/services/transactionService";
const CATEGORIES = ["All", "Conference", "Research", "Update"];

const inp = "py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue w-full";
const lbl = "text-[13px] font-semibold text-nasmed-navy";

const BANK = {
  bankName: "Union Bank",
  accountName: "Nigerian Association of Sports Medicine",
  accountNumber: "0227297914",
};

const categoryIcon: Record<string, string> = {
  conference: "🏛️",
  research: "🔬",
  update: "📋",
  governance: "📋",
  milestones: "🏆",
};

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [active, setActive] = useState("All");
  const [openModal, setOpenModal] = useState<string | null>(null);

  // Registration form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [membership, setMembership] = useState("member");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"bank" | null>(null);

  // Bank transfer receipt
  const [bankReceiptUrl, setBankReceiptUrl] = useState("");
  const [bankReceiptName, setBankReceiptName] = useState("");
  const [bankReceiptUploading, setBankReceiptUploading] = useState(false);
  const [bankReceiptError, setBankReceiptError] = useState("");
  const [bankRefInput, setBankRefInput] = useState("");

  useEffect(() => {
    newsService.getAllPosts()
      .then(data => setPosts(data))
      .catch(() => toast.error("Could not load news."))
      .finally(() => setLoadingPosts(false));

    newsService.getAllEvents()
      .then(data => setEvents(data))
      .catch(() => toast.error("Could not load events."))
      .finally(() => setLoadingEvents(false));

    const postSub = newsService.subscribeToPostChanges(() => {
      newsService.getAllPosts().then(data => setPosts(data)).catch(() => {});
    });
    const eventSub = newsService.subscribeToEventChanges(() => {
      newsService.getAllEvents().then(data => setEvents(data)).catch(() => {});
    });

    return () => {
      supabase.removeChannel(postSub);
      supabase.removeChannel(eventSub);
    };
  }, []);

  const filtered =
    active === "All"
      ? posts
      : posts.filter(n => n.category.toLowerCase() === active.toLowerCase());

  const latestPosts = posts.slice(0, 3);
  const featuredPost = posts[0];

  const closeModal = () => {
    setOpenModal(null);
    setName(""); setEmail(""); setOrg(""); setMembership("member");
    setPaymentMethod(null);
    setBankReceiptUrl(""); setBankReceiptName(""); setBankReceiptError(""); setBankRefInput("");
  };

  const formatFee = (naira: number) =>
    naira === 0 ? "FREE" : `₦${naira.toLocaleString("en-NG")}`;

  // ── Free registration ──
  const handleFreeRegistration = (ev: NewsEvent) => {
    if (!name.trim() || !email.trim()) { toast.error("Please fill in your name and email."); return; }
    eventRegistrationService.create({
      event_id: ev.id,
      event_title: ev.title,
      full_name: name,
      email,
      organisation: org || undefined,
      dues_status: "member",
      registration_fee: 0,
      payment_status: "free",
      status: "pending",
    }).catch(() => {});
    closeModal();
    toast.success(`Registration confirmed for ${name}! You will receive event details by email.`);
  };

  // ── Bank transfer receipt upload ──
  const handleReceiptUpload = async (file: File, ev: NewsEvent) => {
    if (!name.trim() || !email.trim()) { toast.error("Please fill in your name and email first."); return; }
    setBankReceiptUploading(true);
    setBankReceiptError("");
    try {
      const ext = file.name.split(".").pop();
      const ref = bankRefInput.trim() || `EVT-${Date.now()}`;
      const fileName = `receipts/event-${ref}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("receipts").upload(fileName, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from("receipts").getPublicUrl(fileName);
      setBankReceiptUrl(publicUrl);
      setBankReceiptName(file.name);
      const fee = ev.registration_fee ?? 0;
      // Save registration record — awaiting admin confirmation
      await eventRegistrationService.create({
        event_id: ev.id,
        event_title: ev.title,
        full_name: name,
        email,
        organisation: org || undefined,
        dues_status: "non-member",
        registration_fee: fee,
        payment_status: "pending",
        payment_ref: ref,
        payment_method: "Bank Transfer",
        status: "pending",
        notes: `Receipt: ${publicUrl}`,
      });
      // Mirror to transactions table so admin Transactions page is complete
      transactionService.create({
        payment_ref: ref,
        member_name: name,
        email,
        membership_type: ev.title,
        amount: `₦${fee.toLocaleString("en-NG")}`,
        currency: "NGN",
        payment_method: "Bank Transfer",
        status: "awaiting_confirmation",
        type: "event_registration",
        description: `Event registration — ${ev.title}`,
        receipt_url: publicUrl,
        receipt_name: `Receipt – ${name}`,
      }).catch(() => {});
      toast.success("Receipt uploaded! Admin will review and confirm your registration.");
    } catch {
      setBankReceiptError("Upload failed. Ensure a 'receipts' storage bucket exists in Supabase, or email your receipt to info@nasmed.org.");
    } finally {
      setBankReceiptUploading(false);
    }
  };

  const featuredEvent = events[0] ?? null;

  return (
    <div>
      <PageHeader breadcrumb="HOME / NEWS & EVENTS" title="News & Events" subtitle="Stay updated with the latest from NASMED — conferences, research, policy updates and professional development" />

      {/* ── Featured Upcoming Event — immediately below page header ── */}
      {(featuredEvent || loadingEvents) && (
        <section className="px-6 md:px-12 max-w-[1280px] mx-auto pt-8 pb-2">
          {loadingEvents ? (
            <div className="bg-nasmed-off-white rounded-2xl h-44 animate-pulse" />
          ) : featuredEvent && (
            <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue rounded-2xl overflow-hidden">
              <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
                <div>
                  <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-4">📅 Upcoming Event</span>
                  <h2 className="font-heading text-white text-[26px] mb-3">{featuredEvent.title}</h2>
                  <p className="text-white/65 text-[15px] leading-relaxed mb-5">{featuredEvent.description}</p>
                  <div className="flex gap-4 text-white/60 text-sm flex-wrap mb-6">
                    <span>📍 {featuredEvent.location}</span>
                    {featuredEvent.event_date && (
                      <span>📅 {new Date(featuredEvent.event_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenModal(featuredEvent.id)}
                    className="bg-nasmed-green text-white border-none py-3 px-6 rounded-lg text-sm font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all"
                  >
                    Register Now →
                  </button>
                </div>
                <div className="hidden md:flex flex-col gap-3 min-w-[140px]">
                  <div className="border-2 border-nasmed-mid-blue rounded-xl p-4 text-center bg-nasmed-mid-blue/10">
                    <div className="font-heading text-2xl font-bold text-white">FREE</div>
                    <div className="text-white/60 text-xs mt-1">Paid-up Members</div>
                  </div>
                  {featuredEvent.registration_fee > 0 && (
                    <div className="border border-white/20 rounded-xl p-4 text-center">
                      <div className="font-heading text-2xl font-bold text-white">{formatFee(featuredEvent.registration_fee)}</div>
                      <div className="text-white/60 text-xs mt-1">Non-dues-paying members</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Hero Featured News Banner ── */}
      <section className="px-6 md:px-12 max-w-[1280px] mx-auto pt-8 pb-4">
        {featuredPost ? (
          <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_420px]">
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-5 w-fit">
                  {featuredPost.category_label}
                </span>
                <h2 className="font-heading text-white text-[28px] md:text-[32px] leading-tight mb-4">{featuredPost.title}</h2>
                <p className="text-white/65 text-[15px] leading-relaxed mb-7">{featuredPost.description}</p>
                <div className="flex flex-wrap gap-5 text-white/70 text-[13px] mb-8">
                  <span>📅 {featuredPost.date_label}</span>
                  {featuredPost.read_time && <span>🕐 {featuredPost.read_time}</span>}
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center bg-white/5 p-10">
                <span className="text-8xl opacity-60">{categoryIcon[featuredPost.category] || "📰"}</span>
              </div>
            </div>
          </div>
        ) : loadingPosts ? (
          <div className="bg-nasmed-off-white rounded-2xl h-48 animate-pulse" />
        ) : null}
      </section>

      {/* ── Filters + News Grid ── */}
      <section className="py-16 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="flex gap-2.5 flex-wrap mb-9">
          {CATEGORIES.map(f => (
            <button type="button" key={f} onClick={() => setActive(f)} className={`py-1.5 px-4 rounded-full text-[13px] font-medium border-[1.5px] cursor-pointer transition-all ${f === active ? "border-nasmed-mid-blue text-nasmed-mid-blue bg-nasmed-mid-blue/5" : "border-nasmed-gray-light text-nasmed-text-muted bg-white hover:border-nasmed-mid-blue hover:text-nasmed-mid-blue"}`}>{f}</button>
          ))}
        </div>

        {loadingPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => <div key={i} className="rounded-xl border border-nasmed-gray-light bg-white h-64 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-nasmed-text-muted text-[15px]">
            No news posts found{active !== "All" ? ` for "${active}"` : ""}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filtered.map(n => (
              <div key={n.id} className="rounded-xl overflow-hidden border border-nasmed-gray-light bg-white transition-all hover:shadow-xl hover:-translate-y-1">
                {n.image_url ? (
                  <div className="w-full aspect-video overflow-hidden">
                    <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-nasmed-navy to-nasmed-blue flex items-center justify-center text-white/30 text-5xl">
                    {categoryIcon[n.category] || "📰"}
                  </div>
                )}
                <div className="p-4">
                  <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-nasmed-green mb-2">{n.category_label}</div>
                  <h3 className="font-heading text-base font-bold text-nasmed-navy leading-snug mb-2">{n.title}</h3>
                  <p className="text-[13px] text-nasmed-text-muted leading-relaxed">{n.description}</p>
                </div>
                <div className="px-4 py-3 border-t border-nasmed-gray-light flex justify-between text-xs text-nasmed-gray">
                  <span>{n.date_label}</span><span>{n.read_time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Events Calendar ── */}
      <section className="py-16 px-6 md:px-12 max-w-[1280px] mx-auto border-t border-nasmed-gray-light">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-[2px] bg-nasmed-green" />
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-nasmed-green">Upcoming Events</span>
        </div>
        <h2 className="font-heading text-[42px] font-bold text-nasmed-navy leading-tight mb-10">Events Calendar</h2>

        {loadingEvents ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-nasmed-off-white animate-pulse" />)}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-nasmed-text-muted text-[15px]">No upcoming events scheduled.</div>
        ) : (
          <div className="flex flex-col divide-y divide-nasmed-gray-light border border-nasmed-gray-light rounded-2xl overflow-hidden">
            {events.map(ev => (
              <div key={ev.id} className="flex items-center gap-6 px-6 py-5 bg-white hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-14 text-center">
                  <div className="font-heading text-[32px] font-bold text-nasmed-navy leading-none">{ev.day_label}</div>
                  <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-nasmed-green mt-0.5">{ev.month_label}</div>
                </div>
                <div className="w-px h-10 bg-nasmed-gray-light flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-heading text-[16px] font-bold text-nasmed-navy leading-snug">{ev.title}</div>
                  <div className="text-[13px] text-nasmed-green mt-1">
                    {ev.location}<span className="mx-1.5 text-nasmed-gray-light">|</span>{ev.description}
                  </div>
                  {ev.registration_fee > 0 && (
                    <div className="text-[12px] text-nasmed-text-muted mt-0.5">
                      FREE for paid-up members · {formatFee(ev.registration_fee)} for others
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setOpenModal(ev.id)}
                    className={`py-2.5 px-6 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${ev.cta_style === "filled" ? "bg-nasmed-green text-white hover:bg-nasmed-green-light" : "border-[1.5px] border-nasmed-navy text-nasmed-navy bg-white hover:bg-nasmed-navy hover:text-white"}`}
                  >
                    {ev.cta_text}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Latest from NASMED ── */}
      <section className="py-16 px-6 md:px-12 max-w-[1280px] mx-auto border-t border-nasmed-gray-light">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-[32px] font-bold text-nasmed-navy">Latest from NASMED</h2>
        </div>
        {loadingPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="rounded-xl border border-nasmed-gray-light bg-white h-64 animate-pulse" />)}
          </div>
        ) : latestPosts.length === 0 ? (
          <div className="text-center py-12 text-nasmed-text-muted text-[15px]">No news posts yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map(n => (
              <div key={n.id} className="rounded-xl overflow-hidden border border-nasmed-gray-light bg-white hover:shadow-lg hover:-translate-y-1 transition-all">
                {n.image_url ? (
                  <div className="w-full aspect-video overflow-hidden">
                    <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue flex items-center justify-center text-white/20 text-6xl">
                    {categoryIcon[n.category] || "📰"}
                  </div>
                )}
                <div className="p-5">
                  <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-nasmed-green mb-2">{n.category_label}</div>
                  <h3 className="font-heading text-[15px] font-bold text-nasmed-navy leading-snug mb-2">{n.title}</h3>
                  <p className="text-[13px] text-nasmed-text-muted leading-relaxed line-clamp-3">{n.description}</p>
                </div>
                <div className="px-5 py-3 border-t border-nasmed-gray-light flex items-center justify-between">
                  <span className="text-xs text-nasmed-gray">{n.date_label}</span>
                  <span className="text-[13px] font-semibold text-nasmed-mid-blue">{n.read_time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Event Registration Modal ── */}
      {openModal && (() => {
        const ev = events.find(e => e.id === openModal);
        if (!ev) return null;
        const fee = ev.registration_fee ?? 0;
        const isFree = membership === "member" || fee === 0;

        return (
          <div
            className="fixed inset-0 bg-black/70 z-[3000] flex items-start justify-center p-5 overflow-y-auto"
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <div className="bg-white rounded-2xl w-full max-w-[620px] my-8 overflow-hidden shadow-2xl">

              {/* Header */}
              <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue p-7 relative">
                <button type="button" onClick={closeModal} className="absolute top-4 right-5 bg-white/15 border-none text-white w-8 h-8 rounded-full text-lg cursor-pointer flex items-center justify-center hover:bg-white/25 transition-all">✕</button>
                <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-3">📅 Event Registration</span>
                <h2 className="font-heading text-white text-xl mt-1">{ev.title}</h2>
                <p className="text-white/65 text-[13px] mt-1.5">
                  {ev.event_date ? new Date(ev.event_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : ""}
                  {ev.location ? ` · ${ev.location}` : ""}
                </p>
              </div>

              <div className="p-7 flex flex-col gap-4">

                {/* Fee cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-nasmed-mid-blue rounded-xl p-3.5 text-center bg-nasmed-mid-blue/5">
                    <div className="font-heading text-xl font-bold text-nasmed-mid-blue">FREE</div>
                    <div className="text-nasmed-text-muted text-xs mt-1">Paid-up NASMED Members</div>
                  </div>
                  <div className="border border-nasmed-gray-light rounded-xl p-3.5 text-center">
                    <div className="font-heading text-xl font-bold text-nasmed-navy">{fee > 0 ? formatFee(fee) : "FREE"}</div>
                    <div className="text-nasmed-text-muted text-xs mt-1">Members yet to pay dues</div>
                  </div>
                </div>

                {/* Full event details */}
                {ev.body_content && (
                  <details className="border border-nasmed-gray-light rounded-xl overflow-hidden">
                    <summary className="px-4 py-3 text-[13px] font-semibold text-nasmed-navy cursor-pointer bg-nasmed-off-white hover:bg-gray-100 transition-colors select-none">
                      View Full Event Details ▸
                    </summary>
                    <div className="px-4 py-4 text-[13px] text-nasmed-text-muted leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                      {ev.body_content}
                    </div>
                  </details>
                )}

                {/* Form fields */}
                <div className="flex flex-col gap-1.5">
                  <label className={lbl}>Full Name <span className="text-red-600">*</span></label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Dr. John Adebayo" className={inp} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={lbl}>Email <span className="text-red-600">*</span></label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className={inp} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={lbl}>Organisation</label>
                  <input type="text" value={org} onChange={e => setOrg(e.target.value)} placeholder="Hospital, university, clinic..." className={inp} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={lbl}>NASMED Dues Status</label>
                  <select
                    title="Dues Status"
                    value={membership}
                    onChange={e => { setMembership(e.target.value); setPaymentMethod(null); setBankReceiptUrl(""); setBankReceiptError(""); }}
                    className={inp}
                  >
                    <option value="member">I have paid my NASMED dues (FREE)</option>
                    <option value="non-member">I have not paid my dues ({fee > 0 ? formatFee(fee) : "FREE"})</option>
                  </select>
                </div>

                {/* ── Bank Transfer (only when fee is due) ── */}
                {!isFree && (
                  <div className="flex flex-col gap-3">
                    {paymentMethod !== "bank" && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bank")}
                        className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-nasmed-mid-blue bg-nasmed-mid-blue/5 cursor-pointer transition-all hover:bg-nasmed-mid-blue/10"
                      >
                        <span className="text-2xl">🏦</span>
                        <div className="text-left">
                          <p className="text-[13px] font-bold text-nasmed-navy">Pay via Bank Transfer</p>
                          <p className="text-[11px] text-nasmed-text-muted">Transfer & upload receipt for admin review</p>
                        </div>
                      </button>
                    )}

                    {paymentMethod === "bank" && (
                      <div className="flex flex-col gap-3">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[13px] text-amber-800 leading-relaxed">
                          Transfer <strong>{formatFee(fee)}</strong> to the account below, then upload your receipt. Your registration will be confirmed by the admin after verification.
                        </div>

                        {/* Bank details */}
                        <div className="border border-nasmed-gray-light rounded-xl overflow-hidden divide-y divide-nasmed-gray-light">
                          {[
                            { label: "Bank", value: BANK.bankName },
                            { label: "Account Name", value: BANK.accountName },
                            { label: "Account Number", value: BANK.accountNumber },
                            { label: "Amount", value: formatFee(fee) },
                          ].map(row => (
                            <div key={row.label} className="flex items-center justify-between px-4 py-3">
                              <span className="text-[12px] font-semibold text-nasmed-text-muted">{row.label}</span>
                              <span className="text-[13px] font-bold text-nasmed-navy font-mono">{row.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Optional reference */}
                        <div className="flex flex-col gap-1.5">
                          <label className={lbl}>Your Transaction Reference <span className="text-nasmed-text-muted font-normal">(optional)</span></label>
                          <input
                            type="text"
                            value={bankRefInput}
                            onChange={e => setBankRefInput(e.target.value)}
                            placeholder="e.g. TXN123456"
                            className={inp}
                          />
                        </div>

                        {/* Receipt upload */}
                        {!bankReceiptUrl ? (
                          <div className="flex flex-col gap-1.5">
                            <label className={lbl}>Upload Payment Receipt <span className="text-red-600">*</span></label>
                            <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all ${bankReceiptUploading ? "border-nasmed-gray-light opacity-60 cursor-not-allowed" : "border-nasmed-mid-blue/40 hover:border-nasmed-mid-blue hover:bg-nasmed-mid-blue/5"}`}>
                              <span className="text-2xl">{bankReceiptUploading ? "⏳" : "📤"}</span>
                              <span className="text-[13px] font-semibold text-nasmed-mid-blue">
                                {bankReceiptUploading ? "Uploading…" : "Click to upload receipt"}
                              </span>
                              <span className="text-[11px] text-nasmed-text-muted">PDF, JPG or PNG</span>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                disabled={bankReceiptUploading}
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) handleReceiptUpload(file, ev);
                                }}
                              />
                            </label>
                            {bankReceiptError && (
                              <p className="text-[12px] text-red-500">{bankReceiptError}</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 bg-nasmed-green/10 border-2 border-nasmed-green/40 rounded-xl p-4">
                            <span className="text-2xl">📄</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-bold text-nasmed-green">Receipt Uploaded — {bankReceiptName}</p>
                              <p className="text-[12px] text-nasmed-green/80">Admin will review and confirm your registration within 1–3 business days.</p>
                            </div>
                            <button
                              type="button"
                              onClick={closeModal}
                              className="bg-nasmed-green text-white border-none py-2 px-4 rounded-lg text-[13px] font-bold cursor-pointer hover:bg-nasmed-green-light transition-all whitespace-nowrap"
                            >
                              Done ✓
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Info banner */}
                <div className="bg-nasmed-green/10 border border-nasmed-green/25 rounded-lg px-4 py-3 text-[13px] text-nasmed-text-muted">
                  Not a member?{" "}<a href="/membership" className="text-nasmed-mid-blue font-semibold hover:underline">Join NASMED</a>{" "}to attend all future events for free.
                </div>

                {/* Submit button */}
                {isFree && (
                  <button
                    type="button"
                    onClick={() => handleFreeRegistration(ev)}
                    className="bg-nasmed-green text-white border-none py-3.5 rounded-lg text-[15px] font-bold cursor-pointer hover:bg-nasmed-green-light transition-all"
                  >
                    Register Now →
                  </button>
                )}
                {!isFree && !paymentMethod && (
                  <button type="button" disabled className="bg-nasmed-gray-light text-nasmed-text-muted border-none py-3.5 rounded-lg text-[15px] font-bold cursor-not-allowed opacity-60">
                    Click bank transfer above to pay
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
