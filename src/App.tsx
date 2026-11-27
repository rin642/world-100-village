import { ArrowDown, Calendar, Globe, Users } from 'lucide-react';
import { CompareWithMe } from './components/CompareWithMe';
import { DashboardSections } from './components/DashboardSections';
import rawStatistics from './data/worldStatistics.json';
import type { WorldStatisticsData } from './types/statistics';

const statisticsData = rawStatistics as WorldStatisticsData;

const NAV_LINKS = [
  { href: '#population', label: '人口' },
  { href: '#income', label: '所得' },
  { href: '#health', label: '健康' },
  { href: '#education', label: '教育' },
  { href: '#information', label: '情報' },
  { href: '#religion', label: '宗教' },
  { href: '#language', label: '言語' },
  { href: '#compare', label: '自分と比較' },
];

export function App() {
  const { metadata } = statisticsData;

  return (
    <div className="min-h-screen bg-[#faf8f2] text-[#1e293b]">
      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-[#e5dfd0] bg-[#faf8f2]/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a
            href="#top"
            className="flex items-center gap-2 text-sm font-bold text-[#1e3a5f] sm:text-base"
          >
            <Globe className="h-5 w-5 text-[#2b6cb0]" aria-hidden="true" />
            <span>世界100人の村</span>
          </a>

          <nav
            aria-label="セクション移動"
            className="flex items-center gap-1 overflow-x-auto py-0.5 text-xs sm:gap-2 sm:text-sm"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full px-2.5 py-1 font-medium transition-colors ${
                  link.href === '#compare'
                    ? 'bg-[#2f855a] text-white hover:bg-[#276749]'
                    : 'text-[#334155] hover:bg-[#e5dfd0]/60 hover:text-[#1e3a5f]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* 1. トップ */}
        <section className="mb-10 rounded-3xl border border-[#e5dfd0] bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2b6cb0]/25 bg-[#2b6cb0]/10 px-3 py-1 text-xs font-semibold text-[#1e3a5f]">
                <span>01. インフォグラフィック・ダッシュボード</span>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1e3a5f] sm:text-4xl lg:text-5xl">
                {metadata.title}
              </h1>
              <p className="mt-3 text-base font-medium text-[#2b6cb0] sm:text-xl">
                {metadata.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                もし地球上に暮らす約83億人の人々を、そのまま比率を保って「100人の村」に縮小したら、どんな世界が見えるでしょうか。国連・世界銀行・WHO/UNICEF・UNESCO・ITU・Pew Research Centerなどの公的統計をもとに、村の姿を可視化しました。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-96">
              <div className="rounded-2xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#526071]">
                  <Calendar className="h-4 w-4 text-[#2b6cb0]" aria-hidden="true" />
                  <span>データ基準日</span>
                </div>
                <p className="mt-1.5 text-lg font-bold text-[#1e3a5f]">
                  {metadata.referenceDate}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#526071]">
                  <Users className="h-4 w-4 text-[#2f855a]" aria-hidden="true" />
                  <span>人口の基準年</span>
                </div>
                <p className="mt-1.5 text-lg font-bold text-[#1e3a5f]">
                  {metadata.populationBaseYear}年
                </p>
                <p className="mt-0.5 text-xs text-[#526071]">
                  {metadata.worldPopulationDisplay}
                </p>
              </div>
            </div>
          </div>

          {/* Highlight Pills */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#f0ebe0] pt-6 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl bg-[#faf8f2] p-3">
              <p className="text-xs text-[#526071]">アジアの住民</p>
              <p className="mt-1 text-lg font-bold text-[#1e3a5f]">約59人</p>
            </div>
            <div className="rounded-xl bg-[#faf8f2] p-3">
              <p className="text-xs text-[#526071]">1日$3未満</p>
              <p className="mt-1 text-lg font-bold text-[#1e3a5f]">約11人</p>
            </div>
            <div className="rounded-xl bg-[#faf8f2] p-3">
              <p className="text-xs text-[#526071]">安全な飲み水</p>
              <p className="mt-1 text-lg font-bold text-[#2b6cb0]">74人</p>
            </div>
            <div className="rounded-xl bg-[#faf8f2] p-3">
              <p className="text-xs text-[#526071]">15歳以上の識字</p>
              <p className="mt-1 text-lg font-bold text-[#2f855a]">約88人</p>
            </div>
            <div className="rounded-xl bg-[#faf8f2] p-3">
              <p className="text-xs text-[#526071]">ネット利用者</p>
              <p className="mt-1 text-lg font-bold text-[#2b6cb0]">76人</p>
            </div>
            <div className="rounded-xl bg-[#faf8f2] p-3">
              <p className="text-xs text-[#526071]">平均寿命（平均値）</p>
              <p className="mt-1 text-lg font-bold text-[#1e3a5f]">73.3歳</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#population"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1e3a5f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2b6cb0]"
            >
              <span>統計を見る</span>
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#compare"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#2f855a] bg-[#2f855a]/10 px-4 py-2.5 text-sm font-semibold text-[#2f855a] transition-colors hover:bg-[#2f855a] hover:text-white"
            >
              <span>自分と比較する</span>
            </a>
          </div>
        </section>

        {/* 2〜8. 統計セクション */}
        <DashboardSections data={statisticsData} />

        {/* 自分と比較する */}
        <div className="mt-10">
          <CompareWithMe data={statisticsData} />
        </div>
      </main>

      <footer className="mt-12 border-t border-[#e5dfd0] bg-white py-8 text-center text-xs text-[#526071]">
        <div className="mx-auto max-w-6xl space-y-2 px-4 sm:px-6">
          <p className="font-semibold text-[#1e3a5f]">
            {metadata.title} — {metadata.subtitle}
          </p>
          <p>
            データ基準日：{metadata.referenceDate} ／ 人口基準年：{metadata.populationBaseYear}年 ／ 入力情報のサーバー送信・ブラウザ保存（LocalStorage等）は一切行いません。
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
