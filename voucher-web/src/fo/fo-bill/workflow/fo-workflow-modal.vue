<!--单据工作流界面-->
<template>
<div class="fo-tab-content">
<h2>{{title}}</h2>

<VaTimeLine :processData="processData"></VaTimeLine>
        </div>
</template>

<script>

export default {
    name: 'workflowModal',
    props: {
        title: String,
        processData: Array
    },
    data () {
        return {
            simpledata: this.processData
        }
    },
    methods: {

    }
}
</script>

<style scoped>
.fo-tab-content{
    height: 489px;
}
</style>
<style>
.ivu-modal-confirm-footer {
    margin-top: 25px !important;
}
</style>
