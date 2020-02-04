module.exports = {
  apps : [{
    name: 'QCM Training',
    script: 'npm',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'run start:prod',
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
