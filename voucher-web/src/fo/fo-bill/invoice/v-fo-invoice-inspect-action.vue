<template>
    <div>
        <Button v-if="isShow" :disabled="!readonly" type="primary" ghost @click.stop="handleOpenDrawer">{{title}}</Button>
        <Drawer :title="title" width="75" draggable v-model="isShowDrawer">
            <el-table border :data="tableData" height="calc(100% - 46px)">
                <el-table-column label="序号" fixed width="50" type="index" align="center"></el-table-column>
                <template v-for="(item,index) in tableCols">
                    <el-table-column v-if="item.prop === 'State'" :key="index" :label="item.title" :prop="item.prop" header-align="left" :align="item.align">
                        <template slot-scope="scope">
                            {{scope.row[item.prop] === 1 ? '正常' : scope.row[item.prop] === 2 ? '作废' : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column v-else :key="index" :label="item.title" :prop="item.prop" header-align="left" :align="item.align" :width="item.width"></el-table-column>
                </template>
            </el-table>
            <div class="v-fo-invoice-inspect-footer">
                <Button type="primary" @click="handleCloseDrawer">关闭</Button>
            </div>
        </Drawer>
    </div>
</template>
<script>
export default {
    name: 'v-fo-invoice-inspect-action',
    props: {
        model: Object,
        template: Object
    },
    data () {
        return {
            isShow: true,
            isShowDrawer: false,
            tableCols: [
                {title: '发票状态', prop: 'State'},
                {title: '验证结果', prop: 'Message'},
                {title: '发票代码', prop: 'InvoiceCode', width: 150},
                {title: '发票号码', prop: 'InvoiceNumber'},
                {title: '开票日期', prop: 'BillingDate', width: 100},
                {title: '金额', align: 'right', prop: 'TotalAmount'},
                {title: '税额', align: 'right', prop: 'TotalTax'},
                {title: '销方名称', prop: 'SalesName', width: 200},
                {title: '销方税号', prop: 'SalesTaxNo', width: 200},
                {title: '校验码', prop: 'CheckCode', width: 200}
            ],
            tableData: []
        }
    },
    computed: {
        title () {
            return this.template.title
        },
        readonly () {
            return this.model.isReadonly(this.template)
            // const billState = this.model.getValue(this.unitcodeConfig.tableName, 'BILLSTATE')
            // return !this.model.view.showToolBar // && (billState === 8 || billState === 24)
        },
        showTabs () {
            return this.template.showTabs ? this.template.showTabs : []
        },
        unitcodeConfig () {
            return this.template.unitcodeConfig
        },
        mappingTable () {
            return this.template.mappingTable
        },
        mappingField () {
            return this.template.mappingField
        }
    },
    mounted () {
        this.model.addEventBus('v-tabs-change', this.handleTabsChange)
    },
    beforeDestroy () {
        this.model.removeEventBus('v-tabs-change', this.handleTabsChange)
    },
    methods: {
        async handleOpenDrawer () {
            const {mappingTable, unitcodeConfig} = this
            const {name: unitcode} = this.model.data[unitcodeConfig.tableName][0][unitcodeConfig.fieldName]
            if (!unitcode) {
                this.$Message.info('组织机构不能为空')
                return
            }
            const detailTables = this.model.data[mappingTable]
            const request = []
            for (const item of detailTables) {
                const params = {}
                for (const field of this.mappingField) {
                    if (field.fieldName) {
                        params[field.intfField] = item[field.fieldName]
                    }
                }
                request.push(params)
            }
            if (request.length === 0) {
                this.$Message.info('无可查验的发票')
                return
            }
            this.isShowDrawer = true
            try {
                const {data} = await this.$http.post(`/api/cfasserver/cfasfo/action/${unitcode}/InvoiceInspection`, request)
                this.tableData = data
            } catch (e) {
                this.$Message.error('发票查验失败：' + e.message)
            }
        },
        handleCloseDrawer () {
            this.isShowDrawer = false
        },
        handleTabsChange (activeIndex, children) {
            if (this.showTabs.length) {
                if (this.showTabs.indexOf(children[activeIndex].id) > -1) {
                    this.isShow = true
                } else {
                    this.isShow = false
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
.v-fo-invoice-inspect-footer {
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
