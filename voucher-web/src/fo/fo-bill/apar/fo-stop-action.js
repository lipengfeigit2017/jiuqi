// 单据停用按钮
import { registerAction, Action } from '@/components/va-bill'
import iView from 'iview'

class BillStopAction extends Action {
    getName () {
        return 'bill-stop'
    }
    isEnabled (model, params) {
        if (model.master) {
            return model.BILLSTATE === 130 && model.master.STOPFLAG === 0
        } else {
            return false
        }
    }
    async after (model, action) {
        return iView.Message.success('停用成功')
    }
}

registerAction(new BillStopAction())
