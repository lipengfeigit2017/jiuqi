<template>
    <FoQuery :queryConditions="queryConditions" :queryColumns="queryColumns" :apiPath="apiPath" :conditionParam="conditionParam" @checkCondition="checkCondition"></FoQuery>
</template>

<script>
import FoQuery from '../fo-query.vue'
export default {
    name: 'FoQueryExpenseDept',
    data () {
        return {
            apiPath: 'api/cfasserver/cfasfo/querybase/queryDeptExpense',
            conditionParam: {},
            queryConditions: [
                {name: 'budyear', title: '预算年度：', type: 'YEAR', describe: '', filterFlag: true, conditionType: 'SINGLE'},
                {name: 'unitcode', title: '组织机构：', type: 'BASEDATA', tbName: 'MD_ORG', describe: '', filterFlag: true},
                {name: 'depts', title: '部门：', type: 'BASEDATA', tbName: 'MD_DEPARTMENT', describe: '', filterFlag: true, conditionType: 'MULTI', filterParam: 'unitcode'}
            ],
            queryColumns: [
                {columnname: 'budsubjecttitle', columnTitle: '预算科目', columnType: 'STRING', describe: '', align: 'left', fixed: 'left', minwidth: 200},
                {columnname: 'expensekindtitle', columnTitle: '消费类型', columnType: 'STRING', describe: '', align: 'left', fixed: 'left', minwidth: 130},
                {columnname: 'month1', columnTitle: '1月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'month2', columnTitle: '2月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'month3', columnTitle: '3月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'month4', columnTitle: '4月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'month5', columnTitle: '5月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'month6', columnTitle: '6月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'month7', columnTitle: '7月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'month8', columnTitle: '8月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'month9', columnTitle: '9月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'month10', columnTitle: '10月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'month11', columnTitle: '11月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'month12', columnTitle: '12月', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'}
            ]
        }
    },
    components: {
        FoQuery
    },
    methods: {
        async initConditionParam () {
            const conditionParam = {}
            const date = new Date()
            conditionParam.budyear = date.getFullYear() + ''
            let {data: {code, msg, loginUnit}} = await this.$http.get('api/vmclient/getLoginUnit')
            if (code === 0) {
                conditionParam.unitcode = loginUnit
            } else {
                throw new Error(`初始化组织机构查询条件失败：${msg}`)
            }
            this.conditionParam = conditionParam
        },
        checkCondition (condition) {
            if (!condition.unitcode) {
                this.$Message.error('请选择组织机构')
            }
        }
    },
    mounted () {
        this.initConditionParam()
    }
}
</script>
