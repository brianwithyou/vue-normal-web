<template>
<div>
  <CommentForm :withAvatar="false"></CommentForm>
  <CommentList></CommentList>
</div>
</template>

<script>
import CommentForm from '@/components/Comment/CommentForm.vue'
import CommentList from "@/components/Comment/CommentList.vue";

export default {
  name: "LeaveMessage",
  components: {
    CommentList,
    CommentForm
  }
}
</script>

<style scoped>

</style>