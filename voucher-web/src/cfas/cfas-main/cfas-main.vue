<style scoped>
    .layout{
        background: #f5f7f9;
        position: relative;
        overflow: hidden;
        height:100%;
    }
</style>
<template>
    <div class="layout">
        <!-- yanjunli -->
        <Layout style="height:100%">
            <Header id="header" class="cfas-main-header">
                <a style="float: left;height: 56px;padding-left: 20px;display:flex;align-items: center;cursor: pointer;" @click="handleToHome">
                    <img src="../../assets/images/logo.png">
                </a>
                <div style="color: #fff;float: right;padding-right: 14px;height: 56px;">
                    <Select prefix="ios-search" ref="menuSearch" placeholder="输入关键词搜索" filterable clearable @on-change="handleSearchChange" style="border-radius:4px;display: inline-block;width:228px;margin: 0 20px 0 0">
                        <Option v-for="item in menuArray" v-if="item.url" :key="item.id" :value="item.id">{{item.title}}</Option>
                    </Select>
                    <cfas-date-picker style="margin: 0 20px 0 0;"></cfas-date-picker>
                    <a style="margin: 0 20px 0 0;" @click="handleToHome">
                        <svg class="icon" aria-hidden="true" style="opacity: 0.6;font-size: 18px;">
                            <use xlink:href="#icon_topshouye"></use>
                        </svg>
                    </a>
                    <CfasMessage />
                    <Avatar icon="ios-person" />
                    <Dropdown @on-click="handleRightTopMenu">
                            <div style="display: inline-block;line-height: 20px;vertical-align: middle;">
                                <div style="font-size: 14px;font-weight:400;color: #FFFFFF;">{{username}}</div>
                                <div style="font-size: 12px;font-weight:400;">{{loginUnit}}</div>
                            </div>
                        <!--<Icon type="ios-arrow-down"></Icon>-->
                        <svg class="icon" aria-hidden="true" style="transform: rotate(180deg);font-size: 16px;">
                            <use xlink:href="#icon_topxialashang"></use>
                        </svg>
                        <DropdownMenu slot="list" style="min-width: 110px;">
                            <!--<DropdownItem><span class="iconfont icon_ggerenxinxi" style="padding-right: 6px;"></span>个人信息</DropdownItem>-->
                            <DropdownItem name="switchOrg"><span class="iconfont icon_shu-biao" style="padding-right: 6px;"></span>工作空间</DropdownItem>
                            <DropdownItem name="modifyPwd"><span class="iconfont icon_gxiugaimima" style="padding-right: 6px;"></span>修改密码</DropdownItem>
                            <DropdownItem divided name="logout"><span class="iconfont icon_gzhuxiao" style="padding-right: 6px;"></span>退出登录</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <Modal v-model="switchOrgModal" title="工作空间" :mask-closable="false" @on-ok="handleSwitchEnv" >
                    <cfas-switch-env ref="switchEnv" v-if="switchOrgModal"></cfas-switch-env>
                </Modal>
                <Modal class-name="vertical-center-modal" title="修改密码" v-model="modifyPwdModal" :mask-closable="false"
                    @on-ok="handleModifyPwd" :loading="modifyPwdLoading">
                    <cfas-modify-pwd v-if="modifyPwdModal" ref="modifyPwdForm"></cfas-modify-pwd>
                </Modal>
                <Drawer title="消息中心" width="30" draggable v-model="isShowMessage">
                    <p>暂无消息</p>
                </Drawer>
                <div v-if="modal" class="ivu-modal-mask" style="background-color: transparent"></div>
            </Header>
            <!-- yanjunli -->
            <Layout style="overflow:hidden;height: calc(100% - 50px)">
                <Sider :class="{slider:!isCollapse,'slider-collapse':isCollapse}" style="box-shadow: 2px 0px 6px 0px rgba(14,107,112,0.08);z-index: 999;">
                    <el-menu ref="sidebar" :collapse="isCollapse" style="height: 100%;" class="cfas-menu">
                        <el-menu-item index="0" style="min-width: unset;height: 30px;line-height: 30px;border-bottom: 1px solid rgba(232,232,232,1);padding-left: 24px;" @click="handleCollapseMenu">
                            <span v-if="!isCollapse" style="color:#888888">菜单</span>
                            <!--<Icon type="md-arrow-round-back" @click="test" class="el-submenu__icon-arrow" style="transform: rotate(0deg);"/>-->
                            <i :class="[isCollapse ? 'cfas-menu-collapse' : 'cfas-menu-expand', 'iconfont icon_CDshouqi']"></i>
                        </el-menu-item>
                        <el-submenu v-for="firMenu in menus" :index="firMenu.name" :key="firMenu.name"
                                    @mouseenter.native="menuItemMouseEnter" :disabled="submenuDisabled"
                                    @mouseleave.native="menuItemMouseLeave">
                            <template slot="title">
                                <i v-if="firMenu.icon" :class="'iconfont ' + firMenu.icon" style="color: #989898;margin-right: 5px;text-align: center;width:24px;display:inline-block;"></i>
                                <i v-else class="el-icon-location" style="color: #989898;margin-right: 5px;"></i>
                                <span slot="title" style="color: #222222;">{{firMenu.title}}</span>
                            </template>
                            <template v-if="firMenu.children.length">
                                <el-menu-item-group v-for="secMenu in getCalSecMenus(firMenu)" :key="secMenu.name" style="padding: 20px 0;" @mouseenter.native="secMenuItemMouseEnter">
                                    <span slot="title" style="color:#222222;font-size: 14px;font-weight:bold;font-family: SourceHanSansCN-Medium;line-height: 20px;">
                                        {{secMenu.title}}
                                        <span style="width:28px;height:2px;background:#888888;display: block"></span>
                                    </span>
                                    <template v-if="secMenu.children.length">
                                        <el-menu-item @click="handleMenuItemSelect(thrMenu,$event)" :index="thrMenu.url ? thrMenu.url : thrMenu.name" v-for="thrMenu in secMenu.children" :key="thrMenu.name">
                                            <span class="el-menu-item-circle" style="border:1px solid #4BC0C6;height:6px;width:6px;border-radius: 100%;display: inline-block;margin: 4px;"></span>
                                            {{thrMenu.title}}
                                        </el-menu-item>
                                    </template>
                                    <!--没有三级菜单，将二级菜单拼接到三级菜单上-->
                                    <template v-else>
                                        <el-menu-item @click="handleMenuItemSelect(secMenu,$event)" :index="secMenu.url ? secMenu.url : secMenu.name">
                                            <span class="el-menu-item-circle" style="border:1px solid #4BC0C6;height:6px;width:6px;border-radius: 100%;display: inline-block;margin: 4px;"></span>{{secMenu.title}}
                                        </el-menu-item>
                                    </template>
                                </el-menu-item-group>
                            </template>
                            <!--没有二三级菜单，将一级菜单拼接到二三级菜单-->
                            <template v-else>
                                <el-menu-item-group style="padding: 20px 0;">
                                    <span slot="title" style="color:#222222;font-size: 14px;font-weight:bold;font-family: SourceHanSansCN-Medium;line-height: 20px;">
                                        {{firMenu.title}}
                                        <span style="width:28px;height:2px;background:#888888;display: block"></span>
                                    </span>
                                    <el-menu-item @click="handleMenuItemSelect(firMenu,$event)" :index="firMenu.url ? firMenu.url : firMenu.name">
                                        <span class="el-menu-item-circle" style="border:1px solid #4BC0C6;height:6px;width:6px;border-radius: 100%;display: inline-block;margin: 4px;"></span>{{firMenu.title}}
                                    </el-menu-item>
                                </el-menu-item-group>
                            </template>
                        </el-submenu>
                    </el-menu>
                </Sider>
                <!-- yanjunli -->
                <Layout style="height:100%;background:#fff;">
                    <router-tab ref="routerTab" :tabs="tabs" alive-id="fullPath" />
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import CfasMessage from './cfas-message'
import CfasSwitchEnv from './cfas-switch-env'
import CfasDatePicker from './cfas-date-picker'
import CfasModifyPwd from './cfas-modify-pwd'
import {vaLoginApi} from '@/api/va'

