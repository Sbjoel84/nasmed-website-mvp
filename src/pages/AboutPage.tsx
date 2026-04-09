import PageHeader from "@/components/PageHeader";
import aboutImg from "@/assets/about-img.jpg";

const leaders = [
  { name: "Prof. Adamu Ibrahim", role: "President", bio: "Orthopaedic surgeon with 25+ years in sports medicine" },
  { name: "Dr. Folake Adeyemi", role: "Vice President", bio: "Pioneer in exercise physiology research in West Africa" },
  { name: "Dr. Chukwuma Obi", role: "General Secretary", bio: "Sports medicine specialist and policy advocate" },
  { name: "Dr. Amina Bello", role: "Treasurer", bio: "Health economist specialising in sports healthcare" },
  { name: "Prof. Emeka Nwosu", role: "Scientific Chair", bio: "Leading researcher in tropical sports physiology" },
  { name: "Dr. Oluwaseun Adekunle", role: "Education Director", bio: "CPD programme architect and medical educator" },
  { name: "Dr. Hassan Musa", role: "PRO", bio: "Public health communications specialist" },
  { name: "Dr. Grace Okonkwo", role: "Women in Sport Lead", bio: "Advocate for female athlete health in Nigeria" },
];

const missionCards = [
  { title: "Our Mission", desc: "To advance the science, practice and education of sports and exercise medicine in Nigeria, ensuring every athlete and active individual has access to world-class care." },
  { title: "Our Vision", desc: "To be Africa's leading professional body for sports medicine, setting standards that rival global institutions while addressing the unique challenges of the Nigerian sporting landscape." },
  { title: "Our Values", desc: "Excellence in clinical practice, integrity in research, collaboration across disciplines, and unwavering commitment to athlete welfare and public health." },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader breadcrumb="HOME / ABOUT" title="About NASMED" subtitle="Nigeria's premier professional body for sports and exercise medicine" />

      {/* Mission */}
      <section className="bg-nasmed-off-white py-16 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="section-label justify-center text-center">Our Purpose</div>
          <h2 className="section-title text-center">Driving Sports Medicine Forward</h2>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 mt-12">
          {missionCards.map((c) => (
            <div key={c.title} className="bg-white rounded-[14px] p-8 border-t-4 border-nasmed-mid-blue shadow-md">
              <h3 className="font-heading text-xl text-nasmed-navy mb-3">{c.title}</h3>
              <p className="text-sm text-nasmed-text-muted leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={aboutImg} alt="NASMED Conference" className="w-full rounded-[14px] aspect-[4/3] object-cover shadow-2xl" loading="lazy" width={1280} height={960} />
            <div className="absolute -bottom-5 -right-5 bg-nasmed-navy text-white p-4 rounded-xl shadow-2xl text-center">
              <strong className="block text-[28px] font-bold text-nasmed-green-light">1988</strong>
              <span className="text-xs text-white/60">Year Founded</span>
            </div>
          </div>
          <div>
            <div className="section-label">Our Story</div>
            <h2 className="section-title">A Legacy of Excellence</h2>
            <p className="text-nasmed-text-muted text-base leading-relaxed mb-6">
              Founded in 1988, NASMED has grown from a small group of passionate physicians to Nigeria's foremost authority on sports and exercise medicine, with over 1,400 members across all 36 states.
            </p>
            <p className="text-nasmed-text-muted text-base leading-relaxed">
              We are affiliated with the International Federation of Sports Medicine (FIMS), the International Olympic Committee (IOC) Medical Commission, and work closely with the Nigerian Medical Association (NMA) and the Federal Ministry of Health.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="section-label">Leadership</div>
        <h2 className="section-title">National Executive Committee</h2>
        <p className="section-sub">Meet the team leading NASMED's mission to advance sports medicine in Nigeria.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {leaders.map((l) => (
            <div key={l.name} className="rounded-[14px] overflow-hidden border-[1.5px] border-nasmed-gray-light transition-all hover:shadow-xl hover:-translate-y-1 hover:border-nasmed-mid-blue">
              <div className="w-full aspect-square bg-gradient-to-br from-nasmed-blue to-nasmed-mid-blue flex items-center justify-center font-heading text-4xl font-bold text-white/40">
                {l.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="p-4">
                <div className="font-bold text-sm text-nasmed-navy mb-1">{l.name}</div>
                <div className="text-xs text-nasmed-green font-semibold tracking-wide mb-2">{l.role}</div>
                <div className="text-xs text-nasmed-text-muted leading-relaxed">{l.bio}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
