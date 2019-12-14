import UserModel from './../models/user.model';
import ContactModel from './../models/contact.model';
import NotificationModel from '../models/notification.model';
import _ from 'lodash';

const LIMIT_NUMBER = 5 ; 

let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    //filter don't display user
    let deprecatedUserIds = [currentUserId];
    let contactByUser = await ContactModel.findAllByUser(currentUserId);
    contactByUser.forEach(contact => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });
  
    deprecatedUserIds = _.uniqBy(deprecatedUserIds); 
    //console.log(deprecatedUserIds); 
    let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
    resolve(users);
  });
};


let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExists = await ContactModel.checkExists(currentUserId, contactId);
    if(contactExists) {
      return reject(false);
    }

    //create contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };
    let newContact = await ContactModel.createNew(newContactItem);

    //create notification 
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.types.ADD_CONTACT
    }

    await NotificationModel.model.createNew(notificationItem);
    //create notification
    resolve(newContact);
  });
};

let removeRequestContactSent = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactSent(currentUserId, contactId);
    if(removeReq.result.n === 0) {
      return reject(false);
    }
    //remove notification
    await NotificationModel.model.removeRequestContactSentNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
    resolve(true);

  });
};

let getContacts = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contacts = await ContactModel.getContacts(currenUserId , LIMIT_NUMBER);
      let users = contacts.map( async ( contact ) => {
        if(contact.contactId == currenUserId){
          return await UserModel.getNormalUserDataById(contact.userId)
        }else{
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      })
      resolve(await Promise.all(users))
    } catch (error) {
      reject(error)
    }
  })
}

let getContactsSent = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contacts = await ContactModel.getContactsSent(currenUserId , LIMIT_NUMBER);
      let users = contacts.map( async ( contact ) => {
        return await UserModel.getNormalUserDataById(contact.contactId) ;

      })
      resolve(await Promise.all(users))
    } catch (error) {
      reject(error)
    }
  })
}

let getContactsReceived = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contacts = await ContactModel.getContactsReceived(currenUserId , LIMIT_NUMBER);
      let users = contacts.map( async ( contact ) => {
        return await UserModel.getNormalUserDataById(contact.userId) ;
      })
      resolve(await Promise.all(users))
    } catch (error) {
      reject(error)
    }
  })
}


let countAllContacts = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contacts = await ContactModel.countAllContacts(currenUserId);
      resolve(contacts);
    } catch (error) {
      reject(error)
    }
  })
}

let countAllContactsSent = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contactsSent = await ContactModel.countAllContactsSent(currenUserId );
     resolve(contactsSent);
    } catch (error) {
      reject(error)
    }
  })
}


let countAllContactsReceived = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contactsReceived = await ContactModel.countAllContactsReceived(currenUserId);
     resolve(contactsReceived);
    } catch (error) {
      reject(error)
    }
  })
}

let readMoreContacts = (currentUserId , skipNumber) => {
  return new Promise( async (resolve , reject) => {
    try {
      let newContacts = await ContactModel.readMoreContacts(currentUserId , skipNumber , LIMIT_NUMBER);
      let getContactUsers = newContacts.map(async (contact) => {
        if(contact.contactId == currentUserId){
          return await UserModel.getNormalUserDataById(contact.userId) ;
        }else{
        return await UserModel.getNormalUserDataById(contact.contactId);
        }
      })
     resolve( await Promise.all(getContactUsers));

    } catch (error) {
      reject(error);
    }
  })
}

let readMoreContactsSent = (currentUserId , skipNumber) => {
  return new Promise ( async (resolve , reject ) => {
    try {
      let newContactsSent = await ContactModel.readMoreContactsSent( currentUserId , skipNumber , LIMIT_NUMBER ) ;
      let getUsersContactSent = newContactsSent.map( async (contactSent) => {
        return await UserModel.getNormalUserDataById(contactSent.contactId);
      })
      resolve(await Promise.all(getUsersContactSent) );
    } catch (error) {
      reject(error);
    }
  })
}


let readMoreContactsReceived = (currentUserId , skipNumber ) => {
  return new Promise( async (resolve , reject )=> {
    try {
      let newContactsReceived = await ContactModel.readMoreContactsReceived(currentUserId , skipNumber , LIMIT_NUMBER);
      let getContactUsersReceived = newContactsReceived.map( async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId) ; 
      })

      resolve( await Promise.all(getContactUsersReceived));

    } catch (error) {
      reject(error) ;
    }
  })
}



module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContactSent: removeRequestContactSent,
  getContacts : getContacts ,
  getContactsSent : getContactsSent , 
  getContactsReceived : getContactsReceived ,
  countAllContacts : countAllContacts , 
  countAllContactsSent : countAllContactsSent , 
  countAllContactsReceived : countAllContactsReceived,
  readMoreContacts : readMoreContacts,
  readMoreContactsSent : readMoreContactsSent,
  readMoreContactsReceived : readMoreContactsReceived
}; 