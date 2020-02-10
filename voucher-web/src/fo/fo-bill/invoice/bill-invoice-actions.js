// 发票匹配按钮
import { registerAction, Action, DataState } from '@/components/va-bill'

class BillInvoiceMatchingAction extends Action {
    getName () {
        return 'bill-invoice-matching'
    }
    isEnabled (model, params) {
        return model.state === DataState.NEW || model.state === DataState.EDIT
    }
}

registerAction(new BillInvoiceMatchingAction())
