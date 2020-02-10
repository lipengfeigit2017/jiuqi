<!--入口-->
<template>
    <div></div>
</template>

<script>
export default {
    name: 'index',
    async created () {
        try {
            const {data: config} = await this.$http.get('static/config.json')
            if (config && config.defaultLoginPath) {
                this.$router.push(config.defaultLoginPath)
            } else {
                this.$router.push('/login')
            }
        } catch (e) {
            this.$router.push('/login')
        }
    }
}
</script>

<style scoped>

</style>
