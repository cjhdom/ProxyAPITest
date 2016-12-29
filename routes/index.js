const express = require('express');
const router = express.Router();
const dbtest = require('../tests/dbtest');
const serverStatus = require('../models/serverStatus');
const serverList = require('../models/serverList');
const toBoolean = require('to-boolean');

/* GET home page. */
router.get('/', function(req, res, next) {
  serverList.getServersList((err, result) => {
    if (err) {
      next(err);
    } else {
      res.render('index.html', result);
    }
  });
});

router.get('/:prxName/:serverName/weight', (req, res, next) => {
  const prxName = req.params.prxName;
  const serverName = req.params.serverName;

  serverStatus.getServerWeight(prxName, serverName, (err, response) => {
    if (err) {
      if (response) {
        res.json(response);
      } else {
        res.res(err);
      }
    } else {
      res.json(response);
    }
  });
});

router.get('/weight', (req, res, next) => {

  serverStatus.getServerWeightAll((err, response) => {
    if (err) {
      res.res(err);
    } else {
      res.json(response);
    }
  });
});

router.put('/weight', (req, res, next) => {
  const weight = Number(req.body.weight);
  const serverName = req.body.serverName;

  serverStatus.setServerWeight(serverName, weight, (err, response) => {
    if (err) {
      res.json(err);
    } else {
      res.json(response);
    }
  });
});

router.put('/:prxName/:serverName/weight/:weight', (req, res, next) => {
  const prxName = req.params.prxName;
  const serverName = req.params.serverName;
  const weight = Number(req.params.weight);

  serverStatus.setSingleServerWeight(prxName, serverName, weight, (err, response) => {
    if (err) {
      res.json('err ' + err);
    } else {
      res.json(response);
    }
  });
});

router.get('/multiproxy', (req, res, next) => {
  serverStatus.getIsMultiProxy((err, response) => {
    if (err) {
      next(err);
    } else {
      res.send(response);
    }
  });
});

router.put('/multiproxy', (req, res, next) => {
  const onOff = toBoolean(req.body.onOff);

  serverStatus.setMultiProxy(onOff, (err, response) => {
    if (err) {
      next(err);
    } else {
      res.send(response);
    }
  });
});

module.exports = router;
