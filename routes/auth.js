const express = require('express');
const router = express.Router();
const passport = require('passport');

//authenticate with google, GET to auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//google auth callback, GET to /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), 
(req, res) => {
    res.redirect('/dashboard')
});

//log out user, /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router