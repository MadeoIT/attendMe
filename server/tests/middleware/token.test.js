const { createToken, makePayload } = require('../../middleware/token');
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
    const payload = makePayload(user, csrfToken)
    const token = createToken(payload, tokenKey, tokenExp);
    const decodedPayload = jwt.verify(token, tokenKey);

    expect(decodedPayload.sub).toBe(1);
    expect(decodedPayload.name).toBe('matteo@email');
    expect(decodedPayload.csrfToken).toBe(csrfToken);
  });
});