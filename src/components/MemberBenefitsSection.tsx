import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Stethoscope,
  FlaskConical,
  Users,
  Globe,
  Scale,
  Award,
  Layers,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import MemberBenefitCard from "./MemberBenefitCard";

interface Props {
  onBecomeMember: () => void;
  onViewPlans: () => void;
}

const BENEFITS = [
  {
    icon: BookOpen,
    title: "Continuous Learning",
    points: [
      "Attend trainings, workshops, and seminars",
      "Stay updated with global sports medicine practices",
    ],
    colorFrom: "from-nasmed-mid-blue",
    colorTo: "to-blue-600",
  },
  {
    icon: Stethoscope,
    title: "Professional Practice",
    points: [
      "Work with athletes and teams at the highest level",
      "Prevent injuries and support rehabilitation",
    ],
    colorFrom: "from-nasmed-green",
    colorTo: "to-emerald-600",
  },
  {
    icon: FlaskConical,
    title: "Research & Publications",
    points: [
      "Conduct impactful sports medicine research",
      "Publish articles in recognised journals",
    ],
    colorFrom: "from-purple-600",
    colorTo: "to-purple-500",
  },
  {
    icon: Users,
    title: "Networking & Collaboration",
    points: [
      "Connect with fellow professionals across Nigeria",
      "Collaborate on projects and share knowledge",
    ],
    colorFrom: "from-amber-600",
    colorTo: "to-amber-500",
  },
  {
    icon: Globe,
    title: "Conferences & Events",
    points: [
      "Participate in national and international events",
      "Present research and attend congresses",
    ],
    colorFrom: "from-cyan-600",
    colorTo: "to-cyan-500",
  },
  {
    icon: Scale,
    title: "Policy & Advocacy",
    points: [
      "Contribute to sports health policies in Nigeria",
      "Influence national strategies and standards",
    ],
    colorFrom: "from-red-600",
    colorTo: "to-rose-500",
  },
  {
    icon: Award,
    title: "Membership Benefits",
    points: [
      "Access exclusive journals and clinical resources",
      "Gain professional recognition and credentials",
    ],
    colorFrom: "from-nasmed-navy",
    colorTo: "to-nasmed-mid-blue",
  },
  {
    icon: Layers,
    title: "Flexible Membership Plans",
    points: [
      "Choose from Student, Associate, Individual, or Fellow tiers",
      "International membership available for diaspora professionals",
    ],
    colorFrom: "from-emerald-700",
    colorTo: "to-emerald-500",
  },
];

const STATS = [
  { value: "42+", label: "Founding Members" },
  { value: "36", label: "States Represented" },
  { value: "35+", label: "Years of Excellence" },
  { value: "5", label: "Membership Tiers" },
];

export default function MemberBenefitsSection({ onBecomeMember, onViewPlans }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span className="inline-block bg-nasmed-green/15 text-nasmed-green text-[11px] font-bold tracking-[2px] uppercase py-1.5 px-4 rounded-full mb-4">
            Member Value
          </span>
          <h2 className="font-heading text-nasmed-navy font-bold leading-tight mb-4"
            style={{ fontSize: "clamp(26px, 3.5vw, 40px)" }}>
            Why Become a NASMED Member?
          </h2>
          <p className="text-nasmed-text-muted text-[15px] leading-relaxed max-w-[580px] mx-auto">
            Join a network of professionals advancing sports medicine, research, and athlete performance in Nigeria.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {BENEFITS.map((benefit, i) => (
            <MemberBenefitCard
              key={benefit.title}
              icon={benefit.icon}
              title={benefit.title}
              points={benefit.points}
              index={i}
              visible={visible}
              colorFrom={benefit.colorFrom}
              colorTo={benefit.colorTo}
            />
          ))}
        </div>

        {/* Stats strip */}
        <div
          className="bg-gradient-to-br from-nasmed-navy via-[#163060] to-[#0d2044] rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-0 mb-12 overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: `opacity 0.6s ease 640ms, transform 0.6s ease 640ms`,
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-8 px-6 text-center ${i < STATS.length - 1 ? "border-r border-white/10" : ""} ${i >= 2 ? "border-t border-white/10 md:border-t-0" : ""}`}
            >
              <div className="font-heading text-[36px] font-bold text-nasmed-green-light leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-white/55 text-[13px]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div
          className="text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: `opacity 0.6s ease 720ms, transform 0.6s ease 720ms`,
          }}
        >
          <h3 className="font-heading text-[26px] font-bold text-nasmed-navy mb-2">
            Ready to Join NASMED?
          </h3>
          <p className="text-nasmed-text-muted text-[14px] mb-8 max-w-[420px] mx-auto leading-relaxed">
            Take the first step towards a distinguished career in sports medicine. Applications are open year-round.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onBecomeMember}
              className="inline-flex items-center gap-2 bg-nasmed-green text-white border-none py-3.5 px-8 rounded-xl text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all shadow-lg shadow-nasmed-green/25 hover:shadow-nasmed-green/40 hover:-translate-y-0.5"
            >
              Become a Member <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onViewPlans}
              className="inline-flex items-center gap-2 bg-transparent text-nasmed-navy border-2 border-nasmed-navy py-3.5 px-8 rounded-xl text-[15px] font-semibold cursor-pointer hover:bg-nasmed-navy hover:text-white transition-all hover:-translate-y-0.5"
            >
              View Membership Plans <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
