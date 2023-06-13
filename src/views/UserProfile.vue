<template>
  <div>
    <el-card style="margin-top: 1.25rem">
      <div class="e-title">活跃统计</div>
      <div v-loading="loading">
        <calendar-heatmap :end-date="new Date()" :values="list"/>
      </div>
    </el-card>
  </div>
</template>

<script>
import {listUserStatisticsApi} from "@/api/WebApi";

export default {
  name: "UserProfile",
  data() {
    return {
      loading: false,
      list: [
        {count: 1, date: new Date},
      ]
    }
  },
  mounted() {
    listUserStatisticsApi().then(res => {
          if (res.data.code === 200) {
            this.list = res.data.data
          }
        }
    )
  }
}
</script>

<style scoped>

</style>