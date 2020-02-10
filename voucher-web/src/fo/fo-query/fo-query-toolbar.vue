<template>
    <div>
        <va-toolbar>
            <!-- <va-toolbar-item title="查询" @click="query"></va-toolbar-item> -->
            <va-toolbar-item title="导出" @click="exportdata"></va-toolbar-item>
            <va-toolbar-item title="关闭" @click="close"></va-toolbar-item>
        </va-toolbar>
    </div>
</template>

<script>
export default {
    name: 'FoQueryToolbar',
    methods: {
        query () {
            this.$emit('querydata')
        },
        exportdata () {
            this.$emit('exportdata')
        },
        close () {
            this.$emit('close')
        }
    }
}
</script>
