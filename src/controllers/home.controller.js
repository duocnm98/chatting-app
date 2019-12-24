import { notification, contact, message } from "./../services/service";
import { bufferToBase64 } from "./../helpers/clientHelper";

module.exports.index = async (req, res) => {
  //only 10 items one time
  let notifications = await notification.getNotifications(req.user._id);

  //get amount notification unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  //get contact 10 item one time
  let contacts = await contact.getContacts(req.user._id);
  //get contact send item
  let contactsSent = await contact.getContactsSent(req.user._id);
  //get contact receive item
  let contactsReceived = await contact.getContactsReceived(req.user._id);

  //count All contacts
  let countAllContacts = await contact.countAllContacts(req.user._id);
  //count all contacts sent
  let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
  //count ll contacts received
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);
  let allConversations = getAllConversationItems.allConversations;
  let userConversations = getAllConversationItems.userConversations;
  let groupConversations = getAllConversationItems.groupConversations;

  //all messages with conversation
  let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;

  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotifUnread: countNotifUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactsReceived: contactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
    allConversations: allConversations,
    userConversations: userConversations,
    groupConversations: groupConversations,
    allConversationWithMessages: allConversationWithMessages,
    bufferToBase64: bufferToBase64
  });
};

module.exports.testDatabase = async (req, res) => {
  try {
    let item = {
      userId: "1986sa1df6asd",
      contactId: "986sa1df6asd986sa1df6asd"
    };
    let contact = await ContactModel.createNew(item);
    res.send(contact);
  } catch (err) {
    console.log(err);
  }
  res.send("<h1>Hello world</h1>");
};
