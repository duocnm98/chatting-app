import {notification} from './../services/service';

module.exports.index = async (req, res) => {

  //only 10 items one time
  let notifications = await notification.getNotifications(req.user._id );

  //get amount notification unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  return res.render("main/home/home", {
    errors: req.flash('errors'),
    success: req.flash('success'),
    user: req.user,
    notifications: notifications,
    countNotifUnread: countNotifUnread
  });
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