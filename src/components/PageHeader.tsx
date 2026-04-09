export default function PageHeader({ breadcrumb, title, subtitle }: { breadcrumb: string; title: string; subtitle: string }) {
  return (
    <div className="page-header">
      <div className="text-white/40 text-[13px] tracking-wide mb-3">{breadcrumb}</div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
