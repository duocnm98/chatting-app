import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "./../../models/user.model";
import {transErrors, transSuccess} from "./../../../lang/vie";

let FacebookStratery = passportFacebook.Strategy;

let fbAppId = process.env.FB_APP_ID;
let fbAppSecret = process.env.FB_APP_SECRET;
let fbCallbackUrl = process.env.FB_CALLBACK_URL;
/**
 * Valid user account type: Facebook
 */

let initPassportFacebook = () => {
  passport.use(new FacebookStratery({
    clientID: fbAppId,
    clientSecret: fbAppSecret,
    callbackURL: fbCallbackUrl,
    passReqToCallback: true,
    profileFields: ["email", "gender", "displayName"]
  }, async (req, accessToken, refreshToken, profile, done)=> {
    try {
      let user = await UserModel.findByFacebookUid(profile.id);
      if (user) {
        return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
      }

      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: {isActive: true},
        facebook: {
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

 module.exports = initPassportFacebook;