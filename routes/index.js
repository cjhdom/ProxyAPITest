var express = require('express');
var router = express.Router();
var dbtest = require('../tests/dbtest');
var serverStatus = require('../models/serverStatus');
var serverList = require('../models/serverList');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', {
    serverData: serverList.getAllServerList()
  });
});

router.get('/:prxName/:serverName/weight', (req, res, next) => {
  var prxName = req.params.prxName;
  var serverName = req.params.serverName;

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

router.put('/:prxName/:serverName/weight/:weight', (req, res, next) => {
  var prxName = req.params.prxName;
  var serverName = req.params.serverName;
  var weight = req.params.weight;

  serverStatus.setServerWeight(prxName, serverName, weight, (err, response) => {
  if (err) {
    res.json('err ' + err);
  } else {
    res.json(response);
  }
  });
});

router.get('/multiproxy/:onOff', (req, res, next) => {
  var onOff = req.params.onOff;

  serverStatus.setMultiProxy(onOff, (err, response) => {
    if (err) {
      res.send(err);
    } else {
      res.send(response);
    }
  });
});

module.exports = router;
