export const transValidation = {
  email_incorrect: "Email phải có dạng example@example.example",
  gender_incorrect: "what dờ heo",
  password_incorrect: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và kí tự đặc biệt",
  passwordConfirm_incorrect: "Mật khẩu không khớp, vui lòng nhập lại",
  update_username: "Username giới hạn trong khoảng 3-17 kí tự, không chứa kí tự đặc biệt",
  update_address: "Địa chỉ giới hạn trong khoảng 10-30 kí tự",
  update_phone: "Số điện thoại bắt đầu bằng 0, có 10 chữ số !!",
  keyword_find_user: "Lỗi từ khóa tìm kiếm, chỉ cho phép nhập chữ cái, số, khoảng cách",
  message_text_emoji_incorrect: "Tin nhắn không hợp lệ, ít nhất 1 ký tự, tối đa 400 ký tự",
  add_new_group_users_incorrect: "Vui lòng chọn thêm bạn bè để thêm vào nhóm, tối thiếu 2 người",
  add_new_group_name_incorrect: "Vui lòng nhập tên cuộc trò chuyện, giới hạn 5-30 ký tự và không chứa các kí tự đặt biệt"
};

export const transErrors = {
  account_existed: "Email này đã được sử dụng",
  account_removed: "Tài khoản đã vị xóa khỏi hệ thống",
  account_not_actived: "Tài khoản chưa kích hoạt! Vui lòng kiếm tra trong Email đăng kí",
  account_undefinded: "Tài khoản này không tồn tại",
  token_undefinded: "Token không tồn tại",
  login_failed: "Sai tài khoản hoặc mật khẩu",
  server_error: "Server bị lỗi, vui lòng thử lại sau !!",
  avatar_type: "Kiểu file ảnh không hợp lệ. Vui lòng chọn ảnh .PNG hoặc .JPG",
  image_message_type: "Kiểu file ảnh không hợp lệ. Vui lòng chọn ảnh .PNG hoặc .JPG",
  avatar_size: "Vui lòng chọn ảnh có kích thước dưới 1 Megabyte !",
  image_message_size: "Vui lòng chọn ảnh có kích thước dưới 1 Megabyte !",
  attachment_message_size: "Vui lòng chọn tệp có kích thước dưới 1 Megabyte !",
  password_match: "Mật khẩu hiện tại không chính xác",
  conversation_not_found: "Cuộc trò chuyện không tồn tại."
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong> ${userEmail} </strong> đã được tạo, vui lòng kiểm tra Email để active tài khoản trước khi đăng nhập. Xin cảm ơn!`;
  },
  account_actived:"Kích hoạt tài khoản thành công, bạn đã có thể đăng nhập vào ứng dụng",
  loginSuccess: (username) => {
    return `Xin chào ${username}, chúc bạn sử dụng Duoc_messenger vui vẻ!`;
  },
  logout_success: 'Đăng xuất tài khoản thành công',
  // avatar_update: "Cập nhật ảnh đại diện thành công",
  userInfo_update: "Cập nhật thông tin người dùng thành công",
  userPassword_update: "Cập nhật mật khẩu thành công"
};

export const transMailer = {
  subject: "[Duoc_Messenger] Xác nhận kích hoạt tài khoản.",
  template: (linkVerify) => {
    return `
      <h2>Bạn đã đăng kí tài khoản trên Duoc_Messenger !!</h2>
      <h3>Vui lòng click vào link bên dưới để xác nhận tài khoản.</h3>
      <h3 <a href="${linkVerify} target="blank">${linkVerify}</a>></h3>
    `;
  },
  email_send_failed: "Quá trình gửi mail bị lỗi! Vui lòng thử lại!"
};
