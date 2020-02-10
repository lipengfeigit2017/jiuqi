<template>
    <div>
        <va-toolbar>
            <va-toolbar-item title="新建" @click="addItem" :disabled="!custsupptypecode || custsupptypecode === '' || custsupptypecode === '-'"></va-toolbar-item>
            <va-toolbar-item title="修改" :disabled="!isSelectBaseDataItem" @click="modifyItem"></va-toolbar-item>
            <va-toolbar-item title="上移" :disabled="!isSelectBaseDataItem" @click="upItem"></va-toolbar-item>
            <va-toolbar-item title="下移" :disabled="!isSelectBaseDataItem" @click="downItem"></va-toolbar-item>
            <va-toolbar-item title="停用" :disabled="!isSelectBaseDataItem || (rowData && rowData.stopflag === 1)" @click="stopItem"></va-toolbar-item>
            <va-toolbar-item title="启用" :disabled="!isSelectBaseDataItem || (rowData && rowData.stopflag === 0)" @click="startItem"></va-toolbar-item>
            <va-toolbar-item title="导入" @click="importItem"></va-toolbar-item>
            <va-toolbar-item title="导出" @click="exportItem"></va-toolbar-item>
        </va-toolbar>
    </div>
</template>

<script>
export default {
    name: 'CustsuppToolbar',

    data () {
        return {
            isSelectBaseDataItem: false
        }
    },
    props: {
        currentRowCode: String,
        custsupptypecode: String,
        rowData: Object
    },
    watch: {
        currentRowCode () {
            this.isSelectBaseDataItem = (this.currentRowCode !== null)
        }
    },
    methods: {
        addItem () {
            this.$emit('addcustsupplier')
        },
        modifyItem () {
            this.$emit('modifycustsupplier')
        },
        upItem () {
            this.$emit('baseDataMoveHandel', 'UP')
        },
        downItem () {
            this.$emit('baseDataMoveHandel', 'DOWN')
        },
        stopItem () {
            this.$emit('stopcustsupplieritem')
        },
        startItem () {
            this.$emit('startcustsupplieritem')
        },
        importItem () {
            alert('未实现')
        },
        exportItem () {
            alert('未实现')
        }
    }
}
</script>
