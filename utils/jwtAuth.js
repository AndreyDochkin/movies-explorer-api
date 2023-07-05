const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const checkToken = (token) => jwt.verify(token, `${JWT_SECRET}`);

const signToken = (id) => jwt.sign({ _id: id }, `${JWT_SECRET}`, { expiresIn: '7d' });

const decodeToken = (token) => jwt.decode(token, `${JWT_SECRET}`);

module.exports = {
  checkToken,
  signToken,
  decodeToken,
};
