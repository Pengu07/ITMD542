var express = require('express');
var router = express.Router();
var itemController = require('../item/itemController')

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

router.get('/all-items', async function(req, res, next) {
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const items = await itemController.findAll()
        res.render('itemsAllUser', { title: 'Home' , loggedUser: req.user, items: items});
    }
});

module.exports = router;
