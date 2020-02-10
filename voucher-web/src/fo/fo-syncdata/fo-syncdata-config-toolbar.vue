<template>
    <div>
        <va-toolbar>
            <va-toolbar-item title="新建方案" @click="addScheme" :disabled="!isRoot"></va-toolbar-item>
            <va-toolbar-item title="新建定义" @click="addDefine" :disabled="!isScheme"></va-toolbar-item>
            <va-toolbar-item title="修改" @click="edit" :disabled="state!=='browse' || (currTreeNode && currTreeNode.hasChildren)"></va-toolbar-item>
            <va-toolbar-item title="删除" @click="remove" :disabled="state!=='browse' || (currTreeNode && currTreeNode.hasChildren)"></va-toolbar-item>
            <va-toolbar-item title="保存" @click="save" :disabled="state!=='add'&&state!=='update'"></va-toolbar-item>
            <va-toolbar-item title="数据源配置" @click="dbconfig"></va-toolbar-item>
            <va-toolbar-item title="预览接口报文" @click="exportmsg" :disabled="!isDefine"></va-toolbar-item>
        </va-toolbar>
    </div>
</template>

<script>
export default {
    name: 'FoSyncDataConfigToolbar',
    data () {
        return {
            // 根节点
            isRoot: false,
            // 方案
            isScheme: false,
            // 定义
            isDefine: false
        }
    },
    props: {
        state: '',
        currTreeNode: {}
    },
    watch: {
        currTreeNode () {
            this.isRoot = this.currTreeNode && this.currTreeNode.id === 'root'
            this.isScheme = this.currTreeNode && this.currTreeNode.attributes.type === 'scheme'
            this.isDefine = this.currTreeNode && this.currTreeNode.attributes.type === 'define'
        }
    },
    methods: {
        addScheme () {
            this.$emit('addScheme')
        },
        addDefine () {
            this.$emit('addDefine')
        },
        edit () {
            this.$emit('edit')
        },
        remove () {
            this.$emit('remove')
        },
        save () {
            this.$emit('save')
        },
        dbconfig () {
            this.$emit('dbconfig')
        },
        exportmsg () {
            this.$emit('exportmsg')
        }
    }
}
</script>
