/**
 * Created by 지환 on 2016-11-07.
 */
var mngr = null

function serverStatus(_mngr) {
    mngr = _mngr;
}

serverStatus.prototype.getServerStatus = (prxName, serverName) => {
    return mngr.getStatus(prxName, serverName)
        .then(
          response => response,
          response => response
        );
};

serverStatus.prototype.setServerStatus = (prxName, serverName, status) => {
    return mngr.setStatus(prxName, serverName, status)
        .then(
          response => response,
          response => response
        );
};

