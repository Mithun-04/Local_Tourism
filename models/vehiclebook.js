const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    model: {
        type: String, 
        required: true
    },
    number:{
        type: String,
        required : true
    },
    rent_per_day: {
        type: Number,
        required: true
    },
    days: {
        type: Number,
        required: true,
        min: 1 // At least one day must be booked
    },
    total_price: {
        type: Number,
        required: true
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a Booking model from the schema
                
                     
module.exports = mongoose.model('Booking', bookingSchema); 