/**
 * Created by 지환 on 2016-11-07.
 */
const async = require('async');
const _ = require('lodash');
const serverList = require('./serverList');

module.exports = exports = {};

var db = null;
var mngrs = [];

exports.initServerStatus = (dbconn, mngrsList) => {
  db = dbconn;
  mngrs = mngrsList;
};

/**
 * 모든 서버의 weight를 가져오는 것
 * @param callback
 */
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
      // @todo db와 싱크 맞춰주는 작업이 필요 할듯...
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

/**
 * 모든 프록시에 대해 요청한 서버의 weight를 조정한다.
 * multi proxy모드가 꺼져있는 경우 해당 IDC의 프록시만 제어한다.
 * @param serverName
 * @param callback
 */
exports.setServerWeight = (serverName,  callback) => {
  async.auto({
    isMultiProxy: (callback) => {
      db.getMultiProxy()
        .then(response => {
          callback(null, response);
        })
        .catch(response => {
          callback(response);
        });
    },
    getMngrs: ['isMultiProxy', (callback) => {
      var result = [];

      async.each(mngrs, (mngr, callbackEach) => {
        // 멀티 프록시 모드가 아닌 경우 다른 IDC로의 것은 스킵
        if (!isMultiProxy) {
          serverList.getServer((serverName, (err, res) => {
            if (err) {
              return callbackEach(true);
            } else {
              var proxyIDC = mngr.IDC;
              var serverIDC = res.IDC;

              if (proxyIDC === serverIDC) {
                return callbackEach();
              }
            }
          }));
        }

        mngr.getWeight(serverName)
          .then(server => {
            result.push(server);
            return callbackEach();
          })
          .catch(response => callbackEach(new Error('error in setMngr in serverStatus.js')));
      }, (err) => {
        if (err) {
          callback(new Error('error in async each setMngr in setMultiProxy'));
        } else {
          callback(null, result);
        }
      });
    }],
    setDb: ['isMultiProxy', 'getMngrs', (callback) => {
      /**
       * @todo is it right for db to find correct proxy servers?
       */
      db.updateServersInAllProxy(serverName, weight)
        .then(response => callback(null, response))
        .catch(response => callback(response));
    }],
    setMngr: ['isMultiProxy', 'getMngrs', (callback) => {
      mngrs.some(mngr => {
        if (mngr.getName() === prxName) {
          mngr.setWeight(serverName, weight)
            .then(server => callback(null, server))
            .catch(response => callback(response));
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

              var serverNameList = targetIDCServers.map(server => server.name);
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

              var serverNameList = targetIDCServers.map(server => server.name);
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 하나의 서버에 weight 조정
 * @todo 이거 진짜 쓸일이 있을까?
 * @param prxName
 * @param serverName
 * @param weight
 * @param callback
 */
exports.setSingleServerWeight = (prxName, serverName, weight, callback) => {
  async.auto({
    isMultiProxy: (callback) => {
      db.getMultiProxy()
        .then(response => {
          callback(null, response);
        })
        .catch(response => {
          callback(response);
        });
    },
    setDb: ['isMultiProxy', (callback) => {
      if (isMultiProxy) {

      } else {
        db.update(prxName, serverName, weight)
          .then(response => callback(null, response))
          .catch(response => callback(response));
      }
    }],
    setMngr: ['isMultiProxy', (callback) => {
      mngrs.some(mngr => {
        if (mngr.getName() === prxName) {
          mngr.setWeight(serverName, weight)
            .then(server => callback(null, server))
            .catch(response => callback(response));
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

/**
 * 하나의 서버에 대한 weight 가져오기
 * @todo 요것 진짜 쓸일이 있을까?
 * @param prxName
 * @param serverName
 * @param callback
 */
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
            .catch(response => callback(response));
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