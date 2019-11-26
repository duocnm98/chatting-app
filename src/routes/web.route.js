import express from "express";
import { home, auth } from "./../controllers/controller";
import { authValid } from "../validation/validation";
import passport from 'passport';
import initPassportLocal from './../controllers/passportController/local';

//Init all passport 
initPassportLocal();


let router = express.Router();

router.get("/", home.index);

router.get("/login-register", auth.loginRegister);

router.get('/test-database', home.testDatabase);

router.post('/register', authValid.register, auth.postRegister);

router.get('/verify/:token', auth.verifyAccount);

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login-register',
  successFlash: true,
  failureFlash: true
}));

module.exports = router;