<template>
  <div style="flex-direction: column;" class="card-class">
    <h2 class="hometitle">文章标签统计</h2>
      <div v-loading="loading" style="height: 100px;border-style: none">
        <tag-cloud :data="tags" style="margin-top: 1.5rem;width: auto;height: auto"/>
      </div>
  </div>
</template>

<script>
import {loadTags} from '@/api/WebApi'


export default {
  name: 'SideTagCloud',
  data: function () {
    return {
      loading: true,
      tags: []
    }
  },
  mounted() {

    loadTags().then(res => {
      if (res.data.code === 200) {
        this.tags = res.data.data
        // this.tags = [
        //   {
        //     id: 'item.id',
        //     name: 'item.tagName'
        //   },
        //   {
        //     id: 'item.id1',
        //     name: 'item.tagName2'
        //   }
        // ]
      }
    })
    this.loading = false

  }
}
</script>

<style scoped>

</style>