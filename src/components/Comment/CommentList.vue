<template>
  <div style="width: 100%;margin-top: 20px">
    <div v-for="(item, i) in comments" :key="i" class="author-title reply-father">
      <el-avatar class="header-img" :size="40" :src="item.userAvatar"></el-avatar>
      <div class="author-info">
        <span class="author-name">{{ item.username }}</span>
        <span class="author-time">{{ item.createTime }}</span>
      </div>
      <div class="icon-btn" icon="el-icon-chat-dot-round">
          <span @click="showReplyInput(i, item.username, item.id, item.userId, item.rootId)">
            <el-link icon="el-icon-s-comment" ></el-link>{{ item.commentNum }}
          </span>
        <el-link
            icon="el-icon-caret-top"
            @click="like(item.id)"
        >{{ item.commentNum }}</el-link>
        {{ item.like }}
      </div>
      <div class="talk-box">
        <p>
          <span class="reply"> {{ item.content }}</span>
        </p>
          <div>
<!--            <el-link @click="showReplyInput(i, item.username, item.id)">回复</el-link>-->
<!--            <el-link style="margin-left: 10px">举报</el-link>-->
          </div>
      </div>
      <div class="reply-box">
        <div v-for="(reply, j) in item.children" :key="j" class="author-title" >
          <el-avatar class="header-img" :size="40" :src="reply.userAvatar"></el-avatar>
          <div class="author-info">
            <span class="author-name">{{ reply.username }}</span>
            <span class="author-time">{{ reply.createTime }}</span>
          </div>
          <div class="icon-btn">
              <span >
                <el-link icon="el-icon-s-comment" @click="showReplyInput(i, reply.username, reply.id, reply.userId, reply.rootId)"></el-link>
                {{ reply.commentNum }}
              </span>
            <el-link v-if="reply.likeFlag"
                class="iconfont el-icon-caret-top likeIcon" icon="el-icon-caret-top"
                @click="like(reply.id)"
            ></el-link>
            <i
                v-else
                class="iconfont el-icon-caret-top"
                @click="like(reply.id)"
            ></i
            >{{ reply.like }}
          </div>
          <div class="talk-box">
            <p>
              回复<span> @{{ reply.parentName }}: </span>
              <span class="reply"> {{ reply.content }}</span>
            </p>
          </div>
          <div class="reply-box"></div>
        </div>
      </div>
      <div v-show="_inputShow(i)" class="my-reply my-comment-reply">
        <el-avatar class="header-img" :size="40" :src="curUser.avatar"></el-avatar>
        <div class="reply-info">
          <div
              tabindex="0"
              contenteditable="true"
              spellcheck="false"
              :placeholder="placeholder"
              @input="onDivInput($event)"
              class="reply-input reply-comment-input"
          ></div>
        </div>
        <div class="reply-btn-box">
          <el-button
              class="reply-btn"
              size="medium"
              @click="sendCommentReply(i)"
              type="primary"
          >发表评论</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ts-nocheck
// import { defineComponent, inject } from 'vue'
// import CommentItem from './CommentItem'
// import { useCommentStore } from '@/stores/comment'
// import emitter from '@/utils/mitt'

import {createCommentApi, listCommentApi} from "@/api/WebApi";

