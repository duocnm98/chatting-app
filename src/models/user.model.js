import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: Number, default: null },
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
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null }
});

UserSchema.statics = {
  createNew(item) {
    // "create" is default function of mongoose
    return this.create(item);
  },

  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },

  findUserById(id) {
    return this.findById(id).exec();
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

  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token },
      { "local.isActive": true, "local.verifyToken": null }
    ).exec();
  }
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password); // return a promise has result is true of false
  }
};

module.exports = mongoose.model("user", UserSchema);
