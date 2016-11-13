/**
 * Created by 지환 on 2016-11-07.
 */
var _ = require('lodash');
var Promise = require('bluebird');

var serverList = [];
var isMultiProxy = null;

function DbTest(data) {
  serverList = data.servers;
  isMultiProxy = data.isMultiProxy;
}

module.exports = exports = {
  fetch: (prxName, serverName) => {
    return new Promise((resolve, reject) => {
      var servers = _.find(serverList, {name: prxName});
      var server = _.find(servers, {id: serverName});

      if (typeof server != 'undefined') {
        console.log(server);
        return resolve(server);
      } else {
        console.log(server);
        return reject({err: 'error'});
      }
    });
  },
  update: (prxName, serverName, status) => {
    return new Promise((resolve, reject) => {
      var prxIdx = serverList.findIndex(server => server.name === prxName);
      var serverIdx = serverList[prxIdx].servers.findIndex(server => server.name === serverName);

      if (serverIdx === -1) {
        return reject({err: 'error'});
      } else {
        serverList[prxIdx].servers[serverIdx].status = status;
        return resolve({code: '000'});
      }
    });
  },
  serverInit: (data) => {
    DbTest(data);
  }
};