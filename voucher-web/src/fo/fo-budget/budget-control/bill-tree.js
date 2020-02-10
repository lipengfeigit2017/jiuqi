export const metaType = {
    group: 'GROUP',
    metaData: 'METADATA',
    module: 'MODULE'
}
var groupdata = []
// 收集模块
function gatherModuleata (nodes, root) {
    for (let node of nodes) {
        if (node.type === metaType.module) {
            let newNode = {
                id: node.moduleName,
                name: node.name,
                text: node.title,
                moduleName: node.moduleName,
                parentName: root.uniqueCode,
                type: node.type,
                groupName: node.groupName,
                uniqueCode: node.uniqueCode,
                children: []
            }
            root.children.push(newNode)
            gatherTopGroup(nodes, newNode)
        }
    }
}
// 收集一级分组
function gatherTopGroup (nodes, moduleNode) {
    for (let node of nodes) {
        if (node.type === metaType.group && node.moduleName === moduleNode.name &&
        (node.parentName === '' || node.parentName == null)) {
            let newNode = {
                id: node.moduleName + '-' + node.name + '#',
                name: node.name,
                text: node.title,
                moduleName: node.moduleName,
                parentName: moduleNode.uniqueCode,
                type: node.type,
                groupName: node.groupName,
                uniqueCode: node.uniqueCode,
                children: []
            }
            moduleNode.children.push(newNode)
            gatherMetaInfo(nodes, newNode)
            gatherGroups(nodes, newNode)
        }
    }
}
// 收集分组
function gatherGroups (nodes, pNode) {
    for (let node of nodes) {
        if (node.type === metaType.group && node.moduleName === pNode.moduleName && node.parentName === pNode.name) {
            let newNode = {
                id: node.moduleName + '-' + node.name + '#',
                name: node.name,
                text: node.title,
                moduleName: node.moduleName,
                parentName: pNode.uniqueCode,
                type: node.type,
                groupName: node.groupName,
                uniqueCode: node.uniqueCode,
                children: []
            }
            pNode.children.push(newNode)
            gatherMetaInfo(nodes, newNode)
            gatherGroups(nodes, newNode)
        }
    }
}
// 收集元数据
function gatherMetaInfo (nodes, pNode) {
    for (let node of nodes) {
        if (node.type === metaType.metaData && node.moduleName === pNode.moduleName && node.groupName === pNode.name) {
            let newNode = {
                id: node.moduleName + '-' + node.name,
                name: node.name,
                text: node.title,
                moduleName: node.moduleName,
                parentName: pNode.parentName,
                type: node.type,
                groupName: node.groupName,
                uniqueCode: node.uniqueCode,
                children: []
            }
            pNode.children.push(newNode)
        }
    }
}
export function createMetaTree (rows) {
    // 创建根节点
    let rootNode = {
        id: 'meta-type-bill',
        name: 'bill',
        text: '单据',
        moduleName: '-',
        parentName: '-',
        type: 'METATYPE',
        groupName: '-',
        uniqueCode: 'bill',
        children: []
    }
    gatherModuleata(rows, rootNode)
    groupdata = []
    groupdata.push(rootNode)
    return groupdata
    // getFristChrildren(rootNode, null)
}
