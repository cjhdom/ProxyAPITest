/**
 * Created by piru on 2017. 1. 20..
 */
var mysql = require('mysql2');
var Promise = require('bluebird');

const config = require('../config/config');

//var connection = mysql.createConnection(getConnectionOption(config.env));

exports = module.exports = function getConnectionOption(config.env) {
  switch (env) {
    case 'home': return {
      Promise: Promise,
      host: '52.231.38.182',
      port: '3306',
      user: 'root',
      password: 'ebayescrow',
      database: 'proxyAPI'
    };
    case 'local': return {
      Promise: Promise,
      host: '192.168.56.102',
      port: '3306',
      user: 'root',
      password: 'piru',
      database: 'proxyAPI'
    };
  }
};