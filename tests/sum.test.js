import { sum } from '../src/js/analysis/analyzerHelpers.js';

test('sums array [1, 2, 3] to equal 6', () => {
  expect(sum([1,2,3])).toBe(6);
});
