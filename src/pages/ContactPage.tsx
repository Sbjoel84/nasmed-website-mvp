import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

export default function ContactPage() {
  return (
    <div>
      <PageHeader breadcrumb="HOME / CONTACT" title="Contact Us" subtitle="Get in touch with the NASMED secretariat. We're here to help." />

      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <div>
            <div className="section-label">Get in Touch</div>
            <h2 className="section-title">We'd Love to Hear From You</h2>
            <p className="section-sub">Whether you have questions about membership, publications, or upcoming events — our team is ready to assist.</p>

            {[
              { icon: "📍", title: "Head Office", desc: "NASMED National Secretariat, Abuja, Federal Capital Territory, Nigeria" },
              { icon: "📧", title: "Email", desc: "info@nasmed.org.ng\nsecretary@nasmed.org.ng" },
              { icon: "📞", title: "Phone", desc: "+234 (0) 800 NASMED\n+234 803 000 0000" },
              { icon: "🕐", title: "Office Hours", desc: "Monday – Friday: 9:00am – 5:00pm\nSaturday: 10:00am – 2:00pm" },
            ].map((c) => (
              <div key={c.title} className="flex gap-4 py-5 border-b border-nasmed-gray-light">
                <div className="w-11 h-11 rounded-[10px] bg-nasmed-mid-blue/10 flex items-center justify-center text-xl shrink-0">{c.icon}</div>
                <div>
                  <h4 className="text-sm font-semibold text-nasmed-navy mb-1">{c.title}</h4>
                  <p className="text-sm text-nasmed-text-muted whitespace-pre-line">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-nasmed-off-white rounded-2xl p-10">
            <h3 className="font-heading text-2xl text-nasmed-navy mb-6">Send Us a Message</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Full Name</label>
                <input type="text" placeholder="Your full name" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Email Address</label>
                <input type="email" placeholder="your@email.com" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Subject</label>
                <select className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors">
                  <option>General Enquiry</option>
                  <option>Membership</option>
                  <option>Publications</option>
                  <option>Events</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Message</label>
                <textarea placeholder="How can we help you?" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue transition-colors min-h-[130px] resize-y" />
              </div>
              <button onClick={() => toast.success("Message sent! We will respond within 2 business days.")} className="bg-nasmed-green text-white border-none py-3.5 px-10 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
