import { randomInt } from './randomInt';

it('test random int', () => {
  expect(randomInt(5, 9)).toBeGreaterThanOrEqual(5);
});
