import { add } from '../math';

test('add two numbers together', () => {
  expect(add(1, 1)).toBe(2);
  expect(add(100, 100)).toBe(200);
  expect(add(1, 1)).toBe(2);
});
