// 单据启用按钮
import { registerAction, Action } from '@/components/va-bill'
import iView from 'iview'

class BillStartAction extends Action {
    getName () {
        return 'bill-start'
    }
    isEnabled (model, params) {
        if (model.master) {
            return model.BILLSTATE === 130 && model.master.STOPFLAG === 1
        } else {
            return false
        }
    }
    async after (model, action) {
        return iView.Message.success('启用成功')
    }
}

registerAction(new BillStartAction())
