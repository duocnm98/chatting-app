import UserModel from './../models/user.model';

/**
 * Update user info
 * @param {userId} id 
 * @param {data update} item 
 */
let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
}

module.exports = {
  updateUser: updateUser
}