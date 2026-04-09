import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

const nigerianStates = [
  "Abuja (FCT)", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const benefits = [
  { icon: "🎓", title: "Professional Development", desc: "Access accredited CPD programmes, workshops, and certification courses to stay at the forefront of sports medicine.", tags: ["CPD", "Workshops", "Certification"], gradient: "from-nasmed-mid-blue to-nasmed-blue" },
  { icon: "📰", title: "Publications & Research", desc: "Full access to the Nigerian Journal of Sports Medicine, research databases, and peer-reviewed publications.", tags: ["Journals", "Research", "Databases"], gradient: "from-nasmed-green to-emerald-700" },
  { icon: "🌍", title: "Networking & Community", desc: "Connect with 1,400+ sports medicine professionals across Nigeria and internationally through events and forums.", tags: ["Events", "Forums", "Contacts"], gradient: "from-purple-700 to-purple-500" },
  { icon: "📣", title: "Advocacy & Representation", desc: "Benefit from a unified voice that advocates for members' interests and works to influence policy and industry standards.", tags: ["Policy", "Lobbying", "Standards"], gradient: "from-amber-700 to-amber-500" },
  { icon: "🏷️", title: "Discounted Services & Events", desc: "Enjoy exclusive discounts on seminars, certification programmes, and professional events.", tags: ["Discounts", "Seminars", "Savings"], gradient: "from-red-600 to-red-400" },
  { icon: "💼", title: "Career Support", desc: "Access mentorship programmes, career counselling, and job placement services.", tags: ["Mentorship", "Counselling", "Placement"], gradient: "from-cyan-700 to-cyan-500" },
  { icon: "🏅", title: "Recognition & Awards", desc: "Get recognised for your contributions through award programmes and public acknowledgements.", tags: ["Awards", "Recognition", "Profile"], gradient: "from-emerald-800 to-emerald-600" },
];

export default function MembershipPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "", mobile: "", email: "", email2: "", state: "", category: "",
    ref1Name: "", ref1Email: "", ref1Mobile: "",
    ref2Name: "", ref2Email: "", ref2Mobile: "",
    statement: "", agreed: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.category) {
      toast.error("Please complete all required fields.");
      setStep(1);
      return;
    }
    if (!formData.agreed) {
      toast.error("Please agree to the declarations before submitting.");
      setStep(1);
      return;
    }
    toast.success("Application submitted successfully!");
    setStep(5); // success state
  };

  const wordCount = formData.statement.trim().split(/\s+/).filter(w => w).length;

  return (
    <div>
      <PageHeader breadcrumb="HOME / MEMBERSHIP" title="Membership" subtitle="Join NASMED and become part of Nigeria's leading sports medicine community" />

      {/* Benefits CTA Banner */}
      <section className="bg-gradient-to-br from-nasmed-navy via-[#163060] to-[#0d2044] py-16 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(13,153,102,0.18),transparent_70%)]" />
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-[1]">
          <div>
            <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-xs font-bold tracking-[1.5px] uppercase py-1.5 px-4 rounded-full mb-5">Member Benefits</span>
            <h2 className="font-heading text-white font-bold leading-tight mb-4" style={{ fontSize: 'clamp(24px, 3vw, 38px)' }}>
              Why Join NASMED?
            </h2>
            <p className="text-white/65 text-[15px] leading-relaxed">Unlock a world of professional growth, research access, and collaborative opportunities.</p>
          </div>
          <div className="flex flex-col gap-3.5">
            {["Access to peer-reviewed research & journals", "Accredited CPD programmes nationwide", "International networking opportunities", "Professional recognition & career support"].map((c) => (
              <div key={c} className="flex items-center gap-3 text-white/85 text-[15px]">
                <span className="w-7 h-7 rounded-full bg-nasmed-green text-white flex items-center justify-center text-[13px] font-bold shrink-0">✓</span>
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="bg-nasmed-off-white py-20 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl overflow-hidden shadow-md border border-nasmed-gray-light transition-all hover:-translate-y-1.5 hover:shadow-xl flex flex-col">
                <div className={`p-7 flex items-center justify-center bg-gradient-to-br ${b.gradient}`}>
                  <span className="text-4xl drop-shadow-lg">{b.icon}</span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-heading text-[17px] font-bold text-nasmed-navy mb-2.5 leading-snug">{b.title}</h3>
                  <p className="text-[13px] text-nasmed-text-muted leading-relaxed flex-1 mb-4">{b.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {b.tags.map((t) => (
                      <span key={t} className="bg-nasmed-gray-light text-nasmed-text-muted text-[11px] font-semibold py-0.5 px-2.5 rounded-full tracking-wide">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {/* Impact CTA card */}
            <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue rounded-2xl overflow-hidden shadow-xl flex flex-col items-center justify-center p-8 text-center">
              <div className="text-[44px] mb-3.5">🎯</div>
              <h3 className="text-white font-heading text-xl mb-3">Your Impact Starts Here</h3>
              <p className="text-white/70 text-[13px] leading-relaxed mb-5">Become a Member Today and join the leading community of professionals.</p>
              <button onClick={() => document.getElementById('app-form')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary border-none">Become a Member →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="bg-nasmed-navy py-10 px-6 md:px-12 grid grid-cols-2 md:grid-cols-4">
        {[
          { num: "7", label: "Core Member Benefits" },
          { num: "1,400+", label: "Active Members Nationwide" },
          { num: "36", label: "States Represented" },
          { num: "35+", label: "Years of Excellence" },
        ].map((s, i) => (
          <div key={i} className={`text-center px-5 ${i < 3 ? "border-r border-white/10" : ""}`}>
            <div className="font-heading text-4xl font-bold text-nasmed-green-light leading-none mb-1.5">{s.num}</div>
            <div className="text-white/50 text-[13px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* APPLICATION FORM */}
      <section className="bg-nasmed-off-white py-16 px-6 md:px-12" id="app-form">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Apply Online</div>
            <h2 className="section-title text-center">NASMED Membership Application Form 2025</h2>
            <p className="text-nasmed-text-muted text-[15px] leading-relaxed max-w-[700px] mx-auto">
              Membership in NASMED is based on professional recognition. The National Executive Committee (EXCO) decides on all membership applications.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-10 gap-0">
            {["Contact Details", "Qualifications", "Eligibility", "Review & Submit"].map((label, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => i + 1 <= step && setStep(i + 1)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[15px] border-2 transition-all ${
                    i + 1 === step ? "bg-nasmed-mid-blue text-white border-nasmed-mid-blue" :
                    i + 1 < step ? "bg-nasmed-green text-white border-nasmed-green" :
                    "bg-nasmed-gray-light text-nasmed-gray border-nasmed-gray-light"
                  }`}>
                    {i + 1 < step ? "✓" : ["A", "B", "C", "✓"][i]}
                  </div>
                  <span className={`text-xs font-semibold tracking-wide hidden md:block ${i + 1 <= step ? "text-nasmed-navy" : "text-nasmed-gray"}`}>{label}</span>
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 mx-2 mb-5 max-w-[80px] transition-colors ${i + 1 < step ? "bg-nasmed-green" : "bg-nasmed-gray-light"}`} />}
              </div>
            ))}
          </div>

          {step === 5 ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
              <div className="text-6xl mb-5">✅</div>
              <h2 className="font-heading text-nasmed-navy text-[28px] mb-3">Application Submitted!</h2>
              <p className="text-nasmed-text-muted text-[15px] leading-relaxed max-w-[480px] mx-auto mb-7">
                Thank you <strong>{formData.fullName}</strong>. Your NASMED membership application has been received and will be reviewed within <strong>5-10 business days</strong>.
              </p>
              <p className="text-nasmed-text-muted text-[13px]">A confirmation will be sent to <strong>{formData.email}</strong>.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-blue p-7">
                <span className="inline-block bg-nasmed-green/30 text-nasmed-green-light text-[11px] font-bold tracking-[2px] uppercase py-1 px-3 rounded mb-3">
                  Section {["A", "B", "C", "Review"][step - 1]}
                </span>
                <h3 className="text-white font-heading text-[22px] mb-1.5">
                  {["Contact Details & General Statement", "Educational Qualifications", "Executive Eligibility", "Review & Submit"][step - 1]}
                </h3>
                <p className="text-white/65 text-[13px]">
                  {["To be completed by all applicants", "Maximum 50 points in this category", "For Executive Pathway applicants", "Please review your information"][step - 1]}
                </p>
              </div>

              <div className="p-9">
                {step === 1 && (
                  <div className="space-y-6">
                    <h4 className="text-[15px] font-bold text-nasmed-navy pb-2.5 border-b-2 border-nasmed-gray-light">1. Candidate Contact Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="col-span-full flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-nasmed-navy">Full Name <span className="text-red-600">*</span></label>
                        <input type="text" value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="e.g. Dr. John Adebayo" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-nasmed-navy">Mobile Number <span className="text-red-600">*</span></label>
                        <input type="tel" value={formData.mobile} onChange={e => updateField('mobile', e.target.value)} placeholder="+234 xxx xxx xxxx" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-nasmed-navy">Email <span className="text-red-600">*</span></label>
                        <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="your@email.com" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-nasmed-navy">State of Practice <span className="text-red-600">*</span></label>
                        <select value={formData.state} onChange={e => updateField('state', e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors">
                          <option value="">— Select State —</option>
                          {nigerianStates.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-nasmed-navy">Membership Category <span className="text-red-600">*</span></label>
                        <select value={formData.category} onChange={e => updateField('category', e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors">
                          <option value="">— Select Category —</option>
                          <option>Associate Member</option>
                          <option>Professional Member</option>
                          <option>Fellow (FNASMED)</option>
                          <option>Honorary Member</option>
                        </select>
                      </div>
                    </div>

                    <h4 className="text-[15px] font-bold text-nasmed-navy pb-2.5 border-b-2 border-nasmed-gray-light mt-8">2. Candidate Statement</h4>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-nasmed-navy">Professional Statement <span className="text-red-600">*</span></label>
                      <textarea value={formData.statement} onChange={e => updateField('statement', e.target.value)} rows={5} placeholder="Describe your contribution to sports medicine..." className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors resize-y" />
                      <div className={`text-right text-xs ${wordCount > 200 ? "text-red-600" : "text-nasmed-gray"}`}>{wordCount} / 200 words</div>
                    </div>

                    <div className="bg-nasmed-mid-blue/5 border border-nasmed-mid-blue/15 rounded-xl p-6 mt-6">
                      <h4 className="text-nasmed-navy text-sm font-bold mb-3.5">Signed Declaration</h4>
                      <label className="flex items-start gap-2.5 text-[13px] text-nasmed-text-muted cursor-pointer font-bold">
                        <input type="checkbox" checked={formData.agreed} onChange={e => updateField('agreed', e.target.checked)} className="w-4 h-4 mt-0.5 accent-nasmed-green" />
                        <span className="text-nasmed-navy text-sm">Yes, I agree with all declarations and confirm information is accurate.</span>
                      </label>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="bg-nasmed-green/5 border border-nasmed-green/20 rounded-lg p-4 text-[13px] text-nasmed-text-muted leading-relaxed">
                      <strong>Eligible Fields:</strong> Clinical medicine, dentistry, pharmacy, nursing; Allied medical disciplines; Physiotherapy; Health & Physical Education; Occupational & Rehabilitation practitioners.
                    </div>
                    <h4 className="text-[15px] font-bold text-nasmed-navy pb-2.5 border-b-2 border-nasmed-gray-light">B1 — Higher Education Qualifications</h4>
                    <p className="text-[13px] text-nasmed-text-muted">Enter your qualifications, awarding institution, and year. Maximum 50 points total.</p>
                    {["Unit of Study (3pts)", "Associate Degree (5pts)", "Bachelor's Degree (10pts)", "Master's Degree (30pts)", "Doctorate (40pts)"].map((q) => (
                      <div key={q} className="flex gap-3 items-start bg-nasmed-off-white p-4 rounded-lg border border-nasmed-gray-light">
                        <div className="flex-[3] text-[13px] font-semibold text-nasmed-navy">{q}</div>
                        <textarea className="flex-[3] py-2 px-2.5 border-[1.5px] border-nasmed-gray-light rounded-md text-[13px] resize-y outline-none focus:border-nasmed-mid-blue" rows={2} placeholder="Institution, qualification, year..." />
                        <input type="number" className="w-[60px] py-2 border-[1.5px] border-nasmed-gray-light rounded-md text-sm font-bold text-center outline-none focus:border-nasmed-green" min={0} placeholder="0" />
                      </div>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-nasmed-green/5 border border-nasmed-green/20 rounded-lg p-4 text-[13px] text-nasmed-text-muted leading-relaxed">
                      <strong>Associate Members:</strong> Exclusive to organisations in eligible sports medicine fields.<br />
                      <strong>Honorary Members:</strong> By appointment for persons who have rendered exceptional services.
                    </div>
                    <h4 className="text-[15px] font-bold text-nasmed-navy pb-2.5 border-b-2 border-nasmed-gray-light">1. Place of Work / Organisation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="col-span-full flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-nasmed-navy">Organisation Name</label>
                        <input type="text" placeholder="Hospital, clinic, institution, or sports organisation" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-nasmed-navy">Your Job Title / Role</label>
                        <input type="text" placeholder="e.g. Chief Sports Physician" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-nasmed-navy">Organisation Type</label>
                        <select className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors">
                          <option value="">— Select Type —</option>
                          <option>Hospital / Clinic</option>
                          <option>Academic / Research Institution</option>
                          <option>Sports Organisation</option>
                          <option>Ministry of Health</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-4">
                      <label className="text-[13px] font-semibold text-nasmed-navy">Supporting Statement (optional)</label>
                      <textarea rows={4} placeholder="Provide any additional context..." className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors resize-y" />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="bg-nasmed-off-white border border-nasmed-gray-light rounded-[10px] p-5">
                      <h4 className="text-[13px] font-bold text-nasmed-mid-blue tracking-wide uppercase mb-3 pb-2 border-b border-nasmed-gray-light">Section A — Contact Details</h4>
                      {[
                        ["Full Name", formData.fullName],
                        ["Email", formData.email],
                        ["Mobile", formData.mobile],
                        ["State", formData.state],
                        ["Category", formData.category],
                      ].map(([label, value]) => (
                        <div key={label} className="flex gap-4 text-[13px] mb-2">
                          <span className="text-nasmed-gray min-w-[140px]">{label}:</span>
                          <span className="text-nasmed-text font-medium">{value || "—"}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-nasmed-green/5 border border-nasmed-green/25 rounded-xl p-6 mt-7">
                      <h4 className="text-nasmed-green text-sm font-bold mb-3">✓ Final Confirmation</h4>
                      <p className="text-[13px] text-nasmed-text-muted leading-relaxed">By clicking "Submit Application" you confirm that all information provided is accurate and you agree to all declarations.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Nav buttons */}
              <div className="flex items-center justify-between p-5 bg-nasmed-off-white border-t border-nasmed-gray-light">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className="bg-transparent text-nasmed-text-muted border-[1.5px] border-nasmed-gray-light py-3 px-6 rounded-lg text-sm font-semibold cursor-pointer hover:border-nasmed-mid-blue hover:text-nasmed-mid-blue transition-all">← Back</button>
                ) : <div />}
                {step < 4 ? (
                  <button onClick={() => setStep(step + 1)} className="bg-nasmed-mid-blue text-white border-none py-3 px-7 rounded-lg text-sm font-semibold cursor-pointer hover:bg-accent transition-all">
                    Next →
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="bg-nasmed-green text-white border-none py-3.5 px-11 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all">Submit Application →</button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
