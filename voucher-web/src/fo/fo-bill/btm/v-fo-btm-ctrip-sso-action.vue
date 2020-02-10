<template>
    <div>
        <Button :disabled="!readonly" type="primary" ghost @click.stop="handleBtmCtripSSO">{{title}}</Button>
    </div>
</template>
<script>
import { DataState } from '@/components/va-bill'

export default {
    name: 'v-fo-btm-ctrip-sso-action',
    props: {
        model: Object,
        template: Object
    },
    computed: {
        title () {
            return this.template.title
        },
        readonly () {
            const {model} = this
            return model.state === DataState.BROWSE && model.BILLSTATE === 130 && model.master.ORDERFLAG === 1
        }
    },
    methods: {
        async handleBtmCtripSSO () {
            try {
                const { data } = await this.$http.post('/api/cfasserver/cfasfo/btm/ctrip/sso', {})
                if (data.code === 0) {
                    const newWindow = window.open('')
                    newWindow.document.write(data.msg)
                    newWindow.document.close()
                } else {
                    this.$Message.error('打开失败：' + data.msg)
                }
            } catch (e) {
                this.$Message.error('打开失败：' + e.message)
                throw new Error(e)
            }
        }
    }
}
</script>
