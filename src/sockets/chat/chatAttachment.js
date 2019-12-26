import {pushSocketIdToArray, removeSocketIdFromArray, emitNotifyToArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param {*} io from socket.io lb 
 */
let chatAttachment = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    
    //push socketid to array
    clients = pushSocketIdToArray(clients, socket.request.user._id,socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id,socket.id);
    });
    socket.on("chat-attachment", (data) => {
      //collect all neccesary data to display on notification
      if (data.groupId) {
        let response = {
          currentUserId: socket.request.user._id,
          currentGroupId: data.groupId,
          message: data.message
        };
        
          //emit notification
        if (clients[data.groupId]) {
          emitNotifyToArray(clients, data.groupId, io, "response-chat-attachment", response);
        }
      }

      if(data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message
        };

          //emit notification
        if (clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, "response-chat-attachment", response);
        }
      }
    });

    //remove socketid when socket disconnected
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });
  });
};

module.exports = chatAttachment; 
