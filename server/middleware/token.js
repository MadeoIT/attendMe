const jwt = require('jsonwebtoken');

const makePayload = (user, csrfToken) => {
  return {
    sub: user.id,
    name: user.email,
    iat: Date.now(),
    csrfToken
  };
};

const createToken = (payload, tokenKey, expiration) => {
  const options = {
    expiresIn: expiration
  };
  return jwt.sign(payload, tokenKey, options);
};


const verifyToken = (token, key) => {
  try {
    return jwt.verify(token, key);
  } catch (error) {
    return false;
  }
}

const doesNeedNewToken = (payload, refreshPayload) => {
  if (payload) return false;
  if (refreshPayload) return true;
  
  throw new Error('Unauthorized');
}



module.exports = {
  verifyToken,
  doesNeedNewToken,

  createToken,
  makePayload
}