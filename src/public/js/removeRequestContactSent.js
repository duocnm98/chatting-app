function removeRequestContactSent() {
  $(".user-remove-request-contact-sent").unbind("click").on("click", function() {
    let targetId = $(this).data("uid");
    $.ajax({
      url: "/contact/remove-request-contact-sent",
      type: "delete",
      data: {uid: targetId},
      success: function(data) {
        if(data.success) {
          $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).hide();
          $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");

          
          //at navbar
          decreaseNumberNotification("noti_contact_counter", 1);

          // at modal contact
          decreaseNumberNotifContact("count-request-contact-sent"); //js/calculateNotifContact.js

          //Delete at confirm tab
          $("#request-contact-sent").find(`li[data-uid = ${targetId}]`).remove();

          //real-time processing
          socket.emit("remove-request-contact-sent", { contactId: targetId });
        }
      }
    });
  });
}

//listen socket io remove request contact event
socket.on("response-remove-request-contact-sent", user => {
  $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); //popup notif
  $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();
  //Remove add addfriend request
  $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();

  //Delete at tab model add friend request
  decreaseNumberNotifContact("count-request-contact-received");

  decreaseNumberNotification("noti_contact_counter",1);
  decreaseNumberNotification("noti_counter",1);
});

$(document).ready(function() {
  removeRequestContactSent();
});