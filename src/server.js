import express from 'express';
import ConnectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import webRoute from './routes/web.route';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import session from './config/session';
import passport from 'passport';
import http from 'http';
import socketio from 'socket.io';
import initSocket from './sockets/socket';

import cookieParser from 'cookie-parser';
import configSocketIo from './config/socketio';
import events from "events";
import * as configApp from './config/app';


require('dotenv').config();
//Initiate application
let app = express();

//Set max connection event listener
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listener;

//Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

// Connect to MongoDB 
ConnectDB();

//Config session 
session.config(app);

//Config view engine
configViewEngine(app);

//Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

//Enable flash
app.use(connectFlash());

//Use cookie parser
app.use(cookieParser());

//Config passportJS
app.use(passport.initialize());
app.use(passport.session());

//Router
app.use('/', webRoute);

// config socket IO
configSocketIo(io, cookieParser, session.sessionStore);


//Init all sockets
initSocket(io);

server.listen(process.env.APP_PORT, () => {
  console.log(`hello friend! I'm runing at : ${process.env.APP_PORT}`);
});


// import pem from 'pem';
// import https from 'https';

// require('dotenv').config();

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }

//   //Initiate application
//   let app = express();

//   // Connect to MongoDB 
//   ConnectDB();

//   //Config session 
//   configSession(app);

//   //Config view engine
//   configViewEngine(app);

//   //Enable post data for request
//   app.use(bodyParser.urlencoded({extended: true}));

//   //Enable flash
//   app.use(connectFlash());

//   //Config passportJS
//   app.use(passport.initialize());
//   app.use(passport.session());

//   //Router
//   app.use('/', webRoute);

//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, () => {
//     console.log(`hello friend! I'm runing at : ${process.env.APP_PORT}`);
//   });
// });
