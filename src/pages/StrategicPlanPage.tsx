import { useState } from "react";
import PageHeader from "@/components/PageHeader";

const tableOfContents = [
  { id: "preface", label: "1. Preface" },
  { id: "executive-summary", label: "2. Executive Summary" },
  { id: "sem-nigeria", label: "3. Sports And Exercise Medicine (SEM) In Nigeria" },
  { id: "swot", label: "4. SWOT Analysis of NASMED" },
  { id: "themes", label: "5. Thematic Focus" },
  { id: "implementation", label: "6. Implementation Arrangement" },
];

const thematicAreas = [
  {
    id: 1,
    title: "Influence the development of SEM policies, guides, SOP and inclusion in relevant national policies",
    strategicObjective: "To influence the development of SEM policies",
    rationale: "The National SEM policy will provide the national sporting community with another critical government initiative to promote physical activity and sports participation. It aims to increase the treatment and prevention of sports and exercise injuries and the management of sports injuries involving athletes and the general population participating in sports and recreational activities, improving their overall health and well-being.",
    keyResults: [
      "The National SEM policies, Sports Medical Services guidelines, and SOPs are developed.",
      "The national SEM environment is enhanced.",
    ],
    activities: [
      "Establish an expert panel to draft, review, and recommend SEM policies and guidelines.",
      "Ongoing broad Stakeholder engagement (Design targeted stakeholder reference and working group on SEM policies, etc.).",
      "Establish mechanisms for ongoing broad stakeholder engagement beyond government to involve the private sector, development partners, civil society, and citizens.",
      "Conduct high-level advocacy for state and non-state actors on identified gaps.",
      "Strengthen ties with governmental bodies to ensure SEM is a priority in national health agendas.",
      "Continuous advocacy, communication, and education for decision-makers on SEM policies.",
      "Working with relevant stakeholders, develop appropriate SEM policies, Sports Medical Services guidelines, and SOPs.",
      "Publish developed policies, guides, etc., on the NASMED website.",
    ],
    indicators: ["No. of SEM policies developed", "No. of SEM training institutions established", "No. of SEM facilities per state."],
  },
  {
    id: 2,
    title: "Mobilise membership and resources for implementing NASMED programmes",
    strategicObjectives: [
      "To increase NASMED membership, targeting a diverse range of SEM professionals.",
      "To improve the SEM skills, knowledge and competencies of members.",
      "To promote and conduct annual research on all aspects of SEM.",
      "To promote and support the establishment of NASMED state chapters and SEM activities at the state level.",
      "To secure funding through grants, sponsorships, and partnerships to support NASMED's programmes.",
      "To foster a strong community among members through regular networking events and collaborative projects.",
      "To promote teamwork early among the students before becoming professionals.",
      "To augment pre-service training through student participation in the Association's educational and other activities.",
      "To ensure the continuance and sustenance of the Association.",
    ],
    rationale: "The Association must provide strong leadership in SEM advocacy, educational programs, certification and lifelong learning. This is due to the low SEM skills, knowledge and competencies among the current workforce and limited training and training centres on SEM in the country.",
    keyResults: [
      "Increase in size and the right mix of technically competent SEM workforce in Nigeria at the national and state level",
      "Improved awareness of SEM among the workforce and citizens",
      "Improved Association's knowledge base through research and accurate dissemination of knowledge and information",
      "Create an influential Association with improved performance and improved results.",
    ],
    activities: [
      "Create and demonstrate personal value addition membership benefits for NASMED to attract new and retain old members.",
      "Establish ease of registration for membership in NASMED by digitisation.",
      "Develop digital and papered ICE materials on NASMED membership.",
      "Develop SEM training standards, curriculum for undergraduate and post-graduate levels with relevant institutions.",
      "Conduct monthly and quarterly SEM training and provide short courses.",
      "Establish SEM advocacy programmes.",
      "Establish state chapters of the Association.",
      "Ensure the inclusion of different membership fees for the different SEM professional categories in the constitution review.",
      "Ensure the inclusion of student (undergraduate and postgraduate) membership categories in the constitution review.",
      "Facilitate international exchange programmes and networking for members.",
      "Foster a strong sense of community among members through regular networking events.",
      "Ensure standing committee members are comprised of various professional categories in NASMED.",
      "Review and explore sources of funds that align with SEM development and practice.",
      "Establish innovative financing and incentive mechanisms.",
      "Set up a NASMED investment portfolio and management structure.",
    ],
    indicators: [
      "No. of SEM professionals in Nigeria by cadre by sex per state",
      "No. of awareness campaigns conducted",
      "No. of Research conducted by NASMED",
      "No. of State chapters established",
      "No. of partnerships established",
    ],
  },
  {
    id: 3,
    title: "Prioritise establishing SEM career pathways and recognition of SEM practitioners at all levels",
    strategicObjectives: [
      "To create clear and structured career pathways for SEM practitioners.",
      "To develop certification programs to validate and enhance the skills of SEM professionals.",
      "To advocate for recognising SEM professionals within the healthcare and sports sectors.",
    ],
    rationale: "The current workforce service scheme does not include SEM career paths. Recognition must be provided for recruiting professionals into public and private sector positions.",
    keyResults: [
      "Improved SEM adoption in Nigeria.",
      "SEM's knowledgeable membership base in the association is enhanced.",
      "SEM career pathway is generated.",
      "SEM professionals are recognised in the public and private sectors.",
      "Retention of SEM practitioners is enhanced.",
    ],
    activities: [
      "Mainstreaming women and younger professionals' participation in NASMED.",
      "Engage and consult with stakeholder references on establishing SEM career pathways.",
      "Develop SEM awareness campaign strategy and roll-out.",
      "Facilitate the inclusion of SEM professionals in the scheme of service at all levels.",
      "Conduct high-level advocacy to ensure Federations have a medical and anti-doping commission/committee.",
      "Conduct high-level advocacy to ensure SEM practitioners chair Federation Medical and Anti-doping Commission.",
      "Facilitate developing and implementing health insurance packages for the sports industry.",
      "Facilitate a PPP arrangement to establish the Nigeria Olympic Medical Center.",
      "Facilitate a PPP arrangement to establish a National Sports Science and Sports Medicine Institute.",
      "Conduct annual recognition and awards for individuals/organisations that support SEM growth.",
    ],
    indicators: [
      "No. of technically competent human resources for SEM available to practice in Nigeria",
      "SEM Career pathway established",
      "No. of SEM professionals recognised",
      "SEM practitioner's retention rate per cadre per institution",
    ],
  },
  {
    id: 4,
    title: "Achieve the objectives of NASMED with accountability",
    strategicObjectives: [
      "Establish clear, measurable objectives aligned with NASMED's mission and vision.",
      "Implement robust monitoring and evaluation systems to track progress and impact.",
      "To ensure transparency through regular reporting on activities, achievements, and financials.",
    ],
    rationale: "Generate feedback from NASMED activities and use the reports to reprogram the administration and programmes of NASMED.",
    keyResults: [
      "Enhanced stewardship and accountability at all levels.",
      "Improved governance of NASMED.",
    ],
    activities: [
      "Implement robust monitoring and evaluation systems to track progress and impact.",
      "Ensure transparency through regular reporting on activities, achievements, and financials.",
    ],
    indicators: [
      "NASMED Monitoring and evaluation framework established",
      "No. of Reports on EXCO and NASMED activities per year",
    ],
  },
  {
    id: 5,
    title: "A comprehensive framework for capacity building and fellowship programmes",
    strategicObjectives: [
      "To offer comprehensive training programs, workshops, and seminars to build the capacity of SEM professionals.",
      "To develop fellowship programs that provide advanced training, research opportunities, and professional development.",
      "To establish mentorship networks to support the professional growth of emerging SEM practitioners.",
    ],
    rationale: "To provide and support Pre-service and In-service training in SEM and produce an adequately trained SEM workforce.",
    keyResults: [
      "Pre-service and In-service training in SEM is established.",
      "Mentorship network and Fellowship programme established.",
    ],
    activities: [
      "Advocacy programs on establishing Pre-service and In-service training in SEM.",
      "Assess the SEM readiness of stakeholders.",
      "Define SEM professional practice standards.",
      "Facilitate the development of a strategy for continued SEM skills and competency acquisition.",
      "Design SEM skills and competencies career progression plan.",
      "Develop a standard SEM competency framework and define new accreditation requirements.",
      "Implement SEM accreditation requirements.",
      "Identify education and training course changes.",
      "Review academic programmes to include SEM professional courses.",
      "Implement education and training course changes.",
      "Establish specialised SEM qualifications and certification track.",
    ],
    indicators: [
      "No. of Pre-service training conducted per year",
      "No. of In-service training conducted per year",
      "No. of Mentees and mentors enrolled in the NASMED mentorship network",
      "NASMED Fellowship established",
    ],
  },
  {
    id: 6,
    title: "Transparency in governance and technology to drive innovation and growth of NASMED",
    strategicObjectives: [
      "To uphold high governance standards, ensuring transparency, accountability, and ethical conduct.",
      "To leverage technology to drive innovation in SEM practices and NASMED operations.",
      "To create digital platforms for member engagement, resource sharing, and continuous learning.",
    ],
    rationale: "Technology adoption is widespread in sports medicine and benefits performance, injury prevention, management, and organisational efficiency.",
    keyResults: [
      "Enhanced organisational efficiency at all levels.",
      "Improved usage of technology in SEM practice.",
    ],
    activities: [
      "Establish a sub-committee on Technology in SEM.",
      "Promote the adoption of technology in SEM practice.",
      "Digitalisation of NASMED operations at all levels.",
    ],
    indicators: [
      "Technology in SEM Standing Committee established",
      "No. of SEM facilities/practices using technology to provide services",
      "No. of SEM practitioners using technology to provide services",
    ],
  },
];

