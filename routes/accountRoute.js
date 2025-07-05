const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/index')
const validate = require('../utilities/account-validation')

// Route to build account view
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Route to build account management view
router.get(
  '/', 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement));

// Route to build edit account view
router.get('/edit-account/:account_id', utilities.handleErrors(accountController.buildEditAccount));

// Route for processing registration without validation, just posts ALL inputs
//router.post('/register', utilities.handleErrors(accountController.registerAccount));

// Process the registration data
router.post(
    '/register',
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process login attempt
router.post(
    '/login',
    validate.loginRules(),
    validate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount)
  );

// Process account info update
router.post(
  '/edit',
  validate.updateDataRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.editAccount)
);

// Process account password update
router.post(
  '/edit-password',
  validate.updatePasswordRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.editPassword)
);

// Process logout attempt
router.get('/logout', utilities.handleErrors(accountController.logoutAccount));

module.exports = router;