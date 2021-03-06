/**
 * Created by 지환 on 2016-11-07.
 */
'use strict';

var _ = require('lodash');
var Promise = require('promise');

var serverList = [];
var isMultiProxy = null;

function DbTest(data) {
  serverList = data.servers;
  isMultiProxy = data.isMultiProxy;
}

module.exports = exports = {};

/**
 *
 * @param {String} prxName
 * @param {String} serverName
 * @returns {promise|exports|module.exports}
 */
exports.fetch = (prxName, serverName) => {
  return new Promise((resolve, reject) => {
    var servers = _.find(serverList, {name: prxName});
    var server = _.find(servers.servers, {id: serverName});

    if (typeof server === 'undefined') {
      return reject({err: 'error'});
    } else {
      return resolve(server);
    }
  });
};

exports.fetchInProxy = (prxName) => {
  return new Promise((resolve, reject) => {
    var prxServer = _.find(serverList, {name: prxName});

    if (typeof prxServer === 'undefined') {
      return reject(new Error('no prx server'));
    } else {
      return resolve(prxServer);
    }
  });
};

/**
 *
 * @returns {promise|exports|module.exports}
 */
exports.fetchAll = () => {
  return new Promise((resolve, reject) => {
    if (serverList.length > 0) {
      return resolve(serverList);
    } else {
      return reject({err: 'there is no server!'});
    }
  });
};

/**
 *
 * @param {String} prxName
 * @param {array} targetServers
 * @param {int} weight
 * @returns {promise|exports|module.exports}
 */
exports.update = (prxName, targetServers, weight) => {
  return new Promise((resolve, reject) => {
    targetServers.forEach(targetServer => {
      var prxIdx = serverList.findIndex(server => server.name === prxName);

      if (prxIdx === -1) {
        return reject({err: 'could not find the requested server'});
      } else {
        var serverIdx = serverList[prxIdx].servers.findIndex(server => server.name === targetServer);

        if (serverIdx === -1) {
          return reject({err: 'couldn\'t find the requested server'});
        } else {
          serverList[prxIdx].servers[serverIdx].weight = weight;
        }
      }
    });

    return resolve({code: '000'});
  });
};

exports.updateServersInAllProxy = (targetServer, weight) => {
  return new Promise((resolve, reject) => {
    serverList.forEach(proxyServer => {
      var serverIdx = _.findIndex(proxyServer.servers, { name: targetServer });

      if (serverIdx !== -1) {
        var isSameIDC = proxyServer.servers[serverIdx].IDC === proxyServer.IDC;

        if (!isMultiProxy && !isSameIDC) {
          return false;
        } else {
          proxyServer.servers[serverIdx].weight = weight;
        }
      }
    });

    resolve();
  });
};

/**
 *
 * @param {boolean} onOff
 */
exports.setMultiProxy = (onOff) => {
  return new Promise((resolve) => {
    if (isMultiProxy === onOff) {
      return resolve({code: '000', doNothing: true});
    } else {
      isMultiProxy = onOff;
      return resolve({code: '000', doNothing: false});
    }
  });
};

exports.getMultiProxy = () => {
  return Promise.resolve(isMultiProxy);
};


exports.serverInit = (data) => {
  DbTest(data);
};