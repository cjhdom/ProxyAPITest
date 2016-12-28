var express = require('express');
var router = express.Router();
var dbtest = require('../tests/dbtest');
var serverStatus = require('../models/serverStatus');
var serverList = require('../models/serverList');
var toBoolean = require('to-boolean');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
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
      res.res(err);
    } else {
      res.json(response);
    }
  });
});

router.put('/:prxName/:serverName/weight/:weight', (req, res, next) => {
  var prxName = req.params.prxName;
  var serverName = req.params.serverName;
  var weight = Number(req.params.weight);

  serverStatus.setServerWeight(prxName, serverName, weight, (err, response) => {
    if (err) {
      res.json('err ' + err);
    } else {
      res.json(response);
    }
  });
});

router.get('/multiproxy/:onOff', (req, res, next) => {
  var onOff = toBoolean(req.params.onOff);

  serverStatus.setMultiProxy(onOff, (err, response) => {
    if (err) {
      next(err);
    } else {
      console.log('success');
      res.send(response);
    }
  });
});

module.exports = router;
