const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */
validate.addClassRules = () => {
    return [
      // valid classification is required
      body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A valid vehicle classification is required.")
      .custom(async (classification_name) => {
        const classExists = await invModel.checkExistingClass(classification_name)
        if (classExists){
            throw new Error("This classification already exists. Please try enter a new classification or add vehicle to existing class.")
        }
      }),
    ]
   }

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
}

/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */
validate.addVehicleRules = () => {
  return [
    // valid vehicle make is required
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("A valid vehicle make is required."),

    // valid vehicle model is required
    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("A valid vehicle model is required."),

    // valid vehicle description is required
    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("A valid vehicle description is required."),

    // valid vehicle image is required
    body("inv_image")
    .trim()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("A valid vehicle image is required."),

    // valid vehicle thumbnail is required
    body("inv_thumbnail")
    .trim()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("A valid vehicle thumbnail is required."),

    // valid vehicle price is required
    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("A valid vehicle thumbnail is required.")
    .isNumeric(),

    // valid vehicle year is required
    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("A valid vehicle year is required."),

    // valid vehicle miles is required
    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("A valid vehicle miles is required."),

    // valid vehicle color is required
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("A valid vehicle color is required."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/add-vehicle", {
      errors,
      title: "Add New Vehicle",
      nav,
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color, 
      classificationSelect:classificationSelect,
    })
    return;
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to update inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList()
    let itemName = inv_make + inv_model
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      inv_id,
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color, 
      classificationSelect,
    })
    return;
  }
  next()
}

module.exports = validate