export default {
    name: 'cfas-main',
    components: {CfasMessage, CfasSwitchEnv, CfasModifyPwd, CfasDatePicker},
    data () {
        return {
            tabs: [{to: '/home', closable: false}],
            menuArray: [],
            menus: [],
            modifyPwdModal: false,
            modifyPwdLoading: true,
            isCollapse: false,
            loginUnit: '',
            isShowMessage: false,
            username: '',
            switchOrgModal: false,
            id_of_settimeout: '',
            id_of_settimeout_closemenu: '',
            refreshToken: null,
            submenuDisabled: true,
            modal: false
        }
    },
    async mounted () {
        let {data} = await this.$http.post('/api/vmclient/menu/my', {})
        data = data.filter(item => item.biztype !== 2)
        this.menuArray = data
        sessionStorage.menus = JSON.stringify(data)

        const menus = this.createMenus(data)
        this.menus = menus

        if (sessionStorage.username) {
            const {data: userInfo} = await this.$http.post('/api/vmclient/user/get', {username: sessionStorage.username})
            this.username = userInfo.name || sessionStorage.username
        }

        const {data: {loginUnit}} = await this.$http.get(`/api/vmclient/getLoginUnit?t=${new Date().getTime()}`, {})
        if (loginUnit) {
            const {data: {rows: [orgInfo]}} = await this.$http.post('/api/vmclient/org/data/list', {code: loginUnit, categoryname: 'MD_ORG', versiontitle: '默认版本', stopflag: -1})
            /* eslint-disable no-unneeded-ternary */
            const {shortname = '无组织机构', name = '无组织机构'} = orgInfo ? orgInfo : {}
            this.loginUnit = shortname || name
        } else {
            this.loginUnit = '无组织机构'
        }

        let rememberMe = sessionStorage.rememberMe
        if (rememberMe && rememberMe === '1') {
            this.refreshToken = setInterval(async () => {
                // 间隔60s刷新token防止登录超时
                await this.$http.post('/api/vmclient/checkLogin', {})
            }, 60000)
        }
    },
    created () {
        window.reload = function () {
            location.href = '/'
        }
    },
    methods: {
        /**
         * 获取计算后的二级菜单
         * 二级菜单为末级时，追加相同的一级菜单为二级菜单，合并到二级菜单下显示
         * @param firstMenu 一级菜单
         * @returns {Array} 计算后的二级菜单
         */
        getCalSecMenus (firstMenu) {
            const newSecMenu = []
            for (const secMenu of firstMenu.children) {
                if (!secMenu.children.length) {
                    const index = newSecMenu.findIndex(item => item.id === firstMenu.id)
                    if (index === -1) {
                        const secMenuLeaf = firstMenu.children.filter(item => item.children.length === 0)
                        const newFirstMenu = Object.assign({}, firstMenu)
                        newFirstMenu.children = secMenuLeaf
                        newSecMenu.push(newFirstMenu)
                    }
                } else {
                    newSecMenu.push(secMenu)
                }
            }
            return newSecMenu
        },
        handleSearchChange (id) {
            const searchMenu = this.menuArray.find(item => item.id === id)
            if (searchMenu) {
                this.handleMenuItemSelect(searchMenu)
                this.$refs.menuSearch.clearSingleSelect()
            }
        },
        handleMenuItemSelect (menu, e) {
            // 第三方地址
            if (menu.urltype && menu.urltype === 1) {
                this.$routerTab.getObj().openIframeTab(menu.url, menu.title, 'ivu-tag-dot-inner')
                return
            }

            // 后端地址
            let route = this.$router.match(menu.url)
            if (route.meta.iframe && route.meta.iframe.type === 'inner') {
                this.$routerTab.getObj().openIframeTab(route.meta.iframe.src, menu.title, 'ivu-tag-dot-inner')
                return
            }
            this.modal = true
            // 前端地址
            this.$router.push(menu.url)
            if (e) {
                e.$el.parentElement.parentElement.parentElement.style.display = 'none'
            }
            setTimeout(() => {
                this.modal = false
            }, 500)
        },
        handleCollapseMenu () {
            this.isCollapse = !this.isCollapse
            this.submenuDisabled = !this.submenuDisabled
        },
        menuItemMouseEnter (e) {
            if (!this.isCollapse) {
                this.id_of_settimeout = setTimeout(() => {
                    e.target.children[1].style.display = 'block'
                    // e.target.children[1].style.backgroundColor='#1b2035'
                    e.target.children[1].style.position = 'absolute'
                    // e.target.children[1].style.top='114px'
                    e.target.children[1].style.top = e.target.offsetTop + 'px'
                    e.target.children[1].style.left = '179px'
                    e.target.children[1].style.zIndex = 9999999
                }, 500)
            }
        },
        menuItemMouseLeave (e) {
            if (!this.isCollapse) {
                clearTimeout(this.id_of_settimeout)
                this.id_of_settimeout_closemenu = setTimeout(() => {
                    e.target.children[1].style.display = 'none'
                }, 500)
                e.target.children[1].settimeoutid = this.id_of_settimeout_closemenu
            }
        },
        secMenuItemMouseEnter (e) {
            clearTimeout(e.target.parentNode.settimeoutid)
        },
        createMenus (array) {
            const result = []
            const treeMap = {}
            let treeData = {}
            const ids = array.map(item => item.name)
            for (const ary of array) {
                treeData = ary
                treeMap[ary.name] = treeMap[ary.name] || []
                treeMap[ary.parentname] = treeMap[ary.parentname] || []
                treeMap[ary.parentname].push(treeData)
                treeData[ary.name] = ary.name
                treeData[ary.parentname] = ary.parentname
                treeData.children = treeMap[ary.name]
                if (ids.indexOf(ary.parentname) === -1) {
                    result.push(treeData)
                }
            }
            return result
        },
        handleRightTopMenu (name) {
            switch (name) {
                case 'logout':
                    this.handleLogout()
                    break
                case 'modifyPwd':
                    this.modifyPwdModal = true
                    break
                case 'switchOrg':
                    this.switchOrgModal = true
                    break
                default:
                    break
            }
        },
        handleLogout () {
            this.$Modal.confirm({
                title: '提示信息',
                content: '确认退出系统？',
                onOk: async () => {
                    try {
                        const {data: {code, msg}} = await this.$http.get(vaLoginApi.logout)
                        if (code === 0) {
                            sessionStorage.removeItem('username')
                            sessionStorage.removeItem('token')
                            sessionStorage.removeItem('menus')
                            sessionStorage.removeItem('markTab')

                            if (this.refreshToken != null) {
                                clearInterval(this.refreshToken)
                            }

                            this.$routerTab.getObj().removeAllAlive()
                            this.$router.push('/')
                        } else {
                            throw new Error(msg)
                        }
                    } catch (e) {
                        throw new Error(e)
                    }
                }
            })
        },
        async handleModifyPwd () {
            const flag = await this.$refs.modifyPwdForm.handleModifyPwd()
            if (flag) {
                this.modifyPwdModal = false
            } else {
                this.modifyPwdLoading = false
                this.$nextTick(() => {
                    this.modifyPwdLoading = true
                })
            }
        },
        async handleSwitchEnv () {
            try {
                const {loginDate, loginUnit} = this.$refs.switchEnv.getEnv()
                const {data: switchDateRs} = await this.$http.post(vaLoginApi.changeLoginDate, {loginDate})
                if (switchDateRs.code !== 0) {
                    this.$Message.error(`切换登录日期失败：${switchDateRs.msg}`)
                }
                const {data: switchOrgRs} = await this.$http.post(vaLoginApi.changeLoginUnit, {unitcode: loginUnit})
                if (switchDateRs.code !== 0) {
                    this.$Message.error(`切换组织机构失败：${switchOrgRs.msg}`)
                }
                this.$router.go(0)
            } catch (e) {
                this.$Message.error(`切换环境变量失败：${e.message}`)
                throw new Error(e)
            }
        },
        handleToHome () {
            this.$router.push('/home')
        }
    }
}
</script>

