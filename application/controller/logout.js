/**
 * Created by gospray on 16-12-21.
 */

/**
 * 注销接口
 *
 * 1、清除session
 * 2、完成
 */
exports.handleLogout = function *(next) {
    // create session
    this.session = null;
    this.body = {
        success: true
    }
};