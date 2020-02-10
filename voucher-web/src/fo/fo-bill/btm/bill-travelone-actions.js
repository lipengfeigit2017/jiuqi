// 事前审批按钮（同步差旅订单）
import { registerAction, Action, DataState } from '@/components/va-bill'

class BillSycnTroTravelOrderAction extends Action {
    getName () {
        return 'bill-sync-travelorder-tro'
    }
    isEnabled (model, params) {
        return model.state === DataState.BROWSE && model.BILLSTATE === 130
    }
}

class BillTroSSoAction extends Action {
    getName () {
        return 'bill-btm-sso-tro'
    }
    isEnabled (model, params) {
        return model.state === DataState.BROWSE
    }
}

registerAction(new BillSycnTroTravelOrderAction())
registerAction(new BillTroSSoAction())
