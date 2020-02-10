// 单据按钮扩展：预算保存按钮，预览预算执行按钮，影像扫描按钮，影像查看按钮
import { registerAction, Action, DataState } from '@/components/va-bill'

import FoImageShowModal from './fo-image-show-modal'
import Vue from 'vue'

class BillShowImageAction extends Action {
    getName () {
        return 'bill-showimage'
    }
    isEnabled (model, params) {
        let imageState
        if (model.master) {
            imageState = model.master.IMAGESTATE && model.master.IMAGESTATE.name
        }
        /* eslint-disable eqeqeq */
        return model.state === DataState.BROWSE && parseInt(imageState) > 1
    }
    // openPostWindow (url, params) {
    //     const newWin = window.open()
    //     let formStr = ''
    //     设置样式为隐藏，打开新标签再跳转页面前，如果有可现实的表单选项，用户会看到表单内容数据
    // formStr = '<form style="visibility:hidden;" method="POST" action="' + url + '">' +
    //     '<input type="hidden" name="params" value="' + params + '" />' +
    //     '</form>'
    // newWin.document.body.innerHTML = formStr
    // newWin.document.forms[0].submit()
    // return newWin
    // }
    async before (model, action) {
        const params = {approvalflag: 1, downloadflag: 1, printflag: 1}
        for (let key in model.data) {
            const {CREATEUSER, BILLCODE} = model.data[key][0]
            params.barcode = BILLCODE
            params.username = CREATEUSER
            break
        }
        const {code, url, msg} = await model.api(`/api/cfasserver/eis/client/showimage?barcode=${params.barcode}`, {})
        if (code === 0) {
            const component = new Vue({
                render (h) {
                    return h(FoImageShowModal, {
                        props: {
                            url
                        },
                        on: {
                            'on-ok': () => {
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
        } else {
            model.message(msg)
        }
    }
}

registerAction(new BillShowImageAction())
