<!--单据影像扫描界面-->
<template>
    <div>
        <div class="ivu-modal-header" style="margin: -16px -20px 0 -20px;">
            <div class="ivu-modal-header-inner">提示信息</div>
        </div>
        <div style="font-size: 21px;font-weight: bold;padding: 16px;">影像扫描中<span class="ani_dot">...</span></div>
    </div>
</template>

<script>
export default {
    name: 'fo-image-scan-modal'
}
</script>

<style scoped>
.ani_dot {
    animation: dot 3s infinite step-start;
}

@keyframes dot {
    0% { width: 0; margin-right: 1.5em; }
    33% { width: .5em; margin-right: 1em; }
    66% { width: 1em; margin-right: .5em; }
    100% { width: 1.5em; margin-right: 0;}
}

.ani_dot {
    font-family: simsun;
}
:root .ani_dot {
    display: inline-block;
    width: 1.5em;
    vertical-align: bottom;
    overflow: hidden;
}
</style>
