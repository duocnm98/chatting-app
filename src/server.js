import express from 'express';
import ConnectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import webRoute from './routes/web.route';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import configSession from './config/session';

require('dotenv').config();

//Initiate application
let app = express();

// Connect to MongoDB 
ConnectDB();

//Config session 
configSession(app);

//Config view engine
configViewEngine(app);

//Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

//Enable flash
app.use(connectFlash());
//Router
app.use('/', webRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(`hello friend! I'm runing at : ${process.env.APP_PORT}`);
});
  