var express = require('express');
var router = express.Router();
var sourceController = require('../sources/sourceController')
var itemController = require('../item/itemController')
var accountController = require('../account/accountController')
const { body, validationResult } = require ('express-validator');
var crypto = require ('crypto')

/* GET admin page. */
router.get('/', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }
        else if(checkUser.admin == "admin"){
            res.render('admin', { title: 'Admin', loggedUser: req.user });
        }
    }
});

/* GET admin page on password change. */
router.get('/success', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }
        else if(checkUser.admin == "admin"){
            res.render('admin', { title: 'Admin', loggedUser: req.user, password: 'y' });
        }
    }
});

/*

    This portion of the router is dedicated to the item source pages

*/

// GET all sources
router.get('/all-sources', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }
        else if(checkUser.admin == "admin"){
            const sources = await sourceController.findAll()
            //console.log(sources)
            res.render('sourcesAll', { loggedUser: req.user,  sources: sources });
        }
    }
});

// GET create source
router.get('/create-source', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }
        else if(checkUser.admin == "admin"){
            res.render('sourcesCreate', { loggedUser: req.user});
        }
    }
});

// POST create source
router.post('/create-source',
    body('sourceName').trim().notEmpty().withMessage('Name cannot be empty!'),
    body('location').trim().notEmpty().withMessage('Location cannot be empty!'),
    body('type').trim().notEmpty().withMessage('The type cannot be empty!'),
    body('level').trim().isInt({min: 1, max: 60}).withMessage('The level must be a number between 1 and 60!'),
    async function(req, res, next){
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const result = validationResult(req);
            //console.log(req.body)
    
            if(result.isEmpty() != true){
                res.render('sourcesCreate', { error: result.array() })
            }

            else{
                await sourceController.create(req.body)
                res.redirect('/admin/all-sources')
            }
        }
    }
});

// GET view source
router.get('/view-source/:id', async function(req, res, next) {
        // Check if user is admin
        if(!req.isAuthenticated()){
            return res.redirect('/login')
        }

        else if(req.isAuthenticated()){
            const checkUser = await accountController.findByID(req.user.id)
            if(checkUser.admin != "admin"){
                return res.redirect('/error/permission')
            }

            else if(checkUser.admin == "admin"){
                const source = await sourceController.findByID(req.params.id)
                res.render('sourcesSingle', { loggedUser: req.user,  source: source });
            }
        }

});

// GET edit source
router.get('/edit-source/:id', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const source = await sourceController.findByID(req.params.id)
            res.render('sourcesUpdate', { loggedUser: req.user,  source: source });
        }
    }
});

// POST edit source
router.post('/edit-source/:id',
    body('sourceName').trim().notEmpty().withMessage('Name cannot be empty!'),
    body('location').trim().notEmpty().withMessage('Location cannot be empty!'),
    body('level').trim().isInt({min: 1, max: 60}).withMessage('The level must be a number between 1 and 60!'),
    async function(req, res, next){
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const result = validationResult(req);
            console.log(req.body)
            //console.log(result)
            if(result.isEmpty() != true){
                const source = await sourceController.findByID(req.params.id)
                res.render('sourcesUpdate', { loggedUser: req.user,  source: source, error: result.array() })
            }

            else{
                await sourceController.update(req.params.id, req.body)
                res.redirect('/admin/all-sources')
            }
        }
    }
});


// GET delete source
router.get('/delete-source/:id', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const source = await sourceController.findByID(req.params.id)
            res.render('sourcesDelete', { loggedUser: req.user,  source: source });
        }
    }
});

// POST delete source
router.post('/delete-source/:id', async function(req, res, next){
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            //console.log(req.body)
            //console.log(result)
            const source = await sourceController.findByID(req.params.id)
            const items = await itemController.findBySource(source.name)
            //console.log(items)
            if(items.length > 0){
                const error = []
                let errorMessage = JSON.parse('{"msg":"There are still items tied to this source!"}')
                error.push(errorMessage)
                //console.log(error)
                res.render('sourcesDelete', { loggedUser: req.user, source: source, error: error, items: items})
            }
            
            else{
                await sourceController.deleteByID(req.params.id)
                res.redirect('/admin/all-sources')
            }
        }
    }
});

