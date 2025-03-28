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
const booking = require('./models/vehiclebook.js');
const hotel = require('./models/hotelbook.js');
const Ind = require('./index.js');
// const Addr = require('./data/address.js');

const nodemailer = require('nodemailer');
// const Addr = require('./data/address.js');

// Add Feedback schema here
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
  });
  
  const Feedback = mongoose.model('Feedback', feedbackSchema);
  

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
app.get('/petrol',(req, res) => {
    res.sendFile(path.join(__dirname, 'petrol1.html'));
});
app.get('/3day',(req, res) => {
    res.sendFile(path.join(__dirname, '3days.html'));
});
app.get('/2day',(req, res) => {
    res.sendFile(path.join(__dirname, '2days.html'));
});
app.get('/contact',(req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});
app.get('/food',(req, res) => {
    res.sendFile(path.join(__dirname, 'foodPage.html'));
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
app.get('/booknow', (req, res) => {
    res.sendFile(path.join(__dirname, 'booknow.html'));
});
app.get('/spots', (req, res) => {
    res.sendFile(path.join(__dirname, 'spots.html'));
});


app.post('/plan', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id; // From JWT middleware
        const { location, budget, no_of_people, no_of_days, start_date, end_date } = req.body;

        // Validate required fields
        if (!location || !budget || !no_of_people || !no_of_days || !start_date || !end_date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const data = await trip.create({
            user_id: userId,
            location, // Fixed typo from 'loaction'
            budget,
            no_of_people,
            no_of_days,
            start_date: new Date(start_date), // Convert string to Date object
            end_date: new Date(end_date)      // Convert string to Date object
        });

        console.log(data);
        res.status(200).json({ message: 'Data saved successfully', data: data });
    } catch (e) {
        console.log(e);
        // Use 'error' instead of 'data' in the catch block
        res.status(500).json({ message: 'Error in saving the data', error: e.message });
    }
});


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

app.get('/vehicles', async (req, res) => {
    try {
        const vehicles = await rent.find();  // This assumes 'rent' is a Mongoose model
        res.json(vehicles);                  // Send the result as JSON response
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/vehiclebook', authenticateJWT, async (req, res) => {
    try {
        const { model, number, rent_per_day } = req.body;
        const userId = req.user.id;
        const days = req.body.days || 1;
        const total_price = rent_per_day * days;

        const newBooking = {
            user_id: userId,
            model: model,
            number: number,
            rent_per_day: rent_per_day,
            days: days,
            total_price: total_price,
            bookedAt: new Date()
        };

       const data = await booking.create(newBooking);
       console.log(data);
       

        res.json({
            message: 'Booking successful!',
            model: model,
            total_price: total_price
        });
    } catch (error) {
        console.error('Error while processing the booking:', error);
        res.status(500).json({ error: 'There was a problem with the booking. Please try again.' });
    }
});

app.post('/hotelbook', authenticateJWT, async (req, res) => {
    try {
        const { bookingname, hotelname, no_of_peeple, no_of_days } = req.body;

        // Create a new booking
        const newBooking = {
            user_id: req.user.id,  
            bookingname,
            hotelname,
            no_of_peeple,
            no_of_days,
            bookedAt: new Date()
        }   ;

        const data = await hotel.create(newBooking);
        console.log(data);

        

        res.status(200).json(data);
    } catch (error) {
        console.error('Error booking the hotel:', error);
        res.status(500).json({ message: 'Error booking the hotel' });
    }
});

app.post('/submit-feedback', async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
      // Save to database
      const newFeedback = new Feedback({
        name,
        email,
        message
      });
      
      await newFeedback.save();
      console.log('Feedback saved to database:', newFeedback);
      
      // Configure email transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'shananthikasenthilkumar@gmail.com', // Replace with your email
          pass: 'lerk fjni gwpn xegk'     // Replace with your app password
        }
      });
      
      // Email content
      const mailOptions = {
        from: email,
        to: 'shananthikasenthilkumar@gmail.com', // Replace with admin email
        subject: 'New Feedback from Local Tourism Website',
        text: `
          Name: ${name}
          Email: ${email}
          Message: ${message}
        `,
        html: `
          <h3>New Feedback Submission!!!</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
        replyTo: email
      };
      
      try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent: ' + info.response);
          res.status(200).json({ success: true, message: 'Thank you for your feedback!' });
        } catch (error) {
          console.error('Email error:', error);
          res.status(500).json({ success: false, message: 'Your feedback was saved but we had trouble sending the email notification.' });
        }
        
      } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
      }
    });
  


