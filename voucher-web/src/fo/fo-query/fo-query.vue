<template>
    <div style="margin:0 12px; position:relative; height:100%">
        <!-- <FoQueryToolbar style="margin:0 -12px;">
        </FoQueryToolbar> -->
        <div class="va-query-bar" style="padding: 6px 0;margin: 0;">
            <Button @click.stop="queryAllHandle" ghost>查询
                <Icon v-if="!isquery" type="ios-arrow-down" style="color:#D8D8D8;" />
                <Icon v-if="isquery" type="ios-arrow-up" style="color:#D8D8D8;" />
            </Button>
            <span v-if="queryConditions.length>0" style="display:inline-block; border-right:1px solid #DDDDDD; padding:0 30px 0 10px; height:16px; line-height:16px;">
                <Icon size="16" type="ios-funnel-outline" style="color:#D8D8D8;" />筛选
            </span>
            <span v-for="(querycitem,key) in queryConditions" :key="key" style="display:inline-block; margin-left:4px;">
                <span v-if="querycitem.filterFlag && key<3 && !querycitem.hide" style="font-size:12px; color:#888888;">{{querycitem.title}}</span>
                <span v-if="querycitem.filterFlag && key<3 && !querycitem.hide" style="display:inline-block;">
                    <CustomDatePicker v-if="querycitem.type==='DATE' || querycitem.type==='TIMESTAMP'"
                        v-model="queryForm2[querycitem.name]"
                        :filterFlag="querycitem.filterFlag"
                        :querycitem="querycitem"
                        @on-change="val=>changeValue(val,querycitem.name)">
                    </CustomDatePicker>
                    <CustomInputString v-else-if="querycitem.type==='NVARCHAR'"
                        v-model="queryForm2[querycitem.name]"
                        :filterFlag="querycitem.filterFlag"
                        :querycitem="querycitem"
                        @on-change="val=>changeValue(val,querycitem.name)">
                    </CustomInputString>
                    <CustomInputNum v-else-if="querycitem.type==='NUMERIC'"
                        v-model="queryForm2[querycitem.name]"
                        :filterFlag="querycitem.filterFlag"
                        :querycitem="querycitem"
                        @on-change="val=>changeValue(val,querycitem.name)">
                    </CustomInputNum>
                    <CustomInputInt v-else-if="querycitem.type==='INTEGER'"
                        v-model="queryForm2[querycitem.name]"
                        :filterFlag="querycitem.filterFlag"
                        :querycitem="querycitem"
                        @on-change="val=>changeValue(val,querycitem.name)">
                    </CustomInputInt>
                    <va-basedata :multiple="querycitem.conditionType === 'MULTI'" v-else-if="querycitem.type==='BASEDATA'"
                        v-model="queryForm2[querycitem.name]"
                        :tbName="querycitem.tbName"
                        :param="querycitem.param"
                        useMode="query"
                        @on-change="val=>changeBaseData(val,querycitem.name)">
                    </va-basedata>
                    <Checkbox v-else-if="querycitem.type==='BOOLEAN'"
                        v-model="queryForm2[querycitem.name]"
                        style="font-size:12px; color:#888888;"
                        @on-change="val=>changeValue(val,querycitem.name)">{{ querycitem.describe }}
                    </Checkbox>
                    <DatePicker v-else-if="querycitem.type==='YEAR'" type="year"
                        v-model="queryForm2[querycitem.name]"
                        @on-change="val=>changeValue(val,querycitem.name)">
                    </DatePicker>
                </span>
            </span>
            <Button v-if="queryConditions.length>0" ghost @click="queryHandle">确定</Button>
            <Button v-if="queryConditions.length>0" type="text" @click="filterclear">清空</Button>
            <div class="va-margintop8 va-query-all" style="overflow:auto; box-shadow:0px 1px 6px 0px rgba(0,0,0,0.2);" v-show="isquery">
                <Form :label-width="125" style="display:overflow;">
                    <i-col span="8" v-for="(querycitem,key) in queryConditions" :key="key">
                        <FormItem :label="querycitem.title" v-if="!querycitem.hide">
                            <CustomDatePicker v-if="querycitem.type==='DATE' || querycitem.type==='TIMESTAMP'"
                                v-model="queryForm[querycitem.name]"
                                :querycitem="querycitem"
                                @on-change="val=>changeValue(val,querycitem.name)">
                            </CustomDatePicker>
                            <CustomInputString v-else-if="querycitem.type==='NVARCHAR'"
                                v-model="queryForm[querycitem.name]"
                                :querycitem="querycitem"
                                @on-change="val=>changeValue(val,querycitem.name)">
                            </CustomInputString>
                            <CustomInputNum v-else-if="querycitem.type==='NUMERIC'"
                                v-model="queryForm[querycitem.name]"
                                :querycitem="querycitem"
                                @on-change="val=>changeValue(val,querycitem.name)">
                            </CustomInputNum>
                            <CustomInputInt v-else-if="querycitem.type==='INTEGER'"
                                v-model="queryForm[querycitem.name]"
                                :querycitem="querycitem"
                                @on-change="val=>changeValue(val,querycitem.name)">
                            </CustomInputInt>
                            <va-basedata :multiple="querycitem.conditionType === 'MULTI'" v-else-if="querycitem.type==='BASEDATA'"
                                v-model="queryForm[querycitem.name]"
                                :tbName="querycitem.tbName"
                                useMode="query"
                                @on-change="val=>changeBaseData(val,querycitem.name)">
                            </va-basedata>
                            <Checkbox v-else-if="querycitem.type==='BOOLEAN'"
                                v-model="queryForm[querycitem.name]"
                                class="ivu-form-item-label"
                                @on-change="val=>changeValue(val,querycitem.name)">{{ querycitem.describe }}
                            </Checkbox>
                            <DatePicker v-else-if="querycitem.type==='YEAR'" type="year"
                                v-model="queryForm[querycitem.name]"
                                @on-change="val=>changeValue(val,querycitem.name)">
                            </DatePicker>
                        </FormItem>
                    </i-col>
                </Form>
                <div>
                    <i-col span="24">
                        <Button ghost style="margin-left:125px;" @click="clearQuery">清空</Button>
                        <Button  class="va-btn" @click="queryHandle">查询</Button>
                    </i-col>
                </div>
            </div>
        </div>
        <div class="va-margintop8" style="position:absolute; top:40px; left:0px; right:0px; bottom:52px;">
            <el-table :data="queryDatas" border style="width: 100%" :show-summary="true" :summary-method="getSummaries"
                :cell-style="handleCellStyle" @cell-click="handleCellDbclick"
                height="100%" class="fo-query-table">
                <el-table-column fixed="left" type="index" label="序号" width="60" align="center" :index="indexMethod"></el-table-column>
                <el-table-column  v-for="(item,key) in queryColumns" :fixed="item.fixed" :prop="item.columnname" :label="item.columnTitle" :min-width="item.minwidth?item.minwidth:defaultMinWidth" :key="key" v-bind:align="item.align" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="item.columnType==='NUMBER' && scope.row[item.columnname] && scope.row[item.columnname] !== 0">
                            {{numberFormat(scope.row[item.columnname],item.displayFormat)}}
                        </span>
                        <span v-else-if="item.columnType==='BOOLEAN'">
                            {{scope.row[item.columnname]?'是':'否'}}
                        </span>
                        <span v-else-if="item.columnType!=='NUMBER'">
                            {{scope.row[item.columnname]}}
                        </span>
                    </template>
                    <el-table-column v-for="(item,key) in item.children" :fixed="item.fixed" :prop="item.columnkey" :label="item.columnTitle" :min-width="item.minwidth?item.minwidth:defaultMinWidth" :key="key" v-bind:align="item.align" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="item.columnType==='NUMBER'
                                && scope.row.resultmap[item.parentname]
                                && scope.row.resultmap[item.parentname][item.columnname]
                                && scope.row.resultmap[item.parentname][item.columnname] !== 0">
                                {{numberFormat(scope.row.resultmap[item.parentname][item.columnname],item.displayFormat)}}
                            </span>
                            <span v-else-if="item.columnType==='BOOLEAN'">
                                {{scope.row[item.columnname]?'是':'否'}}
                            </span>
                            <span v-else-if="item.columnType!=='NUMBER'">
                                {{scope.row[item.columnname]}}
                            </span>
                        </template>
                    </el-table-column>
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
import FoQueryToolbar from './fo-query-toolbar'
import vaWeb from 'va-web'
export default {
    name: 'FoQuery',
    data () {
        return {
            queryDatas: [],
            allDatas: [],
            isquery: false,
            queryForm2: {},
            queryForm: {},
            // 分页参数
            total: 0,
            pagesizeopts: [10, 20, 50, 100],
            pageSize: 10,
            offset: 0, // 跳过条数
            limit: 10, // 查询数量
            pageIndex: 1,
            defaultMinWidth: 100
        }
    },
    components: {
        FoQueryToolbar
    },
    props: {
        queryConditions: Array,
        queryColumns: Array,
        apiPath: String,
        refresh: Boolean,
        conditionParam: Object,
        isQuery: String

    },
    watch: {
        refresh () {
            this.queryHandle()
        },
        conditionParam () {
            for (let key in this.conditionParam) {
                this.$set(this.queryForm2, key, this.conditionParam[key])
                this.$set(this.queryForm, key, this.conditionParam[key])
            }
            if (this.isQuery && this.isQuery === 'true') {
                this.queryHandle()
            }
        },
        'queryForm2.budyear' (newvalue, oldvalue) {
            if ((typeof newvalue) === 'object') {
                this.queryForm2.budyear = oldvalue
            }
        },
        'queryForm.budyear' (newvalue, oldvalue) {
            if ((typeof newvalue) === 'object') {
                this.queryForm.budyear = oldvalue
            }
        }

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
            const columns = param.columns
            const sums = []
            columns.forEach((column, index) => {
                let numtype
                let issummation = false
                let isChildColumn = false
                let parentname = null
                let currname = null
                for (let p in this.queryColumns) {
                    if (column.property === this.queryColumns[p].columnname && this.queryColumns[p].displayFormat) {
                        numtype = this.queryColumns[p].displayFormat
                        issummation = (this.queryColumns[p].summaryType === '1')
                        isChildColumn = false
                        break
                    }
                    if (this.queryColumns[p].children && this.queryColumns[p].children.length > 0) {
                        for (let t in this.queryColumns[p].children) {
                            if (column.property === this.queryColumns[p].children[t].parentname + '-' + this.queryColumns[p].children[t].columnname && this.queryColumns[p].children[t].displayFormat) {
                                numtype = this.queryColumns[p].children[t].displayFormat
                                issummation = (this.queryColumns[p].children[t].summaryType === '1')
                                isChildColumn = true
                                parentname = this.queryColumns[p].children[t].parentname
                                currname = this.queryColumns[p].children[t].columnname
                                break
                            }
                        }
                    }
                }
                if (index === 0) {
                    sums[index] = '合计'
                    return
                }
                const values = this.allDatas.map(item => { // 求和列
                    if (issummation) {
                        if (isChildColumn) {
                            if (item.resultmap[parentname]) {
                                return Number(item.resultmap[parentname][currname])
                            } else {
                                return Number(0)
                            }
                        } else {
                            return Number(item[column.property])
                        }
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
                    sums[index] = '— —'
                }
            })

            return sums
        },
        queryAllHandle () {
            this.isquery = !this.isquery
        },
        filterclear () {
            this.clearQueryCondition(this.queryForm2)
            this.clearQueryCondition(this.queryForm)
        },
        clearQuery (val) {
            this.clearQueryCondition(this.queryForm)
            this.clearQueryCondition(this.queryForm2)
        },
        clearQueryCondition (val) {
            for (let i in val) {
                if (i === 'defineName' || i === 'offset' || i === 'limit') {
                } else {
                    if (Array.isArray(val[i])) {
                        val[i] = []// 基础数据多选
                    } else if (typeof (val[i]) === 'object') {
                        val[i] = ['', '']// 范围
                    } else if (typeof (val[i]) === 'boolean') {
                        val[i] = false// 范围
                    } else {
                        val[i] = ''// 非范围
                    }
                }
            }
        },
        changeValue (val, name) {
            this.queryForm2[name] = val
            this.queryForm[name] = val
            this.$emit('changeValue', val, name)
        },
        changeBaseData (val, name) {
            if (Array.isArray(val)) {
                this.queryForm2[name] = val.map(item => item.code)
                this.queryForm[name] = val.map(item => item.code)
            } else {
                this.queryForm2[name] = val.code
                this.queryForm[name] = val.code
            }
            this.$emit('changeValue', val, name)
            for (let i in this.queryConditions) {
                if (this.queryConditions[i].filterParam && this.queryConditions[i].filterParam === name) {
                    var param = {}
                    param[name] = val.code
                    this.$set(this.queryConditions[i], 'param', param)
                }
            }
        },
        queryFormHandle (form) {
            this.queryForm2.offset = this.offset
            this.queryForm2.limit = this.limit
            this.queryForm2.pagination = false
            for (let i in form) {
                if (form[i].conditionType === 'RANGE' && this.queryForm2[form[i].name]) {
                    this.$set(this.queryForm2, form[i].name + 's', [this.queryForm2[form[i].name]])
                    continue
                }
                if (form[i].type === 'BOOLEAN') {
                    this.$set(this.queryForm2, form[i].name.substring(0, form[i].name.length - 3), this.queryForm2[form[i].name] ? 1 : 0)
                    continue
                }
                if (form[i].hide === true) {
                    this.$set(this.queryForm2, form[i].name, form[i].default)
                    continue
                }
            }
        },
        async queryHandle (val) {
            this.$emit('checkCondition', this.queryForm2)
            this.queryFormHandle(this.queryConditions)
            this.isquery = false
            this.offset = 0
            this.pageIndex = 1
            try {
                const {
                    data: { rows, total }
                } = await this.$http.post(this.apiPath, this.queryForm2)
                if (total && total > 0) {
                    let limit = this.limit
                    if (limit > total) {
                        limit = total
                    }
                    let toindex = this.offset + limit
                    if (toindex > total) {
                        toindex = total
                    }
                    this.total = total
                    this.queryDatas = rows.slice(this.offset, toindex)
                    this.allDatas = rows
                } else {
                    this.total = 0
                    this.queryDatas = []
                    this.allDatas = []
                }
            } catch (e) {
                this.$Message.error('查询失败')
            }
        },
        pageChange (pageIndex) {
            this.offset = (pageIndex - 1) * this.limit
            if (this.total && this.total > 0) {
                let limit = this.limit
                if (limit > this.total) {
                    limit = this.total
                }
                let toindex = this.offset + limit
                if (toindex > this.total) {
                    toindex = this.total
                }
                this.queryDatas = this.allDatas.slice(this.offset, toindex)
            }
        },
        pageSizeChange (pageSize) {
            this.offset = 0
            this.pageIndex = 1
            this.limit = pageSize
            if (this.total && this.total > 0) {
                let limit = this.limit
                if (limit > this.total) {
                    limit = this.total
                }
                let toindex = this.offset + limit
                if (toindex > this.total) {
                    toindex = this.total
                }
                this.queryDatas = this.allDatas.slice(this.offset, toindex)
            }
        },
        handleCellDbclick (row, column, cell, event) {
            this.$emit('handleCellDbclick', row, column)
        },
        indexMethod: function (index) {
            return this.offset + index + 1
        },
        // 获取单元格样式
        handleCellStyle ({column}) {
            if (this.queryColumns && this.queryColumns.length > 0) {
                for (let i in this.queryColumns) {
                    const col = this.queryColumns[i]
                    if (col.columnname === column.property) {
                        if (col.isLink) {
                            return {color: '#03A4AD', cursor: 'pointer'}
                        }
                    } else if (col.children && col.children.length > 0) {
                        const childrenCol = col.children
                        for (let i in childrenCol) {
                            const childCol = childrenCol[i]
                            if (childCol.columnname === column.property && childCol.isLink) {
                                return {color: '#03A4AD', cursor: 'pointer'}
                            }
                        }
                    }
                }
            }
        }
    },
    mounted () {
        if (this.isQuery) {
            this.queryHandle()
        }
    },
    created () {
        let sysPageOpt = sessionStorage.sys_page_opt
        let sysPageSize = sessionStorage.sys_page_size
        if (sysPageOpt && sysPageSize) {
            // this.pageSizes = sysPageOpt.split(',')
            this.pagesizeopts = sysPageOpt.split(',').map(str => parseInt(str))
            this.pageSize = parseInt(sysPageSize)
            this.limit = parseInt(sysPageSize)
        }
    }
}
</script>

<style lang="less" scoped>
    .fo-query-table {
        &/deep/.el-table__fixed-footer-wrapper tbody td {
            background-color: #FFFFFF;
        }
        &/deep/.el-table__footer-wrapper tbody td {
            background-color: #FFFFFF;
        }
    }
    .va-query-all {
        top: 38px;
        left: 0px
    }
</style>
