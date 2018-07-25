const jwt = require('jsonwebtoken');
const config = require('config');

const createToken = (user) => {
  const timeStamp = Date.now();
  const expireIn = Math.floor(Date.now() / 1000) + (60 * 60);
  const payload = {
    sub: user.id,
    name: user.email,
    iat: timeStamp,
    exp: expireIn
  };
  const privateKey = config.get('encryption.jwtSk');

  return jwt.sign(payload, privateKey);
}

const signIn = (req, res) => {
  const { user } = req;
  const token = createToken(user);
  res.status(200).send({token});
}

module.exports = {
  createToken,
  signIn
}