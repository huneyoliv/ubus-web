import React from 'react';
import { BusLayout } from '../../../api/fleet';

interface StepP7Props {
  layout: BusLayout;
  p7numbers: Record<number, number>;
  onChangeNumber: (virtualNum: number, physicalNum: number | null) => void;
}

export function StepP7({ layout, p7numbers, onChangeNumber }: StepP7Props) {
  // Extrai todas as células do tipo SEAT
  const seats = layout.rows
    .flatMap((row) => row.cells)
    .filter((cell) => cell.type === 'SEAT' && cell.virtualNumber !== null)
    .sort((a, b) => (a.virtualNumber ?? 0) - (b.virtualNumber ?? 0));

  return (
    <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2">
      <div>
        <h2 className="text-xl font-bold text-[#131B2E]">Configurar Numeração Física</h2>
        <p className="text-xs text-slate-500 mt-1">
          O ônibus possui numeração mista. Digite o número físico real para cada número virtual de assento. Deixe vazio para usar o padrão.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {seats.map((seat) => {
          const vNum = seat.virtualNumber!;
          const val = p7numbers[vNum] !== undefined ? p7numbers[vNum].toString() : '';

          return (
            <div
              key={vNum}
              className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white gap-3 shadow-sm"
            >
              <span className="text-xs font-bold text-slate-600">Virtual #{vNum}</span>
              <input
                type="text"
                pattern="[0-9]*"
                placeholder={vNum.toString()}
                value={val}
                onChange={(e) => {
                  const inputVal = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                  onChangeNumber(vNum, inputVal ? parseInt(inputVal, 10) : null);
                }}
                className="w-14 px-2 py-1 text-center text-sm font-bold border border-slate-300 rounded-lg focus:outline-none focus:border-[#002776] focus:ring-1 focus:ring-[#002776]"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
