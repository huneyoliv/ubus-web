import { describe, expect, test } from 'vitest';
import { BusLayoutEngine, BusWizardAnswers } from './BusLayoutEngine';

describe('BusLayoutEngine Web Port', () => {
  test('validate answers correctness', () => {
    const baseAnswers: BusWizardAnswers = {
      plate: 'ABC-1234',
      identificationNumber: '1050',
      p1: 'PHYSICAL',
      p2: 'FOUR',
      p3: 'NORMAL',
      p4capacity: 44,
      p5: 'NONE',
      p6: 'LEFT',
      p7physicalNumbers: {},
    };

    expect(BusLayoutEngine.validate({ ...baseAnswers, p3: 'BOX', p5: 'NONE' })).not.toBeNull();
    expect(BusLayoutEngine.validate({ ...baseAnswers, p3: 'NORMAL', p5: 'BOX' })).not.toBeNull();
    expect(BusLayoutEngine.validate({ ...baseAnswers, p2: 'THREE', p3: 'BATHROOM' })).not.toBeNull();
    expect(BusLayoutEngine.validate({ ...baseAnswers, p2: 'FOUR', p3: 'FIVE' })).not.toBeNull();
    expect(BusLayoutEngine.validate({ ...baseAnswers, p4capacity: 45 })).not.toBeNull();

    expect(BusLayoutEngine.validate(baseAnswers)).toBeNull();
  });

  test('buildLayout cells and capacity structure', () => {
    const baseAnswers: BusWizardAnswers = {
      plate: 'ABC-1234',
      identificationNumber: '1050',
      p1: 'PHYSICAL',
      p2: 'FOUR',
      p3: 'NORMAL',
      p4capacity: 44,
      p5: 'NONE',
      p6: 'LEFT',
      p7physicalNumbers: {},
    };

    const layoutFour = BusLayoutEngine.buildLayout(baseAnswers);
    expect(layoutFour.rows[0].cells[0].type).toBe('SEAT');
    expect(layoutFour.rows[0].cells[1].type).toBe('SEAT');
    expect(layoutFour.rows[0].cells[2].type).toBe('AISLE');
    expect(layoutFour.rows[0].cells[3].type).toBe('SEAT');
    expect(layoutFour.rows[0].cells[4].type).toBe('SEAT');

    const layoutThree = BusLayoutEngine.buildLayout({ ...baseAnswers, p2: 'THREE' });
    expect(layoutThree.rows[0].cells[3].type).toBe('EMPTY');

    const layoutTwo = BusLayoutEngine.buildLayout({ ...baseAnswers, p2: 'TWO' });
    expect(layoutTwo.rows[0].cells[1].type).toBe('EMPTY');
    expect(layoutTwo.rows[0].cells[3].type).toBe('EMPTY');

    const layoutBathroom = BusLayoutEngine.buildLayout({ ...baseAnswers, p3: 'BATHROOM', p4capacity: 42 });
    expect(layoutBathroom.rows[layoutBathroom.rows.length - 1].cells[3].type).toBe('BATHROOM');
    expect(layoutBathroom.rows[layoutBathroom.rows.length - 1].cells[4].type).toBe('BATHROOM');

    const layoutBox = BusLayoutEngine.buildLayout({ ...baseAnswers, p3: 'BOX', p5: 'BOX', p4capacity: 40 });
    expect(layoutBox.rows[layoutBox.rows.length - 1].cells.every((c) => c.type === 'BOX')).toBe(true);

    const layoutFive = BusLayoutEngine.buildLayout({ ...baseAnswers, p3: 'FIVE', p2: 'TWO', p4capacity: 47 });
    expect(layoutFive.rows[layoutFive.rows.length - 1].cells.every((c) => c.type === 'SEAT')).toBe(true);
  });

  test('apply physical numbers mapping', () => {
    const baseAnswers: BusWizardAnswers = {
      plate: 'ABC-1234',
      identificationNumber: '1050',
      p1: 'MIXED',
      p2: 'FOUR',
      p3: 'NORMAL',
      p4capacity: 44,
      p5: 'NONE',
      p6: 'LEFT',
      p6b: 'SEQUENTIAL',
      p7physicalNumbers: {},
    };

    const layout = BusLayoutEngine.buildLayout(baseAnswers);
    const updated = BusLayoutEngine.applyPhysicalNumbers(layout, { 1: 101, 2: 102 });

    expect(updated.rows[0].cells[0].physicalNumber).toBe(101);
    expect(updated.rows[0].cells[1].physicalNumber).toBe(102);
    expect(updated.rows[0].cells[3].physicalNumber).toBeNull();
  });

  test('patterned numbering (ODD_WINDOW and EVEN_WINDOW)', () => {
    const baseAnswers: BusWizardAnswers = {
      plate: 'ABC-1234',
      identificationNumber: '1050',
      p1: 'PHYSICAL',
      p2: 'FOUR',
      p3: 'NORMAL',
      p4capacity: 44,
      p5: 'NONE',
      p6: 'LEFT',
      p6b: 'ODD_WINDOW',
      p7physicalNumbers: {},
    };

    // ODD_WINDOW: Janela ímpar, Corredor par
    const layoutOdd = BusLayoutEngine.buildLayout(baseAnswers);
    expect(layoutOdd.rows[0].cells[0].virtualNumber).toBe(1); // WINDOW_LEFT
    expect(layoutOdd.rows[0].cells[1].virtualNumber).toBe(2); // AISLE_LEFT
    expect(layoutOdd.rows[0].cells[3].virtualNumber).toBe(4); // AISLE_RIGHT
    expect(layoutOdd.rows[0].cells[4].virtualNumber).toBe(3); // WINDOW_RIGHT

    expect(layoutOdd.rows[1].cells[0].virtualNumber).toBe(5); // WINDOW_LEFT
    expect(layoutOdd.rows[1].cells[1].virtualNumber).toBe(6); // AISLE_LEFT
    expect(layoutOdd.rows[1].cells[3].virtualNumber).toBe(8); // AISLE_RIGHT
    expect(layoutOdd.rows[1].cells[4].virtualNumber).toBe(7); // WINDOW_RIGHT

    // EVEN_WINDOW: Janela par, Corredor ímpar
    const layoutEven = BusLayoutEngine.buildLayout({ ...baseAnswers, p6b: 'EVEN_WINDOW' });
    expect(layoutEven.rows[0].cells[0].virtualNumber).toBe(2); // WINDOW_LEFT
    expect(layoutEven.rows[0].cells[1].virtualNumber).toBe(1); // AISLE_LEFT
    expect(layoutEven.rows[0].cells[3].virtualNumber).toBe(3); // AISLE_RIGHT
    expect(layoutEven.rows[0].cells[4].virtualNumber).toBe(4); // WINDOW_RIGHT

    expect(layoutEven.rows[1].cells[0].virtualNumber).toBe(6); // WINDOW_LEFT
    expect(layoutEven.rows[1].cells[1].virtualNumber).toBe(5); // AISLE_LEFT
    expect(layoutEven.rows[1].cells[3].virtualNumber).toBe(7); // AISLE_RIGHT
    expect(layoutEven.rows[1].cells[4].virtualNumber).toBe(8); // WINDOW_RIGHT
  });
});
