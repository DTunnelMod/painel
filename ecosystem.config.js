const os = require('os');
const path = require('path');
const dotenv = require('dotenv');

const cpus = os.cpus().length;
const instances = (cpus > 2) ? Math.floor(cpus / 2) : 1;

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

module.exports = {
  apps: [
    {
      name: 'DTunnel',
      script: './build/index.js',
      instances,
      exec_mode: 'cluster',
    },
  ],
};
