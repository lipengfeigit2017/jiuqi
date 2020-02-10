/**
 * 商旅协同api
 */
import {prefix} from '@/config'

// 行程申请单单据
export const travelApplyApi = {
    // 新增保存行程申请单
    add: `${prefix}/cfasserver/bill/data/FoTravelApplyBillModel/post`,
    // 修改保存行程申请单
    update: billcode => `${prefix}/cfasserver/bill/data/FoTravelApplyBillModel/${billcode}/put`,
    // 删除行程申请单
    delete: billcode => `${prefix}/cfasserver/bill/data/FoTravelApplyBillModel/${billcode}/delete`,
    // 获取行程申请单
    get: billcode => `${prefix}/cfasserver/bill/data/FoTravelApplyBillModel/${billcode}/get`
}
