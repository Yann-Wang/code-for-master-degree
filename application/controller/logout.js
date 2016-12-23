/**
 * Created by gospray on 16-12-21.
 */

/**
 * 注销
 */
exports.handleLogout = function *(next) {
    // remove session
    this.session = null;
    this.body = {
        success: true
    }
};