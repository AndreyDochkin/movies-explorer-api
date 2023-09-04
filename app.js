const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, MONGO_URI } = require('./config');
const corsConfig = require('./utils/corsConfig');
const limiter = require('./utils/rateLimitConfig');

const app = express();

// Log incoming requests
app.use(requestLogger);

// Enable CORS
// app.use(cors(corsConfig));

app.use(cors({
  origin:'*',
  // origin: [
  //   'https://localhost:3000',
  //   'http://localhost:3000',
  //   'http://moviematchup.nomoreparties.sbs',
  //   'https://moviematchup.nomoreparties.sbs',
  //   'http://api.moviematchup.nomoreparties.sbs',
  //   'https://api.moviematchup.nomoreparties.sbs',
  // ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Set security headers
app.use(helmet());

// Apply rate limiting
// app.use(limiter);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

app.use(usersRouter);
app.use(moviesRouter);

// Handle not disributed routes
app.use('*', (req, res, next) => {
  next(new NotFoundError('Page not found'));
});

// Log errors
app.use(errorLogger);

// Handle joi celebrate validation errors
app.use(errors());

// Handle other errors
app.use(errorHandler);

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
