<template>
  <div>
    <el-avatar :src='url == null ? defaultAvatar : url' size="medium"
               style="margin-top: 10px"></el-avatar>
  </div>

</template>

<script>
export default {
  name: "Avatar",
  props: ['url'],
  methods:{
    testMethod() {
      console.log('test....')
    }
  },
  data() {
    return {
      defaultAvatar: 'https://p3-search.byteimg.com/obj/labis/da0b2c93004dd284a2f9948d0de1e310',
    }
  }
}
</script>

<style scoped>

</style>