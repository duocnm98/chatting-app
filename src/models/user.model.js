import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: 'male' },
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
  
  findByEmail(email){
    return this.findOne({"local.email": email}).exec();
  }
}

module.exports = mongoose.model('user', UserSchema);
