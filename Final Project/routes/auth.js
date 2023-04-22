var express = require('express');
var router = express.Router();
const accountsController = require ('../account/accountController');
const { body, validationResult } = require ('express-validator');
var passport = require ('passport')
var local = require ('passport-local')
var crypto = require ('crypto')

async function loginUser(username, password, done){
    try {
        // Try to find the user with the given username
        const user = await accountsController.findByUsername(username);
        // Check if user exists or not
        if(user){
            // Check if passwords match
            // This evaluates the hashed passwords and makes sure the input
            // password is the same as the hashed one in the database
            let salt = user.salt
            if(crypto.pbkdf2Sync(password, salt, 1000000, 64, 'sha512').toString('hex') == user.password){
                return done(null, user)
            }
            else{
                return done(null, false, {message: "Wrong username or password!"})
            }
        }
        else{
            return done(null, false, {message: "Wrong username or password!"})
        }
    } catch (error) {
        console.log(error)
    }
}

passport.use(new local({
    username: 'username',
    password: 'password'
}, loginUser));

passport.serializeUser(function(user, done) {
    process.nextTick(function () {
        done(null, {id: user._id, username: user.username})
    })
})

passport.deserializeUser(function(user, done) {
    process.nextTick(function () {
        return done(null, user)
    })
})

/* GET login page */
router.get('/', function(req, res, next) {
    // If there has been an unsuccessful login, generate error text
    // Otherwise, show normal login

    try {
        if(req.session.messages){
            let error = req.session.messages.pop()
            res.render('login', { title: 'login', error: error });
        }
        else{
            res.render('login', { title: 'login'});
        }
    } catch (err) {
        console.log(err)
    }
});

/* POST login page */
/* Authenticates login using passports local strategy */
router.post('/', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureMessage: true
}));
                          
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
        let exists = 0;

        // Check if a username is already in use
        if(await accountsController.findByUsername(req.body.username)){
            exists = 1;
        }
        // If there were errors, generate the validation checks. This also checks that the password and confirmed password
        // are the same
        if(result.isEmpty() != true || req.body.password != req.body.confirmPassword || exists == 1){
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

            let existingUsername = JSON.parse('{"condition":"0","msg":"This username is already in use!"}')
            updatedResults[6] = existingUsername;

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

            // This sets the error for a username being in use
            if (exists == 1){
                updatedResults[6].condition = 1
            }
            res.render('signup', { message: results, updatedResults })
        }
        // If everything is fine, create the account
        else{
            // This hashes the password and has a randomized salt to maximize
            // security. This is set in the accounts database
            let salt = crypto.randomBytes(32).toString('hex')
            let encryptedPassword = crypto.pbkdf2Sync(req.body.password, salt, 1000000, 64, 'sha512').toString('hex')
            await accountsController.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                password: encryptedPassword,
                salt: salt
            })
            res.redirect('/login')
        }
    
});

module.exports = router;
