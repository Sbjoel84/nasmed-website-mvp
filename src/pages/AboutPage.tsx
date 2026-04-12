import PageHeader from "@/components/PageHeader";
import aboutImg from "@/assets/about-img.jpg";
import leaderPresident from "@/assets/leader-president.jpg";
import leaderFunke from "@/assets/leader-funke.jpg";
import leaderChukwuemeka from "@/assets/leader-chukwuemeka.jpg";
import leaderTunde from "@/assets/leader-tunde.jpg";

const leaders = [
  { name: "Dr. Olajide Adebola", role: "President", bio: "Sports Medicine Physician and President of NASMED, championing athlete health and professional excellence across Nigeria.", image: leaderPresident },
  { name: "Dr. Funke Bakare", role: "Vice President", bio: "Distinguished sports medicine practitioner and NASMED Vice President, committed to advancing women in sports health.", image: leaderFunke },
  { name: "Dr. Chukwuemeka Eze", role: "Secretary General", bio: "Sports Physician and Secretary General overseeing NASMED's national secretariat and inter-state coordination.", image: leaderChukwuemeka },
  { name: "Dr. Tunde Oyelaran", role: "Director of Research", bio: "Orthopaedic Surgeon and Research Director spearheading evidence-based publications and academic programmes.", image: leaderTunde },
];

const missionCards = [
  { icon: "🎯", title: "Mission", desc: "To promote the health, safety and peak performance of all athletes through evidence-based sports medicine practice, research, education, and professional development. NASMED supports developing and implementing national sports medicine policies through advocacy, education, certification, and lifelong learning.", color: "border-nasmed-green" },
  { icon: "🌟", title: "Vision", desc: "To use evidence-based medical and scientific knowledge to improve athletic performance and provide comprehensive medical care across the broad spectrum of recreational and professional athletes — and to become Africa's leading sports medicine association recognised globally for research excellence.", color: "border-nasmed-mid-blue" },
  { icon: "⚖️", title: "Core Values", desc: "Integrity, Evidence-Based Practice, Interdisciplinary Collaboration, Continuous Learning, Athlete-Centred Care, and Service to the Nation. NASMED is rooted in fairness and equity — protecting physical and mental health and preventing doping in sport.", color: "border-amber-500" },
];

