<template>
  <div>
      <el-dialog :visible.sync="show" width="500px" @close="closeLogin">
<!--        <el-divider></el-divider>-->
        <el-form v-if="showLogin" :label-position="labelPosition" :rules="loginRules" :model="loginForm" ref="loginForm">
          <div class="passwordLogin" v-if="showPasswordLogin">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username" @keyup.enter.native='login'
                        placeholder="请输入用户名或邮箱" :disabled="!loginType.password"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="loginForm.password" @keyup.enter.native='login'
                        placeholder="请输入密码" :disabled="!loginType.password"></el-input>
            </el-form-item>
            <el-row class="btn">
              <el-button class="loginBtn" type="primary" @click="login" :disabled="!loginType.password">登录</el-button>
              <el-button class="registerBtn" type="info" @click="goRegister" :disabled="!loginType.password">注册</el-button>
            </el-row>
          </div>
          <div v-if="!showPasswordLogin" style="text-align: center" class="block">
            <el-image :src="wechatOrCode" style="width: 250px;">
              <div slot="error" class="image-slot" @click="refreshWechatCode">
                <i class="el-icon-refresh" style="height: 250px; line-height: 250px; cursor: pointer">点击刷新</i>
              </div>
            </el-image>
          </div>
        </el-form>
        <el-form v-if="showRegisterForm" :rules="rules" :label-position="labelPosition" :model="registerForm" ref="registerForm">
          <el-form-item label="账号" prop="username">
            <el-input v-model="registerForm.username" placeholder="用户名长度在5~20之间" ></el-input>
          </el-form-item>

          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="registerForm.nickName" placeholder="昵称长度在1~20之间" ></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="registerForm.password" placeholder="密码长度在5~20之间" ></el-input>
          </el-form-item>

          <el-form-item label="重复密码" prop="password2">
            <el-input type="password" v-model="registerForm.password2" placeholder="请再次输入密码" ></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入正确的邮箱进行注册认证" ></el-input>
          </el-form-item>

          <el-row class="btn">
            <el-button class="loginBtn" type="primary" @click="doRegister" >注册</el-button>
            <el-button class="registerBtn" type="info" @click="goLogin" >返回登录</el-button>
          </el-row>
        </el-form>
      </el-dialog>
  </div>
</template>

