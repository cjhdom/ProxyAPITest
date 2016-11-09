/**
 * Created by 지환 on 2016-11-10.
 */
var express = require('express');

//var app = express();
var router = express.Router();

router.use((req, res, next) => {
  console.log('req ' + req);
  console.log('res ' + res);
  console.log('next ' + next);
  next();
});

module.exports = router;


