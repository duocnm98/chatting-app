$(document).ready(function () {
  $("#link-read-more-contactsReceived").bind("click", function () {
    let skipNumber = $("#request-contact-received").find("li").length;

    $("#link-read-more-contactsReceived").css("display", "none");
    $(".read-more-contactsReceived-loader").css("display", "inline-block");

    $.get(`/contacts/read-more-contacts-received?skipNumber=${skipNumber}`, function (newContactUsersSend) {
      if (!newContactUsersSend.length) {
        alertify.notify("Bạn không còn lời mời kết bạn nào để xem thêm. !", "error", 6);
        $("#link-read-more-contactsReceived").css("display", "inline-block");
        $(".read-more-contactsReceived-loader").css("display", "none");
        return false
      };
      newContactUsersSend.forEach(user => {
        $("#request-contact-received")
          .find("ul")
          .append(`<li class="_contactList" data-uid="${user._id}">
                    <div class="contactPanel">
                        <div class="user-avatar">
                            <img src="images/users/${user.avatar}" alt="">
                        </div>
                        <div class="user-name">
                            <p>
                              ${user.username}
                            </p>
                        </div>
                        <br>
                        <div class="user-address">
                            <span>&nbsp ${user.address ? user.address : ""}</span>
                        </div>
                        <div class="user-approve-request-contact-received" data-uid="${user._id}">
                            Chấp nhận
                        </div>
                        <div class="user-remove-request-contact-received action-danger" data-uid="${user._id}">
                            Xóa yêu cầu
                        </div>
                    </div>
                </li>`);
      });
      removeRequestContactReceived();
      approveRequestContactReceived(); 
      $("#link-read-more-contactsReceived").css("display", "inline-block");
      $(".read-more-contactsReceived-loader").css("display", "none");
    });
  });
}); 