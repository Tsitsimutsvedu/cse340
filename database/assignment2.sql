-- Query 1
INSERT INTO 
    "account" (account_firstname, account_lastname, account_email, account_password)
VALUES
    ('Tony', 'Stark', 'tony@starknet.com', 'Iam1ronM@n');

-- Query 2
UPDATE
    "account"
SET
    account_type = 'Admin'
WHERE  
    account_id = 1;

--Query 3
DELETE FROM
    "account"
WHERE  
    account_id = 1;

-- Query 4
UPDATE
  "inventory"
SET
  inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior');

-- Query 5
SELECT
	classification_name, inv_make, inv_model
FROM 
	"classification"
INNER JOIN
	"inventory"
	ON "classification".classification_id = "inventory".classification_id
	WHERE "classification".classification_id = 2;

-- Query 6
UPDATE
	"inventory"
SET 
	inv_image = REPLACE(inv_image, 's/', 's/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, 's/', 's/vehicles/');