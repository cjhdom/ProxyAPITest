/**
 * Created by 지환 on 2016-11-07.
 */
const async = require('async');
const _ = require('lodash');
const serverList = require('./serverList');

module.exports = exports = {};

var db = require('../services/database');
var mngrs = [];

exports.initServerStatus = (dbconn, mngrsList) => {
  db = dbconn;
  db = require('../services/database');
  mngrs = mngrsList;
};

exports.getDbWeightAll = (callback) => {
  db.fetchAll()
    .then(response => callback(null, response))
    .catch(response => callback(response));
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
      var result = [];
      async.each(mngrs, (mngr, cbEach) => {
        return mngr.getWeightAll()
          .then(response => {
            result.push(response);
            return cbEach();
          })
          .catch(response => cbEach(new Error('error in getServerWeightAll in mngrWeight ' + JSON.stringify(response))));
      }, (err) => {
        if (err) {
          callbackAuto(err);
        } else {
          callbackAuto(null, _.flatten(result));
        }
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

      return callback(null, res.mngrWeight);
    }
  });
};

/**
 * 모든 프록시에 대해 요청한 서버의 weight를 조정한다.
 * multi proxy모드가 꺼져있는 경우 해당 IDC의 프록시만 제어한다.
 * @param serverName
 * @param callback
 */
exports.setServerWeight = (serverName, serviceName, callback) => {
  async.auto({
    isMultiProxy: (callback) => {
      db.getMultiProxy()
        .then(response => {
          return callback(null, response);
        })
        .catch(response => callback(response));
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
              mngr.getWeight(serverName, serviceName)
                .then(server => {
                  result.push(server);
                  callbackEach();
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
              // @todo: filter instead
              proxyServerList.forEach(proxyServer => {
                var proxyIDC = proxyServer.IDC;
                var serverIDC = server.IDC;

                if (!results.isMultiProxy && proxyIDC !== serverIDC) {
                  return false;
                } else {
                  targetProxyServerList.push(proxyServer.name);
                }
              });

              db.updateSingleService(targetProxyServerList, serverName, serviceName, results.weight)
                .then(response => {
                  callbackAsync(null, response);
                  return null;
                })
                .catch(response => callbackAsync(response));
            }
          });
        }
      });
    }],
    setMngr: ['isMultiProxy', 'weight', (results, callbackAsync) => {
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
              mngr.setWeight(serverName, serviceName, results.weight)
                .then(server => callbackEach())
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
                  return callbackEach();
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
            if (!onOff) {
              return callbackAsync(null, []);
            }

            // 프록시 서버의 서버 리스트들은 2차원 배열이다
            // 요걸 1차원 배열로 flatten
            var allServersList = _.flatten(results.getMngrs);
            var result = [];

            serverList.getServersList((err, res) => {
              if (err) {
                return callbackAsync(err);
              } else {
                res.forEach(server => {
                  var serversToCheck = _.filter(allServersList, {
                    serverName: server.serverName,
                    serviceName: server.serviceName
                  });

                  var getWeight = serversToCheck.every(server =>
                    server.weight === 0
                  );

                  if (getWeight) {
                    result = _.concat(result, serversToCheck);
                  }
                });

                return callbackAsync(null, result);
              }
            });
          }],
          setDb: ['getMngrs', 'skipServers', (results, callbackAuto) => {
            /*
             @todo: why added getMngrs? to not call unnecessary servers change logic!
             */
            async.each(mngrs, (mngr, callbackEach) => {
              var weight = onOff ? 1 : 0;

              if (results.skipServers && results.skipServers.length > 0) {
                var weightNoList = results.skipServers.map(skipServer => skipServer.weightNO);

                db.updateByNotInWeightNO(mngr.name, weightNoList, weight)
                  .then(() => {
                    return callbackEach();
                  })
                  .catch((res) => callbackEach(res))
              } else {
                db.updateAllProxy(mngr.name, mngr.IDC, weight)
                  .then(() => {
                    return callbackEach();
                  })
                  .catch((res) => callbackEach(res))
              }
            }, (err) => {
              if (err) {
                callbackAuto(err);
              } else {
                callbackAuto(null, {result: '000'});
              }
            });
          }],
          setMngr: ['skipServers', 'getMngrs', (results, callbackAuto) => {
            console.log(`skipResult is ${results.skipServers}`);
            async.each(mngrs, (mngr, callbackEach) => {
              var weight = onOff ? 1 : 0;
              var serverList = _.chain(mngr.serverList)
                .filter(server => server.serverIDC !== mngr.IDC)
                .difference(results.skipServers)
                .value();

              mngr.setWeightAll(serverList, weight)
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
        return callback();
      }
    })
    .catch(response => {
      return callback(response);
    });
};

