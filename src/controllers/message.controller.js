import { validationResult } from "express-validator/check";
import { message} from "./../services/service";
import multer from "multer";
import { app } from "./../config/app";
import { transErrors, transSuccess } from "./../../lang/vie";
import fsExtra from "fs-extra";

let addNewTextEmoji = async (req, res) => {
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
    let sender = {
      id: req.user._id,
      name: req.user.username,
      avatar: req.user.avatar
    };
    
    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup;

    let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);
    return res.status(200).send({message: newMessage});
  } catch (error) {
    return res.status(500).send(error);
  }
}

//Declare image upload location
let storageImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.image_message_directory);
  },

  filename: (req, file, callback) => {
    let math = app.image_message_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type, null);
    }

    let imageName = `${file.originalname}`;
    callback(null, imageName);
  }
});

let imageMessageUploadFile = multer({
  storage: storageImageChat,
  limits: { fileSize: app.image_message_limit_size }
}).single("my-image-chat");

let addNewImage = (req, res) => {
  imageMessageUploadFile(req, res, async (error) => {
    if (error) {
      if(error.message) {
        return res.status(500).send(transErrors.image_message_size);
      }
      return res.status(500).send(error);;
    }
    
    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      };
      
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
  
      let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);

      //remove image (image has been save in mongodb)
      await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`);
      return res.status(200).send({message: newMessage});
    } catch (error) {
      return res.status(500).send(error);
    }

  });
}

//Handle attachment chat
let storageAttachmentChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.attachment_message_directory);
  },

  filename: (req, file, callback) => {
    let attachmentName = `${file.originalname}`;
    callback(null, attachmentName);
  }
});

let attachmentMessageUploadFile = multer({
  storage: storageAttachmentChat,
  limits: { fileSize: app.attachment_message_limit_size }
}).single("my-attachment-chat");


let addNewAttachment = (req, res) => {
  attachmentMessageUploadFile(req, res, async (error) => {
    if (error) {
      if(error.message) {
        return res.status(500).send(transErrors.attachment_message_size);
      }
      return res.status(500).send(error);;
    }
    
    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      };
      
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
  
      let newMessage = await message.addNewAttachment(sender, receiverId, messageVal, isChatGroup);

      //remove attachment (attachment has been save in mongodb)
      await fsExtra.remove(`${app.attachment_message_directory}/${newMessage.file.fileName}`);
      return res.status(200).send({message: newMessage});
    } catch (error) {
      return res.status(500).send(error);
    }

  });
}



module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttachment: addNewAttachment
}