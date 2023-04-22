var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //if(req.isAuthenticated()){
        //console.log(req.isAuthenticated())
        res.render('home', { title: 'home' });
    //}
    //else{
        //res.redirect('/error')
    //}
});

module.exports = router;
