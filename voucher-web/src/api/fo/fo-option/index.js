import {prefix} from '@/config'

// 差旅标准
export const travelControlApi = {
    // 查询差旅标准
    query: `${prefix}/cfasserver/cfasfo/travelcontrol/get`,
    // 保存差旅标准
    save: `${prefix}/cfasserver/cfasfo/travelcontrol/put`
}
