const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth')

//bring in note schema
const Note = require('../models/Note')

//render add note page, GET to /notes/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('notes/add')
});

//process the add note form, POST to /notes
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Note.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});

//render all notes, GET to /notes
router.get('/', ensureAuth, async (req, res) => {
    try {
        const notes = await Note.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'descending' })
            .lean()
        res.render('notes/index', {
            notes
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});

//render a single note one "more" click, GET to /notes/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id)
            .populate('user')
            .lean()
        if (!note) {
           return res.render('error/404') 
        }
        res.render('notes/show', {
            note
        })
    } catch (error) {
        console.error(error)
        res.render('error/404')
    }
});

//render users public notes one user click, GET to /notes/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        let notes = await Note.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()
        
        res.render('notes/index', {notes})
    } catch (error) {
        console.error(error)
        res.render('error/404')
    }
});

//render edit page, GET to /notes/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
         const note = await Note.findOne({
        _id: req.params.id
        }).lean()
        if (!note) {
            return res.render('error/404')
        }
        if (note.user != req.user.id) {
            res.redirect('/notes')
        } else {
            res.render('notes/edit', {
                note
            })
        }
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
});

//update note once edited, PUT request /notes/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id).lean()
        if (!note) {
            return res.render('error/404')
        }
        if (note.user != req.user.id) {
            res.redirect('/notes')
        } else {
            note = await Note.findOneAndUpdate({ _id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
})

//delete a note, DELETE request /notes/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Note.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
})

module.exports = router