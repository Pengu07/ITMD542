const contactsRepository = require ('../src/contactsRepository');
const { validationResult } = require ('express-validator');

/* GET - Find All */
exports.contacts_list = function(req, res, next) {
    const data = contactsRepository.findAll();
    res.render('contacts', {title: 'Contacts', contacts: data});
  };
  
  
  /* GET - Initialize form to create new contact */
 exports.contacts_get_create = function(req, res, next) {
      res.render('contacts_create', { title: 'Create a new contact'});
  };
  
  /* POST - Create new contact with entered fields if valid */
  exports.contacts_post_create = function(req, res, next) {
  
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
  };
  
  /* GET - Find single contact */
  exports.contacts_individual = function(req, res, next) {
      const contact = contactsRepository.findByID(req.params.id);
      if(contact) {
          res.render('contacts_single', {title: 'Contacts', contact: contact});
      }
      else {
          res.redirect('/error')
      }
    };
  
  /* GET - Delete contact */
  exports.contacts_get_delete = function(req, res, next) {
      const contact = contactsRepository.findByID(req.params.id);
      res.render('contacts_delete', { title: 'Delete Contact', contact: contact});
  };
  
  /* POST - Delete contact */
  exports.contacts_post_delete = function(req, res, next) {
      contactsRepository.deleteByID(req.params.id);
      res.redirect('/contacts')
  };
  
  /* GET - Edit contact */
  exports.contacts_get_edit = function(req, res, next) {
      const contact = contactsRepository.findByID(req.params.id);
      res.render('contacts_edit', { title: 'Edit Contact', contact: contact});
  };
  
  /* POST - Edit Contact */
  exports.contacts_post_edit = function(req, res, next) {
  
      const result = validationResult(req);
      if (result.isEmpty() != true){
          const contact = contactsRepository.findByID(req.params.id);
          res.render('contacts_edit', { title: 'Edit Contact', contact: contact, message: result.array() })
      }
      else{
          const contact = contactsRepository.findByID(req.params.id);
          const updatedContact = {
              id: req.params.id,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              notes: req.body.notes,
              creation: contact.creation,
              modified: Date(),
          };
          contactsRepository.update(updatedContact);
          res.redirect('/contacts');
      }
  };