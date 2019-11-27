import passport from "passport";
import passportGoogle from "passport-google-oauth";
import UserModel from "./../../models/user.model";
import {transErrors, transSuccess} from "./../../../lang/vie";

let GoogleStratery = passportGoogle.OAuth2Strategy;

let ggAppId = process.env.GG_APP_ID;
let ggAppSecret = process.env.GG_APP_SECRET;
let ggCallbackUrl = process.env.GG_CALLBACK_URL;
/**
 * Valid user account type: Google
 */

let initPassportGoogle = () => {
  passport.use(new GoogleStratery({
    clientID: ggAppId,
    clientSecret: ggAppSecret,
    callbackURL: ggCallbackUrl,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done)=> {
    try {
      let user = await UserModel.findByGoogleUid(profile.id); // models/userModel.js
      if (user) {
        return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
      }
      // console.log(profile);
      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: {isActive: true},
        google: {
          uid: profile.id,
          token: accessToken,
          email: profile.emails[0].value
        }
      };

      let newUSer = await UserModel.createNew(newUserItem);
      return done(null, newUSer, req.flash("success", transSuccess.loginSuccess(newUSer.username)));
    } catch (error) {
      // Server Error
      console.log(error);
      return done(null, false, req.flash("errors", transErrors.server_error));
    }
  }));

  /**
   * Save UserID to Session
   */
  passport.serializeUser((user, done) => {
    // only save user._id
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    UserModel.findUserById(id)
      .then(user => {
        return done(null, user);
      })
      .catch(error => {
        return done(error, null);
      });
  });
};

 module.exports = initPassportGoogle;