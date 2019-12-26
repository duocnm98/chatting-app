import express from "express";
import { home, auth, user, contact, notification, message } from "./../controllers/controller";
import { authValid, userValid, contactValid, messageValid } from "../validation/validation";
import passport from "passport";
import initPassportLocal from "./../controllers/passportController/local";
import initPassportFacebook from "./../controllers/passportController/facebook";
import initPassportGoogle from "./../controllers/passportController/google";

//Init all passport 
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

router.get("/login-register", auth.checkLoggedOut, auth.loginRegister);

// router.get("/test-database", auth.checkLoggedOut, home.testDatabase);

router.post("/register", auth.checkLoggedOut, authValid.register, auth.postRegister);

router.get("/verify/:token", auth.checkLoggedOut, auth.verifyAccount);

router.post("/login", auth.checkLoggedOut, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login-register",
  successFlash: true,
  failureFlash: true
}));

//login using facebook
router.get("/auth/facebook", auth.checkLoggedOut, passport.authenticate("facebook", { scope: ["email"] }));
router.get("/auth/facebook/callback", auth.checkLoggedOut, passport.authenticate("facebook", {
  successRedirect: "/",
  failureRedirect: "/login-register"
}));

//login using google
router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google", { scope: ["email"] }));
router.get("/auth/google/callback", auth.checkLoggedOut, passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/login-register"
}));


router.get("/", auth.checkLoggedIn, home.index);
router.get("/logout", auth.checkLoggedIn, auth.getLogout);

//Update User Info - Avatar - Password
router.put("/user/update-avatar", auth.checkLoggedIn, user.updateAvatar);
router.put("/user/update-info", auth.checkLoggedIn, userValid.updateInfo, user.updateInfo);
router.put("/user/update-password", auth.checkLoggedIn, userValid.updatePassword, user.updatePassword);

//
router.get("/contact/find-users/:keyword", auth.checkLoggedIn, contactValid.findUsersContact, contact.findUsersContact);
router.post("/contact/add-new", auth.checkLoggedIn, contact.addNew);
router.delete("/contact/remove-request-contact-sent", auth.checkLoggedIn, contact.removeRequestContactSent);
router.delete("/contact/remove-request-contact-received", auth.checkLoggedIn, contact.removeRequestContactReceived);
router.delete("/contact/remove-contact", auth.checkLoggedIn, contact.removeContact);
router.put("/contact/approve-request-contact-received", auth.checkLoggedIn, contact.approveRequestContactReceived);

router.get("/contacts/read-more-contacts" , auth.checkLoggedIn , contact.readMoreContacts);
router.get("/contacts/read-more-contacts-sent" , auth.checkLoggedIn , contact.readMoreContactsSent);
router.get("/contacts/read-more-contacts-received" , auth.checkLoggedIn , contact.readMoreContactsReceived);

router.get("/notification/read-more", auth.checkLoggedIn, notification.readMore);
router.put("/notification/mark-all-as-read", auth.checkLoggedIn, notification.markAllAsRead);

router.post("/message/add-new-text-emoji", auth.checkLoggedIn, messageValid.checkMessageLength, message.addNewTextEmoji);
router.post("/message/add-new-image", auth.checkLoggedIn, message.addNewImage);
router.post("/message/add-new-attachment", auth.checkLoggedIn, message.addNewAttachment);

module.exports = router;