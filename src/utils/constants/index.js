const PHONE_REGEX =
  /^(?:\+1\s?)?(?:\([2-9][0-8]\d\)|[2-9][0-8]\d)[\s.-]?[2-9]\d{2}[\s.-]?\d{4}$/;

const USER_ROLE = {
  Admin: "Admin",
};
Object.freeze(USER_ROLE);

/**
 * @description set of events that we are using in chat app. more to be added as we develop the chat app
 */
export const ChatEventEnum = Object.freeze({
  // ? once user is ready to go
  CONNECTED_EVENT: "connected",
  // ? when user gets disconnected
  DISCONNECT_EVENT: "disconnect",
  // ? when user joins a socket room
  JOIN_CHAT_EVENT: "joinChat",
  // ? when participant gets removed from group, chat gets deleted or leaves a group
  LEAVE_CHAT_EVENT: "leaveChat",
  // ? when new message is received
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  // ? when there is new one on one chat, new group chat or user gets added in the group
  NEW_CHAT_EVENT: "newChat",
  // ? when there is an error in socket
  SOCKET_ERROR_EVENT: "socketError",
  // ? when participant stops typing
  STOP_TYPING_EVENT: "stopTyping",
  // ? when participant starts typing
  TYPING_EVENT: "typing",
  // ? when message is deleted
  MESSAGE_DELETE_EVENT: "messageDeleted",

  ACTIVITY_PERMISSION_UPDATED_EVENT: "activityPermissionUpdated",
});

export const AvailableChatEvents = Object.values(ChatEventEnum);

const CUSTOMER_STATUS_ENUM = ["Active", "Inactive", "Pending", "Blocked"];

const LOAN_STATUS_ENUM = ["Active", "Closed", "Defaulted", "Pending"];

const TRANSACTION_TYPE_ENUM = ["Disbursement", "Repayment"];

const TRANSACTION_PAYMENT_MODE_ENUM = ["Cash", "Bank", "UPI", "Cheque"];

const EMAIL_TEMPLATE = {
  FORGOT_PASSWORD: {
    SUBJECT: "Forgot Password",
    TEMPLATE: "forgotPassword",
  },
};

export {
  USER_ROLE,
  PHONE_REGEX,
  CUSTOMER_STATUS_ENUM,
  LOAN_STATUS_ENUM,
  TRANSACTION_TYPE_ENUM,
  TRANSACTION_PAYMENT_MODE_ENUM,
  EMAIL_TEMPLATE,
};
