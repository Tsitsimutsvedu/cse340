const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by single view
 * ************************** */
invController.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getSingleByInventoryId(inv_id)
  const view = await utilities.buildSingleView(data)
  let nav = await utilities.getNav()
  const vehicleName = data.inv_year + " " + data.inv_make + " " + data.inv_model
  res.render("./inventory/single", {
    title: vehicleName,
    nav,
    view,
  })
}

/* ***************************
 *  Deliver management view
 * ************************** */
invController.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let manageView = await utilities.buildManagementView()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    manageView,
    errors: null,
    classificationSelect,
  })
}

/* ***************************
 *  Deliver add new classification view
 * ************************** */
invController.buildAddNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process New Classification
* *************************************** */
invController.addNewClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  let manageView = await utilities.buildManagementView()
  const classificationSelect = await utilities.buildClassificationList()
  const { classification_name } = req.body

  const newClassResult = await invModel.addNewClass(
    classification_name,
  )

  if (newClassResult) {
    req.flash(
      "notice",
      `New classification successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      manageView,
      errors: null,
      classificationSelect,
    })
  } else {
    req.flash("notice", `Sorry, add classification process failed. Try again.`)
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Deliver Add New Vehicle view
 * ************************** */
invController.buildAddNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-vehicle", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ****************************************
*  Process New Vehcile
* *************************************** */
invController.addNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let manageView = await utilities.buildManagementView()
  const classificationSelect = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body

  const newVehicleResult = await invModel.addNewVehicle(
    inv_make, 
    inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color, 
    classification_id,
  )

  if (newVehicleResult) {
    req.flash(
      "notice",
      `New vehicle successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      manageView,
      classificationSelect,
      errors: null,
    })
  } else {
    req.flash("notice", `Sorry, add vehicle process failed. Try again.`)
    res.status(501).render("inventory/add-vehicle", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
*  Deliver edit inventory view
* *************************************** */
invController.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getSingleByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  })
}

/* ****************************************
*  Process Update Vehcile
* *************************************** */
invController.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { 
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
    classification_id 
  } = req.body

  const updateResult = await invModel.updateInventory(
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
    classification_id,
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", `Sorry, the update failed. Please try again.`)
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  }
}

/* ****************************************
*  Deliver delete inventory view
* *************************************** */
invController.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getSingleByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ****************************************
*  Process Delete Vehcile
* *************************************** */
invController.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", `The vehicle was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", `Sorry, the vehicle was not deleted. Please try again.`)
    res.redirect("delete/inv_id") 
  }
}

module.exports = invController