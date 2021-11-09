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

// Configure the server and its routes.

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);
router.get("/AUsers", readAUsers);
router.get("/AUsers/:UserID", readAUser);
router.put("/AUsers/:UserID", updateAUser);
router.post('/AUsers', createAUser);
router.delete('/AUsers/:UserID', deleteAUser);
UserID

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
    res.send('Welcome to Gemma! ');
}

function readAUsers(req, res, next) {
    db.many("SELECT * FROM AUser")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readAUser(req, res, next) {
    db.oneOrNone('SELECT * FROM AUser WHERE UserID=${UserID}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updateAUser(req, res, next) {
    db.oneOrNone('UPDATE AUser SET emailAddress=${body.email}, passphrase=${body.passphrase}WHERE UserID=${params.UserID} RETURNING UserID', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function createAUser(req, res, next) {
    db.one('INSERT INTO AUser(emailAddress, passphrase) VALUES (${emailAddress}, ${passphrase}) RETURNING UserID', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function deleteAUser(req, res, next) {
    db.oneOrNone('DELETE FROM AUser WHERE UserID=${UserID} RETURNING UserID', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}