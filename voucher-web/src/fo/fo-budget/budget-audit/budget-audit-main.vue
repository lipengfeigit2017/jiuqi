<template>
<div style="height:100%; display:flex; flex-direction:column;">
    <buddim :dataLoadFlag="dataLoadFlag" :budtype="budtype" :buddim="buddim"/>
    <!-- class="va-exl-table" -->
    <elx-table ref="elxTable" :height="tbHeight" :edit-config="{prop: {children: 'children'}}" border row-key="budsubjectcode" :data.sync="tableData">
        <elx-table-column prop="budsubjectcode" label="科目编码" align="left" width="300px" min-width="200px" show-overflow-tooltip/>
        <elx-table-column prop="budsubjectname" label="科目名称" align="left" width="300px" min-width="200px" show-overflow-tooltip/>
        <elx-table-column prop="beginmoney" label="期初预算金额" :formatter="moneyFormatter" width="200px" align="right" min-width="60px" show-overflow-tooltip/>
        <elx-table-column prop="curtotalmoney" label="本期累计调整" :formatter="moneyFormatter" width="200px" align="right" min-width="60px" show-overflow-tooltip/>
        <elx-table-column prop="endmoney" label="期末预算金额" :formatter="moneyFormatter" width="200px" align="right" min-width="60px" show-overflow-tooltip/>
        <elx-table-column prop="memo" min-width="200px" show-overflow-tooltip label="备注" align="center"/>
    </elx-table>
</div>
</template>

<script>
import $ from 'jquery'
import Buddim from './budget-audit-buddim'
import XEUtils from 'xe-utils'
import {
    budgetApi
} from '../../../api/cfas'
import {
    // testData,
    field,
    biztype
} from './budget-audit-const'

export default {
    name: 'Budget',
    components: {
        Buddim
    },
    props: {
        todoData: Object
    },
    watch: {
        todoData (value) {
            if (value) {
                this.pageInit()
                this.dataLoadFlag = true
            }
        }
    },
    mounted () {
        // console.log('todoData:', this.todoData)

        this.winResize()

        let _this = this
        window.addEventListener('resize', function () {
            _this.winResize()
        })

        if (this.dataLoadFlag === false) {
            this.pageInit()
            this.dataLoadFlag = true
        }
    },
    data () {
        return {
            tbHeight: 0, // 表格高度
            dataLoadFlag: false,
            budtype: '', // 预算类型
            tableData: [], // 表格绑定的数据
            queryUrl: '', // 数据加载接口地址
            buddim: { // 预算维度
                budcycle: '', // 预算周期
                budyear: '', // 预算年度
                cycleitem: '', // 预算周期子项，当预算周期为年时，默认为1
                deptcode: null, // 部门
                prjcode: null, // 项目
                unitcode: '' // 组织机构
            }
        }
    },
    methods: {
        winResize () {
            this.$nextTick(() => {
                let winHeight = document.documentElement.clientHeight
                this.tbHeight = Number(winHeight) - 190
            })
        },
        // 根据路由参数rows， 初始化界面
        pageInit () {
            if (this.checkToDoData()) {
                this.initBuddim()
                this.loadTableData2()
            }
        },
        async loadTableData () {
            try {
                const {data: {rs, data}} = await this.$http.post(this.queryUrl, this.buddim)
                if (rs.code === 0) {
                    this.tableData = await XEUtils.toArrayTree(data, {
                        key: 'budsubjectcode',
                        parentKey: 'parentname'
                    })

                    this.$nextTick(() => {
                        $('.el-icon-arrow-right').click() // eslint-disable-next-line
                        this.$nextTick(() => {
                            if (this.$refs.elxTable) {
                                this.$refs.elxTable.doLayout()
                            }
                        })
                    })
                } else {
                    this.$Message.info(rs.msg)
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        loadTableData2 () {
            this.$http.post(this.queryUrl, this.buddim).then((res) => {
                const {data: {rs, data}} = res
                if (rs.code === 0) {
                    this.tableData = XEUtils.toArrayTree(data, {
                        key: 'budsubjectcode',
                        parentKey: 'parentname'
                    })
                    this.$nextTick(() => {
                        $('.el-icon-arrow-right').click() // eslint-disable-next-line
                        this.$nextTick(() => {
                            if (this.$refs.elxTable) {
                                this.$refs.elxTable.doLayout()
                            }
                        })
                    })
                } else {
                    this.$Message.info(rs.msg)
                }
            }).catch((err) => {
                throw new Error(err)
            })
        },
        initBuddim () {
            this.budtype = this.todoData[field.biztype].name
            let buddate = this.todoData[field.bizdate]
            let unitcode = this.todoData[field.unitcode]
            this.buddim.unitcode = typeof unitcode === 'string' ? unitcode : unitcode.name
            this.buddim.budyear = buddate.slice(0, 4)
            this.buddim.budcycle = buddate.charAt(4)
            this.buddim.cycleitem = Number.parseInt(buddate.substr(7, 2))
            this.queryUrl = budgetApi.input + '/list'
            if (this.budtype === biztype.department) {
                this.buddim.deptcode = this.todoData[field.bizcode].split('=')[1]
                this.buddim.tablename = biztype.department
            } else if (this.budtype === biztype.project) {
                this.buddim.prjcode = this.todoData[field.bizcode].split('=')[1]
                this.buddim.tablename = biztype.project
            } else if ((this.budtype === biztype.organization)) {
                this.buddim.tablename = biztype.organization
            }
        },
        checkToDoData () {
            if (!this.todoData) {
                return false
            }
            if (!this.todoData[field.biztype] || !this.todoData[field.bizdate] || !this.todoData[field.unitcode] || (!this.todoData[field.bizcode] && this.todoData[field.biztype !== biztype.organization])) {
                return false
            } else {
                return true
            }
        },

        moneyFormatter (row, column) {
            let property = column.property
            if (!row[property] || parseFloat(row[property]) === 0.00) {
                return ''
            }
            row[property] = parseFloat(row[property]).toFixed(2)
            let res = this.formatAmt(row[property])
            if (res === 'NaN') {
                row[property] = null
                return null
            }
            return res
        },
        formatAmt (amt) {
            if (amt.length <= 3) {
                return amt
            }

            if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(amt)) {
                return amt
            }
            var a = RegExp.$1
            var b = RegExp.$2
            var c = RegExp.$3
            var re = new RegExp()
            re.compile('(\\d)(\\d{3})(,|$)')
            while (re.test(b)) {
                b = b.replace(re, '$1,$2$3')
            }
            return a + '' + b + '' + c
        }
    }
}
</script>

<style scope>
/* .va-exl-table{
    overflow: auto;
    width: 100%;
    height: 100%;
    position: relative;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
} */

.va-budget .el-table__body-wrapper{
    overflow: auto;
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
}
/* height: calc(100%-40px) !important; */
</style>
