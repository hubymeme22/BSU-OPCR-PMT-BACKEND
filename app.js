const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();

require('dotenv/config');
const serverIp = process.env.IP;
const serverPort = process.env.PORT;
const mongodbURI = process.env.MONGODB_URI;

// routes assigning
app.use(express.json());
app.use(cookieParser());

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
