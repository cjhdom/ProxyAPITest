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
            servers: JSON.stringify(result.map((server) => server.name)),
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
            servers: JSON.stringify(result.map((server) => server.name)),
            proxyServers: JSON.stringify(result2.map((proxyServer) => proxyServer.name))
          });
        }
      });
    }
  });
});

router.get('/3', function(req, res, next) {
  res.render('index.html', {
    servers: []
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

/**
 * 모든 프록시의 특정 서버의 서비스 제어
 */
router.put('/weight', (req, res, next) => {
  const serverName = req.body.serverName;
  const serviceName = req.body.serviceName;

  serverStatus.setServerWeight(serverName, (err, response) => {
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
router.get('weight/:prxName/:serverName/', (req, res, next) => {
  const prxName = req.params.prxName;
  const serverName = req.params.serverName;

  serverStatus.getServerWeight(prxName, serverName, (err, response) => {
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

router.put('/weight/:weight/:prxName/:serverName', (req, res, next) => {
  const prxName = req.params.prxName;
  const serverName = req.params.serverName;
  const weight = Number(req.params.weight);

  serverStatus.setSingleServerWeight(prxName, serverName, weight, (err, response) => {
    if (err) {
      next(err);
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

router.put('/multiproxy', (req, res, next) => {
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
      console.log('error');
      console.log(err);
      res.json(err);
    } else {
      console.log('success');
      console.log(result);
      res.json(result);
    }
  });
});

module.exports = router;
