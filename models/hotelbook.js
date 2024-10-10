const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    bookingname:{
        type : String,
        require : true
    },
    hotelname: {
        type: String, 
        required: true
    },
    no_of_peeple:{
        type: Number,
        required : true
    },
    no_of_days: {
        type: Number,
        required: true
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a Booking model from the schema
                
                     
module.exports = mongoose.model('hotel', bookingSchema); 