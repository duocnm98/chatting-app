let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function callLogout(){
  let timerInterval;
  Swal.fire({
    position: "top-end", 
    title: "Tự động đăng xuất sau 5 giây",
    html:"Thời gian <strong></strong>",
    timer: 5000,
    onBeforeOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
      },1000);
    },
    onClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    $.get("/logout", function (){
      location.reload();
    });
  });
}

function updateUserInfo() {
  $("#input-change-avatar").bind("change", function() {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; // byte = 1MB

    if ($.inArray(fileData.type, math) === -1 ){
      alertify.notify("Kiểu file ảnh không hợp lệ. Vui lòng chọn ảnh .PNG hoặc .JPG", "error", 7);
      $(this).val(null);
      return false;
    }

    if (fileData.size > limit){
      alertify.notify("Vui lòng chọn ảnh có kích thước dưới 1 Megabyte !", "error", 7);
      $(this).val(null);
      return false;
    }

    if (typeof FileReader != "undefined") {
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty();

      let fileReader = new FileReader();
      fileReader.onload = function(element) {
        $("<img>", {
          src: element.target.result,
          class: "avatar img-circle",
          id: "user-modal-avatar",
          alt: "avatar"
        }).appendTo(imagePreview);
      };
      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FormData();
      formData.append("avatar", fileData);

      userAvatar = formData;
    } else {
      alertify.notify(
        "Trình duyệt của bạn không hỗ trợ File Reader!",
        "error",
        7
      );
    }
  });

  $("#input-change-username").bind("change", function() {
    let username = $(this).val();
    let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

    if(!regexUsername.test(username) || username.length < 3 || username.length > 17){
      alertify.notify("Username giới hạn trong khoảng 3-17 kí tự, không chứa kí tự đặc biệt", "error", 7);
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;
    }
    userInfo.username = $(this).val();
  });

  $("#input-change-gender-male").bind("click", function() {
    userInfo.gender = $(this).val();
  });

  $("#input-change-gender-female").bind("click", function() {
    userInfo.gender = $(this).val();
  });

  $("#input-change-address").bind("change", function() {
    let address = $(this).val();
    
    if(address.length < 10 || address.length > 30){
      alertify.notify("Địa chỉ giới hạn trong khoảng 10-30 kí tự", "error", 7);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    }
    userInfo.address = $(this).val();
  });

  $("#input-change-phone").bind("change", function() {
    let phone = $(this).val();
    let regexPhone = new RegExp(/^(0)[0-9]{9}$/);

    if(!regexPhone.test(phone)){
      alertify.notify("Số điện thoại bắt đầu bằng 0, có 10 chữ số !!", "error", 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }
    userInfo.phone = $(this).val();
  });

  $("#input-change-current-password").bind("change", function() {
    let currentPassword = $(this).val();
    let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

    if(!regexPassword.test(currentPassword)){
      alertify.notify("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và kí tự đặc biệt", "error", 7);
      $(this).val(null);
      delete userInfo.phone;
      return false;
    }
    userUpdatePassword.currentPassword = currentPassword;
  });

  $("#input-change-new-password").bind("change", function() {
    let newPassword = $(this).val();
    let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

    if(!regexPassword.test(newPassword)){
      alertify.notify("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và kí tự đặc biệt", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.newPassword;
      return false;
    }
    userUpdatePassword.newPassword = newPassword;
  });

  $("#input-change-confirm-new-password").bind("change", function() {
    let confirmNewPassword = $(this).val();

    if(!userUpdatePassword.newPassword) {
      alertify.notify("Bạn chưa nhập mật khẩu mới", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword;
      return false;
    }

    if(confirmNewPassword !== userUpdatePassword.newPassword) {
      alertify.notify("Mật khẩu nhập lại chưa chính xác", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword;
      return false;
    }
    userUpdatePassword.confirmNewPassword  = confirmNewPassword ;
  });


}

function callUpdateUserAvatar() {
  $.ajax({
    url: "/user/update-avatar",
    type: "put",
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function(result) {
      console.log(result);
      //Display success
      $(".user-modal-alert-success")
        .find("span")
        .text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      //update navbar user avatar
      $("#navbar-avatar").attr("src", result.imgSrc);

      //Update avatar orgin source
      originAvatarSrc = result.imgSrc;

      //Reset all
      $("#input-btn-cancel-update-user").click();
    },
    error: function(error) {
      //Display error
      console.log(error);
      $(".user-modal-alert-error")
        .find("span")
        .text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");

      //Reset all
      $("#input-btn-cancel-update-user").click();
    }
  });
}

function callUpdateUserInfo() {
  $.ajax({
    url: "/user/update-info",
    type: "put",
    data: userInfo,
    success: function(result) {
      console.log(result);
      //Display success
      $(".user-modal-alert-success")
        .find("span")
        .text(result.message);
      $(".user-modal-alert-success").css("display", "block");
      
      //Update orgin user info
      originUserInfo = Object.assign(originUserInfo, userInfo);
      
      // update user name at navbar
      $("#navbar-username").text(originUserInfo.username);
      //Reset all
      $("#input-btn-cancel-update-user").click();
    },
    error: function(error) {
      //Display error
      console.log(error);
      $(".user-modal-alert-error")
        .find("span")
        .text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");

      //Reset all
      $("#input-btn-cancel-update-user").click();
    }
  });
}

function callUpdateUserPassword() {
  $.ajax({
    url: "/user/update-password",
    type: "put",
    data: userUpdatePassword,
    success: function(result) {
      //Display success
      $(".user-modal-password-alert-success")
        .find("span")
        .text(result.message);
      $(".user-modal-password-alert-success").css("display", "block");
      
      //Reset all
      $("#input-btn-cancel-update-user-password").click();

      //Logout after change password success
      callLogout();
    },
    error: function(error) {
      //Display error
      console.log(error);
      $(".user-modal-password-alert-error")
        .find("span")
        .text(error.responseText);
      $(".user-modal-password-alert-error").css("display", "block");

      //Reset all
      $("#input-btn-cancel-update-user-password").click();
    }
  });
}

$(document).ready(function() {

  originAvatarSrc = $("#user-modal-avatar").attr("src");
  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: $("#input-change-gender-male").is(":checked") ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val()
  };

  //update user info after change
  updateUserInfo();

  $("#input-btn-update-user").bind("click", function() {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("Không có thông tin nào được thay đổi !", "error", 7);
      return false;
    }
    if (userAvatar) {
      callUpdateUserAvatar();
    }

    if(!$.isEmptyObject(userInfo)) {
      callUpdateUserInfo();
    }
  });

  $("#input-btn-cancel-update-user").bind("click", function() {
    userAvatar = null;
    userInfo = {};

    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src", originAvatarSrc);

    $("#input-change-username").val(originUserInfo.username);
    (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click() 
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);
  });

  $("#input-btn-update-user-password").bind("click", function() {
    if(!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword) {
      alertify.notify("Bạn phải thay đổi đầy đủ thông tin", "error", 7);
      return false;
    }
    Swal.fire({
      title: "Bạn có chắc chắn muốn thay đổi mật khẩu",
      text: "Bạn không thế hoàn tác lại quá trình này!",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if(!result.value){
        $("#input-btn-cancel-update-user-password").click();
        return false;
      }
      callUpdateUserPassword();
    })
  });

  $("#input-btn-cancel-update-user-password").bind("click", function() {
    $("#input-change-current-password").val(null);
    $("#input-change-new-password").val(null);
    $("#input-change-confirm-new-password").val(null);
  });
});
