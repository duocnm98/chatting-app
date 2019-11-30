import {check} from 'express-validator/check';
import {transValidation} from '../../lang/vie';

module.exports.updateInfo = [
  check("username", transValidation.update_username)
    .optional()
    .isLength({min: 3, max: 17})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
  check("address", transValidation.update_address)
    .optional()
    .isLength({min:10, max:30}),
  check("phone", transValidation.update_phone)
    .optional()
    .matches(/^(0)[0-9]{9}$/)
]

