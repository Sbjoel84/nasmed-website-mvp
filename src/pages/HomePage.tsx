import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";
import swearingIn from "@/assets/swearing-in.jpg";
import cacHandover from "@/assets/cac-handover.jpg";
import aboutImg from "@/assets/cac-handover.jpg";
import supabase from "@/lib/supabaseClient";
import newsService, { NewsPost, NewsEvent } from "@/services/newsService";

const heroSlides = [
  { image: hero1, title: "Advancing <em>Sports Medicine</em> Across Nigeria", sub: "The premier professional body uniting physicians, physiotherapists, scientists and allied health professionals dedicated to sports and exercise medicine excellence." },
  { image: hero2, title: "Building <em>Healthier Athletes</em>, Stronger Communities", sub: "Pioneering research, education and clinical practice in sports medicine to elevate athletic performance and public health outcomes across Africa." },
  { image: hero3, title: "Shaping the <em>Future</em> of Exercise Medicine", sub: "Join 1,400+ professionals committed to evidence-based practice, continuing education, and advancing the science of human movement and performance." },
  { image: hero4, title: "Professional <em>Collaboration</em> & Leadership", sub: "NASMED leaders working together to advance sports medicine standards, policies, and professional development across Nigeria." },
  { image: hero5, title: "Expert <em>Mentorship</em> & Guidance", sub: "Experienced practitioners sharing knowledge and guiding the next generation of sports medicine professionals in Nigeria." },
  { image: swearingIn, title: "A New Era of <em>Leadership</em>", sub: "The swearing-in of NASMED's new executive committee, committed to taking the Association to greater heights." },
  { image: cacHandover, title: "<em>Official Recognition</em> & Incorporation", sub: "NASMED's CAC certificate handover — a milestone in the Association's journey as a registered professional body in Nigeria." },
];

