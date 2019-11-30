let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};

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
    let regexUsername = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");

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
    let regexPhone = new RegExp("^(0)[0-9]{9}$");

    if(!regexPhone.test(phone)){
      alertify.notify("Số điện thoại bắt đầu bằng 0, có 10 chữ số !!", "error", 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }
    userInfo.phone = $(this).val();
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
});
