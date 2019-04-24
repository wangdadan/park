<template>
  <div class="login">
    <div class="top">海淀区停车价格管理信息系统</div>
    <div class="main">
      <div class="box">
        <div class="tabs">
          <div @click="tab('0')" class="tab" :class="{'sel' : tabToggle==true}">密码</div>
          <div @click="tab('1')" class="tab" :class="{'sel' : tabToggle!=true}">验证码</div>
        </div>
        <div class="forms">
          <el-form class="form" :model="loginForm1" :rules="rules" ref="loginForm1" v-show="tabToggle">
            <h1 class="title">欢迎您登录</h1>
            <p class="line"></p>
            <el-form-item prop="tel">
              <el-input type="tel" class="uname" v-model="loginForm1.tel" placeholder="帐号" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="loginForm1.password" placeholder="密码" clearable></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input class="login-code-input" v-model="loginForm1.code" placeholder="验证码" clearable></el-input>
              <!--<img class="login-code-img" @click="changeuuid()"-->
                   <!--:src="'http://zhangluffy.free.idcfengye.com/api/captcha.jpg?uuid='+uuid" alt="点击更换验证码">-->
              <img class="login-code-img" @click="changeuuid()"
                   :src="'http://39.106.109.59:10089/api/captcha.jpg?uuid='+uuid" alt="点击更换验证码">
            </el-form-item>
            <el-form-item>
              <el-button class="submit" @click="submitForm('loginForm1')">登录</el-button>
            </el-form-item>
            <div class="reg-link" @click="dialogRegister=true">点击注册</div>
          </el-form>
          <el-form class="form" :model="loginForm2" :rules="rules" ref="loginForm2" v-show="!tabToggle">
            <h1 class="title">欢迎您登录</h1>
            <p class="line"></p>
            <el-form-item prop="tel">
              <el-input type="tel" v-model="loginForm2.tel" placeholder="手机号" clearable></el-input>
            </el-form-item>
            <el-form-item prop="code" class="code-item">
              <el-input v-model="loginForm2.code" class="code-input" placeholder="验证码" clearable></el-input>
              <el-button class="getcode" :class="{'disabled':codeState}" @click="getcode" :disabled="codeState">{{codetext}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="submit" @click="submitForm('loginForm2')">登录</el-button>
            </el-form-item>
            <div class="reg-link" @click="dialogRegister=true">点击注册</div>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog title="注册" :visible.sync="dialogRegister" width="1000px" top="50px">
      <el-form :model="regForm" :rules="rules" ref="regForm">
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="手机号" :label-width="formLabelWidth" prop="username">
              <el-input type="tel" v-model="regForm.username" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="密码" :label-width="formLabelWidth" prop="pass">
              <el-input type="password" v-model="regForm.pass" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="确认密码" :label-width="formLabelWidth" prop="checkpass">
              <el-input type="password" v-model="regForm.checkpass" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="姓名" :label-width="formLabelWidth" prop="work">
              <el-input v-model="regForm.realName" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="身份证号" :label-width="formLabelWidth" prop="idNo">
              <el-input v-model="regForm.idNo" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="性别" :label-width="formLabelWidth">
              <el-radio v-model="regForm.sex" :label="0">男</el-radio>
              <el-radio v-model="regForm.sex" :label="1">女</el-radio>
            </el-form-item>
            <el-form-item class="reg-item" label="年龄" :label-width="formLabelWidth" prop="age">
              <el-input type="number" v-model="regForm.age" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="工作单位" :label-width="formLabelWidth" prop="work">
              <el-input v-model="regForm.work" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input type="email" v-model="regForm.email" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="住址" :label-width="formLabelWidth" prop="address">
              <el-input v-model="regForm.address" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRegister = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('regForm')">注 册</el-button>
      </div>
    </el-dialog>
    <div class="bottom">备案信息：北京市海淀区发展和改革委员会</div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      var validateTel = (rule, value, callback) => {
        let reg = /^1\d[0-9]{9}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      }
      var validatePassLogin = (rule, value, callback) => {
        let reg = /^[a-z0-9]{6,16}$/;
        if (!reg.test(value)) {
          callback(new Error('密码只能由 6 到 16 个数字或字母组成'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        let reg = /^[a-z0-9]{6,16}$/;
        if (!reg.test(value)) {
          callback(new Error('密码只能由 6 到 16 个数字或字母组成'));
        } else {
          if (this.regForm.checkPass !== '') {
            this.$refs.regForm.validateField('checkpass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value !== this.regForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validateIdno = (rule, value, callback) => {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (value == "" || value == null) {
          callback();
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的身份证号'));
        } else {
          callback();
        }
      };
      var validateAge = (rule, value, callback) => {
        if (value == "" || value == null) {
          callback();
        } else if (value < 0 && value > 500) {
          callback(new Error('请输入正确的年龄'));
        } else {
          callback();
        }
      };
      var validateEmail = (rule, value, callback) => {
        let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (value == "" || value == null) {
          callback();
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的电子邮箱'));
        } else {
          callback();
        }
      };
      return {
        uuid: "",
        tabToggle: true,
        loginForm1: {
          type: "",
          tel: "",
          password: "",
          code: ""
        },
        loginForm2: {
          type: "",
          tel: "",
          code: ""
        },
        regForm: {
          username: "",
          pass: "",
          password: "",
          checkpass: "",
          realName: "",
          sex: "",
          idNo: "",
          age: "",
          work: "",
          email: "",
          address: ""
        },
        rules: {
          username: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: validateTel, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: validatePassLogin, trigger: 'blur'}
          ],
          pass: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          checkpass: [
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
          ],
          realName: [
//            {validator: , trigger: 'blur'}
          ],
          idNo: [
            {validator: validateIdno, trigger: 'blur'}
          ],
          age: [
            {validator: validateAge, trigger: 'blur'}
          ],
          email: [
            {validator: validateEmail, trigger: 'blur'}
          ],
          work: [
            {required: false, message: '', trigger: 'blur'},
          ],
          address: [
            {required: false, message: '', trigger: 'blur'},
          ]
        },
        codetext: "获取验证码",
        timer: null,
        codeState: false,
        dialogRegister: false,
        formLabelWidth: "120px"
      };
    },
    beforeCreate: function() {
      document.getElementsByTagName("body")[0].className="login_body";
    },
    beforeDestroy: function() {
      document.body.removeAttribute("class","login_body");
    },
    created: function () {
      let self = this;
      window.localStorage.removeItem("token");
      self.changeuuid();
      if (self.$route.params.type == undefined) {
        self.$router.push({path: '/front'});
      } else {
        self.loginForm1.type = self.$route.params.type;
        self.loginForm2.type = self.$route.params.type;
      }
      // 若已登录，跳转main
      self.$http.get("/sys/user/info").then(function (res) {
        if (res.data.code == 0) {
          self.$router.push({path: '/main'});
        }
      });
    },
    methods: {
      tab: function (flag) {
        if (flag == 0) {
          this.tabToggle = true;
        } else {
          this.tabToggle = false;
        }
      },
      getcode: function () {
        let self = this;
        let t = 60;
        if (!self.codeState) {
          self.$http.post("/phoneCode", self.loginForm2.tel).then(function (res) {
            self.codeState = true;
            self.timer = setInterval(function () {
              if (t < 0) {
                self.codetext = "获取验证码";
                self.codeState = false;
                clearInterval(self.timer);
              } else {
                self.codetext = t + "秒后重发";
              }
              t--;
            }, 1000);
          });
        }
      },
      submitForm(formName) {
        let self = this;
        if (formName == "loginForm1") {
          let data = {
            flag: 2,
            type: self.loginForm1.type,
            captcha: self.loginForm1.code,
            password: self.loginForm1.password,
            username: self.loginForm1.tel,
            uuid: self.uuid
          };
          self.$refs[formName].validate(function (valid) {
            if (valid) {
              self.$http.post("/sys/login", data).then(function (res) {
                if (res.data.code == 0) {
                  self.$message.success('登录成功');
                  localStorage.setItem("token", res.data.token);
                  self.$router.push({path: '/main'});
                } else {
                  self.changeuuid();
                  self.$message.error(res.data.msg);
                }
              });
            } else {
              self.$message.error('登录失败');
              return false;
            }
          });
        } else if (formName == "loginForm2") {
          let data = {
            flag: 1,
            type: self.loginForm1.type,
            username: self.loginForm2.tel,
            phoneCode: self.loginForm2.code
          };
          self.$refs[formName].validate(function (valid) {
            if (valid) {
              self.$http.post("/sys/login", data).then(function (res) {
                if (res.data.code == 0) {
                  self.$message.success('登录成功');
                  localStorage.setItem("token", res.data.token);
                  self.$router.push({path: '/main'});
                } else {
                  self.changeuuid();
                  self.$message.error(res.data.msg);
                }
              });
            } else {
              self.$message.error('登录失败');
              return false;
            }
          });
        } else if (formName == "regForm") {
          self.$refs[formName].validate(function (valid) {
            if (valid) {
              self.regForm.password = self.regForm.pass;
              self.$http.post("/sys/user/register", self.regForm).then(function (res) {
                if (res.data.code == 0) {
                  self.dialogRegister = false;
                  self.$message.success('注册成功');
                } else {
                  self.$message.error(res.data.msg);
                }
              });
            } else {
              self.$message.error('注册失败');
              return false;
            }
          });
        }
      },
      changeuuid() {
        this.uuid = this.getuuid();
      },
      getuuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    }
  }
</script>

<style scoped>
  @import "./css/login.css";
</style>

