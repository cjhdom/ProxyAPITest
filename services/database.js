/**
 * Created by jihwchoi on 2017-01-04.
 */

var mysql = require('mysql2/promise');
var Promise = require('promise');
var async = require('async');
var toBoolean = require('to-boolean');
var pool = mysql.createPool(getConnectionOption(require('../config/config').env));

module.exports = exports = {};

exports.fetchInProxy = (prxName) => {
  return pool.query('select * from weight where proxyServerName = ?', [
    prxName
  ]).then(res => res[0])
    .then((rows) => Promise.resolve(rows))
    .catch(result => Promise.reject(result));
};

exports.fetchAll = () => {
  return pool.query('select * from weight')
    .then(res => res[0])
    .then((rows) => Promise.resolve(rows))
    .catch(result => Promise.reject(result));
};

exports.fetchSingleService = (prxName, serverName, serviceName) => {
  return pool.query('select * from weight where proxyServerName = ? and serverName = ? and serviceName = ?', [
    prxName, serverName, serviceName
  ]).then(res => res[0])
    .then((rows) => Promise.resolve(rows[0]))
    .catch(result => Promise.reject(result));
};

exports.updateAllServices = (prxNameList, serverNameList, weight) => {
  return pool.query('update weight set weight = ? where proxyServerName in (?) AND serverName in (?)', [
    weight, prxNameList, serverNameList
  ]).then(() => Promise.resolve({result: '000'}))
    .catch(result => Promise.reject(result));
};

exports.updateByNotInWeightNO = (prxName, weightNOList, weight) => {
  return pool.query('update weight set weight = ? where proxyServerName = ? AND weightNO not in (?)', [
    weight, prxName, weightNOList
  ]).then(() => Promise.resolve({result: '000'}))
    .catch(result => Promise.reject(result));
};

exports.updateAllProxy = (prxName, IDC, weight) => {
  return pool.query('update weight set weight = ? where proxyServerName = ? AND serverIDC != ?', [
    weight, prxName, IDC
  ]).then((res) => {
    return Promise.resolve(res);
  })
    .catch(result => Promise.reject(result));
};

exports.updateSingleService = (prxNameList, serverName, serviceName, weight) => {
  return pool.query('update weight set weight = ? where proxyServerName in (?) AND ' +
    'serverName = ? AND serviceName = ?', [
    weight, prxNameList, serverName, serviceName
  ]).then(() => Promise.resolve({result: '000'}))
    .catch(result => Promise.reject(result));
};

exports.buildStart = (serverName, serviceName) => {
  return pool.query('update weight set beforeBuild = weight where serverName = ? AND serviceName = ?', [
    serverName, serviceName
  ]).then(() => {
    return pool.query('update weight set weight = 0 where serverName = ? AND serviceName = ?', [
      serverName, serviceName
    ]);
  }).then((res) => Promise.resolve(res))
    .catch(result => Promise.reject(result));
};

exports.buildFinished = (serverName, serviceName) => {
  return pool.query('update weight set weight = beforeBuild where serverName = ? AND ' +
    'serviceName = ?', [
    serverName, serviceName
  ]).then(() => {
    return pool.query('update weight set beforeBuild=NULL where beforeBuild != NULL')
  }).then(() =>
      Promise.resolve({result: '000'})
    ).catch(result => Promise.reject(result));
};

exports.setMultiProxy = (onOff) => {
  return exports.getMultiProxy().then(result => {
    if (result && toBoolean(result) === onOff) {
      return Promise.resolve({
        doNothing: true
      });
    } else {
      return pool.query('update apiConfig set configValue = ? where fieldName = \'isOverIDC\'', [onOff])
        .then(result => Promise.resolve(result[0]))
        .catch(result => Promise.reject(result));
    }
  });
};

exports.getMultiProxy = () => {
  return pool.query('select configValue from apiConfig where fieldName = \'isOverIDC\'')
    .then(res => res[0])
    .then((rows) => Promise.resolve(toBoolean(rows[0].configValue)))
    .catch(result => Promise.reject(result));
};

exports.fetchProxyServerList = () => {
  return pool.query('select * from proxyServer')
    .then(res => res[0])
    .then((rows) => Promise.resolve(rows))
    .catch(result => Promise.reject(result));
};

exports.fetchServerList = () => {
  return pool.query('select * from feServer')
    .then(res => res[0])
    .then((rows) => Promise.resolve(rows))
    .catch(result => Promise.reject(result));
};

exports.fetchServiceList = () => {
  return pool.query('select * from service')
    .then(res => res[0])
    .then((rows) => Promise.resolve(rows))
    .catch(result => Promise.reject(result));
};

//////////////////////////////////////////////////////////////////////////////////////
///////////////////// HELPERS ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
exports.resetDb = (callback) => {
  Promise.all([
    pool.query('update weight set weight = 0'),
    pool.query('update apiConfig set configValue = \'false\' where fieldName = \'isOverIDC\''),
    pool.query('update weight set weight = 1 where proxyServerIDC = serverIDC')
  ]).then(result => {
    return callback(null, result);
  })
};

function getConnectionOption(env) {
  switch (env) {
    case 'home':
      return {
        Promise,
        host: '52.231.38.182',
        port: '3306',
        user: 'root',
        password: 'ebayescrow',
        database: 'proxyAPI'
      };
    case 'local':
      return {
        Promise,
        host: '192.168.56.102',
        port: '3306',
        user: 'root',
        password: 'piru',
        database: 'proxyAPI'
      };
    case 'real':
      var realConf = require('../config/config-real');
      realConf.Promise = Promise;
      return realConf;
  }
}