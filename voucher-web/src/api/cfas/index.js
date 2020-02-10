const prefix = '/api'

// test
export const testApi = {
    test: `${prefix}/testn`
}

export const cfasTodoApi = {
    // 待办列表
    todo: `${prefix}/cfasserver/task/list`,
    // 流程
    process: `${prefix}/cfasserver/todo/process/view`,
    // 制单人查询
    billmakeusers: `${prefix}/cfasserver/task/users`
}

// 预算审批api
export const budgetAuditApi = {
    // budgetdept: 'budgetdept/cfasserver/budget'
    doAudit: `${prefix}/cfasserver/budget/input/doAudit`
}

// 预算编制模块api
export const budgetApi = {
    input: `${prefix}/cfasserver/budget/input`
}

export default {
    testApi,
    cfasTodoApi
}
