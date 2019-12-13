function removeRequestContact() {
  $(".user-remove-request-contact").bind("click", function() {
    let targetId = $(this).data("uid");
    $.ajax({
      url: "/contact/remove-request-contact",
      type: "delete",
      data: {uid: targetId},
      success: function(data) {
        if(data.success) {
          $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide();
          $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
          decreaseNumberNotifContact("count-request-contact-sent");
          //real-time processing
          socket.emit("remove-request-contact", { contactId: targetId });
        }
      }
    });
  });
}

//listen socket io remove request contact event
socket.on("response-remove-request-contact", user => {
  $(".noti_content").find(`span[data-uid = ${user.id}]`).remove();

  //Delete at tab model add friend request
  decreaseNumberNotifContact("count-request-contact-received");

  decreaseNumberNotification("noti_contact_counter");
  decreaseNumberNotification("noti_counter");
});

