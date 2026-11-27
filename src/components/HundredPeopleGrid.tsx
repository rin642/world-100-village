import { useState } from 'react';
import { User } from 'lucide-react';
import type { StatCategoryItem } from '../types/statistics';

interface HundredPeopleGridProps {
  items: StatCategoryItem[];
  variant?: 'person' | 'dot';
  title?: string;
}

interface GridCell {
  index: number;
  item: StatCategoryItem;
}

export function HundredPeopleGrid({
  items,
  variant = 'person',
  title = '100人の村アイコン表示（1つ＝1人）',
}: HundredPeopleGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const cells: GridCell[] = [];
  for (const item of items) {
    for (let i = 0; i < item.per100Grid; i += 1) {
      if (cells.length < 100) {
        cells.push({ index: cells.length + 1, item });
      }
    }
  }

  return (
    <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-wide text-[#1e3a5f] sm:text-sm">
          {title}
        </p>
        <span className="text-xs text-[#526071]">
          合計 {cells.length}人分を表示（凡例をタップ・ホバーで強調）
        </span>
      </div>

      <div
        className="grid grid-cols-10 gap-1 sm:gap-1.5"
        role="img"
        aria-label={title}
      >
        {cells.map((cell) => {
          const isDimmed = activeId !== null && activeId !== cell.item.id;
          return (
            <div
              key={cell.index}
              title={`${cell.index}人目：${cell.item.label}（${cell.item.percentage}%）`}
              onMouseEnter={() => setActiveId(cell.item.id)}
              onMouseLeave={() => setActiveId(null)}
              className={`flex aspect-square items-center justify-center rounded-md transition-all duration-150 ${
                isDimmed ? 'opacity-25 scale-95' : 'opacity-100'
              }`}
              style={{
                backgroundColor:
                  variant === 'dot' ? cell.item.color : `${cell.item.color}18`,
                border: `1px solid ${cell.item.color}40`,
              }}
            >
              {variant === 'person' ? (
                <User
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  style={{ color: cell.item.color }}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              ) : (
                <span className="sr-only">{cell.item.label}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(isSelected ? null : item.id)}
              onMouseEnter={() => setActiveId(item.id)}
              onMouseLeave={() => setActiveId(null)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                isSelected
                  ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                  : 'border-[#e5dfd0] bg-white text-[#1e293b] hover:border-[#2b6cb0]'
              }`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="font-medium">{item.label}</span>
              <span className={isSelected ? 'text-white/90' : 'text-[#526071]'}>
                {item.per100Grid}人（{item.percentage}%）
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
