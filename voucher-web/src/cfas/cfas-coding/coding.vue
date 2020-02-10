<template>
  <div class="bgwhite">
    <div class="horizontalVertical">
      <img src="../../assets/images/coding.png" alt="">
      <!-- <div class="bulidingtext">
        功能建设中...
      </div> -->
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style>
  .bgwhite{
    background: #fff;
    width: 100%;
    height: 100%;
  }
  .horizontalVertical{
    position: absolute;
    width: 200px;
    height: 250px;
    left: 50%;
    top: 50%;
    margin-left: -100px;
    margin-top: -125px;
  }

  .horizontalVertical img{
    width: 200px;
  }

  .bulidingtext{
    height: 30px;
    line-height: 30px;
    color: #888888;
    font-size: 14px;
    text-align: center;
  }
</style>