const swotAnalysis = {
  strengths: [
    "Availability of diverse SEM skills, knowledge and Competencies among members",
    "The Association comprises of medical and allied health professional categories",
    "The Association's Board of Trustees comprises thought leaders in SEM",
  ],
  weaknesses: [
    "Absence of State chapters",
    "Lack of coordination of student membership across the health sciences institutions",
    "Low participation of women and younger professionals in NASMED",
    "Lack of welfare programme for members",
    "Weak income generation",
    "Lack of professional membership categories (Fellowship)",
    "Widespread apathy among SEM professionals due to low activity in the past years",
  ],
  opportunities: [
    "Networking within national and international SEM communities (affiliates of Nigeria Olympic Committee, UAMS and FIMS)",
    "Lack of defined career pathway in the scheme of service, resulting in under-deployment of SEM professionals at all levels",
    "Federations do not have medical and scientific commissions/committees in their management structure",
  ],
  threats: [
    "Lack of country-level policy on developing and practising Sports and Exercise Medicine (SEM)",
    "Inadequate SEM infrastructure",
    "Lack of SEM research grants and dearth of literature on SEM and SEM workforce requirements in Nigeria",
    "Lack of national financing mechanisms for SEM implementation and SEM education",
    "Inadequate SEM educational training centres",
    "Low SEM awareness and knowledge among the workforce and the citizens",
    "Lack of Sports specific health care plan packages for athletes across all Sports",
  ],
};

