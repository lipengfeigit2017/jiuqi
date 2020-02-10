/* eslint-disable */
import Mock from 'mockjs'

// 消费类型（款项性质）
Mock.mock('/api/mock/basedata/expensekind', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 1, pid: 0, name: 1, title: '应收款项类型', isLeaf: false },
            {id: 1001, pid: 1, name: 1001, title: '物业管理费', isLeaf: true },
            {id: 1002, pid: 1, name: 1002, title: '车位管理费', isLeaf: true },
            {id: 1003, pid: 1, name: 1003, title: '房屋租金', isLeaf: true },
            {id: 1004, pid: 1, name: 1004, title: '车位租金', isLeaf: true },
            {id: 2, pid: 0, name: 2, title: '应付款项类型', isLeaf: false },
            {id: 2001, pid: 2, name: 1001, title: '大厦物料消耗品', isLeaf: true },
            {id: 2002, pid: 2, name: 1002, title: '餐厅物料消耗品', isLeaf: true },
            {id: 2003, pid: 2, name: 1003, title: '咖啡厅物品', isLeaf: true },
            {id: 2004, pid: 2, name: 1004, title: '周转材料其他', isLeaf: true },
        ]
    })
})

// 组织机构
Mock.mock('/api/mock/basedata/org', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 1, pid: 0, name: '1000', title: '久其集团', isLeaf: false },
            {id: 2, pid: 1, name: '2000', title: '久其股份', isLeaf: false },
            {id: 3, pid: 2, name: '3001', title: '企业事业本部', isLeaf: true },
            {id: 4, pid: 2, name: '3001', title: '产品中心', isLeaf: true },
            {id: 5, pid: 2, name: '3001', title: '信息中心', isLeaf: true },
        ]
    })
})

// 部门
Mock.mock('/api/mock/basedata/dept', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 3, pid: 0, name: '3001', title: '研发一部', isLeaf: true },
            {id: 4, pid: 0, name: '3002', title: '研发二部', isLeaf: true },
            {id: 5, pid: 0, name: '3003', title: '研发三部', isLeaf: true },
            {id: 6, pid: 0, name: '3004', title: '研发四部', stopFlag: 1, isLeaf: true },
            {id: 7, pid: 0, name: '3005', title: '研发五部', isLeaf: true }
        ]
    })
})

// 职员
Mock.mock('/api/mock/basedata/staff', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 1, pid: 0, name: '1001', title: '研发一部职员', isLeaf: true },
            {id: 2, pid: 0, name: '1002', title: '研发二部职员', isLeaf: true },
            {id: 3, pid: 0, name: '1003', title: '研发三部职员', isLeaf: true },
            {id: 4, pid: 0, name: '1004', title: '研发四部职员', stopFlag: 1, isLeaf: true },
            {id: 5, pid: 0, name: '1005', title: '研发五部职员', isLeaf: true }
        ]
    })
})

// 客商
Mock.mock('/api/mock/basedata/custsupplier', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 1, pid: 0, name: '010', title: '企业', isLeaf: true },
            {id: 2, pid: 0, name: '020', title: '个体工商户', isLeaf: true },
            {id: 3, pid: 0, name: '030', title: '自然人', isLeaf: true },
            {id: 4, pid: 0, name: '040', title: '内部', isLeaf: true },
            {id: 5, pid: 0, name: '050', title: '外部', isLeaf: true }
        ]
    })
})

// 币别
Mock.mock('/api/mock/basedata/currency', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 1, name: 'CNY', title: '人民币' },
            {id: 2, name: 'HKD', title: '港元' },
            {id: 3, name: 'USD', title: '美元' },
            {id: 4, name: 'EUR', title: '欧元' },
            {id: 5, name: 'JPY', title: '日元' },
        ]
    })
})

// 项目
Mock.mock('/api/mock/basedata/project', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 1, name: '1001', title: '云报账项目' },
            {id: 2, name: '1002', title: '费控项目' },
            {id: 3, name: '1003', title: '预算项目' },
            {id: 4, name: '1004', title: '核算项目' },
        ]
    })
})

// 职务
Mock.mock('/api/mock/basedata/position', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 1, name: '1001', title: '投资管理岗' },
            {id: 2, name: '1002', title: '预算管理岗' },
            {id: 3, name: '1003', title: '安全管理岗' },
            {id: 4, name: '1004', title: '质量管理岗' },
        ]
    })
})

