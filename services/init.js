/**
 * Created by jihwchoi on 2017-01-19.
 */
var dbtest = require('../tests/dbtest');
var fs = require('fs');

var DevMngr = require('../tests/mngrtest');
var RealMngr = require('../services/femanager');
var serverStatus = require('../models/serverStatus');
var serverList = require('../models/serverList');
var database = require('../services/database');
var dbsync = require('../services/dbsync');

const path = require('path');
//const config = require('')
const rootPath = require('../config/config').rootPath;
const env = require('../config/config').env;

exports = module.exports = {};

exports.init = () => {
  switch (env) {
    case 'home':
    case 'local':
      return initDev();
    case 'real':
      return initReal();
  }
};

function initReal() {
  var proxyServers = null;
  var mngrs = [];

  database.fetchAll()
    .then(rows => {
      return database.fetchProxyServerList()
        .then(res => {

          res.forEach((proxyServer) => {
            var servers = rows.filter((row) =>
              row.proxyServerName === proxyServer.proxyServerName
            );

            mngrs.push(new RealMngr(servers, proxyServer.ip));
          });

          serverStatus.initServerStatus(null, mngrs);
          return Promise.resolve();
        })
        .catch(err => {
          return Promise.reject(err);
        });
    })
    .then(dbsync.sync(database, mngrs))
    .then(() => database.fetchProxyServerList())
    .then(res => {
      proxyServers = res;
      return database.fetchServerList();
    })
    .then(res => {
      serverList.initServerList(proxyServers, res);
    })
    .catch(err => {
      console.log(err);
    });
}

function initDev() {
  var proxyServers = null;

  database.fetchAll()
    .then(rows => {
      return database.fetchProxyServerList()
        .then(res => {
          var mngrs = [];

          res.forEach((proxyServer) => {
            var servers = rows.filter((row) =>
              row.proxyServerName === proxyServer.proxyServerName
            );

            mngrs.push(new DevMngr(servers, proxyServer.ip));
          });

          serverStatus.initServerStatus(null, mngrs);
          return Promise.resolve();
        })
        .catch(err => {
          return Promise.reject(err);
        });
    })
    .then(() => database.fetchProxyServerList())
    .then(res => {
      proxyServers = res;
      return database.fetchServerList();
    })
    .then(res => {
      serverList.initServerList(proxyServers, res);
    })
    .catch(err => {
      console.log(err);
    });
}

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