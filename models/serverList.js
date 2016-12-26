/**
 * Created by 지환 on 2016-11-07.
 */
var async = require('async');
var _ = require('lodash');

module.exports = exports = {};

var proxyServerList = [];

exports.initServerList = (mngrsList) => {
  proxyServerList = mngrsList;
};

exports.getAllServerList = () => {
  return proxyServerList;
};