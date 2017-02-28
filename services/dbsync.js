var _ = require('lodash');
var Promise = require('bluebird');
var async = require('async');
var request = require('request');
var serverList = require('../models/serverList');

exports = module.exports = {};

exports.sync = (database, mngrs) => {
  return async.each(mngrs, (mngr, callback) => {
    mngr.getWeightAll()
      .then(res => {
        async.each(res, (serverService, callback2) => {
          database.updateSingleService(mngr.getName(), serverService.serverName, serverService.serviceName, serverService.weight)
            .then(callback2())
            .catch(res => callback2(res));
        }, (err) => {
          if (err) {
            return callback(err);
          } else {
            return callback();
          }
        });
      })
      .catch(res => callback(res));
  }, (err) => {
    if (err) {
      return new Promise.reject(err);
    }
  });
};
