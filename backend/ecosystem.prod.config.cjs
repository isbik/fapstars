module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'npm run start',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'queue-worker',
      script: 'node ace queue:listen',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
