/**
 * Created by jihwchoi on 2017-01-19.
 */
var dbtest = require('../tests/dbtest');
var fs = require('fs');

var Mngr = require('../tests/mngrtest');
var serverStatus = require('../models/serverStatus');
var serverList = require('../models/serverList');
var database = require('../services/database');

const path = require('path');
const rootPath = require('../config/config').rootPath;

exports = module.exports = {};

exports.init = (callback1) => {
  database.fetchAll()
    .then(rows => {
      database.fetchProxyServerList()
        .then(res => {
          console.log(JSON.stringify(res));
          var mngrs = [];

          res.forEach((proxyServer) => {
            var servers = rows.filter((row) =>
              row.proxyServerName === proxyServer.proxyServerName
            );

            mngrs.push(new Mngr(servers));
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
  var servers = null;

  database.fetchProxyServerList()
    .then(res => {
      proxyServers = res;
      return database.fetchServerList();
    })
    .then(res => {
      servers = res;
      serverList.initServerList(proxyServers, servers);
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