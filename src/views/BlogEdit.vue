<template>
    <div class="m-content">
      <el-form :model="blog" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <div style="display: flex">
            <el-input v-model="blog.title" style="margin-right: 20px"></el-input>
            <el-button type="primary" @click="openDialog">发布</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </div>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input type="textarea" v-model="blog.summary"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" >
          <mavon-editor v-model="blog.content" ref="md"
                        style="min-height: 1000px;width: 100%"
                        @imgAdd="imgAdd" @imgDel='imgDel'
          ></mavon-editor>
        </el-form-item>
      </el-form>

      <el-dialog :visible.sync="dialogVisible" width="40%" top="3vh">
        <div class="dialog-title-container" slot="title">发布文章</div>
        <el-form label-width="80px" size="medium" :model="blog">
          <el-form-item label="文章分类">
            <el-tag
                type="success"
                v-show="blog.category"
                style="margin: 0 1rem 0 0"
                :closable="true"
                @close="removeCategory">
              {{ blog.category }}
            </el-tag>
            <el-popover placement="bottom-start" width="460" trigger="click" v-if="!blog.category">
              <div class="popover-title">分类</div>
              <el-autocomplete
                  style="width: 100%"
                  v-model="category"
                  :fetch-suggestions="searchCategories"
                  placeholder="请输入分类名搜索，enter可添加自定义分类"
                  :trigger-on-focus="false"
                  @keyup.enter.native="saveCategory"
                  @select="handleSelectCategories">
                <template slot-scope="{ item }">
                  <div>{{ item.category }}</div>
                </template>
              </el-autocomplete>
              <div class="popover-container">
                <div v-for="item of categories" :key="item.id" class="category-item" @click="addCategory(item)">
                  {{ item.categoryName }}
                </div>
              </div>
              <el-button type="success" plain slot="reference" size="small"> 添加分类 </el-button>
            </el-popover>
          </el-form-item>
          <el-form-item label="文章标签">
            <el-tag
                v-for="(item, index) of blog.tags"
                :key="index"
                style="margin: 0 1rem 0 0"
                :closable="true"
                @close="removeTag(item)">
              {{ item }}
            </el-tag>
            <el-popover placement="bottom-start" width="460" trigger="click" v-if="blog.tags.length < 3">
              <div class="popover-title">标签</div>
              <el-autocomplete
                  style="width: 100%"
                  v-model="tagName"
                  :fetch-suggestions="searchTags"
                  placeholder="请输入标签名搜索，enter可添加自定义标签"
                  :trigger-on-focus="false"
                  @keyup.enter.native="saveTag"
                  @select="handleSelectTag">
                <template slot-scope="{ item }">
                  <div>{{ item.tagName }}</div>
                </template>
              </el-autocomplete>
              <div class="popover-container">
                <div style="margin-bottom: 1rem">添加标签</div>
                <el-tag v-for="(item, index) of tagList" :key="index" :class="tagClass(item)" @click="addTag(item)">
                  {{ item.tagName }}
                </el-tag>
              </div>
              <el-button type="primary" plain slot="reference" size="small"> 添加标签 </el-button>
            </el-popover>
          </el-form-item>
          <el-form-item label="文章类型">
            <el-select v-model="blog.type" placeholder="请选择类型">
              <el-option v-for="item in typeList" :key="item.type" :label="item.desc" :value="item.type" />
            </el-select>
          </el-form-item>
          <el-form-item label="原文地址" v-if="blog.type !== 1">
            <el-input v-model="blog.originalUrl" placeholder="请填写原文链接" />
          </el-form-item>
          <el-form-item label="上传封面">
            <el-upload
                class="upload-cover"
                drag
                :action="fileServer"
                multiple
                :data="{classification: 'cover'}"
                :headers="headers"
                :before-upload="beforeUpload"
                :on-success="uploadCover">
              <i class="el-icon-upload" v-if="blog.cover === ''" />
              <div class="el-upload__text" v-if="blog.cover === ''">将文件拖到此处，或<em>点击上传</em></div>
              <img v-else :src="blog.cover" width="360px" height="180px"  alt=""/>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
<!--          <el-button type="danger" @click="saveOrUpdateArticle"> 发 表 </el-button>-->
          <el-button type="danger" @click="submitForm('ruleForm')"> 发表 </el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
import {create, update, getBlogDetail} from '@/api/WebApi'
import * as imageConversion from 'image-conversion'
import axios from "axios";

