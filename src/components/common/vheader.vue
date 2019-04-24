<template>
  <div class="vheader clear">
    <el-button icon="el-icon-arrow-left" v-show="!show" type="primary" size="mediums" class="fl collapse"
               @click="$store.commit('navSwitch')"></el-button>
    <el-button icon="el-icon-arrow-right" v-show="show" type="primary" size="mediums" class="fl collapse"
               @click="$store.commit('navSwitch')"></el-button>
    <h1 class="title ac fl">海淀区停车价格管理信息系统</h1>
    <div class="user fr">
      <span>{{username}}</span>
      <span v-show="ishow" class="exit" @click="logout">[退出]</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "vheader",
    data() {
      return {
        username: "",
        ishow: false
      }
    },
    created: function () {
      let self = this;
      self.$http.get("/sys/user/info").then(function (res) {
        if (res.data.code == 0) {
          self.username = res.data.user.username;
          self.ishow = true;
          self.$store.commit("setRoleId",res.data.user.roleId);
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },
    computed: {
      isCollapse() {
        return this.$store.state.nav.isCollapse;
      },
      show() {
        return this.$store.state.nav.isCollapse;
      }
    },
    methods: {
      logout() {
        let self = this;
        self.$http.post("/sys/logout").then(function (res) {
          if (res.data.code == 0) {
            self.$router.push({path: '/front'});
            self.$message.success("您已成功退出");
          } else {
            self.$message.error(res.data.msg);
          }
        });
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/vheader.css";
</style>
