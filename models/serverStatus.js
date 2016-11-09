/**
 * Created by 지환 on 2016-11-07.
 */
function serverStatus(db) {
    this.db = db;
}

serverStatus.prototype.getServerStatus = (server) => {
    return this.db.fetch({id: server.id}, (err, res) => {
        if (err) {
            console.log('error setting status\n' + console.log(err));
        } else {
            return res;
        }
    });
};

serverStatus.prototype.setServerStatus = (server, stat) => {
    return this.db.update({id: server.id}, {stat: stat}, (err, res) => {
        if (err) {
            console.log('error setting status\n' + console.log(err));
        } else {
            return res;
        }
    });
};

