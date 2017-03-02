/**
 * Created by jihwchoi on 2017-01-19.
 */
const path = require('path');

exports = module.exports = {
  rootPath: path.normalize(__dirname + '/..'),
  port: 8989,
  env: process.env.NOVA_ENV,
  ip: process.env.NOVA_ENV === 'real' ? '172.30.161.173:8989' : 'localhost:8989'
};