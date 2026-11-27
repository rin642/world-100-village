import { ExternalLink, Info } from 'lucide-react';
import type { IndicatorMetadata } from '../types/statistics';

interface StatMetadataPanelProps {
  meta: IndicatorMetadata;
  pppBasis?: string;
  extraNotes?: string[];
}

export function StatMetadataPanel({
  meta,
  pppBasis,
  extraNotes,
}: StatMetadataPanelProps) {
  const combinedNotes = [
    ...(meta.roundingNote ? [meta.roundingNote] : []),
    ...(meta.extraNotes ?? []),
    ...(extraNotes ?? []),
  ];

  return (
    <div className="mt-5 rounded-xl border border-[#e5dfd0] bg-[#faf8f2] p-4 text-xs sm:text-sm text-[#334155]">
      <div className="mb-2.5 flex items-center gap-1.5 font-semibold text-[#1e3a5f]">
        <Info className="h-4 w-4 shrink-0 text-[#2b6cb0]" aria-hidden="true" />
        <span>統計メタデータ（指標・年次・出典・定義）</span>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        <div>
          <dt className="font-medium text-[#526071]">指標名</dt>
          <dd className="mt-0.5 text-[#1e293b]">{meta.indicatorName}</dd>
        </div>
        <div>
          <dt className="font-medium text-[#526071]">100人あたりの人数または割合</dt>
          <dd className="mt-0.5 font-medium text-[#1e3a5f]">{meta.per100Summary}</dd>
        </div>
        <div>
          <dt className="font-medium text-[#526071]">データ年</dt>
          <dd className="mt-0.5 text-[#1e293b]">{meta.dataYear}</dd>
        </div>
        <div>
          <dt className="font-medium text-[#526071]">出典機関</dt>
          <dd className="mt-0.5 text-[#1e293b]">{meta.sourceOrganization}</dd>
        </div>
        {pppBasis && (
          <div className="sm:col-span-2">
            <dt className="font-medium text-[#526071]">購買力平価（PPP）基準</dt>
            <dd className="mt-0.5 font-medium text-[#1e3a5f]">{pppBasis}</dd>
          </div>
        )}
        <div className="sm:col-span-2">
          <dt className="font-medium text-[#526071]">出典URL</dt>
          <dd className="mt-0.5 break-all">
            {meta.sourceUrl ? (
              <a
                href={meta.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[#2b6cb0] underline decoration-[#2b6cb0]/40 underline-offset-2 hover:text-[#1e3a5f]"
              >
                <span>{meta.sourceUrl}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            ) : (
              <span className="text-[#526071]">該当なし（未取得）</span>
            )}
            {meta.secondarySourceUrls && meta.secondarySourceUrls.length > 0 && (
              <div className="mt-1.5 space-y-1">
                {meta.secondarySourceUrls.map((sec) => (
                  <div key={sec.url} className="text-xs text-[#526071]">
                    <span>{sec.label}：</span>
                    <a
                      href={sec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-[#2b6cb0] underline decoration-[#2b6cb0]/40 underline-offset-2 hover:text-[#1e3a5f]"
                    >
                      <span>{sec.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-medium text-[#526071]">定義と分母</dt>
          <dd className="mt-0.5 leading-relaxed text-[#1e293b]">
            {meta.definitionAndDenominator}
          </dd>
        </div>
      </dl>

      {combinedNotes.length > 0 && (
        <div className="mt-3 rounded-lg border border-[#e5dfd0] bg-white/80 px-3 py-2 text-xs leading-relaxed text-[#475569]">
          <span className="font-semibold text-[#1e3a5f]">注記：</span>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {combinedNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
