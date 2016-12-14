var express = require('express');
var router = express.Router();
var dbtest = require('../tests/dbtest');
var serverStatus = require('../models/serverStatus');

/* GET home page. */
router.get('/', function(req, res, next) {
//dbtest.echoServerList();
  console.log('here');
  res.send('hello world');
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

router.put('/:serverName/weight/:weight', (req, res, next) => {
  var serverName = req.params.serverName;
  var weight = req.params.weight;

  serverStatus.setServerWeight(serverName, weight, (err, response) => {
  if (err) {
    res.json('err ' + err);
  } else {
    res.json(response);
  }
  });
});

router.get('/multiproxy/:onOff', (req, res, next) => {
  var onOff = req.params.onOff;

  serverStatus
});

module.exports = router;
