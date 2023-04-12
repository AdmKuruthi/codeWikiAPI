const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const articleSchema = mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    content: {
        type: String
    }
});

module.exports = mongoose.model('article', articleSchema);