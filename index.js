const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads')); // For serving uploaded files

// Connect to MongoDB
const mongoURI = 'mongodb+srv://mithunkarthik123:9FyJMeGKz8gxgEpJ@cluster0.njvhijq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your connection string
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a schema
const bookingSchema = new mongoose.Schema({
  numPersons: { type: Number, required: true },
  numDays: { type: Number, required: true },
  idProof: { type: String, required: true }, // Store the file path
});

const Booking = mongoose.model('Booking', bookingSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});

const upload = multer({ storage });

// POST route for handling form submissions
app.post('/book', upload.single('idProof'), (req, res) => {
  const booking = new Booking({
    numPersons: req.body.numPersons,
    numDays: req.body.numDays,
    idProof: req.file.path, // Save the file path
  });
    
  booking.save()
    .then(() => res.status(200).send('Booking saved successfully!'))
    .catch(err => res.status(500).send('Error saving booking: ' + err));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
