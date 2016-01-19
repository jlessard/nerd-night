var express = require('express');

var router = express.Router();

/* catch-all route, routing responsibility is passed to client */
router.all('*', function(req, res, next) {
  return res.sendfile('./index.html');
});

module.exports = router;