<template>
  <div style="min-height: 500px" class="h-full w-full rounded-2xl relative shadow-xl mb-8" :style="gradientBackground">
    <div
        class="ob-gradient-cut-plate absolute bg-ob-deep-900 rounded-xl opacity-90 flex justify-center  pt-4 px-6 shadow-lg hover:shadow-2xl duration-300"
        data-dia="author" >
      <div class="profile absolute w-full flex flex-col justify-center items-center">
        <div class="flex flex-col justify-center ">
          <h2 class=" pt-4 text-4xl font-semibold text-ob-bright">
            <template>销量排行榜</template>
          </h2>
          <span class="h-1 w-44 rounded-full mt-2" :style="gradientBackground" />
          <p v-if="false"
              class="pt-6 px-10 w-full text-s text-center"
              v-html="websiteConfig.authorIntro" />
          <p v-else class="pt-6 px-10 w-full text-sm text-center flex flex-col gap-2">
<!--            <ob-skeleton :count="2" height="20px" width="10rem" />-->
          </p>
        </div>
        <div class="h-full w-full flex flex-col flex-1 justify-end items-end">
          <ul class="grid grid-cols-4 pt-4 w-full px-2 text-lg">
            <li class="col-span-1 text-center">
              <span class="text-ob-bright">
                11
              </span>
              <p class="text-base">文章</p>
            </li>
            <li class="col-span-1 text-center">
              <span class="text-ob-bright">12</span>
              <p class="text-base">说说</p>
            </li>
            <li class="col-span-1 text-center">
              <span class="text-ob-bright">13</span>
              <p class="text-base">分类</p>
            </li>
            <li class="col-span-1 text-center">
              <span class="text-ob-bright">14</span>
              <p class="text-base">标签</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileCard",
  computed: {
    // 可以从store中动态加载
    gradientBackground() {
      return {background: 'linear-gradient(130deg, #24c6dc, #5433ff 41.07%, #ff0099 76.05%)'}
    }
  }
}
</script>

<style scoped>

</style>