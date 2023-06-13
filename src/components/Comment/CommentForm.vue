<template>
  <div style="display: flex;">
    <Avatar ref="ava" v-if="withAvatar" :url="avatar"/>
    <el-card class="box-card" style="width: 100%">
      <div slot="header" class="clearfix">
        <span>留言板</span>
      </div>
      <el-input type="textarea" style="padding: 3px 0"
                v-model="content"
                placeholder="留下个评论吧">
      </el-input>
      <div style="display: flex;">
        <el-button>表情</el-button>
        <el-button @click="clickPictureBtn">图片</el-button>

        <el-button type="primary"
                   style="margin-left: auto"
                   @click="leaveMessage"
        >发表评论</el-button>
      </div>

    </el-card>
  </div>
</template>
<script>
import Avatar from '@/components/Avatar'
import {createCommentApi} from "@/api/WebApi";
// import { SubTitle } from '@/components/Title'
// import { useUserStore } from '@/stores/user'
// import { useRoute } from 'vue-router'
// import { useCommentStore } from '@/stores/comment'
// import { useAppStore } from '@/stores/app'
// import api from '@/api/api'
// import emitter from '@/utils/mitt'

export default {
  name: 'CommentForm',
  components: {
    // SubTitle,
    Avatar
  },
  props: ['withAvatar'],
  created() {
    this.$emit('createComment')

    // this.$refs.ava.testMethod()
    // this.$parent.createComment()
    // this.$emit("createComment")
  },
  methods: {
    clickPictureBtn() {
      this.$message.success('图片上传功能参考文章图片插入功能')
    },
    leaveMessage() {
      let body = {
        content: this.content,
        toUserId: 1,
        toUserName: 'test1User',
        type: 'leaveMessage'
      }
      this.$emit('createComment')

      createCommentApi(body).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg)
          this.$emit("createComment")
        }
      })
    }
  },
  data() {
    return {
      // withAvatar: false,
      content: ''

      //   const proxy
      // any = getCurrentInstance()?.appContext.config.globalProperties
      // const userStore = useUserStore()
      // const commentStore = useCommentStore()
      // const appStore = useAppStore()
      // const route = useRoute()
      // const reactiveData = reactive({
      //   commentContent: '' as any
      // })
      // const saveComment = () => {
      //   if (userStore.userInfo === '') {
      //     proxy.$notify({
      //       title: 'Warning',
      //       message: '请登录后评论',
      //       type: 'warning'
      //     })
      //     return
      //   }
      //   if (reactiveData.commentContent.trim() == '') {
      //     proxy.$notify({
      //       title: 'Warning',
      //       message: '评论不能为空',
      //       type: 'warning'
      //     })
      //     return
      //   }
      //   const path = route.path
      //   const arr = path.split('/')
      //   const params: any = {
      //     commentContent: reactiveData.commentContent,
      //     type: commentStore.type
      //   }
      //   params.topicId = arr[2]
      //   saveComment(params).then(({data}) => {
      //     if (data.flag) {
      //       fetchComments()
      //       let isCommentReview = appStore.websiteConfig.isCommentReview
      //       if (isCommentReview) {
      //         proxy.$notify({
      //           title: 'Warning',
      //           message: '评论成功,正在审核中',
      //           type: 'warning'
      //         })
      //       } else {
      //         proxy.$notify({
      //           title: 'Success',
      //           message: '评论成功',
      //           type: 'success'
      //         })
      //       }
      //       reactiveData.commentContent = ''
      //     } else {
      //       proxy.$notify({
      //         title: 'Error',
      //         message: data.message,
      //         type: 'error'
      //       })
      //     }
      //   })
      // },
      // fetchComments = () => {
      //   switch (commentStore.type) {
      //     case 1:
      //       // emitter.emit('articleFetchComment')
      //       break
      //     case 2:
      //       // emitter.emit('messageFetchComment')
      //       break
      //     case 3:
      //       // emitter.emit('aboutFetchComment')
      //       break
      //     case 4:
      //       // emitter.emit('friendLinkFetchComment')
      //       break
      //     case 5:
      //       // emitter.emit('talkFetchComment')
      //   }
      // }
    }
  }

}
</script>

<style scoped>
.input {
  /*background: var(--background-primary);*/
  resize: none;
}

#submit-button {
  outline: none;
  /*background: var(--main-gradient);*/
}

.wire {
  /*border-color: var(--text-normal);*/
}
</style>
