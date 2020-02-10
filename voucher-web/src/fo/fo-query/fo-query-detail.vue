<template>
    <div>
        <div class="va-margintop8" style="position:absolute; top:90px; left:0px; right:0px; bottom:52px;">
            <el-table :data="queryDatas" border style="width: 100%" :show-summary="true" :summary-method="getSummaries" height="100%">
                <el-table-column fixed="left" type="index" label="序号" width="60" align="center"></el-table-column>
                <el-table-column v-for="(item,key) in queryColumns" :prop="item.columnname" :label="item.columnTitle" min-width="120" :key="key" v-bind:align="item.align" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="item.columnType!=='NUMBER'">
                            {{scope.row[item.columnname]}}
                        </span>
                        <el-link v-else-if="item.isLink && scope.row[item.columnname] > 0" type="primary" @click="openLink">
                            {{numberFormat(scope.row[item.columnname],item.displayFormat)}}
                        </el-link>
                        <span v-else-if="scope.row[item.columnname] > 0">
                            {{numberFormat(scope.row[item.columnname],item.displayFormat)}}
                        </span>
                    </template>
                    <el-table-column v-for="(item,key) in item.children" :prop="item.columnname" :label="item.columnTitle" min-width="120" :key="key" v-bind:align="item.align"></el-table-column>
                </el-table-column>
            </el-table>
        </div>
        <div class="va-pagination-preview">
            <Page
            :total="total"
            show-total
            show-elevator
            show-sizer
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
            :current="pageIndex"
            :page-size="pageSize"
            :page-size-opts="pagesizeopts"
            />
        </div>
    </div>
</template>

<script>
import vaWeb from 'va-web'
export default {
    name: 'FoQueryDetail',
    data () {
        return {
            queryDatas: [],
            // 分页参数
            total: 0,
            pagesizeopts: [10, 20, 50, 100],
            pageSize: 10,
            offset: 0, // 跳过条数
            limit: 10, // 查询数量
            pageIndex: 1
        }
    },
    props: {
        queryColumns: Array,
        param: Object,
        apiPath: String
    },
    mounted () {
        this.getDetailDatas()
    },
    methods: {
        numberFormat (column, type) {
            column = column + ''
            switch (type) {
                case '0':
                    return vaWeb.displayFormat.toThousands(vaWeb.displayFormat.strToFloat(column, 1, 1))
                case '1':
                    return vaWeb.displayFormat.toThousands(vaWeb.displayFormat.strToFloat(column, 1, 2))
                case '2':
                    return vaWeb.displayFormat.toThousands(vaWeb.displayFormat.strToFloat(column, 1, 3))
                case '3':
                    return vaWeb.displayFormat.toThousands(vaWeb.displayFormat.strToFloat(column, 1, 0))
                case '4':
                    return vaWeb.displayFormat.strToFloat(column, 1, 1)
                case '5':
                    return vaWeb.displayFormat.strToFloat(column, 1, 2)
                case '6':
                    return vaWeb.displayFormat.strToFloat(column, 1, 3)
                case '7':
                    return vaWeb.displayFormat.strToFloat(column, 1, 0)
                case '8':
                    return vaWeb.displayFormat.strToFloat(Number(column) * 100 + '', 1, 0) + '%'
                case '9':
                    return vaWeb.displayFormat.strToFloat(Number(column) * 100 + '', 1, 1) + '%'
                case '10':
                    return vaWeb.displayFormat.strToFloat(Number(column) * 100 + '', 1, 2) + '%'
                case '11':
                    if (column === '1') {
                        return '是'
                    } else if (column === '0') {
                        return '否'
                    } else {
                        return ''
                    }
                default:
                    return column
            }
        },
        getSummaries (param) {
            const { columns, data } = param
            const sums = []
            columns.forEach((column, index) => {
                let numtype
                let issummation = false
                for (let p in this.queryColumns) {
                    if (column.property === this.queryColumns[p].columnname && this.queryColumns[p].displayFormat) {
                        numtype = this.queryColumns[p].displayFormat
                        issummation = (this.queryColumns[p].summaryType === '1')
                    }
                }
                if (index === 0) {
                    sums[index] = '合计'
                    return
                }

                const values = data.map(item => { // 求和列
                    if (issummation) {
                        return Number(item[column.property])
                    }
                })

                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            return prev + curr
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = this.numberFormat(sums[index], numtype)
                } else {
                    sums[index] = '--'
                }
            })
            return sums
        },
        async getDetailDatas () {
            try {
                const {
                    data: { rows, total }
                } = await this.$http.post(this.apiPath, this.param)
                this.total = total
                this.queryDatas = rows
            } catch (e) {
                this.$Message.error('获取元数据失败')
            }
        },
        pageChange (pageIndex) {
            this.offset = (pageIndex - 1) * this.limit
            this.queryHandle()
        },
        pageSizeChange (pageSize) {
            this.offset = 0
            this.limit = pageSize
            this.queryHandle()
        }
    },
    created () {
        let sysPageOpt = sessionStorage.sys_page_opt
        let sysPageSize = sessionStorage.sys_page_size
        if (sysPageOpt && sysPageSize) {
            this.pagesizeopts = sysPageOpt.split(',')
            this.pageSize = parseInt(sysPageSize)
            this.limit = parseInt(sysPageSize)
        }
    }
}
</script>
