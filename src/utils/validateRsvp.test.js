import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRsvp } from './validateRsvp.js';

const base = { name: 'Riya Kapoor', contact: 'riya@example.com', guests: '2', attending: 'yes', message: '' };

test('accepts a complete RSVP with email or phone', () => {
  assert.deepEqual(validateRsvp(base, 6), {});
  assert.deepEqual(validateRsvp({ ...base, contact: '+91 98765 43210' }, 6), {});
});

test('flags each missing or invalid field', () => {
  const e = validateRsvp({ name: ' ', contact: 'nope', guests: '9', attending: 'yes', message: 'x'.repeat(501) }, 6);
  assert.deepEqual(Object.keys(e).sort(), ['contact', 'guests', 'message', 'name']);
  assert.ok(validateRsvp({ ...base, attending: '' }, 6).attending);
});

test('guest count is not required when declining', () => {
  assert.deepEqual(validateRsvp({ ...base, attending: 'no', guests: '' }, 6), {});
});
