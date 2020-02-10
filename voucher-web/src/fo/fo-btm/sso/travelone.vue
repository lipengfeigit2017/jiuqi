<script>
export default {
    name: 'FoBtmTravelOneSso',
    mounted () {
        this.sso()
    },
    methods: {
        async sso () {
            try {
                setTimeout(() => {
                    if (this.$routerTab.getObj().items.forEach(element => {
                        if (element.id === '/btm-sso-travelone') {
                            this.$routerTab.getObj().close('/btm-sso-travelone')
                            this.$Message.error('打开失败：连接超时')
                        }
                    }));
                }, 2000)
                const { data } = await this.$http.post('/api/cfasserver/btm/travelone/singleSign', {})
                if (data.code === 0) {
                    window.open(data.msg, false)
                } else {
                    this.$Message.error('打开失败：' + data.msg)
                }
            } finally {
                if (this.$routerTab.getObj().items.forEach(element => {
                    if (element.id === '/btm-sso-travelone') {
                        this.$routerTab.getObj().close('/btm-sso-travelone')
                    }
                }));
            }
        }
    }
}
</script>
