var express = require('express');
var router = express.Router();

/* GET login page */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'login' });
});

router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'signup' });
});

module.exports = router;
