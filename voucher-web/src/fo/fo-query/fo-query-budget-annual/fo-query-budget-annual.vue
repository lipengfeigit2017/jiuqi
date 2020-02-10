<template>
    <FoQuery :queryConditions="queryConditions" :queryColumns="queryColumns" :apiPath="apiPath" :conditionParam="conditionParam"></FoQuery>
</template>

<script>
import FoQuery from '../fo-query.vue'
export default {
    name: 'FoQueryBudgetAnnual',
    data () {
        return {
            apiPath: 'api/cfasserver/cfasfo/querybase/' + this.type + '/queryBudBanance',
            conditionParam: {}
        }
    },
    props: {
        type: String
    },
    components: {
        FoQuery
    },
    computed: {
        queryConditions () {
            return this.type === 'unit' ? [
                {name: 'budyear', title: '预算年度：', type: 'YEAR', describe: '', filterFlag: true, conditionType: 'SINGLE'},
                {name: 'budcycle', title: '', type: 'NVARCHAR', describe: '', filterFlag: true, conditionType: 'SINGLE', hide: true, default: 'N'}
            ] : [
                {name: 'budyear', title: '预算年度：', type: 'YEAR', describe: '', filterFlag: true, conditionType: 'SINGLE'},
                {name: 'budcycle', title: '', type: 'NVARCHAR', describe: '', filterFlag: true, conditionType: 'SINGLE', hide: true, default: 'N'},
                this.type === 'project' ? {
                    name: 'prjcode', title: '项目：', type: 'BASEDATA', tbName: 'MD_PROJECT', describe: '', filterFlag: true
                } : {
                    name: 'deptcode', title: '部门：', type: 'BASEDATA', tbName: 'MD_DEPARTMENT', describe: '', filterFlag: true
                }
            ]
        },
        queryColumns () {
            return [
                {columnname: 'budsubjecttitle', columnTitle: '预算科目', columnType: 'BASEDATA', describe: '', align: 'left', fixed: 'left'},
                {columnname: 'budmoney', columnTitle: '预算金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'premoney', columnTitle: '预算占用金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'execmoney', columnTitle: '预算执行金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'usamoney', columnTitle: '预算可用金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'}
            ]
        }
    },
    methods: {
        async initConditionParam () {
            const conditionParam = {}
            var date = new Date()
            conditionParam.budyear = date.getFullYear() + ''
            let tableName = ''
            switch (this.type) {
                case 'dept':
                    tableName = 'MD_DEPARTMENT'
                    break
                case 'project':
                    tableName = 'MD_PROJECT'
                    break
                default:
                    tableName = ''
                    break
            }
            if (tableName) {
                const {data: {code, msg, loginUnit}} = await this.$http.get('api/vmclient/getLoginUnit')
                if (code === 0) {
                    const {data: {rows}} = await this.$http.post('/api/vmclient/baseData/list', {tableName: tableName, unitcode: loginUnit, stopflag: -1})
                    if (rows.length) {
                        conditionParam[this.type === 'dept' ? 'deptcode' : 'prjcode'] = rows[0].code
                    }
                } else {
                    throw new Error(`初始化组织机构查询条件失败：${msg}`)
                }
            }
            this.conditionParam = conditionParam
        }
    },
    mounted () {
        this.initConditionParam()
    }
}
</script>
