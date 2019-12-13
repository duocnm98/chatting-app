import {pushSocketIdToArray, removeSocketIdFromArray, emitNotifyToArray} from "./../../helpers/socketHelper";

/**
 * 
 * @param {*} io from socket.io lb 
 */
let removeRequestContact = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.on("remove-request-contact", (data) => {
      
      //collect all neccesary data to display on notification
      let currentUser = {
        id: socket.request.user._id,
      };

      //emit notification
      if (clients[data.contactId]) {
        emitNotifyToArray(clients, data.contactId, io, "response-remove-request-contact", currentUser);
      }
    });

    //remove socketid when socket disconnected
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
    });
  });
};

module.exports = removeRequestContact; 
