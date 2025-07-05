const utilities = require("../utilities/index)")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    //let regView = await utilities.buildRegister()
    res.render("account/register", {
        title: "Register",
        nav,
        //regView,
        errors: null,
    })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
       // save login
       req.session.account_id = accountData.account_id; // id
       req.session.account_name = accountData.account_firstname; // name
       req.session.is_logged_in = true;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function logoutAccount(req, res) {
  // Clear the JWT cookie
  res.clearCookie("jwt");

  // Provide a message or redirect to the home page
  req. flash("notice", 'You have successfully logged out.')
  return res.redirect("/")
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  //let logView = await utilities.buildLogin()
  //let regView = await utilities.buildRegister()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      //logView,
      errors: null,
    })
  } else {
    req.flash("notice", `Sorry, the registration failed.`)
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      //regView,
      errors: null,
    })
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname } = req.body
  res.render("account/account-manage", {
      title: "Account Management",
      nav,
      errors: null,
  })
}

/* ****************************************
*  Deliver edit account view
* *************************************** */
async function buildEditAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  console.log(accountData)
  res.render("./account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ****************************************
*  Process edit account
* *************************************** */
async function editAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const editResult = await accountModel.updateAccount(
    account_id, 
    account_firstname,
    account_lastname,
    account_email,
  )

  if (editResult) {
    req.flash(
      "notice",
      `Congratulations, ${account_firstname}. Your account was successfully updated.`
    )
    res.status(201).render("account/account-manage", {
      title: "Account Management",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
  } else {
    req.flash("notice", `Sorry, the update failed. Please try again.`)
    res.status(501).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname, 
      account_lastname,
      account_email,
      account_id,
    })
  }
}

/* ****************************************
*  Process edit password
* *************************************** */
async function editPassword(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password, account_id } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the update.')
    res.status(500).render("account/edit-password", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }

  const editResult = await accountModel.updatePassword(
    account_id,
    hashedPassword,
  )

  if (editResult) {
    req.flash(
      "notice",
      `Congratulations, ${account_firstname}. Your password was successfully updated.`
    )
    res.status(201).render("account/account-manage", {
    title: "Account Management",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  })
} else {
  req.flash("notice", `Sorry, the update failed. Please try again.`)
  res.status(501).render("account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname, 
    account_lastname,
    account_email,
    account_id,
  })
}
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  loginAccount, 
  logoutAccount,
  buildAccountManagement,
  buildEditAccount,
  editAccount,
  editPassword,
 };