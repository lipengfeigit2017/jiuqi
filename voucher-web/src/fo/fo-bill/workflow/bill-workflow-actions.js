// 单据工作流按钮扩展：流程查看按钮，流程提交按钮，提交SSC任务按钮
import { registerAction, Action, DataState } from '@/components/va-bill'

import workflowModal from './fo-workflow-modal'
import iView from 'iview'

class BillWorkflowAction extends Action {
    getName () {
        return 'bill-workflow'
    }
    isEnabled (model, params) {
        // if (model.master) {
        //     return model.master.BILLSTATE >= 8
        // } else {
        //     return false
        // }
        const { BILLSTATE } = model
        if (isNaN(BILLSTATE)) {
            if (model.master) {
                return model.master.BILLSTATE >= 8
            } else {
                return false
            }
        }
        return BILLSTATE >= 8
        // return model.state === DataState.BROWSE && (BILLSTATE === 0 || (BILLSTATE & 1) === 1)

        // return model.BILLSTATE >= 8 // 临时用
        // if (model.master) {
        //     if (model.master.BILLSTATE) {
        //         if (model.master.BILLSTATE.name !== '0') {
        //             return true
        //         } else {
        //             return false
        //         }
        //     } else {
        //         return false
        //     }
        // } else {
        //     return false
        // }
    }
    async before (model, action) {
        const data = await this.loadworkflowdata(model)

        if (data.length !== 0) {
            return new Promise((resolve, reject) => {
                iView.Modal.info({
                    closable: true,
                    onOk: () => {
                        resolve(false)
                    },
                    onCancel: () => {
                        resolve(false)
                    },
                    render: function (createElement) {
                        return createElement(
                            workflowModal, {
                                props: {
                                    title: '流程查看',
                                    processData: data
                                }
                            }

                        )
                    },

                    width: 960

                }
                )
            })
        } else {
            return new Promise((resolve, reject) => {
                iView.Message.error('单据未提交工作流')
                resolve(false)
            })
        }
    }
    async after (model, action) {
        return super.after(model, action)
    }
    async localInvoke (model) {
        model.state = DataState.NONE
        return true
    }

    async loadworkflowdata (model) {
        let param = {extInfo: {bizcode: model.master.BILLCODE}}
        const url = '/api/cfasserver/todo/process/view'
        let result = await model.api(url, param)
        return result
    }
}
class BillSendSSCAction extends Action {
    getName () {
        return 'bill-send-ssc'
    }
    isEnabled (model, params) {
        const { BILLSTATE } = model
        return model.state === DataState.BROWSE && (BILLSTATE === 0 || (BILLSTATE & 1) === 1 || BILLSTATE === 130)
        // if (model.master) {
        //     // 驳回可提交时 提交按钮可用
        //     if ((model.master.BILLSTATE.name === '0' || model.master.BILLSTATE.name === '33' || model.master.BILLSTATE.name === '130') && model.state === DataState.BROWSE) {
        //         return true
        //     } else {
        //         return false
        //     }
        // }
        // return false
    }
    async before (model, action) {
        if (action.beforeMessage) {
            return super.before(model, action)
        }
        return model.confirm({
            title: '提示信息',
            content: '<p>确定要提交当前单据到共享平台吗？</p>'
        })
    }
    async after (model, action) {
        return super.after(model, action)
    }
    async localInvoke (model) {
        model.state = DataState.NONE
        return true
    }
}

registerAction(new BillWorkflowAction())
registerAction(new BillSendSSCAction())
