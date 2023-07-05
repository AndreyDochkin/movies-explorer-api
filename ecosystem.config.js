module.exports = {
  apps: [
    {
      name: 'movies-api',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: true,
    },
  ],
};
