<template>
    <Badge dot :count="count" class="msgTip">
        <Poptip placement="bottom" trigger="hover" v-model="poptip">
            <svg class="icon" aria-hidden="true" style="opacity: 0.6;font-size: 18px;margin: 0 20px 0 0;cursor: pointer;">
                <use xlink:href="#icon_topxiaoxi"></use>
            </svg>
            <div class="api" slot="content" style="width:350px; height:290px; overflow:hidden; padding:0px;">
                <Card :bordered="false" :dis-hover="true" style="width:350px">
                    <p slot="title">
                        消息中心
                    </p>
                    <a href="#" slot="extra" @click.prevent="loadData" style="margin-right:15px;">
                        刷新
                    </a>
                    <a href="#" slot="extra" @click.prevent="showMoreMessage">
                        更多
                    </a>
                    <ul v-if="data.length > 0">
                        <li v-for="item in data" :key="item.id">
                            <a class="msgTitle" href="#" @click="showMsg(item)">
                                {{ item.title }}
                            </a>
                            <span style="color:#bbb;float:right; margin-top: -22px;">
                                {{ item.createtime.substring(5,16) }}
                            </span>
                        </li>
                    </ul>
                    <p style="color:#222;" v-else>您暂时没有未读消息</p>
                </Card>
            </div>
        </Poptip>

        <Modal id="msgModal" v-model="msgModal.show"  :title="msgModal.title" :fullscreen="true"
            class-name="vertical-center-modal" :footer-hide="true"
        >
            <iframe v-if="msgModal.show" :src="msgModal.url" width="100%" height="98%" scrolling="yes" frameborder="0"></iframe>
        </Modal>
    </Badge>
</template>

<script>

export default {
    name: 'va-message',
    data () {
        return {
            param: {
                readStatus: 0,
                pagination: true,
                offset: 0,
                limit: 10
            },
            count: 0,
            poptip: false,
            data: [],
            refreshToken: null,
            msgModal: {
                show: false,
                title: '-',
                url: ''
            }
        }
    },
    mounted () {
        this.loadData()

        this.refreshToken = setInterval(async () => {
            // 间隔5分钟刷新
            this.loadData()
        }, 300000)
    },
    destroyed () {
        if (this.refreshToken != null) {
            clearInterval(this.refreshToken)
        }
    },
    methods: {
        async loadData () {
            this.data = []
            const {data: {rs, total, rows}} = await this.$http.post('/vcserver/anon/message/list', this.param)
            if (rs.code === 0) {
                this.count = total
                this.data = rows
            } else {
                throw new Error(rs.msg)
            }
        },
        showMsg (data) {
            if (data.param) {
                let param = JSON.parse(data.param)
                if (param.url) {
                    let routerMode = this.$router.mode
                    let currUrl = param.url
                    if (currUrl.indexOf('/#/') === 0 && routerMode !== 'hash') {
                        currUrl = currUrl.substr(2)
                    }

                    this.msgModal.url = currUrl
                    this.msgModal.title = data.title
                    this.msgModal.show = true

                    const loading = this.$loading({
                        lock: true
                    })
                    setTimeout(() => {
                        loading.close()
                    }, 1000)
                }
            } else if (data.content) {
                this.$Modal.info({
                    content: '<b style="font-size:15px;margin-left:-20px;">' + data.title + '</b><br>' + data.content
                })
            } else {
                this.$Modal.info({
                    content: '<b style="font-size:15px;margin-left:-20px;">' + data.title + '</b>'
                })
            }

            this.hasRead(data)
        },
        async hasRead (data) {
            const {data: {code, msg}} = await this.$http.post('/vcserver/message/status/update', [{msgid: data.msgid}])
            if (code === 0) {
                this.loadData()
            } else {
                throw new Error(msg)
            }
        },
        showMoreMessage () {
            this.$router.push('/message')
        }
    }
}
</script>

<style>
    .msgTip>.ivu-badge-dot{
        top: 14px;
        right: 8px;
    }
</style>

<style scoped>
    a {
        color:#03A4AD;
    }

    .msgTitle {
        width: 225px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display:block;
    }
</style>
