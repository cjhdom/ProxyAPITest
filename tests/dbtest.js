/**
 * Created by 지환 on 2016-11-07.
 */
var _ = require('lodash');

var serverList = {};
var isMultiProxy = null;

function DbTest(data) {
  serverList = data.servers;
  isMultiProxy = data.isMultiProxy;
}

module.exports = exports = {
  fetch: (test, callback) => {
    var server = _.find(serverList, { id: parseInt(test) });

    if (typeof server != 'undefined') {
      console.log(server);
      callback(null, server);
    } else {
      console.log(server);
      callback({err: 'error'});
    }
  },
  update: (id, status, callback) => {
    var index = serverList.findIndex(server => server.id === id);

    if (index === -1) {
      callback({err: 'error'});
    } else {
      serverList[index].status = status;
      callback(null, true);
    }
  },
  serverInit: (data) => {
    DbTest(data);
  }
};