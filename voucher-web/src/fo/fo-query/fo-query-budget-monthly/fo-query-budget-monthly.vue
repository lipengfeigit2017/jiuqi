<template>
    <FoQuery :queryConditions="queryConditions" :queryColumns="queryColumns" :apiPath="apiPath" :conditionParam="conditionParam"></FoQuery>
</template>

<script>
import FoQuery from '../fo-query.vue'
export default {
    name: 'FoQueryBudgetMonthly',
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
                {name: 'budcycle', title: '', type: 'NVARCHAR', describe: '', filterFlag: true, conditionType: 'SINGLE', hide: true, default: 'Y'}
            ] : [
                {name: 'budyear', title: '预算年度：', type: 'YEAR', describe: '', filterFlag: true, conditionType: 'SINGLE'},
                {name: 'budcycle', title: '', type: 'NVARCHAR', describe: '', filterFlag: true, conditionType: 'SINGLE', hide: true, default: 'Y'},
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
                    columnname: 'Y1',
                    columnTitle: '1月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y1')
                },
                {
                    columnname: 'Y2',
                    columnTitle: '2月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y2')
                },
                {
                    columnname: 'Y3',
                    columnTitle: '3月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y3')
                },
                {
                    columnname: 'Y4',
                    columnTitle: '4月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y4')
                },
                {
                    columnname: 'Y5',
                    columnTitle: '5月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y5')
                },
                {
                    columnname: 'Y6',
                    columnTitle: '6月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y6')
                },
                {
                    columnname: 'Y7',
                    columnTitle: '7月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y7')
                },
                {
                    columnname: 'Y8',
                    columnTitle: '8月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y8')
                },
                {
                    columnname: 'Y9',
                    columnTitle: '9月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y9')
                },
                {
                    columnname: 'Y10',
                    columnTitle: '10月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y10')
                },
                {
                    columnname: 'Y11',
                    columnTitle: '11月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y11')
                },
                {
                    columnname: 'Y12',
                    columnTitle: '12月',
                    columnType: '',
                    describe: '',
                    align: 'center',
                    children: this.queryChildColumns('Y12')
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
