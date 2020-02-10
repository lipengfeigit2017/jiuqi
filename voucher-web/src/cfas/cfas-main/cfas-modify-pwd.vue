<template>
    <Form :label-width="80" ref="modifyPwdForm" :model="modifyPwdForm" :rules="modifyPwdRule">
        <FormItem label="旧密码" prop="oldPwd">
            <iInput element-id="oldpwd" type="text" v-model="modifyPwdForm.oldPwd"
                placeholder="请填写旧密码"
                class="va-pwd"
                readonly
                @on-change="pwdType('#oldpwd',false)"
                @on-keypress ="pwdType('#oldpwd',true)"
                @on-keydown="pwdType('#oldpwd',true)"
            />
        </FormItem>
        <FormItem label="新密码" prop="newPwd">
            <Input element-id="newpwd" type="text" v-model="modifyPwdForm.newPwd"
                placeholder="请填写新密码"
                class="va-pwd"
                readonly
                @on-change="pwdType('#newpwd',false)"
                @on-keypress ="pwdType('#newpwd',true)"
                @on-keydown="pwdType('#newpwd',true)"
            />
        </FormItem>
        <FormItem label="确认密码" prop="secPwd">
            <Input element-id="secpwd" type="text" v-model="modifyPwdForm.secPwd"
                placeholder="请填写确认密码"
                class="va-pwd"
                readonly
                @on-change="pwdType('#secpwd',false)"
                @on-keypress ="pwdType('#secpwd',true)"
                @on-keydown="pwdType('#secpwd',true)"
            />
        </FormItem>
    </Form>
</template>

<script>
import $ from 'jquery'
export default {
    data () {
        return {
            modifyPwdForm: {
                oldPwd: '',
                newPwd: '',
                secPwd: ''
            },
            modifyPwdRule: {
                oldPwd: [{ required: true, message: '请填写旧密码' }],
                newPwd: [{ required: true, message: '请填写新密码' }],
                secPwd: [{
                    required: true,
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error('请填写确认密码'))
                        } else if (this.modifyPwdForm.newPwd !== value) {
                            callback(new Error('两次输入的密码不一致'))
                        }
                        callback()
                    }
                }]
            }
        }
    },
    methods: {
        handleModifyPwd () {
            return new Promise((resolve, reject) => {
                this.$refs.modifyPwdForm.validate(async (valid) => {
                    if (valid) {
                        const {oldPwd, newPwd} = this.modifyPwdForm
                        const {data: {code, msg}} = await this.$http.post('/api/vmclient/user/changePwd', {oldPwd, newPwd})
                        if (code === 0) {
                            this.$Message.success('密码修改成功')
                            resolve(true)
                        } else {
                            this.$Message.info(msg)
                            resolve(false)
                        }
                    } else {
                        resolve(false)
                    }
                })
            })
        },
        pwdType (obj, flag) {
            /* eslint-disable */
            // 屏蔽浏览器在记住密码后弹提示框问题
            if (flag) {
                $(obj).attr('type', 'password')
                $(obj).removeAttr('readonly')

                var _this = this
                setTimeout(function () {
                    _this.pwdType(obj, false)
                }, 500)
            } else {
                var pwd = $(obj).val()
                if (pwd && pwd.length > 0) {
                    $(obj).attr('type', 'password')
                    $(obj).removeAttr('readonly')
                } else {
                    $(obj).attr('type', 'text')
                    $(obj).attr('readonly', 'readonly')
                }
            }
        }
    }
}
</script>