<style scoped lang="less">
    .cfas-menu-expand{
        position: absolute;
        top: 25%;
        right: 20px;
        margin-top: -7px;
        transition: transform .3s
    }

    .cfas-menu-collapse{
        transform:rotate(180deg);
        position: absolute;
        top: 25%;
        margin-top: -7px;
        transition: transform .3s
    }

    #header{
        & /deep/ .ivu-select-selection {
            background: rgba(255, 255, 255, 0.08);
            border: 0;
        }
        & /deep/ .ivu-select-prefix {
            color: #fff;
            opacity: 0.3;
        }

        & /deep/ .ivu-select-input {
            color: #fff;
            opacity: 0.3;
        }
    }

    .cfas-menu {
        & /deep/ .el-menu-item {
            height: 36px;
            line-height: 36px;
            padding: 0;
            min-width: 150px;
            color: #555555;
            font-size: 14px;
        }

        & /deep/ .el-menu-item:focus, .el-menu-item:hover {
            background-color: #ffffff;
            color: #03A4AD;
        }
    }
</style>
<style scoped>
    >>> .el-submenu.is-disabled .el-submenu__title{
        cursor: pointer;
        opacity: 1;
    }
    >>> .el-submenu.is-disabled .el-menu-item{
        cursor: pointer;
        opacity: 1;
    }
