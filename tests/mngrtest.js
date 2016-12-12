/**
 * Created by 지환 on 2016-11-10.
 */
var _ = require('lodash');
var Promise = require('bluebird');

function MngrTest(data) {
  this.serverList = data.servers;
  this.name = data.name;
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

MngrTest.prototype.setWeight = function (serverName, weight) {
  return new Promise((resolve, reject) => {
  var serverIdx = this.serverList.findIndex(server => server.id === serverName);

  if (serverIdx === -1) {
    return reject({code: '999', message: 'couldn\'t set the status'});
  } else {
    this.serverList[serverIdx].weight = weight;
    return resolve({code: '000'});
  }
  });
};


module.exports = exports = MngrTest;



