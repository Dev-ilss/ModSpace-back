module.exports = {
  apps: [
    {
      name: 'Mokka-API-v2',
      script: 'dist/main.js',
      autorestart: true,
      watch: false,
      instances: 1,
      max_memory_restart: '2G'
    }
  ]
};
