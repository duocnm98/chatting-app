import mongoose from "mongoose";

const Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  usersAmount: {type: Number, min: 3, max: 177},
  messagesAmount:{type: Number, default: 0},
  userId: String,
  members: [
    {userId: String}
  ],
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null }
});

module.exports = mongoose.model('ChatGroupSchema', ChatGroupSchema);