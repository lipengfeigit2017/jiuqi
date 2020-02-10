<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {SystemPageOptionApi} from '@/api/va'
export default {
    async mounted () {
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
    }
}

</script>
