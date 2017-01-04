/**
 * Created by jihwchoi on 2017-01-04.
 */
const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
const Promise = require('bluebird');
Promise.promisifyAll(_);
const url = getUrl();

exports.fetch = (prxName, serverName) => {
  return MongoClient.connect(url)
    .then(db => {
      const col = db.collection('proxyServers');
      const proxyServer = {
        name: prxName
      };

      return col.findOne(proxyServer);
    })
    .then(proxyServer =>
      _.findAsync(proxyServer.servers, {name: serverName})
    )
    .catch(response => response);
};

exports.fetchInProxy = (prxName) => {
  return MongoClient.connect(url)
    .then(db => {
      const col = db.collection('proxyServers');
      const proxyServer = {
        name: prxName
      };

      return col.findOne(proxyServer);
    })
    .catch(response => response);
};

exports.fetchAll = () => {
  return MongoClient.connect(url)
    .then(db => {
      const col = db.collection('proxyServers');
      return col.findOne({});
    })
    .catch(response => response);
};

/**
 *
 * @param {String} prxName
 * @param {array} targetServers
 * @param {int} weight
 * @returns {bluebird|exports|module.exports}
 */
exports.update = (prxName, targetServers, weight) => {
  return new Promise((resolve, reject) => {
    targetServers.forEach(targetServer => {
      var prxIdx = serverList.findIndex(server => server.name === prxName);

      if (prxIdx === -1) {
        return reject({err: 'could not find the requested server'});
      } else {
        var serverIdx = serverList[prxIdx].servers.findIndex(server => server.name === targetServer);

        if (serverIdx === -1) {
          return reject({err: 'couldn\'t find the requested server'});
        } else {
          serverList[prxIdx].servers[serverIdx].weight = weight;
        }
      }
    });

    return resolve({code: '000'});
  });
};

exports.updateServersInAllProxy = (targetServer, weight) => {
  return new Promise((resolve, reject) => {
    serverList.forEach(proxyServer => {
      var serverIdx = _.findIndex(proxyServer.servers, { name: targetServer });

      if (serverIdx !== -1) {
        var isSameIDC = proxyServer.servers[serverIdx].IDC === proxyServer.IDC;

        if (!isMultiProxy && !isSameIDC) {
          return false;
        } else {
          proxyServer.servers[serverIdx].weight = weight;
        }
      }
    });

    resolve();
  });
};

/**
 *
 * @param {boolean} onOff
 */
exports.setMultiProxy = (onOff) => {
  return new Promise((resolve) => {
    if (isMultiProxy === onOff) {
      return resolve({code: '000', doNothing: true});
    } else {
      isMultiProxy = onOff;
      return resolve({code: '000', doNothing: false});
    }
  });
};

exports.getMultiProxy = () => {
  return MongoClient.connect(url)
    .then(db => {
      const col = db.collection('config');
      const config = {
        fieldName: 'isMultiProxy'
      };

      return col.findOne(config);
    })
    .then(config =>
      Promise.resolve(config.value)
    )
    .catch(response => response);
};


//////////////////////////////////////////////////////////////////////////////////////
///////////////////// HELPERS ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

function getUrl() {
  const env = process.env.NOVA_ENV;
  switch (env) {
    case 'local':
      return 'mongodb://192.168.56.102:27017/proxyapi';
    case 'dev':
      return 'mongodb://localhost:27017/proxyapi';
    case 'real':
      return 'mongodb://localhost:27017/proxyapi';
    default:
      return '';
  }
}