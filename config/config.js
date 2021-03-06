/**
 * Created by jihwchoi on 2017-01-19.
 */
const path = require('path');

exports = module.exports = {
  rootPath: path.normalize(__dirname + '/..'),
  port: 8080,
  env: process.env.NOVA_ENV,
  ip: process.env.NOVA_ENV === 'real' ? 'novaproxyapi.com' : 'localhost:8080'
};