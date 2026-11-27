import { useState } from 'react';
import {
  CheckCircle2,
  EyeOff,
  HelpCircle,
  Lock,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import type { UserProfileInput, WorldStatisticsData } from '../types/statistics';

interface CompareWithMeProps {
  data: WorldStatisticsData;
}

const INITIAL_INPUT: UserProfileInput = {
  age: '',
  region: '',
  dailySpendingUsd: '',
  drinkingWater: '',
  literacy: '',
  internet: '',
  nativeLanguage: '',
  religion: '',
};

interface ComparisonRow {
  key: keyof UserProfileInput;
  label: string;
  userAnswerLabel: string;
  comparable: boolean;
  worldStatText: string;
  per100Badge?: string;
  note?: string;
}

export function CompareWithMe({ data }: CompareWithMeProps) {
  // React state only: never persisted to LocalStorage/SessionStorage and never sent to any server
  const [form, setForm] = useState<UserProfileInput>(INITIAL_INPUT);
  const [showResult, setShowResult] = useState(false);

  const handleReset = () => {
    setForm(INITIAL_INPUT);
    setShowResult(false);
  };

  const regionLabelMap = Object.fromEntries(
    data.population.items.map((item) => [item.id, item])
  );
  const religionLabelMap = Object.fromEntries(
    data.religion.items.map((item) => [item.id, item])
  );

  const comparisons: ComparisonRow[] = [];

  if (form.age.trim() !== '') {
    const parsedAge = Number(form.age);
    comparisons.push({
      key: 'age',
      label: '年齢',
      userAnswerLabel: Number.isFinite(parsedAge) ? `${parsedAge}歳` : form.age,
      comparable: false,
      worldStatText: '該当する年齢階級別の世界人口構成統計がないため、比較できません。',
      note: `参考：世界の出生時平均余命は ${data.healthLifeExpectancy.value}${data.healthLifeExpectancy.unit}（${data.healthLifeExpectancy.dataYear}）ですが、平均値のため年齢分布の人数とは比較しません。`,
    });
  }

  if (form.region !== '') {
    const matched = regionLabelMap[form.region];
    if (matched) {
      comparisons.push({
        key: 'region',
        label: '居住地域',
        userAnswerLabel: matched.label,
        comparable: true,
        per100Badge: `100人中 約${matched.per100Rounded}人（${matched.percentage}%）`,
        worldStatText: `2026年国連推計では、世界の100人のうち約${matched.per100Rounded}人（${matched.percentage}%・${matched.populationDisplay}）が「${matched.label}」に暮らしています。`,
        note: matched.note,
      });
    }
  }

  if (form.dailySpendingUsd !== '') {
    const isBelow = form.dailySpendingUsd === 'below_3';
    const matched = data.income.items.find((item) =>
      isBelow ? item.id === 'below_line' : item.id === 'at_or_above_line'
    );
    if (matched) {
      comparisons.push({
        key: 'dailySpendingUsd',
        label: '1日の生活費（2021 PPP基準）',
        userAnswerLabel: isBelow ? '1日3.00ドル未満' : '1日3.00ドル以上',
        comparable: true,
        per100Badge: `100人中 約${matched.per100Rounded}人（${matched.percentage}%）`,
        worldStatText: `世界銀行（2022年確報・2021 PPP基準）では、100人のうち「${matched.label}」は約${matched.per100Rounded}人（${matched.percentage}%）です。`,
        note: '国際貧困ライン（1日3.00国際ドル・2021年購買力平価換算）との比較です。',
      });
    }
  }

  if (form.drinkingWater !== '') {
    const isSafe = form.drinkingWater === 'safe';
    const matched = data.healthDrinkingWater.items.find((item) =>
      isSafe ? item.id === 'safe_water' : item.id === 'unsafe_water'
    );
    if (matched) {
      comparisons.push({
        key: 'drinkingWater',
        label: '飲み水の状況',
        userAnswerLabel: isSafe
          ? '安全に管理された飲み水を利用できる'
          : '安全に管理された飲み水を利用できない',
        comparable: true,
        per100Badge: `100人中 ${matched.per100Rounded}人（${matched.percentage}%）`,
        worldStatText: `WHO/UNICEF JMP（2024年）によると、世界の100人のうち${matched.per100Rounded}人（${matched.percentage}%）があなたと同じ状況です。`,
      });
    }
  }

  if (form.literacy !== '') {
    const isLiterate = form.literacy === 'yes';
    const matched = data.education.items.find((item) =>
      isLiterate ? item.id === 'literate' : item.id === 'illiterate'
    );
    const parsedAge = form.age.trim() !== '' ? Number(form.age) : null;
    const under15Note =
      parsedAge !== null && Number.isFinite(parsedAge) && parsedAge < 15
        ? '※入力年齢が15歳未満ですが、識字率統計の分母は「15歳以上人口」です。参考として15歳以上の割合を表示しています。'
        : '分母は「世界の15歳以上の人口」です（UNESCO / 世界銀行 2024年）。';

    if (matched) {
      comparisons.push({
        key: 'literacy',
        label: '読み書きの可否',
        userAnswerLabel: isLiterate ? '読み書きができる' : '読み書きができない',
        comparable: true,
        per100Badge: `15歳以上100人中 約${matched.per100Rounded}人（${matched.percentage}%）`,
        worldStatText: `世界の15歳以上を100人とした場合、${matched.label}は約${matched.per100Rounded}人（${matched.percentage}%）です。`,
        note: under15Note,
      });
    }
  }

  if (form.internet !== '') {
    const isOnline = form.internet === 'yes';
    const matched = data.information.items.find((item) =>
      isOnline ? item.id === 'online' : item.id === 'offline'
    );
    if (matched) {
      comparisons.push({
        key: 'internet',
        label: 'インターネット利用の有無',
        userAnswerLabel: isOnline ? '利用している' : '利用していない',
        comparable: true,
        per100Badge: `100人中 ${matched.per100Rounded}人（${matched.percentage}%）`,
        worldStatText: `ITU 2026年データでは、世界の100人のうち${matched.per100Rounded}人（${matched.percentage}%）が「${matched.label}」に該当します。`,
      });
    }
  }

  if (form.nativeLanguage.trim() !== '') {
    comparisons.push({
      key: 'nativeLanguage',
      label: '母語（第一言語・L1）',
      userAnswerLabel: form.nativeLanguage.trim(),
      comparable: false,
      worldStatText:
        '世界の母語話者（L1）構成データが「未取得」のため、比較できません。',
      note: '利用許諾のない有料データベースを転載しない方針および推測補完を行わない方針に基づき、比較対象データなしとして扱います。',
    });
  }

  if (form.religion !== '') {
    const matched = religionLabelMap[form.religion];
    if (matched) {
      comparisons.push({
        key: 'religion',
        label: '宗教',
        userAnswerLabel: matched.label,
        comparable: true,
        per100Badge: `100人中 約${matched.per100Rounded}人（${matched.percentage}%）`,
        worldStatText: `Pew Research Center（2020年データ）では、世界の100人のうち約${matched.per100Rounded}人（${matched.percentage}%）が「${matched.label}」です。`,
        note: '※宗教データは2020年時点の推計です。',
      });
    }
  }

  const answeredCount = comparisons.length;

  return (
    <section
      id="compare"
      className="scroll-mt-20 rounded-2xl border border-[#2b6cb0]/30 bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="mb-6 border-b border-[#f0ebe0] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2f855a] text-white">
              <UserCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-wider text-[#2f855a] uppercase">
                インタラクティブ比較
              </span>
              <h2 className="text-lg font-bold text-[#1e3a5f] sm:text-2xl">
                世界の100人と自分を比較する
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5dfd0] bg-[#faf8f2] px-3 py-1.5 text-xs font-medium text-[#334155] transition-colors hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>入力をすべてクリア</span>
          </button>
        </div>

        {/* Privacy guarantee */}
        <div className="mt-4 rounded-xl border border-[#2f855a]/30 bg-[#2f855a]/5 p-4">
          <div className="flex items-start gap-2.5">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-[#2f855a]"
              aria-hidden="true"
            />
            <div className="text-xs leading-relaxed text-[#1e293b] sm:text-sm">
              <p className="font-bold text-[#1e3a5f]">
                プライバシー保護のお約束（回答しない自由を尊重します）
              </p>
              <ul className="mt-1.5 grid grid-cols-1 gap-1 text-xs text-[#334155] sm:grid-cols-2">
                <li className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#2f855a]" aria-hidden="true" />
                  入力内容はサーバーへ一切送信されません
                </li>
                <li className="flex items-center gap-1.5">
                  <EyeOff className="h-3.5 w-3.5 text-[#2f855a]" aria-hidden="true" />
                  LocalStorage等にも保存せず、ページを閉じると消去されます
                </li>
              </ul>
              <p className="mt-1 text-xs text-[#526071]">
                すべての項目は任意入力です。答えたくない項目は「未回答（スキップ）」のまま比較できます。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Inputs */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowResult(true);
        }}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 年齢 */}
          <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
            <label
              htmlFor="input-age"
              className="block text-sm font-semibold text-[#1e3a5f]"
            >
              1. 年齢（任意）
            </label>
            <p className="mt-0.5 text-xs text-[#526071]">
              空欄のままスキップできます
            </p>
            <input
              id="input-age"
              type="number"
              min={0}
              max={120}
              placeholder="例：28（未回答可）"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="mt-2 w-full rounded-lg border border-[#d6cfc0] bg-white px-3 py-2 text-sm text-[#1e293b] focus:border-[#2b6cb0] focus:outline-none"
            />
          </div>

          {/* 居住地域 */}
          <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
            <label
              htmlFor="input-region"
              className="block text-sm font-semibold text-[#1e3a5f]"
            >
              2. 居住地域（任意）
            </label>
            <p className="mt-0.5 text-xs text-[#526071]">
              国連の6地域区分に対応
            </p>
            <select
              id="input-region"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="mt-2 w-full rounded-lg border border-[#d6cfc0] bg-white px-3 py-2 text-sm text-[#1e293b] focus:border-[#2b6cb0] focus:outline-none"
            >
              <option value="">未回答（スキップ）</option>
              {data.population.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* 1日の生活費 */}
          <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
            <label
              htmlFor="input-spending"
              className="block text-sm font-semibold text-[#1e3a5f]"
            >
              3. 1日の生活費（任意）
            </label>
            <p className="mt-0.5 text-xs text-[#526071]">
              世界銀行 2021年購買力平価（PPP）基準
            </p>
            <select
              id="input-spending"
              value={form.dailySpendingUsd}
              onChange={(e) =>
                setForm({ ...form, dailySpendingUsd: e.target.value })
              }
              className="mt-2 w-full rounded-lg border border-[#d6cfc0] bg-white px-3 py-2 text-sm text-[#1e293b] focus:border-[#2b6cb0] focus:outline-none"
            >
              <option value="">未回答（スキップ）</option>
              <option value="above_or_equal_3">1日3.00ドル以上</option>
              <option value="below_3">1日3.00ドル未満</option>
            </select>
          </div>

          {/* 飲み水の状況 */}
          <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
            <label
              htmlFor="input-water"
              className="block text-sm font-semibold text-[#1e3a5f]"
            >
              4. 飲み水の状況（任意）
            </label>
            <p className="mt-0.5 text-xs text-[#526071]">
              安全に管理された飲料水源へのアクセス
            </p>
            <select
              id="input-water"
              value={form.drinkingWater}
              onChange={(e) => setForm({ ...form, drinkingWater: e.target.value })}
              className="mt-2 w-full rounded-lg border border-[#d6cfc0] bg-white px-3 py-2 text-sm text-[#1e293b] focus:border-[#2b6cb0] focus:outline-none"
            >
              <option value="">未回答（スキップ）</option>
              <option value="safe">安全に管理された飲み水を利用できる</option>
              <option value="unsafe">利用できない</option>
            </select>
          </div>

          {/* 読み書きの可否 */}
          <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
            <label
              htmlFor="input-literacy"
              className="block text-sm font-semibold text-[#1e3a5f]"
            >
              5. 読み書きの可否（任意）
            </label>
            <p className="mt-0.5 text-xs text-[#526071]">
              簡単な文章を読み書きし理解できるか
            </p>
            <select
              id="input-literacy"
              value={form.literacy}
              onChange={(e) => setForm({ ...form, literacy: e.target.value })}
              className="mt-2 w-full rounded-lg border border-[#d6cfc0] bg-white px-3 py-2 text-sm text-[#1e293b] focus:border-[#2b6cb0] focus:outline-none"
            >
              <option value="">未回答（スキップ）</option>
              <option value="yes">読み書きができる</option>
              <option value="no">読み書きができない</option>
            </select>
          </div>

          {/* インターネット利用の有無 */}
          <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
            <label
              htmlFor="input-internet"
              className="block text-sm font-semibold text-[#1e3a5f]"
            >
              6. インターネット利用の有無（任意）
            </label>
            <p className="mt-0.5 text-xs text-[#526071]">
              過去3か月間のインターネット利用
            </p>
            <select
              id="input-internet"
              value={form.internet}
              onChange={(e) => setForm({ ...form, internet: e.target.value })}
              className="mt-2 w-full rounded-lg border border-[#d6cfc0] bg-white px-3 py-2 text-sm text-[#1e293b] focus:border-[#2b6cb0] focus:outline-none"
            >
              <option value="">未回答（スキップ）</option>
              <option value="yes">利用している</option>
              <option value="no">利用していない</option>
            </select>
          </div>

          {/* 母語 */}
          <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
            <label
              htmlFor="input-language"
              className="block text-sm font-semibold text-[#1e3a5f]"
            >
              7. 母語（任意）
            </label>
            <p className="mt-0.5 text-xs text-[#526071]">
              最初に習得した言語（L1）。未回答可
            </p>
            <input
              id="input-language"
              type="text"
              placeholder="例：日本語（未回答可）"
              value={form.nativeLanguage}
              onChange={(e) =>
                setForm({ ...form, nativeLanguage: e.target.value })
              }
              className="mt-2 w-full rounded-lg border border-[#d6cfc0] bg-white px-3 py-2 text-sm text-[#1e293b] focus:border-[#2b6cb0] focus:outline-none"
            />
          </div>

          {/* 宗教 */}
          <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4">
            <label
              htmlFor="input-religion"
              className="block text-sm font-semibold text-[#1e3a5f]"
            >
              8. 宗教（任意）
            </label>
            <p className="mt-0.5 text-xs text-[#526071]">
              Pew Research Center 2020年分類に対応
            </p>
            <select
              id="input-religion"
              value={form.religion}
              onChange={(e) => setForm({ ...form, religion: e.target.value })}
              className="mt-2 w-full rounded-lg border border-[#d6cfc0] bg-white px-3 py-2 text-sm text-[#1e293b] focus:border-[#2b6cb0] focus:outline-none"
            >
              <option value="">未回答（スキップ）</option>
              {data.religion.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs text-[#526071]">
            現在の回答済み項目：<strong>{answeredCount} / 8項目</strong>
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-[#1e3a5f] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#2b6cb0] focus:ring-2 focus:ring-[#2b6cb0] focus:ring-offset-2 focus:outline-none"
          >
            世界の100人と比較して最後の画面を見る
          </button>
        </div>
      </form>

      {/* Comparison & Final Screen */}
      {showResult && (
        <div className="mt-8 space-y-6 border-t-2 border-[#e5dfd0] pt-8">
          <div>
            <h3 className="text-lg font-bold text-[#1e3a5f] sm:text-xl">
              世界100人の村の統計と、あなたの比較結果
            </h3>
            <p className="mt-1 text-xs text-[#526071] sm:text-sm">
              回答された項目のみを表示しています（未回答の項目はスキップされました）。
            </p>
          </div>

          {comparisons.length === 0 ? (
            <div className="rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-5 text-sm text-[#334155]">
              すべての項目が「未回答」としてスキップされました。回答しない自由も尊重されます。比較を行いたい項目がある場合は、上のフォームから任意の項目のみ選択してください。
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {comparisons.map((row) => (
                <div
                  key={row.key}
                  className={`rounded-xl border p-4 ${
                    row.comparable
                      ? 'border-[#2b6cb0]/30 bg-[#faf8f2]'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#2b6cb0]">
                      {row.label}
                    </span>
                    {row.comparable && row.per100Badge ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#2f855a]/10 px-2.5 py-0.5 text-xs font-bold text-[#2f855a]">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        {row.per100Badge}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                        <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        比較不可
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 rounded-lg border border-[#e5dfd0] bg-white p-3 text-xs sm:text-sm">
                    <div>
                      <span className="font-medium text-[#526071]">あなた：</span>
                      <span className="font-bold text-[#1e3a5f]">
                        {row.userAnswerLabel}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-[#526071]">
                        100人の村：
                      </span>
                      <span className="text-[#1e293b]">{row.worldStatText}</span>
                    </div>
                  </div>

                  {row.note && (
                    <p className="mt-2 text-xs leading-relaxed text-[#526071]">
                      {row.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 最後の画面 */}
          <div className="rounded-2xl bg-gradient-to-br from-[#1e3a5f] via-[#244a75] to-[#2b6cb0] p-6 text-white shadow-md sm:p-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-widest text-blue-200 uppercase">
                World of 100 People
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                あなたは100人の村の一人です。
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-blue-100">
                約83億人の地球を100人の村に縮めてみると、私たちが当たり前に思っている暮らしや環境が、村全体の中ではどのような位置にあるのかが見えてきます。以下が今回のあなたの回答結果です（ブラウザを閉じるとこの記録は消去されます）。
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-xs">
              <p className="mb-3 text-xs font-bold tracking-wide text-blue-100 uppercase">
                あなたの入力結果（回答済み {answeredCount}項目／未回答 {8 - answeredCount}項目）
              </p>
              {comparisons.length === 0 ? (
                <p className="text-sm text-white/90">
                  入力された項目はありません（すべて未回答）。
                </p>
              ) : (
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {comparisons.map((row) => (
                    <div
                      key={row.key}
                      className="rounded-lg bg-white/10 px-3 py-2.5"
                    >
                      <dt className="text-xs text-blue-200">{row.label}</dt>
                      <dd className="mt-0.5 text-sm font-bold text-white">
                        {row.userAnswerLabel}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
