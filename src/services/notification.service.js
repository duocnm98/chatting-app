import NotificationModel from "./../models/notifications.model";
import UserModel from "./../models/user.model";
/**
 * Get notifiacation when refresh app, 10 item per one time
 * @param {string} currentUserId
 * @param {number = 10} limit
 */
let getNotifications = (currentUserId, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit);
      
      let getNotifContents = notifications.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });
      resolve(await Promise.all(getNotifContents));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Count all notification unread
 * @param {String} currentUserId 
 */
let countNotifUnread = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifiacationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
      resolve(notifiacationsUnread);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getNotifications: getNotifications,
  countNotifUnread: countNotifUnread
};
