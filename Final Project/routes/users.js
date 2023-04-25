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
          if(checkUser.admin == "n"){
            res.render('changePasswordUser', { loggedUser: req.user,  user: checkUser });
          }
          else if(checkUser.admin == "admin"){
            res.render('changePasswordAdmin', { loggedUser: req.user,  user: checkUser });
          }
          else{
            return res.redirect('/error')
          }
      }
    }
  });

// POST change user password
router.post('/change-password/:id',
  body('password').trim().notEmpty().withMessage('The new password cannot be empty!'),
  body('password').trim().isLength({min:8}).withMessage('Password must be at least 8 characters!'),
  body('confirmPassword').trim().notEmpty().withMessage('The password confirmation cannot be empty!'),
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
          const result = validationResult(req).array();
          console.log(result)
          // This sets the error for the passwords not matching
          if (req.body.password != req.body.confirmPassword){
            let errorMessage = JSON.parse('{"msg":"The passwords must match!"}')
            result.push(errorMessage)
          }
          //console.log(req.body)
          console.log(result)
          if(result.length > 0){
            if(checkUser.admin == "n"){
              res.render('changePasswordUser', { loggedUser: req.user,  user: checkUser, error: result })
            }
            else if(checkUser.admin == "admin"){
              res.render('changePasswordAdmin', { loggedUser: req.user,  user: checkUser, error: result })
            }
            else{
              return res.redirect('/error')
            }
              
          }

          else{
              const user = await accountController.findByID(req.params.id)
              const newPassword = crypto.pbkdf2Sync(req.body.password, user.salt, 1000000, 64, 'sha512').toString('hex')
              console.log(newPassword)
              await accountController.changePassword(req.params.id, newPassword)
              if(checkUser.admin == "n"){
                res.redirect('/home/success')
              }
              else if(checkUser.admin == "admin"){
                res.redirect('/admin/success')
              }
              else{
                return res.redirect('/error')
              }
          }
      }
  }
});

module.exports = router;
