const mongoose = require('mongoose');


let noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});


let note = module.exports = mongoose.model('Note', noteSchema);