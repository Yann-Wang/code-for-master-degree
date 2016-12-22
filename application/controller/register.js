/**
 * Created by gospray on 16-12-21.
 */
/**
 * 注册用户
 */
exports.handleRegister = function *(next) {
    let user = {
        account: 'admin',
        nickname: 'admin_system',
        password: 'D033E22AE348AEB5660FC2140AEC35850C4DA997',
        remark: '',
        email: ''
    }
    const result = yield UserSchema.addAccount(user);

    if (result.type === 'error') {
        this.body = {
            success: false,
            error: {
                code: Err.E1004.code,
                text: result.err.toString()
            }
        };
        return false
    }

    this.body = {success: true}
};