/*

    This portion of the router is dedicated to the item pages

*/

const Rarity = {
    Common: "Common",
    Uncommon: "Uncommon",
    Rare: "Rare",
    Epic: "Epic",
    Legendary: "Legendary"
}

// GET all items
router.get('/all-items', async function(req, res, next) {
        // Check if user is admin
        if(!req.isAuthenticated()){
            return res.redirect('/login')
        }

        else if(req.isAuthenticated()){
            const checkUser = await accountController.findByID(req.user.id)
            if(checkUser.admin != "admin"){
                return res.redirect('/error/permission')
            }

            else if(checkUser.admin == "admin"){
                const items = await itemController.findAll()
                //console.log(items)
                res.render('itemsAll', { loggedUser: req.user,  items: items });
            }
        }
});

// GET create item
router.get('/create-item', async function(req, res, next) {
        // Check if user is admin
        if(!req.isAuthenticated()){
            return res.redirect('/login')
        }

        else if(req.isAuthenticated()){
            const checkUser = await accountController.findByID(req.user.id)
            if(checkUser.admin != "admin"){
                return res.redirect('/error/permission')
            }

            else if(checkUser.admin == "admin"){
                const sourceList = await sourceController.findAll()
                res.render('itemsCreate', { loggedUser: req.user, rarityList: Object.keys(Rarity), sourceList: sourceList});
            }
        }
});

// POST create item
router.post('/create-item',
    body('itemName').trim().notEmpty().withMessage('Name cannot be empty!'),
    body('rarity').trim().notEmpty().withMessage('Rarity cannot be empty!'),
    body('rarity').custom(value => {
        return Object.keys(Rarity).includes(value)
    }).withMessage("That is not a possible item rarity!"),
    body('source').trim().notEmpty().withMessage('The source cannot be empty!'),
    body('source').custom(async value =>{
        try {
            if(await sourceController.findByName(value) == null){
                throw new Error("That source does not exist, please double check your input.")
            }
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
    }).withMessage("That source does not exist, please double check your input."),
    async function(req, res, next){
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }
    
    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const result = validationResult(req);
            console.log(result)
            if(result.isEmpty() != true){
                const sourceList = await sourceController.findAll()
                res.render('itemsCreate', { loggedUser: req.user,  rarityList: Object.keys(Rarity), sourceList: sourceList, error: result.array() })
            }

            else{
                const source = await sourceController.findByName(req.body.source)
                await itemController.create(req.body, source)
                res.redirect('/admin/all-items')
            }
        }
    }
});

// GET view item
router.get('/view-item/:id', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const item = await itemController.findByID(req.params.id)
            res.render('itemsSingle', { loggedUser: req.user,  item: item });
        }
    }
});

// GET edit item
router.get('/edit-item/:id', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const item = await itemController.findByID(req.params.id)
            const sourceList = await sourceController.findAll()
            res.render('itemsUpdate', { loggedUser: req.user,  item: item, rarityList: Object.keys(Rarity), sourceList: sourceList });
        }
    }
});

// POST edit item
router.post('/edit-item/:id',
    body('itemName').trim().notEmpty().withMessage('Name cannot be empty!'),
    body('rarity').trim().notEmpty().withMessage('Rarity cannot be empty!'),
    body('rarity').custom(value => {
        return Object.keys(Rarity).includes(value)
    }).withMessage("That is not a possible item rarity!"),
    body('source').trim().notEmpty().withMessage('The source cannot be empty!'),
    body('source').custom(async value =>{
        try {
            if(await sourceController.findByName(value) == null){
                throw new Error("That source does not exist, please double check your input.")
            }
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
    }).withMessage("That source does not exist, please double check your input."),
    async function(req, res, next){
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const result = validationResult(req);
            console.log(req.body)
            console.log(result)
            if(result.isEmpty() != true){
                const item = await itemController.findByID(req.params.id)
                const sourceList = await sourceController.findAll()
                res.render('itemsUpdate', { loggedUser: req.user,   item: item, rarityList: Object.keys(Rarity), sourceList: sourceList, error: result.array() })
            }

            else{
                const source = await sourceController.findByName(req.body.source)
                await itemController.update(req.params.id, req.body, source)
                res.redirect('/admin/all-items')
            }
        }
    }
});

