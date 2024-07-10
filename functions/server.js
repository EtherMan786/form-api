
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

app.get('/', (req, res) => {
    res.send("hello");
});

app.post('/send-email', (req, res) => {
    const { name , subject , email, message } = req.body;

    const mailOptions = {
        from: 'utest8095@gmail.com',
        to: email,
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    console.log("0", transporter)

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

