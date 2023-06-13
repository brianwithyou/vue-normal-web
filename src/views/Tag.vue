<template>
  <div class="flex flex-col color-background">
    <div class="post-header">
      <h1 class="post-title text-white uppercase">标签</h1>
    </div>
    <div class="bg-ob-deep-800 px-14 py-16 rounded-2xl shadow-xl block ml-3 mr-3" style="">
      <div class="flex justify-event flex-wrap pt-2">
        <template v-if="tags !== '' && tags.length > 0">
<!--          <TagItem v-for="tag in tags" :key="tag.id" :id="tag.id" :name="tag.tagName" :count="tag.count" size="xl" />-->
          <div v-for="(tag in tags" class="flex flex-row items-center hover:opacity-50 mr-2 mb-2 cursor-pointer transition-all">
            <div
                class="bg-ob-deep-900 text-center px-3 py-1 rounded-tl-md rounded-bl-md text-sm"
                :style="stylingTag(tag)">
              <em class="opacity-50">#</em>
              {{ tag.name }}
            </div>
            <span
                class="bg-ob-deep-900 text-ob-secondary text-center px-2 py-1 rounded-tr-md rounded-br-md text-sm opacity-70"
                :style="stylingTag(tag)">
                {{ tag.count }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {listTagsApi} from "@/api/WebApi";

export default {
  name: "Tag",
  data() {
    return {
      tags: [
        {
          id: 1,
          name: 'Java',
          count: '2'
        }
        ]
    }
  },
  methods: {
    stylingTag (item) {
      // let tagSize = item.count
      // if (tagSize.value === 'xs') {
      //   return {
      //     fontSize: '0.75rem',
      //     lineHeight: '1rem'
      //   }
      // }
      // if (tagSize.value === 'sm') {
      //   return {
      //     fontSize: '0.875rem',
      //     lineHeight: '1.25rem'
      //   }
      // }
      // if (tagSize.value === 'lg') {
      //   return {
      //     fontSize: '1.125rem',
      //     lineHeight: '1.75rem'
      //   }
      // }
      // if (tagSize.value === 'xl') {
      //   return {
      //     fontSize: '1.25rem',
      //     lineHeight: '1.75rem'
      //   }
      // }
      // if (tagSize.value === '2xl') {
      //   return {
      //     fontSize: '1.5rem',
      //     lineHeight: '2rem'
      //   }
      // }
      return {
        fontSize: '1rem',
        lineHeight: '1.5rem'
      }
    }
  },
  created() {
    listTagsApi().then(res => {
      this.tags = res.data.data
      this.tags.forEach(item => item.count = 1)
    })
  }
}
</script>

<style scoped>
.color-background {
  background: linear-gradient(130deg, rgb(36, 198, 220), rgb(84, 51, 255) 41.07%, rgb(255, 0, 153) 76.05%);
  opacity: 0.99;
}

</style>