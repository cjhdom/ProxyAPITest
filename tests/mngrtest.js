/**
 * Created by 지환 on 2016-11-10.
 */
var _ = require('lodash');
var Promise = require('bluebird');
var async = require('async');

function MngrTest(data) {
  this.serverList = data.servers;
  this.name = data.name;
  this.IDC = data.IDC;
}

MngrTest.prototype.getName = function () {
  return this.name;
};

MngrTest.prototype.getWeight = function (serverName) {
  return new Promise((resolve, reject) => {
    var server = _.find(this.serverList, { id: serverName });

    if (typeof server != 'undefined') {
      console.log(server);
      return resolve(server);
    } else {
      console.log(server);
      return reject({code: '999', message: 'couldn\'t find the requested server'});
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

MngrTest.prototype.setWeight = function (targetServerList, weight) {
  return new Promise((resolve, reject) => {
    async.each(targetServerList, (targetServer, callbackEach) => {
      var serverIdx = this.serverList.findIndex(server => server.name === targetServer);

      if (serverIdx === -1) {
        callbackEach(new Error('no such server'));
      } else {
        this.serverList[serverIdx].weight = weight;
        callbackEach();
      }
    }, (err) => {
      if (err) {
        return reject(new Error('error in setWeight mngrtest'));
      } else {
        return resolve({result: '000'});
      }
    });
  });
};


module.exports = exports = MngrTest;



