var express = require('express');
var router = express.Router();
var sourceController = require('../sources/sourceController')
var itemController = require('../item/itemController')
var accountController = require('../account/accountController')
const { body, validationResult } = require ('express-validator');

/* GET admin page. */
router.get('/', function(req, res, next) {
    res.render('admin', { title: 'Admin' });
});

/*

    This portion of the router is dedicated to the item source pages

*/

// GET all sources
router.get('/all-sources', async function(req, res, next) {
    try {
        const sources = await sourceController.findAll()
        //console.log(sources)
        res.render('sourcesAll', { sources: sources });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

// GET create source
router.get('/create-source', function(req, res, next) {
    res.render('sourcesCreate');
});

// POST create source
router.post('/create-source',
    body('sourceName').trim().notEmpty().withMessage('Name cannot be empty!'),
    body('location').trim().notEmpty().withMessage('Location cannot be empty!'),
    body('type').trim().notEmpty().withMessage('The type cannot be empty!'),
    body('level').trim().isInt({min: 1, max: 60}).withMessage('The level must be a number between 1 and 60!'),
    async function(req, res, next){
        const result = validationResult(req);
        //console.log(req.body)

        if(result.isEmpty() != true){
            res.render('sourcesCreate', { error: result.array() })
        }
        else{
            try {
                await sourceController.create(req.body)
                res.redirect('/admin/all-sources')
            } catch (error) {
                console.log(error)
                res.redirect('/error')
            }
        }
});

// GET view source
router.get('/view-source/:id', async function(req, res, next) {
    try {
        const source = await sourceController.findByID(req.params.id)
        res.render('sourcesSingle', { source: source });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

// GET edit source
router.get('/edit-source/:id', async function(req, res, next) {
    try {
        const source = await sourceController.findByID(req.params.id)
        res.render('sourcesUpdate', { source: source });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

// POST edit source
router.post('/edit-source/:id',
    body('sourceName').trim().notEmpty().withMessage('Name cannot be empty!'),
    body('location').trim().notEmpty().withMessage('Location cannot be empty!'),
    body('level').trim().isInt({min: 1, max: 60}).withMessage('The level must be a number between 1 and 60!'),
    async function(req, res, next){
        const result = validationResult(req);
        console.log(req.body)
        //console.log(result)
        if(result.isEmpty() != true){
            const source = await sourceController.findByID(req.params.id)
            res.render('sourcesUpdate', { source: source, error: result.array() })
        }
        else{
        try {
            await sourceController.update(req.params.id, req.body)
            res.redirect('/admin/all-sources')
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
        }
});


// GET delete source
router.get('/delete-source/:id', async function(req, res, next) {
    try {
        const source = await sourceController.findByID(req.params.id)
        res.render('sourcesDelete', { source: source });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

// POST delete source
router.post('/delete-source/:id', async function(req, res, next){
    //console.log(req.body)
    //console.log(result)
    try {
        const source = await sourceController.findByID(req.params.id)
        const items = await itemController.findBySource(source.name)
        //console.log(items)
        if(items.length > 0){
            const error = []
            let errorMessage = JSON.parse('{"msg":"There are still items tied to this source!"}')
            error.push(errorMessage)
            //console.log(error)
            res.render('sourcesDelete', {source: source, error: error, items: items})
        }
        else{
            await sourceController.deleteByID(req.params.id)
            res.redirect('/admin/all-sources')
        }

    } catch (error) {
        console.log(error)
        res.redirect('/error')
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
    try {
        const items = await itemController.findAll()
        //console.log(items)
        res.render('itemsAll', { items: items });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

// GET create item
router.get('/create-item', async function(req, res, next) {
    const sourceList = await sourceController.findAll()
    res.render('itemsCreate', {rarityList: Object.keys(Rarity), sourceList: sourceList});
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
        const result = validationResult(req);
        console.log(result)
        if(result.isEmpty() != true){
            const sourceList = await sourceController.findAll()
            res.render('itemsCreate', { rarityList: Object.keys(Rarity), sourceList: sourceList, error: result.array() })
        }
        else{
            try {
                const source = await sourceController.findByName(req.body.source)
                await itemController.create(req.body, source)
                res.redirect('/admin/all-items')
            } catch (error) {
                console.log(error)
                res.redirect('/error')
            }
        }
});

// GET view item
router.get('/view-item/:id', async function(req, res, next) {
    try {
        const item = await itemController.findByID(req.params.id)
        res.render('itemsSingle', { item: item });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

// GET edit item
router.get('/edit-item/:id', async function(req, res, next) {
    try {
        const item = await itemController.findByID(req.params.id)
        const sourceList = await sourceController.findAll()
        res.render('itemsUpdate', { item: item, rarityList: Object.keys(Rarity), sourceList: sourceList });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
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
        const result = validationResult(req);
        console.log(req.body)
        console.log(result)
        if(result.isEmpty() != true){
            const item = await itemController.findByID(req.params.id)
            const sourceList = await sourceController.findAll()
            res.render('itemsUpdate', {  item: item, rarityList: Object.keys(Rarity), sourceList: sourceList, error: result.array() })
        }
        else{
        try {
            const source = await sourceController.findByName(req.body.source)
            await itemController.update(req.params.id, req.body, source)
            res.redirect('/admin/all-items')
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
        }
});

// GET delete item
router.get('/delete-item/:id', async function(req, res, next) {
    try {
        const item = await itemController.findByID(req.params.id)
        res.render('itemsDelete', { item: item });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

// POST delete item
router.post('/delete-item/:id', async function(req, res, next){
    console.log(req.body)
    //console.log(result)
    try {
        await itemController.deleteByID(req.params.id)
        res.redirect('/admin/all-items')
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});


/*

    This portion of the router is dedicated to the user pages

*/


// GET all users
router.get('/all-users', async function(req, res, next) {
    try {
        const users = await accountController.findAll()
        //console.log(users)
        res.render('usersAll', { users: users });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

// GET view user
router.get('/view-user/:id', async function(req, res, next) {
    try {
        const user = await accountController.findByID(req.params.id)
        res.render('usersSingle', { user: user });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

// GET edit user
router.get('/edit-user/:id', async function(req, res, next) {
    try {
        const user = await accountController.findByID(req.params.id)
        res.render('usersUpdate', { user: user });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

// POST edit user
router.post('/edit-user/:id',
    body('username').trim().notEmpty().withMessage('Username cannot be empty!'),
    body('firstName').trim().notEmpty().withMessage('First name cannot be empty!'),
    body('lastName').trim().notEmpty().withMessage('Last name cannot be empty!'),
    async function(req, res, next){
        const result = validationResult(req);
        console.log(req.body)
        //console.log(result)
        if(result.isEmpty() != true){
            const user = await accountController.findByID(req.params.id)
            res.render('usersUpdate', { user: user, error: result.array() })
        }
        else{
        try {
            await accountController.update(req.params.id, req.body)
            res.redirect('/admin/all-users')
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
        }
});


// GET delete user
router.get('/delete-user/:id', async function(req, res, next) {
    try {
        const user = await accountController.findByID(req.params.id)
        res.render('usersDelete', { user: user });
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

// POST delete user
router.post('/delete-user/:id', async function(req, res, next){
    //console.log(req.body)
    //console.log(result)
    try {
        const user = await accountController.findByID(req.params.id)
        //console.log(user)
        if(user.admin == "admin"){
            const error = []
            let errorMessage = JSON.parse('{"msg":"This user is an admin! Remove their admin first so they can be deleted."}')
            error.push(errorMessage)
            //console.log(error)
            res.render('usersDelete', {user: user, error: error})
        }
        else{
            await accountController.deleteByID(req.params.id)
            res.redirect('/admin/all-users')
        }

    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});

module.exports = router;
