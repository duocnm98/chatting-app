$(document).ready(function() {
  $("#link-read-more-contactsSent").bind("click", function() {
    let skipNumber = $("#request-contact-sent").find("li").length;

    $("#link-read-more-contactsSent").css("display", "none");
    $(".read-more-contactsSent-loader").css("display", "inline-block");

    $.get(
      `/contacts/read-more-contacts-sent?skipNumber=${skipNumber}`,
      function(newContactUsersSend) {
        if (!newContactUsersSend.length) {
          alertify.notify(
            "Bạn không còn bạn bè nào để xem thêm. !",
            "error",
            6
          );
          $("#link-read-more-contactsSent").css("display", "inline-block");
          $(".read-more-contactsSent-loader").css("display", "none");
          return false;
        }

        newContactUsersSend.forEach(user => {
          $("#request-contact-sent").find("ul").append(`
                  <li class="_contactList" data-uid="${user._id}">
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
                            <span>&nbsp ${
                              user.address ? user.address : ""
                            }</span>
                        </div>
                        <div class="user-remove-request-contact-sent action-danger display-important" data-uid="${
                          user._id
                        }">
                            Hủy yêu cầu
                        </div>
                    </div>
                  </li>     `);
        });

        removeRequestContactSent(); //js/removeRequestContactSent()

        $("#link-read-more-contactsSent").css("display", "inline-block");
        $(".read-more-contactsSent-loader").css("display", "none");
      }
    );
  });
});
