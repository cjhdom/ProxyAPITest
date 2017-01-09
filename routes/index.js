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
  var fs = require('fs');
  var path = require('path');
  var Mngr = require('../tests/mngrtest');

  fs.readFile(path.normalize('./sample_data/sample.json'), 'utf-8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      db.resetDb(data, (err, response) => {
        if (err) {
          next(err);
        } else {
          var mngrs = [];
          db.fetchAll()
            .then(servers => {
              servers.forEach(server => {
                //var test = require('../tests/mngrtest')(server);
                var test = new Mngr(server);
                //console.log('pushing ' + test.getName());
                mngrs.push(test);
              });

              serverStatus.initServerStatus(dbtest, mngrs);
              res.send(response);
            })
            .catch(res => console.log(JSON.stringify(res)));


        }
      });


    }
  });
});

module.exports = router;
