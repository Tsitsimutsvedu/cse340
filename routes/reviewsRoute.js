// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewsController = require("../controllers/reviewsController")
const utilities = require("../utilities/index");
const validate = require("../utilities/reviews-validation");

// Route to get reviews for AJAX Route
router.get("/getReviews/:accountId", reviewsController.getReviewsJSON);

// Route to populate edit review view
router.get("/edit");

// Process the new review data
router.post("/add-review",
    utilities.handleErrors(reviewsController.addReview)
);

// Process the updates to user reviews
router.post("/edit-review",
    reviewsController.editReview
);

// Process the deletion of user reviews
router.post("/delete-review",
    reviewsController.deleteReview
);

module.exports = router;