import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Coins,
  Droplets,
  Globe2,
  HeartPulse,
  Languages,
  Sparkles,
  Wifi,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { WorldStatisticsData } from '../types/statistics';
import { HundredPeopleGrid } from './HundredPeopleGrid';
import { SectionCard } from './SectionCard';
import { StatMetadataPanel } from './StatMetadataPanel';

interface DashboardSectionsProps {
  data: WorldStatisticsData;
}

function useIsSmallScreen(): boolean {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const update = () => setIsSmall(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isSmall;
}

function formatTooltipPercent(value: unknown): string {
  if (typeof value === 'number') {
    return `${value}%`;
  }
  return String(value ?? '');
}

export function DashboardSections({ data }: DashboardSectionsProps) {
  const isSmallScreen = useIsSmallScreen();
  const {
    population,
    income,
    healthDrinkingWater,
    healthLifeExpectancy,
    education,
    information,
    religion,
    language,
  } = data;

  return (
    <div className="space-y-8">
      {/* 2. 人口 */}
      <SectionCard
        id="population"
        sectionNumber="02"
        categoryLabel={population.categoryLabel}
        title="世界の人口構成（国連 2026年推計）"
        badgeText="基準年：2026年"
        badgeTone="navy"
        icon={<Globe2 className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <HundredPeopleGrid
            items={population.items}
            variant="person"
            title="100人のアイコンで見る世界の居住地域"
          />

          <div className="flex flex-col justify-between gap-4">
            <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
              <p className="mb-2 text-xs font-semibold text-[#1e3a5f] sm:text-sm">
                地域別の割合（%）— 横棒グラフ
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={population.items}
                    layout="vertical"
                    margin={{ top: 4, right: 20, left: 10, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5dfd0" />
                    <XAxis
                      type="number"
                      domain={[0, 65]}
                      unit="%"
                      tick={{ fontSize: 12, fill: '#526071' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={isSmallScreen ? 88 : 112}
                      tick={{ fontSize: isSmallScreen ? 10 : 12, fill: '#1e293b' }}
                    />
                    <Tooltip
                      formatter={(val) => [formatTooltipPercent(val), '世界人口比']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5dfd0',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                      {population.items.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#e5dfd0]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#f3efe4] text-[#1e3a5f]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">地域</th>
                    <th className="px-3 py-2 text-right font-semibold">2026年推計人口</th>
                    <th className="px-3 py-2 text-right font-semibold">割合</th>
                    <th className="px-3 py-2 text-right font-semibold">100人あたり</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ebe0] bg-white">
                  {population.items.map((item) => (
                    <tr key={item.id}>
                      <td className="flex items-center gap-2 px-3 py-2 font-medium text-[#1e293b]">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </td>
                      <td className="px-3 py-2 text-right text-[#475569]">
                        {item.populationDisplay}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-[#1e3a5f]">
                        {item.percentage.toFixed(2)}%
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-[#2b6cb0]">
                        約{item.per100Rounded}人
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#faf8f2] font-semibold text-[#1e3a5f]">
                  <tr>
                    <td className="px-3 py-2">合計確認</td>
                    <td className="px-3 py-2 text-right">
                      {data.metadata.worldPopulationEstimate.toLocaleString('ja-JP')}人
                    </td>
                    <td className="px-3 py-2 text-right">
                      {population.exactPercentageSum?.toFixed(2)}%
                    </td>
                    <td className="px-3 py-2 text-right text-amber-800">
                      四捨五入計 {population.roundedCountSum}人（注記参照）
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <StatMetadataPanel meta={population} />
      </SectionCard>

      {/* 3. 所得 */}
      <SectionCard
        id="income"
        sectionNumber="03"
        categoryLabel={income.categoryLabel}
        title="1日3.00ドル未満（国際貧困ライン）で暮らす人"
        badgeText="2021年購買力平価（2021 PPP）基準"
        badgeTone="blue"
        icon={<Coins className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {income.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4"
                >
                  <p className="text-xs font-medium text-[#526071]">{item.label}</p>
                  <p
                    className="mt-1.5 text-2xl font-bold sm:text-3xl"
                    style={{ color: item.color }}
                  >
                    {item.percentage}%
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#1e3a5f]">
                    100人中 約{item.per100Rounded}人（調整後 {item.per100Grid}人）
                  </p>
                  {item.populationDisplay && (
                    <p className="mt-1 text-xs text-[#526071]">{item.populationDisplay}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
              <p className="mb-2 text-xs font-semibold text-[#1e3a5f] sm:text-sm">
                生活水準の割合（円グラフ）
              </p>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={income.items}
                      dataKey="percentage"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={84}
                      paddingAngle={2}
                    >
                      {income.items.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [formatTooltipPercent(val), '割合']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5dfd0',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <HundredPeopleGrid
            items={income.items}
            variant="dot"
            title="100人ドット表示（1日3.00ドル未満とそれ以上）"
          />
        </div>

        <StatMetadataPanel meta={income} pppBasis={income.pppBasis} />
      </SectionCard>

      {/* 4. 健康 */}
      <SectionCard
        id="health"
        sectionNumber="04"
        categoryLabel="健康"
        title="安全な飲み水へのアクセスと、世界の平均寿命"
        badgeText="人数（%）と平均値（歳）を分離表示"
        badgeTone="green"
        icon={<HeartPulse className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 飲み水：割合・人数 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1e3a5f]">
              <Droplets className="h-4 w-4 text-[#2b6cb0]" aria-hidden="true" />
              <span>安全に管理された飲み水（人数・割合）</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
                <div className="mb-3 space-y-2">
                  {healthDrinkingWater.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-[#e5dfd0]"
                    >
                      <span className="text-xs font-medium text-[#1e293b]">
                        {item.label}
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: item.id === 'safe_water' ? '#2b6cb0' : '#475569' }}
                      >
                        {item.per100Rounded}人（{item.percentage}%）
                      </span>
                    </div>
                  ))}
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={healthDrinkingWater.items}
                      margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5dfd0" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 10, fill: '#475569' }}
                        tickFormatter={(v: string) =>
                          v.includes('利用できる') ? '利用可能' : '利用不可'
                        }
                      />
                      <YAxis
                        domain={[0, 100]}
                        unit="%"
                        tick={{ fontSize: 11, fill: '#526071' }}
                      />
                      <Tooltip
                        formatter={(val) => [formatTooltipPercent(val), '割合']}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#e5dfd0',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="percentage" radius={[6, 6, 0, 0]} barSize={44}>
                        {healthDrinkingWater.items.map((entry) => (
                          <Cell key={entry.id} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <HundredPeopleGrid
                items={healthDrinkingWater.items}
                variant="dot"
                title="飲み水：100人ドット表示"
              />
            </div>

            <StatMetadataPanel meta={healthDrinkingWater} />
          </div>

          {/* 平均寿命：平均値（人数変換しない） */}
          <div className="flex flex-col justify-between rounded-xl border border-[#2b6cb0]/30 bg-[#f0f6fc] p-5">
            <div>
              <span className="inline-flex items-center rounded-full bg-[#1e3a5f] px-2.5 py-0.5 text-xs font-semibold text-white">
                平均値指標（人数換算なし）
              </span>
              <h3 className="mt-3 text-base font-bold text-[#1e3a5f]">
                {healthLifeExpectancy.indicatorName}
              </h3>
              <div className="mt-4 rounded-xl border border-[#2b6cb0]/20 bg-white p-5 text-center">
                <p className="text-xs font-medium text-[#526071]">
                  出生時平均余命（{healthLifeExpectancy.dataYear}）
                </p>
                <p className="mt-2 text-4xl font-extrabold tracking-tight text-[#1e3a5f] sm:text-5xl">
                  {healthLifeExpectancy.value}
                  <span className="ml-1 text-xl font-bold text-[#2b6cb0]">
                    {healthLifeExpectancy.unit}
                  </span>
                </p>
                {healthLifeExpectancy.reference2026Projection && (
                  <p className="mt-2 text-xs text-[#526071]">
                    参考：{healthLifeExpectancy.reference2026Projection}
                  </p>
                )}
              </div>
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                ※「平均寿命」は世界全体の平均年数であり、100人中の人数（〇〇人）には変換しません。割合・人数指標と混同しないよう分けて表示しています。
              </p>
            </div>

            <StatMetadataPanel meta={healthLifeExpectancy} />
          </div>
        </div>
      </SectionCard>

      {/* 5. 教育 */}
      <SectionCard
        id="education"
        sectionNumber="05"
        categoryLabel={education.categoryLabel}
        title="15歳以上の識字率と、読み書きができない人の割合"
        badgeText="分母：15歳以上の人口"
        badgeTone="amber"
        icon={<BookOpen className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50/80 px-4 py-3 text-xs font-medium text-amber-950 sm:text-sm">
          重要：この統計の分母は世界総人口ではなく「<strong>15歳以上の世界人口</strong>」です（15歳未満の子どもは分母に含みません）。
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {education.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4"
                >
                  <p className="text-xs font-medium text-[#526071]">{item.label}</p>
                  <p
                    className="mt-1.5 text-2xl font-bold sm:text-3xl"
                    style={{ color: item.id === 'literate' ? '#2f855a' : '#475569' }}
                  >
                    {item.percentage}%
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#1e3a5f]">
                    15歳以上100人中 約{item.per100Rounded}人
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
              <p className="mb-2 text-xs font-semibold text-[#1e3a5f] sm:text-sm">
                15歳以上人口の識字状況（円グラフ）
              </p>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={education.items}
                      dataKey="percentage"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {education.items.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [formatTooltipPercent(val), '15歳以上人口比']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5dfd0',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <HundredPeopleGrid
            items={education.items}
            variant="dot"
            title="15歳以上を100人とした場合の識字率ドット表示"
          />
        </div>

        <StatMetadataPanel meta={education} />
      </SectionCard>

      {/* 6. 情報 */}
      <SectionCard
        id="information"
        sectionNumber="06"
        categoryLabel={information.categoryLabel}
        title="インターネット利用者と未利用者（ITU 最新データ）"
        badgeText="ITU 2026年データ"
        badgeTone="blue"
        icon={<Wifi className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {information.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4"
                >
                  <p className="text-xs font-medium text-[#526071]">{item.label}</p>
                  <p
                    className="mt-1.5 text-2xl font-bold sm:text-3xl"
                    style={{ color: item.id === 'online' ? '#2b6cb0' : '#475569' }}
                  >
                    {item.percentage}%
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#1e3a5f]">
                    100人中 {item.per100Rounded}人
                  </p>
                  {item.populationDisplay && (
                    <p className="mt-1 text-xs text-[#526071]">{item.populationDisplay}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
              <p className="mb-2 text-xs font-semibold text-[#1e3a5f] sm:text-sm">
                インターネット接続状況（棒グラフ）
              </p>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={information.items}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: 10, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5dfd0" />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      unit="%"
                      tick={{ fontSize: 12, fill: '#526071' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={isSmallScreen ? 84 : 132}
                      tick={{ fontSize: isSmallScreen ? 10 : 11, fill: '#1e293b' }}
                      tickFormatter={(v: string) =>
                        isSmallScreen
                          ? v.includes('未利用')
                            ? '未利用者'
                            : '利用者'
                          : v
                      }
                    />
                    <Tooltip
                      formatter={(val) => [formatTooltipPercent(val), '世界人口比']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5dfd0',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={32}>
                      {information.items.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <HundredPeopleGrid
            items={information.items}
            variant="dot"
            title="100人ドット表示（インターネット利用状況）"
          />
        </div>

        <StatMetadataPanel meta={information} />
      </SectionCard>

      {/* 7. 宗教 */}
      <SectionCard
        id="religion"
        sectionNumber="07"
        categoryLabel={religion.categoryLabel}
        title="世界の宗教別人口構成（Pew Research Center 2020年データ）"
        badgeText="2020年のデータ"
        badgeTone="navy"
        icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
            <p className="mb-2 text-xs font-semibold text-[#1e3a5f] sm:text-sm">
              宗教別の割合（%）— 円グラフ（2020年データ）
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={religion.items}
                    dataKey="percentage"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={92}
                    paddingAngle={2}
                  >
                    {religion.items.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [formatTooltipPercent(val), '世界人口比（2020年）']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5dfd0',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              {religion.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-[#e5dfd0] bg-white px-2.5 py-1.5"
                >
                  <span className="flex items-center gap-1.5 font-medium text-[#1e293b]">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    {item.label}
                  </span>
                  <span className="font-semibold text-[#1e3a5f]">
                    {item.per100Rounded}人（{item.percentage}%）
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
              <p className="mb-2 text-xs font-semibold text-[#1e3a5f] sm:text-sm">
                100人あたりの内訳（棒グラフ）
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={religion.items}
                    layout="vertical"
                    margin={{ top: 4, right: 20, left: 10, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5dfd0" />
                    <XAxis
                      type="number"
                      domain={[0, 35]}
                      unit="%"
                      tick={{ fontSize: 12, fill: '#526071' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={isSmallScreen ? 82 : 96}
                      tick={{ fontSize: isSmallScreen ? 11 : 12, fill: '#1e293b' }}
                    />
                    <Tooltip
                      formatter={(val) => [formatTooltipPercent(val), '割合（2020年）']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5dfd0',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                      {religion.items.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] px-4 py-3 text-xs text-[#475569]">
              合計確認：割合計 {religion.exactPercentageSum?.toFixed(1)}% ／ 四捨五入整数計{' '}
              {religion.roundedCountSum}人（2020年データ）
            </div>
          </div>
        </div>

        <StatMetadataPanel meta={religion} />
      </SectionCard>

      {/* 8. 言語（未取得） */}
      <SectionCard
        id="language"
        sectionNumber="08"
        categoryLabel={language.categoryLabel}
        title="母語話者数（L1）による言語別構成"
        badgeText="未取得（非転載ルール適用）"
        badgeTone="slate"
        icon={<Languages className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="rounded-xl border border-slate-300 bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <div className="space-y-2">
              <p className="text-base font-bold text-[#1e3a5f]">
                データ状況：未取得
              </p>
              <p className="text-sm leading-relaxed text-[#334155]">
                {language.reason}
              </p>
              <ul className="list-disc space-y-1 pl-5 text-xs text-[#526071]">
                <li>対象基準：母語話者数（L1）のみを使用（第2言語話者 L2 は重複計上しない）</li>
                <li>方針：利用許諾のない有料データは転載しない／確認できない数値の推測補完は行わない</li>
              </ul>
            </div>
          </div>
        </div>

        <StatMetadataPanel meta={language} />
      </SectionCard>
    </div>
  );
}
