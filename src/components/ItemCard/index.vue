<template>
  <div class="article-container">
    <span v-if="item.isTop" class="article-tag">
      <b><svg-icon icon-class="pin"/>哈喽</b>
    </span>
    <span v-else-if="item.isFeatured" class="article-tag">
      <b><svg-icon icon-class="hot" />{{ t('settings.featured') }}</b>
    </span>
    <div class="article">
      <div class="article-thumbnail">
        <img v-if="item.cover" v-lazy="item.cover" alt=""  src=""/>
        <img v-else src="@/assets/default-cover.jpg"   alt=""/>
        <span class="thumbnail-screen" :style="gradientBackground" />
      </div>
<!--      <ul >-->
        <div class="article-content">
        <span>
          <b v-if="item.categoryName">{{ item.categoryName }}</b>
          <!--          <ob-skeleton v-else tag="b" height="20px" width="35px" />-->
          <ul v-if="item.tags && item.tags.length > 0">
            <li v-for="tag in item.tags" :key="tag.id">
              <em># {{ tag.tagName }}</em>
            </li>
          </ul>
          <ul v-else-if="item.tags && item.tags.length <= 0">
            <li>
              <em># 未分类</em>
            </li>
          </ul>
          <!--          <ul v-else>-->
          <!--            <ob-skeleton v-if="!article.tags" :count="2" tag="li" height="16px" width="35px" />-->
          <!--          </ul>-->
        </span>
          <div style="display: flex">
            <div style="flex-grow: 10">
              <h1 class="article-title" v-if="item.title" @click="toItemDetail" data-dia="article-link">
                <a>
                  <span> {{ item.title }}</span>
                  <svg-icon v-if="item.status === 2" icon-class="lock" class="lock-svg" />
                </a>
              </h1>
              <!--        <ob-skeleton v-else tag="h1" height="3rem" />-->
              <p v-if="item.content">{{ item.content }}</p>
              <!--        <ob-skeleton v-else tag="p" :count="5" height="16px" />-->
              <div class="article-footer" v-if="item.showFooter && item.author && item.createTime">
                <div class="flex flex-row items-center">
                  <img
                      class="hover:opacity-50 cursor-pointer"
                      :src="item.author.avatar || ''"
                      alt="author avatar"
                      @click="handleAuthorClick(item.author.website)" />
                  <span class="text-ob-dim">
              <strong
                  class="text-ob-normal pr-1.5 hover:text-ob hover:opacity-50 cursor-pointer"
                  @click="handleAuthorClick(item.author.website)">
                {{ item.author.nickname }}
              </strong>
              {{ t('settings.shared-on') }} {{ t(`settings.months[${new Date(item.createTime).getMonth()}]`) }}
              {{ new Date(item.createTime).getDate() }}, {{ new Date(item.createTime).getFullYear() }}
            </span>
                </div>
              </div>
              <div class="article-footer" v-else>
              </div>
              <div class="flex flex-row items-center mt-6">
                <!--            <ob-skeleton class="mr-2" height="28px" width="28px" :circle="true" />-->
                <span class="text-ob-dim mt-1">
<!--              <ob-skeleton height="20px" width="150px" />-->
            </span>
              </div>
            </div>
            <div class="item-money" style="">
              ￥{{item.money}}
            </div>
          </div>
        </div>

<!--      </ul>-->
    </div>
  </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon/index.vue";

export default {
  name: "ItemCard",
  components: {SvgIcon},
  props: {
    data: {
      default: () => {},
      type: Object
    },
  },
  computed: {
    gradientBackground() {
      return { background: this.header_gradient_css }
    }
  },
  methods: {
    toItemDetail() {
    }
  },
  data() {
    return {
      header_gradient_css: 'linear-gradient(130deg, #24c6dc, #5433ff 41.07%, #ff0099 76.05%)',
      item: {
        // cover: 'https://img1.baidu.com/it/u=624757801,3433992313&fm=253&fmt=auto&app=138&f=PNG?w=500&h=281',
        cover: 'https://img1.baidu.com/it/u=3467535553,1294906854&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313',
        isTop: true,
        title: 'iPhone 16 Pro Max',
        categoryName: '分类名',
        content: '一块钱，买个教训',
        author: 'normal-blog',
        createTime: '2023-05-20 13:00:00',
        showFooter: false,
        tags: [{
          tagName: 'Tag'
        }],
        money: '1',
      }
    }
  }
}
</script>

<style scoped>
.item-money {
  color: #e8410f;
  flex-grow: 1;
  margin-left: auto;
  margin-top: auto;
  font-size: 25px;
}
</style>