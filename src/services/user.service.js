import UserModel from './../models/user.model';
import {transErrors} from './../../lang/vie';
import bcrypt from 'bcrypt';

/**
 * Update user info
 * @param {userId} id 
 * @param {data update} item 
 */
let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
}

/**
 * Update password
 * @param {userId} id 
 * @param {data update} item 
 */
let updatePassword = (id, item) => {
  return new Promise(async (resolve, reject) => {
    let currentUser = await UserModel.findUserByIdToUpdatePassword(id);
    if(!currentUser) {
      return reject(transErrors.account_undefinded);
    }
    
    let checkCurrentPassword = await currentUser.comparePassword(item.currentPassword);
    if(!checkCurrentPassword) {
      return reject(transErrors.password_match);
    }
    
    await UserModel.updatePassword(id, bcrypt.hashSync(item.newPassword, bcrypt.genSaltSync(7)));

    resolve(true);
  });
}

module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword
}