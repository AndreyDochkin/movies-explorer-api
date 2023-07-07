const express = require('express');

const router = express.Router();

const {
  validateMovieBody,
  validateMovieId,
} = require('../middlewares/validateJoi');

const {
  getMoviesUserSaved,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMoviesUserSaved);
router.post('/movies', validateMovieBody, createMovie);
router.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = router;
