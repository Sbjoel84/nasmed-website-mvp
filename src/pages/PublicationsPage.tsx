import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import publicationService, { Publication } from "@/services/publicationService";

const filters = ["All", "Guidelines", "Journal", "Protocol", "Research", "Newsletter", "Report"];

const tagColors: Record<string, string> = {
  Guidelines: "bg-blue-100 text-blue-700",
  Journal: "bg-purple-100 text-purple-700",
  Protocol: "bg-cyan-100 text-cyan-700",
  Research: "bg-accent/10 text-accent",
  Newsletter: "bg-orange-100 text-orange-700",
  Report: "bg-nasmed-green/10 text-nasmed-green",
};

export default function PublicationsPage() {
  const [active, setActive] = useState("All");
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicationService.getPublished()
      .then(data => setPublications(data))
      .catch(() => setPublications([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === "All" ? publications : publications.filter(p => p.type === active);
  const featured = publications.find(p => p.type === "Journal") || publications[0];

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
        {featured && (
          <div className="bg-nasmed-navy rounded-[14px] p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-7 items-center mb-7">
            <div>
              <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-3.5">Featured Publication</span>
              <h3 className="font-heading text-[22px] text-white mb-2.5">{featured.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{featured.description}</p>
            </div>
            <div className={`py-3 px-5 rounded-[10px] text-center shrink-0 ${featured.access === "free" ? "bg-nasmed-green text-white" : featured.access === "paid" ? "bg-amber-500 text-white" : "bg-nasmed-mid-blue text-white"}`}>
              <strong className="block text-sm font-bold">
                {featured.access === "free" ? "🔓 Free Access" : featured.access === "paid" ? `💳 ₦${featured.price}` : "🔐 Members Only"}
              </strong>
              <span className="text-[11px] opacity-80">{featured.type}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-nasmed-text-muted">Loading publications…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-nasmed-text-muted">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-base font-semibold text-nasmed-navy mb-2">No publications yet</p>
            <p className="text-[13px]">Check back soon — publications will appear here once admin uploads them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => {
              const tagClass = tagColors[p.type] || "bg-nasmed-gray-light text-nasmed-text-muted";
              const date = new Date(p.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" });
              return (
                <div key={p.id} className="bg-white rounded-xl overflow-hidden border border-nasmed-gray-light transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                  <div className="p-5">
                    <span className={`text-[10px] font-bold tracking-[1.5px] uppercase py-0.5 px-2.5 rounded inline-block mb-3 ${tagClass}`}>{p.type}</span>
                    <h4 className="text-sm font-semibold text-nasmed-navy leading-snug mb-2">{p.title}</h4>
                    <p className="text-[13px] text-nasmed-text-muted leading-relaxed">{p.description}</p>
                  </div>
                  <div className="px-5 py-3 border-t border-nasmed-gray-light flex items-center justify-between text-xs text-nasmed-gray">
                    <span>{date}</span>
                    {p.file_url ? (
                      <a href={p.file_url} target="_blank" rel="noopener noreferrer" onClick={() => publicationService.incrementDownloads(p.id)} className="text-nasmed-mid-blue font-semibold hover:underline">
                        {p.access === "free" ? "Download →" : p.access === "paid" ? `Buy ₦${p.price} →` : "Members Only →"}
                      </a>
                    ) : (
                      <span className="text-nasmed-mid-blue font-semibold">
                        {p.access === "paid" ? `₦${p.price}` : p.access === "subscribed" ? "Members Only" : "Free"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
