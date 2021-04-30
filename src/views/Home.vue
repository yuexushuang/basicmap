<!--首页-->
<template>
  <div class="home">
    <MainMap></MainMap>
  </div>
</template>

<script>
  import MainMap from "../components/test/MainMap";

  export default {
    name: 'Home',
    components: {
      MainMap
    }
  }
</script>
<style scoped>
  .home {
    height: 100%;
    width: 100%;
  }
</style>