// 单据按钮扩展：预算保存按钮，预览预算执行按钮，影像扫描按钮，影像查看按钮
import { registerAction, Action, DataState } from '@/components/va-bill'

class BillBudgetPreviewAction extends Action {
    getName () {
        return 'bill-budget-preview'
    }
    isEnabled (model, params) {
        if (model.master) {
            return model.state === DataState.NEW || model.state === DataState.EDIT || model.state === DataState.BROWSE
        } else {
            return false
        }
    }
    async before (model, action) {
        // const data = await this.budgetpreview(model)

        // if (data.rs.code === 0) {
        //     if (data.rs.type === 3) {
        //         return new Promise((resolve, reject) => {
        //             // model.message('单据无预算占用信息')
        //             iView.Message.error('单据无预算占用信息')
        //             resolve(false)
        //         })
        //     }

        //     return new Promise((resolve, reject) => {
        //         iView.Modal.info({
        //             width: 50,
        //             scrollable: true,
        //             closable: true,
        //             onOk: () => {
        //                 resolve(false)
        //             },
        //             onCancel: () => {
        //                 resolve(false)
        //             },
        //             render: function (createElement) {
        //                 return createElement(
        //                     BudgetModal, {
        //                         props: {
        //                             title: '提示信息',
        //                             budgetdata: data.rows,
        //                             action: 'preview'
        //                         }
        //                     }
        //                 )
        //             }
        //         })
        //     })
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
        //             // model.message(data.rs.msg)
        //             iView.Message.error(data.rs.msg)
        //         } else {
        //             // model.message('发生异常')
        //             iView.Message.error('发生异常')
        //         }

        //         resolve(false)
        //     })
        // }
        return super.before(model, action)
    }
    async after (model, action) {
        return super.after(model, action)
    }
    async localInvoke (model) {
        model.state = DataState.NONE
        return true
    }

    async budgetpreview (model) {
        let modeldefinecode = ''
        modeldefinecode = model.define.name
        const url = '/api/cfasserver/cfasfo/budCtrlPolicy/' + modeldefinecode + '/preview/' + model.state
        const param = model.data

        let result = await model.api(url, param)
        return result
    }
}

registerAction(new BillBudgetPreviewAction())
