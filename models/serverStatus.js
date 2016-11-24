/**
 * Created by 지환 on 2016-11-07.
 */
var async = require('async');

function ServerStatus(db) {
    this.db = db;
}

ServerStatus.prototype.getServerWeight = (prxName, serverName) => {
    async.auto({
        getFromDb: (callback) => {
            db.fetch(prxName, serverName)
                .then(response => callback(null, response))
                .catch(response => callback(response));
        },
        getFromMngr: (callback) => {
            /
        }
    });
    return this.mngr.getStatus(prxName, serverName)
        .then(
            response => response
        )
        .catch(
            response => response
        );
};

ServerStatus.prototype.setServerWeight = (prxName, serverName, weight) => {
    return this.mngr.setStatus(prxName, serverName, weight)
        .then(
            response => response
        )
        .catch(
            response => response
        );
};
