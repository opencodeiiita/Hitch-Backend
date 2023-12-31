const USER_PERMISSION = require('../enums/userPermissions.enums');
const USER_ROLES = require('../enums/userRoles.enums');

const userRolesToPermissionsMap = {
    [USER_ROLES.ADMIN]: [
        USER_PERMISSION.READ_MESSAGE,
        USER_PERMISSION.WRITE_MESSAGE,
        USER_PERMISSION.DELETE_MESSAGE,
        USER_PERMISSION.CREATE_CHANNELS,
        USER_PERMISSION.DELETE_CHANNELS,
        USER_PERMISSION.UPDATE_CHANNELS,
        USER_PERMISSION.CREATE_ROLES,
        USER_PERMISSION.DELETE_ROLES,
        USER_PERMISSION.UPDATE_ROLES,
        USER_PERMISSION.ADD_USERS,
        USER_PERMISSION.REMOVE_USERS,
        USER_PERMISSION.UPDATE_USERS,
        USER_PERMISSION.SCHEDULE_HUDDLE,
        USER_PERMISSION.JOIN_HUDDLE,
        USER_PERMISSION.CANCELL_HUDDLE,
    ],
    [USER_ROLES.NORMAL_USER]: [
        USER_PERMISSION.READ_MESSAGE,
        USER_PERMISSION.WRITE_MESSAGE,
        USER_PERMISSION.JOIN_HUDDLE,
    ],
};

module.exports = userRolesToPermissionsMap;