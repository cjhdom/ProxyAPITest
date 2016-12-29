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

router.get('/servers', (req, res, next) => {
  serverList.getServersList((err, result) => {
    if (err) {
      next(err);
    } else {
      console.log(JSON.stringify(result));
      res.json(result);
    }
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
      res.res(err);
    } else {
      res.json(response);
    }
  });
});

router.put('/weight', (req, res, next) => {
  var weight = Number(req.body.weight);
  var serverName = req.body.serverName;

  serverStatus.set
});

router.put('/:prxName/:serverName/weight/:weight', (req, res, next) => {
  var prxName = req.params.prxName;
  var serverName = req.params.serverName;
  var weight = Number(req.params.weight);

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
  var onOff = toBoolean(req.body.onOff);

  serverStatus.setMultiProxy(onOff, (err, response) => {
    if (err) {
      next(err);
    } else {
      res.send(response);
    }
  });
});



module.exports = router;
