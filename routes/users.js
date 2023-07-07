const express = require('express');

const router = express.Router();

const auth = require('../middlewares/auth');

const {
  validateUserData,
  validateUserBody,
  validateLoginBody,
} = require('../middlewares/validateJoi');

const {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateLoginBody, loginUser);

router.use(auth);

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validateUserData, updateUser);

module.exports = router;
