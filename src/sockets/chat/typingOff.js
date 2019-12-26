import {pushSocketIdToArray, removeSocketIdFromArray, emitNotifyToArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param {*} io from socket.io lb 
 */
let typingOff = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    
    //push socketid to array
    clients = pushSocketIdToArray(clients, socket.request.user._id,socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id,socket.id);
    });
    socket.on("user-is-not-typing", (data) => {
      //collect all neccesary data to display on notification
      if (data.groupId) {
        let response = {
          currentUserId: socket.request.user._id,
          currentGroupId: data.groupId
        };
        
          //emit notification
        if (clients[data.groupId]) {
          emitNotifyToArray(clients, data.groupId, io, "response-user-is-not-typing", response);
        }
      }

      if(data.contactId) {
        let response = {
          currentUserId: socket.request.user._id
        };

          //emit notification
        if (clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, "response-user-is-not-typing", response);
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

module.exports = typingOff; 
