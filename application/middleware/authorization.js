/**
 * Created by gospray on 16-12-21.
 */
const Err = require('../../config/error');

module.exports = function () {
    return function*(next) {
        // role ignore
        const ignores = Object.freeze([/^\/$/, /\/test/, /\/user\/token$/, /\/user\/check$/, /\/user\/register$/, /\/user\/login$/, /\.(html|jpg|png|gif|ico|js|css|mp4|eot|svg|ttf|woff|mp3|json|woff2)$/i]);
        // 如果当前请求的接口url在ignores数组中，或者当前用户拥有改接口权限，则通过
        const some = ignores.some(item => item.test(this.request.url));

        let roles = this.session.roles || [];
        let url = this.request.url;
        let auth = /\/user\/auth$/.test(url);

        // roles: [no | user | auth | system | admin]
        function roleAuth() {
            let systemAuth = /\/back\/system/.test(url);
            let adminAuth = /\/back/.test(url);

            if(systemAuth){
                return roles.includes("system");
            }else if(adminAuth){
                return roles.includes("admin");
            } else{
                return roles.includes("auth");
            }

        }

        if (some || auth || roleAuth()) {

            yield next;
        } else {
            this.body = {
                success: false,
                error: Err.E2001
            }
        }
    }
};