"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = exports.ChannelLogRecordType = void 0;
var ChannelLogRecordType;
(function (ChannelLogRecordType) {
    ChannelLogRecordType[ChannelLogRecordType["BAN"] = 0] = "BAN";
    ChannelLogRecordType[ChannelLogRecordType["UNBAN"] = 1] = "UNBAN";
    ChannelLogRecordType[ChannelLogRecordType["KICK"] = 2] = "KICK";
    ChannelLogRecordType[ChannelLogRecordType["WARNING"] = 3] = "WARNING";
    ChannelLogRecordType[ChannelLogRecordType["UNWARN"] = 4] = "UNWARN";
    ChannelLogRecordType[ChannelLogRecordType["TEXT"] = 5] = "TEXT";
    ChannelLogRecordType[ChannelLogRecordType["SYSTEM"] = 6] = "SYSTEM";
    ChannelLogRecordType[ChannelLogRecordType["TEST"] = 7] = "TEST";
})(ChannelLogRecordType || (exports.ChannelLogRecordType = ChannelLogRecordType = {}));
var Permission;
(function (Permission) {
    Permission[Permission["VIEW_SERVER"] = 1] = "VIEW_SERVER";
    Permission[Permission["VIEW_ROLES"] = 2] = "VIEW_ROLES";
    Permission[Permission["VIEW_RSS"] = 3] = "VIEW_RSS";
    Permission[Permission["VIEW_CHANNELS"] = 4] = "VIEW_CHANNELS";
    Permission[Permission["VIEW_BANS"] = 5] = "VIEW_BANS";
    Permission[Permission["VIEW_WARNINGS"] = 6] = "VIEW_WARNINGS";
    Permission[Permission["EDIT_ROLES"] = 102] = "EDIT_ROLES";
    Permission[Permission["EDIT_RSS"] = 103] = "EDIT_RSS";
    Permission[Permission["EDIT_CHANNELS"] = 104] = "EDIT_CHANNELS";
    Permission[Permission["EDIT_BANS"] = 105] = "EDIT_BANS";
    Permission[Permission["EDIT_WARNINGS"] = 106] = "EDIT_WARNINGS";
})(Permission || (exports.Permission = Permission = {}));
//# sourceMappingURL=index.js.map