/**
 * Created by 지환 on 2016-11-10.
 */
var _ = require('lodash');

function MngrTest(data) {
  this.serverList = data.servers;
}

MngrTest.prototype.getStatus = (server, callback) => {
  var target = _.find(this.serverList, { id: parseInt(test) });

  if (typeof target != 'undefined') {
    console.log(target);
    callback(null, target.status);
  } else {
    console.log(target);
    callback({err: 'error'});
  }
};

MngrTest.prototype.setStatus = (serverToSet, status, callback) => {
  var index = this.serverList.findIndex(server => server.id === id);

  if (index === -1) {
    return callback({err: 'cannot find'});
  } else {
    this.serverList[index].status = status;
    return callback(null, {res: '000'});
  }
};

module.exports = exports = MngrTest;

