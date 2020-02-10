// 单据启用按钮
import { registerAction, Action } from '@/components/va-bill'

class BillStartAction extends Action {
    getName () {
        return 'bill-send-ssc'
    }
    isEnabled (model, params) {
        const { BILLSTATE } = model
        if (isNaN(BILLSTATE)) {
            if (model.master) {
                return (model.master.BILLSTATE === 129 || model.master.BILLSTATE === 130) & (model.master.SSCSENDFLAG === null || model.master.SSCSENDFLAG === false ||
                    (model.master.SSCSENDFLAG === true && model.master.SSCREJECTFLAG !== 0 & model.master.SSCREJECTFLAG !== null))
            } else {
                return false
            }
        } else {
            if (model.master) {
                return (BILLSTATE === 129 || BILLSTATE === 130) & (model.master.SSCSENDFLAG === null || model.master.SSCSENDFLAG === false ||
                    (model.master.SSCSENDFLAG === true && model.master.SSCREJECTFLAG !== 0 & model.master.SSCREJECTFLAG !== null))
            } else {
                return false
            }
        }
    }
    async after (model, action) {

    }
}

registerAction(new BillStartAction())
