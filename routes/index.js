const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')

//bring in note schema
const Note = require('../models/Note')

//login/landing page, GET to /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
});

//dashboard, GET to /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    // Note.find({user: req.user.id}).lean()
    //     .then(notes =>  {
    //         res.render('dashboard', {name: req.user.firstName, notes})
    //     })
    //     .catch(err => {
    //         console.error(error)
    //         res.render('error/500')
    //     })
    try {
        const notes = await Note.find({user: req.user.id}).lean();
        res.render('dashboard', {name: req.user.firstName, notes})

    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});

module.exports = router