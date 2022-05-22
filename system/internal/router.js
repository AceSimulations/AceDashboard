const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const Security = require(path.join(__dirname, 'security.js'))
const status = JSON.parse(fs.readFileSync(path.join(__dirname, '../status.json')))

router.post('/v2', (req, res) => {
    // ROUTE FUNCTION: Authenticate user, create and return encrypted session key
    new Security().clientConnect(req)
        .then((response) => {
            res.send({
                sessionID: response.session,
                timestamp: Date.now()
            })
        }).catch((e) => {
            if (status.reject[e.errno]) res.send({ error: { errno: e.errno, msg: status.reject[e.errno] }, timestamp: Date.now() })
            else res.send({ error: { errno: "0x0002", msg: status.reject["0x0002"] }, timestamp: Date.now() })
        })
})

// FIXME: add comments

// Verifying session w/ middleware and sending the session response
router.post('/v2/session', new Security().verifyClientSession, (req, res) => { 
    res.send(req.session) 
})

// Sends the client all nessesary user and destination data
router.post('/v2/load', new Security().verifyClientSession, (req, res) => {
    var currentUser = JSON.parse(fs.readFileSync(path.join(__dirname, `clients/${req.session.session.uniqueIdentifier}/manifest.json`)))[0].basic
    var recentDestinationPush = { num: 0, file: "" };
    fs.readdirSync(path.join(__dirname, `destinations/${currentUser.company}`)).forEach((file) => {
        if (Number(file.split('.')[0]) > recentDestinationPush.num) {
            recentDestinationPush.num = Number(file.split('.')[0])
            recentDestinationPush.file = file
        }
    })
    res.send({
        currentUser: {
            file: JSON.parse(fs.readFileSync(path.join(__dirname, `clients/${req.session.session.uniqueIdentifier}/manifest.json`)))[0].basic,
            identifier: req.session.session.uniqueIdentifier
        },
        destinations: JSON.parse(fs.readFileSync(path.join(__dirname, `destinations/${currentUser.company}/${recentDestinationPush.file}`)))
    })
})

//TODO: Configure outlier routes '*'

module.exports = router