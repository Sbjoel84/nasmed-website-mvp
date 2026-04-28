import type { LucideIcon } from "lucide-react";

interface MemberBenefitCardProps {
  icon: LucideIcon;
  title: string;
  points: string[];
  index: number;
  visible: boolean;
  colorFrom: string;
  colorTo: string;
}

export default function MemberBenefitCard({
  icon: Icon,
  title,
  points,
  index,
  visible,
  colorFrom,
  colorTo,
}: MemberBenefitCardProps) {
  return (
    <div
      className="group bg-white rounded-2xl p-6 border border-nasmed-gray-light shadow-sm
        hover:shadow-xl hover:-translate-y-1.5 hover:border-transparent
        transition-all duration-300 flex flex-col gap-4 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.55s ease ${index * 75}ms, transform 0.55s ease ${index * 75}ms, box-shadow 0.25s ease, border-color 0.25s ease`,
      }}
    >
      {/* Icon container */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${colorFrom} ${colorTo}
          shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-6 h-6 text-white" strokeWidth={1.75} />
      </div>

      {/* Title */}
      <h3 className="font-heading text-[16px] font-bold text-nasmed-navy leading-snug">
        {title}
      </h3>

      {/* Bullet points */}
      <ul className="flex flex-col gap-1.5">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2 text-[13px] text-nasmed-text-muted leading-relaxed">
            <span className="mt-[3px] w-4 h-4 shrink-0 rounded-full bg-nasmed-green/15 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-nasmed-green" fill="currentColor" viewBox="0 0 8 8">
                <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
              </svg>
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
