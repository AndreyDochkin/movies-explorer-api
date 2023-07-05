const express = require('express');

const router = express.Router();

const {
  validateMovieBody,
  validateMovieId,
} = require('../middlewares/validateJoi');

const {
  getAllMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getAllMovies);
router.post('/movies', validateMovieBody, createMovie);
router.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = router;
