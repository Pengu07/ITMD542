var express = require('express');
var router = express.Router();
const contactsRepository = require ('../src/contactsMemoryRepository');
const { body, validationResults } = require ('express-validator');

router.get('/', function(req, res, next) {
  const data = contactsRepository.findAll();
  res.render('contacts', {title: 'Contacts'});
});

module.exports = router;
