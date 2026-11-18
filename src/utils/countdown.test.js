import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timeLeft } from './countdown.js';

test('splits the remaining time across the venue timezone', () => {
  // 19:30 IST is 14:00 UTC.
  const t = timeLeft('2027-02-12T19:30:00+05:30', Date.parse('2027-02-10T12:58:57Z'));
  assert.deepEqual(t, { done: false, days: 2, hours: 1, minutes: 1, seconds: 3 });
});

test('stops at zero once the moment has passed', () => {
  assert.deepEqual(timeLeft('2020-01-01T00:00:00Z', Date.parse('2021-01-01T00:00:00Z')), {
    done: true, days: 0, hours: 0, minutes: 0, seconds: 0,
  });
});
