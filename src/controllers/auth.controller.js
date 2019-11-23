import {validationResult} from "express-validator/check";
import {auth} from './../services/service';

module.exports.loginRegister = (req, res) => {
  return res.render("auth/master", {
    errors: req.flash('errors'),
    success: req.flash('success')
  });
}

module.exports.postRegister = async (req,res) => {
  let successArr =[];
  let errorArr = [];
  let validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()){
    let errors = Object.values(validationErrors.mapped());
    
    errors.forEach(item => {
      errorArr.push(item.msg);
    });

    req.flash("errors", errorArr);
    return res.redirect('/login-register');
  }

  try{
    let createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password);

    successArr.push(createUserSuccess);
    req.flash("success", successArr);
    return res.redirect('/login-register');
  } catch(error){
    errorArr.push(error);
    req.flash('errors', errorArr);
    return res.redirect('/login-register');
  }
}

