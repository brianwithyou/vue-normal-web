<template>
  <el-drawer class="user-center" :visible.sync="showUserCenter" direction="rtl" :with-header="false" :before-close="handleClose">
    <span class="text font-semibold text-2xl">用户中心</span>
    <template v-if="userInfo !== ''">
      <div class="info-container">
          <el-upload
            class="avatar-uploader"
            :action="fileServer"
            multiple
            :data="{classification: 'cover'}"
            :before-upload="beforeUpload"
            :on-success="updateAvatar">
            <el-avatar :size="110" :src="userInfo.avatar" style=""/>
          </el-upload>
        <el-form style="width: 100%">
          <el-form-item model="userInfo" label="昵称:" class="mt-5">
            <el-input v-model="userInfo.username" />
          </el-form-item>
          <el-form-item model="userInfo" label="网址:" class="mt-5">
            <el-input disabled v-model="userInfo.website" placeholder="Please add https:// or http://" />
          </el-form-item>
          <el-form-item model="userInfo" label="描述:" class="mt-5">
            <el-input disabled v-model="userInfo.username" placeholder="Introduce youself" />
          </el-form-item>
          <el-form-item model="userInfo" label="邮箱:" class="mt-5">
            <el-input disabled :placeholder="userInfo.email">
              <template #append v-if="userInfo.email === null">
<!--                <span class="text" @click="changeEmailDialogVisible">绑定</span>-->
              </template>
              <template #append v-else>
<!--                <span class="text" @click="changeEmailDialogVisible">修改</span>-->
              </template>
            </el-input>
          </el-form-item>
          <el-button
              @click="confirm"
              id="submit-button" type="primary">
            <span class="text-center flex-grow commit">提交</span>
          </el-button>
        </el-form>
      </div>
    </template>
    <br />
    <br />
  </el-drawer>

</template>

<script>
import {listBlogs, updateUserApi} from "@/api/WebApi";

export default {
  name: "UserCenter",
  components: {
  },
  computed: {
    userInfo: {
      get() {
        return this.$store.getters.userInfo
      },
      set(val){}
    },
    showUserCenter: {
      get() {
        return this.$store.getters.showUserCenter
      },
      set(val) {}
    }
  },
  methods: {
    updateAvatar(response) {
      if (response.flag) {
        this.$message.success(response.message)
        this.$store.commit('updateAvatar', response.data)
      } else {
        this.$message.error(response.message)
      }
    },
    edit (id) {
      this.visible = true
      this.id = id
    },
    close () {
      this.id = null
      this.visible = false
    },
    cancelHandel () {
      this.close()
    },
    // 图片放大/缩小
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 左旋转
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    // 右旋转
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    beforeUpload (file) {
      const reader = new FileReader()
      // 转化为base64
      reader.readAsDataURL(file)
      reader.onload = () => {
        // 获取到需要剪裁的图片 展示到剪裁框中
        this.options.img = reader.result
      }
      return false
    },
    // 上传图片（点击保存按钮）
    finish (type) {
      this.$refs.cropper.getCropData((data) => {
        this.visible = false
        console.log(data)
        // data为base64图片，供接口使用
        this.$emit('save', data)
      })
    },
    // 裁剪之后的数据
    realTime (data) {
      this.previews = data
    },
    confirm() {
      let body = {
        id: this.userInfo.id,
        nickname: this.userInfo.username,
        avatar: this.userInfo.avatar
      }
      updateUserApi(body).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg)
        }
        this.$store.commit('SHOW_USER_CENTER', false)
      })
    },
    handleClose() {
      this.$store.commit("SHOW_USER_CENTER", false)
    },
    showCropper() {

    },
    handleSuccess() {

    }
  },
  data() {
    return{
      fileServer: '',
      options: {
        img: '',  // 需要剪裁的图片
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150, // 默认生成截图框的宽度
        autoCropHeight: 150, // 默认生成截图框的长度
        fixedBox: true // 是否固定截图框的大小 不允许改变
      },
      previews: {}, // 裁剪之后的结果
      visible: true
    }
  }
}
</script>

<style scoped>
.avatar-container {
  text-align: center;
}
.el-icon-message-solid {
  color: #f56c6c;
  margin-right: 0.3rem;
}
.avatar-uploader .el-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 50px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {

  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.info-container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>