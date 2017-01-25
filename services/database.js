/**
 * Created by jihwchoi on 2017-01-04.
 */
var mysql = require('mysql2/promise');
var Promise = require('bluebird');
var async = require('async');
var toBoolean = require('to-boolean');
var pool = mysql.createPool({
  Promise: Promise,
  host: '192.168.56.102',
  port: '3306',
  user: 'root',
  password: 'piru',
  database: 'proxyAPI'
});

module.exports = exports = {};

exports.fetch = (prxName, serverName, serviceName) => {
  return pool.query('select * from weight where proxyServerName = ? AND serverName = ? AND serviceNAme = ?', [
    prxName, serverName, serviceName
  ]).then(([rows]) => Promise.resolve(rows))
    .catch(result => Promise.reject(result));
};

/**
 * 이거 쓰냐??
 * @param prxName
 */
exports.fetchInProxy = (prxName) => {
  return pool.query('select * from weight where proxyServerName = ?', [
    prxName
  ]).then(([rows]) => Promise.resolve(rows))
    .catch(result => Promise.reject(result));
};

exports.fetchAll = () => {
  return pool.query('select * from weight')
    .then(([rows]) => Promise.resolve(rows))
    .catch(result => Promise.reject(result));
};

exports.updateAllServices = (prxNameList, serverNameList, weight) => {
  return pool.query('update weight set weight = ? where proxyServerName in (?) AND serverName in (?)', [
    weight, prxNameList, serverNameList
  ]).then(() => Promise.resolve({result: '000'}))
    .catch(result => Promise.reject(result));
};

exports.updateSingleService = (prxNameList, serverNameList, serviceName, weight) => {
  return pool.query('update weight set weight = ? where proxyServerName in (?) AND ' +
    'serverName = (?) AND serviceName = ?', [
    weight, prxNameList, serverNameList, serviceName
  ]).then(() => Promise.resolve({result: '000'}))
    .catch(result => Promise.reject(result));
};

/**
 *
 * @param {boolean} onOff
 */
exports.setMultiProxy = (onOff) => {
  return exports.getMultiProxy().then(result => {
    if (result.configValue && toBoolean(result.configValue) === onOff) {
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
    .then(([rows]) => Promise.resolve(rows[0]))
    .catch(result => Promise.reject(result));
};

//////////////////////////////////////////////////////////////////////////////////////
///////////////////// HELPERS ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
exports.resetDb = (callback) => {
  Promise.all([
    pool.query('update weight set weight = 0').reflect(),
    pool.query('update apiConfig set configValue = \'false\' where fieldName = \'isOverIDC\'').reflect(),
    pool.query('update weight set weigh1t = 1 where proxyServerIDC = serverIDC').reflect()
  ]).then(result => {
    console.log(JSON.stringify(result));
    return callback(null, result);
  })
};