<template>
    <div>
        <Drawer :title="title" width="75" class-name='fo-ref-loanbill-modal-drawer'  :mask-style='maskstyle' draggable v-model="isShowDrawer" @on-close="handleClose">
            <el-table ref="reftabledata" highlight-current-row border height="calc(100% - 65px)"
                :cell-style="handleCellStyle" :fit='true' :data="tableData" @cell-click="handleCellDbclick"
                @select-all="handleSelectAll" @select="handleSelect">
                <el-table-column type="selection" width="50" align="center" fixed></el-table-column>
                <el-table-column label="序号" fixed width="50" type="index" align="center">
                    <template v-slot="scope">{{ scope.$index + 1}}</template>
                </el-table-column>
                <el-table-column v-for="(item,index) in queryparam.queryFields" :key="index" :label="item.columnTitle"
                    :prop="item.columnName" :align="(item.columnType === 'NUMERIC' || item.columnName === 'unverifymoney') ? 'right' : 'left'"
                    :width="item.width" :fit='true'>
                    <template slot-scope="scope">
                        <span v-if="item.mappingType && (item.mappingType===1 || item.mappingType===4 || item.mappingType===2)">
                            {{scope.row.showTitleMap[item.columnName]}}
                        </span>
                        <span v-else-if="item.columnType === 'NUMERIC' || item.columnName === 'unverifymoney'">
                            {{numberFormat(scope.row[item.columnName])}}
                        </span>
                        <span v-else-if="item.columnType === 'DATE'">
                            {{dateFormat(scope.row[item.columnName])}}
                        </span>
                        <span v-else-if="item.columnType === 'TIMESTAMP'">
                            {{dateTimeFormat(scope.row[item.columnName])}}
                        </span>
                        <span v-else>
                            {{scope.row[item.columnName]}}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="fo-ref-loanbill-button">
                <Button style="margin-right: 10px" @click="handleClose">取消</Button>
                <Button type="primary" @click="handleConfirm">确定</Button>
            </div>
        </Drawer>
        <Modal fullscreen z-index='2001'  v-model="modal" title="单据" width="80">
            <template>
                <BillRoute v-if="modal" :defineCode="todoData.BIZTYPE" :billCode="todoData.BIZCODE" :verifyCode="todoData.verifyCode" :showToolBar="false"></BillRoute>
            </template>
        </Modal>
    </div>
</template>

<script>
import vaWeb from 'va-web'
import { BillRoute } from '@/components/va-bill'

export default {
    name: 'FoRefLoanBillModal',
    components: {BillRoute},
    props: {
        title: String,
        refdata: Object,
        state: Number,
        model: Object,
        items: Array,
        queryparam: Object
    },
    data () {
        return {
            isShowDrawer: true,
            maskstyle: {
                'z-index': 1950
            },
            tableData: [],
            selectDatas: [],
            modal: false,
            todoData: {}
        }
    },
    mounted () {
        // 初始化界面
        this.initPage()
    },
    methods: {
        // 初始化界面
        initPage () {
            // 加载引用数据
            this.loadRefData()
        },
        // 加载引用数据
        async loadRefData () {
            const loandimension = {}
            if (this.queryparam.loandimension && this.queryparam.loandimension.length > 0) {
                for (let i in this.queryparam.loandimension) {
                    if (!this.model.master[this.queryparam.loandimension[i]]) {
                        continue
                    }
                    if (typeof (this.model.master[this.queryparam.loandimension[i]]) === 'object') {
                        loandimension[this.queryparam.loandimension[i]] = this.model.master[this.queryparam.loandimension[i]].name
                    } else {
                        loandimension[this.queryparam.loandimension[i]] = this.model.master[this.queryparam.loandimension[i]]
                    }
                }
            }
            const { data: {rs, rows} } = await this.$http.post('/api/cfasserver/cfasfo/loan/list',
                {
                    billTypes: this.queryparam.billTypes,
                    loancondition: this.queryparam.loancondition,
                    loandimension: loandimension,
                    queryColumns: this.queryparam.queryFields,
                    billcode: this.model.master.BILLCODE,
                    unitcode: this.model.master.UNITCODE.name,
                    definecode: this.model.master.DEFINECODE
                })
            if (rs.code === 0) {
                this.tableData = rows
                // 设置已选数据勾选状态
                this.setCheckItems()
            }
        },
        // 格式化数值
        numberFormat (value) {
            return vaWeb.displayFormat.toThousands(vaWeb.displayFormat.strToFloat(value + '', 1, 2))
        },
        // 格式化日期
        dateFormat (value) {
            return vaWeb.displayFormat.format(value, 'yyyy-MM-dd')
        },
        // 格式化日期时间
        dateTimeFormat (value) {
            return vaWeb.displayFormat.format(value, 'yyyy-MM-dd hh:mm:ss')
        },
        setCheckItems () {
            if (!this.items || this.items.length <= 0) {
                return
            }
            this.$nextTick(() => {
                this.items.forEach(itemid => {
                    const selectedData = this.tableData.find(item => item.ID === itemid)
                    if (selectedData) {
                        this.$refs.reftabledata.toggleRowSelection(selectedData, true)
                        this.selectDatas.push(selectedData)
                    }
                })
            })
        },
        handleConfirm () {
            if (!this.selectDatas || this.selectDatas.length <= 0) {
                this.$Message.info('请至少选择一条记录')
                return
            }
            this.$emit('on-ok', this.selectDatas)
        },
        handleClose () {
            this.$emit('on-cancel')
        },
        handleSelect (selection, row) {
            this.selectDatas = selection
        },
        handleSelectAll (selection) {
            this.selectDatas = selection
        },
        // 获取单元格样式
        handleCellStyle ({column}) {
            if (column.property === 'BILLCODE') {
                return {color: '#03A4AD', cursor: 'pointer'}
            }
        },
        async handleCellDbclick (row, column, cell, event) {
            if (column.property === 'BILLCODE') {
                // 根据单据编号获取单据定义标识
                const param = {extInfo: {billCode: row.BILLCODE}}
                const {data: {code, msg, value, verifyCode}} = await this.$http.post('api/vbserver/billcode/ruler/uniquecode', param)
                if (code === 1) {
                    this.$Message.info(msg)
                } else {
                    // 打开单据界面
                    this.modal = true
                    this.todoData = {BIZTYPE: value, BIZCODE: row.BILLCODE, verifyCode: verifyCode}
                }
            }
        }
    }
}
</script>
<style>
.fo-ref-loanbill-modal-drawer{
    z-index: 2000!important;
}

</style>
<style lang="less" scoped>
    .fo-ref-loanbill-button {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>
