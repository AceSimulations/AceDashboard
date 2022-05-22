const uniqid = require('uniqid')
const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const router = express.Router()
const os = require('os')
require('dotenv').config({ path: path.join(__dirname, '../token.env') })
var cryptr = new Cryptr(process.env.UNIVERSAL)
const status = JSON.parse(fs.readFileSync(path.join(__dirname, '../status.json')))

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(cookieParser())

class internalSecurityHandler {
    constructor() {}
    verifyClientID(clientID) {
        var env = Object.keys(process.env)
        var clientMatch = env.find((key) => process.env[key] === clientID)
        return clientMatch
    }
    // Middleware to secure and filter POST requests
    verifyClientSession(req, res, next) {
        // Parameters: request (in express)
        new Promise((resolve, reject) => {
            try {
                // Verify the authenticity of the clientID
                var env = Object.keys(process.env)
                var clientID = env.find((key) => process.env[key] === cryptr.decrypt(req.body.clientID))
                if (clientID) {
                    try {
                        // Compare the clientID and sessionID with the current 
                        var currentSession = JSON.parse(fs.readFileSync(path.join(__dirname, 'session.json')))
                        var sessionMatch = currentSession.find((session) => session.storeSessionID === cryptr.decrypt(req.body.sessionID) && session.client === clientID)
                        if (sessionMatch) {
                            try {
                                // Ensure user has the right permissions
                                var currentUser = JSON.parse(fs.readFileSync(path.join(__dirname, `clients/${sessionMatch.uniqueIdentifier}/manifest.json`)))
                                if (currentUser[0].basic.permissions[clientID.toLowerCase()]) {
                                    resolve({ session: sessionMatch })
                                } else { throw {} }
                            } catch(e) { reject({ errno: "0x0008" }) }
                        } else { throw {} }
                    } catch(e) { reject({ errno: "0x0006" }) }
                } else { throw {} }
            } catch(e) { reject({ errno: "0x0004" }) }
        })
            .then((session) => { req.session = session; next() }) 
            .catch((e) => {
                if (status.reject[e.errno]) res.send({ error: { errno: e.errno, msg: status.reject[e.errno] }, timestamp: Date.now() })
                else res.send({ error: { errno: "0x0002", msg: status.reject["0x0002"] }, timestamp: Date.now() })
            })
    }
    clientConnect(req) {
        // Parameters: request (in express)
        return new Promise((resolve, reject) => {
            try {
                // Verify the authenticity of the clientID
                var clientID = this.verifyClientID(cryptr.decrypt(req.body.clientID))
                if (clientID) {
                    try {
                        // Verify the integrity of the user authentication body
                        var user = { username: req.body.username, password: cryptr.decrypt(req.body.password) }
                        // Assign currentUser to undefined:
                        var currentUser;
                        // Sort through the current users to match the current client
                        fs.readdirSync(path.join(__dirname, 'clients')).forEach((ui) => {
                            // ui stands for Unique Identifier (the user's unique code located in the 'clients' directory)
                            // Reading the client file for auth data
                            var directoryIndex = JSON.parse(fs.readFileSync(path.join(__dirname, `clients/${ui}/manifest.json`)))
                            if (directoryIndex[0].basic.username === user.username) {
                                currentUser = { directoryIndex, uniqueIdentifier: ui }
                            }
                        })
                        if (currentUser) {
                            try {
                                // Authenticate the user's password
                                if (bcrypt.compareSync(user.password, currentUser.directoryIndex[0].auth.password)) {
                                    // Read (and update) the current session file
                                    try {
                                        // Ensure there is not a current session
                                        var currentSession = JSON.parse(fs.readFileSync(path.join(__dirname, 'session.json')))
                                        var attemptedSessionForward = currentSession.find((sess) => sess.uniqueIdentifier === currentUser.uniqueIdentifier && sess.client === clientID)
                                        if (!attemptedSessionForward) {
                                            // Create new unique sessionID
                                            var sessionID = uniqid.process()
                                            var storeSession = {
                                                resolved: true,
                                                client: clientID,
                                                uniqueIdentifier: currentUser.uniqueIdentifier,
                                                storeSessionID: sessionID
                                            }; currentSession.push(storeSession);
                                            // Write back to the user file with the updated session
                                            fs.writeFileSync(path.join(__dirname, 'session.json'), JSON.stringify(currentSession))
                                            // Resolve the promise with the encrypted sessionID
                                            resolve({ session: cryptr.encrypt(storeSession.storeSessionID) })
                                        } else {
                                            resolve({ session: cryptr.encrypt(attemptedSessionForward.storeSessionID) })
                                        }
                                    } catch(e) { reject({ errno: "0x0005" }) }
                                } else { throw {} }
                            } catch(e) {  reject({ errno: "0x0005" }) }
                        } else { throw {} } 
                    } catch(e) {  reject({ errno: "0x0005" }) }
                } else { throw {} }
            } catch(e) { reject({ errno: "0x0004" }) }
        })
    }
}

module.exports = internalSecurityHandler