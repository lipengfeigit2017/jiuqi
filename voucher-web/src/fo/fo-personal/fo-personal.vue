<template>
    <div style="padding: 12px;height: 100%;">
        <Form :label-width="80" inline ref="queryEl">
            <FormItem label="单据日期">
                <DatePicker style="width:120px;" :value="condition.begindate" @on-change="val => handleDatePickerChange('begindate', val)" placeholder="单据日期起" />
                -
                <DatePicker style="width:120px;" :value="condition.enddate" @on-change="val => handleDatePickerChange('enddate', val)" placeholder="单据日期止" />
            </FormItem>
            <FormItem label="单据金额" v-if="isShowBillmoneyCondi">
                <va-input-number style="width:120px;" v-model="condition.minbillmoney" placeholder="单据金额起" @on-blur="val => handleInputChange('minbillmoney', val)"></va-input-number>
                -
                <va-input-number style="width:120px;" v-model="condition.maxbillmoney" placeholder="单据金额止" @on-blur="val => handleInputChange('maxbillmoney', val)"></va-input-number>
            </FormItem>
            <FormItem :label-width="20">
                <Button type="primary" ghost @click="handleQuery">查询</Button>
                <Button style="border: 0" @click="handleClear">清空</Button>
            </FormItem>
        </Form>
        <el-table border :data="tableData" :height="tableHeight" :cell-style="handleCellStyle" @cell-click="handleCellClick">
            <el-table-column type="index" align="center" width="50" label="序号" fixed>
                <template v-slot="scope">{{ limit * (pageIndex - 1) + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column v-for="(item,index) in tableCols" :key="index" :label="item.title" :prop="item.prop" :align="item.align" :width="item.width" :show-overflow-tooltip="true">
                <template v-slot="scope">{{ formatNumber(scope.row[item.prop])}}</template>
            </el-table-column>
        </el-table>
        <Page ref="pageEl" :total="total" show-sizer show-elevator show-total style="float: right;margin-top: 4px;" :page-size="limit" :current.sync="pageIndex" :page-size-opts="pageSizeOpts" @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange" />
        <Modal fullscreen v-model="modal" :title="modelTitle" footer-hide>
            <!--preview状态请求api自动添加define-->
            <!--<fo-bill v-if="modal" :defineCode="defineCode" :billCode="billCode" dataState="BROWSE" :showToolBar="showToolBar" preview></fo-bill>-->
            <fo-bill v-if="modal" :defineCode="defineCode" :billCode="billCode" data-state="BROWSE" :verifyCode="verifyCode"
                :showToolBar="showToolBar"></fo-bill>
        </Modal>
    </div>
</template>

<script>
import XEUtils from 'xe-utils'
import FoBill from '../fo-bill/fo-bill'
export default {
    name: 'fo-personal',
    components: {
        FoBill
    },
    props: {
        queryName: ''
    },
    data () {
        return {
            tableData: [],
            tableCols: [
                // {title: '单据类型', prop: 'definetitle'},
                // {title: '单据编号', prop: 'billcode'},
                // {title: '单据日期', prop: 'billdate'},
                // {title: '经办人', prop: 'stafftitle'},
                // {title: '单据金额', prop: 'billmoney', align: 'right'}
            ],
            total: 0,
            limit: 15,
            pageIndex: 1,
            offset: 0,
            modal: false,
            modelTitle: '单据',
            todoData: {},
            pageSizeOpts: [15, 30, 50, 100],
            condition: {},
            verifyCode: '',
            defineCode: '',
            billCode: '',
            showToolBar: false,
            tableHeight: 'calc(100% - 84px)'
        }
    },
    computed: {
        isShowBillmoneyCondi () {
            return this.queryName === 'tobe-submit' || this.queryName === 'agent-expense'
        }
    },
    created () {
        const sysPageOpt = sessionStorage.sys_page_opt
        const sysPageSize = sessionStorage.sys_page_size
        if (sysPageOpt && sysPageSize) {
            this.limit = Number(sysPageSize)
            this.pageSizeOpts = sysPageOpt.split(',').map(item => Number(item))
        }
    },
    async mounted () {
        window.addEventListener('resize', this.setTableHeight, false)
        let cols = []
        switch (this.queryName) {
            case 'tobe-submit':
                cols = [
                    {title: '单据类型', prop: 'definetitle'},
                    {title: '单据编号', prop: 'billcode'},
                    {title: '单据日期', prop: 'billdate'},
                    {title: '制单组织', prop: 'unitname'},
                    {title: '单据金额', prop: 'billmoney', align: 'right'},
                    {title: '紧急状态', prop: 'urgentstatename'},
                    {title: '备注', prop: 'memo'}
                ]
                this.tableCols = cols
                break
            case 'agent-expense':
                cols = [
                    {title: '单据类型', prop: 'definetitle'},
                    {title: '单据编号', prop: 'billcode'},
                    {title: '单据日期', prop: 'billdate'},
                    {title: '制单人', prop: 'createusername'},
                    {title: '制单组织', prop: 'unitname'},
                    {title: '金额', prop: 'billmoney', align: 'right'},
                    {title: '其中我的报销金额', prop: 'expensemoney', align: 'right'}
                ]
                this.tableCols = cols
                break
            case 'accounting':
                cols = [
                    {title: '单据类型', prop: 'definetitle'},
                    {title: '单据编号', prop: 'billcode'},
                    {title: '单据日期', prop: 'billdate'},
                    {title: '制单组织', prop: 'unitname'},
                    {title: '单据金额', prop: 'billmoney', align: 'right'},
                    {title: '紧急状态', prop: 'urgentstatename'},
                    {title: '备注', prop: 'memo'},
                    {title: '下一步审批人', prop: 'approvaluser'}
                ]
                this.tableCols = cols
                break
            case 'account-return':
                cols = [
                    {title: '单据类型', prop: 'definetitle'},
                    {title: '单据编号', prop: 'billcode'},
                    {title: '单据日期', prop: 'billdate'},
                    {title: '制单组织', prop: 'unitname'},
                    {title: '单据金额', prop: 'billmoney', align: 'right'},
                    {title: '紧急状态', prop: 'urgentstatename'},
                    {title: '备注', prop: 'memo'},
                    {title: '原因', prop: 'reason'}
                ]
                this.tableCols = cols
                const enddate = XEUtils.toDateString(new Date(), 'yyyy-MM-dd')
                const begindate = XEUtils.toDateString(XEUtils.getWhatMonth(new Date(), -3), 'yyyy-MM-dd')
                this.condition = {begindate, enddate}
                break
            default: break
        }
        this.getData()
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.setTableHeight, false)
    },
    activated () {
        this.setTableHeight()
    },
    methods: {
        setTableHeight () {
            const queryElHeight = this.$refs.queryEl.$el.clientHeight
            const pageElHeight = this.$refs.pageEl.$el.clientHeight
            this.tableHeight = `calc(100% - ${queryElHeight + pageElHeight}px)`
        },
        handleInputChange (filedName, val) {
            this.condition[filedName] = val.replace(new RegExp(',', 'g'), '')
        },
        handleDatePickerChange (fieldName, val) {
            this.condition[fieldName] = val
        },
        handleCellStyle ({column}) {
            if (column.property === 'billcode') {
                return {color: '#03A4AD', cursor: 'pointer'}
            }
        },
        handleCellClick (row, column) {
            if (column.property === 'billcode') {
                this.modelTitle = `${row.definetitle}-${row.billcode}`
                this.modal = true
                this.todoData = {BIZTYPE: row.definecode, BIZCODE: row.billcode}
                this.defineCode = row.definecode
                this.billCode = row.billcode
                this.verifyCode = row.verifyCode
                switch (this.queryName) {
                    case 'tobe-submit':
                        this.showToolBar = true
                        break
                    case 'agent-expense':
                        this.showToolBar = false
                        break
                    case 'accounting':
                        this.showToolBar = false
                        break
                    case 'account-return':
                        if (row.billstate === 0 || row.billstate === 33 || row.billstate === 129) {
                            this.showToolBar = true
                        } else {
                            this.showToolBar = false
                        }
                        break
                    default:
                        this.showToolBar = false
                        break
                }
            }
        },
        formatNumber (val) {
            if (typeof val === 'number') {
                return XEUtils.commafy(val, {fixed: 2})
            } else if (Array.isArray(val)) {
                return val.join('、')
            } else {
                return val
            }
        },
        handlePageChange (pageIndex) {
            this.pageIndex = pageIndex
            this.getData()
        },
        handlePageSizeChange (limit) {
            this.limit = limit
            if (this.pageIndex === 1) {
                this.getData()
            }
            this.pageIndex = 1
        },
        async getData () {
            let url = ''
            switch (this.queryName) {
                case 'tobe-submit':
                    url = '/api/cfasserver/cfasfo/portal/queryToBeSubmit'
                    break
                case 'agent-expense':
                    url = '/api/cfasserver/cfasfo/portal/queryProxyExpense'
                    break
                case 'accounting':
                    url = '/api/cfasserver/cfasfo/portal/queryReimbursing'
                    break
                case 'account-return':
                    url = '/api/cfasserver/cfasfo/portal/queryReimburseReturn'
                    break
                default: break
            }
            try {
                const {data} = await this.$http.post(url, {
                    pagination: true,
                    limit: this.limit,
                    offset: this.limit * (this.pageIndex - 1),
                    ...this.condition
                })
                if (data.rs.code === 0) {
                    this.tableData = data.rows
                    this.total = data.total
                } else {
                    throw new Error(data.rs.msg)
                }
            } catch (e) {
                this.$Message.error(`查询失败：${e.message}`)
                throw new Error(e)
            }
        },
        handleQuery () {
            this.pageIndex = 1
            const {begindate, enddate, minbillmoney, maxbillmoney} = this.condition
            if (begindate && enddate && begindate > enddate) {
                this.$Message.info('单据开始日期不能晚于单据结束日期')
                return
            }
            if (minbillmoney !== undefined && maxbillmoney !== undefined && minbillmoney > maxbillmoney) {
                // this.$Message.info('单据金额不能大于单据金额')
                // return
            }
            this.getData()
        },
        handleClear () {
            this.pageIndex = 1
            this.condition = {
                begindate: '',
                enddate: ''
            }
            // this.getData()
        }
    }
}
</script>

<style scoped>
    >>> .ivu-modal-fullscreen .ivu-modal-body{
        bottom: 0
    }
</style>
