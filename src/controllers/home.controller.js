module.exports.index = (req, res) => {
  return res.render("main/master");
}

module.exports.loginRegister = (req, res) => {
  return res.render("auth/loginRegister");
}

module.exports.testDatabase =  async (req, res) => {
  try{
    let item = {
      userId: "1986sa1df6asd",
      contactId: "986sa1df6asd986sa1df6asd"
    }
    let contact = await ContactModel.createNew(item);
    res.send(contact);
  }
  catch(err){
    console.log(err);
  }
  res.send("<h1>Hello world</h1>");
}