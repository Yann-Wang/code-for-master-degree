/**
 * Created by gospray on 16-12-20.
 */

const Err = require('../../config/error');

module.exports = function () {
    return function*(next) {
        // ignore
        const ignores = Object.freeze([/^\/$/, /\/test/, /\/user\/login$/, /\/config\/getConfig$/, /\.(html|jpg|png|gif|ico|js|css|mp4|eot|svg|ttf|woff|mp3|json|woff2)$/i]);

        // 如果当前请求的接口url在ignores数组中，或者当前用户已经存在session.user，则通过
        const some = ignores.some(item => item.test(this.request.url));

        if (some || this.session.user) {
            yield next;
        } else {
            this.body = {
                success: false,
                error: Err.E1003
            }
        }
    }
};