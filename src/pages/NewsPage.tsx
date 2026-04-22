import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import swearingIn from "@/assets/swearing-in.jpg";
import cacHandover from "@/assets/cac-handover.jpg";
import newBoardInaugurated from "@/assets/New National Executive Board Inaugurated.jpg";
import presidentPhoto from "@/assets/president-photo.jpg";

const newsItems = [
  { cat: "conference", catLabel: "CONFERENCE", title: "NASMED Annual Conference 2024 — Registration Now Open", desc: "Join leading sports medicine practitioners for two days of cutting-edge research presentations, workshops, and networking at the Abuja International Conference Centre.", date: "Jul 2024", read: "5 min read" },
  { cat: "research", catLabel: "RESEARCH", title: "New Research Grants Available for Early-Career Professionals", desc: "NASMED announces ₦5M in research funding for innovative sports medicine studies across Nigerian universities and hospitals.", date: "Jun 2024", read: "3 min read" },
  { cat: "update", catLabel: "UPDATE", title: "Updated Concussion Management Guidelines Released", desc: "New evidence-based protocols for sideline concussion assessment in Nigerian sports, developed in collaboration with international experts.", date: "May 2024", read: "4 min read" },
  { cat: "conference", catLabel: "CONFERENCE", title: "West African Sports Medicine Summit — Call for Papers", desc: "Submit your research abstracts for the inaugural West African Sports Medicine Summit hosted by NASMED in Lagos.", date: "Apr 2024", read: "3 min read" },
  { cat: "research", catLabel: "RESEARCH", title: "NASMED–University of Lagos Joint Research Programme", desc: "A new partnership to advance sports medicine research with focus on tropical climate athletic performance.", date: "Mar 2024", read: "4 min read" },
  { cat: "update", catLabel: "UPDATE", title: "New CPD Requirements for 2024 Membership Renewal", desc: "Updated continuing professional development requirements for all membership tiers effective January 2025.", date: "Feb 2024", read: "3 min read" },
];

const filters = ["All", "Conference", "Research", "Update"];

const upcomingEvents = [
  { id: "conf-day1",    day: "14", month: "SEP", title: "NASMED Annual Conference Day 1",                            location: "Abuja, FCT",   desc: "Research Presentations & Keynote Sessions",  cta: "Register",  ctaStyle: "filled"  },
  { id: "conf-day2",   day: "15", month: "SEP", title: "NASMED Annual Conference Day 2 & Gala",                    location: "Abuja, FCT",   desc: "Workshops, AGM & Awards Gala Dinner",        cta: "Register",  ctaStyle: "filled"  },
  { id: "cpd-workshop",day: "08", month: "AUG", title: "CPD Workshop — Sports Nutrition & Performance",            location: "Lagos",        desc: "2-day workshop | 20 CPD Credits",            cta: "Book Now",  ctaStyle: "filled"  },
  { id: "webinar",     day: "22", month: "NOV", title: "NASMED Webinar — Concussion Management in Nigerian Football", location: "Online (Zoom)",desc: "Free for members | 3 CPD Credits",           cta: "Join Free", ctaStyle: "outline" },
];

const latestNews = [
  { cat: "ANNUAL CONFERENCE", title: "NASMED 2024 National Conference – Abuja, September",   desc: "Join over 500 sports medicine professionals for two days of world-class research presentations and workshops.",  date: "14 Jun 2024", img: swearingIn   },
  { cat: "GOVERNANCE",        title: "New National Executive Board Inaugurated",              desc: "NASMED's newly elected board takes office and outlines goals for 2024–2026.",                                    date: "20 Jun 2024", img: newBoardInaugurated  },
  { cat: "MILESTONES",        title: "CAC Certificate of Incorporation Received",             desc: "NASMED receives its Certificate of Incorporation from the Corporate Affairs Commission (CAC), a landmark step.", date: "01 Jul 2024", img: cacHandover },
];

const inp = "py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue w-full";
const lbl = "text-[13px] font-semibold text-nasmed-navy";

