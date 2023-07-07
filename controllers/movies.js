const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest ');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');

const getMoviesUserSaved = (req, res, next) => {
  Movie.find({})
    .then((allMovies) => {
      const movies = allMovies.map((movie) => movie.owner.toString() === req.user._id);
      res.status(200).send({ data: movies });
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Invalid data provided'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      next(new NotFoundError('Movie not found'));
    })
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        return next(new Forbidden('You cannot delete someone else movie'));
      }
      return Movie.deleteOne({ _id: req.params.movieId });
    })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Invalid data provided'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMoviesUserSaved,
  createMovie,
  deleteMovie,
};
