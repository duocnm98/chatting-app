import passport from 'passport';
import passportLocal from 'passport-local';
import UserModel from './../../models/user.model';
import { transErrors, transSuccess } from './../../../lang/vie';

let LocalStrategy = passportLocal.Strategy;

// Valid user account type: local
let initPassportLocal = () => {

  //Check login local account is legically
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      let user = await UserModel.findByEmail(email);
      //Check email exist ?
      if (!user) {
        return done(null, false, req.flash('errors', transErrors.login_failed));
      }

      //Check account is active ?
      if(!user.local.isActive){
        return done(null, false, req.flash('errors', transErrors.account_not_actived));
      }

      //Check password ?
      let checkPassword = await user.comparePassword(password);
      if(!checkPassword) {
        return done(null, false, req.flash('errors', transErrors.login_failed));
      }

      return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
    } catch (error) {
      console.log(error);
      return done(null, false, req.flash("errors, "))
    }
  }));

  //Save user id to session storage
  passport.serializeUser((user, done) => {
    //only save user._id
    done(null, user._id);
  });

  //This is called by passport.session()
  passport.deserializeUser((id, done)=>{
    UserModel.findUserById(id)
      .then(user => {
        return done(null, user);
      })
      .catch(error => {
        return done(error, null);
      });
  });

};

module.exports = initPassportLocal;