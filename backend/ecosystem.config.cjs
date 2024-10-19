module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'npm run start:dev',
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'queue-worker',
      script: 'node ace queue:listen',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
