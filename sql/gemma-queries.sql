-- Get the AUser records.
SELECT *
  FROM AUser
  ;

-- Get the Coordinates records.
SELECT * 
  FROM Coordinates
  ;

-- Get Tags from Pins put in the Coordinate records
SELECT *
  FROM Tag
 ;


-- Get the cross-product of all the tables.
SELECT *
  FROM AUser, Coordinate
  ;