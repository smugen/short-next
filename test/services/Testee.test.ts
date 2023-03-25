import Testee from '@/services/Testee';
import { describe, expect, test } from '@jest/globals';

describe('Testee', () => {
  const testee = new Testee();

  describe('#sum', () => {
    test('should return 0 if no numbers are given', () => {
      expect(testee.sum()).toBe(0);
    });

    test('should return the number if only one number is given', () => {
      expect(testee.sum(1)).toBe(1);
    });

    test('should return the sum of all numbers', () => {
      expect(testee.sum(1, 2, 3)).toBe(6);
    });
  });
});
