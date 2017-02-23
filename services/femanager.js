/**
 * Created by 지환 on 2016-11-10.
 */
var _ = require('lodash');
var Promise = require('bluebird');
var async = require('async');
var request = require('request');
var serverList = require('../models/serverList');

function FeManager(data, ip) {
  this.serverList = data;
  this.name = data[0].proxyServerName;
  this.IDC = data[0].proxyServerIDC;
  this.ip = ip;
}

FeManager.prototype.getName = function () {
  return this.name;
};

FeManager.prototype.getWeight = function (serverName, serviceName) {
  return new Promise((resolve, reject) => {
    var server = _.find(this.serverList, {
      serverName: serverName,
      serviceName: serviceName
    });

    if (typeof server != 'undefined') {
      var url = 'http://' + this.ip + '/haproxy/getWeight?backend=' + serviceName.toLowerCase() +
        '&server=' + serverName.toLowerCase();

      request({
        url: url,
        method: 'get'
      }, (err, response, body) => {
        if (err) {
          return resolve(server);
        } else {
          server.weight = Number(JSON.parse(body).current);
          return resolve(server);
        }
      });
    } else {
      return reject({code: '999', message: 'couldn\'t find the requested server ' + serverName});
    }
  });
};

FeManager.prototype.getWeightAll = function () {
  return new Promise((resolve, reject) => {
    if (this.serverList && this.serverList.length > 0) {
      var url = 'http://' + this.ip + '/haproxy/stat';

      request({
        url: url,
        method: 'get'
      }, (err, response, body) => {
        if (err) {
          return reject({
            name: this.name,
            err,
            url
          });
        } else {
          var serversInProxy = JSON.parse(body);
          serversInProxy.forEach(serverInProxy => {
            var idx = _.findIndex(this.serverList, {
              serverName: serverInProxy.svname,
              serviceName: serverInProxy.pxname
            });

            if (idx !== -1) {
              //console.log(serverInProxy.svname + ',' + serverInProxy.pxname + ',' + serverInProxy.weight + ',' + this.name);
              this.serverList[idx].weight = serverInProxy.weight;
            }
          });
          return resolve(this.serverList);
        }
      });
    }
    else {
      return reject({message: 'no server'});
    }
  });
};

FeManager.prototype.setWeightAll = function (targetServerList, weight) {
  return new Promise((resolve, reject) => {
    async.each(targetServerList, (targetServer, callbackEach) => {
      this.setWeight(targetServer.serverName, targetServer.serviceName, weight)
        .then(() => callbackEach())
        .catch(res => callbackEach(res));
    }, (err) => {
      if (err) {
        return reject(err);
      } else {
        return resolve({result: '000'});
      }
    });
  });
};

FeManager.prototype.setWeight = function (serverName, serviceName, weight) {
  return new Promise((resolve, reject) => {
    var server = _.find(this.serverList, {
      serverName: serverName,
      serviceName: serviceName
    });

    if (typeof server != 'undefined') {
      var url = 'http://' + this.ip + '/haproxy/setWeight?backend=' + serviceName.toLowerCase() +
        '&server=' + serverName.toLowerCase() + '&weight=' + weight;

      request({
        url: url,
        method: 'get'
      }, (err, response, body) => {
        if (err) {
          return resolve(server);
        } else {
          server.weight = weight;
          // server.weight = Number(body.current);
          return resolve(server);
        }
      });
    } else {
      return reject({code: '999', message: 'couldn\'t find the requested server ' + serverName});
    }
  });
};

module.exports = exports = FeManager;



