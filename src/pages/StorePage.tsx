import PageHeader from "@/components/PageHeader";

export default function StorePage() {
  return (
    <div>
      <PageHeader breadcrumb="HOME / STORE" title="NASMED Store" subtitle="Professional resources, publications, and learning materials for sports medicine practitioners" />

      <section className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="flex flex-col items-center justify-center text-center max-w-[520px] mx-auto gap-5">
          <div className="w-20 h-20 rounded-full bg-nasmed-mid-blue/10 flex items-center justify-center text-4xl">🛍️</div>
          <h2 className="font-heading text-[28px] font-bold text-nasmed-navy">Store Coming Soon</h2>
          <p className="text-nasmed-text-muted text-[15px] leading-relaxed">
            The NASMED Store is being set up. Publications, CPD bundles, assessment kits, and branded merchandise will be available here shortly.
          </p>
          <p className="text-[13px] text-nasmed-text-muted">
            For immediate enquiries, contact us at{" "}
            <a href="mailto:info@nasmed.org" className="text-nasmed-mid-blue font-semibold hover:underline">info@nasmed.org</a>
          </p>
        </div>
      </section>
    </div>
  );
}
