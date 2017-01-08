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
    var server = _.find(this.serverList, { name: serverName });
    if (typeof server != 'undefined') {
      return resolve(server);
    } else {
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

MngrTest.prototype.setWeight = function (targetServerList, weight) {
  console.log(' moi ' + JSON.stringify(targetServerList));
  return new Promise((resolve, reject) => {
    async.each(targetServerList, (targetServer, callbackEach) => {
      var serverIdx = this.serverList.findIndex(server => server.name === targetServer);

      if (serverIdx === -1) {
        callbackEach(new Error('no such server'));
      } else {
        console.log('in mngr set ' + targetServer + ' to ' + weight);
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



