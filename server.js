const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const trip = require('./models/trip.js')

const app = express();
app.use(express.json());


const connect = async () =>{
    try{
     await mongoose.connect('mongodb+srv://mithunkarthik123:9FyJMeGKz8gxgEpJ@cluster0.njvhijq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
     console.log('Connected to cloud');
     app.listen(3000,() =>{
        console.log('server is listening to the port 3000');
     })

}
catch(e){
    console.error(e);
}
}

connect();
