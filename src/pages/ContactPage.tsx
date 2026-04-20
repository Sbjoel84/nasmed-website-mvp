import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      toast.success("Message sent! We will respond within 2 business days.");
    }, 1400);
  };

  return (
    <div>
      <PageHeader breadcrumb="HOME / CONTACT" title="Contact NASMED" subtitle="Get in touch with our national secretariat or reach us through your state chapter" />

      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <div>
            <div className="section-label">Get In Touch</div>
            <h2 className="section-title">We're Here to Help</h2>

            {[
              { icon: "📍", title: "Head Office", desc: "NASMED National Secretariat,\nAbuja, Federal Capital Territory, Nigeria" },
              { icon: "📧", title: "Email", desc: "info@nasmed.org.ng\nsecretary@nasmed.org.ng\nregistration@nasmed.org.ng" },
              { icon: "📞", title: "Phone", desc: "+234 802 325 3372\ +234 703 075 1474" },
              { icon: "🕐", title: "Office Hours", desc: "Monday – Friday: 9:00am – 5:00pm\nSaturday: 10:00am – 2:00pm" },
              { icon: "📍", title: "Head Office", desc: "Abuja FCT, Nigeria" },
            ].map(c => (
              <div key={c.title + c.desc} className="flex gap-4 py-5 border-b border-nasmed-gray-light">
                <div className="w-11 h-11 rounded-[10px] bg-nasmed-mid-blue/10 flex items-center justify-center text-xl shrink-0">{c.icon}</div>
                <div>
                  <h4 className="text-sm font-semibold text-nasmed-navy mb-1">{c.title}</h4>
                  <p className="text-sm text-nasmed-text-muted whitespace-pre-line">{c.desc}</p>
                </div>
              </div>
            ))}

            {/* Affiliate badges */}
            <div className="mt-7">
              <div className="text-xs font-bold text-nasmed-gray tracking-[1px] uppercase mb-3">Affiliated With</div>
              <div className="flex gap-2 flex-wrap">
                {["FIMS", "NOC Nigeria", "African Union of Sports Medicine", "CAC Registered"].map(a => (
                  <span key={a} className="bg-nasmed-gray-light text-nasmed-text-muted text-[11px] font-bold py-1.5 px-3 rounded">{a}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-nasmed-off-white rounded-2xl p-10">
            <h3 className="font-heading text-2xl text-nasmed-navy mb-2">Send Us a Message</h3>
            <p className="text-nasmed-text-muted text-sm mb-5">We typically respond within 2 business days.</p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Full Name <span className="text-red-600">*</span></label>
                <input type="text" placeholder="Your full name" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Email Address <span className="text-red-600">*</span></label>
                <input type="email" placeholder="your@email.com" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Subject</label>
                <select className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors">
                  <option>General Enquiry</option>
                  <option>Membership</option>
                  <option>Publications</option>
                  <option>Events & Conferences</option>
                  <option>Partnership / Sponsorship</option>
                  <option>Media</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Message <span className="text-red-600">*</span></label>
                <textarea placeholder="How can we help you?" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors min-h-[130px] resize-y" />
              </div>
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="bg-nasmed-green text-white border-none py-3.5 px-10 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all disabled:opacity-70"
              >
                {sending ? "Sending..." : "Send Message →"}
              </button>
              {success && (
                <div className="bg-nasmed-green/10 border border-nasmed-green/30 rounded-lg py-3.5 px-4 text-[13px] text-nasmed-green font-semibold">
                  ✓ Message sent! We will respond within 2 business days.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
