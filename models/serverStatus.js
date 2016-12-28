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
    dbWeight: (callbackAuto) => {
      db.fetchAll()
        .then(response => callbackAuto(null, response))
        .catch(response => callbackAuto(response));
    },
    mngrWeight: (callbackAuto) => {
      return callbackAuto(null, {});
      var result = mngrs.map(mngr => {
        mngr.getWeightAll()
          .then((response) => {
            return callbackAuto(null, response);
          })
          .catch((response) => {
            return callbackAuto(new Error('error in getServerWeightAll in mngrWeight'));
          });
      });
    }
  }, (err, res) => {
    if (err) {
      if (res && res.mngrWeight) {
        return callback(err, res.mngrWeight);
      }
      return callback(err)
    } else {
      /*var dbWeight = res.dbWeight.weight;
      var mngrWeight = res.mngrWeight.weight;

      //DB와 실제 값이 다르면 실제 값을 리턴해주고 DB 값을 실제값으로 업데이트 해준다
      if (dbWeight !== mngrWeight) {
        db.update(prxName, serverName. weight)
          .then(() => false)
          .catch(() => false);
      }*/

      return callback(null, res.dbWeight);
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
      if (!response.doNothing) {
        async.auto({
          setDb: (callbackAuto) => {
            async.each(mngrs, (mngr, callbackEach) => {
              var proxyIDC = mngr.IDC;
              var weight = onOff ? 1 : 0;
              var targetIDCServers = mngr.serverList.filter(server => {
                return server.IDC !== proxyIDC;
              });

              var serverNameList = targetIDCServers.map(server => server.id);
              db.update(mngr.name, serverNameList, weight)
                .then(() => callbackEach())
                .catch((res) => callbackEach(res));
            }, (err) => {
              if (err) {
                callbackAuto(new Error('error in async each setDb in setMultiProxy'));
              } else {
                callbackAuto(null, {result: '000'});
              }
            });
          },
          setMngr: (callbackAuto) => {
            async.each(mngrs, (mngr, callbackEach) => {
              var proxyIDC = mngr.IDC;
              var weight = onOff ? 1 : 0;
              var targetIDCServers = mngr.serverList.filter(server => {
                return server.IDC !== proxyIDC;
              });

              var serverNameList = targetIDCServers.map(server => server.id);
              mngr.setWeight(serverNameList, weight)
                .then(server => callbackEach())
                .catch(response => callbackEach(new Error('error in setMngr in serverStatus.js')));
            }, (err) => {
              if (err) {
                callbackAuto(new Error('error in async each setMngr in setMultiProxy'));
              } else {
                callbackAuto(null, {result: '000'});
              }
            });
          }
        }, (err, res) => {
          if (err) {
            console.log('err ' + JSON.stringify(err));
            return callback(err);
          } else {
            console.log('res ' + JSON.stringify(res));
            return callback(null, res);
          }
        });
      } else {
        console.log('nothing happened');
        callback();
      }
    })
    .catch(response => {
      callback(response);
    });
};


