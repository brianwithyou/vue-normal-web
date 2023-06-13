<template>
  <div v-show="!isMobile">
    <slot />
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      isMobile: false
    }
  }
}
</script>

<style scoped>

</style>