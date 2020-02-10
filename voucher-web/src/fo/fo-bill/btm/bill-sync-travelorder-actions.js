// 事前审批按钮（同步差旅订单）
import { registerAction, Action, DataState } from '@/components/va-bill'
import iView from 'iview'

class BillSycnTravelOrderAction extends Action {
    getName () {
        return 'bill-sync-travelorder'
    }
    isEnabled (model, params) {
        return model.state === DataState.BROWSE && model.BILLSTATE === 130 && model.master.ORDERFLAG === 1
    }
    async before (model, action) {
        try {
            const {BILLCODE, DEFINECODE} = model.master
            const {code, msg} = await model.api('/api/cfasserver/cfasfo/btm/ctrip/syncTravelOrder', {billcode: BILLCODE, definecode: DEFINECODE})
            if (code === 0) {
                iView.Message.success('同步出差申请单成功')
            } else {
                throw new Error(msg)
            }
        } catch (e) {
            iView.Message.error('同步出差申请单失败：系统异常')
        }
    }
}

registerAction(new BillSycnTravelOrderAction())
