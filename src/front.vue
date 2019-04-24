<template>
  <div class="front">
    <div class="top">海淀区停车价格管理信息系统
      <div class="app">
        <span>APP下载</span>
        <div class="codeImg">
          <div class="android">
            <img width="120px" :src="androidQR" alt="">
            安卓下载
          </div>
          <div class="android">
            <img width="120px" :src="iosQR" alt="">
            苹果下载
          </div>
        </div>
      </div>
    </div>
    <el-carousel :interval="5000" :height="bannerImgH">
      <el-carousel-item key="1">
        <img class="banner-img" src="./assets/images/banner1.jpg" alt="">
      </el-carousel-item>
      <el-carousel-item key="2">
        <img class="banner-img" src="./assets/images/banner2.jpg" alt="">
      </el-carousel-item>
      <el-carousel-item key="3">
        <img class="banner-img" src="./assets/images/banner3.jpg" alt="">
      </el-carousel-item>
    </el-carousel>
    <div class="main clear">
      <div class="block fl">
        <div class="title"><i class="icon-a"></i>新闻</div>
        <div class="line" v-for="(item,index) in newsList" :key="item.id">
          <i class="no">{{index + 1}}</i>
          <span class="content">{{item.title}}</span>
          <span class="date">{{item.newsDate != undefined ? item.newsDate.substring(0, 10) : ''}}</span>
        </div>
      </div>
      <div class="block fl">
        <div class="title"><i class="icon-b"></i>公告</div>
        <div class="line" v-for="item in annList" :key="item.id">
          <i class="arrow"></i>
          <span class="content">{{item.title}}</span>
          <span class="date">{{item.newsDate != undefined ? item.newsDate.substring(0, 10) : ''}}</span>
        </div>
      </div>
      <div class="block fl">
        <div class="login login-a clear" @click="toLogin(1)">
          <i class="login-icon fl"></i>
          <span class="fl">超级管理员</span>
        </div>
        <div class="login login-b clear" @click="toLogin(2)">
          <i class="login-icon fl"></i>
          <span class="fl">发改委用户</span>
        </div>
        <div class="login login-c clear" @click="toLogin(3)">
          <i class="login-icon fl"></i>
          <span class="fl">企业用户</span>
        </div>
      </div>
    </div>
    <div class="bottom">备案信息：北京市海淀区发展和改革委员会</div>
  </div>
</template>

<script>
  export default {
    name: "front",
    data() {
      return {
        bannerImgH: "",
        newsList: [],
        annList: [],
        iosQR: basePath + '/sys/file/showIOSQRCode',
        androidQR: basePath + '/sys/file/showAppQRCode'
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.bannerImgH = document.body.clientWidth / 3.25 + "px";
        self.getData();
      });
    },
    methods: {
      toLogin: function (type) {
        this.$router.push({
          name: 'login', params: {type: type}
        })
      },
      getData() {
        let self = this;
        let data1 = {
          currPage: 1,
          pageSize: 20,
          type: 1
        };
        let data2 = {
          currPage: 1,
          pageSize: 20,
          type: 2
        };
        self.$http.post("/sys/news/frontList", data1).then(function (res) {
          if (res.data.code == 0) {
            self.newsList = res.data.page.list;
          } else {
            self.$message.error(res.data.msg);
          }
        });
        self.$http.post("/sys/news/frontList", data2).then(function (res) {
          if (res.data.code == 0) {
            self.annList = res.data.page.list;
          } else {
            self.$message.error(res.data.msg);
          }
        });
      },
    }
  }
</script>

<style scoped>
  @import "./css/front.css";
</style>
