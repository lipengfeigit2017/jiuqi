// 单据按钮扩展：预算保存按钮，预览预算执行按钮
import { registerAction, Action, DataState } from '@/components/va-bill'

class BillBudgetSaveAction extends Action {
    getName () {
        return 'bill-budget-save'
    }
    isEnabled (model, params) {
        return model.state === DataState.NEW || model.state === DataState.EDIT
    }
    async before (model, action) {
        // const data = await this.budgetcheck(model)

        // if (data.rs.code === 0) {
        //     if (!data.rs.check) {
        //         // 校验失败
        //         if (data.rs.type === 2) {
        //             // 柔性
        //             return new Promise((resolve, reject) => {
        //                 iView.Modal.confirm({
        //                     onOk: async () => {
        //                         super.before(model, action)
        //                         resolve(true)
        //                     },
        //                     onCancel: () => {
        //                         resolve(false)
        //                     },
        //                     width: 50,
        //                     scrollable: true,
        //                     closable: true,
        //                     render: function (createElement) {
        //                         return createElement(
        //                             BudgetModal, {
        //                                 props: {
        //                                     title: '提示信息',
        //                                     budgetdata: data.rows
        //                                 }
        //                             }
        //                         )
        //                     }
        //                 })
        //             })
        //         }
        //         // 刚性
        //         if (data.rs.type === 1) {
        //             return new Promise((resolve, reject) => {
        //                 iView.Modal.info({
        //                     width: 50,
        //                     scrollable: true,
        //                     closable: true,
        //                     onOk: () => {
        //                         resolve(false)
        //                     },
        //                     render: function (createElement) {
        //                         return createElement(
        //                             BudgetModal, {
        //                                 props: {
        //                                     title: '提示信息',
        //                                     budgetdata: data.rows,
        //                                     action: 'check'
        //                                 }
        //                             }
        //                         )
        //                     }
        //                 })
        //             })
        //         }
        //     } else {
        //         return super.before(model, action)
        //     }
        // } else if (data.rs.code === 501) {
        //     if (data.rs.checkMessages.length > 0) {
        //         let contentMsg = ''
        //         for (let obj of data.rs.checkMessages) {
        //             if (contentMsg === '') {
        //                 contentMsg = obj.checkMessage
        //             } else {
        //                 contentMsg = contentMsg + '</br>' + obj.checkMessage
        //             }
        //         }
        //         iView.Modal.error({ title: '提示信息', content: contentMsg })
        //     } else {
        //         iView.Modal.error({ title: '提示信息', content: '操作失败' })
        //     }
        // } else {
        //     return new Promise((resolve, reject) => {
        //         if (data.rs.msg) {
        //             iView.Message.error(data.rs.msg)
        //         } else {
        //             iView.Message.error('发生异常')
        //         }
        //         resolve(false)
        //     })
        // }

        return super.before(model, action)
    }
    // async after (model, action) {
    //     if (action.afterMessage) {
    //         return super.before(model, action)
    //     }
    //     return iView.Message.success('保存成功')
    // }
    async localInvoke (model) {
        model.state = DataState.NONE
        return true
    }

    async budgetcheck (model) {
        let modeldefinecode = ''
        modeldefinecode = model.define.name
        // 主表占预算方法
        const url = '/api/cfasserver/cfasfo/budCtrlPolicy/' + modeldefinecode + '/check/' + model.state
        const param = model.data

        let result = await model.api(url, param)
        return result
    }

    async budgetsave (model, action, data) {
        // 主表占预算方法
        const url = '/api/cfasserver/cfasfo/budCtrlPolicy/save'
        const param = data

        const result = await model.api(url, param)

        if (result.code === 0) {
            // 保存预算成功
            return true
        } else {
            model.message(result.msg)
        }
        return false
    }
}

registerAction(new BillBudgetSaveAction())
