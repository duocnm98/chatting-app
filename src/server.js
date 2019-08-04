import express from 'express';
import ConnectDB from './config/connectDB';
import ContactModel from './models/contact.model';
require('dotenv').config();

let app = express();


// Connect to MongoDB
ConnectDB();

app.get('/test-database', async (req, res) => {
  try{
    let item = {
      userId: "1986sa1df6asd",
      contactId: "986sa1df6asd986sa1df6asd"
    }
    let contact = await ContactModel.createNew(item);
    res.send(contact);
  }
  catch(err){
    console.log(err);
  }
  res.send("<h1>Hello world</h1>");
});

app.listen(process.env.APP_PORT, () => {
  console.log(`hello friend! I'm runing at : ${process.env.APP_PORT}`);
});
  