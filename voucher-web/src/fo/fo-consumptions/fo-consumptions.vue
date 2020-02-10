<template>
    <div style="height: 100%;">
        <va-toolbar>
            <va-toolbar-item @click="createBill" title="生成机票报销单"/>
        </va-toolbar>
        <div style="padding: 12px;height: 100%;">
            <Form :label-width="80">
                <Row>
                    <i-col span="6">
                        <Row>
                            <FormItem label="出行日期">
                                <i-col span="11">
                                    <DatePicker :value="condition.begindate" @on-change="val => handleDatePickerChange('begindate', val)" placeholder="出行日期起"/>
                                </i-col>
                                <i-col span="2" style="text-align: center">-</i-col>
                                <i-col span="11">
                                    <DatePicker :value="condition.enddate" @on-change="val => handleDatePickerChange('enddate', val)" placeholder="出行日期止"/>
                                </i-col>
                            </FormItem>
                        </Row>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="消费品种">
                            <Select placeholder="消费品种" clearable style="width: 100%" v-model="condition.traveltype">
                                <Option value="0">飞机</Option>
                                <Option value="1">火车</Option>
                                <Option value="2">酒店</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="到达城市">
                            <Input v-model="condition.endplace" placeholder="到达城市" clearable/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem :label-width="20">
                            <Button type="primary" ghost @click="handleQuery">查询</Button>
                            <Button style="border: 0" @click="handleClear">清空</Button>
                        </FormItem>
                    </i-col>
                </Row>
            </Form>
            <el-table border :data="tableData" height="calc(100% - 84px)" :cell-style="handleCellStyle" @cell-click="handleCellClick"
                @select-all="handleSelectAll" @select="handleSelect">
                <el-table-column type="selection" align="center" width="50" fixed></el-table-column>
                <el-table-column type="index" align="center" width="50" label="序号" fixed>
                    <template v-slot="scope">
                        {{ limit * (pageIndex - 1) + scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column v-for="(item,index) in tableCols" :key="index" :label="item.title" :prop="item.prop"
                                 :align="item.align" :width="item.width" :show-overflow-tooltip="true">
                    <template v-slot="scope">
                        {{ formatNumber(scope.row, item)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="60" align="left" fixed="right">
                    <template v-slot="scope">
                        <Button type="text" @click="handlePreview(scope.row)" style="padding-left: 0;">查看</Button>
                    </template>
                </el-table-column>
            </el-table>
            <!--<Page :total="total" show-sizer show-elevator show-total style="float: right;margin-top: 4px;"
                  :page-size="limit" :current.sync="pageIndex"
                  :page-size-opts="pageSizeOpts"
                  @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange"/>-->
            <Drawer v-model="modal" width="80" :title="modalTitle">
                <el-table border :data="previewTableData">
                    <el-table-column
                        v-for="(item,index) in previewTableCols" :key="index" :label="item.title" :prop="item.prop"
                        :align="item.align" :width="item.width" :show-overflow-tooltip="true">
                        <template v-slot="scope">
                            {{ formatNumber(scope.row, item)}}
                        </template>
                    </el-table-column>
                </el-table>
            </Drawer>
        </div>
    </div>
</template>

<script>
import XEUtils from 'xe-utils'

export default {
    name: 'fo-consumptions',
    props: {
        queryName: ''
    },
    data () {
        return {
            tableData: [],
            tableCols: [
                // {title: '预订人', prop: 'bookername'},
                {title: '出行人', prop: 'passengername', width: 100},
                {title: '费用部门', prop: 'costdept', width: 150},
                // {title: '费用承担单位', prop: 'costorg'},
                {title: '行程申请单号', prop: 'approvalnumber', width: 200},
                {title: '消费品种', prop: 'traveltype'},
                {title: '出发城市', prop: 'dcity'},
                {title: '到达城市', prop: 'acity'},
                {title: '出行/入住时间', prop: 'starttime', width: 150},
                {title: '到达/离店时间', prop: 'endtime', width: 150},
                {title: '支付金额', prop: 'paymentamount', type: 'money', align: 'right'},
                {title: '服务费', prop: 'servicefee', type: 'money', align: 'right'}
                // {title: '服务商', prop: 'agentname', width: 60}
            ],
            total: 0,
            limit: 15,
            pageIndex: 1,
            offset: 0,
            modal: false,
            modelTitle: '单据',
            todoData: {},
            modalTitle: '',
            previewTableData: [],
            previewTableCols: [],
            pageSizeOpts: [15, 30, 50, 100],
            condition: {},
            selection: [],
            templateId: 'ad3ba0c4-63d8-49f6-894c-88412bfced40'
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
        this.getData()
        this.$bus.$on('bill-new-complete', this.handleBillNewComplete)
    },
    beforeDestroy () {
        this.$bus.$off('bill-new-complete', this.handleBillNewComplete)
    },
    methods: {
        async handlePreview (row) {
            this.modal = true
            // this.previewTableData = [row]
            switch (row.traveltype) {
                case 0:
                    this.modalTitle = '机票信息'
                    this.previewTableCols = [
                        {title: '航班号', prop: 'flightnum'},
                        {title: '票号', prop: 'ticketnum', width: 150},
                        {title: '航空公司', prop: 'carriername'},
                        {title: '舱位等级', prop: 'aircraftcabin'},
                        {title: '出票日期', prop: 'printtickettime', width: 180},
                        {title: '机建费', prop: 'tkttax', align: 'right', type: 'money'},
                        {title: '燃油费', prop: 'fueltax', align: 'right', type: 'money'},
                        {title: '保险费', prop: 'insurancefee', align: 'right', type: 'money'},
                        {title: '改期费', prop: 'changefee', align: 'right', type: 'money'},
                        {title: '退票费', prop: 'outticketfee', align: 'right', type: 'money'},
                        {title: '票价合计金额', prop: 'amount', align: 'right', type: 'money'},
                        {title: '实付金额', prop: 'saleprice', align: 'right', type: 'money'}
                    ]
                    const {data: data1} = await this.$http.post('/api/cfasserver/btm/flight/list', {masterid: row.id})
                    this.previewTableData = data1
                    break
                case 1:
                    this.modalTitle = '火车信息'
                    this.previewTableCols = [
                        {title: '车次', prop: 'trainname'},
                        {title: '座位号', prop: 'seatno'},
                        {title: '坐席', prop: 'seattype'},
                        {title: '出发车站名', prop: 'stratstation'},
                        {title: '到达车站名', prop: 'deststation'},
                        {title: '车票票面价', prop: 'ticketprice', align: 'right', type: 'money'},
                        {title: '车票类型', prop: 'tickettype'},
                        {title: '退改签类型', prop: 'ordertype'},
                        {title: '改签状态', prop: 'changestatus'},
                        {title: '改签服务费', prop: 'changefee', align: 'right', type: 'money'},
                        {title: '退票状态', prop: 'refundstatues'},
                        {title: '退票费', prop: 'refundfee', align: 'right', type: 'money'},
                        {title: '实际票价', prop: 'realticketprice', align: 'right', type: 'money'}
                    ]
                    const {data: data2} = await this.$http.post('/api/cfasserver/btm/train/list', {masterid: row.id})
                    this.previewTableData = data2
                    break
                case 2:
                    this.modalTitle = '酒店信息'
                    this.previewTableCols = [
                        // {title: '订单号', prop: ''},
                        {title: '入住人', prop: 'clientname'},
                        // {title: '入住城市', prop: ''},
                        {title: '酒店地址', prop: 'address'},
                        {title: '酒店名称', prop: 'hoteldescription', width: 250},
                        {title: '酒店星级', prop: 'star'},
                        {title: '房型名称', prop: 'roomname'},
                        // {title: '入住时间', prop: ''},
                        // {title: '离店时间', prop: ''},
                        {title: '房间数', prop: 'roomquantity', align: 'right'}
                        // {title: '支付金额', prop: '', align: 'right', type: 'money'},
                        // {title: '实际订单金额', prop: '', align: 'right', type: 'money'}
                    ]
                    const {data: data3} = await this.$http.post('/api/cfasserver/btm/hotel/list', {masterid: row.id})
                    this.previewTableData = data3
                    break
                default: break
            }
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
            }
        },
        formatNumber (row, col) {
            if (col.type === 'money') {
                return XEUtils.commafy(row[col.prop], {fixed: 2})
            } else if (col.prop === 'traveltype') {
                switch (row[col.prop]) {
                    case 0: return '飞机'
                    case 1: return '火车'
                    case 2: return '酒店'
                }
            } else if (col.prop === 'serviceprovider') {
                return '携程'
            } else {
                return row[col.prop]
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
            const {data} = await this.$http.post('/api/cfasserver/btm/travel/list', {
                pagination: true,
                limit: this.limit,
                offset: this.limit * (this.pageIndex - 1),
                ...this.condition
            })
            this.tableData = data
            this.total = data.total
        },
        handleDatePickerChange (fieldName, val) {
            this.condition[fieldName] = val
        },
        handleQuery () {
            const {begindate, enddate} = this.condition
            if (begindate && enddate && begindate > enddate) {
                this.$Message.info('出行开始日期不能晚于出行结束日期')
                return
            }
            this.getData()
        },
        handleClear () {
            this.pageIndex = 1
            this.condition = {}
            this.getData()
        },
        handleSelectAll (selection) {
            this.selection = selection
        },
        handleSelect (selection) {
            this.selection = selection
        },
        async createBill () {
            if (!this.selection.length) {
                this.$Message.info('请至少选择一条数据')
                return
            }
            const {data: {data: [data]}} = await this.$http.post('/api/cfasserver/billref/template/query', {id: this.templateId})
            const config = JSON.parse(data.config)
            const billDefine = config.baseInfo.billDefine
            this.$router.push({path: `/bill/${billDefine}/null/NEW`})
        },
        async handleBillNewComplete (model) {
            const datas = this.selection.map(item => {
                return {ID: item.id}
            })
            const result = await model.api(`/api/cfasserver/bill/edit/${model.define.name}/${model.id}/patch`, {
                type: 'bill-ref',
                model: {
                    data: model.data,
                    state: model.state
                },
                params: {
                    templateId: this.templateId,
                    datas: datas,
                    type: 'billref-ref'
                }
            })
            model.data = result.data.data
        }
    }
}
</script>

<style scoped lang="less">
    .ivu-btn-text:focus {
        box-shadow: 0 0;
    }
    .ivu-btn-text:hover{
        background-color: transparent;
    }
</style>
