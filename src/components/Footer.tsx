import { Link } from "react-router-dom";
import logo from "@/assets/nasmed-logo.png";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-nasmed-navy text-white/70 pt-16 pb-7 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-11 pb-11 border-b border-white/10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="NASMED" className="w-14 h-14 rounded-full object-cover border-2 border-white/20 bg-white p-0.5" />
            <div>
              <strong className="text-white text-base font-bold block">NASMED</strong>
              <span className="text-white/45 text-[10px] tracking-[1.5px] uppercase">Nigeria Association of Sports Medicine</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-5">Promoting excellence in sports and exercise medicine across Nigeria and Africa since 1988. <em>Mens sana in corpore sano.</em></p>
          <div className="flex gap-2.5">
            {["in", "tw", "fb", "yt"].map((s) => (
              <a key={s} href="#" className="w-[34px] h-[34px] rounded-lg bg-white/10 flex items-center justify-center text-white/60 no-underline text-[13px] font-bold hover:bg-nasmed-green hover:text-white transition-all">{s}</a>
            ))}
          </div>
        </div>

        {/* Organisation */}
        <div>
          <h5 className="text-white text-[13px] font-semibold tracking-wide mb-4">Organisation</h5>
          <ul className="list-none flex flex-col gap-2.5">
            <li><Link to="/about" className="text-white/55 no-underline text-sm hover:text-nasmed-green-light transition-colors">About NASMED</Link></li>
            <li><Link to="/about" className="text-white/55 no-underline text-sm hover:text-nasmed-green-light transition-colors">Leadership Board</Link></li>
            <li><Link to="/about" className="text-white/55 no-underline text-sm hover:text-nasmed-green-light transition-colors">History</Link></li>
            <li><Link to="/contact" className="text-white/55 no-underline text-sm hover:text-nasmed-green-light transition-colors">Affiliations</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h5 className="text-white text-[13px] font-semibold tracking-wide mb-4">Resources</h5>
          <ul className="list-none flex flex-col gap-2.5">
            <li><Link to="/membership" className="text-white/55 no-underline text-sm hover:text-nasmed-green-light transition-colors">Join NASMED</Link></li>
            <li><Link to="/publications" className="text-white/55 no-underline text-sm hover:text-nasmed-green-light transition-colors">Publications</Link></li>
            <li><Link to="/store" className="text-white/55 no-underline text-sm hover:text-nasmed-green-light transition-colors">Store</Link></li>
            <li><Link to="/contact" className="text-white/55 no-underline text-sm hover:text-nasmed-green-light transition-colors">Events</Link></li>
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div>
          <h5 className="text-white text-[13px] font-semibold tracking-wide mb-4">Contact & Newsletter</h5>
          <ul className="list-none flex flex-col gap-2.5 mb-3.5">
            <li><a href="mailto:info@nasmed.org.ng" className="text-white/55 no-underline text-sm">info@nasmed.org.ng</a></li>
            <li><a href="mailto:secretary@nasmed.org.ng" className="text-white/55 no-underline text-sm">secretary@nasmed.org.ng</a></li>
            <li><span className="text-sm">+234 (0) 800 NASMED</span></li>
            <li><span className="text-sm">Abuja, FCT — Nigeria</span></li>
          </ul>
          <p className="text-xs text-white/35 mb-1.5">Subscribe for updates:</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-white/15 rounded-md py-2 px-3 text-white text-sm outline-none placeholder:text-white/35"
            />
            <button
              onClick={() => { toast.success("Subscribed successfully!"); setEmail(""); }}
              className="bg-nasmed-green text-white border-none py-2 px-4 rounded-md text-[13px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto mt-6 flex flex-col md:flex-row items-center justify-between text-[13px] text-white/30 gap-2">
        <span>© 2024 Nigeria Association of Sports Medicine (NASMED). All rights reserved.</span>
        <span>Registered with CAC, Nigeria</span>
      </div>
    </footer>
  );
}
