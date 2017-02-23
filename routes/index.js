const express = require('express');
const router = express.Router();
const dbtest = require('../tests/dbtest');
const serverStatus = require('../models/serverStatus');
const serverList = require('../models/serverList');
const toBoolean = require('to-boolean');

/////////////////////////////////////////////////////////////
/*                   webpages start                        */
/////////////////////////////////////////////////////////////
router.get('/', function(req, res, next) {
  serverList.getServersList((err, result) => {
    if (err) {
      next(err);
    } else {
      serverList.getProxyServerList((err2, result2) => {
        if (err2) {
          next(err);
        } else {
          res.render('index.html', {
            servers: JSON.stringify(result.map((server) => server.serverName)),
            proxyServers: JSON.stringify(result2.map((proxyServer) => proxyServer.name))
          });
        }
      });
    }
  });
});

router.get('/3', function(req, res, next) {
  serverList.getServersList((err, result) => {
    if (err) {
      next(err);
    } else {
      serverList.getProxyServerList((err2, result2) => {
        if (err2) {
          next(err);
        } else {
          res.render('index3.html', {
            servers: JSON.stringify(result.map((server) => server.serverName)),
            proxyServers: JSON.stringify(result2.map((proxyServer) => proxyServer.name))
          });
        }
      });
    }
  });
});

router.get('/2', function(req, res, next) {
  serverList.getServersList((err, result) => {
    if (err) {
      next(err);
    } else {
      serverList.getProxyServerList((err2, result2) => {
        if (err2) {
          next(err);
        } else {
          res.render('index2.html', {
            servers: JSON.stringify(result.map((server) => server.serverName)),
            proxyServers: JSON.stringify(result2.map((proxyServer) => proxyServer.name))
          });
        }
      });
    }
  });
});

/////////////////////////////////////////////////////////////
/*                   weight control                        */
/////////////////////////////////////////////////////////////

/**
 * 전체 서버 weight 조회
 */
router.get('/weight', (req, res, next) => {
  serverStatus.getServerWeightAll((err, response) => {
    if (err) {
      next(err);
    } else {
      res.json(response);
    }
  });
});

router.get('/dbweight', (req, res, next) => {
  serverStatus.getDbWeightAll((err, response) => {
    if (err) {
      next(err);
    } else {
      res.json(response);
    }
  });
});

/**
 * 모든 프록시의 특정 서버의 서비스 제어
 */
router.patch('/weight', (req, res, next) => {
  const serverName = req.body.serverName;
  const serviceName = req.body.serviceName;

  serverStatus.setServerWeight(serverName, serviceName, (err, response) => {
    if (err) {
      next(err);
    } else {
      res.json(response);
    }
  });
});

/**
 * 특정 서버의 서비스 값 가져오기
 */
router.get('weight/single', (req, res, next) => {
  const prxName = req.query.prxName;
  const serverName = req.query.serverName;
  const serviceName = req.query.serviceName;

  serverStatus.getServerWeight(prxName, serverName, serviceName, (err, response) => {
    if (err) {
      if (response) {
        res.json(response);
      } else {
        next(err);
      }
    } else {
      res.json(response);
    }
  });
});

router.patch('/weight/single', (req, res, next) => {
  const prxName = req.body.prxName;
  const serverName = req.body.serverName;
  const serviceName = req.body.serviceName;
  const weight = Number(req.body.weight);

  serverStatus.setSingleServerWeight(prxName, serverName, serviceName, weight, (err, response) => {
    if (err) {
      next(err);
    } else {
      res.json(response);
    }
  });
});

router.get('/build/start', (req, res, next) => {
  const proxyServerName = req.query.proxyServerName;
  const serverName = req.query.serverName;
  const serviceName = req.query.serviceName;

  serverStatus.buildStart(proxyServerName, serverName, serviceName, (err, response) => {
    if (err) {
      if (response) {
        res.json(response);
      } else {
        next(err);
      }
    } else {
      console.log(JSON.stringify(response));
      res.json(response);
    }
  });
});

router.get('/build/end', (req, res, next) => {
  const proxyServerName = req.query.proxyServerName;
  const serverName = req.query.serverName;
  const serviceName = req.query.serviceName;

  serverStatus.buildEnd(proxyServerName, serverName, serviceName, (err, response) => {
    if (err) {
      if (response) {
        res.json(response);
      } else {
        next(err);
      }
    } else {
      res.json(response);
    }
  });
});

/////////////////////////////////////////////////////////////
/*                   multiproxy control                    */
/////////////////////////////////////////////////////////////

router.get('/multiproxy', (req, res, next) => {
  serverStatus.getIsMultiProxy((err, response) => {
    if (err) {
      next(err);
    } else {
      res.json(response);
    }
  });
});

router.post('/multiproxy', (req, res, next) => {
  const onOff = toBoolean(req.body.onOff);

  serverStatus.setMultiProxy(onOff, (err, response) => {
    if (err) {
      next(err);
    } else {
      res.json(response);
    }
  });
});

/////////////////////////////////////////////////////////////
/*                      re-setter                          */
/////////////////////////////////////////////////////////////
router.get('/reset', (req, res, next) => {
  var db = require('../services/database');
  db.resetDb((err, result) => {
    if (err) {
      next(err);
    } else {
      require('../services/init').init();
      res.json(result);
    }
  });
});

module.exports = router;