export default function StrategicPlanPage() {
  const [activeSection, setActiveSection] = useState("preface");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div>
      <PageHeader
        breadcrumb="HOME / STRATEGIC PLAN"
        title="IMPACT Programme 2024-2028"
        subtitle="Nigeria Association of Sports Medicine Strategic Plan"
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          {/* Sidebar - Table of Contents */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-[14px] p-6 border border-nasmed-gray-light shadow-sm">
              <h3 className="font-heading text-nasmed-navy text-lg mb-4 flex items-center gap-2">
                <span className="text-nasmed-green">📋</span> Contents
              </h3>
              <nav className="flex flex-col gap-1">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left py-2 px-3 rounded-lg text-[13px] font-medium transition-all ${
                      activeSection === item.id
                        ? "bg-nasmed-mid-blue text-white"
                        : "text-nasmed-text-muted hover:bg-nasmed-off-white hover:text-nasmed-navy"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t border-nasmed-gray-light">
                <div className="text-[11px] font-bold tracking-[1.5px] text-nasmed-text-muted uppercase mb-3">Download</div>
                <a
                  href="/NASMED Strategic Plan 2024-2028_IMPACT PROGRAMME.pdf"
                  download
                  className="block w-full bg-nasmed-green text-white py-2.5 px-4 rounded-lg text-[13px] font-semibold hover:bg-nasmed-green-light transition-all text-center"
                >
                  📥 Download PDF
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            {/* 1. Preface */}
            <section id="preface" className="scroll-mt-24">
              <div className="section-label">Strategic Plan</div>
              <h2 className="section-title mb-8">1. Preface</h2>
              <div className="bg-nasmed-off-white rounded-[14px] p-8 border-l-4 border-nasmed-green">
                <h3 className="font-heading text-xl text-nasmed-navy mb-4">About NASMED</h3>
                <p className="text-nasmed-text-muted leading-relaxed text-base mb-6">
                  The <strong>NIGERIA ASSOCIATION OF SPORTS MEDICINE</strong>, known by its acronym "NASMED", is an autonomous, non-political, non-religious, non-racial and non-profit-making association. The Association's secretariat is domiciled in FCT, and the Liaison office is in Lagos State.
                </p>
                <p className="text-nasmed-text-muted leading-relaxed text-base mb-6">
                  NASMED vision is to use evidence-based medical and scientific knowledge to improve athletic performance and provide comprehensive medical care across the broad spectrum of recreational and professional athletes. It primarily affiliates with the <strong>Nigerian Olympic Committee (NOC)</strong>, the <strong>International Federation of Sports Medicine (FIMS)</strong>, the <strong>African Union of Sports Medicine</strong> and other regional, continental and international organisations dedicated to improving sports through medicine and related fields of science.
                </p>
                <p className="text-nasmed-text-muted leading-relaxed text-base">
                  The Association was founded in <strong>November 1994</strong> as an organisation of professionals in sports medicine that have realised the need to keep abreast with global trends in athlete care. In November 1994, the Association was registered as a non-profit Organisation by the Corporate Affairs Commission (CAC) as <strong>NIGERIA ASSOCIATION OF SPORTS MEDICINE (NASMED) Incorporated</strong>.
                </p>
              </div>
            </section>

            {/* 2. Executive Summary */}
            <section id="executive-summary" className="scroll-mt-24">
              <h2 className="section-title mb-8">2. Executive Summary</h2>
              <div className="space-y-6">
                <p className="text-nasmed-text-muted leading-relaxed text-base">
                  The Nigeria Association of Sports Medicine (NASMED) is a non-governmental and not-for-profit Association, an affiliate of the Nigeria Olympic Committee, the International Federation of Sports Medicine (FIMS), Switzerland and the African Union of Sports Medicine, Egypt, whose interests are in sports and exercise medicine development.
                </p>
                <p className="text-nasmed-text-muted leading-relaxed text-base">
                  Sports Medicine (or Sports and Exercise Medicine) has come a long way in Nigeria since the 1970s. The sports medicine practice and activities were coordinated under the state sports councils while domiciled in the National Sports Commission (NSC) or Sports Ministry. This selection arrangement was discontinued in 1994 during the quadrennial reconstitution and selection of members of various National Sports Associations.
                </p>
                <p className="text-nasmed-text-muted leading-relaxed text-base">
                  The government consequently delisted the Sports Medicine Association of Nigeria (SMAN) from its sponsored Sports Associations. This development propelled the medical professionals with training and a particular interest in promoting the practice of sports medicine as a subspeciality to come together to form a distinct professional association encompassing all areas of medicine and allied groups.
                </p>
                
                {/* IMPACT Programme Highlights */}
                <div className="bg-gradient-to-r from-nasmed-navy to-nasmed-mid-blue rounded-[14px] p-8 mt-8">
                  <h3 className="text-white font-heading text-xl mb-6 text-center">The IMPACT Programme</h3>
                  <p className="text-white/80 text-center mb-8">The following six thematic areas have been developed to achieve the IMPACT programme:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { num: "01", title: "SEM Policy Advocacy" },
                      { num: "02", title: "Membership & Resources" },
                      { num: "03", title: "Career Pathways" },
                      { num: "04", title: "Accountability" },
                      { num: "05", title: "Capacity Building" },
                      { num: "06", title: "Governance & Tech" },
                    ].map((item) => (
                      <div
                        key={item.num}
                        className="bg-white/10 backdrop-blur rounded-lg p-4 text-center border border-white/20 hover:bg-white/20 transition-all"
                      >
                        <div className="text-nasmed-green-light font-bold text-2xl mb-2">{item.num}</div>
                        <div className="text-white text-sm font-medium">{item.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Sports and Exercise Medicine in Nigeria */}
            <section id="sem-nigeria" className="scroll-mt-24">
              <h2 className="section-title mb-8">3. Sports And Exercise Medicine (SEM) In Nigeria</h2>
              
              {/* Current State */}
              <div className="mb-10">
                <h3 className="font-heading text-xl text-nasmed-navy mb-6">Current State of SEM in Nigeria</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-[14px] p-6 border border-nasmed-gray-light shadow-sm">
                    <div className="w-12 h-12 bg-nasmed-mid-blue/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🏥</span>
                    </div>
                    <h4 className="font-bold text-nasmed-navy mb-2">Healthcare Infrastructure</h4>
                    <p className="text-sm text-nasmed-text-muted">
                      Training of sports medicine specialists in Nigeria is limited, with few institutions offering comprehensive programs. The University of Lagos, University of Ibadan, and University of Ilorin provide relevant programs.
                    </p>
                  </div>
                  <div className="bg-white rounded-[14px] p-6 border border-nasmed-gray-light shadow-sm">
                    <div className="w-12 h-12 bg-nasmed-green/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🏃</span>
                    </div>
                    <h4 className="font-bold text-nasmed-navy mb-2">Sports Injuries & Rehabilitation</h4>
                    <p className="text-sm text-nasmed-text-muted">
                      Injuries range from minor sprains to severe fractures. The rehabilitation infrastructure is often inadequate, with many athletes relying on general practitioners rather than specialists.
                    </p>
                  </div>
                  <div className="bg-white rounded-[14px] p-6 border border-nasmed-gray-light shadow-sm">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🩺</span>
                    </div>
                    <h4 className="font-bold text-nasmed-navy mb-2">Exercise & Public Health</h4>
                    <p className="text-sm text-nasmed-text-muted">
                      Government initiatives like the National Health Policy promote physical activity, but lack of widespread exercise facilities and awareness campaigns limits the impact.
                    </p>
                  </div>
                </div>
              </div>

              {/* Challenges */}
              <div className="mb-10">
                <h3 className="font-heading text-xl text-nasmed-navy mb-6">Challenges Facing SEM in Nigeria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-[14px] p-6 border border-red-200">
                    <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                      <span>⚠️</span> Limited Research & Funding
                    </h4>
                    <p className="text-sm text-red-800">
                      Funding for SEM is often insufficient, affecting both research and practical applications. Many sports organisations and healthcare institutions struggle with financial constraints.
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-[14px] p-6 border border-amber-200">
                    <h4 className="font-bold text-amber-700 mb-4 flex items-center gap-2">
                      <span>🔍</span> Lack of Awareness
                    </h4>
                    <p className="text-sm text-amber-800">
                      Many view sports injuries as minor issues that can be managed with basic first aid rather than conditions requiring specialised care.
                    </p>
                  </div>
                </div>
              </div>

              {/* Prospects */}
              <div>
                <h3 className="font-heading text-xl text-nasmed-navy mb-6">Prospects & Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-nasmed-green/5 rounded-[14px] p-6 border border-nasmed-green/20">
                    <div className="text-nasmed-green font-bold text-lg mb-3">01</div>
                    <h4 className="font-bold text-nasmed-navy mb-2">Education & Training</h4>
                    <p className="text-sm text-nasmed-text-muted">
                      Expanding educational opportunities in SEM and establishing dedicated sports medicine programs with international partnerships.
                    </p>
                  </div>
                  <div className="bg-nasmed-green/5 rounded-[14px] p-6 border border-nasmed-green/20">
                    <div className="text-nasmed-green font-bold text-lg mb-3">02</div>
                    <h4 className="font-bold text-nasmed-navy mb-2">Infrastructure Investment</h4>
                    <p className="text-sm text-nasmed-text-muted">
                      Increasing investment in sports and exercise facilities to significantly improve access to SEM services in both government and private sectors.
                    </p>
                  </div>
                  <div className="bg-nasmed-green/5 rounded-[14px] p-6 border border-nasmed-green/20">
                    <div className="text-nasmed-green font-bold text-lg mb-3">03</div>
                    <h4 className="font-bold text-nasmed-navy mb-2">Public Awareness</h4>
                    <p className="text-sm text-nasmed-text-muted">
                      Public health campaigns emphasising benefits of regular exercise and proper injury management through collaborations with government and media.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. SWOT Analysis */}
            <section id="swot" className="scroll-mt-24">
              <h2 className="section-title mb-8">4. SWOT Analysis of NASMED</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Internal - Strengths */}
                <div className="bg-nasmed-green/5 rounded-[14px] p-6 border border-nasmed-green/20">
                  <h3 className="font-heading text-lg text-nasmed-green font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-nasmed-green rounded-full flex items-center justify-center text-white text-sm">S</span>
                    STRENGTHS
                  </h3>
                  <ul className="space-y-3">
                    {swotAnalysis.strengths.map((item, i) => (
                      <li key={i} className="text-sm text-nasmed-navy flex items-start gap-2">
                        <span className="text-nasmed-green mt-1">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Internal - Weaknesses */}
                <div className="bg-red-50 rounded-[14px] p-6 border border-red-200">
                  <h3 className="font-heading text-lg text-red-600 font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">W</span>
                    WEAKNESSES
                  </h3>
                  <ul className="space-y-3">
                    {swotAnalysis.weaknesses.map((item, i) => (
                      <li key={i} className="text-sm text-nasmed-navy flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* External - Opportunities */}
                <div className="bg-nasmed-mid-blue/5 rounded-[14px] p-6 border border-nasmed-mid-blue/20">
                  <h3 className="font-heading text-lg text-nasmed-mid-blue font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-nasmed-mid-blue rounded-full flex items-center justify-center text-white text-sm">O</span>
                    OPPORTUNITIES
                  </h3>
                  <ul className="space-y-3">
                    {swotAnalysis.opportunities.map((item, i) => (
                      <li key={i} className="text-sm text-nasmed-navy flex items-start gap-2">
                        <span className="text-nasmed-mid-blue mt-1">★</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* External - Threats */}
                <div className="bg-amber-50 rounded-[14px] p-6 border border-amber-200">
                  <h3 className="font-heading text-lg text-amber-600 font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm">T</span>
                    THREATS
                  </h3>
                  <ul className="space-y-3">
                    {swotAnalysis.threats.map((item, i) => (
                      <li key={i} className="text-sm text-nasmed-navy flex items-start gap-2">
                        <span className="text-amber-500 mt-1">⚠</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. Thematic Focus */}
            <section id="themes" className="scroll-mt-24">
              <h2 className="section-title mb-8">5. Thematic Focus</h2>
              <p className="text-nasmed-text-muted text-base mb-10">
                The following six thematic areas have been developed to achieve the IMPACT programme:
              </p>

              <div className="space-y-8">
                {thematicAreas.map((theme) => (
                  <div
                    key={theme.id}
                    className="bg-white rounded-[14px] border border-nasmed-gray-light shadow-sm overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-nasmed-navy px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-nasmed-green rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {theme.id}
                        </div>
                        <h3 className="text-white font-heading text-lg">{theme.title}</h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {theme.strategicObjective && (
                        <div className="mb-4">
                          <span className="text-xs font-bold tracking-[1.5px] text-nasmed-green uppercase">Strategic Objective</span>
                          <p className="text-nasmed-navy font-medium mt-1">{theme.strategicObjective}</p>
                        </div>
                      )}

                      {theme.strategicObjectives && (
                        <div className="mb-4">
                          <span className="text-xs font-bold tracking-[1.5px] text-nasmed-green uppercase">Strategic Objectives</span>
                          <ul className="mt-2 space-y-1">
                            {theme.strategicObjectives.map((obj, i) => (
                              <li key={i} className="text-nasmed-navy text-sm flex items-start gap-2">
                                <span className="text-nasmed-green mt-1">•</span>
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {theme.rationale && (
                        <div className="mb-4">
                          <span className="text-xs font-bold tracking-[1.5px] text-nasmed-mid-blue uppercase">Rationale</span>
                          <p className="text-nasmed-text-muted text-sm mt-1">{theme.rationale}</p>
                        </div>
                      )}

                      {/* Key Results */}
                      {theme.keyResults && (
                        <div className="mb-4">
                          <span className="text-xs font-bold tracking-[1.5px] text-nasmed-green uppercase mb-2 block">Key Results</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {theme.keyResults.map((kr, i) => (
                              <div key={i} className="bg-nasmed-off-white rounded-lg p-3 text-sm text-nasmed-navy">
                                <span className="text-nasmed-green font-bold mr-2">{i + 1}.</span>
                                {kr}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Activities */}
                      {theme.activities && (
                        <div className="mb-4">
                          <span className="text-xs font-bold tracking-[1.5px] text-nasmed-mid-blue uppercase mb-2 block">Activities</span>
                          <div className="space-y-2">
                            {theme.activities.map((act, i) => (
                              <div key={i} className="flex items-start gap-3 text-sm text-nasmed-text-muted">
                                <span className="w-6 h-6 bg-nasmed-mid-blue/10 rounded-full flex items-center justify-center text-nasmed-mid-blue text-xs font-bold shrink-0">
                                  {i + 1}
                                </span>
                                {act}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Indicators */}
                      {theme.indicators && (
                        <div className="mt-4 pt-4 border-t border-nasmed-gray-light">
                          <span className="text-xs font-bold tracking-[1.5px] text-nasmed-text-muted uppercase mb-2 block">Key Indicators</span>
                          <div className="flex flex-wrap gap-2">
                            {theme.indicators.map((ind, i) => (
                              <span
                                key={i}
                                className="bg-nasmed-off-white text-nasmed-navy text-xs px-3 py-1.5 rounded-full border border-nasmed-gray-light"
                              >
                                {ind}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Implementation Arrangement */}
            <section id="implementation" className="scroll-mt-24">
              <h2 className="section-title mb-8">6. Implementation Arrangement</h2>

              {/* Governance */}
              <div className="bg-nasmed-navy rounded-[14px] p-8 mb-8">
                <h3 className="text-white font-heading text-xl mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-nasmed-green rounded-full flex items-center justify-center">🏛</span>
                  Governance
                </h3>
                <p className="text-white/80 leading-relaxed">
                  To achieve this plan, the Association's National Executive Committee (EXCO) will work closely with the Standing Committees to ensure its implementation. The Marketing and Communications Committee will coordinate the mobilisation of resources and the NASMED secretariat. The Chairman of the committee is the first Vice-President of NASMED. The Standing Committees will meet every month face-to-face or electronically. The committee shall report and submit a quarterly report to the EXCO.
                </p>
              </div>

              {/* Financing */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-[14px] p-8 mb-8">
                <h3 className="text-white font-heading text-xl mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">💰</span>
                  Financing
                </h3>
                <p className="text-white/90 leading-relaxed">
                  Financing the Association's activities is a major challenge, but with this plan, stakeholders will understand the association's work and support areas that align with their priorities for developing SEM. Financing the plan will require additional resources, but the plan will be distributed widely for donors and sponsors to review. Resources mobilized will be used strictly to implement the IMPACT programme.
                </p>
              </div>

              {/* Monitoring & Evaluation */}
              <div className="bg-nasmed-green rounded-[14px] p-8">
                <h3 className="text-white font-heading text-xl mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">📊</span>
                  Monitoring and Evaluation
                </h3>
                <p className="text-white/90 leading-relaxed">
                  A monitoring and evaluation framework will be developed to track the implementation and ensure the results are achieved. The Key performance indicators should be monitored and reported quarterly and annually. Such reports shall be distributed widely. In years 2 and 4, a mid- and end-term strategy implementation evaluation will be conducted. These evaluations will focus on the implementation process, and the knowledge generated will be used to improve it.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}