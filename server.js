const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const trip = require('./models/trip.js');
const rent = require('./models/rentals.js');
const { log } = require('console');
const User = require('./models/user.js');

const app = express();
const port = 3000;
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
const SECRET_KEY = 'your_secret_key';

app.use(express.static(path.join(__dirname, 'public')));

const connect = async () => {
    try {
        await mongoose.connect('mongodb+srv://mithunkarthik123:9FyJMeGKz8gxgEpJ@cluster0.njvhijq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected to cloud');
        app.listen(port, () => {
            console.log('server is listening to the port ' + port);
        })
    }
    catch (e) {
        console.error(e);
    }
}

connect();
    const authenticateJWT = (req, res, next) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (token) {
            jwt.verify(token, SECRET_KEY, (err, user) => {
                if (err) {
                    return res.sendStatus(403); // Invalid token
                }

                req.user = user; // Attach user data to request
                next();
            });
        } else {
            res.sendStatus(401); // No token provided
        }
    };

app.get('/trip',(req, res) => {
    res.sendFile(path.join(__dirname, 'Trip_planner.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front_page.html'));
});
app.get('/rentals', (req, res) => {
    res.sendFile(path.join(__dirname, 'mod5.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 't4.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});
app.get('/hotels', (req, res) => {
    res.sendFile(path.join(__dirname, 'mod4.html'));
});

app.post('/plan',authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const {loaction , budget , no_of_people , no_of_days} = req.body
        
        const data = await trip.create({
            user_id : userId,
            loaction,
            budget,
            no_of_people,
            no_of_days
        })
        
        console.log(data);
        res.status(200).json({ message: 'Data saved successfully', data: data });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'error in saving the data', data: data });
    }


})



app.post('/rentals', async (req, res) => {
    try {
        const data = await rent.create(req.body);
        console.log(data);

    }
    catch (e) {
        console.log(e.message)
    }
})

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const exsistinguser = await User.findOne({ username });
        if (exsistinguser) {
            return res.status(400).json({ error: "The User Name is Taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const data = await User.create({ username, email, password: hashedPassword });
        console.log("User Created:", data);

        res.status(200).json({ message: 'Data saved successfully', data: data });
    } catch (e) {
        console.error(e);  // Log the exact error
        res.status(500).json({ error: e.message });
    }
});

app.post('/login', async (req, res) => {

    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                error: "Please register before Logging in"
            });
        }

        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(400).json({
                error: "Invalid Password"
            })
        }
        const token = jwt.sign({ id: user._id , username : user.username}, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (e) {
        return res.status(500).json({
            error: e.message
        })
    }
})
