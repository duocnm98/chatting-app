export const transValidation = {
  email_incorrect: "Email phải có dạng example@example.example",
  gender_incorrect: "what dờ heo",
  password_incorrect: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và kí tự đặc biệt",
  passwordConfirm_incorrect: "Mật khẩu không khớp, vui lòng nhập lại"
};

export const transErrors = {
  account_existed: "Email này đã được sử dụng",
  account_removed: "Tài khoản đã vị xóa khỏi hệ thống",
  account_not_actived: "Tài khoản chưa kích hoạt! Vui lòng kiếm tra trong Email đăng kí"
}

export const transSuccess = {
  userCreate: (userEmail) => {
    return `Tài khoản <strong> ${userEmail} </strong> đã được tạo, vui lòng kiểm tra Email để active tài khoản trước khi đăng nhập. Xin cảm ơn!`;
  }
}

