// 单据按钮扩展：预算保存按钮，预览预算执行按钮，影像扫描按钮，影像查看按钮
import { registerAction, Action, DataState } from '@/components/va-bill'

import FoImageScanModal from './fo-image-scan-modal'
import iView from 'iview'

class BillScanImageAction extends Action {
    getName () {
        return 'bill-scanimage'
    }
    isEnabled (model, params) {
        return model.state === DataState.BROWSE && (model.BILLSTATE === 0 || model.BILLSTATE === 33)
    }
    async before (model, action) {
        try {
            const params = {}
            for (let key in model.data) {
                const {UNITCODE, BILLCODE, BILLDATE, MEMO, STAFFCODE, BILLMONEY, DEFINECODE} = model.data[key][0]
                params.unitcode = UNITCODE && UNITCODE.name ? UNITCODE.name : UNITCODE
                params.barcode = BILLCODE
                params.billcode = BILLCODE
                params.billDate = BILLDATE
                params.billmark = MEMO
                params.billusercode = STAFFCODE && STAFFCODE.name ? STAFFCODE.name : STAFFCODE
                params.billmoney = BILLMONEY
                params.billtype = DEFINECODE
                break
            }
            const request = {sessionid: 98, dataList: [params]}
            const {code, msg, data} = await model.api('/api/cfasserver/eis/client/imagescan', request)
            if (code === 0) {
                if (!data.token) {
                    model.message('token为空')
                    return
                }
                if (!params.billcode) {
                    model.message('单据编号为空')
                    return
                }
                const url = `jqimage://${data.url}?sessionid=98&typeflag=3&barcode=${params.billcode}&token=${data.token}`
                window.location.href = url
                iView.Modal.confirm({
                    okText: '扫描完成',
                    cancelText: '关闭',
                    width: 520,
                    render: (h) => {
                        return h(FoImageScanModal)
                    },
                    onOk: async () => {
                        try {
                            let defineCode
                            let billcode
                            for (const tableName in model.data) {
                                if (model.data[tableName][0].DEFINECODE) {
                                    defineCode = model.data[tableName][0].DEFINECODE
                                    billcode = model.data[tableName][0].BILLCODE
                                    break
                                }
                            }
                            // const {data} = await model.api(`/api/cfasserver/bill/data/${defineCode}/${billcode}/get`, {})
                            // const newData = {data, state: 3}
                            // model.reset(newData)
                            model.executeAction({
                                type: 'bill-load',
                                model: ['data', 'state'],
                                params: {
                                    definecode: defineCode,
                                    code: billcode
                                }
                            })
                            iView.Message.success('单据已刷新')
                            fetch('http://localhost:9780/close', {mode: 'no-cors'})
                        } catch (e) {
                            iView.Message.error(`单据刷新失败：${e.message}`)
                            throw new Error(e.message)
                        }
                    },
                    onCancel: () => {
                        fetch('http://localhost:9780/close', {mode: 'no-cors'})
                    }
                })
            } else {
                model.message(msg)
            }
        } catch (e) {
            iView.Message.error(`打开客户端失败：${e.message}`)
            throw new Error(e.message)
        }
    }
}

registerAction(new BillScanImageAction())
