/**
 * Created by gospray on 16-12-21.
 */
const Err = require('../../config/error');

module.exports = function () {
    return function*(next) {
        // role ignore
        const ignores = Object.freeze([/^\/$/, /^\/app/, /\.(html|jpg|png|gif|ico|js|css|mp4|eot|svg|ttf|woff|mp3|json|woff2)$/i]);

        // 如果当前请求的接口url在ignores数组中，或者当前用户拥有改接口权限，则通过
        const some = ignores.some(item => item.test(this.request.url));

        const roles = this.session.roles || []

        // 用户的权限信息放在session中  this.session.roles
        // this.session.roles 用户权限数组  item为正则表达式
        const roleTest = roles.some(item => item.test(this.request.url));
        if (some || roleTest) {

            yield next;
        } else {
            this.body = {
                success: false,
                error: Err.E2001
            }
        }
    }
};