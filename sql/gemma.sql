-- Database Schema from Domain Model
-- Drop previous versions of the tables if they exist, in reverse order of foreign keys.
DROP TABLE IF EXISTS "Media";
DROP TABLE IF EXISTS "Tag";
DROP TABLE IF EXISTS "Coordinates";
DROP TABLE IF EXISTS "AUser";
-- Create the schema.
CREATE TABLE "AUser" (
    UserID int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    emailAddress varchar(100) NOT NULL,
    passphrase varchar(100) NOT NULL,
    viewPublic char(3) NOT NULL --PUB or PRI
    );
CREATE TABLE "Coordinates" (
    UserID int NOT NULL, -- read this when person logs in
    pinID char(5) PRIMARY KEY, -- make this generate automatically
    pinName varchar(100),
    longitude decimal(16,14) NOT NULL, -- -180 to +180
    latitude decimal(16,14)  NOT NULL,   -- -90  to +90
    pinNotes varchar(500),
    -- isPublic
    CONSTRAINT fk_coordinates
        FOREIGN KEY(UserID) REFERENCES "AUser"(UserID)
    );
CREATE TABLE "Tag" (
    tagID char(5) PRIMARY KEY,
    tagName varchar(50),
    pinID char(5) NOT NULL,
    CONSTRAINT fk_tag
      FOREIGN KEY(pinID) REFERENCES "Coordinates"(pinID)
    );
CREATE TABLE "Media" (
    pinID char(5) NOT NULL,
    CONSTRAINT fk_media
      FOREIGN KEY(pinID) REFERENCES "Coordinates"(pinID)
    );

--Allow users to select data from the tables.
--EL added quotes around table names; ElephantSQL couldn't find them otherwise
GRANT SELECT ON "AUser" TO PUBLIC;
GRANT SELECT ON "Coordinates" TO PUBLIC;
GRANT SELECT ON "Tag" TO PUBLIC;
GRANT SELECT ON "Media" TO PUBLIC;

-- Add sample records
INSERT INTO "AUser"(emailAddress, passphrase, viewPublic) VALUES ('yj225@students.calvin.edu', 'GemmaDemo0', 'PUB');
INSERT INTO "AUser"(emailAddress, passphrase, viewPublic) VALUES ('ehl6@students.calvin.edu', 'GemmaDemo0', 'PRI');
INSERT INTO "AUser"(emailAddress, passphrase, viewPublic) VALUES ('rmd34@students.calvin.edu', 'GemmaDemo0', 'PUB');
INSERT INTO "AUser"(emailAddress, passphrase, viewPublic) VALUES ('blw22@students.calvin.edu', 'GemmaDemo0', 'PUB');
INSERT INTO "AUser"(emailAddress, passphrase, viewPublic) VALUES ('ots3@students.calvin.edu', 'GemmaDemo0', 'PUB');

INSERT INTO "Coordinates" VALUES (12, 1, 'The middle of the map', -85.5795755, 42.934196, 'this pin is in the middle of the map!');

