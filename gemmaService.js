/**
 * Code from kvlinden monopolyService
 * Updated code for Gemma-App Database (yj225)
 */

// Set up the database connection.
const pgp = require('pg-promise')();
const db = pgp({
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    database: process.env.DB_USER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Configure the server and its routes

const express = require('express');
const app = express();
const port = process.env.PORT || 5432;
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);
router.get("/AUsers", readAUsers);
router.get("/AUsers/:emailaddress/:passphrase", readAUser);
router.get("/Pins", readPins);
router.get("/Pins/:pinid", readPin);
router.get("/Pins/:boardID", readPinFromBoard);
router.get("/Boards", readBoards);
router.get("/Boards/:boardID", readBoard);
router.get("/Boards/:UserID", readBoardFromUser);
router.put("/AUsers/:emailaddress", updateAUser);
router.post("/AUsers", createAUser);
router.post("/Boards", createBoard);
router.post("/Pins", createPin);
router.delete('/AUsers/:UserID', deleteAUser);
router.delete('/Board/:boardID', deleteBoard);
router.delete('/Pin/:pinid', deletePin);

app.use(router);
app.use(errorHandler);
app.listen(port, () => console.log(`Listening on port ${port}`));


function errorHandler(err, req, res) {
    if (app.get('env') === "development") {
        console.log(err);
    }
    res.sendStatus(err.status || 500);
}

function returnDataOr404(res, data) {
    if (data == null) {
        res.sendStatus(404);
    } else {
        res.send(data);
    }
}

function readHelloMessage(req, res) {
    res.send('Welcome to Gemma!');
}

function readAUsers(req, res, next) {
    db.many("SELECT * FROM \"AUser\"")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readAUser(req, res, next) {
    db.oneOrNone('SELECT * FROM \"AUser\" WHERE emailaddress=${emailaddress} AND passphrase=${passphrase}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function readPins(req, res, next) {
    db.many("SELECT * FROM \"Pin\"")
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        })
}

function readPin(req, res, next) {
    db.oneOrNone('SELECT * FROM \"Pin\" WHERE pinid=${pinid}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}
function readPinFromBoard(req, res, next) {
    db.many('SELECT Pin.pinid, Pin.boardID, Pin.pinName, Pin.pinNotes, Pin.pinTag, Pin.longitude, Pin.latitude FROM \"Pin\", \"Board\" WHERE Pin.boardID=${Board.boardID}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        })
}

function readBoards(req, res, next) {
    db.many("SELECT * FROM \"Board\"")
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        })
}

function readBoard(req, res, next) {
    db.oneOrNone('SELECT * FROM \"Board\" WHERE boardID=${boardID}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function readBoardFromUser(req, res, next) {
    db.oneOrNone('SELECT Board.boardID, Board.boardName, Board.boardType, Board.boardMap, Board.userID FROM \"Board\", \"AUser\" WHERE AUser.userID=${Board.userID}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updateAUser(req, res, next) {
    db.oneOrNone('UPDATE \"AUser\" SET passphrase=${body.passphrase} WHERE emailAddress=${body.email}', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function createAUser(req, res, next) {
    db.one('INSERT INTO \"AUser\"(emailAddress, passphrase) VALUES (${emailAddress}, ${passphrase}) RETURNING userID', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function createBoard(req, res, next) {
    db.one('INSERT INTO \"Board\"(boardID, boardName, boardType, boardMap, userID) VALUES \
            (${boardID}, ${boardName}, ${boardType}, ${boardMap}, ${userID})', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function createPin(req, res, next) {
    db.one('INSERT INTO \"Pin\"(boardID, pinName, pinNotes, pinTag, longitude, latitude) VALUES \
            (${boardID}, ${pinName}, ${pinNotes}, ${pinTag}, ${longitude}, ${latitude})', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function deleteAUser(req, res, next) {
    db.oneOrNone('DELETE FROM \"AUser\" WHERE UserID=${UserID} RETURNING UserID', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function deleteBoard(req, res, next) {
    db.oneOrNone('DELETE FROM \"Board\" WHERE boardID=${boardID}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function deletePin(req, res, next) {
    db.oneOrNone('DELETE FROM \"Pin\" WHERE pinid=${pinid}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}
