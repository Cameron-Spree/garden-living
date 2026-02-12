import test from 'node:test';
import assert from 'node:assert/strict';
import { signJwt, verifyJwt } from '../apps/api/src/lib/jwt.js';
import { calculateStreak } from '../apps/api/src/lib/streak.js';

test('JWT sign/verify roundtrip', () => {
  const token = signJwt({ id: 'u1', email: 'a@b.com' }, 'secret');
  const payload = verifyJwt(token, 'secret');
  assert.equal(payload.id, 'u1');
});

test('streak logic counts last 7 days completions', () => {
  const now = new Date('2026-01-08T00:00:00.000Z');
  const dates = [
    '2026-01-07T00:00:00.000Z',
    '2026-01-06T00:00:00.000Z',
    '2026-01-03T00:00:00.000Z',
    '2025-12-01T00:00:00.000Z'
  ];
  const result = calculateStreak(dates.map((d) => new Date(d)), now);
  assert.equal(result.actionsThisWeek, 3);
  assert.equal(result.currentStreakDays, 3);
});
