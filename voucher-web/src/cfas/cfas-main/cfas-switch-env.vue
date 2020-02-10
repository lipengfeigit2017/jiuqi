<template>
    <div>
        <Form :label-width="70">
            <FormItem label="登录日期">
                <DatePicker style="width: 100%" :clearable="false" :editable="false" :value="loginDate" @on-change="handleDatePickerChange"></DatePicker>
            </FormItem>
            <FormItem label="组织机构">
                <i-input icon="custom iconfont icon_yqyeqiangengduo-shouqi" readonly v-model="orgShowTitle"
                         @on-focus="orgShowTitle = currOrgObj.code"
                         @on-blur="orgShowTitle = currOrgObj.name"
                         @on-click="switchOrgModal = true"
                ></i-input>
            </FormItem>
        </Form>
        <Modal v-model="switchOrgModal" title="切换组织机构" :mask-closable="false" @on-ok="handleSwitchOrgConfirm">
            <cfas-switch-org v-if="switchOrgModal" ref="switchOrg" :loginUnit="loginUnit"></cfas-switch-org>
        </Modal>
    </div>
</template>

<script>
import {vaLoginApi} from '@/api/va'
import CfasSwitchOrg from './cfas-switch-org'

export default {
    name: 'cfas-switch-env',
    components: {CfasSwitchOrg},
    data () {
        return {
            loginDate: '',
            loginUnit: '',
            switchOrgModal: false,
            currOrgObj: {},
            orgShowTitle: ''
        }
    },
    async mounted () {
        const {data: {loginDate}} = await this.$http.get(vaLoginApi.getLoginDate, {})
        this.loginDate = loginDate
        const {data: {loginUnit}} = await this.$http.get(vaLoginApi.getLoginUnit, {})
        this.loginUnit = loginUnit
        if (loginUnit) {
            const {data: {rows: [orgInfo]}} = await this.$http.post('/api/vmclient/org/data/list', {code: loginUnit, categoryname: 'MD_ORG', versiontitle: '默认版本', stopflag: -1})
            /* eslint-disable no-unneeded-ternary */
            const {shortname = '无组织机构', name = '无组织机构'} = orgInfo ? orgInfo : {}
            this.currOrgObj = {code: loginUnit, name: shortname || name}
            this.orgShowTitle = shortname || name
        }
    },
    methods: {
        handleDatePickerChange (value) {
            this.loginDate = value
        },
        handleSwitchOrgConfirm () {
            const currOrgObj = this.$refs.switchOrg.$refs.orgTree.getCurrentNode()
            this.currOrgObj = currOrgObj
            this.orgShowTitle = currOrgObj.name
            this.loginUnit = currOrgObj.code
        },
        getEnv () {
            return {loginDate: this.loginDate, loginUnit: this.loginUnit}
        }
    }
}
</script>

<style>

</style>