export default function NewsPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? newsItems : newsItems.filter(n => n.cat === active.toLowerCase());

  const [openModal, setOpenModal] = useState<string | null>(null);

  // shared fields
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [org,        setOrg]        = useState("");
  const [membership, setMembership] = useState("member");

  // Day 1
  const [d1Attendance, setD1Attendance] = useState("day1");

  // Day 2 & Gala
  const [d2Attendance, setD2Attendance] = useState("day2");
  const [d2Gala,       setD2Gala]       = useState("yes");
  const [d2Dietary,    setD2Dietary]    = useState("");

  // CPD Workshop
  const [cpdCategory, setCpdCategory] = useState("doctor");
  const [cpdCertName, setCpdCertName] = useState("");

  const closeModal = () => setOpenModal(null);

  const resetForm = () => {
    setName(""); setEmail(""); setOrg(""); setMembership("member");
    setD1Attendance("day1");
    setD2Attendance("day2"); setD2Gala("yes"); setD2Dietary("");
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
        <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_420px]">
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-5 w-fit">Coming Soon</span>
              <h2 className="font-heading text-white text-[28px] md:text-[32px] leading-tight mb-4">NASMED 2024 Annual Scientific Conference &amp; General Assembly</h2>
              <p className="text-white/65 text-[15px] leading-relaxed mb-7">Nigeria's premier sports medicine conference bringing together 400+ professionals for two days of cutting-edge research presentations, workshops, and the annual gala dinner.</p>
              <div className="flex flex-wrap gap-5 text-white/70 text-[13px] mb-8">
                <span>📅 September 2024</span>
                <span>📍 Abuja, FCT</span>
                <span>👥 500+ Attendees</span>
              </div>
              <button onClick={() => setOpenModal("conf-day1")} className="bg-nasmed-green text-white border-none py-3 px-7 rounded-lg text-sm font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all w-fit">
                Register Interest →
              </button>
            </div>
            <div className="hidden md:block relative">
              <img src={swearingIn} alt="NASMED Annual Conference" className="w-full h-full object-cover" style={{ minHeight: "340px" }} />
              <div className="absolute inset-0 bg-gradient-to-r from-nasmed-navy/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Original Featured Event + Filters + News Grid ── */}
      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue rounded-2xl overflow-hidden mb-10">
          <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-4">📅 Upcoming Event</span>
              <h2 className="font-heading text-white text-[26px] mb-3">NASMED 2024 Annual Conference</h2>
              <p className="text-white/65 text-[15px] leading-relaxed mb-6">Join leading sports medicine professionals for two days of research presentations, hands-on workshops, and networking opportunities.</p>
              <div className="flex gap-4 text-white/60 text-sm flex-wrap mb-6">
                <span>📍 Abuja, FCT</span>
                <span>📅 September 14–15, 2024</span>
              </div>
              <button onClick={() => setOpenModal("conf-day1")} className="bg-nasmed-green text-white border-none py-3 px-6 rounded-lg text-sm font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all">
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

        <div className="flex gap-2.5 flex-wrap mb-9">
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)} className={`py-1.5 px-4 rounded-full text-[13px] font-medium border-[1.5px] cursor-pointer transition-all ${f === active ? "border-nasmed-mid-blue text-nasmed-mid-blue bg-nasmed-mid-blue/5" : "border-nasmed-gray-light text-nasmed-text-muted bg-white hover:border-nasmed-mid-blue hover:text-nasmed-mid-blue"}`}>{f}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((n, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-nasmed-gray-light bg-white transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-full aspect-video bg-gradient-to-br from-nasmed-navy to-nasmed-blue flex items-center justify-center text-white/30 text-5xl">
                {n.cat === "conference" ? "🏛️" : n.cat === "research" ? "🔬" : "📋"}
              </div>
              <div className="p-4">
                <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-nasmed-green mb-2">{n.catLabel}</div>
                <h3 className="font-heading text-base font-bold text-nasmed-navy leading-snug mb-2">{n.title}</h3>
                <p className="text-[13px] text-nasmed-text-muted leading-relaxed">{n.desc}</p>
              </div>
              <div className="px-4 py-3 border-t border-nasmed-gray-light flex justify-between text-xs text-nasmed-gray">
                <span>{n.date}</span><span>{n.read}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Events Calendar ── */}
      <section className="py-16 px-6 md:px-12 max-w-[1280px] mx-auto border-t border-nasmed-gray-light">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-[2px] bg-nasmed-green" />
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-nasmed-green">Upcoming Events</span>
        </div>
        <h2 className="font-heading text-[42px] font-bold text-nasmed-navy leading-tight mb-10">Events Calendar</h2>

        <div className="flex flex-col divide-y divide-nasmed-gray-light border border-nasmed-gray-light rounded-2xl overflow-hidden">
          {upcomingEvents.map((ev) => (
            <div key={ev.id} className="flex items-center gap-6 px-6 py-5 bg-white hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-14 text-center">
                <div className="font-heading text-[32px] font-bold text-nasmed-navy leading-none">{ev.day}</div>
                <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-nasmed-green mt-0.5">{ev.month}</div>
              </div>
              <div className="w-px h-10 bg-nasmed-gray-light flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-heading text-[16px] font-bold text-nasmed-navy leading-snug">{ev.title}</div>
                <div className="text-[13px] text-nasmed-green mt-1">
                  {ev.location}<span className="mx-1.5 text-nasmed-gray-light">|</span>{ev.desc}
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => setOpenModal(ev.id)}
                  className={`py-2.5 px-6 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${ev.ctaStyle === "filled" ? "bg-nasmed-green text-white hover:bg-nasmed-green-light" : "border-[1.5px] border-nasmed-navy text-nasmed-navy bg-white hover:bg-nasmed-navy hover:text-white"}`}
                >
                  {ev.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Latest from NASMED ── */}
      <section className="py-16 px-6 md:px-12 max-w-[1280px] mx-auto border-t border-nasmed-gray-light">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-[32px] font-bold text-nasmed-navy">Latest from NASMED</h2>
          <button className="bg-nasmed-green text-white py-2 px-5 rounded-lg text-[13px] font-semibold hover:bg-nasmed-green-light transition-all cursor-pointer">All News →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((n, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-nasmed-gray-light bg-white hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-full aspect-video overflow-hidden">
                <img src={n.img} alt={n.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-nasmed-green mb-2">{n.cat}</div>
                <h3 className="font-heading text-[15px] font-bold text-nasmed-navy leading-snug mb-2">{n.title}</h3>
                <p className="text-[13px] text-nasmed-text-muted leading-relaxed line-clamp-3">{n.desc}</p>
              </div>
              <div className="px-5 py-3 border-t border-nasmed-gray-light flex items-center justify-between">
                <span className="text-xs text-nasmed-gray">{n.date}</span>
                <button className="text-[13px] font-semibold text-nasmed-mid-blue hover:underline cursor-pointer bg-transparent border-none">Read More →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════ */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black/70 z-[3000] flex items-start justify-center p-5 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >

          {/* ── Conference Day 1 ─────────────────────────────────── */}
          {openModal === "conf-day1" && (
            <div className="bg-white rounded-2xl w-full max-w-[580px] my-8 overflow-hidden shadow-2xl">
              {/* header */}
              <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue p-7 relative">
                <button onClick={closeModal} className="absolute top-4 right-5 bg-white/15 border-none text-white w-8 h-8 rounded-full text-lg cursor-pointer flex items-center justify-center hover:bg-white/25 transition-all">✕</button>
                <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-3">📅 Event Registration</span>
                <h2 className="font-heading text-white text-xl mt-1">NASMED Annual Conference Day 1</h2>
                <p className="text-white/65 text-[13px] mt-1.5">14 September 2024 | Abuja, FCT</p>
              </div>
              {/* body */}
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
                  <label className={lbl}>Attendance Type</label>
                  <select value={d1Attendance} onChange={e => setD1Attendance(e.target.value)} className={inp}>
                    <option value="day1">Day 1 Only — Research & Keynote Sessions</option>
                    <option value="full">Full Conference (Day 1 + Day 2)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={lbl}>NASMED Membership Status</label>
                  <select value={membership} onChange={e => setMembership(e.target.value)} className={inp}>
                    <option value="member">Yes — Member (Free registration)</option>
                    <option value="non-member">No — Non-member (₦15,000)</option>
                  </select>
                </div>
                <div className="bg-nasmed-green/10 border border-nasmed-green/25 rounded-lg px-4 py-3 text-[13px] text-nasmed-text-muted">
                  Not a member?{" "}<a href="/membership" className="text-nasmed-mid-blue font-semibold hover:underline">Join NASMED</a>{" "}to attend all future events for free.
                </div>
                <button onClick={handleSubmit} className="bg-nasmed-green text-white border-none py-3.5 rounded-lg text-[15px] font-bold cursor-pointer hover:bg-nasmed-green-light transition-all">
                  Confirm Registration →
                </button>
              </div>
            </div>
          )}

          {/* ── Conference Day 2 & Gala ──────────────────────────── */}
          {openModal === "conf-day2" && (
            <div className="bg-white rounded-2xl w-full max-w-[580px] my-8 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue p-7 relative">
                <button onClick={closeModal} className="absolute top-4 right-5 bg-white/15 border-none text-white w-8 h-8 rounded-full text-lg cursor-pointer flex items-center justify-center hover:bg-white/25 transition-all">✕</button>
                <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-3">📅 Event Registration</span>
                <h2 className="font-heading text-white text-xl mt-1">NASMED Annual Conference Day 2 & Gala</h2>
                <p className="text-white/65 text-[13px] mt-1.5">15 September 2024 | Abuja, FCT</p>
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
                  <label className={lbl}>Attendance Type</label>
                  <select value={d2Attendance} onChange={e => setD2Attendance(e.target.value)} className={inp}>
                    <option value="day2">Day 2 Only — Workshops, AGM & Gala Dinner</option>
                    <option value="full">Full Conference (Day 1 + Day 2)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={lbl}>Will you attend the Gala Dinner?</label>
                  <select value={d2Gala} onChange={e => setD2Gala(e.target.value)} className={inp}>
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
                <div className="flex flex-col gap-1.5">
                  <label className={lbl}>NASMED Membership Status</label>
                  <select value={membership} onChange={e => setMembership(e.target.value)} className={inp}>
                    <option value="member">Yes — Member (Free registration)</option>
                    <option value="non-member">No — Non-member (₦15,000)</option>
                  </select>
                </div>
                <div className="bg-nasmed-green/10 border border-nasmed-green/25 rounded-lg px-4 py-3 text-[13px] text-nasmed-text-muted">
                  Not a member?{" "}<a href="/membership" className="text-nasmed-mid-blue font-semibold hover:underline">Join NASMED</a>{" "}to attend all future events for free.
                </div>
                <button onClick={handleSubmit} className="bg-nasmed-green text-white border-none py-3.5 rounded-lg text-[15px] font-bold cursor-pointer hover:bg-nasmed-green-light transition-all">
                  Confirm Registration →
                </button>
              </div>
            </div>
          )}

          {/* ── CPD Workshop ─────────────────────────────────────── */}
          {openModal === "cpd-workshop" && (
            <div className="bg-white rounded-2xl w-full max-w-[580px] my-8 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue p-7 relative">
                <button onClick={closeModal} className="absolute top-4 right-5 bg-white/15 border-none text-white w-8 h-8 rounded-full text-lg cursor-pointer flex items-center justify-center hover:bg-white/25 transition-all">✕</button>
                <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-3">📅 Workshop Registration</span>
                <h2 className="font-heading text-white text-xl mt-1">CPD Workshop — Sports Nutrition & Performance</h2>
                <p className="text-white/65 text-[13px] mt-1.5">08 August 2024 | Lagos · 2-day workshop · 20 CPD Credits</p>
              </div>
              <div className="p-7 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-nasmed-mid-blue rounded-xl p-3.5 text-center bg-nasmed-mid-blue/5">
                    <div className="font-heading text-xl font-bold text-nasmed-mid-blue">₦25,000</div>
                    <div className="text-nasmed-text-muted text-xs mt-1">NASMED Members</div>
                  </div>
                  <div className="border border-nasmed-gray-light rounded-xl p-3.5 text-center">
                    <div className="font-heading text-xl font-bold text-nasmed-navy">₦35,000</div>
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
                  <label className={lbl}>Professional Category</label>
                  <select value={cpdCategory} onChange={e => setCpdCategory(e.target.value)} className={inp}>
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
                <div className="flex flex-col gap-1.5">
                  <label className={lbl}>NASMED Membership Status</label>
                  <select value={membership} onChange={e => setMembership(e.target.value)} className={inp}>
                    <option value="member">Yes — Member (₦25,000)</option>
                    <option value="non-member">No — Non-member (₦35,000)</option>
                  </select>
                </div>
                <div className="bg-nasmed-green/10 border border-nasmed-green/25 rounded-lg px-4 py-3 text-[13px] text-nasmed-text-muted">
                  🎓 Participants earn <span className="font-semibold text-nasmed-navy">20 CPD Credits</span> upon completion. Certificate issued within 7 days after the workshop.
                </div>
                <div className="bg-nasmed-green/10 border border-nasmed-green/25 rounded-lg px-4 py-3 text-[13px] text-nasmed-text-muted">
                  Not a member?{" "}<a href="/membership" className="text-nasmed-mid-blue font-semibold hover:underline">Join NASMED</a>{" "}to access member pricing.
                </div>
                <button onClick={handleSubmit} className="bg-nasmed-green text-white border-none py-3.5 rounded-lg text-[15px] font-bold cursor-pointer hover:bg-nasmed-green-light transition-all">
                  Book My Place →
                </button>
              </div>
            </div>
          )}

          {/* ── Webinar ──────────────────────────────────────────── */}
          {openModal === "webinar" && (
            <div className="bg-white rounded-2xl w-full max-w-[580px] my-8 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue p-7 relative">
                <button onClick={closeModal} className="absolute top-4 right-5 bg-white/15 border-none text-white w-8 h-8 rounded-full text-lg cursor-pointer flex items-center justify-center hover:bg-white/25 transition-all">✕</button>
                <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-3">📅 Webinar Registration</span>
                <h2 className="font-heading text-white text-xl mt-1">NASMED Webinar — Concussion Management in Nigerian Football</h2>
                <p className="text-white/65 text-[13px] mt-1.5">22 November 2024 | Online (Zoom) · 3 CPD Credits</p>
              </div>
              <div className="p-7 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-nasmed-mid-blue rounded-xl p-3.5 text-center bg-nasmed-mid-blue/5">
                    <div className="font-heading text-xl font-bold text-nasmed-mid-blue">FREE</div>
                    <div className="text-nasmed-text-muted text-xs mt-1">NASMED Members</div>
                  </div>
                  <div className="border border-nasmed-gray-light rounded-xl p-3.5 text-center">
                    <div className="font-heading text-xl font-bold text-nasmed-navy">₦2,000</div>
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
                  <select value={membership} onChange={e => setMembership(e.target.value)} className={inp}>
                    <option value="member">Yes — Member (Free access)</option>
                    <option value="non-member">No — Non-member (₦2,000)</option>
                  </select>
                </div>
                <div className="bg-nasmed-green/10 border border-nasmed-green/25 rounded-lg px-4 py-3 text-[13px] text-nasmed-text-muted">
                  🎓 Earn <span className="font-semibold text-nasmed-navy">3 CPD Credits</span> for attending. The Zoom link will be sent to your email 24 hours before the session.
                </div>
                <div className="bg-nasmed-green/10 border border-nasmed-green/25 rounded-lg px-4 py-3 text-[13px] text-nasmed-text-muted">
                  Not a member?{" "}<a href="/membership" className="text-nasmed-mid-blue font-semibold hover:underline">Join NASMED</a>{" "}to attend all future webinars for free.
                </div>
                <button onClick={handleSubmit} className="bg-nasmed-green text-white border-none py-3.5 rounded-lg text-[15px] font-bold cursor-pointer hover:bg-nasmed-green-light transition-all">
                  Join the Webinar →
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