// 火车坐席
Mock.mock('/api/mock/basedata/trainseat', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 1, name: '01', title: '一等座' },
            {id: 2, name: '02', title: '软卧' },
            {id: 3, name: '03', title: '动卧' },
            {id: 3, name: '04', title: '二等座' },
        ]
    })
})

// 火车席等级
Mock.mock('/api/mock/basedata/traintgrade', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 1, name: '01', title: '一等' },
            {id: 2, name: '02', title: '二等' },
            {id: 3, name: '03', title: '三等' },
        ]
    })
})

// 飞机舱位
Mock.mock('/api/mock/basedata/aircraftcabin', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 1, name: '01', title: '头等舱' },
            {id: 2, name: '02', title: '公务舱' },
            {id: 3, name: '03', title: '经济舱' },
        ]
    })
})

// 交通方式
Mock.mock('/api/mock/basedata/vehicles', 'post', options=> {
    return Mock.mock({
        data: [
            {id: 1, name: '01', title: '飞机' },
            {id: 1, name: '02', title: '火车' },
            {id: 1, name: '03', title: '其他' }
        ]
    })
})

Mock.mock('/api/va-basedata', 'post', options=> {
    return Mock.mock({
        data: [
            {id: '1', name: '1000', title: '久其集团',
                children: [
                    {id: '2', name: '2000', title: '久其股份',
                        children: [
                            {id: '3', name: '3001', title: '研发一部'},
                            {id: '4', name: '3002', title: '研发二部'},
                            {id: '5', name: '3003', title: '研发三部'},
                            {id: '6', name: '3004', title: '研发四部', stopFlag: 1},
                            {id: '7', name: '3005', title: '研发五部'}
                        ]
                    }
                ]
            }
        ]
    })
})

Mock.mock('/api/xflx', 'post', options=> {
    return Mock.mock({
        data: /*[
            {
                "id": 100,
                "parentId": null,
                "name": "一级目录",
                "size": null,
                "type": "0",
                "createTime": 1550923830095,
                "updateTime": 1551923830095
            },
            {
                "id": 101,
                "parentId": 100,
                "name": "二级目录",
                "size": null,
                "type": "0",
                "createTime": 1550923830095,
                "updateTime": 1552923830095
            },
            {
                "id": 10100,
                "parentId": 101,
                "name": "文件10100.pdf",
                "size": 218,
                "type": "1",
                "createTime": 1550923830095,
                "updateTime": 1553924830095
            },
            {
                "id": 10101,
                "parentId": 101,
                "name": "文件10101.excel",
                "size": 512,
                "type": "1",
                "createTime": 1550923830095,
                "updateTime": 1550925830095
            },
            {
                "id": 102,
                "parentId": 100,
                "name": "文件102.word",
                "size": 101024,
                "type": "1",
                "createTime": 1550923830095,
                "updateTime": 1550963830095
            },
            {
                "id": 200,
                "parentId": null,
                "name": "我的文件",
                "size": null,
                "type": "0",
                "createTime": 1550923830095,
                "updateTime": 1550983830095
            },
            {
                "id": 201,
                "parentId": 200,
                "name": "文件201.zip",
                "size": 1024,
                "type": "1",
                "createTime": 1550923830095,
                "updateTime": 1550927830095
            },
            {
                "id": 202,
                "parentId": 200,
                "name": "文件202.text",
                "size": 4096,
                "type": "1",
                "createTime": 1550923830095,
                "updateTime": 1550926830095
            },
            {
                "id": 301,
                "parentId": null,
                "name": "文件301.zip",
                "size": 4024,
                "type": "1",
                "createTime": 1550923830095,
                "updateTime": 1550823830095
            }
        ]*/
        [
            {id: 1, pid: 0, name: '1000', title: '久其集团', isLeaf: false },
            {id: 2, pid: 1, name: '2000', title: '久其股份', isLeaf: false },
            {id: 3, pid: 2, name: '3001', title: '研发一部', isLeaf: true },
            {id: 4, pid: 2, name: '3002', title: '研发二部', isLeaf: true },
            {id: 5, pid: 2, name: '3003', title: '研发三部', isLeaf: true },
            {id: 6, pid: 2, name: '3004', title: '研发四部', stopFlag: 1, isLeaf: true },
            {id: 7, pid: 2, name: '3005', title: '研发五部', isLeaf: true }
        ]
    })
})
