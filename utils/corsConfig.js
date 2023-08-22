const corsConfig = {
  origin: [
    'https://localhost:3000',
    'http://localhost:3000',
    'http://api.moviematchup.nomoreparties.sbs',
    'https://api.moviematchup.nomoreparties.sbs',
    'http://moviematchup.nomoreparties.sbs',
    'https://moviematchup.nomoreparties.sbs',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = corsConfig;
