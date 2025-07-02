const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const cors = require('cors'); 
const nodemailer = require('nodemailer');
const pool = require('./config/db'); 
const appRoutes = require('./routes/appRoutes');
const fs = require('fs');
const moment = require('moment'); 
const multer = require('multer');    
const crypto = require('crypto');


const app = express();
const port = 3000;

const allowedOrigins = ['http://127.0.0.1:5500', 'https://charge24.africa', 'http://localhost:5500', 'https://dash.charge24.africa', 'https://rent.charge24.africa'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true  
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));  

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/app', appRoutes);

app.use((req, res) => {
    res.redirect('/page-not-found.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});