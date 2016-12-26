/**
 * Created by 지환 on 2016-11-07.
 */
var async = require('async');
var _ = require('lodash');

module.exports = exports = {};

var db = null;
var mngrs = [];

exports.initServerStatus = (dbconn, mngrsList) => {
  db = dbconn;
  mngrs = mngrsList;
  //console.log(mngrs);
};

exports.getServerWeight = (prxName, serverName, callback) => {
  async.auto({
    dbWeight: (callback) => {
      db.fetch(prxName, serverName)
        .then(response => callback(null, response))
        .catch(response => callback(response));
    },
    mngrWeight: (callback) => {
      mngrs.some(mngr => {
        if (mngr.getName() === prxName) {
          mngr.getWeight(serverName)
            .then(server => callback(null, server))
            .catch(response => callback({err: 'oops'}));
          return true;
        }
        return false;
      });
    }
  }, (err, res) => {
    if (err) {
      if (res && res.mngrWeight) {
        return callback(err, res.mngrWeight);
      }
      return callback(err)
    } else {
      var dbWeight = res.dbWeight.weight;
      var mngrWeight = res.mngrWeight.weight;

      //DB와 실제 값이 다르면 실제 값을 리턴해주고 DB 값을 실제값으로 업데이트 해준다
      if (dbWeight !== mngrWeight) {
        db.update(prxName, serverName. weight)
          .then(() => false)
          .catch(() => false);
      }

      return callback(null, res.mngrWeight);
    }
  });
};

exports.getServerWeightAll = (callback) => {
  async.auto({
    dbWeight: (callback) => {
      db.fetchAll()
        .then(response => callback(null, response))
        .catch(response => callback(response));
    },
    mngrWeight: (callback) => {
      var result = mngrs.map(mngr => {
        mngr.getWeightAll().forEach(server => {

        })
      });

      if (!result) {
        return callback({message: 'hi'});
      } else {
        return callback(null, result);
      }
    }
  }, (err, res) => {
    if (err) {
      if (res && res.mngrWeight) {
        return callback(err, res.mngrWeight);
      }
      return callback(err)
    } else {
      var dbWeight = res.dbWeight.weight;
      var mngrWeight = res.mngrWeight.weight;

      //DB와 실제 값이 다르면 실제 값을 리턴해주고 DB 값을 실제값으로 업데이트 해준다
      if (dbWeight !== mngrWeight) {
        db.update(prxName, serverName. weight)
          .then(() => false)
          .catch(() => false);
      }

      return callback(null, res.mngrWeight);
    }
  });
};

exports.setServerWeight = (prxName, serverName, weight, callback) => {
  async.auto({
    isMultiProxy: (callback) => {
      db.getMultiProxy()
        .then(response => {
          callback(null, response);
        })
        .catch(response => {
          console.log(JSON.stringify(response));
          callback(new Error('could not get ismultiproxy'));
        });
    },
    setDb: ['isMultiProxy', (callback) => {
      if (isMultiProxy) {

      } else {
        db.update(prxName, serverName.weight)
          .then(response => callback(null, response))
          .catch(response => callback(response));
      }
    }],
    setMngr: ['isMultiProxy', (callback) => {
      mngrs.some(mngr => {
        if (mngr.getName() === prxName) {
          mngr.setWeight(prxName, serverName, weight)
            .then(server => callback(null, server))
            .catch(response => callback({err: 'oops'}));
          return true;
        }
        return false;
      });
    }]
  }, (err, res) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, res);
    }
  });
};

exports.getIsMultiProxy = (callback) => {
  db.getMultiProxy()
    .then(response => callback(null, response))
    .catch(response => callback(response));
};

exports.setMultiProxy = (onOff, callback) => {
  db.setMultiProxy(onOff)
    .then(response => {
      async.auto({
        setDb: (callback) => {
          async.each(mngrs, (mngr, callbackEach) => {
            var proxyIDC = mngr.IDC;
            var weight = onOff ? 1 : 0;
            var targetIDCServers = mngr.servers.filter(server => {
              return server.IDC !== proxyIDC;
            });

            var serverNameList = targetIDCServers.servers.map(server => server.name);
            db.update(mngr.name, serverNameList, weight)
              .then(() => callbackEach())
              .catch((res) => callbackEach(res));
          }, (err) => {
            if (err) {
              callback(err);
            } else {
              callback(null, {result: '000'});
            }
          });
        },
        setMngr: (callback) => {
          async.each(mngrs, (mngr, callbackEach) => {
            var proxyIDC = mngr.IDC;
            var weight = onOff ? 1 : 0;
            var targetIDCServers = mngr.servers.filter(server => {
              return server.IDC !== proxyIDC;
            });

            var serverNameList = targetIDCServers.servers.map(server => server.name);
            mngr.setWeight(serverNameList, weight)
              .then(server => callbackEach())
              .catch(response => callbackEach(new Error('error in setMngr in serverStatus.js')));
          }, (err) => {
            if (err) {
              callback(err);
            } else {
              callback(null, {result: '000'});
            }
          });

        }
      }, (err, res) => {
        if (err) {
          return callback(err);
        } else {
          return callback(null, res);
        }
      });
      callback(null, response);
    })
    .catch(response => {
      callback(response);
    });
};