export default {
    name: "BlogEdit",
    data() {
      return {
        fileServer:  `${this.$axios.defaults.baseURL}/file-server/file/upload`,
        headers: {Authorization: localStorage.getItem('token')},
        tagName: '',
        category: {},
        categories: [],
        tagList: [],
        dialogVisible: false,
        blog: {
          id: null,
          title: '文章标题',
          summary: "文章摘要",
          cover: '',
          category: '分类1',
          tags: ['tag1'],
          originalUrl: '',
          // description: '文章描述',
          content: '内容'
        },
        typeList: [
          {type: 1, desc: '原创'},
          {type: 2, desc: '转载'},
          {type: 3, desc: '翻译'}
        ],
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
          ],
          summary: [
            { required: true, message: '请输入摘要', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入内容', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      // imgAdd(pos, $file) {
      //   var _this = this;
      //   var formData = new FormData();
      //   formData.append("file", $file);
      //   this.$axios.post(this.fileServer, formData).then(res => {
      //     debugger
      //     if (res.status === 200) {
      //       var url = res.data.data[0].url;
      //       _this.$refs.md.$img2Url(pos, url);
      //     }
      //   })
      // },
      imgAdd(pos, file) {
        let formData = new FormData()

        // url: '/XXXX/XXXX',
        //     method: 'post',
        //     headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
        // data: data
        formData.append('classification', 'cover')
        if (file.size / 1024 < this.config.UPLOAD_SIZE) {
          formData.append('file', file)
          this.$axios.post(this.fileServer, formData,{
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }).then(({ data }) => {
            this.$refs.md.$img2Url(pos, data.data[0].viewPath)
          })
        } else {
          imageConversion.compressAccurately(file, this.config.UPLOAD_SIZE).then((res) => {
            formData.append('file', new window.File([res], file.name, { type: file.type }))
            this.$axios.post(this.fileServer, formData, {
                Authorization: localStorage.getItem('token')
            }).then(({ data }) => {
              this.$refs.md.$img2Url(pos, data.data[0].viewPath)
            })
          })
        }
      },

      imgDel() {

      },
      openDialog() {
        this.dialogVisible = true
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _this = this
            let token = localStorage.getItem("token")
            if (this.blog.id == null) {
              create(this.blog, {
                headers: {
                  "Authorization": token
                }
              }).then(res => {
                _this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.$router.push("/")
                  }
                });
              })
            } else {
              update(this.blog, {
                headers: {
                  "Authorization": token
                }
              }).then(res => {
                _this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.$router.push("/")
                  }
                });
              })
            }
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      listCategories() {
        this.axios.get('/api/admin/categories/search').then(({ data }) => {
          this.categorys = data.data
        })
      },
      listTags() {
        this.axios.get('/api/admin/tags/search').then(({ data }) => {
          this.tagList = data.data
        })
      },
      openModel() {
        if (this.blog.title.trim() === '') {
          this.$message.error('文章标题不能为空')
          return false
        }
        if (this.blog.content.trim() === '') {
          this.$message.error('文章内容不能为空')
          return false
        }
        this.listCategories()
        this.listTags()
        this.dialogVisible = true
      },
      uploadCover(res) {
        if (res.data && res.data.length > 0) {
          this.blog.cover = res.data[0].viewPath
        }
      },
      beforeUpload(file) {
        return new Promise((resolve) => {
          if (file.size / 1024 < this.config.UPLOAD_SIZE) {
            resolve(file)
          }
          imageConversion.compressAccurately(file, this.config.UPLOAD_SIZE).then((res) => {
            resolve(res)
          })
        })
      },
      saveArticleDraft() {
        if (this.blog.articleTitle.trim() === '') {
          this.$message.error('文章标题不能为空')
          return false
        }
        if (this.blog.articleContent.trim() === '') {
          this.$message.error('文章内容不能为空')
          return false
        }
        this.blog.status = 3
        this.axios.post('/api/admin/articles', this.blog).then(({ data }) => {
          if (data.flag) {
            if (this.blog.id === null) {
              this.$store.commit('removeTab', '发布文章')
            } else {
              this.$store.commit('removeTab', '修改文章')
            }
            sessionStorage.removeItem('blog')
            this.$router.push({ path: '/article-list' })
            this.$notify.success({
              title: '成功',
              message: '保存草稿成功'
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: '保存草稿失败'
            })
          }
        })
        this.autoSave = false
      },
      autoSaveArticle() {
        if (
            this.autoSave &&
            this.blog.title.trim() !== '' &&
            this.blog.content.trim() !== '' &&
            this.blog.id != null
        ) {
          this.axios.post('/api/admin/articles', this.blog).then(({ data }) => {
            if (data.flag) {
              this.$notify.success({
                title: '成功',
                message: '自动保存成功'
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: '自动保存失败'
              })
            }
          })
        }
        if (this.autoSave && this.blog.id == null) {
          sessionStorage.setItem('article', JSON.stringify(this.blog))
        }
      },
      searchCategories(keywords, cb) {
        this.axios
            .get('/api/admin/categories/search', {
              params: {
                keywords: keywords
              }
            })
            .then(({ data }) => {
              cb(data.data)
            })
      },
      handleSelectCategories(item) {
        this.addCategory({
          categoryName: item.categoryName
        })
      },
      saveCategory() {
        if (this.categoryName.trim() !== '') {
          this.addCategory({
            categoryName: this.categoryName
          })
          this.categoryName = ''
        }
      },
      addCategory(item) {
        this.blog.categoryName = item.categoryName
      },
      removeCategory() {
        this.blog.categoryName = null
      },
      searchTags(keywords, cb) {
        this.axios
            .get('/api/admin/tags/search', {
              params: {
                keywords: keywords
              }
            })
            .then(({ data }) => {
              cb(data.data)
            })
      },
      handleSelectTag(item) {
        this.addTag({
          tagName: item.tagName
        })
      },
      saveTag() {
        if (this.tagName.trim() !== '') {
          this.addTag({
            tagName: this.tagName
          })
          this.tagName = ''
        }
      },
      addTag(item) {
        if (this.blog.tags.indexOf(item.tagName) === -1) {
          this.blog.tags.push(item.tagName)
        }
      },
      removeTag(item) {
        const index = this.blog.tags.indexOf(item)
        this.blog.tags.splice(index, 1)
      }
    },
    created() {

      const _this = this
      const blogId = this.$route.params.blogId
      if(blogId) {
        getBlogDetail(blogId).then(res => {
          const blog = res.data.data
          _this.blog.id = blog.id
          _this.blog.title = blog.title
          _this.blog.summary = blog.summary
          _this.blog.content = blog.content
        })
      }

    }
}
</script>

<style scoped>
  .m-content {
    width: 100%;
    margin-top: 100px;
    text-align: center;
    min-height: 500px;
  }
</style>