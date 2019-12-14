import { contact } from "./../services/service";
  import { validationResult } from "express-validator/check";

let findUsersContact = async (req, res, next) => {
  let errorArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });

    return res.status(500).send(errorArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;
    let users = await contact.findUsersContact(currentUserId, keyword);

    return res.render("main/contact/sections/_findUsersContact", { users });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let addNew = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let newContact = await contact.addNew(currentUserId, contactId);

    return res.status(200).send({ success: !!newContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContact = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContact(currentUserId,contactId);

    return res.status(200).send({ success: !!removeReq });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContacts = async (req , res) => {
  try {
    let skipNumberContacts = +(req.query.skipNumber); 
    let newContactUsers = await contact.readMoreContacts(req.user._id , skipNumberContacts );
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error) ; 
  }
};


let readMoreContactsSent = async (req , res) => {
  try {
    let skipNumberContactsSent = +(req.query.skipNumber) ; 
    let newContactsSent = await contact.readMoreContactsSent(req.user._id , skipNumberContactsSent) ;
    return res.status(200).send(newContactsSent);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContactsReceived = async(req ,res ) =>{
  try {
    let skipNumber = +(req.query.skipNumber);
    let newContactsReceived = await contact.readMoreContactsReceived(req.user._id , skipNumber) ;
    return res.status(200).send(newContactsReceived);
  } catch (error) {
    return res.status(200).send(error);
  }
};

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact,
  readMoreContacts : readMoreContacts,
  readMoreContactsSent : readMoreContactsSent,
  readMoreContactsReceived : readMoreContactsReceived
};