const timeline = [
  {
    year: "1970s", title: "Origins of Sports Medicine in Nigeria",
    content: "Sports Medicine in Nigeria dates back to the 1970s. Practice and activities were coordinated under state sports councils and domiciled in the National Sports Commission (NSC) or Sports Ministry. It was listed as one of the National Sports Associations — the Sports Medicine Association of Nigeria (SMAN) — which the Federal Government solely constituted to moderate and administer different sports disciplines at the national level.",
    content2: "Members were usually selected based on their voluntary services and professional contributions to various sports associations' programmes, specifically looking after athlete health during camping, local competitions, and international championships.",
  },
  {
    year: "1994", title: "Founding of NASMED",
    content: "This selection arrangement was discontinued in 1994 during the quadrennial reconstitution of various National Sports Associations. The government consequently delisted the Sports Medicine Association of Nigeria (SMAN) from its sponsored associations.",
    content2: "This propelled medical professionals with training and special interest in sports medicine to come together and form a distinct professional association encompassing all areas of medicine and allied groups — including exercise and basic sciences — to promote ethical, standardised, and scientific knowledge-based sports and exercise medicine.",
    content3: "A constitution drafting group was set up, and the draft constitution was adopted at the 1st General Assembly in November 1994. In November 1994, the Association was registered as a non-profit organisation by the Corporate Affairs Commission (CAC) as NIGERIA ASSOCIATION OF SPORTS MEDICINE (NASMED) Incorporated.",
  },
  {
    year: "1994–1997", title: "First Elected Executive Committee",
    content: "NASMED organised its first Elective General Assembly and Scientific Congress, where its first set of elected officers was constituted and sworn in:",
    exco: [
      { name: "Dr. B.O. Onabowale", role: "President" },
      { name: "Dr. Senbanjo", role: "1st Vice President" },
      { name: "Dr. Adegboyega Efunkoya", role: "2nd Vice President" },
      { name: "Dr. Nana Yesufu", role: "3rd Vice President" },
      { name: "Dr. William Boyd", role: "Secretary General" },
      { name: "Dr. Akinwumi K. Amao", role: "Asst. Secretary General" },
      { name: "Dr. T.A.A. Bashorun", role: "Treasurer" },
      { name: "Dr. Made Oyeniya", role: "Financial Secretary" },
      { name: "Mr. Olufemi Ayorinde", role: "Publicity Secretary" },
      { name: "Mallam Mohammed Soro", role: "Asst. Publicity Secretary" },
      { name: "Dr. Niran Adeniji", role: "Ex-Officio" },
      { name: "Mr. Efe Useh", role: "Ex-Officio" },
      { name: "Mrs. G.A. Ariyibi", role: "Ex-Officio" },
    ],
  },
  {
    year: "1997–2004", title: "Second General Assembly & Elective Congress",
    content: "The second General Assembly and Elective Congress was held in November 1997, with the following members elected into the Executive Committee:",
    exco: [
      { name: "Dr. Babatunde Onabowale", role: "President" },
      { name: "Prof. Olatunde Makanju", role: "1st Vice President" },
      { name: "Dr. Nana Yesufu", role: "2nd Vice President" },
      { name: "Dr. Rashed Gbadamosi", role: "3rd Vice President" },
      { name: "Dr. Akinwumi K. Amao", role: "Secretary General" },
      { name: "Dr. AbdulKadir Mu'Azu", role: "Asst. Secretary General" },
      { name: "Dr. T.A.A. Bashorun (Late)", role: "Treasurer" },
      { name: "Dr. Martin Unegbu", role: "Financial Secretary" },
      { name: "Pharm. Olufemi Ayorinde", role: "Publicity Secretary" },
      { name: "Mallam Mohammed Soro", role: "Asst. Publicity Secretary" },
      { name: "Mrs. A. Ariyibi", role: "Ex-Officio (Prin. Nurs. Off.)" },
      { name: "PT. Effe Useh", role: "Ex-Officio" },
      { name: "Dr. Niran Adeniji", role: "Ex-Officio" },
    ],
  },
  {
    year: "1994 — Board of Trustees", title: "First Board of Trustees (Incorporated Entity)",
    content: "The founding Board of Trustees of NASMED as an incorporated entity comprised distinguished leaders in Nigerian and international sports medicine:",
    bot: [
      { name: "Late Alhaji Raheem Adejumo", role: "Former President of NOC" },
      { name: "Late Dr. Simi Johnson", role: "NOC Member" },
      { name: "Late Justice Uche Omoh", role: "NOC Member" },
      { name: "Late General (Dr) Henry Adefowope", role: "IOC Member" },
    ],
  },
  {
    year: "2004–2022", title: "Period of Dormancy & Revitalisation Efforts",
    content: "There was a period of uncoordinated and diminished activity of NASMED from around 2004, when many principal executive members relocated due to their public official assignments. Meetings could not be held regularly, and this was compounded by the sudden death of our President in early 2005.",
    content2: "Several efforts were made to reorganise and reposition the Association, but they did not yield the needed traction. Two attempts were made between 2014 and 2015 to reactivate NASMED, with meetings held at Rowe Park attended by members from Lagos and Edo State.",
  },
  {
    year: "2022–2024", title: "Relaunch & New Era",
    content: "In August 2022, younger sports medicine enthusiasts energised the movement to act decisively. This culminated in the creation of NASMED WhatsApp social media platforms through which both old and new prospective members galvanised their thoughts and ideas, giving purposeful direction towards the relaunching of NASMED in June 2024 and the orderly transfer of authority to new executives committed to taking the Association to the next level.",
    isGreen: true,
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader breadcrumb="HOME / ABOUT" title="About NASMED" subtitle="Nigeria's premier professional body for sports and exercise medicine" />

      {/* About Content */}
      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={aboutImg} alt="NASMED Conference" className="w-full rounded-[14px] aspect-[4/3] object-cover shadow-2xl" loading="lazy" />
            <div className="absolute -bottom-5 -right-5 bg-nasmed-navy text-white p-4 rounded-xl shadow-2xl text-center">
              <strong className="block text-[28px] font-bold text-nasmed-green-light">1994</strong>
              <span className="text-xs text-white/60">Year Founded</span>
            </div>
          </div>
          <div>
            <div className="section-label">Our Story</div>
            <h2 className="section-title">A Legacy of Excellence</h2>
            <p className="text-nasmed-text-muted text-base leading-relaxed mb-6">
              Founded in 1994, the Nigeria Association of Sports Medicine (NASMED) has grown from a small group of passionate physicians to Nigeria's foremost authority on sports and exercise medicine, with members across all 36 states and the FCT.
            </p>
            <p className="text-nasmed-text-muted text-base leading-relaxed italic text-nasmed-mid-blue">
              "Mens sana in corpore sano" — A sound mind in a sound body.
            </p>
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <div className="bg-nasmed-navy py-10 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto flex items-center gap-8 flex-wrap">
          <div className="text-white/50 text-xs font-bold tracking-[2px] uppercase whitespace-nowrap">Affiliated With</div>
          <div className="flex gap-3.5 flex-wrap">
            {["Nigerian Olympic Committee (NOC)", "FIMS", "African Union of Sports Medicine", "Corporate Affairs Commission (CAC)"].map(a => (
              <div key={a} className="bg-white/10 border border-white/15 text-white/80 py-2 px-4 rounded-md text-[13px] font-semibold">{a}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Vision Values */}
      <section className="bg-nasmed-off-white py-16 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <div className="section-label justify-center text-center">Our Purpose</div>
            <h2 className="section-title text-center">Mission, Vision & Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {missionCards.map(c => (
              <div key={c.title} className={`bg-white rounded-[14px] p-8 border-t-4 ${c.color} shadow-md`}>
                <h3 className="font-heading text-xl text-nasmed-navy mb-3">{c.icon} {c.title}</h3>
                <p className="text-sm text-nasmed-text-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Timeline */}
      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="mb-12">
          <div className="section-label">Our Story</div>
          <h2 className="section-title">Historical Perspective of NASMED</h2>
        </div>

        <div className="flex flex-col relative">
          {timeline.map((item, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-0 md:gap-7">
              {/* Marker */}
              <div className="hidden md:flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full border-[3px] shadow-[0_0_0_4px_rgba(32,85,164,0.12)] shrink-0 mt-1.5 ${item.isGreen ? "bg-nasmed-green border-nasmed-green" : "bg-nasmed-mid-blue border-nasmed-mid-blue"}`} />
                {i < timeline.length - 1 && <div className="flex-1 w-0.5 bg-gradient-to-b from-nasmed-mid-blue to-nasmed-gray-light min-h-[40px] my-1.5" />}
              </div>
              {/* Content */}
              <div className="pb-12">
                <span className={`inline-block text-white text-xs font-bold tracking-[1px] py-1 px-3.5 rounded-full mb-3 ${item.isGreen ? "bg-nasmed-green" : "bg-nasmed-mid-blue"}`}>{item.year}</span>
                <h3 className="font-heading text-xl text-nasmed-navy mb-3">{item.title}</h3>
                <p className="text-sm text-nasmed-text-muted leading-relaxed">{item.content}</p>
                {item.content2 && <p className="text-sm text-nasmed-text-muted leading-relaxed mt-2.5">{item.content2}</p>}
                {item.content3 && <p className="text-sm text-nasmed-text-muted leading-relaxed mt-2.5"><strong>{item.content3}</strong></p>}
                {item.exco && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-4">
                    {item.exco.map(e => (
                      <div key={e.name} className="bg-white border border-nasmed-gray-light rounded-[10px] p-3.5 border-l-[3px] border-l-nasmed-mid-blue transition-all hover:shadow-md hover:-translate-y-0.5">
                        <div className="text-[13px] font-bold text-nasmed-navy mb-1 leading-snug">{e.name}</div>
                        <div className="text-[11px] text-nasmed-green font-semibold tracking-wide">{e.role}</div>
                      </div>
                    ))}
                  </div>
                )}
                {item.bot && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-4">
                    {item.bot.map(e => (
                      <div key={e.name} className="bg-white border border-nasmed-gray-light rounded-[10px] p-3.5 border-l-[3px] border-l-nasmed-green transition-all hover:shadow-md hover:-translate-y-0.5">
                        <div className="text-[13px] font-bold text-nasmed-navy mb-1 leading-snug">{e.name}</div>
                        <div className="text-[11px] text-nasmed-mid-blue font-semibold tracking-wide">{e.role}</div>
                      </div>
                    ))}
                  </div>
                )}
                {item.isGreen && (
                  <div className="mt-5 inline-flex items-center gap-2 bg-nasmed-green/10 border border-nasmed-green/30 text-nasmed-green py-2 px-4 rounded-lg text-[13px] font-semibold">
                    <span>●</span> NASMED Officially Relaunched — June 2024
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Current Leadership */}
      <section className="bg-nasmed-off-white py-20 px-6 md:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <div className="section-label justify-center text-center">Leadership</div>
            <h2 className="section-title text-center">Current National Executive Board (2024)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {leaders.map(l => (
              <div key={l.name} className="rounded-[14px] overflow-hidden border-[1.5px] border-nasmed-gray-light bg-white transition-all hover:shadow-xl hover:-translate-y-1 hover:border-nasmed-mid-blue">
                <div className="w-full aspect-square overflow-hidden">
                  <img src={l.image} alt={l.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-4">
                  <div className="font-bold text-sm text-nasmed-navy mb-1">{l.name}</div>
                  <div className="text-xs text-nasmed-green font-semibold tracking-wide mb-2">{l.role}</div>
                  <div className="text-xs text-nasmed-text-muted leading-relaxed">{l.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
