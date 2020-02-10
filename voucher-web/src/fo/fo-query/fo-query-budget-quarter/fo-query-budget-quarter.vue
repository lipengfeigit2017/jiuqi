<template>
    <FoQuery :queryConditions="queryConditions" :queryColumns="queryColumns" :apiPath="apiPath" :conditionParam="conditionParam"></FoQuery>
</template>

<script>
import FoQuery from '../fo-query.vue'
export default {
    name: 'FoQueryBudgetDeptQuarter',
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
                {name: 'budcycle', title: '', type: 'NVARCHAR', describe: '', filterFlag: true, conditionType: 'SINGLE', hide: true, default: 'J'}
            ] : [
                {name: 'budyear', title: '预算年度：', type: 'YEAR', describe: '', filterFlag: true, conditionType: 'SINGLE'},
                {name: 'budcycle', title: '', type: 'NVARCHAR', describe: '', filterFlag: true, conditionType: 'SINGLE', hide: true, default: 'J'},
                this.type === 'project' ? {
                    name: 'prjcode', title: '项目：', type: 'BASEDATA', tbName: 'MD_PROJECT', describe: '', filterFlag: true
                } : {
                    name: 'deptcode', title: '部门：', type: 'BASEDATA', tbName: 'MD_DEPARTMENT', describe: '', filterFlag: true
                }
            ]
        },
        queryColumns () {
            return [
                {columnname: 'budsubjecttitle', columnTitle: '预算科目', columnType: 'BASEDATA', describe: '', fixed: 'left', minwidth: 200},
                {
                    columnname: 'J1',
                    columnTitle: '一季度',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('J1')
                },
                {
                    columnname: 'J2',
                    columnTitle: '二季度',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('J2')
                },
                {
                    columnname: 'J3',
                    columnTitle: '三季度',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('J3')
                },
                {
                    columnname: 'J4',
                    columnTitle: '四季度',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('J4')
                }
            ]
        }

    },
    methods: {
        queryChildColumns (parent) {
            return [
                {columnname: 'budmoney', columnkey: parent + '-budmoney', parentname: parent, columnTitle: '预算金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'premoney', columnkey: parent + '-premoney', parentname: parent, columnTitle: '占用金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'execmoney', columnkey: parent + '-execmoney', parentname: parent, columnTitle: '执行金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'usamoney', columnkey: parent + '-usamoney', parentname: parent, columnTitle: '可用金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'}]
        },
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
                    const {data: {rows}} = await this.$http.post('/api/vmclient/baseData/list', {tablename: tableName, unitcode: loginUnit, stopflag: -1})
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
