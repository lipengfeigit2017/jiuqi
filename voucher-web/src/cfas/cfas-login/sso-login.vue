<script>
import {SystemPageOptionApi} from '@/api/va'
export default {
    async mounted () {
        // let username = sessionStorage.useranme
        // const {data: userInfo} = await this.$http.post('/api/vmclient/user/get', {username})
        // this.$store.commit('setTagNavList', [])
        // this.$store.commit('setCurrUsername', userInfo.name || username)

        const {data: options} = await this.$http.post(SystemPageOptionApi.list, {groupName: 'systemPage'})
        if (options) {
            for (let item of options) {
                if (item.name === 'SYSPAGE0001') {
                    sessionStorage.sys_page_opt = item.val
                }

                if (item.name === 'SYSPAGE0002') {
                    sessionStorage.sys_page_size = item.val
                }
            }
        }

        this.$router.push('/home')
    }
}

</script>
