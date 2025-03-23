const mongoose = require('mongoose');

const planner = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
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
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('trip', planner);