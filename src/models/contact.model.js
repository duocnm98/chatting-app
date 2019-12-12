import mongoose from "mongoose";

const Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null }
});

ContactSchema.statics = {
  createNew(item) {
    // "create" is default function of mongoose
    return this.create(item);
  },
  findAllByUser(userId) {
    return this.find({
      $or: [{ userId: userId }, { contactId: userId }] 
    }).exec();
  },
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }] },
        { $and: [{ userId: contactId }, { contactId: userId }] }
      ]
    }).exec();
  },
  removeRequestContact(userId, contactId) {
    return this.remove({
      $and: [{ userId: userId }, { contactId: contactId }]
    }).exec();
  }
};

module.exports = mongoose.model("Contact", ContactSchema);
