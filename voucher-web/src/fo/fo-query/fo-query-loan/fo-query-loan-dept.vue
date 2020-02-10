<template>
    <FoQuery :queryConditions="queryConditions" :queryColumns="queryColumns" :apiPath="apiPath" :conditionParam="conditionParam" @checkCondition="checkCondition"></FoQuery>
</template>

<script>
import FoQuery from '../fo-query.vue'
export default {
    name: 'FoQueryLoanDept',
    data () {
        return {
            apiPath: 'api/cfasserver/cfasfo/querybase/queryDeptLoanBalance',
            conditionParam: {},
            queryConditions: [
                {name: 'enddate', title: '截止借款日期：', type: 'DATE', describe: '', filterFlag: true, conditionType: 'SINGLE'},
                {name: 'unitcode', title: '组织机构：', type: 'BASEDATA', tbName: 'MD_ORG', describe: '', filterFlag: true},
                {name: 'depts', title: '部门：', type: 'BASEDATA', tbName: 'MD_DEPARTMENT', describe: '', filterFlag: true, conditionType: 'MULTI', filterParam: 'unitcode'}
            ],
            queryColumns: [
                {columnname: 'depttitle', columnTitle: '部门', columnType: 'STRING', describe: '', align: 'left'},
                {columnname: 'stafftitle', columnTitle: '职员', columnType: 'STRING', describe: '', align: 'left'},
                {columnname: 'totalLoanMoney', columnTitle: '累计借款金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'totalWrittenOffMoney', columnTitle: '累计核销金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'loanBalanceMoney', columnTitle: '借款余额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'}
            ]
        }
    },
    components: {
        FoQuery
    },
    methods: {
        async getCurrUnit () {
            let {
                data: {
                    code,
                    msg,
                    loginUnit
                }
            } = await this.$http.get('api/vmclient/getLoginUnit')
            if (code === 0) {
                this.conditionParam = {}
                this.conditionParam.unitcode = loginUnit
                this.conditionParam.enddate = this.getNowFormatDate()
            } else {
                throw new Error(`初始化组织机构查询条件失败：${msg}`)
            }
        },
        getNowFormatDate () {
            var date = new Date()
            var seperator1 = '-'
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var strDate = date.getDate()
            if (month >= 1 && month <= 9) {
                month = '0' + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate
            return currentdate
        },
        checkCondition (condition) {
            if (!condition.unitcode) {
                this.$Message.error('请选择组织机构')
            }
        }
    },
    created () {
        this.getCurrUnit()
    }
}
</script>
