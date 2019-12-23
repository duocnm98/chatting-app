import UserModel from "./../models/user.model";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import { transErrors, transSuccess, transMailer } from "./../../lang/vie";
import sendMail from "./../config/mailer";

let register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    //Check is email exist ??
    let userByEmail = await UserModel.findByEmail(email);
    if (userByEmail) {
      if (userByEmail.deletedAt != null) {
        return reject(transErrors.account_removed);
      }
      if (!userByEmail.local.isActive) {
        return reject(transErrors.account_not_actived);
      }
      return reject(transErrors.account_existed);
    }

    //Decode password
    let saltRound = 7;
    let hashedPassword = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(saltRound)
    );

    let userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email: email,
        password: hashedPassword,
        verifyToken: uuidv4()
      }
    };

    let user = await UserModel.createNew(userItem);

    //send email to several register account
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;

    sendMail(email, transMailer.subject, transMailer.template(linkVerify))
      .then(success => {
        resolve(transSuccess.userCreated(user.local.email));
      })
      .catch(async error => {
        //remove user
        await UserModel.removeById(user._id);
        console.log(error);
        reject(transMailer.email_send_failed);
      });
  });
};

let verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    let userByToken = await UserModel.findByToken(token);
    if(!userByToken) {
      return reject(transErrors.token_undefinded);
    }
    await UserModel.verify(token);
    resolve(transSuccess.account_actived);
  });
};

module.exports = {
  register: register,
  verifyAccount: verifyAccount
};
