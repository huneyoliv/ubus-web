import React from 'react';
import { Info } from 'lucide-react';
import { BusLayout } from '../../../api/fleet';
import { BusLayoutGrid } from '../BusLayoutGrid';

interface StepPreviewProps {
  title: string;
  subtitle: string;
  layout: BusLayout;
  p7numbers: Record<number, number>;
  dpmWarning: string | null;
}

export function StepPreview({ title, subtitle, layout, p7numbers, dpmWarning }: StepPreviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[#131B2E]">{title}</h2>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>

      {dpmWarning && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 shadow-sm">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold leading-relaxed">{dpmWarning}</p>
        </div>
      )}

      <div className="max-h-[60vh] overflow-y-auto py-2">
        <BusLayoutGrid layout={layout} p7numbers={p7numbers} />
      </div>
    </div>
  );
}
