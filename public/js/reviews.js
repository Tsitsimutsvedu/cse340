'use strict' 
 
 // Get a list of user reviews in reviews based on the account_id
 let reviewsList = document.querySelector("#reviewsList")
 reviewsList.addEventListener("change", function () { 
  let account_id = reviewsList.value 
  console.log(`account_id is: ${account_id}`) 
  let accountIdURL = "/account/getReviews/"+account_id 
  fetch(accountIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
   console.log(data); 
   buildReviewsList(data); 
  }) 
  .catch(function (error) { 
   console.log('There was a problem: ', error.message) 
  }) 
 })

 
 // Build inventory items into HTML table components and inject into DOM 
function buildReviewList(data) { 
    let reviewDisplay = document.getElementById("reviewDisplay"); 
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>My Reviews</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) { 
     console.log(element.account_id + ", " + element.review_date); 
     dataTable += `<tr><td> Reviewed the ${element.inv_year} ${element.inv_make} ${element.inv_model} on ${element.review_date}</td>`; 
     dataTable += `<td><a href='/reviews/edit/${element.account_id}' title='Click to update'>Edit</a></td>`; 
     dataTable += `<td><a href='/reviews/delete/${element.account_id}' title='Click to delete'>Delete</a></td></tr>`; 
    }) 
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    reviewDisplay.innerHTML = dataTable; 
   }