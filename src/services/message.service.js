import ContactModel from "./../models/contact.model";
import UserModel from "./../models/user.model";
import ChatGroupModel from "./../models/chatgroup.model";
import MessageModel from "./../models/message.model";
import { transErrors } from "./../../lang/vie";
import { app } from "./../config/app";
import fsExtra from "fs-extra";
import _ from "lodash";


const LIMIT_CONVERSATION = 10;
const LIMIT_MESSAGE = 30;

/**
 * get all conversation
 * @param {string} currentUserId 
 */
let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
        let contacts = await ContactModel.getContacts(currentUserId , LIMIT_CONVERSATION);
      let userConversationsPromise = contacts.map( async ( contact ) => {
        if(contact.contactId == currentUserId){
          let getUserContact = await UserModel.getNormalUserDataById(contact.userId)
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }else{
          let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });

      let userConversations = await Promise.all(userConversationsPromise);
      let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATION);
      let allConversations = userConversations.concat(groupConversations);
      
      //sort conversations by updatedAt 
      allConversations = _.sortBy(allConversations, (item) => {
          return -item.updatedAt;
      });
      
      //get messages to apply in screen chat
      let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
        conversation = conversation.toObject();
        if (conversation.members) {
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGE);
          conversation.messages = _.reverse(getMessages);
        }
        else {
          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGE);
          conversation.messages = _.reverse(getMessages);
        }
        return conversation;
      });
      
      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      // sort conversation with message by updateAt desending
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return -item.updatedAt;
      });
      
      // console.log(allConversationWithMessages);

      resolve({
        allConversationWithMessages: allConversationWithMessages
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 
 * @param {Object} sender current user
 * @param {string} receiverId id of user||group
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) {
          return reject(transErrors.conversation_not_found);
        }

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        }

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now()
        }
        
        //create new message to database
        let newMesage = await MessageModel.model.createNew(newMessageItem);
        //update group chat time 
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
        resolve(newMesage);
      }
      else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if (!getUserReceiver) {
          return reject(transErrors.conversation_not_found);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        }
        
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now()
        }

        //create new message to database
        let newMesage = await MessageModel.model.createNew(newMessageItem);
        //update contact chat time 
        await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
        resolve(newMesage);
      }
    } catch (error) {
      reject(error);
    }
  });
} 

/**
 * Add new image message 
 * @param {Object} sender current user
 * @param {string} receiverId id of user||group
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) {
          return reject(transErrors.conversation_not_found);
        }

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        }

        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;
        
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file :{
            data: imageBuffer,
            contentType: imageContentType,
            fileName: imageName
          },
          createdAt: Date.now()
        }
        
        //create new message to database
        let newMesage = await MessageModel.model.createNew(newMessageItem);
        //update group chat time 
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
        resolve(newMesage);
      }
      else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if (!getUserReceiver) {
          return reject(transErrors.conversation_not_found);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        }
        
        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file :{
            data: imageBuffer,
            contentType: imageContentType,
            fileName: imageName
          },
          createdAt: Date.now()
        }

        //create new message to database
        let newMesage = await MessageModel.model.createNew(newMessageItem);
        //update contact chat time 
        await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
        resolve(newMesage);
      }
    } catch (error) {
      reject(error);
    }
  });
} 

module.exports = {
  addNewImage: addNewImage,
  addNewTextEmoji: addNewTextEmoji,
  getAllConversationItems: getAllConversationItems
}