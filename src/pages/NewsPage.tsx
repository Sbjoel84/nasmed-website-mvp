import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

const newsItems = [
  { cat: "conference", catLabel: "CONFERENCE", title: "NASMED Annual Conference 2024 — Registration Now Open", desc: "Join leading sports medicine practitioners for two days of cutting-edge research presentations, workshops, and networking at the Abuja International Conference Centre.", date: "Jul 2024", read: "5 min read", featured: true },
  { cat: "research", catLabel: "RESEARCH", title: "New Research Grants Available for Early-Career Professionals", desc: "NASMED announces ₦5M in research funding for innovative sports medicine studies across Nigerian universities and hospitals.", date: "Jun 2024", read: "3 min read" },
  { cat: "update", catLabel: "UPDATE", title: "Updated Concussion Management Guidelines Released", desc: "New evidence-based protocols for sideline concussion assessment in Nigerian sports, developed in collaboration with international experts.", date: "May 2024", read: "4 min read" },
  { cat: "conference", catLabel: "CONFERENCE", title: "West African Sports Medicine Summit — Call for Papers", desc: "Submit your research abstracts for the inaugural West African Sports Medicine Summit hosted by NASMED in Lagos.", date: "Apr 2024", read: "3 min read" },
  { cat: "research", catLabel: "RESEARCH", title: "NASMED–University of Lagos Joint Research Programme", desc: "A new partnership to advance sports medicine research with focus on tropical climate athletic performance.", date: "Mar 2024", read: "4 min read" },
  { cat: "update", catLabel: "UPDATE", title: "New CPD Requirements for 2024 Membership Renewal", desc: "Updated continuing professional development requirements for all membership tiers effective January 2025.", date: "Feb 2024", read: "3 min read" },
];

const filters = ["All", "Conference", "Research", "Update"];

export default function NewsPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? newsItems : newsItems.filter(n => n.cat === active.toLowerCase());

  const [erName, setErName] = useState("");
  const [erEmail, setErEmail] = useState("");
  const [showEventModal, setShowEventModal] = useState(false);

  return (
    <div>
      <PageHeader breadcrumb="HOME / NEWS" title="News & Events" subtitle="Stay updated with the latest from NASMED — conferences, research, policy updates and professional development" />

      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        {/* Featured Event */}
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
              <button onClick={() => setShowEventModal(true)} className="bg-nasmed-green text-white border-none py-3 px-6 rounded-lg text-sm font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all">
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

        {/* Filters */}
        <div className="flex gap-2.5 flex-wrap mb-9">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`py-1.5 px-4 rounded-full text-[13px] font-medium border-[1.5px] cursor-pointer transition-all ${
                f === active ? "border-nasmed-mid-blue text-nasmed-mid-blue bg-nasmed-mid-blue/5" : "border-nasmed-gray-light text-nasmed-text-muted bg-white hover:border-nasmed-mid-blue hover:text-nasmed-mid-blue"
              }`}
            >{f}</button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((n, i) => (
            <div key={i} className={`rounded-xl overflow-hidden border border-nasmed-gray-light bg-white transition-all hover:shadow-xl hover:-translate-y-1 ${i === 0 ? "md:row-span-1" : ""}`}>
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

      {/* Event Registration Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/70 z-[3000] flex items-start justify-center p-5 overflow-y-auto" onClick={e => e.target === e.currentTarget && setShowEventModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[580px] my-auto overflow-hidden shadow-2xl animate-in fade-in">
            <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue p-7 relative">
              <button onClick={() => setShowEventModal(false)} className="absolute top-4 right-5 bg-white/15 border-none text-white w-8 h-8 rounded-full text-lg cursor-pointer flex items-center justify-center">✕</button>
              <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-2">📅 Event Registration</span>
              <h2 className="font-heading text-white text-xl mt-2">NASMED 2024 Annual Conference</h2>
              <p className="text-white/65 text-[13px] mt-1.5">September 14–15, 2024 | Abuja, FCT</p>
            </div>
            <div className="p-7 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 mb-2">
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
                <label className="text-[13px] font-semibold text-nasmed-navy">Full Name <span className="text-red-600">*</span></label>
                <input type="text" value={erName} onChange={e => setErName(e.target.value)} placeholder="Dr. John Adebayo" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Email <span className="text-red-600">*</span></label>
                <input type="email" value={erEmail} onChange={e => setErEmail(e.target.value)} placeholder="your@email.com" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Attendance Type</label>
                <select className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue">
                  <option>Full Conference (2 days)</option>
                  <option>Day 1 Only — Research & Keynotes</option>
                  <option>Day 2 Only — Workshops & Gala</option>
                  <option>Online Attendance</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">NASMED Membership Status</label>
                <select className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue">
                  <option>Yes — Member (Free registration)</option>
                  <option>No — Non-member (₦15,000)</option>
                </select>
              </div>
              <button
                onClick={() => {
                  if (!erName.trim() || !erEmail.trim()) { toast.error("Please fill in name and email."); return; }
                  setShowEventModal(false);
                  toast.success(`Registration confirmed for ${erName}! Check your email for details.`);
                  setErName(""); setErEmail("");
                }}
                className="bg-nasmed-green text-white border-none py-3.5 rounded-lg text-[15px] font-bold cursor-pointer hover:bg-nasmed-green-light transition-all"
              >
                Confirm Registration →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
