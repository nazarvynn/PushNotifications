require('rootpath')();
global.__basedir = __dirname;

const app = require('src/app');
app.start();