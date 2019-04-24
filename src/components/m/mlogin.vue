<template>
  <div class="mlogin">
    <mt-navbar class="navbar" v-model="selected">
      <mt-tab-item class="navbar-item" id="a">密码</mt-tab-item>
      <mt-tab-item class="navbar-item" id="b">验证码</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="container" v-model="selected">
      <mt-tab-container-item id="a">
        <mt-field class="cell" label="手机号" type="tel" placeholder="请输入手机号" :state="state1.tel1"
                  v-model="tel1"></mt-field>
        <mt-field class="cell" label="密码" type="password" placeholder="请输入密码" :state="state1.password"
                  v-model="password"></mt-field>
        <mt-field class="cell" label="验证码" placeholder="请输入验证码" v-model="captcha">
          <img @click="changeuuid()" :src="'http://39.106.109.59:10089/api/captcha.jpg?uuid='+uuid"
               height="45px"
               width="100px">
        </mt-field>
        <p class="tip">{{tipText1}}</p>
        <mt-button class="login" type="primary" :disabled="loginBtnState1" @click.native="login(0)">登录</mt-button>
        <p class="opt">
          <span></span>
          <router-link to="mregister">注册</router-link>
        </p>
      </mt-tab-container-item>
      <mt-tab-container-item id="b">
        <mt-field class="cell" label="手机号" type="tel" placeholder="请输入手机号" :state="state2.tel2"
                  v-model="tel2"></mt-field>
        <mt-field class="cell" label="验证码" placeholder="请输入验证码" v-model="code">
          <mt-button size="small" plain :disabled="getCodeBtnState" @click="getCode">{{codeText}}</mt-button>
        </mt-field>
        <p class="tip">{{tipText2}}</p>
        <mt-button class="login" type="primary" :disabled="loginBtnState2" @click.native="login(1)">登录</mt-button>
        <p class="opt">
          <span></span>
          <!--<router-link to="mregister">注册</router-link>-->
        </p>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: "mlogin",
    data() {
      return {
        uuid: "",
        captcha: "",
        selected: "a",
        tel1: "",
        tel2: "",
        password: "",
        code: "",
        loginBtnState1: true,
        loginBtnState2: true,
        codeText: "获取验证码",
        timer: null,
        getCodeBtnState: false,
        state1: {
          tel1: "",
          password: "",
        },
        state2: {
          tel2: "",
        },
        tipText1: "",
        tipText2: ""
      }
    },
    watch: {
      tel1(val) {
//        if (/^1\d[0-9]{9}$/.test(val)) {
        if (val != "" || val != null) {
          this.state1.tel1 = "success";
          this.tipText1 = "";
        } else {
          this.state1.tel1 = "error";
          this.tipText1 = "请输入正确的手机号";
        }
        if (this.state1.tel1 == "success" && this.state1.password == "success") {
          this.loginBtnState1 = false;
        } else {
          this.loginBtnState1 = true;
        }
      },
      password(val) {
        if (/^[a-z0-9]{6,16}$/.test(val)) {
          this.state1.password = "success";
          this.tipText1 = "";
        } else {
          this.state1.password = "error";
          this.tipText1 = "密码只能由 6 到 16 个数字或字母组成";
        }
        if (this.state1.tel1 == "success" && this.state1.password == "success") {
          this.loginBtnState1 = false;
        } else {
          this.loginBtnState1 = true;
        }
      },
      tel2(val) {
        if (/^1\d[0-9]{9}$/.test(val)) {
          this.state2.tel2 = "success";
          this.tipText2 = "";
        } else {
          this.state2.tel2 = "error";
          this.tipText2 = "请输入正确的手机号";
        }
        if (this.state2.tel2 == "success") {
          this.loginBtnState2 = false;
        } else {
          this.loginBtnState2 = true;
        }
      }
    },
    created() {
      this.changeuuid();
    },
    methods: {
      changeuuid() {
        this.uuid = this.getuuid();
      },
      getuuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },
      getCode() {
        let self = this;
        if (/^1\d[0-9]{9}$/.test(self.tel2)) {
          self.state1.tel2 = "success";
          self.tipText2 = "";
          let t = 60;
          if (!self.getCodeBtnState) {
            self.$http.post("/phoneCode", self.tel2).then(function (res) {
              if (res.data.code == 0) {
                self.getCodeBtnState = true;
                self.timer = setInterval(function () {
                  if (t < 0) {
                    self.codeText = "获取验证码";
                    self.getCodeBtnState = false;
                    clearInterval(self.timer);
                  } else {
                    self.codeText = t + "秒后重发";
                  }
                  t--;
                }, 1000);
              } else {
                Toast(res.data.msg);
              }
            });
          }
        } else {
          self.state2.tel2 = "error";
          self.tipText2 = "请输入正确的手机号";
        }
      },
      login(e) {
        let self = this;
        if (e == 0) {
          if (self.state1.tel1 == "success" && self.state1.password == "success") {
            let data = {
              flag: 2,
              captcha: self.captcha,
              password: self.password,
              username: self.tel1,
              uuid: self.uuid
            };
            self.$http.post("/sys/login", data).then(function (res) {
              if (res.data.code == 0) {
                Toast('登录成功');
                localStorage.setItem("token", res.data.token);
                setTimeout(function () {
                  self.$router.back();
                }, 2000);
//                if (self.$route.query.s == "ios") {
//                  window.location.href = "gettoken://" + res.data.token;
//                  self.$router.push({
//                    name: 'mmy', query: {token: res.data.token, s: "ios"}
//                  });
//                } else {
//                  localStorage.setItem("token", res.data.token);
//                  setTimeout(function () {
//                    self.$router.push({path: '/mmy'});
//                  },2000);
//                }
              } else {
                self.changeuuid();
                Toast(res.data.msg);
              }
            });
          }
        } else if (e == 1) {
          if (self.state2.tel2 == "success") {
            let data = {
              flag: 1,
              username: self.tel2,
              phoneCode: self.code
            };
            self.$http.post("/sys/login", data).then(function (res) {
              if (res.data.code == 0) {
                Toast("登录成功");
                if (self.$route.query.s == "ios") {
                  window.location.href = "gettoken://" + res.data.token;
                  self.$router.push({
                    name: 'mmy', query: {token: res.data.token, s: "ios"}
                  });
                } else {
                  localStorage.setItem("token", res.data.token);
                  setTimeout(function () {
                    self.$router.push({path: '/mmy'});
                  },2000);
                }
//                self.$router.back();
              } else {
                Toast(res.data.msg);
              }
            });
          }
        }
      }
    }
  }
</script>

<style scoped>
  .navbar-item {
    text-decoration: none;
  }

  .container {
    margin-top: 20px;
  }

  .tip {
    padding-left: 15px;
    padding-top: 5px;
    height: 16px;
    color: #f56c6c;
    font-size: 12px;
  }

  .opt {
    display: flex;
    padding: 15px;
    justify-content: space-between;
    color: #999;
  }

  .opt a {
    color: #999;
  }

  .login {
    display: block;
    width: 95%;
    background: #4986D6;
    margin: auto;
    margin-top: 40px;
  }
</style>
