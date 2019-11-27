import express from "express";
import { home, auth } from "./../controllers/controller";
import { authValid } from "../validation/validation";
import passport from 'passport';
import initPassportLocal from './../controllers/passportController/local';

//Init all passport 
initPassportLocal();


let router = express.Router();

router.get("/login-register", auth.checkLoggedOut, auth.loginRegister);

router.get('/test-database', auth.checkLoggedOut, home.testDatabase);

router.post('/register', auth.checkLoggedOut, authValid.register, auth.postRegister);

router.get('/verify/:token', auth.checkLoggedOut, auth.verifyAccount);

router.post('/login', auth.checkLoggedOut, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login-register',
  successFlash: true,
  failureFlash: true
}));


router.get("/", auth.checkLoggedIn ,home.index);
router.get('/logout',auth.checkLoggedIn, auth.getLogout);

module.exports = router;