<script>
  import {loginApi, registerApi} from "@/api/RbacApi";
  import { Loading } from 'element-ui';
  import {mapMutations} from "vuex";
  export default {
    name: "LoginBox",
    data() {
      return {
        show: true,
        loading: null,
        option: {
          fullscreen: true,
          lock: true
        },
        showPasswordLogin: true, // 是否显示账号密码登录
        wechatOrCode: "", // 微信公众号登录二维码
        ticket: "", // 用户的票券
        // 显示登录页面
        showLogin: true,
        showRegisterForm: false,
        isLogin: false,
        table: false,
        dialog: false,
        labelPosition: "right",
        loginForm: {
          username: "",
          password: ""
        },
        registerForm: {
          username: "",
          password: "",
          password2: "",
          email: ""
        },
        // 登录类别
        loginType: {
          password: true,
          gitee: true,
          github: true,
          qq: true,
          wechat: true
        },
        loginRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            { min: 4, message: "用户名长度大于等于 5 个字符", trigger: "blur" },
            { max: 20, message: "用户名长度不能大于 20 个字符", trigger: "blur" }
          ],
          nickName: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
            { min: 1, message: "用户名长度大于等于 1 个字符", trigger: "blur" },
            { max: 20, message: "用户名长度不能大于 20 个字符", trigger: "blur" }
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 4, message: "密码长度需要大于等于 5 个字符", trigger: "blur" },
            { max: 20, message: "密码长度不能大于 20 个字符", trigger: "blur" }
          ]
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            { min: 4, message: "用户名长度大于等于 5 个字符", trigger: "blur" },
            { max: 20, message: "用户名长度不能大于 20 个字符", trigger: "blur" }
          ],
          nickName: [
            {required: true, message: '请输入昵称', trigger: 'blur'}
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 4, message: "密码长度需要大于等于 5 个字符", trigger: "blur" },
            { max: 20, message: "密码长度不能大于 20 个字符", trigger: "blur" }
          ],
          password2: [
            { required: true, message: "请再次输入密码", trigger: "blur" },
            { min: 4, message: "密码长度需要大于等于 5 个字符", trigger: "blur" },
            { max: 20, message: "密码长度不能大于 20 个字符", trigger: "blur" }
          ],
          email: [
            { required: true, message: "邮箱不能为空", trigger: "blur" },
            {pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: '请输入正确的邮箱'},
          ]
        }
      };
    },
    components: {},
    created() {
    },
    methods: {
      ...mapMutations(['setUserInfo', 'setLoginState']),
      title() {
        let res = "登录"
        if(this.showLogin && this.showPasswordLogin) {
          res = '登录'
        } else if (this.showLogin && !this.showPasswordLogin){
          res = '公众号扫码登录'
        } else if (this.showRegisterForm) {
          res = '注册'
        }
        return res
      },
      login: function () {
        this.$refs.loginForm.validate((valid) => {
          if(!valid) {
            return;
          }

          loginApi(this.loginForm).then(res => {

            this.show = false
            if (res.data.code === 200) {
              // 跳转到首页
              // let jwt = res.headers['authorization']
              let jwt = res.data.data.accessToken;
              let user = res.data.data.userVO
              this.$store.commit('SET_TOKEN', jwt)
              this.$store.commit('SET_USERINFO', user)

              this.$router.push("/")
              // window.location.reload()
            } else {
              this.$message({
                type: "error",
                message: res.data
              })
            }
          });

        })
      },
      doRegister: function () {
        this.$refs.registerForm.validate((valid) => {
          if(valid) {
            let passWord = this.registerForm.password;
            let passWord2 = this.registerForm.password2;
            if(passWord !== passWord2) {
              this.$message({
                type: "success",
                message: "两次密码不一致"
              })
              return
            }
            let params = {};
            params.username = this.registerForm.username;
            params.password = this.registerForm.password;
            params.email = this.registerForm.email;
            params.nickname = this.registerForm.nickname
            registerApi(params).then(response => {
              if (response.data.code === 200) {
                this.$message({
                  type: "success",
                  message: response.data.msg
                })
              } else {
                this.$message({
                  type: "error",
                  message: response.data
                })
              }
              this.showLogin = false
            });
          }
        })
      },
      goLogin: function () {
        this.showRegisterForm = false
        this.showLogin = true
      },
      goRegister: function () {
        this.registerForm.username="";
        this.registerForm.password="";
        this.registerForm.password2="";
        this.registerForm.email="";
        this.showRegisterForm = true;
        this.showLogin = false;
      },
      userInfoStatus: function () {
        getUserLoginStatus().then(response => {
            console.log("获取用户状态", response)
        });
      },
      // 刷新微信二维码
      refreshWechatCode: function () {
        let that = this
        getWechatOrCodeTicket().then(response => {
          if (response.code === this.$ECode.SUCCESS) {
            console.log("得到的响应", response)
            this.showPasswordLogin = false
            let data = response.data
            let ticket = data.ticket
            this.wechatOrCode = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + ticket
            this.ticket = ticket
            let count = 0
            let interval = setInterval(() => {
              count++
              // 当检查5次未扫码的时候，将二维码失效，重试关闭接口请求
              if(count > 5) {
                this.wechatOrCode = ""
                clearInterval(interval)
              }
              let params = new URLSearchParams()
              params.append("ticket", ticket)
              getUserLoginStatus(params).then(response => {
                console.log("获取用户状态", response)
                if(response.code === that.$ECode.SUCCESS) {
                  let token = ticket
                  // 判断url中是否含有token
                  if (token != null) {
                    // 设置token七天过期
                    // setCookie("token", token, 7)
                  }
                  this.setUserInfo(response.data)
                  this.setLoginState(true);
                  location.reload();
                }
              });
            }, 3000);

          } else {
            this.$message.error(response.message)
          }
        });
      },
      goAuth: function (source) {

        // 判断是否点击公众号登录
        if(source === "wechat") {
          console.log("点击公众号登录")
          this.refreshWechatCode()
          return
        }
        this.loading = Loading.service({
          lock: true,
          text: '加载中……',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let params = new URLSearchParams();
        params.append("source", source);
        loginApi(params).then(response => {
          if (response.data.code === 200) {
            let token = response.data.token;
            window.location.href = response.data.url
          }
        });
      },
      closeLogin() {
        this.$emit("closeLoginBox");
      }
    }
  };
</script>


<style>
  .box {
    width: 400px;
    height: 420px;
    background: white;
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 101; /* 要比遮罩层大 */
  }

  .registerBox {
    height: 660px;
  }

  .box .title {
    height: 48px;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    line-height: 48px;
  }
  .box .title .t2 {
    font-size: 16px;
    float: right;
    margin-right: 6px;
    margin-top: -6px;
    cursor: pointer;
  }

  .box .el-divider--horizontal {
    margin: 12px 0;
  }

  .box .el-form-item__label {
    margin-left: 10px;
    font-size: 16px;
  }

  .box .el-input__inner {
    margin-left: 10px;
    width: 90%;
  }

  .box .btn {
    text-align: center;
  }

  .box .loginBtn {
    width: 40%;
  }

  .box .registerBtn {
    width: 40%;
  }

  .elRow {
    margin-top: 15px;
    text-align: center;
  }

  .loginTip {
    margin-top: 10px;
    font-size: 14px;
    text-align: center;
    color: #bababa;
  }

  .remarksBox {
    position: fixed;
    left: 50%;
    margin-left: -100px;
    top: 50%;
    margin-top: -50px;
    border: 1px solid red;
    width: 200px;
    height: 100px;
    text-align: center;
    z-index: 101; /* 要比遮罩层大 */
  }

  /* 遮罩层 */
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
</style>
