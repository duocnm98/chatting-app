import ContactModel from "./../models/contact.model";
import UserModel from "./../models/user.model";
import ChatGroupModel from "./../models/chatgroup.model";
import MessageModel from "./../models/message.model";
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
          conversation.messages = getMessages;
        }
        else {
          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGE);
          conversation.messages = getMessages;
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
}

module.exports = {
  getAllConversationItems: getAllConversationItems
}