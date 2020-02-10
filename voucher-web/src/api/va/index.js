const prefix = '/api'

// 登录模块api
export const vaLoginApi = {
    // 登录
    login: `${prefix}/vmclient/login`,
    // 登出
    logout: `${prefix}/vmclient/logout`,
    // 获得登录机构
    getLoginUnit: `${prefix}/vmclient/getLoginUnit`,
    // 修改登录机构
    changeLoginUnit: `${prefix}/vmclient/changeLoginUnit`,
    // 获得登录日期
    getLoginDate: `${prefix}/vmclient/getLoginDate`,
    // 修改登录日期
    changeLoginDate: `${prefix}/vmclient/changeLoginDate`
}

export const SystemPageOptionApi = {
    list: `${prefix}/vmclient/option/item/list`
}

// 基础数据模块api
export const vaBaseDataApi = {
    // 基础数据
    basedata: `${prefix}/vmclient/baseData`
    // basedata: 'basedata/vmclient/baseData'
}
// 功能菜单api
export const vaMenuApi = {
    // 获得当前登录用户有权限的功能菜单列表
    getMenus: `${prefix}/vmclient/menu/my`
}

// 组织机构管理模块api
export const vaOrganizationApi = {

    // 组织机构类型
    orgCategory: `${prefix}/vmclient/org/category`,
    // 组织机构版本
    orgVersion: `${prefix}/vmclient/org/version`,
    // 组织机构数据
    organization: `${prefix}/vmclient/org/data`
}

// 预算编制模块api
export const budgetApi = {
    input: `${prefix}/cfasserver/budget/input`
}

// 职员管理模块api
export const vaStaffApi = {
    getDepartList: `${prefix}/vmclient/staff/getDepartList`
}
// 数据建模api
export const vaDataModal = {
    get: `${prefix}/vmclient/dataModel/get`
}

export const cfasBudconApi = {
    list: `${prefix}/cfasserver/budControl/list`,
    add: `${prefix}/cfasserver/budControl/add`,
    delete: `${prefix}/cfasserver/budControl/delete`,
    update: `${prefix}/cfasserver/budControl/update`,
    listBillDefine: `${prefix}/cfasserver/budControl/listBillModel`,
    existExenum: `${prefix}/cfasserver/budControl/existExenum`
}

export default {
    vaLoginApi,
    vaMenuApi
}
