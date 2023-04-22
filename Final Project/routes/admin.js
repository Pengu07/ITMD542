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
    const sources = await sourceController.findAll()
    console.log(sources)
    res.render('sourcesAll', { sources: sources });
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
        console.log(req.body)

        if(result.isEmpty() != true){
            res.render('sourcesCreate', { error: result.array() })
        }

        await sourceController.create(req.body)
        res.redirect('all-sources')
});

// GET view source
router.get('/view-source/:id', async function(req, res, next) {
    
    const source = await sourceController.findByID(req.params.id)
    console.log(source)
    res.render('sourcesSingle', { source: source });
});

module.exports = router;
