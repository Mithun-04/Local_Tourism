const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const trip = require('./models/trip.js');
const { log } = require('console');

const app = express();
const port = 3000;
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

const connect = async () => {
    try {
        await mongoose.connect('mongodb+srv://mithunkarthik123:9FyJMeGKz8gxgEpJ@cluster0.njvhijq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected to cloud');
        app.listen(port, () => {
            console.log('server is listening to the port '+ port);
        })
    }
    catch (e) {
        console.error(e);
    }
}

connect();

app.get('/trip', (req, res) => {
    res.sendFile(path.join(__dirname, 'Trip_planner.html'));
});

app.post('/plan', async (req, res) => {
    try{
        
        const data = await trip.create(req.body)
        console.log(data);
        res.status(200).json({ message: 'Data saved successfully', data: data });
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: 'error in saving the data', data: data });
    }
    

})


