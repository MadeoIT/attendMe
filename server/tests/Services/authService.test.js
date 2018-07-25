const { createToken } = require('../../Services/authService');
const jwt = require('jsonwebtoken');
const config = require('config');

const privateKey = config.get('encryption.jwtSk');

describe('token', () => {
  const user = {
    id: 1,
    email: 'matteo@email'
  };
  it('should create a token', () => {
    const token = createToken(user);
    const payload = jwt.verify(token, privateKey);

    expect(payload.sub).toBe(1);
    expect(payload.name).toBe('matteo@email');
  });
});