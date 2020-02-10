
<template>
<div>
    <Drawer ref="drawer" :title="title" width="75" draggable :mask-style="{zIndex: modalIndex}" v-model="isShowDrawer" @on-close="handleClose">
    <Spin size="large" fix v-if="spinShow">
        <Icon type="ios-loading" size=18></Icon>
        <div >加载中</div>
    </Spin>
        <div id="va-query-id" class="apar-margin-bottom8 apar-margin-top8">
            <span v-if="querycondition.length>0" style="display:inline-block; border-right:1px solid #DDDDDD; padding:0 10px 0 10px; height:16px; line-height:16px; font-size:12px;">
                <svg class="icon" aria-hidden="true" style="width:14px; height:14px;">
                    <use xlink:href="#icon_sx-shaixuan"></use>
                </svg>筛选
            </span>
            <span style="display:inline-block; margin-left:4px;">
                <!-- <el-switch v-model="haspaymentdata" active-color="#03a4ad">
                </el-switch> -->
                <Checkbox v-model="haspaymentdata"><span style="font-size:12px; color:#888888;">含收款数据</span></Checkbox>

            </span>
            <span v-for="(queryitem,key) in querycondition" :key="key" style="display:inline-block; margin-left:4px;">
                <span style="font-size:12px; color:#888888;">{{queryitem.columnTitle}}：</span>
                <span style="display:inline-block; margin-left:-7px;">
                    <custom-select placeholder="不限" class="va-filter" v-model="queryForm[queryitem.columnName].value" :queryitem="queryitem"
                    :expression="queryForm[queryitem.columnName].filter" :check="queryForm[queryitem.columnName].check"
                    v-if="queryitem.mappingType===2" @on-change="val=>changeEnumSelect(val,queryitem)"></custom-select>
                    <!--合同基础数据单独处理-->
                    <va-basedata placeholder="不限" class="va-filter" v-model="queryValue[queryitem.columnName]"
                    :multiple="multiple" v-else-if="queryitem.mapping && (queryitem.mapping).indexOf('MD')===0 && (queryitem.columnName ==='M.CONTRACTCODE' || queryitem.columnName ==='M.CONTRACTNAME' )"
                        :tbName="queryitem.mapping.split('.')[0]" style="width:120px;"
                        :disableValue="disableValue[queryitem.columnName]"
                        :expression="contractExpression" @on-change="val=>changeBasedata(val,queryitem)"></va-basedata>

                    <va-basedata placeholder="不限" class="va-filter" v-model="queryValue[queryitem.columnName]" :expression="expression[queryitem.columnName]"
                        :disableValue="disableValue[queryitem.columnName]"
                    :multiple="multiple" v-else-if="queryitem.mapping && (queryitem.mapping).indexOf('MD')===0 && queryitem.columnName !=='M.CONTRACTCODE' && queryitem.columnName !=='M.CONTRACTNAME' "
                    :tbName="queryitem.mapping.split('.')[0]" style="width:120px;"  @on-change="val=>changeBasedata(val,queryitem)"></va-basedata>

                    <custom-input-string class="va-filter" v-model="queryForm[queryitem.columnName].value"
                    v-else-if="queryitem.columnType==='NVARCHAR'" @on-change="val=>changeString(val,queryitem)"></custom-input-string>
                    <custom-input-num class="va-filter" v-model="queryForm[queryitem.columnName].value" :queryitem="queryitem"
                    v-else-if="queryitem.columnType==='NUMERIC'" :value="queryForm[queryitem.columnName].value" @on-change="val=>changeNum(val,queryitem.columnName)"></custom-input-num>
                    <custom-input-int class="va-filter" v-model="queryForm[queryitem.columnName].value" :value="queryForm[queryitem.columnName].value"
                        v-else-if="queryitem.columnType==='INTEGER'"
                        @on-change="val=>changeInt(val,queryitem)"></custom-input-int>
                </span>
            </span>
            <Button class="va-query-form-btn" ghost @click="queryHandle()">查询</Button>
            <Button class="va-query-form-btn" type="text" @click="filterclear">清空</Button>
        </div>

        <div class="apar-ref-modal-showinfo-item1">
            <span style="">{{showinfo.unit.fieldtitle}}：</span>
            <span style="display:inline-block; margin-left:-7px;">{{showinfo.unit.title}}</span>
        </div>
        <div class="apar-ref-modal-showinfo-item2">
            <span style="">{{showinfo.custsupp.fieldtitle}}：</span>
            <span style="display:inline-block; margin-left:-7px;">{{showinfo.custsupp.title}}</span>
        </div>

        <el-table ref="reftabledata" :fit='isborder' highlight-current-row border :data="tableData"
            height="calc(100% - 165px)" @select-all="handleSelectAll" @select="handleSelect"
            @selection-change="handleSelectChange" @row-click="handleRowClick"
            :cell-style="handleCellStyle" @cell-click="handleCellDbclick">
            <el-table-column type="selection" width="50" align="center" fixed></el-table-column>
            <el-table-column label="序号" fixed width="50" type="index" align="center">
                <template v-slot="scope">{{ scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column v-for="(item,index) in querycolumn" :key="index" :label="item.columnTitle"
                :prop="item.columnName" :align="item.align" :width="item.width" :fit='isborder'>
            </el-table-column>
        </el-table>
            <div class="apar-ref-bill-list-footer">
                <Button style="margin-right: 10px" @click="handleClose">取消</Button>
                <Button type="primary" @click="handleConfirm">确定</Button>
            </div>
        </Drawer>
        <Modal fullscreen v-model="modal" title="单据" width="80" position="fixed">
            <template>
                <BillRoute v-if="modal" :defineCode="todoData.BIZTYPE" :billCode="todoData.BIZCODE" :verifyCode="todoData.verifyCode" :showToolBar="false"></BillRoute>
            </template>
        </Modal>
        <Modal v-show="false" ref="modal"></Modal>
</div>
</template>

<script>
import XEUtils from 'xe-utils'
import vaWeb from 'va-web'
import {displayFormat} from '../apar/component/format'
import CustomDatePicker from '../apar/component/custom-data'
import CustomInputString from '../apar/component/input-string'
import CustomInputInt from '../apar/component/input-int'
import CustomInputNum from '../apar/component/input-num'
import CustomSelect from '../apar/component/apar-enum-select'
import { BillRoute } from '@/components/va-bill'

export default {
    name: 'AparRefModal',
    components: {
        CustomDatePicker,
        CustomInputString,
        CustomInputInt,
        CustomInputNum,
        CustomSelect,
        BillRoute
    },
    props: {
        title: String,
        refdata: Object,
        state: Number,
        model: Object,
        selectiteimids: String

    },
    data () {
        return {
            spinShow: true,
            isborder: true,
            isShowDrawer: true,
            maskstyle: {
                'z-index': 1950
            },
            haspaymentdata: false,
            title1: '引用数据',
            modeldefinecode: '',
            selectItemidMap: new Map(),
            selectDatas: [],
            modelstate: this.state,
            tableData: [],
            masterids: '',
            itemids: '',
            querycondition: Array,
            // 查询子项code集合
            startwithCondition: {},
            // 合同基础数据过滤条件
            contractExpression: '',
            defaultquerycondition: '',
            querycolumn: Array,
            showinfo: {
                unit: {
                    name: '',
                    title: '',
                    fieldtitle: ''
                },
                custsupp: {
                    name: '',
                    title: '',
                    fieldtitle: ''
                }
            },
            queryForm: {},
            queryValue: {},
            expression: {},
            disableValue: {},
            basedataparam: {},
            queryFlag: 1,
            queryProps: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            // 是否多选
            multiple: true,
            modal: false,
            todoData: {},
            modalIndex: 1000
        }
    },
    computed: {

    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            this.contractExpression = '[CUSTSUPPCODE]=\'' + this.model.data['FO_APARBILL'][0].CUSTSUPPCODE.name + '\''
        },
        async initdata () {
            this.modeldefinecode = this.model.define.name
            const {
                data
            } = await this.$http.post('/api/cfasserver/cfasapar/ref/init/' + this.modeldefinecode, this.refdata)

            if (data.code === 0) {
                this.tableData = data.data.data
                this.tableData.forEach(item => {
                    if (item.BILLDATE) {
                        item.BILLDATE = displayFormat.format(item.BILLDATE, 'yyyy-MM-dd')
                    }

                    if (item.BILLMONEY) {
                        item.BILLMONEY = this.numberFormat(item.BILLMONEY)
                    }
                    if (item.unverifymoney) {
                        item.unverifymoney = this.numberFormat(item.unverifymoney)
                    }
                    if (item.OUGHTMONEY) {
                        item.OUGHTMONEY = this.numberFormat(item.OUGHTMONEY)
                    }
                    if (item.EXPECTMONEY) {
                        item.EXPECTMONEY = this.numberFormat(item.EXPECTMONEY)
                    }
                    if (item.VERIFYMONEY) {
                        item.VERIFYMONEY = this.numberFormat(item.VERIFYMONEY)
                    }
                })
                this.$nextTick(() => {
                    // 是否勾选含收款数据按钮
                    let hasreceiver = false
                    // 初始加载数据勾选已选数据
                    const val = this.selectiteimids.split(',')
                    val.forEach(itemid => {
                        const selectedData = this.tableData.find(item => item.itemid === itemid)
                        if (selectedData) {
                            if (selectedData.APARTYPECODE && selectedData.APARTYPECODE.indexOf('收') !== -1) {
                                hasreceiver = true
                            }
                            this.$refs.reftabledata.toggleRowSelection(selectedData, true)
                        }
                    })
                    this.$nextTick(() => {
                    // 加载数据勾选已选数据
                        this.selectDatas.forEach(data => {
                            const selectedData = this.tableData.find(item => item.itemid === data.itemid)
                            if (selectedData) {
                                this.$refs.reftabledata.toggleRowSelection(selectedData, true)
                            }
                        })
                    })
                    this.haspaymentdata = hasreceiver

                    if (!this.haspaymentdata) {
                        let newArr1 = this.tableData.filter(item => item.APARTYPECODE_CODE === '01' || item.APARTYPECODE_CODE === '02')
                        this.tableData = newArr1
                    }
                })

                // this.querycondition = data.data.querycondition
                // 过滤不需要显示出来的查询条件
                let temp = data.data.querycondition
                let condition = []
                temp.forEach(item => {
                    if (item.display === true) {
                        condition.push(item)
                    }
                })
                this.querycondition = condition
                this.initQueryForm()

                this.defaultquerycondition = data.data.defaultquerycondition

                let myArray = []
                data.data.querycolumn.querycolumn.forEach(item => {
                    if (item.columnName === 'unverifymoney') {
                        item.align = 'right'
                    }
                    if (item.columnName.indexOf('MONEY') !== -1) {
                        item.align = 'right'
                    }

                    myArray.push(item)
                })
                this.querycolumn = myArray

                this.showinfo = data.data.showinfo

                this.spinShow = false

                this.$nextTick(() => {
                    this.modalIndex = 1000 + this.$refs.modal.modalIndex
                    this.$refs.drawer.$el.getElementsByClassName('ivu-drawer-wrap')[0].style.zIndex = this.modalIndex
                })
            }
        },
        dataFormat (num) {
            return vaWeb.displayFormat.toThousands(vaWeb.displayFormat.strToFloat(num + '', 1, 2))
        },
        formatNumber (val) {
            if (typeof val === 'number') {
                return XEUtils.commafy(val, {
                    fixed: 2
                })
            } else {
                return val
            }
        },

        handleSelectAll (selection) {
            if (!selection.length) {
                this.selectItemidMap.clear()
            }
        },
        handleSelect (selection, row) {
            const deleData = selection.find(item => item.itemid === row.itemid)
            if (!deleData) {
                this.selectItemidMap.delete(row)
            }
        },
        handleSelectChange (selectDatas) {
            if (selectDatas.length !== 0) {
                this.selectDatas = selectDatas

                this.selectItemidMap.clear()

                selectDatas.forEach(item => {
                    let money = ''
                    money = item.unverifymoney.replace(/,/g, '')
                    const value = {
                        SRCBILLCODE: item.BILLCODE,
                        SRCDEFINECODE: item.DEFINECODE,
                        UNVERIFYMONEY: money,
                        SRCITEMID: item.itemid,
                        BILLDATE: item.BILLDATE
                    }

                    this.selectItemidMap.set(item, value)
                })
            }
        },
        handleRowClick (row) {
            this.selectDatas = [row]
        },
        handleClose () {
            this.selectDatas = []
            this.selectItemidMap.clear()

            this.$emit('on-cancel')
        },
        handleConfirm () {
            const val = [...this.selectItemidMap.values()]
            if (!val.length) {
                this.$Message.info('请至少选择一条记录')
                return
            }
            this.$emit('on-ok', val)
        },
        changeEnumSelect (val, item) {
            item.value = val
            this.queryForm[item.columnName] = item
        },
        changeString (val, item) {
            item.value = val
            this.queryForm[item.columnName] = item
        },
        changeNum (val, name) {
            if (val[0] !== '' && val[1] !== '') {
                let value = val[0] + ',' + val[1]
                this.queryForm[name].value = value
            }
        },
        changeInt (val, item) {
            item.value = val
            this.queryForm[item.columnName] = item
        },
        filterclear () {
            this.haspaymentdata = false
            let data = this.queryForm
            Object.keys(data).forEach(function (key) {
                data[key].value = ''
            })
            this.queryForm = data
            this.queryValue = {}
            // this.queryHandle()
        },
        async queryHandle (val, fn) {
            this.selectDatas = []
            this.selectItemidMap.clear()

            let querycolumns = {
                querycolumn: this.querycolumn
            }

            // 处理queryForm
            let temp = this.queryForm
            Object.keys(temp).forEach(function (key) {
                if (temp[key].value instanceof Array) {
                    let array = temp[key].value
                    let value = array[0] + ',' + array[1]
                    temp[key].value = value
                }
            })
            this.queryForm = temp
            const param = {
                querycondition: this.queryForm,
                modeldata: this.model.data,
                defaultquerycondition: this.defaultquerycondition,
                querycolumn: querycolumns,
                paymentflag: {paymentflag: this.haspaymentdata}

            }
            const {
                data
            } = await this.$http.post('/api/cfasserver/cfasapar/ref/query/' + this.modeldefinecode, param)

            if (data.code === 0) {
                this.tableData = data.data.data
                this.tableData.forEach(item => {
                    if (item.BILLDATE) {
                        item.BILLDATE = displayFormat.format(item.BILLDATE, 'yyyy-MM-dd')
                    }
                    if (item.BILLMONEY) {
                        item.BILLMONEY = this.numberFormat(item.BILLMONEY)
                    }
                    if (item.unverifymoney) {
                        item.unverifymoney = this.numberFormat(item.unverifymoney)
                    }
                    if (item.OUGHTMONEY) {
                        item.OUGHTMONEY = this.numberFormat(item.OUGHTMONEY)
                    }
                    if (item.EXPECTMONEY) {
                        item.EXPECTMONEY = this.numberFormat(item.EXPECTMONEY)
                    }
                    if (item.VERIFYMONEY) {
                        item.VERIFYMONEY = this.numberFormat(item.VERIFYMONEY)
                    }
                })

                // this.$nextTick(() => {
                //     // 初始加载数据勾选已选数据
                //     const val = this.selectiteimids.split(',')
                //     val.forEach(itemid => {
                //         const selectedData = this.tableData.find(item => item.itemid === itemid)
                //         if (selectedData) {
                //             this.$refs.reftabledata.toggleRowSelection(selectedData, true)
                //         }
                //     })
                // })
                // this.$nextTick(() => {
                //     // 加载数据勾选已选数据
                //     this.selectDatas.forEach(data => {
                //         const selectedData = this.tableData.find(item => item.itemid === data.itemid)
                //         if (selectedData) {
                //             this.$refs.reftabledata.toggleRowSelection(selectedData, true)
                //         }
                //     })
                // })
            }
        },
        numberFormat (column) {
            return vaWeb.displayFormat.toThousands(vaWeb.displayFormat.strToFloat(column + '', 1, 2))
        },
        changeBasedata (val, item) {
            let value = ''
            val.forEach(item => {
                value = value + item.code + ','
            })
            if (value.length > 1) {
                value = value.substr(0, value.length - 1)
            }
            item.value = value
            this.queryForm[item.columnName] = item

            // this.queryValue[item.columnName] = value
        },
        initQueryForm () {
            let querycondition = this.querycondition
            for (let item of querycondition) {
                if (item.columnType === 'NUMERIC') {
                    if (item.connectorType === '=') {
                        let value = [item.value, item.value]
                        item.value = value
                    }
                    if (item.connectorType === '>=' || item.connectorType === '>') {
                        let value = [item.value, '']
                        item.value = value
                    }
                    if (item.connectorType === '<=' || item.connectorType === '<') {
                        let value = ['', item.value]
                        item.value = value
                    }
                }
                this.queryForm[item.columnName] = item

                if (item.value instanceof Array) {
                    continue
                }
                if (item.filter === undefined) {
                    continue
                }
                if (item.filter === '') {
                    this.expression[item.columnName] = '1 = 2'
                    continue
                }
                let temp = item.filter
                let array = temp.split(',')
                let result = ''
                array.forEach(item => {
                    result = result + '\'' + item + '\','
                })
                temp = '[CODE] IN (ToArray(' + result + '))'
                this.expression[item.columnName] = temp

                if (item.disableValue) {
                    this.disableValue[item.columnName] = item.disableValue
                }
                if (item.check && item.check === true) {
                    // 删除不需要选中的父节点
                    let newvalue = Array
                    newvalue = array.filter(a => {
                        let exist = false
                        if (item.disableValue) {
                            item.disableValue.forEach(i => {
                                if (i === a) {
                                    exist = true
                                }
                            })
                            if (exist) {
                                return false
                            }
                        }
                        return true
                    })
                    this.$set(this.queryValue, item.columnName, newvalue.join(','))
                } else {
                    // // 基础数据时重新赋值
                    // if (item.mappingType === 1) {
                    //     item.value = ''
                    //     item.filter = ''
                    //     this.queryForm[item.columnName] = item
                    // }
                }
            }
        },
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
    },
    created () {
        this.initdata()
    }
}
</script>
<style lang="less" scoped>
.apar-ref-bill-list-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}

.apar-margin-bottom8 {
    margin-bottom: 8px;
}

.apar-margin-bottom8 {
    margin-top: 8px;
}

.apar-ref-modal-showinfo-item1 {
    margin: 10px;
    width: 35%;
    float: left;
}

.apar-ref-modal-showinfo-item2 {
    margin: 10px;
    width: 35%;
    float: left;
}
</style>
