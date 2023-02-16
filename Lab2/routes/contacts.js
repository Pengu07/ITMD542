var express = require('express');
var router = express.Router();
const contactsRepository = require ('../src/contactsMemoryRepository');
const { body, validationResult } = require ('express-validator');

router.get('/', function(req, res, next) {
  const data = contactsRepository.findAll();
  res.render('contacts', {title: 'Contacts', contacts: data});
});

router.get('/create', function(req, res, next) {
    res.render('contacts_create', { title: 'Create a new contact'});
});

router.post('/create',
    body('firstName').trim().notEmpty().withMessage('First Name cannot be empty!'),
    body('lastName').trim().notEmpty().withMessage('Last Name cannot be empty!'),
    body('email').trim().notEmpty().withMessage('Email cannot be empty!').isEmail().withMessage('Must be a valid email address!'),
    body('notes').trim(),
    function(req, res, next) {

    const result = validationResult(req);
    if (result.isEmpty() != true){
        res.render('contacts_create', { title: 'Create a new contact', message: result.array() })
    }
    else{
        contactsRepository.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            notes: req.body.notes,
        });

        res.redirect('/contacts');
    }
});

module.exports = router;
