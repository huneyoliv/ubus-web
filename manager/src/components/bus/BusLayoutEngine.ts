import { BusCell, BusLayout, BusLayoutRow, CellType, NumberingMode, SeatPosition } from '../../api/fleet';

export type FrontRowLayout = 'FOUR' | 'THREE' | 'TWO';
export type RearLayout = 'BATHROOM' | 'NORMAL' | 'FIVE' | 'BOX';
export type AccessibilityFeature = 'DPM' | 'BOX' | 'NONE';
export type NumerationSide = 'LEFT' | 'RIGHT';

export interface BusWizardAnswers {
  plate: string;
  identificationNumber: string;
  p1: NumberingMode;
  p2: FrontRowLayout;
  p3: RearLayout;
  p4capacity: number;
  p5: AccessibilityFeature;
  p6: NumerationSide;
  p7physicalNumbers: Record<number, number>;
}

export const BusLayoutEngine = {
  validate(answers: BusWizardAnswers): string | null {
    const { p2, p3, p4capacity, p5 } = answers;

    if (p3 === 'BOX' && p5 === 'NONE') {
      return 'Se há box no fundo, deve existir um recurso de acessibilidade. Revise P5.';
    }
    if (p3 !== 'BOX' && p5 === 'BOX') {
      return 'Box de cadeira de rodas só é possível quando o fundo foi declarado como espaço de cadeirante (P3=D). Revise P3 ou P5.';
    }

    if (p2 === 'THREE' && p3 === 'BATHROOM') {
      return 'Combinação inválida de primeira fileira e fundo do ônibus.';
    }
    if (p2 === 'FOUR' && p3 === 'FIVE') {
      return 'Combinação inválida de primeira fileira e fundo do ônibus.';
    }

    const frontSeats = p2 === 'FOUR' ? 4 : p2 === 'THREE' ? 3 : 2;
    const rearSeats = p3 === 'BATHROOM' ? 2 : p3 === 'NORMAL' ? 4 : p3 === 'FIVE' ? 5 : 0;

    const remaining = p4capacity - frontSeats - rearSeats;
    if (remaining < 0 || remaining % 4 !== 0) {
      return 'O número total de lugares não fecha com o layout informado. Revise P2, P3 ou P4.';
    }

    return null;
  },

  buildLayout(answers: BusWizardAnswers): BusLayout {
    const { p1, p2, p3, p4capacity, p6 } = answers;

    const frontRowCells = this.buildFrontRowCells(p2);
    const frontSeats = p2 === 'FOUR' ? 4 : p2 === 'THREE' ? 3 : 2;
    const rearSeats = p3 === 'BATHROOM' ? 2 : p3 === 'NORMAL' ? 4 : p3 === 'FIVE' ? 5 : 0;
    const middleRowsCount = (p4capacity - frontSeats - rearSeats) / 4;

    const allRowsCells: BusCell[][] = [];
    allRowsCells.push(frontRowCells);
    for (let i = 0; i < middleRowsCount; i++) {
      allRowsCells.push(this.buildMiddleRowCells());
    }
    allRowsCells.push(this.buildRearRowCells(p3));

    let virtualCounter = 1;
    const isRearFive = p3 === 'FIVE';

    for (let i = 0; i < allRowsCells.length; i++) {
      const rowCells = allRowsCells[i];
      const isLastRow = i === allRowsCells.length - 1;
      let colIndices: number[] = [];

      if (isLastRow && isRearFive) {
        colIndices = [0, 1, 2, 3, 4];
      } else if (p6 === 'LEFT') {
        colIndices = [0, 1, 2, 3, 4];
      } else {
        colIndices = [4, 3, 2, 1, 0];
      }

      for (const colIdx of colIndices) {
        const cell = rowCells[colIdx];
        if (cell.type === 'SEAT') {
          const virtualNum = virtualCounter++;
          rowCells[colIdx] = {
            ...cell,
            virtualNumber: virtualNum,
            physicalNumber: p1 === 'PHYSICAL' ? virtualNum : (answers.p7physicalNumbers[virtualNum] ?? null),
          };
        }
      }
    }

    const tempRows = allRowsCells.map((cells) => ({ cells }));
    const tempLayout: BusLayout = {
      busId: '',
      numberingMode: p1,
      numerationSide: p6,
      dpmSeatVirtualNumber: null,
      preferentialSeats: [],
      updatedAt: null,
      rows: tempRows,
    };

    const dpmVirtualNum = this.computeDpmVirtualNumber(answers, tempLayout);

    if (dpmVirtualNum !== null) {
      for (let i = 0; i < allRowsCells.length; i++) {
        const rowCells = allRowsCells[i];
        for (let j = 0; j < rowCells.length; j++) {
          const cell = rowCells[j];
          if (cell.virtualNumber === dpmVirtualNum) {
            rowCells[j] = { ...cell, isDpm: true };
          }
        }
      }
    }

    const finalRows = allRowsCells.map((cells) => ({ cells }));
    return {
      busId: '',
      numberingMode: p1,
      numerationSide: p6,
      dpmSeatVirtualNumber: dpmVirtualNum,
      preferentialSeats: dpmVirtualNum !== null ? [dpmVirtualNum] : [],
      updatedAt: null,
      rows: finalRows,
    };
  },

  computeDpmVirtualNumber(answers: BusWizardAnswers, layout: BusLayout): number | null {
    if (answers.p5 !== 'DPM') return null;
    if (layout.rows.length === 0) return null;

    const firstRow = layout.rows[0];
    if (answers.p6 === 'LEFT') {
      const col4Cell = firstRow.cells[3];
      if (col4Cell.type === 'SEAT') {
        return col4Cell.virtualNumber;
      } else {
        const col5Cell = firstRow.cells[4];
        return col5Cell.type === 'SEAT' ? col5Cell.virtualNumber : null;
      }
    } else {
      const col2Cell = firstRow.cells[1];
      if (col2Cell.type === 'SEAT') {
        return col2Cell.virtualNumber;
      } else {
        const col1Cell = firstRow.cells[0];
        return col1Cell.type === 'SEAT' ? col1Cell.virtualNumber : null;
      }
    }
  },

  applyPhysicalNumbers(layout: BusLayout, p7map: Record<number, number>): BusLayout {
    const updatedRows = layout.rows.map((row) => ({
      cells: row.cells.map((cell) => {
        if (cell.type === 'SEAT') {
          const mapped = p7map[cell.virtualNumber ?? -1] ?? cell.physicalNumber;
          return { ...cell, physicalNumber: mapped };
        }
        return cell;
      }),
    }));
    return { ...layout, rows: updatedRows };
  },

  buildFrontRowCells(p2: FrontRowLayout): BusCell[] {
    switch (p2) {
      case 'FOUR':
        return [
          { col: 1, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_LEFT', isDpm: false },
          { col: 2, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'AISLE_LEFT', isDpm: false },
          { col: 3, type: 'AISLE', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 4, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'AISLE_RIGHT', isDpm: false },
          { col: 5, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_RIGHT', isDpm: false },
        ];
      case 'THREE':
        return [
          { col: 1, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_LEFT', isDpm: false },
          { col: 2, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'AISLE_LEFT', isDpm: false },
          { col: 3, type: 'AISLE', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 4, type: 'EMPTY', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 5, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_RIGHT', isDpm: false },
        ];
      case 'TWO':
        return [
          { col: 1, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_LEFT', isDpm: false },
          { col: 2, type: 'EMPTY', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 3, type: 'AISLE', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 4, type: 'EMPTY', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 5, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_RIGHT', isDpm: false },
        ];
    }
  },

  buildMiddleRowCells(): BusCell[] {
    return [
      { col: 1, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_LEFT', isDpm: false },
      { col: 2, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'AISLE_LEFT', isDpm: false },
      { col: 3, type: 'AISLE', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
      { col: 4, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'AISLE_RIGHT', isDpm: false },
      { col: 5, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_RIGHT', isDpm: false },
    ];
  },

  buildRearRowCells(p3: RearLayout): BusCell[] {
    switch (p3) {
      case 'BATHROOM':
        return [
          { col: 1, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_LEFT', isDpm: false },
          { col: 2, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'AISLE_LEFT', isDpm: false },
          { col: 3, type: 'AISLE', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 4, type: 'BATHROOM', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 5, type: 'BATHROOM', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
        ];
      case 'NORMAL':
        return [
          { col: 1, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_LEFT', isDpm: false },
          { col: 2, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'AISLE_LEFT', isDpm: false },
          { col: 3, type: 'AISLE', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 4, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'AISLE_RIGHT', isDpm: false },
          { col: 5, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_RIGHT', isDpm: false },
        ];
      case 'FIVE':
        return [
          { col: 1, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_LEFT', isDpm: false },
          { col: 2, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'AISLE_LEFT', isDpm: false },
          { col: 3, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'CENTER', isDpm: false },
          { col: 4, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'AISLE_RIGHT', isDpm: false },
          { col: 5, type: 'SEAT', virtualNumber: null, physicalNumber: null, position: 'WINDOW_RIGHT', isDpm: false },
        ];
      case 'BOX':
        return [
          { col: 1, type: 'BOX', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 2, type: 'BOX', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 3, type: 'BOX', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 4, type: 'BOX', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
          { col: 5, type: 'BOX', virtualNumber: null, physicalNumber: null, position: null, isDpm: false },
        ];
    }
  },
};