// GET delete item
router.get('/delete-item/:id', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }
    
    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const item = await itemController.findByID(req.params.id)
            res.render('itemsDelete', { loggedUser: req.user,  item: item });
        }
    }
});

// POST delete item
router.post('/delete-item/:id', async function(req, res, next){
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            console.log(req.body)
            //console.log(result)
            await itemController.deleteByID(req.params.id)
            res.redirect('/admin/all-items')
        }
    }
});


/*

    This portion of the router is dedicated to the user pages

*/


// GET all users
router.get('/all-users', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const users = await accountController.findAll()
            //console.log(users)
            res.render('usersAll', { loggedUser: req.user,  users: users });
        }
    }
});

// GET view user
router.get('/view-user/:id', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const user = await accountController.findByID(req.params.id)
            res.render('usersSingle', { loggedUser: req.user,  user: user });
        }
    }
});

// GET edit user
router.get('/edit-user/:id', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const user = await accountController.findByID(req.params.id)
            res.render('usersUpdate', { loggedUser: req.user,  user: user });
        }
    }
});

// POST edit user
router.post('/edit-user/:id',
    body('username').trim().notEmpty().withMessage('Username cannot be empty!'),
    body('firstName').trim().notEmpty().withMessage('First name cannot be empty!'),
    body('lastName').trim().notEmpty().withMessage('Last name cannot be empty!'),
    async function(req, res, next){
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const result = validationResult(req);
            console.log(req.body)
            //console.log(result)
            if(result.isEmpty() != true){
                const user = await accountController.findByID(req.params.id)
                res.render('usersUpdate', { loggedUser: req.user,  user: user, error: result.array() })
            }

            else{
                await accountController.update(req.params.id, req.body)
                res.redirect('/admin/all-users')
            }
        }
    }
});


// GET delete user
router.get('/delete-user/:id', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const user = await accountController.findByID(req.params.id)
            res.render('usersDelete', { loggedUser: req.user,  user: user });
        }
    }
});

// POST delete user
router.post('/delete-user/:id', async function(req, res, next){
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const user = await accountController.findByID(req.params.id)
            //console.log(user)
            if(user.admin == "admin"){
                const error = []
                let errorMessage = JSON.parse('{"msg":"This user is an admin! Remove their admin first so they can be deleted."}')
                error.push(errorMessage)
                //console.log(error)
                res.render('usersDelete', { loggedUser: req.user, user: user, error: error})
            }

            else{
                await accountController.deleteByID(req.params.id)
                res.redirect('/admin/all-users')
            }
        }
    }
});

// GET change user password
router.get('/change-user-password/:id', async function(req, res, next) {
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const user = await accountController.findByID(req.params.id)
            res.render('usersPassword', { loggedUser: req.user,  user: user });
        }
    }
});

// POST change user password
router.post('/change-user-password/:id',
    body('password').trim().notEmpty().withMessage('The new password cannot be empty!'),
    body('password').trim().isLength({min:8}).withMessage('Password must be at least 8 characters!'),
    body('confirmPassword').trim().notEmpty().withMessage('The password confirmation cannot be empty!'),
    async function(req, res, next){
    // Check if user is admin
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }

    else if(req.isAuthenticated()){
        const checkUser = await accountController.findByID(req.user.id)
        if(checkUser.admin != "admin"){
            return res.redirect('/error/permission')
        }

        else if(checkUser.admin == "admin"){
            const result = validationResult(req).array();
            console.log(result)
            // This sets the error for the passwords not matching
            if (req.body.password != req.body.confirmPassword){
              let errorMessage = JSON.parse('{"msg":"The passwords must match!"}')
              result.push(errorMessage)
            }
            if(result.length > 0){
                const user = await accountController.findByID(req.params.id)
                res.render('usersPassword', { loggedUser: req.user,  user: user, error: result})
            }

            else{
                const user = await accountController.findByID(req.params.id)
                const newPassword = crypto.pbkdf2Sync(req.body.password, user.salt, 1000000, 64, 'sha512').toString('hex')
                console.log(newPassword)
                await accountController.changePassword(req.params.id, newPassword)
                res.redirect('/admin/all-users')
            }
        }
    }
});

module.exports = router;
