/**
 * Created by 지환 on 2016-11-10.
 */
var _ = require('lodash');
var Promise = require('bluebird');

function MngrTest(data) {
  this.serverList = data.server;
  this.isMultiProxy = data.isMultiProxy;
}

MngrTest.prototype.getStatus = (prxName, serverName) => {
  return new Promise((resolve, reject) => {
    var servers = _.find(this.serverList, { name: prxName });
    var server = _.find(servers, { id: serverName });

    if (typeof server != 'undefined') {
      console.log(server);
      return resolve(server.status);
    } else {
      console.log(server);
      return reject({code: '999', message: 'couldn\'t find the requested server'});
    }
  });
};

MngrTest.prototype.setStatus = (prxName, serverName, status) => {
  return new Promise((resolve, reject) => {
    var prxIdx = this.serverList.findIndex(server => server.name === prxName);
    var serverIdx = this.serverList[prxIdx].servers.findIndex(server => server.name === serverName);

    if (serverIdx === -1) {
      return reject({code: '999', message: 'couldn\'t set the status'});
    } else {
      this.serverList[prxIdx].servers[serverIdx].status = status;
      return resolve({code: '000'});
    }
  });
};

MngrTest.prototype.getIsMultiProxy = () => {
  return new Promise(resolve =>
    resolve(this.isMultiProxy)
  )
};

MngrTest.prototype.setIsMultiProxy = (status) => {
  this.isMultiProxy = status;
  return new Promise(resolve => this.isMultiProxy);
};

module.exports = exports = MngrTest;

