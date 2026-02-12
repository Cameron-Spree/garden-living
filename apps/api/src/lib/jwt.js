import crypto from 'node:crypto';

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

export function signJwt(payload, secret, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedBody = base64url(JSON.stringify(body));
  const content = `${encodedHeader}.${encodedBody}`;
  const signature = crypto.createHmac('sha256', secret).update(content).digest('base64url');
  return `${content}.${signature}`;
}

export function verifyJwt(token, secret) {
  const [encodedHeader, encodedBody, signature] = token.split('.');
  if (!encodedHeader || !encodedBody || !signature) throw new Error('Invalid token format');
  const content = `${encodedHeader}.${encodedBody}`;
  const expected = crypto.createHmac('sha256', secret).update(content).digest('base64url');
  if (expected !== signature) throw new Error('Invalid signature');
  const payload = JSON.parse(Buffer.from(encodedBody, 'base64url').toString('utf8'));
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) throw new Error('Token expired');
  return payload;
}
