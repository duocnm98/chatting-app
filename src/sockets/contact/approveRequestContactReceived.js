import {pushSocketIdToArray, removeSocketIdFromArray, emitNotifyToArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param {*} io from socket.io lb 
 */
let approveRequestContactReceived = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    
    //push socketid to array
    clients = pushSocketIdToArray(clients, socket.request.user._id,socket.id);
    socket.on("approve-request-contact-received", (data) => {
      
      //collect all neccesary data to display on notification
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address : socket.request.user.address ? socket.request.user.address : ""
      };

      //emit notification
      if (clients[data.contactId]) {
        emitNotifyToArray(clients,data.contactId, io, "response-approve-request-contact-received", currentUser);
      }
    });

    //remove socketid when socket disconnected
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
    });

  });
};

module.exports = approveRequestContactReceived; 
