/**
 * Created by 지환 on 2016-11-10.
 */
var _ = require('lodash');
var Promise = require('bluebird');
var async = require('async');

function MngrTest(data) {
  this.serverList = data;
  this.name = data[0].proxyServerName;
  this.IDC = data[0].proxyServerIDC;
}

MngrTest.prototype.getName = function () {
  return this.name;
};

MngrTest.prototype.getWeight = function (serverName, serviceName) {
  return new Promise((resolve, reject) => {
    var server = _.find(this.serverList, {
      serverName: serverName,
      serviceName: serviceName
    });

    if (typeof server != 'undefined') {
      return resolve(server);
    } else {
      console.log('rejected!');
      return reject({code: '999', message: 'couldn\'t find the requested server ' + serverName});
    }
  });
};

MngrTest.prototype.getWeightAll = function () {
  return new Promise((resolve, reject) => {
    if (this.serverList && this.serverList.length > 0) {
      return resolve(this.serverList);
    } else {
      return reject({message: 'no server'});
    }
  });
};

MngrTest.prototype.setWeightAll = function (targetServerList, weight) {
  return new Promise((resolve, reject) => {
    console.log(JSON.stringify(targetServerList));
    async.each(targetServerList, (targetServer, callbackEach) => {
      var serverIdx = this.serverList.findIndex(server => server.serverName === targetServer);
      if (serverIdx === -1) {
        callbackEach(new Error('no such server'));
      } else {
        this.serverList.forEach(server => {
          if (server.serverName === targetServer) {
            server.weight = weight;
          }
        });

        callbackEach();
      }
    }, (err) => {
      if (err) {
        return reject(err);
      } else {
        return resolve({result: '000'});
      }
    });
  });
};

MngrTest.prototype.setWeight = function (serverName, serviceName, weight) {
  return new Promise((resolve, reject) => {
    var serverIdx = this.serverList.findIndex(server => server.serverName === serverName &&
      server.serviceName === serviceName);

    if (serverIdx === -1) {
      console.log(serverName + ',' + serviceName);
      return reject(new Error('no such server'));
    } else {
      console.log('in mngr set ' + serverName + ' and ' + serviceName + ' to ' + weight);
      this.serverList[serverIdx].weight = weight;
      return resolve();
    }
  });
};

module.exports = exports = MngrTest;



