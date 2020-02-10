
import {prefix} from '@/config'

// 客商基础数据
export const basedataApi = {
    // 保存客商基础数据
    custsupplier: `${prefix}/cfasserver/baseData/custsupp`
}

// 数据同步
export const syncdataApi = {
    // 数据同步方案配置
    syncdatascheme: `${prefix}/cfasserver/syncdata/scheme/config`,
    // 数据同步定义配置
    syncdatadefine: `${prefix}/cfasserver/syncdata/define/config`,
    // 数据同步数据源配置
    syncdatadbconnect: `${prefix}/cfasserver/syncdata/dbconnect/config`
}

export const foBtm = {
    get: `${prefix}/cfasserver/btm/travelone/setApproval/mapping/get`,
    updata: `${prefix}/cfasserver/btm/travelone/setApproval/mapping/update`,
    syncCache: `${prefix}/cfasserver/btm/travelone/setApproval/mapping/syncCache`
}
