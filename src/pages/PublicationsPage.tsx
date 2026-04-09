import { useState } from "react";
import PageHeader from "@/components/PageHeader";

const publications = [
  { tag: "Research", tagClass: "bg-accent/10 text-accent", title: "Heat Acclimatisation Strategies for Sub-Saharan African Athletes", desc: "A systematic review of thermoregulatory adaptations and cooling protocols in Nigerian competitive sport.", date: "Jun 2024" },
  { tag: "Health", tagClass: "bg-nasmed-green/10 text-nasmed-green", title: "Concussion Management Protocols in Nigerian Grassroots Football", desc: "Evaluating awareness and practice gaps in concussion identification among coaches and medical staff.", date: "May 2024" },
  { tag: "Performance", tagClass: "bg-nasmed-blue/10 text-nasmed-blue", title: "Nutritional Periodisation in Elite Nigerian Track Athletes", desc: "Macronutrient timing and supplementation strategies aligned with training cycles.", date: "Apr 2024" },
  { tag: "Policy", tagClass: "bg-orange-500/10 text-orange-600", title: "Sports Medicine Policy Gaps in Nigerian Public Health Infrastructure", desc: "Identifying key structural barriers to integrating sports medicine into national health planning.", date: "Mar 2024" },
  { tag: "Health", tagClass: "bg-nasmed-green/10 text-nasmed-green", title: "ACL Injury Prevention in Female Nigerian Athletes", desc: "Evidence-based prehabilitation protocols tailored for high-incidence sports in Nigeria.", date: "Feb 2024" },
  { tag: "Research", tagClass: "bg-accent/10 text-accent", title: "Exercise Prescription for Hypertension Management", desc: "A randomised controlled trial assessing structured aerobic training on blood pressure outcomes.", date: "Jan 2024" },
];

const filters = ["All", "Research", "Health", "Performance", "Policy"];

export default function PublicationsPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? publications : publications.filter(p => p.tag === active);

  return (
    <div>
      <PageHeader breadcrumb="HOME / PUBLICATIONS" title="Publications & Research" subtitle="Peer-reviewed research advancing sports and exercise medicine in Africa" />

      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
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

        {/* Featured */}
        <div className="bg-nasmed-navy rounded-[14px] p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-7 items-center mb-7">
          <div>
            <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-3.5">Featured Journal</span>
            <h3 className="font-heading text-[22px] text-white mb-2.5">Nigerian Journal of Sports Medicine — Volume XII</h3>
            <p className="text-white/60 text-sm leading-relaxed">Groundbreaking research on heat acclimatisation, concussion protocols, and nutritional strategies for elite performance.</p>
          </div>
          <div className="bg-nasmed-green text-white py-3 px-5 rounded-[10px] text-center shrink-0">
            <strong className="block text-sm font-bold">🔓 Free Access</strong>
            <span className="text-[11px] opacity-80">First 6 Months</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-nasmed-gray-light transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
              <div className="p-5">
                <span className={`text-[10px] font-bold tracking-[1.5px] uppercase py-0.5 px-2.5 rounded inline-block mb-3 ${p.tagClass}`}>{p.tag}</span>
                <h4 className="text-sm font-semibold text-nasmed-navy leading-snug mb-2">{p.title}</h4>
                <p className="text-[13px] text-nasmed-text-muted leading-relaxed">{p.desc}</p>
              </div>
              <div className="px-5 py-3 border-t border-nasmed-gray-light flex items-center justify-between text-xs text-nasmed-gray">
                <span>{p.date}</span>
                <span className="text-nasmed-mid-blue font-semibold">Read Article →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
