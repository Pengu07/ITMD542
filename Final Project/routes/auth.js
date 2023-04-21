var express = require('express');
var router = express.Router();
const accountsController = require ('../account/accountController');
const { body, validationResult } = require ('express-validator');

/* GET login page */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'login' });
});

/* GET signup page */
router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'signup' });
});

/* POST signup page */
router.post('/signup',
    body('firstName').trim().notEmpty().withMessage('First name cannot be empty!'),
    body('lastName').trim().notEmpty().withMessage('Last name cannot be empty!'),
    body('username').trim().notEmpty().withMessage('Username cannot be empty!'),
    body('password').trim().isLength({min:8}).withMessage('Password must be at least 8 characters!'),
    body('confirmPassword').trim().notEmpty().withMessage('Confirmed Password cannot be empty!'),
    async function(req, res, next){
        const result = validationResult(req);

        // If there were errors, generate the validation checks. This also checks that the password and confirmed password
        // are the same
        if(result.isEmpty() != true || req.body.password != req.body.confirmPassword){
            const results = result.array()
            const updatedResults = []

            // Each of these blocks sets the initial validation for each field in the form
            let firstNameError = JSON.parse('{"condition":"0", "location":"firstName", "msg":"0", "text":""}')
            firstNameError.text=req.body.firstName
            updatedResults[0] = firstNameError

            let lastNameError = JSON.parse('{"condition":"0", "location":"lastName", "msg":"0", "text":""}')
            lastNameError.text=req.body.lastName
            updatedResults[1] = lastNameError

            let usernameError = JSON.parse('{"condition":"0", "location":"username", "msg":"0", "text":""}')
            usernameError.text=req.body.username
            updatedResults[2] = usernameError

            let passwordError = JSON.parse('{"condition":"0", "location":"password", "msg":"0", "text":""}')
            passwordError.text=req.body.password
            updatedResults[3] = passwordError

            let confirmPasswordError = JSON.parse('{"condition":"0", "location":"confirmPassword", "msg":"0", "text":""}')
            confirmPasswordError.text=req.body.confirmPassword
            updatedResults[4] = confirmPasswordError

            let confirmPasswordMatches = JSON.parse('{"condition":"0","msg":"Passwords must match!"}')
            updatedResults[5] = confirmPasswordMatches;

            // This checks all the errors that are provided, and then sets them accordingly
            results.forEach(value => {
                if(value.path == 'firstName'){
                    updatedResults[0].condition = 1
                    updatedResults[0].msg = value.msg
                }
                else if(value.path == 'lastName'){
                    updatedResults[1].condition = 1
                    updatedResults[1].msg = value.msg
                }
                else if(value.path == 'username'){
                    updatedResults[2].condition = 1
                    updatedResults[2].msg = value.msg
                }
                else if(value.path == 'password'){
                    updatedResults[3].condition = 1
                    updatedResults[3].msg = value.msg
                }
                else if(value.path == 'confirmPassword'){
                    updatedResults[4].condition = 1
                    updatedResults[4].msg = value.msg
                }
            });

            // This sets the error for the passwords not matching
            if (req.body.password != req.body.confirmPassword){
                updatedResults[5].condition = 1
            }

            res.render('signup', { message: results, updatedResults })
        }
        // If everything is fine, create the account
        else{
            await accountsController.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                password: req.body.password
            })
            res.redirect('/login')
        }
    
});

module.exports = router;
