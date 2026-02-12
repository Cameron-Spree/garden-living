import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

test('GET /health returns ok', async () => {
  const response = await request(createApp()).get('/health');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { ok: true });
});
