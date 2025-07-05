const utilities = require("../utilities/index")
const reviewModel = require("../models/reviews-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Process New Review
* *************************************** */
async function addReview (req, res, next) {
  let nav = await utilities.getNav()
  let view = await utilities.buildSingleView()
  const { review_text, review_date, inv_id, account_id } = req.body

  const newReviewResult = await reviewModel.addNewReview(
    review_text,
    review_date,
    inv_id,
    account_id
  )

  if (newReviewResult) {
    const itemName = newReviewResult.inv_year + " " + newReviewResult.inv_make + " " + newReviewResult.inv_model
    req.flash(
      "notice",
      `New review successfully added.`
    )
    res.status(201).render("inventory/single", {
      title: itemName,
      nav,
      view,
      errors: null,
    })
  } else {
    req.flash("notice", `Sorry, add vehicle process failed. Try again.`)
    res.status(501).render("inventory/single", {
      title: itemName,
      nav,
      view,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Reviews by Account As JSON
 * ************************** */
async function getReviewsJSON(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const reviewData = await reviewModel.getReviewByAccountId(account_id)
  if (reviewData[0].review_id) {
    return res.json(reviewData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
*  Process Edit Review
* *************************************** */
async function editReview (req, res, next) {
  let nav = await utilities.getNav()
  const { 
    review_id,
    review_text,
    review_date,
    inv_id,
    account_id 
  } = req.body

  const updateResult = await reviewModel.editReview(
    review_id,
    review_text,
    review_date,
    inv_id,
    account_id 
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
*  Process Delete Review
* *************************************** */
async function deleteReview (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const account_id = parseInt(req.body.account_id)
  const deleteResult = await reviewModel.deleteReview(review_id)

  if (deleteResult) {
    req.flash("notice", `The vehicle was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", `Sorry, the vehicle was not deleted. Please try again.`)
    res.redirect("delete/inv_id") 
  }
}

module.exports = {
    addReview,
    getReviewsJSON,
    editReview,
    deleteReview,
}