require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadRequest = require('../errors/BadRequest ');
const NotFoundError = require('../errors/NotFoundError');
const Conflict = require('../errors/Conflict');
const Unauthorized = require('../errors/Unauthorized');

const { signToken } = require('../utils/jwtAuth');

const MONGO_DUMPLICATE_KEY = 11000;

const getUserById = (req, res, next, id) => {
  User.findById(id)
    .orFail(() => {
      next(new NotFoundError('User not found'));
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Invalid user id provided'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  getUserById(req, res, next, _id);
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Invalid data provided'));
      } else if (err.code === MONGO_DUMPLICATE_KEY) {
        next(new Conflict('User with this email already exists'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next, newData) => {
  const { user } = req;
  User.findByIdAndUpdate(user._id, newData, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFoundError('User not found'));
    })
    .then((updatedUser) => res.send({ data: updatedUser }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Invalid user data provided'));
      } else {
        next(err);
      }
    });
};

const updateUserData = (req, res, next) => {
  const { name, email } = req.body;
  updateUser(req, res, next, { name, email });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => {
      next(new Unauthorized('User not found'));
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, matched]) => {
      if (!matched) {
        return next(new Unauthorized('Password is incorrect'));
      }
      const token = signToken(user._id);
      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUserData,
};
