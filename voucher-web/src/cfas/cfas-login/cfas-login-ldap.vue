<!--登录-->
<template>
    <div class="cfas-login">
        <div class="cfas-login-card">
            <div class="cfas-login-left">
                <div class="cfas-login-logo"></div>
            </div>
            <div ref="userLoginDiv" class="cfas-login-right">
                <img src="../../assets/images/login/qrcode-login.png" style="position: absolute;right: 0;cursor: pointer;" @click="switchBox(1)"/>
                <div class="cfas-login-right-title">域账号登录</div>
                <Form ref="loginForm" :model="loginForm" :rules="loginRule" style="margin-top: 100px;">
                    <FormItem prop="username">
                        <i-input type="text" v-model="loginForm.username" placeholder="域账号" autofocus size="large"></i-input>
                    </FormItem>
                    <FormItem prop="pwd">
                        <i-input type="password" v-model="loginForm.pwd" placeholder="域密码" size="large" style="ime-mode:disabled"></i-input>
                    </FormItem>
                    <FormItem>
                        <Button long type="primary" @click="handleLogin" :loading="loading" style="height: 40px;border-radius: 4px;">登录</Button>
                    </FormItem>
                </Form>
                <Row>
                    <i-col span="24">
                        <Checkbox v-model="remenber" @on-change="remenberChange"
                            style="font-size: 12px;color: #888888;cursor: pointer;float:right;">记住我的登录</Checkbox>
                    </i-col>
                </Row>
                <div class="company-footer">北京久其软件股份有限公司</div>
            </div>
        </div>
    </div>
</template>

<script>
import 'animate.css'
import {SystemPageOptionApi} from '@/api/va'

export default {
    name: 'cfas-login-ldap',
    props: {
        tenant: String
    },
    data () {
        return {
            loginForm: {
                username: '',
                pwd: '',
                tenantName: ''
            },
            loginRule: {
                username: [{ required: true, message: '请输入域账号', trigger: 'blur' }],
                pwd: [{ required: true, message: '请输入域密码', trigger: 'blur' }]
            },
            loading: false,
            remenber: false
        }
    },
    mounted () {
        this.$el.addEventListener('keydown', this.handleEnterLogin)

        let key = window.location.href
        if (localStorage[key + 'useranme']) {
            this.loginForm.username = localStorage[key + 'useranme']
        }
        if (localStorage[key + 'tenantName']) {
            this.loginForm.tenantName = localStorage[key + 'tenantName']
        }
    },
    beforeDestroy () {
        this.$el.removeEventListener('keydown', this.handleEnterLogin)
    },
    methods: {
        remenberChange (val) {
            if (val) {
                sessionStorage.rememberMe = '1'
            } else {
                sessionStorage.rememberMe = '0'
            }
        },
        handleLogin () {
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    try {
                        this.loading = true
                        this.loginForm.tenantName = this.tenant
                        const {data: {code, msg, token, username}} = await this.$http.post('/api/cfasserver/anon/login/ldap/eip', this.loginForm)
                        if (code === 0) {
                            sessionStorage.token = token
                            sessionStorage.username = username

                            // const {data: userInfo} = await this.$http.post('/api/vmclient/user/get', {username})
                            // this.$store.commit('setTagNavList', [])
                            // this.$store.commit('setCurrUsername', userInfo.name || username)

                            let key = window.location.href
                            localStorage[key + 'useranme'] = this.loginForm.username
                            localStorage[key + 'tenantName'] = this.loginForm.tenantName

                            const {data: options} = await this.$http.post(SystemPageOptionApi.list, {groupName: 'systemPage'})
                            if (options) {
                                for (let item of options) {
                                    if (item.name === 'SYSPAGE0001') {
                                        sessionStorage.sys_page_opt = item.val
                                    }

                                    if (item.name === 'SYSPAGE0002') {
                                        sessionStorage.sys_page_size = item.val
                                    }
                                }
                            }

                            this.$router.push('/home')
                        } else {
                            this.loading = false
                            this.$Message.error(msg)
                        }
                    } catch (e) {
                        this.loading = false
                        this.$Message.error('登录失败：请求服务时发生异常')
                        throw new Error(e)
                    }
                }
            })
        },
        handleEnterLogin (e) {
            if (e.keyCode === 13) {
                this.handleLogin()
            }
        },
        animateCSS (element, animationName, callback) {
            const node = element
            node.classList.add('animated', animationName)
            function handleAnimationEnd () {
                node.classList.remove('animated', animationName)
                node.removeEventListener('animationend', handleAnimationEnd)
                if (typeof callback === 'function') callback()
            }
            node.addEventListener('animationend', handleAnimationEnd)
        },
        switchBox (val) {
            // const qrcodeLoginDom = this.$refs.qrcodeLoginDiv
            // const forgetPwdDom = this.$refs.forgetPwdDiv
            // if (val === 1) {
            //     qrcodeLoginDom.style.display = 'block'
            //     this.animateCSS(qrcodeLoginDom, 'slideInLeft')
            // } else if (val === 2) {
            //     this.animateCSS(qrcodeLoginDom, 'slideOutLeft', () => {
            //         qrcodeLoginDom.style.display = 'none'
            //     })
            // } else if (val === 3) {
            //     forgetPwdDom.style.display = 'block'
            //     this.animateCSS(forgetPwdDom, 'slideInUp')
            // } else if (val === 4) {
            //     this.animateCSS(forgetPwdDom, 'slideOutDown', () => {
            //         forgetPwdDom.style.display = 'none'
            //     })
            // }
        }
    }
}
</script>

<style scoped>
    .cfas-login{
        width: 100%;
        height: 100%;
        background:url("../../assets/images/login/bg2.jpg") center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .cfas-login-card {
        display: flex;
        position: relative;
        border-radius: 10px;
        width: 960px;
        background-color: #ffffff;
        overflow: hidden;
    }

    .cfas-login-left{
        display: flex;
        justify-content: center;
        width: 480px;
        height: 660px;
        background:url("../../assets/images/login/left.png") no-repeat #ffffff;
        border-radius: 10px 0 0 10px;
        z-index: 99;
    }

    .cfas-login-right{
        position: absolute;
        right: 0;
        width: 480px;
        height: 660px;
        background-color: #ffffff;
        border-radius: 10px 10px 10px 10px;
        padding: 0 5.6%;
    }
    .cfas-login-logo {
        background:url("../../assets/images/login/login-logo.png");
        width: 170px;
        height: 54px;
        margin-top: 7%;
        cursor: pointer;
    }

    .qrcode-border{
        background:url("../../assets/images/login/qrcode-box.png");
        height: 260px;
        width: 260px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 100px auto;
    }

    .company-footer{
        font-size: 12px;
        color: #888888;
        text-align: center;
        position: absolute;
        left:35%;
        bottom: 70px;
    }
    .cfas-login-right-title{
        font-size: 22px;
        color: #555555;
        margin-top: 80px;
    }
    .cfas-login-close{
        background:url("../../assets/images/login/close.png") no-repeat center;
        position: absolute;
        right: 0;
        cursor: pointer;
        width: 32px;
        height: 32px;
    }
</style>

<style scoped>
    .ivu-form-item{
        margin-bottom: 20px;
    }
</style>