</style>
<style lang="less">
    .slider {
        background: #FFF;
        width: 180px !important;
        min-width: 180px !important;
        max-width: 180px !important;
        flex:0 0 180px !important;
    }

    .slider-collapse {
        background: #FFF;
        width: 64px !important;
        min-width: 64px !important;
        max-width: 64px !important;
        flex:0 0 64px !important;
    }

    .el-submenu__title:hover {
        color: #03A4AD;
        background-color: #fff;
        border-left: 3px solid #0E6B70
    }

    .el-menu--inline {
        box-shadow:0px 0px 6px 0px rgba(14,107,112,0.4);
        border-radius:0px 5px 5px 0px;
        padding-right: 20px;
    }

    .el-submenu {
        height: 45px;
        font-size:14px;
        font-weight:400;
        color:rgba(34,34,34,1);
        line-height:20px;
    }

    .el-submenu__title {
        height: 45px;
        line-height: 45px;
    }

    .el-menu-item-group{
        display: table-cell;
    }
    .el-submenu__icon-arrow {
        transform:rotate(-90deg)
    }

    .el-menu--collapse>.el-menu-item [class^=ivu-icon-], .el-menu--collapse>.el-submenu>.el-submenu__title [class^=ivu-icon-] {
        margin: 0;
        vertical-align: middle;
        width: 24px;
        text-align: center;
    }

    .tag-nav-wrapper {
        padding: 0;
        height: 30px;
        background: #f0f0f0;
    }

    #header {
        background-color: #0E6B70;
        height: 56px;
        padding: 0;
        line-height: 56px;
    }

    .router-tab-container {
        height: calc(100vh - 40px);
        overflow: hidden;
    }

    .router-tab {
        height: calc(100vh - 40px);
    }

    .router-tab-item.actived[title='首页']{
        background-color: #f5f7f9;
    }

    .el-menu-item-group>ul {
        /*width: 150px;*/
    }

    .el-menu-item, .el-submenu__title {
        height: 36px;
        line-height: 36px;
    }

    .el-menu-item:hover > .el-menu-item-circle{
        background-color:#4BC0C6;
    }

    .cfas-menu {
        .el-menu-item.is-active {
            color: #03A4AD;
            .el-menu-item-circle{
                background: #03A4AD;
            }
        }
    }
</style>
