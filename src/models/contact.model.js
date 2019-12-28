import mongoose from "mongoose";
import { user } from '../services/service'

const Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null }
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

  /**
   * Remove contact
   * @param {String} userId 
   * @param {String} contactId 
   */
  removeContact(userId, contactId){
    this.remove({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }, { status: true }] },
        { $and: [{ userId: contactId }, { contactId: userId }, { status: true }] }
      ]
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
    ).sort({"updatedAt" : -1}).limit(limit).exec();
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
  },

  /**
   * 
   * @param {String} userId 
   * @param {String} contactId 
   */
  removeRequestContactSent(userId, contactId) {
    return this.remove({
      $and: [
        { userId: userId },
         { contactId: contactId },
         {"status" : false}
        ]
    }).exec();
  },
    
    
  /**
   * Remove request contact received
   * @param {String} userId 
   * @param {String} contactId 
   */
  removeRequestContactReceived(userId, contactId) {
    return this.remove({
      $and: [
        {"userId": contactId},
        {"contactId": userId},
        {"status" : false}
      ]
    }).exec();
  },

  /**
   * Approve request contact received
   * @param {String: of currentUser} userId 
   * @param {String} contactId 
   */
  approveRequestContactReceived(userId, contactId) {
    return this.update({
      $and: [
        {"userId": contactId},
        {"contactId": userId},
        {"status" : false}
      ]
    },{
      "status" : true,
      "updatedAt": Date.now()
    }).exec();
  },
  
  /**
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
  },
  
  /**
   * get more contact users with limit 
   */
  readMoreContacts(userId , skipNumber , limit){
    return this.find({
      $and : [
        {$or : [
          {"userId" : userId } ,
          {"contactId" : userId}
        ]},
        {"status" : true }
      ]
    }).sort({"updatedAt" : -1}).skip(skipNumber).limit(limit).exec();
  },

  readMoreContactsSent(userId , skipNumber , limit){
    return this.find({
      $and : [
        {"userId" : userId } , 
        {"status" : false} 
      ]
    }).sort({"createdAt" : -1}).skip(skipNumber).limit(limit).exec();
  },

  readMoreContactsReceived(userId , skipNumber , limit){
    return this.find({
      $and : [
        {"contactId" : userId} ,
        {"status" : false }
      ]
    }).sort({"createdAt" : -1}).skip(skipNumber).limit(limit).exec();
  },

  /**
   * update contact (chat personal) update time when has new message
   * @param {string} userId 
   * @param {string} contactId 
   */
  updateWhenHasNewMessage(userId, contactId){
    return this.update({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }] },
        { $and: [{ userId: contactId }, { contactId: userId }] }
      ]
    }, {
      "updatedAt" : Date.now()
    }).exec();
  },

   /**
   * Get contact friend by userId
   * @param {String} userId 
   */
  getFriends(userId){
    return this.find({
      $and : [
         {$or : [
           {"userId" : userId} , 
           {"contactId" : userId}
         ]} , 
         {"status" : true}
      ]}
    ).sort({"updatedAt": -1}).exec();
  },
};

module.exports = mongoose.model("Contact", ContactSchema);
