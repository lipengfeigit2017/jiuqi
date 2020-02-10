<template>
    <FoQueryDetail :queryColumns="queryColumns" :param="param" :apiPath="apiPath"></FoQueryDetail>
</template>

<script>
import FoQueryDetail from '../fo-query-detail.vue'
export default {
    name: 'FoQueryLoanDetail',
    data () {
        return {
            apiPath: 'api/cfasserver/cfasfo/querybase/queryPersonalLoanBalance/detail'
        }
    },
    components: {
        FoQueryDetail
    },
    props: {
        currData: Object
    },
    computed: {
        queryColumns () {
            return [
                {columnname: 'definetitle', columnTitle: '单据类型', columnType: 'STRING', describe: '', align: 'left'},
                {columnname: 'billcode', columnTitle: '单据单号', columnType: 'STRING', describe: '', align: 'left'},
                {columnname: 'billdate', columnTitle: '单据日期', columnType: 'DATE', describe: '', align: 'left'},
                {columnname: 'memo', columnTitle: '事由', columnType: 'STRING', describe: '', align: 'left'},
                {columnname: 'billmoney', columnTitle: '报销金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'},
                {columnname: 'inverifymoney', columnTitle: '核销金额', columnType: 'NUMBER', describe: '', align: 'right', displayFormat: '1', summaryType: '1'}
            ]
        },
        param () {
            return {loanbillcode: this.currData.billcode, loandefinecode: this.currData.definecode}
        }
    }
}
</script>
