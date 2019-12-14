import mongoose from "mongoose";
import { user } from '../services/service'

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
  },

  /**
   * Get contact by userId and Limit
   * @param {String} userId 
   * @param {number} limit 
   */
  getContacts(userId , limit){
    return this.find({
      $and : [
         {$or : [
           {"userId" : userId} , 
           {"contactId" : userId}
         ]} , 
         {"status" : true}
      ]}
    ).sort({"createdAt" : -1}).limit(limit).exec();
  },
  getContactsSent(userId , limit){
    return this.find({
      $and : [
         {"userId" : userId} , 
         {"status" : false}
      ]}
    ).sort({"createdAt" : -1}).limit(limit).exec();
  },
  getContactsReceived(userId ,limit){
    return this.find({
      $and : [
         {"contactId" : userId} , 
         {"status" : false}
      ]}
    ).sort({"createdAt" : -1}).limit(limit).exec();
  },/**
   * Count all contacts
   * @param {string} userId 
   */
  countAllContacts(userId){
    return this.count({
      $and : [
        { $or : [
          {"userId" : userId} ,
          {"contactId" : userId}
        ]},
        {"status" : true}
      ]
    }).exec();
  },/**
   * count all contact sent
   * @param {string} userId 
   */
  countAllContactsSent(userId){
    return this.count({
      $and : [
        {"userId" : userId} , 
        {"status" : false}
      ]
    }).exec();
  },/**
   * count all contact received
   * @param {string} userId 
   */
  countAllContactsReceived(userId){
    return this.count({
      $and : [
        {"contactId" : userId} , 
        {"status" : false}
      ]
    }).exec();
  }
};

module.exports = mongoose.model("Contact", ContactSchema);
