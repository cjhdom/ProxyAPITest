/**
 * Created by 지환 on 2016-11-07.
 */
var async = require('async');
var _ = require('lodash');

module.exports = exports = {};

var servers = null;
var proxyServers = null;

exports.initServerList = (mngrsList) => {
  servers = mngrsList[0].servers.map((server) => {
    return {
      name: server.name,
        IDC: server.IDC
    };
  });

  proxyServers = mngrsList.map((mngr) => {
    return {
      name: mngr.name,
      IDC: mngr.IDC
    };
  });
};

exports.getServersList = (callback) => {
  if (!servers || servers.length === 0) {
    callback(new Error('server list not initialized!'));
  } else {
    callback(null, servers);
  }
};

exports.getProxyServerList = (callback) => {
  if (!proxyServers || proxyServers.length === 0) {
    callback(new Error('proxy server list not initialized!"'));
  } else {
    callback(null, proxyServers);
  }
};

exports.getServer = (serverName, callback) => {
  var server = _.find(servers, { name: serverName });

  if (typeof server === 'undefined') {
    callback(new Error('no such server'));
  } else {
    callback(null, server);
  }
};