import { notification, contact, message } from "./../services/service";
import { bufferToBase64, lastItemOfArray, convertTimestampToHumanTime } from "./../helpers/clientHelper";
import request from "request";

let getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    // // Node Get ICE STUN and TURN list
    // let o = {
    //   format: "urls"
    // };

    // let bodyString = JSON.stringify(o);

    // let options = {
    //   url: "https://global.xirsys.net/_turn/duocmessenger",
    //   // host: "global.xirsys.net",
    //   // path: "/_turn/duocmessenger",
    //   method: "PUT",
    //   headers: {
    //     "Authorization": "Basic " + Buffer.from("duocnm:e1069d5a-2929-11ea-b3d7-0242ac110004").toString("base64"),
    //     "Content-Type": "application/json",
    //     "Content-Length": bodyString.length
    //   }
    // };

    // //Call a request to get ICE list of turnserver
    // request(options, (error, response, body) =>  {
    //   if (error) {
    //     console.log("Error when get ICE list: " + error);
    //     return reject(error);
    //   }

    //   let bodyJson = JSON.parse(body);
    //   resolve(bodyJson.v.iceServers);
    // });

    resolve([]);
  });
};

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

  //all messages with conversation
  let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;
  
  //get ICE list from xirsys turn server
  let iceServerList = await getICETurnServer();

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
    allConversationWithMessages: allConversationWithMessages,
    bufferToBase64: bufferToBase64,
    lastItemOfArray: lastItemOfArray,
    convertTimestampToHumanTime: convertTimestampToHumanTime,
    iceServerList: JSON.stringify(iceServerList)
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
