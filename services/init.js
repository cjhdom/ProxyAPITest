/**
 * Created by jihwchoi on 2017-01-19.
 */
var dbtest = require('../tests/dbtest');
var fs = require('fs');

var Mngr = require('../tests/mngrtest');
//var Mngr = require('../services/femanager');
var serverStatus = require('../models/serverStatus');
var serverList = require('../models/serverList');
var database = require('../services/database');

const path = require('path');
const rootPath = require('../config/config').rootPath;

exports = module.exports = {};

exports.init = () => {
  database.fetchAll()
    .then(rows => {
      database.fetchProxyServerList()
        .then(res => {
          var mngrs = [];

          res.forEach((proxyServer) => {
            var servers = rows.filter((row) =>
              row.proxyServerName === proxyServer.proxyServerName
            );

            mngrs.push(new Mngr(servers, proxyServer.ip));
          });

          serverStatus.initServerStatus(null, mngrs);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    })
    .catch(err => {
      console.log(err);
    });

  var proxyServers = null;

  database.fetchProxyServerList()
    .then(res => {
      proxyServers = res;
      return database.fetchServerList();
    })
    .then(res => {
      serverList.initServerList(proxyServers, res);
    })
    .catch(res => {
      console.log(res);
    });
};

function getUrl() {
  const env = process.env.NOVA_ENV;
  switch (env) {
    case 'local':
      return '192.168.56.102:3306';
    case 'dev':
      return 'mongodb://localhost:27017/proxyAPI';
    case 'real':
      return 'mongodb://localhost:27017/proxyAPI';
    case 'home':
      return '52.231.38.182:3306';
    default:
      return '';
  }
}