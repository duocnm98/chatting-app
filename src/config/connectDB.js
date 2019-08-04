import mongoose from 'mongoose';
import bluebird from 'bluebird';
require('dotenv').config();

// Connect to MongoDB
let connectDB = () => {
  mongoose.Promise = bluebird;
  // mongodb://localhost/27017/chatting_app
  let URL = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  return mongoose.connect(URL, {useMongoClient: true});
} 

module.exports = connectDB;
