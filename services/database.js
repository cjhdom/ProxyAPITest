/**
 * Created by jihwchoi on 2017-01-04.
 */
var mysql = require('mysql2/promise');
var Promise = require('bluebird');
var async = require('async');
var pool = mysql.createPool({
  Promise: Promise,
  host: '192.168.56.102',
  port: '3306',
  user: 'root',
  password: 'piru',
  database: 'proxyAPI'
});

module.exports = exports = {};

exports.fetch = (prxName, serverName) => {
  /*return new Promise((resolve, reject) => {
    const col = getDb().collection('servers');
    const proxyServer = {
      name: prxName
    };

    col.findOne(proxyServer)
      .then(response =>
        _.findAsync(response.servers, {name: serverName})
      )
      .then(response => resolve(response))
      .catch(response => reject(response));
  });*/
};

/**
 * 이거 쓰냐??
 * @param prxName
 */
exports.fetchInProxy = (prxName) => {
/*  return MongoClient.connect(url)
    .then(db => {
      const col = db.collection('proxyServers');
      const proxyServer = {
        name: prxName
      };

      return col.findOne(proxyServer);
    })
    .catch(response => response);*/
};

exports.fetchAll = () => {
  /*return new Promise((resolve, reject) => {
    const col = getDb().collection('servers');

    col.find().toArray()
      .then(response => resolve(response))
      .catch(response => reject(response));
  });*/
};

/**
 *
 * @param {String} prxName
 * @param {array} targetServers
 * @param {int} weight
 * @returns {bluebird|exports|module.exports}
 */
exports.update = (prxName, targetServers, weight) => {
/*  return new Promise((resolve, reject) => {
    const col = getDb().collection('servers');
    const filter = {
      name: prxName
    };

    col.findOne(filter)
      .then(proxyServer => {
        proxyServer.servers.forEach(server => {
          if (targetServers.indexOf(server.name) !== -1) {
            server.weight = weight;
          }
        });
        return proxyServer.servers;
      })
      .then(servers =>
        col.findOneAndUpdate(filter, {
          $set: {
            servers: servers
          }
        })
      )
      .then(response => {
        resolve({code: '000'})
      })
      .catch(response => reject(response));
  });*/
};

exports.updateServerinProxies = (proxyServerList, targetServerName, weight) => {
/*  return new Promise((resolve, reject) => {
    if (!proxyServerList || proxyServerList.length === 0) {
      return resolve({code: '000'});
    }

    const col = getDb().collection('servers');

    col.find({name: {$in : proxyServerList}}).toArray()
      .then(proxyServers => {
        async.each(proxyServers, (proxyServer, callbackEach) => {
          proxyServer.servers.forEach(server => {
            if (server.name === targetServerName) {
              server.weight = weight;
            }
          });

          col.findOneAndUpdate({name: proxyServer.name}, {
            $set: {
              servers: proxyServer.servers
            }
          })
            .then(response => callbackEach())
            .catch(response => callbackEach(err));
        }, (err) => {
          if (err) {
            throw new Error(err);
          } else {
            return true;
          }
        });
      })
      .then(response => {
        resolve({code: '000'})
      })
      .catch(response => reject(response));
  });*/
};

/**
 *
 * @param {boolean} onOff
 */
exports.setMultiProxy = (onOff) => {
/*  return new Promise((resolve, reject) => {
    const configCol = getDb().collection('config');

    configCol.findOneAndUpdate({fieldName: 'isMultiProxy'}, {$set: {value: onOff}})
      .then(response => {
        if (response.value === onOff) {
          resolve({code: '000', doNothing: true});
        } else {
          resolve({code: '000', doNothing: false});
        }
      })
      .catch(response => reject(response));
  });*/
};

exports.getMultiProxy = () => {
  return pool.query('select configValue from apiConfig where fieldName = \'isOverIDC\'')
    .then(result => Promise.resolve(result[0]))
    .catch(result => Promise.reject(result));

  /*return pool.query('select configValue from apiConfig where fieldName = \'isOverIDC\'')
    .then(result => Promise.resolve())*/
/*    .then(result => {
      console.log(JSON.stringify(result))
    })
    .catch(result => {
      console.log(result)
    });*/
};


//////////////////////////////////////////////////////////////////////////////////////
///////////////////// HELPERS ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
exports.resetDb = (callback) => {
  async.auto([
    (callbackAsync) => {
      pool.query('update weight set weight = 0')
        .then(callbackAsync(null))
        .catch(err => callbackAsync(err));
    },
    (callbackAsync) => {
      pool.query('update apiConfig set configValue = \'false\' where fieldName = \'isOverIDC\'')
        .then(callbackAsync(null))
        .catch(err => callbackAsync(err));
    },
    (callbackAsync) => {
      pool.query('update weight set weight = 1 where proxyServerIDC = serverIDC')
        .then(callbackAsync(null))
        .catch(err => callbackAsync(err));
    }
  ], (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {result: '000'});
    }
  });
};