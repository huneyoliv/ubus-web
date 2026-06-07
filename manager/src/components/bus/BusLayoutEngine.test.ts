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
      p7physicalNumbers: {},
    };

    const layout = BusLayoutEngine.buildLayout(baseAnswers);
    const updated = BusLayoutEngine.applyPhysicalNumbers(layout, { 1: 101, 2: 102 });

    expect(updated.rows[0].cells[0].physicalNumber).toBe(101);
    expect(updated.rows[0].cells[1].physicalNumber).toBe(102);
    expect(updated.rows[0].cells[3].physicalNumber).toBeNull();
  });
});
