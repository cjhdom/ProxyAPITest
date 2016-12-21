/**
 * Created by 지환 on 2016-11-07.
 */
'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

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
 * @returns {bluebird|exports|module.exports}
 */
exports.fetch = (prxName, serverName) => {
  return new Promise((resolve, reject) => {
    var servers = _.find(serverList, {name: prxName});
    var server = _.find(servers.servers, {id: serverName});

    if (typeof server !== 'undefined') {
      return reject({err: 'error'});
//return resolve(server);
    } else {
      return reject({err: 'error'});
    }
  });
};

/**
 *
 * @returns {bluebird|exports|module.exports}
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
 * @returns {bluebird|exports|module.exports}
 */
exports.update = (prxName, targetServers, weight) => {
  return new Promise((resolve, reject) => {
    targetServers.forEach(targetServer => {
      var prxIdx = targetServer.findIndex(server => server.name === prxName);
      var serverIdx = targetServer[prxIdx].servers.findIndex(server => server.id === serverName);

      if (prxIdx === -1 || serverIdx === -1) {
        return reject({err: 'couldn\'t find the requested server'});
      } else {
        targetServer[prxIdx].servers[serverIdx].weight = weight;
      }
    });

    return resolve({code: '000'});
  });
};

/**
 *
 * @param {boolean} onOff
 */
exports.setMultiProxy = (onOff) => {
  new Promise((resolve) => {
    isMultiProxy = onOff;
    resolve({code: '000'});
  });
};

exports.getMultiProxy = () => {
  new Promise((resolve, reject) => {
    if (isMultiProxy) {
      resolve(isMultiProxy);
    } else {
      reject(new Error('test'));
    }
  });
};


exports.serverInit = (data) => {
  DbTest(data);
};