export default {
  name: 'CommentList',
  computed: {
    repl() {
      return repl
    }
  },
  components: {
    // CommentItem
  },
  created() {
    this.curUser = this.$store.getters.getUser
    this.refresh()
  },
  methods: {
    onDivInput: function (e) {
      this.replyComment = e.target.innerHTML;
    },
    refresh() {
      //console.log(this.userId)
      // alert(this.userId+"nmnm")
      //let url = `/api1/ts/tcomment/commentList/${this.itemId}/${this.userId}`
      //查询评论信息列表展示, 文章id/用户id
      let param = {
        type: 'leaveMessage'
      }
      listCommentApi(param).then((res) => {
        if (res.data.code === 200) {
          this.comments = res.data.data;
        }
      });
    },
    sendCommentReply(i) {
      // 子回复提交
      if (!this.replyComment) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "评论不能为空",
        });
        return
      }

      // 组装请求数据
      let param = {
        userId: this.userId,
        username: this.username,
        content: this.replyComment,
        avatar: this.avatar,
        parentId: this.parentId,
        rootId: this.rootId,
        parentName: this.parentName,
        toUserId: this.toUserId,
        type: 'reply',
      };
      //
      createCommentApi(param)
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("回复成功");
              this.refresh()
            } else {
              this.$message.error("回复失败，请稍后重试");
            }
          })
          .finally(() => {
            this.refresh();
          });

      this.replyComment = "";
      document.getElementsByClassName("reply-comment-input")[i].innerHTML =
          "";

    },
    _inputShow(i) {
      return this.comments[i].inputShow;
    },
    showReplyInput(i, name, id, toUserId, rootId) {

      if (this.index === i) {
        this.comments[this.index].inputShow = !this.comments[i].inputShow
        return
      }
      if (rootId == null) {
        rootId = id
      }
      this.comments[this.index].inputShow = false;
      this.index = i;
      this.comments[i].inputShow = true;
      this.parentName = name;
      this.parentId = id;
      this.placeholder = "回复 @" + name;
      this.toUserId = toUserId
      this.rootId = rootId
      //alert(i)
    }

  },
  data() {
    return {
      index: "0",
      curUser: {},
      placeholder: '123placeholder',
      comments: [
        {
          username:'Lana Del Rey',
          id:19870621,
          userAvatar:'https://ae01.alicdn.com/kf/Hdd856ae4c81545d2b51fa0c209f7aa28Z.jpg',
          parentName:'', // 父评论名
          parentId:'', // 父评论id
          content:'我发布一张新专辑Norman Fucking Rockwell,大家快来听啊',
          time:'2019年9月16日 18:43',
          commentNum:2, // 该评论的回复条数
          like:15, // 点赞
          likeFlag: true, // 点赞图标状态颜色变化
          inputShow:false, // 输入框隐藏
          reply:[
              {
                  username:'Taylor Swift',
                  id:19891221,
                  avatar:'https://ae01.alicdn.com/kf/H94c78935ffa64e7e977544d19ecebf06L.jpg',
                  parentName:'Lana Del Rey',
                  parentId:19870621,
                  comment:'我很喜欢你的新专辑！！',
                  time:'2019年9月16日 18:43',
                  commentNum:1,
                  like:15,
                  likeFlag: true, // 点赞图标状态颜色变化
                  inputShow:false
              }
          ]
        },
      ],
    }
  }

  // setup() {
  //   const commentStore = useCommentStore()
  //   const loadMore = async () => {
  //     switch (commentStore.type) {
  //       case 1:
  //         emitter.emit('articleLoadMore')
  //         break
  //       case 2:
  //         emitter.emit('messageLoadMore')
  //         break
  //       case 3:
  //         emitter.emit('aboutLoadMore')
  //         break
  //       case 4:
  //         emitter.emit('friendLinkLoadMore')
  //         break
  //       case 5:
  //         emitter.emit('talkLoadMore')
  //     }
  //   }
  //   return {
  //     comments: inject('comments'),
  //     haveMore: inject('haveMore'),
  //     loadMore
  //   }
  // }
}
</script>
<style scoped>
.load-more-button {
  outline: none;
  /*background: var(--main-gradient);*/
}
.comment {
  width: 1000px;
  margin: 0 auto;
  font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei,
  sans-serif;
}
.my-reply {
  padding: 10px;
  background-color: #fafbfc;
}
.my-reply .header-img {
  display: inline-block;
  vertical-align: top;
}
.my-reply .reply-info {
  display: inline-block;
  margin-left: 5px;
  width: 90%;
}
@media screen and (max-width: 1200px) {
  .my-reply .reply-info {
    width: 80%;
  }
}
.my-reply .reply-info .reply-input {
  min-height: 20px;
  line-height: 22px;
  padding: 10px 10px;
  color: #ccc;
  background-color: #fff;
  border-radius: 5px;
}
.my-reply .reply-info .reply-input:empty:before {
  content: attr(placeholder);
}
.my-reply .reply-info .reply-input:focus:before {
  content: none;
}
.my-reply .reply-info .reply-input:focus {
  padding: 8px 8px;
  border: 2px solid #409eff;
  box-shadow: none;
  outline: none;
}
/* .reply-info>div .reply-input:focus{
    border: 2px solid #409EFF;
} */
.my-reply .reply-btn-box {
  height: 25px;
  margin: 10px 0;
}
.my-reply .reply-btn-box .reply-btn {
  position: relative;
  float: right;
  margin-right: 15px;
}
.my-comment-reply {
  margin-left: 50px;
}
.my-comment-reply .reply-input {
  width: flex;
}
.author-title:not(:last-child) {
  border-bottom: 1px solid rgba(178, 186, 194, 0.3);
}
.author-title {
  padding: 10px;
  background-color: var(--background-secondary);
  /*border-radius: 1rem;*/
  /*margin-top: 10px;*/
}
.author-title .header-img {
  display: inline-block;
  vertical-align: top;
}
.author-title .author-info {
  display: inline-block;
  margin-left: 5px;
  width: 60%;
  height: 40px;
  line-height: 20px;
}
.author-title .author-info > span {
  display: block;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.author-title .author-info .author-name {
  color: #303133;
  font-size: 18px;
  font-weight: 500;
}
.reply-box .talk-box {
  color: #606266;
}
.reply-box .talk-box span {
  color: #6298ce;
}
.author-title .author-info .author-time {
  font-size: 14px;
}
.author-time {
  color: #606266;
}
.author-title .icon-btn {
  width: 30%;
  padding: 0 !important;
  float: right;
}
@media screen and (max-width: 1200px) {
  .author-title .icon-btn {
    width: 20%;
    padding: 7px;
  }
}
.author-title .icon-btn > span {
  cursor: pointer;
}
.author-title .icon-btn .iconfont {
  margin: 0 5px;
}
.author-title .talk-box {
  margin: 0 50px;
}
.author-title .talk-box > p {
  margin: 0;
}
.author-title .talk-box .reply {
  font-size: 16px;
  color: #606266;
}

.author-title .reply-box {
  margin: 10px 0 0 50px;
  background-color: #efefef;
}
/* 点赞图标颜色 */
.likeIcon {
  color: #40a0ff;
}
</style>
