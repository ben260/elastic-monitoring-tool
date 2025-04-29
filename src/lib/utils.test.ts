import { findChanges } from './utils';

test('findChanges returns an empty map when both lists are identical.', () => {
  const result = findChanges(
    ['datastream1', 'datastream2'],
    ['datastream1', 'datastream2'],
  );
  expect(result.size).toBe(0);
});

test('findChanges detects additions correctly.', () => {
  const result = findChanges(['datastream1'], ['datastream1', 'datastream2']);
  expect(result).toEqual(new Map([['datastream2', '+']]));
});

test('findChanges detects removals correctly.', () => {
  const result = findChanges(['datastream1', 'datastream2'], ['datastream1']);
  expect(result).toEqual(new Map([['datastream2', '-']]));
});

test('findChanges detects both additions and removals.', () => {
  const result = findChanges(
    ['datastream1', 'datastream2'],
    ['datastream2', 'datastream3'],
  );
  expect(result).toEqual(
    new Map([
      ['datastream1', '-'],
      ['datastream3', '+'],
    ]),
  );
});

test('findChanges detects additions when the original list is empty.', () => {
  const result = findChanges([], ['datastream1', 'datastream2']);
  expect(result).toEqual(
    new Map([
      ['datastream1', '+'],
      ['datastream2', '+'],
    ]),
  );
});

test('findChanges detects removals when updated list is empty.', () => {
  const result = findChanges(['datastream1', 'datastream2'], []);
  expect(result).toEqual(
    new Map([
      ['datastream1', '-'],
      ['datastream2', '-'],
    ]),
  );
});
