/**
 * Created by 지환 on 2016-11-07.
 */
var async = require('async');
var _ = require('lodash');

module.exports = exports = {};

var servers = [];

exports.initServerList = (mngrsList) => {
  mngrsList.forEach((mngr) => {
    _.difference(mngr.servers.map((server) => server.id), servers)
      .forEach((server) => servers.push(server));
  });
};

exports.getServersList = (callback) => {
  callback(null, servers);
};