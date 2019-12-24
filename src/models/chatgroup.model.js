  import mongoose from "mongoose";

const Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  usersAmount: {type: Number, min: 3, max: 177},
  messageAmount:{type: Number, default: 0},
  userId: String,
  members: [
    {userId: String}
  ],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null }
});

ChatGroupSchema.statics = {
  /**
   * get chat group items by UserId and limit
   * @param {string} userId current UserId
   * @param {number} limit 
   */
  getChatGroups(userId, limit ) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}}
    }).sort({"updatedAt": -1}).limit(limit).exec();
  }
};

module.exports = mongoose.model('chat-group', ChatGroupSchema);
