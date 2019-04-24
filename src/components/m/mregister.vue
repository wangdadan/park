<template>
  <div class="mregister">
    <mt-field class="cell" label="手机号" type="tel" placeholder="请输入手机号（必填）" :state="state.username"
              v-model="username"></mt-field>
    <mt-field class="cell" label="密码" type="password" placeholder="请输入密码（必填）" :state="state.password"
              v-model="password"></mt-field>
    <mt-field class="cell" label="确认密码" type="password" placeholder="请再次输入密码（必填）" :state="state.checkpassword"
              v-model="checkpassword"></mt-field>
    <p class="tip">{{tipText}}</p>
    <mt-radio
      title=""
      v-model="sex"
      :options="options">
    </mt-radio>
    <mt-field class="cell" label="姓名" v-model="realName" placeholder="请输入姓名"></mt-field>
    <mt-field class="cell" label="身份证号" type="number" v-model="idNo" placeholder="请输入身份证号"
              :state="state.idNo"></mt-field>
    <mt-field class="cell" label="年龄" type="tel" v-model="age" placeholder="请输入年龄"></mt-field>
    <mt-field class="cell" label="工作单位" v-model="work" placeholder="请输入工作单位"></mt-field>
    <mt-field class="cell" label="邮箱" type="email" v-model="email" placeholder="请输入邮箱"
              :state="state.email"></mt-field>
    <mt-field class="cell" label="住址" v-model="address" placeholder="请输入住址"></mt-field>
    <mt-button class="reg" type="primary" :disabled="regBtnState" @click.native="reg">注册</mt-button>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui'
  import {Toast} from 'mint-ui'

  export default {
    name: "mregister",
    data() {
      return {
        options: [
          {
            label: "男",
            value: "0"
          },
          {
            label: "女",
            value: "1"
          }
        ],
        username: "",
        password: "",
        checkpassword: "",
        realName: "",
        idNo: "",
        sex: "",
        age: "",
        work: "",
        email: "",
        address: "",
        state: {
          username: "",
          password: "",
          checkpassword: "",
          idNo: "",
          email: ""
        },
        tipText: "",
        regBtnState: true,
      }
    },
    watch: {
      username(val) {
        if (/^1\d[0-9]{9}$/.test(val)) {
          this.state.username = "success";
          this.tipText = "";
        } else {
          this.state.username = "error";
          this.tipText = "请输入正确的手机号";
        }
        if (this.state.username == "success" && this.state.password == "success" && this.state.checkpassword == "success" && this.state.idNo != "error" && this.state.email != "error") {
          this.regBtnState = false;
        } else {
          this.regBtnState = true;
        }
      },
      password(val) {
        if (/^[a-z0-9]{6,16}$/.test(val)) {
          if (val != this.checkpassword) {
            this.state.password = "error";
            this.tipText = "两次密码输入不一致";
          } else {
            this.state.password = "success";
            this.state.checkpassword = "success";
            this.tipText = "";
          }
        } else {
          this.state.password = "error";
          this.tipText = "密码只能由 6 到 16 个数字或字母组成";
        }

        if (this.state.username == "success" && this.state.password == "success" && this.state.checkpassword == "success" && this.state.idNo != "error" && this.state.email != "error") {
          this.regBtnState = false;
        } else {
          this.regBtnState = true;
        }
      },
      checkpassword(val) {
        if (/^[a-z0-9]{6,16}$/.test(val)) {
          if (val != this.password) {
            this.state.checkpassword = "error";
            this.tipText = "两次密码输入不一致";
          } else {
            this.state.password = "success";
            this.state.checkpassword = "success";
            this.tipText = "";
          }
        } else {
          this.state.checkpassword = "error";
          this.tipText = "密码只能由 6 到 16 个数字或字母组成";
        }
        if (this.state.username == "success" && this.state.password == "success" && this.state.checkpassword == "success" && this.state.idNo != "error" && this.state.email != "error") {
          this.regBtnState = false;
        } else {
          this.regBtnState = true;
        }
      },
      idNo(val) {
        if (val != "") {
          if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)) {
            this.state.idNo = "success";
            this.tipText = "";
          } else {
            this.state.idNo = "error";
            this.tipText = "请输入正确的身份证号";
          }
        } else {
          this.state.idNo = "";
          this.tipText = "";
        }

        if (this.state.username == "success" && this.state.password == "success" && this.state.checkpassword == "success" && this.state.idNo != "error" && this.state.email != "error") {
          this.regBtnState = false;
        } else {
          this.regBtnState = true;
        }
      },
      email(val) {
        if (val != "") {
          if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val)) {
            this.state.email = "success";
            this.tipText = "";
          } else {
            this.state.email = "error";
            this.tipText = "请输入正确的邮箱";
          }
        } else {
          this.state.email = "";
          this.tipText = "";
        }

        if (this.state.username == "success" && this.state.password == "success" && this.state.checkpassword == "success" && this.state.idNo != "error" && this.state.email != "error") {
          this.regBtnState = false;
        } else {
          this.regBtnState = true;
        }
      }
    },
    methods: {
      reg() {
        let self = this;
        let data = {
          username: self.username,
          password: self.password,
          realName: self.realName,
          idNo: self.idNo,
          sex: self.sex,
          age: self.age,
          work: self.work,
          email: self.email,
          address: self.address
        };
        self.$http.post("/sys/user/register", data).then(function (res) {
          if (res.data.code == 0) {
            Toast('注册成功');
            self.$router.push({path: '/mmy'});
          } else {
            Toast(res.data.msg);
          }
        });
      },
      save() {
        Toast("保存成功");
      }
    }
  }
</script>

<style scoped>
  .reg, .save {
    display: block;
    width: 95%;
    background: #4986D6;
    margin: auto;
    margin-top: 40px;
  }

  .tip {
    padding-left: 10px;
    padding-top: 5px;
    height: 16px;
    color: #f56c6c;
    font-size: 12px;
  }
</style>
