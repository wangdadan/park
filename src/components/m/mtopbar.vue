<template>
  <div>
    <header class="mtopbar">
      <!--<span v-show="toggle" class="item"><i class="iconfont icon-saoyisao icon"></i><br><span-->
        <!--class="mark" @click="scan">扫一扫</span></span>-->
      <!--<span v-show="toggle" class="item" @click="tomap"><i class="iconfont icon-ditu icon"></i><br><span-->
        <!--class="mark">地图</span></span>-->
      <span v-show="!toggle" class="back" @click="back"><i class="iconfont icon-fanhui icon"></i><span
        class="back-text">{{navText}}</span></span>
    </header>
  </div>
</template>

<script>
  export default {
    name: "mtopbar",
    data() {
      return {
        toggle: true,
        navText: "",
      }
    },
    methods: {
      scan() {
        window.location.href = "scanning://scan";
      },
      tomap() {
        this.$router.push("mmap");
      },
      back() {
        let self = this;
        this.$router.back();
//        if (self.$route.query.s == "ios") {
//          let str = location.href.split("?")[1];
//          location.href = location.origin + "/#/mmy" + (str == undefined ? "" : "?" + str);
//        } else {
//          self.$router.push({path: '/mmy'});
//        }
      }
    },
    watch: {
      $route(to, from) {
        let self = this;
        switch (to.name) {
          case "mhome":
          case "mnews":
          case "mnotice":
          case "mmy":
            self.toggle = true;
            break;
          case "mnewsdes":
            self.toggle = false;
            self.navText = "新闻详情";
            break;
          case "mnoticedes":
            self.toggle = false;
            self.navText = "公告详情";
            break;
          case "mlogin":
            self.toggle = false;
            self.navText = "登录";
            break;
          case "mregister":
            self.toggle = false;
            self.navText = "注册";
            break;
          case "mcomplainlist":
          case "mcomplaindes":
            self.toggle = false;
            self.navText = "我的投诉";
            break;
          case "madvinfo":
            self.toggle = false;
            self.navText = "停车场信息";
            break;
//          case "mmap":
//            self.toggle = false;
//            self.navText = "地图";
//            break;
          case "mcomplain":
            self.toggle = false;
            self.navText = "投诉";
            break;
        }
      }
    }
  }
</script>

<style scoped>
  .mtopbar {
    height: 50px;
    background: #5A93DA;
    padding: 0 15px;
    color: #fff;
    display: flex;
    justify-content: space-between;
  }

  .icon {
    font-size: 20px;
  }

  .mark {
    font-size: 12px;
    position: relative;
    top: -2px;
  }

  .item {
    cursor: pointer;
    width: 40px;
    text-align: center;
    padding-top: 7px;
  }

  .back {
    cursor: pointer;
    line-height: 50px;
    font-size: 16px;
  }

  .back-text {
    margin-left: 10px;
    position: relative;
    top: -2px;
  }
</style>
