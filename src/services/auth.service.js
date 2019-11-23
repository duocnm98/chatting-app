import UserModel from './../models/user.model';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';
import {transErrors, transSuccess} from './../../lang/vie';


module.exports.register =  (email, gender, password) => {
  return new Promise(async (resolve, reject) => {
     //Check is email exist ??
    let userByEmail = await UserModel.findByEmail(email);
    if(userByEmail){
      if(userByEmail.deleteAt != null){
        return reject(transErrors.account_removed);
      }
      if(!userByEmail.isActive){
        return reject(transErrors.account_not_actived); 
      }
      return reject(transErrors.account_existed);
    }

    //Decode password
    let saltRound = 7;
    let hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRound));

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
    resolve(transSuccess.userCreate(user.local.email));
  });
}