<!--客商基础数据界面——右侧客商列表-->
<template>
    <div>
        <i-input search placeholder="输入关键字查询" v-model="searchText" @on-change="basedataSearch" class="tb-search"></i-input>
        <el-table :data="CustSupplierList" ref="basedataTable" highlight-current-row @current-change="handleCurrentChange"
                border style="width: 100% position:relative;" :height="tableHeight" :row-class-name="tableRowClassName">
            <el-table-column fixed="left" type="index" label="序号" width="50"
                align="center" :index="indexMethod">
            </el-table-column>
            <el-table-column v-for="(item,key) in showcolumns" :label="item.columnTitle" :prop="item.columnName.toLowerCase()" min-width="120" :key="key">
                <template slot-scope="scope">
                    <span v-if="item.columnName.toLowerCase()==='parentcode'">
                        {{scope.row.showTitleMap[item.columnName.toLowerCase()]}}
                    </span>
                    <span v-else-if="item.columnName.toLowerCase()==='stopflag' || (extendfields
                        && extendfields.find(field => field.name === item.columnName)
                        && extendfields.find(field => field.name === item.columnName).type === '8') ||
                        item.mappingType === 0">
                        {{scope.row[item.columnName.toLowerCase()] === 1?'是':'否'}}
                    </span>
                    <span v-else-if="item.mappingType && (item.mappingType===1 || item.mappingType===4 || item.mappingType===2)">
                        {{scope.row.showTitleMap[item.columnName.toLowerCase()]}}
                    </span>
                    <span v-else-if="item.columnType==='DATE'" >
                        {{scope.row[item.columnName.toLowerCase()]?displayFormat.format(scope.row[item.columnName.toLowerCase()],'yyyy-MM-dd'):''}}
                    </span>
                    <span v-else>
                        {{scope.row[item.columnName.toLowerCase()]}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="140">
                <template slot-scope="scope">
                    <div style="white-space: nowrap; margin:auto -8px;" v-if="scope.row.sameUnit==null || scope.row.sameUnit==true">
                        <va-toolbar-item class="va-toolbar" title="修改" @click="edit(scope.row)"></va-toolbar-item>
                        <va-toolbar-item v-if="scope.row.stopflag === 0" class="va-toolbar" title="停用" @click="stop(scope.row, 1)"></va-toolbar-item>
                        <va-toolbar-item v-if="scope.row.stopflag === 1" class="va-toolbar" title="启用" @click="start(scope.row, 0)"></va-toolbar-item>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <Page style="margin:7px; float:right;"
            show-total
            show-elevator
            show-sizer
            :total="total"
            :current="pageIndex"
            :page-size="limit"
            :page-size-opts="pagesizeopts"
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
            />
    </div>
</template>

<script>
import {
    vaBaseDataApi
} from '../../../api/va'
export default {
    name: 'CustSupplierList',
    props: {
        refreshList: Boolean,
        custsupptypecode: null,
        groupNames: Array,
        custsuppTypeList: Array,
        checkCanMove: Boolean,
        moveType: '',
        showcolumns: Array,
        extendfields: Array
    },
    data () {
        return {
            searchText: '',
            CustSupplierList: [],
            currentRow: null,
            total: 0,
            offset: 0,
            pageIndex: 1,
            limit: 10,
            pagesizeopts: [10, 20, 50, 100],
            tableHeight: 300
        }
    },
    async mounted () {
        this.loadBaseDataList()
        await this.winResize()

        let _this = this
        window.addEventListener('resize', function () {
            _this.winResize()
        })
    },
    watch: {
        refreshList () {
            this.pageChange(1)
            // this.loadBaseDataList()
        },
        custsupptypecode () {
            this.pageChange(1)
            // this.loadBaseDataList()
        },
        checkCanMove () {
            this.checkCurrRow()
        }
    },
    methods: {
        indexMethod: function (index) {
            return this.offset + index + 1
        },
        async basedataSearch () {
            this.loadBaseDataList()
        },
        async loadBaseDataList () {
            try {
                let formdata = {
                    groupFieldName: 'CUSTSUPPTYPECODE',
                    groupname: this.custsupptypecode,
                    tableName: 'MD_CUSTSUPP',
                    pagination: true,
                    offset: this.offset,
                    limit: this.limit,
                    searchKey: this.searchText,
                    stopflag: -1,
                    queryDataStructure: 'ALL_WITH_REF'
                }
                if (this.custsupptypecode) {
                    formdata.groupNames = this.groupNames
                }
                let {
                    data: {
                        rs,
                        rows,
                        total
                    }
                } = await this.$http.post(vaBaseDataApi.basedata + '/list', formdata)
                if (rs.code === 0) {
                    this.CustSupplierList = rows
                    this.total = total
                    if (this.currentRow) {
                        for (let row of rows) {
                            if (row.code === this.currentRow.code) {
                                this.$refs.basedataTable.setCurrentRow(row)
                                break
                            }
                        }
                    }
                    this.$emit('updateCurrQueryParam', formdata)
                } else {
                    throw new Error(rs.msg)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        pageChange (pageIndex) {
            this.offset = (pageIndex - 1) * this.limit
            this.loadBaseDataList()
        },
        pageSizeChange (pageSize) {
            this.offset = 0
            this.limit = pageSize
            this.loadBaseDataList()
        },
        handleCurrentChange (val) {
            if (val) {
                this.currentRow = val
                this.$emit('currentRowHandle', this.currentRow)
            }
        },
        tableRowClassName ({row, rowIndex}) {
            row.index = rowIndex
        },
        edit (row) {
            this.currentRow = row
            this.$emit('currentRowHandle', this.currentRow)
            this.$emit('edit', row)
        },
        stop (row) {
            this.currentRow = row
            this.$emit('currentRowHandle', this.currentRow)
            this.$emit('stop')
        },
        start (row) {
            this.currentRow = row
            this.$emit('currentRowHandle', this.currentRow)
            this.$emit('start')
        },
        winResize () {
            this.$nextTick(() => {
                let winHeight = document.documentElement.clientHeight
                this.tableHeight = Number(winHeight) - 218
            })
        },
        checkCurrRow () {
            if (this.currentRow) {
                let currRowIndex = this.offset + this.currentRow.index + 1
                if (this.moveType === 'up') {
                    if (currRowIndex === 1 || (currRowIndex > 1 && this.BaseDataList[currRowIndex - 2].parentcode !== this.currentRow.parentcode)) {
                        this.$Message.error('第一行无法上移')
                    }
                } else if (this.moveType === 'down') {
                    if (currRowIndex === this.total || (currRowIndex < this.total && this.BaseDataList[currRowIndex].parentcode !== this.currentRow.parentcode)) {
                        this.$Message.error('最后一行无法下移')
                    }
                }
            } else {
                this.$Message.error('请选择基础数据定义')
            }
        }
    }
}
</script>

<style scoped>
.tb-search {
    margin-bottom: 10px;
    width: 360px;
    float: left;
}
.basedata-pagination {
    position: absolute;
    bottom: 0;
    right: 24px;
}
</style>
