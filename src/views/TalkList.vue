<template>
  <div class="main-grid">
    <div class="relative space-y-5">
      <div
          class="bg-ob-deep-800 flex p-4 lg:p-8 rounded-2xl shadow-xl mb-0 talk-item"
          v-for="item in list"
          :key="item.id"
          @click="toTalk(item.id)">
        <Avatar :url="avatar" />
        <div class="talk-info">
          <div class="user-nickname text-sm">
            {{ item.username }}
          </div>
          <div class="time">
            {{ item.username }}
            <template v-if="item.isTop === 1">
<!--              <svg-icon icon-class="top" class="top-svg" /><span style="color: #f21835">置顶</span>-->
            </template>
<!--            <svg-icon icon-class="message" class="message-svg" />-->
            {{
              item.commentCount == null ? 0 : item.commentCount
            }}
          </div>
          <div class="talk-content" v-html="item.content" />
          <el-row class="talk-images" v-if="item.imgs">
            <el-col :md="4" v-for="(img, index) of item.imgs" :key="index">
              <el-image
                  class="images-items"
                  :src="img"
                  aspect-ratio="1"
                  max-height="200"
                  @click.stop="handlePreview(img)" />
            </el-col>
          </el-row>
        </div>
      </div>
<!--      <Paginator-->
<!--          :pageSize="pagination.size"-->
<!--          :pageTotal="pagination.total"-->
<!--          :page="pagination.current"-->
<!--          @pageChange="pageChangeHanlder" />-->
    </div>

<!--    <CommentList/>-->
  </div>

</template>

<script>

import CommentList from '@/components/Comment/CommentList'
import Avatar from '@/components/Avatar'
import {listCommentApi} from "@/api/WebApi";
export default {
  name: "TalkList",
  components: {
    CommentList,
    Avatar,
  },
  data() {
    return {
      avatar: '',
      list: []
    }
  },
  methods: {
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
