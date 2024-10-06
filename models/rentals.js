const mongoose = require('mongoose');

const planner = new mongoose.Schema({
    model: {
        type: String,  
        required: true                                                     
    },
    number: {
        type: String,
        required: true
    },
    rent_per_day: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('rent',planner);