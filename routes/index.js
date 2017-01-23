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
      res.render('index2.html', {
        servers: JSON.stringify(result.map((server) => server.name))
      });
    }
  });
});

router.get('/2', function(req, res, next) {
  serverList.getServersList((err, result) => {
    if (err) {
      next(err);
    } else {
      res.render('index.html', {
        servers: JSON.stringify(result.map((server) => server.name))
      });
    }
  });
});

router.get('/3', function(req, res, next) {
  res.render('index.html', {
    servers: []
  });
});

router.get('/send', (req, res, next) => {
  var init = require('../services/init');
  var request = require('request');

  init.init((err, data) => {
    if (err) {
      return res.json(err);
    } else {
      console.log(data.servers[0].servers);
      request({
        uri: 'http://localhost:8998/setWeightList',
        method: 'put',
        body: {
          servers: data.servers[0].servers
        },
        json: true
      }, (err, response, body) => {
        if (err) {
          console.log(JSON.stringify(err));
          res.json(err);
        } else {
          console.log(JSON.stringify(response));
          res.json(response);
        }
      });
    }
  });
});


router.get('/weight', (req, res, next) => {

  serverStatus.getServerWeightAll((err, response) => {
    if (err) {
      next(err);
    } else {
      res.json(response);
    }
  });
});

router.put('/weight', (req, res, next) => {
  const serverName = req.body.serverName;

  serverStatus.setServerWeight(serverName, (err, response) => {
    if (err) {
      next(err);
    } else {
      res.json(response);
    }
  });
});

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

router.get('/multiproxy', (req, res, next) => {
  serverStatus.getIsMultiProxy((err, response) => {
    if (err) {
      next(err);
    } else {
      console.log('done');
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
