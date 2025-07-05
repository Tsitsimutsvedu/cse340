// Needed Resources 
const express = require("express")
const router = new express.Router() 

// Route to break program in footer
router.get("../../views/partials/footer", utilities.handleErrors())