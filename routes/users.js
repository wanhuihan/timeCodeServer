var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // console.log(req.signedCookies, req)
  res.send('sssss');
});

module.exports = router;