const categoryIcon: Record<string, string> = {
  conference: "🏛️",
  research: "🔬",
  update: "📋",
  governance: "📋",
  milestones: "🏆",
};

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [liveNews, setLiveNews] = useState<NewsPost[]>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<NewsEvent | null>(null);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "member")
      .eq("status", "active")
      .then(({ count }) => { if (count !== null) setMemberCount(count); })
      .catch(() => {});

    newsService.getAllPosts()
      .then(posts => setLiveNews(posts.slice(0, 3)))
      .catch(() => {});

    newsService.getAllEvents()
      .then(evts => { if (evts.length > 0) setUpcomingEvent(evts[0]); })
      .catch(() => {});
  }, []);

  const stats = [
    { num: memberCount !== null ? `${memberCount.toLocaleString()}+` : "1,400+", label: "Active Members" },
    { num: "36", label: "States Covered" },
    { num: "35+", label: "Years of Excellence" },
    { num: "200+", label: "Events Held" },
  ];

  return (
    <div>
      {/* HERO */}
      <section id="hero" className="relative h-screen min-h-[640px] flex items-center overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ${i === activeSlide ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,18,38,0.88)] via-[rgba(10,22,40,0.6)] to-[rgba(8,18,38,0.3)]" />
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-[2] max-w-[780px] px-6 md:px-12" style={{ animation: 'heroUp 1.2s ease both' }}>
          <div className="inline-flex items-center gap-2 bg-nasmed-green/20 border border-nasmed-green/35 text-nasmed-green-light py-1.5 px-4 rounded-full text-xs font-semibold tracking-[1.5px] uppercase mb-7">
            <span className="text-[8px]" style={{ animation: 'pulse-dot 2s infinite' }}>●</span>
            Established 1994
          </div>
          <h1
            className="font-heading text-white font-bold leading-[1.12] mb-6 [&>em]:text-nasmed-green-light [&>em]:not-italic"
            style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}
            dangerouslySetInnerHTML={{ __html: heroSlides[activeSlide].title }}
          />
          <p className="text-white/70 text-[17px] leading-relaxed max-w-[600px] mb-10 font-light">
            {heroSlides[activeSlide].sub}
          </p>
          <div className="flex gap-4 flex-wrap mb-11">
            <Link to="/membership" className="btn-primary">Become a Member →</Link>
            <Link to="/about" className="btn-outline-hero">Explore NASMED</Link>
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <span className="text-white/45 text-[11px] tracking-[1.5px] uppercase">Affiliated With</span>
            <div className="flex gap-3 flex-wrap items-center">
              {["/affiliate%20(1).png", "/affiliate%20(2).png", "/affiliate%20(3).png"].map((src, i) => (
                <div key={i} className="w-11 h-11 rounded-full bg-white border-2 border-white/30 overflow-hidden flex items-center justify-center shadow-md">
                  <img src={src} alt={`Affiliate ${i + 1}`} className="w-full h-full object-contain p-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 md:left-12 z-[3] flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              title={`Go to slide ${i + 1}`}
              onClick={() => setActiveSlide(i)}
              className={`h-[3px] rounded transition-all cursor-pointer border-none ${i === activeSlide ? "w-12 bg-nasmed-green-light" : "w-7 bg-white/30"}`}
            />
          ))}
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-nasmed-navy py-7 px-6 md:px-12 grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className={`text-center px-5 ${i < stats.length - 1 ? "border-r border-white/10" : ""}`}>
            <div className="font-heading text-[34px] font-bold text-nasmed-green-light leading-none mb-1.5">{stat.num}</div>
            <div className="text-white/50 text-[13px]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* UPCOMING EVENT BANNER */}
      {upcomingEvent && (
        <section className="py-16 px-6 md:px-12 bg-gradient-to-br from-nasmed-navy via-[#0d2558] to-nasmed-mid-blue">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <div className="flex gap-2 flex-wrap mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-nasmed-green/20 border border-nasmed-green/35 text-nasmed-green-light py-1 px-3 rounded-full text-[11px] font-bold tracking-[1.5px] uppercase">
                    <span className="text-[8px]" style={{ animation: 'pulse-dot 2s infinite' }}>●</span>
                    Upcoming Event
                  </span>
                  <span className="bg-white/10 border border-white/20 text-white/70 py-1 px-3 rounded-full text-[11px] font-semibold tracking-wide uppercase">
                    📹 {upcomingEvent.location}
                  </span>
                </div>

                <h2
                  className="font-heading text-white font-bold leading-tight mb-2"
                  style={{ fontSize: 'clamp(22px, 3vw, 38px)' }}
                >
                  {upcomingEvent.title}
                </h2>
                <p className="text-nasmed-green-light text-[13px] font-semibold uppercase tracking-[1.2px] mb-4">
                  Theme: Strengthening Sports Medicine Practice for Better Athlete Health &amp; Performance
                </p>
                <p className="text-white/70 text-[15px] leading-relaxed max-w-[640px] mb-6">
                  {upcomingEvent.description}
                </p>

                <div className="flex flex-wrap gap-5 text-white/60 text-[14px] mb-8">
                  {upcomingEvent.event_date && (
                    <span className="flex items-center gap-1.5">
                      📅 {new Date(upcomingEvent.event_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">📍 {upcomingEvent.location}</span>
                  <span className="flex items-center gap-1.5">🕐 Starts 12:30 PM</span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Link to="/news" className="btn-primary">Register Now →</Link>
                  <Link to="/news" className="btn-outline-hero">View Full Details</Link>
                </div>
              </div>

              {/* Date + fee cards */}
              <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[160px]">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 text-center flex-1 lg:flex-none">
                  <div className="text-nasmed-green-light text-[10px] font-bold tracking-[2px] uppercase mb-1">Date</div>
                  <div className="font-heading text-white font-bold leading-none" style={{ fontSize: 'clamp(32px, 4vw, 46px)' }}>
                    {upcomingEvent.day_label}
                  </div>
                  <div className="font-heading text-nasmed-green-light text-[18px] font-bold tracking-wide">
                    {upcomingEvent.month_label}
                  </div>
                  <div className="text-white/40 text-[13px] mt-0.5">
                    {upcomingEvent.event_date ? new Date(upcomingEvent.event_date).getFullYear() : ""}
                  </div>
                </div>
                <div className="bg-nasmed-green/20 border border-nasmed-green/40 rounded-xl p-4 text-center flex-1 lg:flex-none">
                  <div className="font-heading text-white text-[22px] font-bold">FREE</div>
                  <div className="text-white/55 text-[11px] mt-0.5 leading-snug">Paid-up<br className="hidden lg:block" /> Members</div>
                </div>
                {upcomingEvent.registration_fee > 0 && (
                  <div className="bg-white/8 border border-white/15 rounded-xl p-4 text-center flex-1 lg:flex-none">
                    <div className="font-heading text-white text-[22px] font-bold">
                      ₦{upcomingEvent.registration_fee.toLocaleString()}
                    </div>
                    <div className="text-white/55 text-[11px] mt-0.5 leading-snug">Non-dues-<br className="hidden lg:block" />paying</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT SECTION */}
      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={aboutImg} alt="About NASMED" className="w-full rounded-[14px] aspect-[4/3] object-cover shadow-2xl" />
            <div className="absolute -bottom-5 -right-5 bg-nasmed-navy text-white p-4 rounded-xl shadow-2xl text-center">
              <strong className="block text-[28px] font-bold text-nasmed-green-light">35+</strong>
              <span className="text-xs text-white/60">Years of Excellence</span>
            </div>
          </div>
          <div>
            <div className="section-label">About NASMED</div>
            <h2 className="section-title">Nigeria's Leading Authority in Sports & Exercise Medicine</h2>
            <p className="section-sub">
              Founded in 1988, the Nigeria Association of Sports Medicine (NASMED) is the premier professional body dedicated to advancing the science and practice of sports and exercise medicine across Nigeria and Africa.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8">
              {[
                { icon: "🔬", title: "Research & Innovation", desc: "Driving cutting-edge sports medicine research" },
                { icon: "🎓", title: "Education & Training", desc: "Professional development programmes" },
                { icon: "🤝", title: "Collaboration", desc: "Partnerships across 36 states" },
                { icon: "🏥", title: "Clinical Excellence", desc: "Setting standards in athlete care" },
              ].map((p) => (
                <div key={p.title} className="bg-nasmed-off-white p-4 rounded-[10px] border-l-[3px] border-nasmed-green transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="text-[22px] mb-2">{p.icon}</div>
                  <h4 className="text-[13px] font-semibold text-nasmed-navy mb-1">{p.title}</h4>
                  <p className="text-xs text-nasmed-text-muted leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP CTA */}
      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto text-center">
        <div className="section-label">Membership</div>
        <h2 className="section-title">Join the NASMED Community</h2>
        <p className="section-sub">Choose a membership tier that matches your professional profile and career goals.</p>
        <Link to="/membership" className="btn-primary inline-block mt-4">View Plans & Register →</Link>
      </section>

      {/* NEWS */}
      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="section-label">Latest News</div>
        <h2 className="section-title">Stay Updated</h2>
        <p className="section-sub">The latest from NASMED — conferences, research, policy updates and professional development opportunities.</p>

        {liveNews.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-nasmed-gray-light bg-white h-52 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {liveNews.map(n => (
              <div key={n.id} className="rounded-xl overflow-hidden border border-nasmed-gray-light bg-white transition-all hover:shadow-xl hover:-translate-y-1">
                {n.image_url ? (
                  <div className="w-full aspect-video overflow-hidden">
                    <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-nasmed-navy to-nasmed-blue flex items-center justify-center text-white/30 text-5xl">
                    {categoryIcon[n.category] || "📰"}
                  </div>
                )}
                <div className="p-4">
                  <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-nasmed-green mb-2">{n.category_label}</div>
                  <h3 className="font-heading text-base font-bold text-nasmed-navy leading-snug mb-2">{n.title}</h3>
                  <p className="text-[13px] text-nasmed-text-muted leading-relaxed">{n.description}</p>
                </div>
                <div className="px-4 py-3 border-t border-nasmed-gray-light flex justify-between text-xs text-nasmed-gray">
                  <span>{n.date_label}</span><span>{n.read_time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DELIVERY / CTA */}
      <section className="bg-nasmed-navy py-20 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label" style={{ color: 'hsl(160, 72%, 39%)' }}>What We Deliver</div>
            <h2 className="font-heading text-white font-bold leading-tight mb-4" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              Comprehensive Support for Sports Medicine Professionals
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-[560px] mb-8">
              From evidence-based education to clinical practice support, NASMED provides the resources and network you need to excel.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "📚", title: "Continuing Education", desc: "Accredited CPD programmes and workshops" },
              { icon: "🔬", title: "Research Access", desc: "Nigerian Journal of Sports Medicine and research databases" },
              { icon: "🌍", title: "Global Network", desc: "Connections with FIMS, IOC, and international bodies" },
              { icon: "📋", title: "Clinical Guidelines", desc: "Evidence-based protocols for Nigerian sports settings" },
            ].map((f) => (
              <div key={f.title} className="bg-white/[0.06] border border-white/10 rounded-[10px] p-5 transition-colors hover:bg-white/10">
                <div className="text-[26px] mb-2.5">{f.icon}</div>
                <h4 className="text-white text-sm font-semibold mb-1">{f.title}</h4>
                <p className="text-white/50 text-[13px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
