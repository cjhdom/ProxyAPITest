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
  db = require('../services/database');
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
    isMultiProxy: (callbackAsync) => {
      db.getMultiProxy()
        .then(response => {
          return callbackAsync(null, response);
        })
        .catch(response => {
          return callbackAsync(response);
        });
    },
    getMngrs: ['isMultiProxy', (results, callbackAsync) => {
      var result = [];

      async.each(mngrs, (mngr, callbackEach) => {
        serverList.getServer(serverName, (err, res) => {
          if (err) {
            return callbackEach(err);
          } else {
            var proxyIDC = mngr.IDC;
            var serverIDC = res.IDC;

            if (!results.isMultiProxy && proxyIDC !== serverIDC) {
              return callbackEach();
            } else {
              mngr.getWeight(serverName)
                .then(server => {
                  result.push(server);
                  return callbackEach();
                })
                .catch(response => callbackEach(err));
            }
          }
        });
      }, (err) => {
        if (err) {
          return callbackAsync(err);
        } else {
          return callbackAsync(null, result);
        }
      });
    }],
    weight: ['getMngrs', (results, callbackAsync) => {
      var getWeight = results.getMngrs.every((server, index, array) =>
        index === 0 || server.weight === array[index - 1].weight
      );

      if (getWeight) {
        return callbackAsync(null, results.getMngrs[0].weight === 0 ? 1 : 0);
      } else {
        return callbackAsync(new Error('weight not set! ' + getWeight));
      }
    }],
    setDb: ['isMultiProxy', 'weight', (results, callbackAsync) => {
      var targetProxyServerList = [];

      serverList.getServer(serverName, (err1, server) => {
        if (err1) {
          callbackAsync(err1);
        } else {
          serverList.getProxyServerList((err2, proxyServerList) => {
            if (err2) {
              callbackAsync(err2);
            } else {
              proxyServerList.forEach(proxyServer => {
                var proxyIDC = proxyServer.IDC;
                var serverIDC = server.IDC;

                if (!results.isMultiProxy && proxyIDC !== serverIDC) {
                  return false;
                } else {
                  targetProxyServerList.push(proxyServer.name);
                }
              });

              db.updateServerinProxies(targetProxyServerList, serverName, results.weight)
                .then(response => callbackAsync(null, response))
                .catch(response => callbackAsync(response));
            }
          });
        }
      });
    }],
    setMngr: ['isMultiProxy', 'weight', (results, callbackAsync) => {
      /**
       * @todo 여기에 딱 필요한 mngr에게 만 setWeight 호출하도록!
       */
      serverList.getServer(serverName, (err, res) => {
        if (err) {
          return callbackAsync(err);
        } else {
          async.each(mngrs, (mngr, callbackEach) => {
            var proxyIDC = mngr.IDC;
            var serverIDC = res.IDC;

            if (!results.isMultiProxy && proxyIDC !== serverIDC) {
              return callbackEach();
            } else {
              mngr.setWeight([serverName], results.weight)
                .then(server => {
                  //result.push(server);
                  return callbackEach();
                })
                .catch(response => callbackEach(err));
            }
          }, (err) => {
            if (err) {
              callbackAsync(err);
            } else {
              callbackAsync(null, {message: 'success'});
            }
          });
        }
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
          getMngrs: (callbackAsync) => {
            // 멀티 프록시를 끌 땐 건너뛸 서버가 없다
            if (!onOff) {
              return callbackAsync();
            }
            var result = [];

            async.each(mngrs, (mngr, callbackEach) => {
              mngr.getWeightAll()
                .then(response => {
                  result.push(response);
                  callbackEach();
                })
                .catch(response => callbackEach(response));
            }, (err) => {
              if (err) {
                return callbackAsync(err);
              } else {
                return callbackAsync(null, result);
              }
            });
          },
          skipServers: ['getMngrs', (results, callbackAsync) => {
            // 멀티 프록시를 끌 땐 건너뛸 서버가 없다
            // @todo: 끌 땐 이미 꺼진 서버는 request 안날리도록 해보자
            if (!onOff) {
              return callbackAsync();
            }

            var allServersList = [];
            var result = [];

            // 프록시 서버의 서버 리스트들은 2차원 배열이다
            // 요걸 1차원 배열로 flatten
            results.getMngrs.forEach(prxServer =>
              allServersList = allServersList.concat(prxServer)
            );

            serverList.getServersList((err, res) => {
              if (err) {
                callbackAsync(err);
              } else {
                res.forEach(server => {
                  var serversToCheck = _.filter(allServersList, {name: server.name});
                  var getWeight = serversToCheck.every(server =>
                    server.weight === 0
                  );

                  if (getWeight) {
                    result.push(server.name);
                  }
                });
              }
            });

            callbackAsync(null, result);
          }],
          setDb: ['getMngrs', 'skipServers', (results, callbackAuto) => {
            /*
             @todo: why added getMngrs? to not call unnecessary servers
             */
            async.each(mngrs, (mngr, callbackEach) => {
              var proxyIDC = mngr.IDC;
              var weight = onOff ? 1 : 0;
              var targetServers = mngr.serverList.filter(server => {
                return server.IDC !== proxyIDC;
              });

              var serverNameList = targetServers.map(server => server.name);
              serverNameList = _.difference(serverNameList, results.skipServers);

              db.update(mngr.name, serverNameList, weight)
                .then(() => callbackEach())
                .catch((res) => callbackEach(res));
            }, (err) => {
              if (err) {
                callbackAuto(err);
              } else {
                callbackAuto(null, {result: '000'});
              }
            });
          }],
          setMngr: ['skipServers', 'getMngrs', (results, callbackAuto) => {
            async.each(mngrs, (mngr, callbackEach) => {
              var proxyIDC = mngr.IDC;
              var weight = onOff ? 1 : 0;
              var targetIDCServers = mngr.serverList.filter(server => {
                return server.IDC !== proxyIDC;
              });

              var serverNameList = targetIDCServers.map(server => server.name);
              serverNameList = _.difference(serverNameList, results.skipServers);

              mngr.setWeight(serverNameList, weight)
                .then(server => callbackEach())
                .catch(response => callbackEach(response));
            }, (err) => {
              if (err) {
                callbackAuto(err);
              } else {
                callbackAuto(null, {result: '000'});
              }
            });
          }]
        }, (err, res) => {
          if (err) {
            return callback(err);
          } else {
            return callback(null, res);
          }
        });
      } else {
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