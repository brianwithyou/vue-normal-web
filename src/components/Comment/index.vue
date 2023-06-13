<template>
  <div class="bg-ob-deep-800 p-4 mt-8 lg:px-14 lg:py-10 rounded-2xl shadow-xl mb-8 lg:mb-0" id="comments">
    <SubTitle :title="'评论区'" />
    <comment-form @createComment="createComment1"></comment-form>
    <CommentList ref="commentList"/>
  </div>
</template>

<script>
import { SubTitle } from '@/components/Title'
import CommentForm from './CommentForm.vue'
import CommentList from './CommentList'
export default {
  name: 'Comment',
  components: {
    CommentForm,
    CommentList,
    SubTitle,
  },
  methods: {
    createComment1() {
      this.$refs.commentList.refresh()
    }
  }
}
</script>

<style scoped>

</style>