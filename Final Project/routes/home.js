var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        res.render('home', { title: 'Home' , loggedUser: req.user });
    }
});

/* GET home page on password change. */
router.get('/success', async function(req, res, next) {
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        res.render('home', { title: 'Home' , loggedUser: req.user, password: 'y' });
    }
});
module.exports = router;
