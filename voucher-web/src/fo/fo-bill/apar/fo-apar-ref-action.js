// 应收应付引用按钮
import { registerAction, registerActionConfig, Action, DataState } from '@/components/va-bill'
import iView from 'iview'
import Vue from 'vue'
import AparRefModal from './apar-ref-modal'

// import AparRefConfigModal from './apar-ref-config-modal'
import AparRefConfig from './apar-ref-config'
class AparBillRefAction extends Action {
    getName () {
        return 'bill-ref-apar'
    }
    isEnabled (model, params) {
        return model.state === DataState.NEW || model.state === DataState.EDIT
    }
    async before (model, action) {
        const viewarray = model.define.view.template.children
        const children = viewarray.find(viewarray => viewarray.type === 'v-tool-bar')
        const toolbars = children.children
        const refaction = toolbars.find(toolbars => toolbars.action.type === 'bill-ref-apar')
        const actionparam = refaction.action
        const modeldata = model.data

        const param = {
            modeldata: modeldata,
            action: actionparam
        }
        const data = await this.refBillCheck(model, param)

        if (data.code === 0) {
            // 打开引用界面

            // 查询已引用数据
            let selectiteimids = ''
            if (model.data.FO_APARBILL_REF_ITEM.length !== 0) {
                model.data.FO_APARBILL_REF_ITEM.forEach((item) => {
                    if (selectiteimids.length === 0) {
                        selectiteimids = item.SRCITEMID
                    }
                    selectiteimids = selectiteimids + ',' + item.SRCITEMID
                })
            }

            const component = new Vue({
                render (h) {
                    return h(AparRefModal, {
                        props: {
                            title: '引用数据',
                            refdata: param,
                            model: model,
                            state: model.state,
                            selectiteimids: selectiteimids
                        },
                        on: {
                            'on-ok': (val) => {
                                model.executeAction({
                                    type: 'batch-set-item-value',
                                    model: ['data', 'state'],
                                    params: {
                                        tableName: 'FO_APARBILL_REF_ITEM',
                                        // fieldName: 'SRCITEMID',
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
        } else if (data.code === 501) {
            if (data.data.checkMessages.length > 0) {
                let contentMsg = ''
                for (let obj of data.data.checkMessages) {
                    if (contentMsg === '') {
                        contentMsg = obj.checkMessage
                    } else {
                        contentMsg = contentMsg + '</br>' + obj.checkMessage
                    }
                }
                iView.Modal.error({ title: '提示信息', content: contentMsg })
            } else {
                iView.Modal.error({ title: '提示信息', content: '操作失败' })
            }
        } else if (data.code === 502) {
            iView.Modal.error({ title: '提示信息', content: '按钮配置不能为空' })
        } else {
            return new Promise((resolve, reject) => {
                if (data.rs.msg) {
                    iView.Message.error(data.rs.msg)
                } else {
                    iView.Message.error('发生异常')
                }
                resolve(false)
            })
        }
    }
    async after (model, action) {
        if (action.afterMessage) {
            return super.before(model, action)
        }
        return iView.Message.success('点击引用按钮成功')
    }
    async localInvoke (model) {
        model.state = DataState.NONE
        return true
    }
    async refBillCheck (model, param) {
        let modeldefinecode = ''
        modeldefinecode = model.define.name
        const url = '/api/cfasserver/cfasapar/ref/check/' + modeldefinecode
        let result = await model.api(url, param)
        return result
    }
}

registerAction(new AparBillRefAction())
// 引用按钮配置界面注册到组件中
registerActionConfig(AparRefConfig)
