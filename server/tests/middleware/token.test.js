const { createToken, createPayload } = require('../../middleware/token');
const jwt = require('jsonwebtoken');

const tokenKey = '123';
const csrfToken = 'abc';
const tokenExp = '15m'

describe('token', () => {
  const user = {
    id: 1,
    email: 'matteo@email'
  };
  it('should create a token', () => {
    const payload = createPayload(user, csrfToken)
    const token = createToken(payload, tokenKey, tokenExp);
    const decodedPayload = jwt.verify(token, tokenKey);

    expect(decodedPayload.id).toBe(1);
    expect(decodedPayload.email).toBe('matteo@email');
    expect(decodedPayload.csrfToken).toBe(csrfToken);
  });
});