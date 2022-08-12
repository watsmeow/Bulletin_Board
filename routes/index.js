const express = require('express');
const router = express.Router();

//login/landing page, GET to /
router.get('/', (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

//dashboard, GET to /dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

module.exports = router