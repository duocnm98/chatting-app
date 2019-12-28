import {pushSocketIdToArray, removeSocketIdFromArray, emitNotifyToArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param {*} io from socket.io lb 
 */
let userOnlineOffline = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    
    //push socketid to array
    clients = pushSocketIdToArray(clients, socket.request.user._id,socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id,socket.id);
    });
    
    let listUsersOnline = Object.keys(clients);
    //Step 01: Emit to user after login or F5
    socket.emit("server-send-list-users-online", listUsersOnline);

    //Step 02: Emit to all user when has new user online
    socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);  

    //remove socketid when socket disconnected
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });

      //Step 03:  Emit to all user when has new user offline
      socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);  
    });
  });
};

module.exports = userOnlineOffline; 
