/**
 * Created by 지환 on 2016-11-10.
 */
var express = require('express');

//var app = express();
var router = express.Router();

router.use((req, res, next) => {
  console.log('/');
  next();
});

router.use('/fetch', (req, res, next) => {
  console.log('fetch');
  next();
});

module.exports = router;


