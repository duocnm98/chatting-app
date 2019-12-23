import ContactModel from "./../models/contact.model";
import UserModel from "./../models/user.model";
import ChatGroupModel from "./../models/chatgroup.model";
import _ from "lodash";

const LIMIT_CONVERSATION = 10;

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

      resolve({
        userConversations: userConversations,
        groupConversations: groupConversations,
        allConversations: allConversations
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getAllConversationItems: getAllConversationItems
}