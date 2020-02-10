// 单据启用按钮
import { registerAction, registerActionConfig, Action, DataState } from '@/components/va-bill'
import FoRefLoanBillConfig from './fo-ref-loanbill-config'
import FoRefLoanBillModal from './fo-ref-loanbill-modal'
import Vue from 'vue'
import iView from 'iview'
import vaWeb from 'va-web'

class FoRefLoanBillAction extends Action {
    getName () {
        return 'fo-ref-loanbill'
    }
    isEnabled (model, params) {
        return model.state === DataState.NEW || model.state === DataState.EDIT
    }
    localInvockWaitingActions (model) {
        model.waitingActions.forEach(o => {
            const localAction = vaWeb.actions[o.action.type] || vaWeb.actions['_local_']
            localAction.execute(model, o.action)
        })
    }
    async before (model, action) {
        this.localInvockWaitingActions(model)
        if (!action.params || action.params === '') {
            iView.Message.error('按钮参数未配置')
            return
        }
        // const actionparam = JSON.parse(action.params)
        const actionparam = action.params
        const loandimension = actionparam.loandimension
        if (loandimension && loandimension.length > 0) {
            let contentMsg = ''
            for (let i in loandimension) {
                let field = model.define.masterTable.fields[loandimension[i]]
                let value = model.master[loandimension[i]]
                if (!value) {
                    if (contentMsg === '') {
                        contentMsg = field.title + '不能为空'
                    } else {
                        contentMsg = contentMsg + ('</br>' + field.title + '不能为空')
                    }
                }
            }
            if (contentMsg !== '') {
                iView.Modal.confirm({
                    title: '提示信息',
                    content: contentMsg
                })
                return
            }
        }
        // 获取子表已选数据列表
        let items = []
        if (model.data.FO_EXPENSEBILL_LOANITEM && model.data.FO_EXPENSEBILL_LOANITEM.length > 0) {
            model.data.FO_EXPENSEBILL_LOANITEM.forEach((item) => {
                items.push(item.LOANBILLID)
            })
        }
        const component = new Vue({
            render (h) {
                return h(FoRefLoanBillModal, {
                    props: {
                        title: '引用数据',
                        model: model,
                        state: model.state,
                        queryparam: actionparam,
                        items: items
                    },
                    on: {
                        'on-ok': (val) => {
                            model.executeAction({
                                type: 'fo-insert-loanbill',
                                model: ['data', 'state'],
                                params: {
                                    value: val
                                }
                            })
                            this.$children[0].visible = false
                            this.$destroy()
                            document.body.removeChild(this.$el)
                        },
                        'on-cancel': () => {
                            this.$children[0].visible = false
                            this.$destroy()
                            document.body.removeChild(this.$el)
                        }
                    }
                })
            }
        }).$mount()
        document.body.appendChild(component.$el)
    }
}

registerAction(new FoRefLoanBillAction())
registerActionConfig(FoRefLoanBillConfig)
