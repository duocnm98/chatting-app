import express from "express";
import { home, auth, user } from "./../controllers/controller";
import { authValid, userValid } from "../validation/validation";
import passport from 'passport';
import initPassportLocal from './../controllers/passportController/local';
import initPassportFacebook from './../controllers/passportController/facebook';
import initPassportGoogle from './../controllers/passportController/google';

//Init all passport 
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

router.get("/login-register", auth.checkLoggedOut, auth.loginRegister);

// router.get('/test-database', auth.checkLoggedOut, home.testDatabase);

router.post('/register', auth.checkLoggedOut, authValid.register, auth.postRegister);

router.get('/verify/:token', auth.checkLoggedOut, auth.verifyAccount);

router.post('/login', auth.checkLoggedOut, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login-register',
  successFlash: true,
  failureFlash: true
}));

//login using facebook
router.get('/auth/facebook',auth.checkLoggedOut, passport.authenticate('facebook', {scope: ['email']}));
router.get('/auth/facebook/callback',auth.checkLoggedOut, passport.authenticate('facebook',{
  successRedirect: '/',
  failureRedirect: '/login-register'
}));

//login using google
router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google", {scope: ["email"]}));
router.get("/auth/google/callback", auth.checkLoggedOut, passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/login-register"
}));


router.get("/", auth.checkLoggedIn ,home.index);
router.get('/logout',auth.checkLoggedIn, auth.getLogout);

//
router.put("/user/update-avatar", auth.checkLoggedIn, user.updateAvatar);
router.put("/user/update-info", auth.checkLoggedIn, userValid.updateInfo, user.updateInfo);

module.exports = router;