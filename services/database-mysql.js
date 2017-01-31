/**
 * Created by piru on 2017. 1. 20..
 */
var mysql = require('mysql2');

const config = require('../services/config');

var connection = mysql.createConnection(getConnectionOption(config.env));




function getConnectionOption(env) {
  switch (env) {
    case 'home': return {
      host: '52.231.38.182:3306',
      user: 'root',
      password: 'ebayescrow',
      database: 'proxyAPI'
    }
  }
}