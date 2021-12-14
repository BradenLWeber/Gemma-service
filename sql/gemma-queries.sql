-- Sample queries to test Gemma's database.
-- @author: Grace Jung

-- Get the AUser records.
SELECT *
  FROM "AUser"
  ;

-- Get the Pins records.
SELECT * 
  FROM "Pin"
  ;

-- Get the Boards records.
SELECT * 
  FROM "Board"
  ;

-- Get the cross-product of all the tables.
SELECT *
  FROM "AUser", "Board"
  ;