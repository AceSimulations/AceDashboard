const express = require('express')
const router = express.Router()
const uniqid = require('uniqid')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const Security = require(path.join(__dirname, 'security'))
require('dotenv').config({ path: path.join(__dirname, '../token.env') })
const status = JSON.parse(fs.readFileSync(path.join(__dirname, '../status.json')))
const Cryptr = require('cryptr')
var cryptr = new Cryptr(process.env.UNIVERSAL)

router.use(bodyParser.urlencoded({ extended: false }))
router.use(cookieParser())
router.use(bodyParser.json())

// TEMP: Configure current request domain
var REQUEST_DOMAIN = "http://localhost:3000"

router.post('/connect', (req, res) => {
    // Inject clientID into request body FIXME: (varies for seperate applications)
    req.body.clientID = cryptr.encrypt(process.env.CIRCUIT)
    req.body.password = cryptr.encrypt(req.body.password)
    // Make database request
    axios.post(`${REQUEST_DOMAIN}/v2`, req.body)
        .then(({ data }) => {
            if (!data.error) res.setHeader('set-cookie', `SESSIONID=${data.sessionID}; samesite=none; secure`)
            res.send(data)
        }).catch((e) => {
            res.send({ error: { errno: "0x0002", msg: status.reject["0x0002"] }, timestamp: Date.now() })
        })
})

router.post('/client/load', (req, res) => {
    // TODO: Refactor fetching content data do do both in one function
    // Request all load instances
    new Security().verifyClientSession(req, res)
        .then((session) => {
            new Security().fetchContentData(session, req)
                .then((response) => {
                    if (response.error) res.send({ error: { errno: "0x0002", msg: status.reject["0x0002"] }, timestamp: Date.now() })
                    else res.send(response)
                }).catch((e) => { res.send({ error: { errno: "0x0002", msg: status.reject["0x0002"] }, timestamp: Date.now() }) })
        }).catch((e) => {
            res.send({ error: { errno: "0x0002", msg: status.reject["0x0002"] }, timestamp: Date.now() })
        })
})

module.exports = router