/**
 * 하나의 서버에 weight 조정
 * @param prxName
 * @param serverName
 * @param weight
 * @param callback
 */
exports.setSingleServerWeight = (prxName, serverName, serviceName, weight, callback) => {
  async.auto({
    setDb: (callback) => {
      db.updateSingleService(prxName, serverName, serviceName, weight)
        .then(response => callback(null, response))
        .catch(response => callback(response));
    },
    setMngr: (callback) => {
      mngrs.some(mngr => {
        if (mngr.getName() === prxName) {
          mngr.setWeight(serverName, serviceName, weight)
            .then(server => callback(null, server))
            .catch(response => callback(response));
          return true;
        }
        return false;
      });
    }
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
 * @param prxName
 * @param serverName
 * @param callback
 */
exports.getServerWeight = (prxName, serverName, serviceName, callback) => {
  async.auto({
    dbWeight: (callback) => {
      db.fetchSingleService(prxName, serverName, serviceName)
        .then(response => callback(null, response))
        .catch(response => callback(response));
    },
    mngrWeight: (callback) => {
      mngrs.some(mngr => {
        if (mngr.getName() === prxName) {
          mngr.getWeight(serverName, serviceName)
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
        db.updateSingleService(prxName, serverName, serviceName, mngrWeight)
          .then(() => false)
          .catch(() => false);
      }

      return callback(null, res.mngrWeight);
    }
  });
};

/**
 * 하나의 서버에 weight 조정
 * @param prxName
 * @param serverName
 * @param weight
 * @param callback
 */
exports.buildStart = (serverName, serviceName, callback) => {
  // 빌드시작할 때 무조건 weight 0으로
  const weight = 0;

  async.auto({
    isMultiProxy: (callbackAsync) => {
      db.getMultiProxy()
        .then(response => {
          callbackAsync(null, response);
          return null;
        })
        .catch(response => {
          callbackAsync(response);
          return null;
        });
    },
    setDb: ['isMultiProxy', (results, callbackAsync) => {
      db.buildStart(serverName, serviceName)
        .then(response => {
          callbackAsync(null, response);
          return null;
        })
        .catch(response => {
          callbackAsync(response);
          return null;
        });
    }],
    setMngr: ['isMultiProxy', (results, callbackAsync) => {
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
              mngr.setWeight(serverName, serviceName, weight)
                .then(server => callbackEach())
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

exports.buildEnd = (serverName, serviceName, callback) => {
  var isMultiProxy = null;
  serverList.getServer(serverName, (serverListError, server) => {
    if (serverListError) {
      return callback(serverListError);
    } else {
      db.getMultiProxy()
        .then(res => {
          isMultiProxy = res;
          return db.buildFinished(serverName, serviceName);
        })
        .then(res => {
          async.each(mngrs, (mngr, callbackEach) => {
            if (!isMultiProxy && mngr.IDC !== server.IDC) {
              return callbackEach();
            } else {
              db.fetchSingleService(mngr.name, serverName, serviceName)
                .then(dbRes => {
                  // buildFinished에서 buildBefore값을 날려버리기 때문에 여기선 현재 값으로 업데이트해줘야한다
                  if (dbRes.weight === 1) {
                    return mngr.setWeight(serverName, serviceName, dbRes.weight)
                  } else {
                    return null;
                  }
                  return null;
                })
                .then(() => callbackEach())
                .catch(res => callbackEach(res));
            }
          }, (err) => {
            if (err) {
              return Promise.reject(err);
            } else {
              return Promise.resolve();
            }
          });
        })
        .then(res => callback(null, {code: '000'}))
        .catch(res => callback(res));
    }
  });
};