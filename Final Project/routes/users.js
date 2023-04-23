var express = require('express');
var router = express.Router();
const { body, validationResult } = require ('express-validator');
var accountController = require('../account/accountController')
var crypto = require ('crypto')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET change user password
router.get('/change-password/:id', async function(req, res, next) {
  // Check if user is authenticated
  if(!req.isAuthenticated()){
      return res.redirect('/login')
  }

  else if(req.isAuthenticated()){
      const checkUser = await accountController.findByID(req.user.id)
      if(checkUser._id.toHexString() != req.user.id){
          return res.redirect('/error/permission')
      }

      else if(checkUser._id.toHexString() == req.user.id){
          const user = await accountController.findByID(req.params.id)
          res.render('changePasswordAdmin', { loggedUser: req.user,  user: user });
      }
  }
});

// POST change user password
router.post('/change-password/:id',
  body('password').trim().notEmpty().withMessage('The new password cannot be empty!'),
  body('password').trim().isLength({min:8}).withMessage('Password must be at least 8 characters!'),
  async function(req, res, next){
  // Check if user is authenticated
  if(!req.isAuthenticated()){
      return res.redirect('/login')
  }

  else if(req.isAuthenticated()){
      const checkUser = await accountController.findByID(req.user.id)
      if(checkUser._id.toHexString() != req.user.id){
        return res.redirect('/error/permission')
      }

      else if(checkUser._id.toHexString() == req.user.id){
          const result = validationResult(req);
          //console.log(req.body)
          console.log(result)
          if(result.isEmpty() != true){
              const user = await accountController.findByID(req.params.id)
              res.render('changePasswordAdmin', { loggedUser: req.user,  user: user, error: result.array() })
          }

          else{
              const user = await accountController.findByID(req.params.id)
              const newPassword = crypto.pbkdf2Sync(req.body.password, user.salt, 1000000, 64, 'sha512').toString('hex')
              console.log(newPassword)
              await accountController.changePassword(req.params.id, newPassword)
              res.redirect('/admin')
          }
      }
  }
});

module.exports = router;
