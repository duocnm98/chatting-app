import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { user } from "../services/service";
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null }
});

UserSchema.statics = {
  createNew(item) {
    // "create" is default function of mongoose
    return this.create(item);
  },

  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },

  findUserByIdToUpdatePassword(id) {
    return this.findById(id).exec();
  }, 

  findUserByIdForSessionToUse(id) {
    return this.findById(id, {"local.password": 0}).exec();
  },

  findByFacebookUid(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },

  findByGoogleUid(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },

  findByToken(token) {
    return this.findOne({ "local.verifyToken": token }).exec();
  },

  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec(); //return old item after update
  },

  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, {"local.password": hashedPassword}).exec();
  },

  findAllForAddContact(deprecatedUserIds, keyword) {
    return this.find({
      $and: [
        {"_id": {$nin: deprecatedUserIds}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex": new RegExp(keyword, "i") }},
          {"local.email": {"$regex":new RegExp(keyword, "i") }},
          {"facebook.email": {"$regex":new RegExp(keyword, "i") }},
          {"google.email": {"$regex":new RegExp(keyword, "i") }}
        ]}
      ]
    }, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
  },
  
  getNormalUserDataById(id){
    return this.findById(id , { username : 1 , avatar : 1 , address : 1 , _id : 1}).exec();
  },

  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token },
      { "local.isActive": true, "local.verifyToken": null }
    ).exec();
  },
  
  /**
   * find all user to add group chat
   * @param {string} friendsId 
   * @param {string} keyword 
   */
  findAllToAddGroupChat(friendsId, keyword) {
    return this.find({
      $and: [
        {"_id": {$in: friendsId}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex": new RegExp(keyword, "i") }},
          {"local.email": {"$regex":new RegExp(keyword, "i") }},
          {"facebook.email": {"$regex":new RegExp(keyword, "i") }},
          {"google.email": {"$regex":new RegExp(keyword, "i") }}
        ]}
      ]
    }, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
  }
  
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password); // return a promise has result is true of false
  }
};

module.exports = mongoose.model("User", UserSchema);
