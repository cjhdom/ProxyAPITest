/**
 * Created by 지환 on 2016-11-10.
 */
var _ = require('lodash');
var Promise = require('bluebird');

function MngrTest(data) {
  this.serverList = data.servers;
  this.name = data.name;
  console.log('hi from ' + JSON.stringify(this.serverList));
  console.log('hi from ' + this.name);
}


MngrTest.prototype.getName = () => {
  console.log(this.name + this.serverList.length);
  return this.name;
};

MngrTest.prototype.getWeight = (serverName) => {
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

MngrTest.prototype.setWeight = (prxName, serverName, weight) => {
  return new Promise((resolve, reject) => {
    var prxIdx = this.serverList.findIndex(server => server.name === prxName);
    var serverIdx = this.serverList[prxIdx].servers.findIndex(server => server.id === serverName);

    if (serverIdx === -1) {
      return reject({code: '999', message: 'couldn\'t set the status'});
    } else {
      this.serverList[prxIdx].servers[serverIdx].weight = weight;
      return resolve({code: '000'});
    }
  });
};


module.exports = exports = MngrTest;



