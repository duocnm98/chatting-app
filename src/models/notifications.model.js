import mongoose from "mongoose";

const Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  sender: {
    id: String,
    username: String,
    avatar: String
  },
  receiver: {
    id: String,
    username: String,
    avatar: String
  },
  type: String,
  context: String,
  isRead: {type: Boolean, default: false},
  createAt: {type: Number, default: Date.now}
});

module.exports = mongoose.model('NotificationSchema', NotificationSchema);