const express = require('express');
const router = express.Router();

// Article Model
let Note = require('../models/note');
// User Model
let User = require('../models/user');



// route for index
router.get('/home', ensureAuthenticated, (req, res) => {
    Note.find({}, (err, notes) => {

        if (err) {
            console.log(err);
        } else {

            res.render('index', {
                title: 'My Notes',
                notes: notes
            });
        }
    });
});

// Add Route
router.get('/add', ensureAuthenticated, function(req, res) {
    res.render('add_note', {
        title: 'Add Note'
    });
});

// Add Submit POST Route
router.post('/add', function(req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_note', {
            title: 'Add Note',
            errors: errors
        });
    } else {
        let note = new Note();
        note.title = req.body.title;
        note.author = req.user._id;
        note.body = req.body.body;

        note.save(function(err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Note Added');
                res.redirect('/notes/home');
            }
        });
    }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
    Note.findById(req.params.id, function(err, note) {
        if (note.author != req.user._id) {
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        res.render('edit_note', {
            title: 'Edit Note',
            note: note
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res) {
    let note = {};
    note.title = req.body.title;
    note.author = req.body.author;
    note.body = req.body.body;

    let query = { _id: req.params.id }

    Note.update(query, article, function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Note Updated');
            res.redirect('/notes/home');
        }
    });
});

// Delete Article
router.delete('/:id', function(req, res) {

    let query = { _id: req.params.id }

    Note.findById(req.params.id, function(err, note) {

        res.status(500).send();

        Note.remove(query, function(err) {
            if (err) {
                console.log(err);
            }
            res.send('Success');
        });

    });
});



// Get Single Article
router.get('/:id', function(req, res) {
    Note.findById(req.params.id, function(err, notes) {
        User.findById(notes.author, function(err) {
            res.render('note', {
                notes: notes

            });
        });
    });
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;