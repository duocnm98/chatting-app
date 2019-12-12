import exSession from 'express-session';
import connectMongo from 'connect-mongo';

let mongoStore = connectMongo(exSession);

//Save session to mongodb
let sessionStore = new mongoStore({
  url:  `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoConnect: true,
  // autoRemove: 'native'
}); 

let config = (app) => {
  app.use(exSession({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000 // one day
    }
  }));
}

module.exports = {
  config: config,
  sessionStore: sessionStore
};
