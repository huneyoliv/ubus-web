import React from 'react';
import { BusCell, BusLayout, CellType, NumberingMode } from '../../api/fleet';
import { Accessibility } from 'lucide-react';

interface BusLayoutGridProps {
  layout: BusLayout;
  onSeatClick?: (cell: BusCell) => void;
  selectedVirtualNumber?: number | null;
  occupiedVirtualNumbers?: Set<number>;
  interactive?: boolean;
  p7numbers?: Record<number, number>;
}

export function BusLayoutGrid({
  layout,
  onSeatClick,
  selectedVirtualNumber,
  occupiedVirtualNumbers = new Set(),
  interactive = false,
  p7numbers = {},
}: BusLayoutGridProps) {
  const getCellState = (cell: BusCell) => {
    if (cell.type !== 'SEAT') return 'DISABLED';
    const vNum = cell.virtualNumber ?? -1;

    if (interactive) {
      if (selectedVirtualNumber === vNum) return 'SELECTED';
      return 'SHELL';
    }

    if (occupiedVirtualNumbers.has(vNum)) {
      return cell.isDpm ? 'DPM_OCCUPIED' : 'OCCUPIED';
    }

    return cell.isDpm ? 'DPM' : 'FREE';
  };

  const renderCellContent = (cell: BusCell, displayMode: NumberingMode) => {
    if (cell.type === 'BATHROOM') {
      return <span className="text-xs font-bold tracking-tighter">WC</span>;
    }
    if (cell.type === 'BOX') {
      return <Accessibility className="w-5 h-5" />;
    }
    if (cell.type === 'SEAT') {
      const vNum = cell.virtualNumber;
      const pNum = p7numbers[vNum ?? -1] ?? cell.physicalNumber;

      const mainLabel = displayMode === 'PHYSICAL' ? (pNum ?? vNum) : vNum;
      const subLabel = displayMode === 'MIXED' && pNum !== null ? `(${pNum})` : null;

      return (
        <div className="flex flex-col items-center justify-center leading-none">
          {cell.isDpm && <Accessibility className="w-3 h-3 mb-0.5" />}
          <span className="text-xs font-bold">
            {mainLabel}
            {subLabel && <sub className="text-[9px] font-normal ml-0.5">{subLabel}</sub>}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-2 p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-max mx-auto shadow-inner">
      {layout.rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex items-center gap-2">
          {row.cells.map((cell, cellIdx) => {
            if (cell.type === 'AISLE') {
              return <div key={cellIdx} className="w-4 h-10" />;
            }
            if (cell.type === 'EMPTY') {
              return <div key={cellIdx} className="w-10 h-10" />;
            }

            const state = getCellState(cell);
            const isClickable = interactive && onSeatClick && cell.type === 'SEAT';

            let cellClass = 'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ';

            if (cell.type === 'BATHROOM') {
              cellClass += 'bg-slate-200 text-slate-600 border border-slate-300';
            } else if (cell.type === 'BOX') {
              cellClass += 'bg-purple-100 text-purple-700 border border-purple-200';
            } else {
              switch (state) {
                case 'SELECTED':
                  cellClass += 'bg-[#002776] text-white border border-[#002776] shadow-sm transform scale-105';
                  break;
                case 'SHELL':
                  cellClass += 'bg-blue-50/50 hover:bg-blue-50 border border-blue-400 text-blue-800 cursor-pointer';
                  break;
                case 'FREE':
                  cellClass += 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer';
                  break;
                case 'OCCUPIED':
                  cellClass += 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed';
                  break;
                case 'DPM':
                  cellClass += 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-500 text-emerald-700 cursor-pointer';
                  break;
                case 'DPM_OCCUPIED':
                  cellClass += 'bg-emerald-50/50 text-slate-400 border border-emerald-200 cursor-not-allowed';
                  break;
                default:
                  cellClass += 'bg-slate-100 border border-slate-200 text-slate-400';
              }
            }

            return (
              <button
                key={cellIdx}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onSeatClick(cell)}
                className={`${cellClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
              >
                {renderCellContent(cell, layout.numberingMode)}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
