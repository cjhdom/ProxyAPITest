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
};

exports.getServerWeight = (prxName, serverName) => {
    async.auto({
        getFromDb: (callback) => {
            db.fetch(prxName, serverName)
                .then(response => callback(null, response))
                .catch(response => callback(response));
        },
        getFromMngr: (callback) => {
            mngrs.some(mngr => {
                console.log(mngr.getName());
               if (mngr.getName() === prxName) {
                   console.log('found');
                   mngr.getWeight(serverName).then(server => callback(null, server))
                       .catch(callback({err: 'oops'}));
                   return true;
               }
                return false;
            });
        }
    }, (err, res) => {
        if (err) {
            console.log('error in getServerWeight');
            console.log(JSON.stringify(err));
        } else {
            console.log('successful');
            console.log(res);
        }
    });
    /*
    return this.mngr.getStatus(prxName, serverName)
        .then(
            response => response
        )
        .catch(
            response => response
        );*/
};

exports.setServerWeight = (prxName, serverName, weight) => {
    return this.mngr.setStatus(prxName, serverName, weight)
        .then(
            response => response
        )
        .catch(
            response => response
        );
};


