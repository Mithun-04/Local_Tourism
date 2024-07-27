const mongoose = require('mongoose');

const planner = new mongoose.Schema({
    location: {
        type: String,

    },
    budget: {
        type: Number,
        required: true
    },
    no_of_people: {
        type: Number,
        required: true
    },
    no_of_days: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('trip',planner);