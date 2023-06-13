<template>
  <el-timeline>
    <div v-for="item in list">
    <el-timeline-item :timestamp="item.createTime" placement="top">
      <el-card>
        <h4>{{item.title}}</h4>
        <p><b>{{ item.author }}</b> 提交于 {{ item.createTime }}</p>
      </el-card>
    </el-timeline-item>
    </div>
  </el-timeline>
</template>

<script>
import {listTimelineApi} from "@/api/WebApi";
import {mapGetters} from "vuex";

export default {
  name: "Timeline",
  computed: {
    ...mapGetters([
      'getUser',
    ])
  },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.$message.success('只能看到本人的归档记录')

    if (this.getUser == null || this.getUser.username == null) {
      return
    }
    let param = {
      pageNum: 1,
      pageSize: 10
    }
    listTimelineApi(param).then(res => {
      this.list = res.data.data.list
    })
  }
}
</script>

<style scoped>

</style>