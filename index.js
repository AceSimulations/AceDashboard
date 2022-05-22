const express = require('express')
const axios = require('axios')
const path = require('path')
const cookieParser = require('cookie-parser')
const application = require(path.join(__dirname, '/system/application/router'))
const Security = require(path.join(__dirname, 'system/application/security.js'))
// Serving the internals ONLY on a https:// connection through Circuit
const internal = require(path.join(__dirname, '/system/internal/router'))
const app = express()
require('ejs')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'public/views'))
app.use(cookieParser())

// Express inclusion
app.use(express.static(path.join(__dirname, 'public/static')))

app.get('/', (req, res) => {
    new Security().verifyClientSession(req, res)
        .then((session) => {
            res.redirect('/dashboard')
        }).catch((e) => {
            res.sendFile(path.join(__dirname, 'public/views/login.html'))
        }) 
})

app.get('/dashboard', (req, res) => {
    new Security().verifyClientSession(req, res)
        .then((session) => {
            new Security().fetchContentData(session, req)
                .then((response) => {
                    if (!response.error) {
                        if (response.currentUser.file.company === 'aceairlines') res.render('ace', { response })
                        else if (response.currentUser.file.company === 'bravoairlines') res.render('bravo/index', { response })
                        else res.render('404', { msg: response.error.msg })
                    } else res.render('404', { msg: response.error.msg })
                }).catch((e) => { res.render('404') })
        }).catch((e) => {
            if (e.error.errno === "0x0008") res.render('404', { msg: e.error.msg })
            else res.redirect('/')
        })  
})

app.use(application)
app.use(internal)

app.listen(3000, () => {
    console.log(`Circuit [OK] $::3000`)
})