export default class Testee {
  /**
   * sums all numbers
   * @param {...number} numbers
   * @returns {number}
   */
  sum(...numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
  }
}
