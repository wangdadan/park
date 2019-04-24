<template>
  <div class="nav">
    <el-scrollbar class="scrollbar">
      <el-menu
        v-if="roleId!=0"
        @select="handleSelect"
        :collapse="isCollapse"
        :default-active="navIndex"
        class="el-menu"
        background-color="#222D32"
        text-color="#fff"
        active-text-color="#409EFF">
        <el-menu-item index="1" @click="jump('/home')">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-printer"></i>
            <span slot="title">停车价格管理</span>
          </template>
          <el-menu-item index="2-1" @click="jump('/historyman')">价格备案库</el-menu-item>
          <el-menu-item v-if="roleId!=6" index="2-2" @click="jump('/advaud')">待审核库</el-menu-item>
          <el-menu-item index="2-3" @click="jump('/advman')">待提交库</el-menu-item>
        </el-submenu>
        <el-submenu index="3" v-if="roleId!=6">
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span slot="title">企业管理</span>
          </template>
          <el-menu-item index="3-1" @click="jump('/comregistered')">已登记企业</el-menu-item>
          <el-menu-item index="3-2" @click="jump('/comcheck')">待审核企业</el-menu-item>
          <!--<el-menu-item index="3-3" @click="jump('/comblack')">企业黑名单</el-menu-item>-->
          <!--<el-menu-item index="3-4" @click="jump('/comnew')">待提交企业</el-menu-item>-->
        </el-submenu>
        <!--<el-submenu index="4">-->
        <!--<template slot="title">-->
        <!--<i class="el-icon-location-outline"></i>-->
        <!--<span slot="title">载体管理</span>-->
        <!--</template>-->
        <!--<el-menu-item index="4-1" @click="jump('/buildingInfo')">广告载体</el-menu-item>-->
        <!--</el-submenu>-->
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-bell"></i>
            <span slot="title">举报投诉管理</span>
          </template>
          <el-menu-item index="5-1" @click="jump('/chandle')">待处理案件</el-menu-item>
          <el-menu-item index="5-2" @click="jump('/chistory')">已办结案件</el-menu-item>
          <el-menu-item index="5-3" @click="jump('/invalid')">无效案件</el-menu-item>
        </el-submenu>
        <el-submenu index="8" v-if="roleId!=6">
          <template slot="title">
            <i class="el-icon-picture-outline"></i>
            <span>统计分析</span>
          </template>
          <el-menu-item index="8-1" @click="jump('/regionChart')">区域统计</el-menu-item>
          <el-menu-item index="8-2" @click="jump('/priceChart')">价格统计</el-menu-item>
          <el-menu-item index="8-3" @click="jump('/timeChart')">时间统计</el-menu-item>
          <!--<el-menu-item index="8-4" @click="jump('/companyChart')">企业统计</el-menu-item>-->
        </el-submenu>
        <el-submenu index="6" v-if="roleId!=6">
          <template slot="title">
            <i class="el-icon-news"></i>
            <span>新闻公告</span>
          </template>
          <el-menu-item index="6-1" @click="jump('/news')">行业新闻</el-menu-item>
          <el-menu-item index="6-2" @click="jump('/ann')">通知公告</el-menu-item>
        </el-submenu>
        <el-submenu index="9" v-if="roleId!=6">
          <template slot="title">
            <i class="el-icon-news"></i>
            <span>政策法规</span>
          </template>
          <el-menu-item index="9-1" @click="jump('/regionPol')">区级政策</el-menu-item>
          <el-menu-item index="9-2" @click="jump('/realPol')">市级政策</el-menu-item>
          <el-menu-item index="9-3" @click="jump('/nationPol')">国家政策</el-menu-item>
        </el-submenu>
        <el-submenu index="7" v-if="roleId!=6">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">系统管理</span>
          </template>
          <el-menu-item v-if="roleId==1" index="7-1" @click="jump('/userman')">后台用户管理</el-menu-item>
          <el-menu-item v-if="roleId!=2" index="7-2" @click="jump('/roleman')">角色权限管理</el-menu-item>
          <el-menu-item index="7-4" @click="jump('/dictionary')">字典管理</el-menu-item>
          <el-menu-item index="7-5" @click="jump('/dataman')">数据交换</el-menu-item>
          <el-menu-item v-if="roleId==1" index="7-6" @click="jump('/appman')">APP维护</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
  export default {
    name: "vnav",
    data() {
      return {}
    },
    methods: {
      handleSelect(key, keyPath) {
        this.$store.commit("navIndex", key);
      },
      jump: function (path) {
        let currpath = this.$route.path;
        if (currpath == path) {
          this.$router.push({
            name: 'redirect',
            params: {
              path: path
            }
          });
        } else {
          this.$router.push({path: path});
        }
      }
    },
    watch: {
      $route(to, from) {
        this.$store.commit("navIndex", this.$store.state.nav.list[to.name])
      }
    },
    created: function () {
      this.$store.commit("navIndex", this.$store.state.nav.list[this.$route.name]);
    },
    computed: {
      roleId() {
        return this.$store.state.sys.roleId;
      },
      isCollapse() {
        return this.$store.state.nav.isCollapse;
      },
      navIndex() {
        return this.$store.state.nav.index;
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/nav.css";
</style>
