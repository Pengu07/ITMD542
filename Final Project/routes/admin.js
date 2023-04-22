var express = require('express');
var router = express.Router();
var sourceController = require('../sources/sourceController')
const { body, validationResult } = require ('express-validator');

/* GET admin page. */
router.get('/', function(req, res, next) {
    res.render('admin', { title: 'Admin' });
});

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
            res.render('sourcesUpdate', { error: result.array() })
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

// POST edit source
router.post('/delete-source/:id', async function(req, res, next){
    console.log(req.body)
    //console.log(result)
    try {
        await sourceController.deleteByID(req.params.id)
        res.redirect('/admin/all-sources')
    } catch (error) {
        console.log(error)
        res.redirect('/error')
    }
});


module.exports = router;
