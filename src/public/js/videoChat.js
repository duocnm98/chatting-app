function videoChat(divId) {
  $(`#video-chat-${divId}`).unbind("click").on("click", function(){
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();

    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    };

    //Step 01 (of Caller)
    socket.emit("caller-check-listener-online-or-not", dataToEmit);
  });
}

function playVideoStream(videoTagId, stream){
  let video = document.getElementById(videoTagId);

  video.srcObject = stream;
  video.onloadeddata = function () {
    video.play();
  };
};

function closeVideoStream(stream) {
  return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function (){
  //Step 02 (of caller)
  socket.on("servver-send-listener-is-offline", function() {
    alertify.notify("Người dùng này hiện không trực tuyến", "error", 7);
  });

  let iceServerList = $("#ice-server-list").val();

  //PeerJS
  let getPeerId = "";
  const peer = new Peer({
    key: "peerjs",
    host: "peerjs-server-trungquandev.herokuapp.com",
    secure: true,
    port: 443,
    // debug :3,
    config: {"iceServers": JSON.parse(iceServerList)}
  });

  peer.on("open", function (peerId) {
    getPeerId = peerId;
  });


  //socket 03 (of listener)
  socket.on("server-request-peer-id-of-listener", function(response) {
    let listenerName = $("#navbar-username").text();

    let dataToEmit = {
      callerId:  response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeerId: getPeerId
    };

    //Step 04 (of listener)
    socket.emit("listener-emit-peer-id-to-server", dataToEmit);
  });

  let timerInterval;
  //Step 05 (of caller)
  socket.on("server-send-peer-id-of-listener-to-caller", function(response) {

    let dataToEmit = {
      callerId:  response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };

    //Step 06 (of caller)
    socket.emit("caller-request-call-to-server", dataToEmit);

    Swal.fire({
      title: `Đang gọi cho &nbsp; <span style="color: #2ECC71;">  ${response.listenerName} </span> &nbsp; &nbsp; <i class="fa fa-volume-control-phone"> </i>`,
      html:`
        Thời gian: <strong style="color: #D43F3A;"></strong> giây. <br/> <br/>
        <button id="btn-cancel-call" class="btn btn-danger"> Hủy cuộc gọi </button>
      `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      allowOutsideClick: false,
      width: "52rem",
      timer: 30000, //30 seconds
      onBeforeOpen: () => {
        $("#btn-cancel-call").unbind("click").on("click", function (){
          Swal.close();
          clearInterval(timerInterval);

          //Step 07 (of caller)
          socket.emit("caller-cancel-request-call-to-server", dataToEmit);
        });

        if (Swal.getContent().querySelector !== null){
          Swal.showLoading();
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          },1000);
        }
      },
      onOpen: () => {
        //Step 12 (of caller)
        socket.on("server-send-reject-call-to-caller", function (response) {
          Swal.close();
          clearInterval(timerInterval);

          Swal.fire({
            type: "info",
            title: `<span style="color: #2ECC71;">  ${response.listenerName} </span> &nbsp; hiện tại không thể nghe máy.`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            allowOutsideClick: false,
            width: "52rem",
            confirmButtonColor: "#2ECC71",
            confirmButtonText: "Xác nhận"
          });
        });

       
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      return false;
    });
  });

  //Step 08 of listener
  socket.on("server-send-request-call-listener", function(response) {
    let dataToEmit = {
      callerId:  response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };
    
    Swal.fire({
      title: `<span style="color: #2ECC71;">  ${response.callerName} </span> &nbsp; muốn trò chuyện video với bạn &nbsp; &nbsp; <i class="fa fa-volume-control-phone"> </i>`,
      html:`
        Thời gian: <strong style="color: #D43F3A;"></strong> giây. <br/> <br/>
        <button id="btn-accept-call" class="btn btn-success"> Đống ý </button>
        <button id="btn-reject-call" class="btn btn-danger"> Từ chối </button>
      `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      allowOutsideClick: false,
      width: "52rem",
      timer: 30000, //30 seconds
      onBeforeOpen: () => {
        $("#btn-reject-call").unbind("click").on("click", function (){
          Swal.close();
          clearInterval(timerInterval);

          //Step 10 of listener
          socket.emit("listener-reject-request-call-to-server", dataToEmit);
        });
        $("#btn-accept-call").unbind("click").on("click", function (){
          Swal.close();
          clearInterval(timerInterval);
  
          //Step 11 of listener
          socket.emit("listener-accept-request-call-to-server", dataToEmit);
        });

        if (Swal.getContent().querySelector !== null){
          Swal.showLoading();
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          },1000);
        }
      },
      onOpen: () => {
        //Step 09 (of listener)
        socket.on("server-send-cancel-request-call-listener", function (response) {
          Swal.close();
          clearInterval(timerInterval);
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      return false;
    });
  });

   //Step 13 (of caller)
   socket.on("server-send-accept-call-to-caller",function (response) {
    Swal.close();
    clearInterval(timerInterval);

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    getUserMedia({video: true, audio: true}, function(stream) {
      //Show modal streaming
      $("#streamModal").modal("show");

      //Play my stream in local (of caller)
      playVideoStream("local-stream", stream);

      //call to listener
      let call = peer.call(response.listenerPeerId, stream);

      //listen & play stream of listener 
      call.on("stream", function(remoteStream) {
        //Play streaming (of listener)
        playVideoStream("remote-stream", remoteStream);

        //Close modal: remove stream
        $("#streamModal").on("hidden.bs.modal", function (){
          closeVideoStream(stream);

          Swal.fire({
            type: "info",
            title: `Bạn đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ECC71;">  ${response.listenerName} </span>`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            allowOutsideClick: false,
            width: "52rem",
            confirmButtonColor: "#2ECC71",
            confirmButtonText: "Xác nhận"
          });
        }); 
      });
    }, function(err) {
      if (err.toString() === "NotAllowedError: Permission denied") {
        alertify.notify("Bạn đã tắt quyền truy cập camera hoặt microphone trên trình duyệt, vui lòng mở lại trong phần cài đặt!", "error", 7);
      }

      if (err.toString() === "NotFoundError: Request device not found") {
        alertify.notify("Không tìm thấy camera hoặc microphone trên máy tính", "error", 7);
      }
    });
  });

   //Step 14 (of listener)
   socket.on("server-send-accept-call-to-listener",function (response) {
    Swal.close();
    clearInterval(timerInterval);

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

    peer.on("call", function(call) {
      getUserMedia({video: true, audio: true}, function(stream) {
        //Show modal streaming
        $("#streamModal").modal("show");

        //Play my stream in local (of listener)
        playVideoStream("local-stream", stream);

        call.answer(stream); // Answer the call with an A/V stream.
        call.on("stream", function(remoteStream) {
          //Play streaming (of caller)
          playVideoStream("remote-stream", remoteStream);
        });

        //Close modal: remove stream
        $("#streamModal").on("hidden.bs.modal", function (){
          closeVideoStream(stream);

          Swal.fire({
            type: "info",
            title: `Bạn đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ECC71;">  ${response.callerName} </span> `,
            backdrop: "rgba(85, 85, 85, 0.4)",
            allowOutsideClick: false,
            width: "52rem",
            confirmButtonColor: "#2ECC71",
            confirmButtonText: "Xác nhận"
          });
        }); 
      }, function(err) {
        if (err.toString() === "NotAllowedError: Permission denied") {
          alertify.notify("Bạn đã tắt quyền truy cập camera hoặt microphone trên trình duyệt, vui lòng mở lại trong phần cài đặt!", "error", 7);
        }

        if (err.toString() === "NotFoundError: Request device not found") {
          alertify.notify("Không tìm thấy camera hoặc microphone trên máy tính", "error", 7);
        }
      });
    });

  });
});
