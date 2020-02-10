<template>
    <div style="position:relative; height:100%">
        <FoQuery :queryConditions="queryConditions" :queryColumns="queryColumns" :apiPath="apiPath" :refresh="refresh" @handleCellDbclick="handleCellDbclick" :conditionParam="conditionParam" :isQuery="isQuery" @changeValue="changeValue"></FoQuery>
        <Drawer width="75" draggable v-model="isShowLoanDetail">
            <FoQueryLoanDetail :currData="currData" v-if="isShowLoanDetail"></FoQueryLoanDetail>
        </Drawer>
        <Modal fullscreen z-index='2001' v-model="isShowBillDetail" title="单据" width="80">
            <template>
                <BillRoute v-if="isShowBillDetail" :defineCode="currData.definecode" :billCode="currData.billcode" :verifyCode="currData.verifycode" :showToolBar="false"></BillRoute>
            </template>
        </Modal>
    </div>
</template>

<script>
import FoQuery from '../fo-query.vue'
import FoQueryLoanDetail from './fo-query-loan-detail.vue'
import { BillRoute } from '@/components/va-bill'
export default {
    name: 'FoQueryLoan',
    data () {
        return {
            apiPath: 'api/cfasserver/cfasfo/querybase/queryPersonalLoanBalance',
            conditionParam: {},
            // 显示借款详情
            isShowLoanDetail: false,
            // 显示单据详情
            isShowBillDetail: false,
            currData: Object,
            refresh: false
        }
    },
    props: {
        isQuery: String
    },
    components: {
        FoQuery,
        FoQueryLoanDetail,
        BillRoute
    },
    computed: {
        queryConditions () {
            return [
                {name: 'enddate', title: '截止借款日期：', type: 'DATE', describe: '', filterFlag: true, conditionType: 'SINGLE'},
                {name: 'showstate_bl', title: '', type: 'BOOLEAN', describe: '仅显示未核销完的借款单', filterFlag: true}
            ]
        },
        queryColumns () {
            return [
                {columnname: 'billcode', columnTitle: '借款单号', columnType: 'STRING', describe: '', align: 'left', fixed: 'left', minwidth: 200, isLink: true},
                {columnname: 'billdate', columnTitle: '借款日期', columnType: 'DATE', describe: '', align: 'left', fixed: 'left'},
                {columnname: 'paymoneydate', columnTitle: '预计还款日期', columnType: 'DATE', describe: '', align: 'left', fixed: 'left'},
                {columnname: 'lastwrittenoffdate', columnTitle: '末次核销日期', columnType: 'DATE', describe: '', align: 'left'},
                {columnname: 'overdueflag', columnTitle: '是否逾期', columnType: 'BOOLEAN', describe: '', align: 'left'},
                {columnname: 'billmoney', columnTitle: '借款金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'inverifymoney', columnTitle: '已核销借款', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1', isLink: true},
                {columnname: 'verifymoney', columnTitle: '未核销借款', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'memo', columnTitle: '事由', columnType: 'STRING', describe: '', align: 'left', minwidth: 300}
            ]
        }
    },
    methods: {
        handleCellDbclick (row, column) {
            this.currData = row
            if (column.property === 'inverifymoney') {
                this.isShowLoanDetail = true
            }
            if (column.property === 'billcode') {
                this.isShowBillDetail = true
            }
        },
        changeValue (vaue, name) {
            // if (name === 'showstate_bl') {
            //     this.refresh = !this.refresh
            // }
        },
        initConditionParam () {
            this.conditionParam = {}
            var date = new Date()
            var seperator1 = '-'
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var strDate = date.getDate()
            if (month >= 1 && month <= 9) {
                month = '0' + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate
            this.conditionParam.enddate = currentdate
            this.conditionParam.showstate_bl = true
        }
    },
    mounted () {
        this.initConditionParam()
    }
}
</script>
