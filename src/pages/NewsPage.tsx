import { useState, useEffect } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import supabase from "@/lib/supabaseClient";
import newsService, { NewsPost, NewsEvent } from "@/services/newsService";

const CATEGORIES = ["All", "Conference", "Research", "Update"];

const inp = "py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue w-full";
const lbl = "text-[13px] font-semibold text-nasmed-navy";

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

  // shared registration form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [membership, setMembership] = useState("member");
  const [d1Attendance, setD1Attendance] = useState("day1");
  const [d2Attendance, setD2Attendance] = useState("day2");
  const [d2Gala, setD2Gala] = useState("yes");
  const [d2Dietary, setD2Dietary] = useState("");
  const [cpdCategory, setCpdCategory] = useState("doctor");
  const [cpdCertName, setCpdCertName] = useState("");

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

  const closeModal = () => setOpenModal(null);
  const resetForm = () => {
    setName(""); setEmail(""); setOrg(""); setMembership("member");
    setD1Attendance("day1"); setD2Attendance("day2"); setD2Gala("yes"); setD2Dietary("");
    setCpdCategory("doctor"); setCpdCertName("");
  };
  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) { toast.error("Please fill in your name and email."); return; }
    closeModal();
    toast.success(`Registration confirmed for ${name}! Check your email for details.`);
    resetForm();
  };

  return (
    <div>
      <PageHeader breadcrumb="HOME / NEWS & EVENTS" title="News & Events" subtitle="Stay updated with the latest from NASMED — conferences, research, policy updates and professional development" />

      {/* ── Hero Featured Conference Banner ── */}
      <section className="px-6 md:px-12 max-w-[1280px] mx-auto pt-10 pb-4">
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
      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        {events.length > 0 && (
          <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue rounded-2xl overflow-hidden mb-10">
            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-4">📅 Upcoming Event</span>
                <h2 className="font-heading text-white text-[26px] mb-3">{events[0].title}</h2>
                <p className="text-white/65 text-[15px] leading-relaxed mb-6">{events[0].description}</p>
                <div className="flex gap-4 text-white/60 text-sm flex-wrap mb-6">
                  <span>📍 {events[0].location}</span>
                  {events[0].event_date && <span>📅 {new Date(events[0].event_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenModal(events[0].id)}
                  className="bg-nasmed-green text-white border-none py-3 px-6 rounded-lg text-sm font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all"
                >
                  Register Now →
                </button>
              </div>
              <div className="hidden md:flex flex-col gap-3">
                <div className="border-2 border-nasmed-mid-blue rounded-xl p-4 text-center bg-nasmed-mid-blue/10">
                  <div className="font-heading text-xl font-bold text-white">FREE</div>
                  <div className="text-white/60 text-xs mt-1">NASMED Members</div>
                </div>
                <div className="border border-white/20 rounded-xl p-4 text-center">
                  <div className="font-heading text-xl font-bold text-white">₦15,000</div>
                  <div className="text-white/60 text-xs mt-1">Non-members</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2.5 flex-wrap mb-9">
          {CATEGORIES.map(f => (
            <button type="button" key={f} onClick={() => setActive(f)} className={`py-1.5 px-4 rounded-full text-[13px] font-medium border-[1.5px] cursor-pointer transition-all ${f === active ? "border-nasmed-mid-blue text-nasmed-mid-blue bg-nasmed-mid-blue/5" : "border-nasmed-gray-light text-nasmed-text-muted bg-white hover:border-nasmed-mid-blue hover:text-nasmed-mid-blue"}`}>{f}</button>
          ))}
        </div>

        {loadingPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-nasmed-gray-light bg-white h-64 animate-pulse" />
            ))}
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

      {/* ── Event Registration Modals ── */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black/70 z-[3000] flex items-start justify-center p-5 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-[580px] my-8 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue p-7 relative">
              <button type="button" onClick={closeModal} className="absolute top-4 right-5 bg-white/15 border-none text-white w-8 h-8 rounded-full text-lg cursor-pointer flex items-center justify-center hover:bg-white/25 transition-all">✕</button>
              <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-3">📅 Event Registration</span>
              {(() => {
                const ev = events.find(e => e.id === openModal);
                return ev ? (
                  <>
                    <h2 className="font-heading text-white text-xl mt-1">{ev.title}</h2>
                    <p className="text-white/65 text-[13px] mt-1.5">
                      {ev.event_date ? new Date(ev.event_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}{ev.location ? ` | ${ev.location}` : ""}
                    </p>
                  </>
                ) : null;
              })()}
            </div>
            <div className="p-7 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="border-2 border-nasmed-mid-blue rounded-xl p-3.5 text-center bg-nasmed-mid-blue/5">
                  <div className="font-heading text-xl font-bold text-nasmed-mid-blue">FREE</div>
                  <div className="text-nasmed-text-muted text-xs mt-1">NASMED Members</div>
                </div>
                <div className="border border-nasmed-gray-light rounded-xl p-3.5 text-center">
                  <div className="font-heading text-xl font-bold text-nasmed-navy">₦15,000</div>
                  <div className="text-nasmed-text-muted text-xs mt-1">Non-members</div>
                </div>
              </div>
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
                <label className={lbl}>NASMED Membership Status</label>
                <select title="NASMED Membership Status" value={membership} onChange={e => setMembership(e.target.value)} className={inp}>
                  <option value="member">Yes — Member (Free registration)</option>
                  <option value="non-member">No — Non-member (₦15,000)</option>
                </select>
              </div>
              {/* Additional fields for conference day 1 */}
              {events.find(e => e.id === openModal)?.title.toLowerCase().includes("day 1") && (
                <div className="flex flex-col gap-1.5">
                  <label className={lbl}>Attendance Type</label>
                  <select title="Attendance Type" value={d1Attendance} onChange={e => setD1Attendance(e.target.value)} className={inp}>
                    <option value="day1">Day 1 Only — Research & Keynote Sessions</option>
                    <option value="full">Full Conference (Day 1 + Day 2)</option>
                  </select>
                </div>
              )}
              {/* Additional fields for conference day 2 */}
              {events.find(e => e.id === openModal)?.title.toLowerCase().includes("day 2") && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className={lbl}>Attendance Type</label>
                    <select title="Attendance Type" value={d2Attendance} onChange={e => setD2Attendance(e.target.value)} className={inp}>
                      <option value="day2">Day 2 Only — Workshops, AGM & Gala Dinner</option>
                      <option value="full">Full Conference (Day 1 + Day 2)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={lbl}>Will you attend the Gala Dinner?</label>
                    <select title="Gala Dinner Attendance" value={d2Gala} onChange={e => setD2Gala(e.target.value)} className={inp}>
                      <option value="yes">Yes — I will attend the Gala Dinner</option>
                      <option value="no">No — Workshops & AGM only</option>
                    </select>
                  </div>
                  {d2Gala === "yes" && (
                    <div className="flex flex-col gap-1.5">
                      <label className={lbl}>Dietary Requirements</label>
                      <input type="text" value={d2Dietary} onChange={e => setD2Dietary(e.target.value)} placeholder="e.g. Vegetarian, Halal, None..." className={inp} />
                    </div>
                  )}
                </>
              )}
              {/* CPD workshop fields */}
              {events.find(e => e.id === openModal)?.title.toLowerCase().includes("cpd") && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className={lbl}>Professional Category</label>
                    <select title="Professional Category" value={cpdCategory} onChange={e => setCpdCategory(e.target.value)} className={inp}>
                      <option value="doctor">Medical Doctor / Sports Physician</option>
                      <option value="physio">Physiotherapist</option>
                      <option value="dietitian">Dietitian / Nutritionist</option>
                      <option value="nurse">Nurse / Allied Health</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={lbl}>Name for CPD Certificate <span className="text-red-600">*</span></label>
                    <input type="text" value={cpdCertName} onChange={e => setCpdCertName(e.target.value)} placeholder="Full name as it should appear on certificate" className={inp} />
                  </div>
                </>
              )}
              <div className="bg-nasmed-green/10 border border-nasmed-green/25 rounded-lg px-4 py-3 text-[13px] text-nasmed-text-muted">
                Not a member?{" "}<a href="/membership" className="text-nasmed-mid-blue font-semibold hover:underline">Join NASMED</a>{" "}to attend all future events for free.
              </div>
              <button type="button" onClick={handleSubmit} className="bg-nasmed-green text-white border-none py-3.5 rounded-lg text-[15px] font-bold cursor-pointer hover:bg-nasmed-green-light transition-all">
                {events.find(e => e.id === openModal)?.cta_text || "Register"} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
