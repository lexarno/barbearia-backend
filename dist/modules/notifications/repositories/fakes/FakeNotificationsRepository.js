"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongodb = require("mongodb");

var _Notification = _interopRequireDefault(require("../../infra/typeorm/schemas/Notification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// SOLID (L) - Liskov Substitution Principle
// Libs externas (ex. BD) podem ser substituídas sem causar impacto na aplicação
// Por isso adicionei a interface INotificationRepository
class FakeNotificationsRepository {
  constructor() {
    this.notifications = [];
  }

  async create({
    content,
    recipient_id
  }) {
    const notification = new _Notification.default();
    Object.assign(notification, {
      id: new _mongodb.ObjectID(),
      content,
      recipient_id
    });
    this.notifications.push(notification);
    return notification;
  }

}

var _default = FakeNotificationsRepository;
exports.default = _default;