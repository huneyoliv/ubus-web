import React from 'react';

interface Option {
  value: any;
  title: string;
  subtitle: string;
}

interface StepMultiChoiceProps {
  question: string;
  options: Option[];
  selectedValue: any;
  onSelect: (val: any) => void;
}

export function StepMultiChoice({
  question,
  options,
  selectedValue,
  onSelect,
}: StepMultiChoiceProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-[#131B2E]">{question}</h2>
      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => {
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`flex flex-col text-left p-4 border rounded-xl transition duration-200 ${
                isSelected
                  ? 'border-[#002776] bg-blue-50/20 ring-1 ring-[#002776]'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`font-bold text-sm ${isSelected ? 'text-[#002776]' : 'text-slate-800'}`}>
                {opt.title}
              </span>
              <span className="text-xs text-slate-500 mt-1">{opt.subtitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
