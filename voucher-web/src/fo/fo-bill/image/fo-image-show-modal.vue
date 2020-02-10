<!--单据影像查看界面-->
<template>
    <Modal title="影像查看" :value="true" fullscreen @on-cancel="handleCancel">
        <form ref="form1" target="target1" method="post"></form>
        <iframe width="100%" height="99%" scrolling="no" frameborder="0" name="target1"></iframe>
        <div slot="footer">
            <Button type="primary" @click="handleOk">关闭</Button>
        </div>
    </Modal>
</template>

<script>
export default {
    name: 'fo-image-show-modal',
    props: {
        url: String
    },
    mounted () {
        const dom = this.$refs.form1
        dom.setAttribute('action', this.url)
        this.$nextTick(() => {
            dom.submit()
        })
    },
    methods: {
        handleOk () {
            this.$emit('on-ok')
        },
        handleCancel () {
            this.$emit('on-cancel')
        }
    }
}
</script>
