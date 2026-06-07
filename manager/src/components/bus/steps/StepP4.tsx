import React from 'react';
import { FrontRowLayout, RearLayout } from '../BusLayoutEngine';

interface StepP4Props {
  p2: FrontRowLayout | null;
  p3: RearLayout | null;
  selectedValue: number | null;
  onSelect: (val: number) => void;
}

export function StepP4({ p2, p3, selectedValue, onSelect }: StepP4Props) {
  const capacities = [40, 42, 44, 46, 47, 48, 50];

  const checkCapacityPossible = (capacity: number) => {
    if (!p2 || !p3) return true;

    const frontSeats = p2 === 'FOUR' ? 4 : p2 === 'THREE' ? 3 : 2;
    const rearSeats = p3 === 'BATHROOM' ? 2 : p3 === 'NORMAL' ? 4 : p3 === 'FIVE' ? 5 : 0;

    if (p2 === 'THREE' && p3 === 'BATHROOM') return false;
    if (p2 === 'FOUR' && p3 === 'FIVE') return false;

    const remaining = capacity - frontSeats - rearSeats;
    return remaining >= 0 && remaining % 4 === 0;
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-[#131B2E]">Qual a capacidade total de lugares?</h2>
      <div className="flex flex-col gap-3">
        {capacities.map((capacity) => {
          const isPossible = checkCapacityPossible(capacity);
          const isSelected = selectedValue === capacity;

          return (
            <button
              key={capacity}
              type="button"
              disabled={!isPossible}
              onClick={() => isPossible && onSelect(capacity)}
              className={`flex flex-col text-left p-4 border rounded-xl transition duration-200 ${
                isSelected
                  ? 'border-[#002776] bg-blue-50/20 ring-1 ring-[#002776]'
                  : isPossible
                  ? 'border-slate-200 hover:bg-slate-50'
                  : 'border-slate-100 opacity-40 cursor-not-allowed'
              }`}
            >
              <span className={`font-bold text-sm ${isSelected ? 'text-[#002776]' : 'text-slate-800'}`}>
                {capacity} lugares
              </span>
              <span className="text-xs text-slate-500 mt-1">
                {isPossible ? 'Disposição física compatível' : 'Incompatível com o layout de primeira fileira e fundo'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
