function removeRequestContactReceived() {
  $(".user-remove-request-contact-received").unbind("click").on("click", function () {
    let targetId = $(this).data("uid");
    $.ajax({
      url: "/contact/remove-request-contact-received",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        if (data.success) {

          //chưa xử lý
          // $('.noti_content').find(`div[data-uid=${user.id}]`).remove();
          // $("ul.list-notifications").find(`li div[data-uid=${user.id}]`).parent().remove();
          // decreaseNotification("noti_counter", 1);

          decreaseNumberNotifContact("count-request-contact-received");
          decreaseNumberNotification("noti_contact_counter", 1);
          $("#request-contact-received").find(`li[data-uid=${targetId}]`).remove();
          socket.emit("remove-request-contact-received", { contactId: targetId });
        };
      }
    });
  });
};

socket.on("response-remove-request-contact-received", function (user) {
  $("#find-user").find(`.user-add-new-contact[data-uid=${user.id}]`).css("display", "inline-block");
  $("#find-user").find(`.user-remove-request-contact-sent[data-uid=${user.id}]`).hide();

  $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove();

  decreaseNumberNotifContact("count-request-contact-sent");
  decreaseNumberNotification("noti_contact_counter", 1);

});

$(document).ready(function () {
  removeRequestContactReceived();
}); 