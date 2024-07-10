const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const router = express.Router();

let records = [];

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Get all students
router.get('/', (req, res) => {
  res.send('App is running..');
});

// Show demo records
router.get('/demo', (req, res) => {
  res.json([
    {
      id: '001',
      name: 'Smith',
      email: 'smith@gmail.com',
    },
    {
      id: '002',
      name: 'Sam',
      email: 'sam@gmail.com',
    },
    {
      id: '003',
      name: 'Lily',
      email: 'lily@gmail.com',
    },
  ]);
});

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

// Send email endpoint
router.post('/send-email', (req, res) => {
  const { name, subject, email, message } = req.body;

  const mailOptions = {
    from: 'utest8095@gmail.com',
    to: email,
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).send('Oops! Something went wrong.');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Your message has been sent successfully!');
    }
  });
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});