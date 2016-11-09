var express = require('express');
var router = express.Router();
var dbtest = require('../tests/dbtest');
var serverStatus = require('../models/serverStatus');


/* GET home page. */
router.get('/', function(req, res, next) {
    //dbtest.echoServerList();
    res.send('hello world');
});

router.get('/fetch/:value', (req, res, next) => {
    var value = req.params.value;
    dbtest.fetch(value, (err, data) => {
       if (err) {
           res.send('error fetching ');
       } else {
           //res.send('result\n' + JSON.stringify(data));
         res.json(data);
       }
    });
});

module.exports = router;
