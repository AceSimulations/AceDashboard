// This file is used in the main index file to verify the session of certain route requests
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const Cryptr = require('cryptr')
const { resolve } = require('path')
require('dotenv').config({ path: path.join(__dirname, '../token.env') })
const cryptr = new Cryptr(process.env.UNIVERSAL)
const status = JSON.parse(fs.readFileSync(path.join(__dirname, '../status.json')))

// TEMP: Configure current request domain
var REQUEST_DOMAIN = "http://localhost:3000"

class applicationSecurity {
    constructor() {}
    // Middleware to request session verification
    verifyClientSession(req, res) {
        return new Promise((resolve, reject) => {
            // Verifies the current session (client-side use only)
            axios.post(`${REQUEST_DOMAIN}/v2/session`, {
                sessionID: req.cookies.SESSIONID,
                clientID: cryptr.encrypt(process.env.CIRCUIT)
            })
                .then(({ data }) => {
                    if (!data.error) resolve(data)
                    else reject(data)
                }).catch((e) => {
                    res.send({ error: { errno: "0x0002", msg: status.reject["0x0002"] }, timestamp: Date.now() })
                })
        })
    }
    fetchContentData(session, req) {
        return new Promise((resolve, reject) => {
            // Returns all data needed for Circuit
            axios.post(`${REQUEST_DOMAIN}/v2/load`, {
                sessionID: req.cookies.SESSIONID,
                clientID: cryptr.encrypt(process.env.CIRCUIT),
                session: session.session
            })
                .then(({ data }) => resolve(data))
                .catch((e) => reject())
        })
    }
}

module.exports = applicationSecurity