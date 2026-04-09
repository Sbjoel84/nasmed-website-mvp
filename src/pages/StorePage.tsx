import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

const products = [
  { icon: "📚", title: "Sports Medicine Handbook — 4th Edition", desc: "The definitive Nigerian guide for practitioners", price: "₦12,500", action: "Add to Cart" },
  { icon: "🎓", title: "CPD Online Course Bundle", desc: "20 accredited hours across 5 modules", price: "₦35,000", action: "Enrol" },
  { icon: "📋", title: "Athlete Assessment Templates Pack", desc: "40+ clinical and field-side assessment forms", price: "₦5,000", action: "Download" },
  { icon: "🏅", title: "NASMED Conference Proceedings 2023", desc: "Full transcripts and research papers", price: "₦8,000", action: "Purchase" },
  { icon: "📰", title: "Nigerian Journal of Sports Medicine — Vol XII", desc: "Latest edition — 6 months free access", price: "₦3,500", action: "Get It" },
  { icon: "🩺", title: "Sideline Emergency Protocols Guide", desc: "Field-ready emergency management guide", price: "₦6,500", action: "Add to Cart" },
  { icon: "🧬", title: "Exercise Physiology Textbook", desc: "Recommended for all NASMED examinations", price: "₦18,000", action: "Purchase" },
  { icon: "🎽", title: "NASMED Official Branded Kit", desc: "Professional branded polo shirt and ID lanyard", price: "₦9,000", action: "Order" },
];

export default function StorePage() {
  return (
    <div>
      <PageHeader breadcrumb="HOME / STORE" title="NASMED Store" subtitle="Professional resources, publications, and learning materials for sports medicine practitioners" />

      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-nasmed-gray-light transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-full aspect-[3/2] bg-gradient-to-br from-nasmed-blue to-nasmed-mid-blue flex items-center justify-center text-4xl">{p.icon}</div>
              <div className="p-4">
                <h4 className="text-sm font-semibold text-nasmed-navy mb-1.5 leading-snug">{p.title}</h4>
                <p className="text-xs text-nasmed-text-muted mb-3">{p.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-nasmed-navy text-base">{p.price}</span>
                  <button
                    onClick={() => toast.success(`${p.title} added!`)}
                    className="bg-nasmed-mid-blue text-white border-none py-1.5 px-3.5 rounded-md text-xs font-semibold cursor-pointer hover:bg-accent transition-colors"
                  >{p.action}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
