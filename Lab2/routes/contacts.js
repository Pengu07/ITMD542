var express = require('express');
var router = express.Router();
const contactsRepository = require ('../src/contactsMemoryRepository');
const { body, validationResults } = require ('express-validator');

router.get('/', function(req, res, next) {
  const data = contactsRepository.findAll();
  res.render('contacts', {title: 'Contacts'});
});

router.get('/create', function(req, res, next) {
    res.render('contacts_create', { title: 'Create a new contact'});
});

module.exports = router;
