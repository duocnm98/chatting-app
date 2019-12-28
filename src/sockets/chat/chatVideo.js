import { pushSocketIdToArray, removeSocketIdFromArray, emitNotifyToArray } from "./../../helpers/socketHelper";
/**
 * 
 * @param {*} io from socket.io lb 
 */
let chatVideo = (io) => {
  let clients = {};
  io.on("connection", (socket) => {

    //push socketid to array
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    //When has new group chat 
    socket.on("new-group-created", (data) => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
    });

    socket.on("member-received-group-chat", (data) => {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on("caller-check-listener-online-or-not", (data) => {
      if (clients[data.listenerId]) {
        //online
        let response = {
          callerId: socket.request.user._id,
          listenerId: data.listenerId,
          callerName: data.callerName
        };

        emitNotifyToArray(clients, data.listenerId, io, "server-request-peer-id-of-listener", response);
      }
      else {
        //offline 
        socket.emit("servver-send-listener-is-offline");
      }
    });

    socket.on("listener-emit-peer-id-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId
      };

      if (clients[data.callerId]) {
        emitNotifyToArray(clients, data.callerId, io, "server-send-peer-id-of-listener-to-caller", response);
      }
    });

    socket.on("caller-request-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId
      };

      if (clients[data.listenerId]) {
        emitNotifyToArray(clients, data.listenerId, io, "server-send-request-call-listener", response);
      }
    });

    socket.on("caller-cancel-request-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId
      };

      if (clients[data.listenerId]) {
        emitNotifyToArray(clients, data.listenerId, io, "server-send-cancel-request-call-listener", response);
      }
    });

    socket.on("listener-reject-request-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId
      };

      if (clients[data.callerId]) {
        emitNotifyToArray(clients, data.callerId, io, "server-send-reject-call-to-caller", response);
      }
    });

    socket.on("listener-accept-request-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId
      };

      if (clients[data.callerId]) {
        emitNotifyToArray(clients, data.callerId, io, "server-send-accept-call-to-caller", response);
      }

      if (clients[data.listenerId]) {
        emitNotifyToArray(clients, data.listenerId, io, "server-send-accept-call-to-listener", response);
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

module.exports = chatVideo; 
