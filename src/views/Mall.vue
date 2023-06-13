<template>
  <div class="main-grid">
    <div class="flex flex-col relative">
<!--      <ul :class="tabClass">-->
<!--        <li :class="{ active: activeTab === 0 }" @click="handleTabChange(0)">-->
<!--            <span class="first-tab" :style="activeTabStyle(0)">-->
<!--              全部-->
<!--            </span>-->
<!--        </li>-->
<!--        <template v-if="categories && categories.length > 0">-->
<!--          <li-->
<!--              v-for="category in categories"-->
<!--              :key="category.id"-->
<!--              :class="{ active: activeTab === category.id }"-->
<!--              @click="handleTabChange(category.id)">-->
<!--              <span :style="activeTabStyle(category.id)">-->
<!--                {{ category.categoryName }}-->
<!--              </span>-->
<!--            <b>-->
<!--              {{ category.articleCount }}-->
<!--            </b>-->
<!--          </li>-->
<!--        </template>-->
<!--        <template v-else-if="(categories.length = 0)">-->
<!--          <li v-for="i in 6" :key="i" style="position: relative; top: -4px">-->
<!--            <ob-skeleton tag="span" width="60px" height="33px" />-->
<!--          </li>-->
<!--        </template>-->
<!--      </ul>-->
      <span :class="expanderClass" @click="expandHandler">
          <svg-icon icon-class="chevron" />
        </span>
      <ul class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <template v-if="haveItems === true">
          <li v-for="item in items" :key="item.id">
            <item-card class="home-article" :data="item" />
          </li>
        </template>
        <template v-else>
<!--          <li v-for="n in 12" :key="n">-->
          <li v-for="n in 1" :key="n">
            <item-card :data="{}" />
          </li>
        </template>
      </ul>
<!--      <Paginator-->
<!--          :pageSize="pagination.size"-->
<!--          :pageTotal="pagination.total"-->
<!--          :page="pagination.current"-->
<!--          @pageChange="pageChangeHanlder" />-->
    </div>
    <profile-card></profile-card>
  </div>

</template>

<script>

import CommentList from '@/components/Comment/CommentList'
import Avatar from '@/components/Avatar'
import {listCommentApi} from "@/api/WebApi";
import ItemCard from "@/components/ItemCard/index.vue";
import ProfileCard from "@/components/ProfileCard/index.vue";
export default {
  name: "TalkList",
  components: {
    ProfileCard,
    ItemCard,
    CommentList,
    Avatar,
  },
  data() {
    return {
      haveItems: false,
      items: [],
      categories: [],
      activeTab: 0,
      tabClass: {
        tab: true,
        'expanded-tab': false
      },
      expanderClass: {
        'tab-expander': true,
        expanded: false
      },
      avatar: '',
      list: []
    }
  },
  methods: {
    expandHandler(){
      this.expanderClass.expanded = !this.expanderClass.value.expanded
      this.tabClass.value['expanded-tab'] = !this.tabClass.value['expanded-tab']
    },
    activeTabStyle(catagoryId) {
      if (catagoryId === this.activeTab.value)
        return { background: appStore.themeConfig.header_gradient_css }
      return {}
    },
    refresh() {
      let param = {
        type: 'leaveMessage'
      }
      listCommentApi(param).then((res) => {
        if (res.data.code === 200) {
          this.list = res.data.data;
        }
      });
    },
  },
  created() {
    let user = this.$store.getters.getUser
    if (user) {
      this.avatar = user.avatar
    }
    this.refresh()
  }
}
</script>

<style lang="scss" scoped>
.main-grid {
  margin: 0 20px;
}
.top-svg {
  margin-left: 5px;
}
.message-svg {
  margin-left: 5px;
  font-size: 15px;
}
.talk-item:hover {
  transform: scale(1.005);
}
.el-card {
  background: var(--background-primary);
  border-radius: 10px;
  border: 0;
}
.talk-info {
  flex: 1;
  margin-left: 10px;
}
.user-nickname {
  font-weight: 530;
}
.time {
  color: #999;
  font-size: 13px;
  @media (min-width: 1280px) {
    margin-top: 4px;
  }
}
.talk-content {
  margin-top: 10px;
  font-size: 14px;
  line-height: 26px;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-all;
}
.talk-images {
  margin-top: 8px;
}
.images-items {
  cursor: pointer;
  border-radius: 3px;
  margin-right: 5px;
}
</style>
