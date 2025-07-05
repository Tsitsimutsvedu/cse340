/* *****************************
*   Add new review to reviews
* *************************** */
async function addNewReview(review_text, review_date, inv_id, account_id){
  try {
    const sql = `INSERT INTO review (review_text, review_date, inv_id, account_id) VALUES ($1, $2, $3, $4) RETURNING *`
    console.log("SQL", sql);
    console.log("Values:", review_text, review_date, inv_id, account_id)
    return await pool.query(sql, [review_text, review_date, inv_id, account_id]);
  } catch (error) {
    console.log("Error:", error.message);
    return error.message
  }
}

/* *****************************
*   Update vehicle information
* *************************** */
async function updateInventory(
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
  ) {
    try {
      const sql = `UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *`
      console.log("SQL", sql);
      console.log("Values:", inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)
      const data = await pool.query(sql, [
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
        inv_id,
      ])
      return data.rows[0]
    } catch (error) {
      console.log("Error: " + error);
    }
  }
  
  /* *****************************
  *   Delete vehicle information
  * *************************** */
  async function deleteInventory(inv_id) {
    try {
      const sql = `DELETE FROM inventory WHERE inv_id = $1`
      console.log("SQL", sql);
      console.log("Values:", inv_id)
      const data = await pool.query(sql, [inv_id])
      return data
    } catch (error) {
      console.log("Error: " + error);
    }
  }