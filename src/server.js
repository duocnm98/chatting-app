import express from 'express';
import ConnectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import webRoute from './routes/web.route';

require('dotenv').config();

//Initiate application
let app = express();

// Connect to MongoDB 
ConnectDB();

//Config view engine
configViewEngine(app);

//Router
app.use('/', webRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(`hello friend! I'm runing at : ${process.env.APP_PORT}`);
});
  