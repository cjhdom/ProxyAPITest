/**
 * Created by jihwchoi on 2017-01-19.
 */
var dbtest = require('../tests/dbtest');
var fs = require('fs');

var Mngr = require('../tests/mngrtest');
var serverStatus = require('../models/serverStatus');
var serverList = require('../models/serverList');
var database = require('../services/database');

const path = require('path');
const rootPath = path.normalize(__dirname + '/..');

exports = module.exports = {};

exports.init = () => {
  fs.readFile(path.normalize('./sample_data/sample.json'), 'utf-8', (err, data) => {
    if (err) {
      console.log('error reading file ' + console.log(err));
      server.close();
    } else {
      console.log('successfully loaded dbtest! good to go~');
      dbtest.serverInit(JSON.parse(data));
      serverList.initServerList((JSON.parse(data)).servers);

      var mngrs = [];
      database.fetchAll()
        .then(servers => {
          servers.forEach(server => {
            //var test = require('../tests/mngrtest')(server);
            var test = new Mngr(server);
            //console.log('pushing ' + test.getName());
            mngrs.push(test);
          });

          serverStatus.initServerStatus(dbtest, mngrs);
        })
        .catch(res => console.log(JSON.stringify(res)));
    }
  });
};



function getUrl() {
  //return 'mongodb://localhost:27017/proxyAPI';
  const env = process.env.NOVA_ENV;
  switch (env) {
    case 'local':
      return '192.168.56.102:3306';
    case 'dev':
      return 'mongodb://localhost:27017/proxyAPI';
    case 'real':
      return 'mongodb://localhost:27017/proxyAPI';
    case 'home':
      return 'mongodb://52.231.38.182:27017/proxyAPI';
    default:
      return '';
  }
}