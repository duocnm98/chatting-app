import mongoose from 'mongoose';

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
  }
}

module.exports = mongoose.model('ContactSchema', ContactSchema);
