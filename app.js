const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();

require('dotenv/config');
const serverIp = process.env.IP;
const serverPort = process.env.PORT;
const mongodbURI = process.env.MONGODB_URI;

// for parsing data
app.use(express.json());
app.use(cookieParser());

// routes assigning
const logger = require('./middlewares/logger');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const APIRoute = require('./api/api');

app.use(logger());
app.use('/api', APIRoute);
app.use(loginRoute);
app.use(registerRoute);

console.log('[*] Connecting to database');
mongoose.set('strictQuery', true);
mongoose.connect(mongodbURI)
    .then(() => {
        console.log('[+] Database Connected!');
        console.log('[*] Starting server...');
        app.listen(serverPort, serverIp, () => {
            console.log(`[+] Server started at: http://${serverIp}:${serverPort}/`);
        });
    })

    .catch(err => {
        console.log('[-] Error occured on connecting to the database');
        console.log(err);
    });
