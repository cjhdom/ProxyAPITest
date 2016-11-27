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
        getFromDb: (callback) => {
            db.fetch(prxName, serverName)
                .then(response => callback(null, response))
                .catch(response => callback(response));
        },
        getFromMngr: (callback) => {
            console.log(JSON.stringify(mngrs));
            mngrs.some(mngr => {
                console.log('got ' + mngr.getName());
               if (mngr.getName() === prxName) {
                   console.log('found');
                   mngr.getWeight(serverName)
                       .then(server => callback(null, server))
                       .catch(response => callback({err: 'oops'}));
                   return true;
               }
                return false;
            });
        }
    }, (err, res) => {
        console.log('hello');
        if (err) {
            return callback(err)
        } else {
            return callback(null, res);
        }
    });
};

exports.setServerWeight = (prxName, serverName, weight, callback) => {
    async.auto({
        setDb: (callback) => {
            db.update(prxName, serverName. weight)
                .then(response => callback(null, response))
                .catch(response => callback(response));
        },
        setMngr: (callback) => {
            mngrs.some(mngr => {
                if (mngr.getName() === prxName) {
                    mngr.setWeight(serverName, weight)
                        .then(server => callback(null, server))
                        .catch(response => callback({err: 'oops'}));
                    return true;
                }
                return false;
            });
        }
    }, (err, res) => {
        console.log('hello');
        if (err) {
            return callback(err)
        } else {
            return callback(null, res);
        }
    });
};


