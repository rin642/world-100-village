import type { ReactNode } from 'react';

interface SectionCardProps {
  id: string;
  sectionNumber: string;
  categoryLabel: string;
  title: string;
  badgeText?: string;
  badgeTone?: 'navy' | 'blue' | 'green' | 'amber' | 'slate';
  icon: ReactNode;
  children: ReactNode;
}

const BADGE_STYLES: Record<NonNullable<SectionCardProps['badgeTone']>, string> = {
  navy: 'bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/20',
  blue: 'bg-[#2b6cb0]/10 text-[#2b6cb0] border-[#2b6cb0]/20',
  green: 'bg-[#2f855a]/10 text-[#2f855a] border-[#2f855a]/20',
  amber: 'bg-amber-100/80 text-amber-900 border-amber-300',
  slate: 'bg-slate-200/80 text-slate-700 border-slate-300',
};

export function SectionCard({
  id,
  sectionNumber,
  categoryLabel,
  title,
  badgeText,
  badgeTone = 'navy',
  icon,
  children,
}: SectionCardProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 rounded-2xl border border-[#e5dfd0] bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-[#f0ebe0] pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1e3a5f] text-white shadow-xs">
            {icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-[#2b6cb0] uppercase">
                {sectionNumber}. {categoryLabel}
              </span>
              {badgeText && (
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${BADGE_STYLES[badgeTone]}`}
                >
                  {badgeText}
                </span>
              )}
            </div>
            <h2 className="mt-1 text-lg font-bold text-[#1e3a5f] sm:text-xl">
              {title}
            </h2>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}
