<template>
    <component :is="componentName" ref="bill" :defineCode="defineCode" :billCode="billCode" :verifyCode="verifyCode"
        :showToolBar="showToolBar"></component>
</template>
<script>
import {Bill, BillRoute, registerComponent} from '@/components/va-bill'
import TravelApplyBill from '@/cfas/cfas-btm/cfas-travelapply-bill'

import './btm/bill-sync-travelorder-actions'
import './btm/bill-travelone-actions'
import '../fo-bill/budget/bill-budget-preview-actions'
import '../fo-bill/budget/bill-budget-save-actions'
import '../fo-bill/workflow/bill-workflow-actions'
import '../fo-bill/image/bill-scanimage-actions'
import '../fo-bill/image/bill-showimage-actions'
import '../fo-bill/apar/fo-stop-action'
import '../fo-bill/apar/fo-start-action'
import '../fo-bill/apar/fo-apar-ref-action'
import '../fo-bill/loanverify/fo-ref-loanbill-action'
import '../fo-bill/invoice/bill-invoice-actions'
import '../fo-bill/ssc/bill-ssc-action'

import VFoInvoiceInspectAction from '../fo-bill/invoice/v-fo-invoice-inspect-action'
import VFoBtmCtripSsoAction from './btm/v-fo-btm-ctrip-sso-action'

registerComponent(VFoInvoiceInspectAction)
registerComponent(VFoBtmCtripSsoAction)
// BillFixedViews['CFAS_B_TRAVELAPPLY'] = TravelApplyBill

export default {
    name: 'fo-bill',
    components: {
        Bill,
        TravelApplyBill
    },
    props: {
        verifyCode: {
            type: String,
            default: ''
        },
        defineCode: String,
        billCode: String,
        dataState: String,
        // 是否预览状态（true时，新建按钮不会路由跳转，删除后单据目前有问题）
        preview: {
            type: Boolean,
            default: false
        },
        // 是否显示工具栏
        showToolBar: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            componentName: BillRoute,
            billDefine: null,
            billData: null,
            routeTab: ''
        }
    }
}
</script>
