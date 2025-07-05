// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index");
const validate = require("../utilities/inv-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by single view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build Vehicle Management view to add classifications and inventory
router.get(
    "/", 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildManagementView));

// Route to build Add New Classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddNewClassification))

// Route to build Add New Vehicle view
router.get("/add-vehicle", utilities.checkAccountType, utilities.handleErrors(invController.buildAddNewVehicle));

// Route to get inventory for AJAX Route
router.get(
    "/getInventory/:classification_id", 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.getInventoryJSON))

// Route to build Modify Inventory view
router.get(
    "/edit/:inv_id", 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildEditInventory));

// Route to build Delete Inventory view
router.get("/delete/:inv_id", utilities.checkAccountType,utilities.handleErrors(invController.buildDeleteInventory));

// Process the new classification data
router.post(
    "/add-classification",
    validate.addClassRules(),
    validate.checkClassData,
    utilities.handleErrors(invController.addNewClass)
);

// Process the new vehicle data
router.post(
    "/add-vehicle",
    validate.addVehicleRules(),
    validate.checkVehicleData,
    utilities.handleErrors(invController.addNewVehicle)
);

// Process the updates to inventory items
router.post(
    "/update",
    validate.addVehicleRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

// Process the deletion of inventory items 
// This route should match the action tag in the delete vehicle view
router.post(
    "/delete",
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;