<template>
    <div>
        <Button v-if="isShow" :disabled="readonly" @click.stop="handleOpenDrawer" type="primary" ghost>{{title}}</Button>
        <Drawer :title="title" width="60" draggable v-model="isShowDrawer">
            <el-table border>
                <el-table-column label="发票类型"></el-table-column>
                <el-table-column label="发票代码"></el-table-column>
                <el-table-column label="发票号码"></el-table-column>
                <el-table-column label="发票状态"></el-table-column>
                <el-table-column label="开票日期"></el-table-column>
                <el-table-column label="金额"></el-table-column>
                <el-table-column label="税率"></el-table-column>
                <el-table-column label="税额"></el-table-column>
                <el-table-column label="价税合计"></el-table-column>
                <el-table-column label="校验码"></el-table-column>
                <el-table-column label="查验成功标识"></el-table-column>
                <el-table-column label="认证标识"></el-table-column>
            </el-table>
            <div class="v-ref-bill-list-footer">
                <Button style="margin-right: 10px" @click="isShowDrawer = false">取消</Button>
                <Button type="primary" @click="handleConfirm">确定</Button>
            </div>
        </Drawer>
    </div>
</template>
<script>
export default {
    name: 'fo-ref-invoice-action',
    props: {
        model: Object,
        template: Object
    },
    data () {
        return {
            isShow: false,
            isShowDrawer: false
        }
    },
    computed: {
        title () {
            return this.template.title
        },
        readonly () {
            return this.model.isReadonly(this.template)
        }
    },
    mounted () {
        this.model.addEventBus('v-tabs-change', this.handleTabsChange)
    },
    beforeDestroy () {
        this.model.removeEventBus('v-tabs-change', this.handleTabsChange)
    },
    methods: {
        handleTabsChange (activeIndex, children) {
            if (['住宿', '交通', '其他'].indexOf(children[activeIndex].title) > -1) {
                this.isShow = true
            } else {
                this.isShow = false
            }
        },
        handleOpenDrawer () {
            this.isShowDrawer = true
        },
        // TODO 映射字段插值
        handleConfirm () {}
    }
}
</script>

<style lang="less" scoped>
.v-ref-bill-list-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
</style>
