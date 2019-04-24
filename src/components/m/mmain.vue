<template>
  <div class="mmain">
    <topbar class="topbar"></topbar>
    <div class="container"
         :style="{'height':bodyH,'overflow':'auto','background':'#F2F4F7','margin-top':'50px'}">
      <router-view></router-view>
    </div>
    <mt-tabbar v-show="tabbar" class="tabbar" v-model="active">
      <mt-tab-item @click.native="navClick" id="mnews" class="tabbar-item">
        <i class="iconfont icon-news homeicon"></i>
        新闻
      </mt-tab-item>
      <mt-tab-item @click.native="navClick" id="mnotice" class="tabbar-item">
        <i class="iconfont icon-announce homeicon"></i>
        公告
      </mt-tab-item>
      <mt-tab-item @click.native="navClick" class="tabbar-item">
        <i class="iconfont homeicon"></i>
      </mt-tab-item>
      <div @click="scan" class="tabbar-item-scan">
        <i class="scan"></i>
        <p class="scan-text">扫一扫</p>
      </div>
      <mt-tab-item @click.native="navClick" id="mmy" class="tabbar-item">
        <i class="iconfont icon-my homeicon"></i>
        政策
      </mt-tab-item>
      <mt-tab-item @click.native="navClick" id="mmap" class="tabbar-item">
        <i class="iconfont icon-announce homeicon"></i>
        地图
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  import topbar from "./mtopbar"

  export default {
    components: {
      topbar
    },
    name: "mmain",
    data() {
      return {
        active: "",
        tabbar: true
      }
    },
    created() {
      this.active = this.$route.name;
    },
    computed: {
      bodyH() {
        if (["mcomplainlist", "mcomplaindes", "madvinfo", "mcomplain"].indexOf(this.$route.name) != -1) {
          this.tabbar = false;
          return (this.$store.state.m_home.bodyH0 + "px");
        } else {
          this.tabbar = true;
          return (this.$store.state.m_home.bodyH + "px");
        }
      }
    },
    methods: {
      scan() {
        window.location.href = "scanning://scan";
      },
      navClick: function (e) {
        this.$router.push({path: this.active})
      }
    }
  }
</script>
<style scoped>
  .topbar {
    position: fixed;
    z-index: 900;
    width: 100%;
    top: 0;
    left: 0;
  }

  .tabbar {
    position: fixed;
    z-index: 900;
    bottom: 0;
    border-top: 1px solid #DDDDDD;
    box-shadow: 0 0 10px 0 hsla(0, 6%, 58%, .6);
  }

  .tabbar-item {
    text-decoration: none;
    background: #fff !important;
    font-size: 10px;
  }

  .homeicon {
    display: block;
    font-size: 24px;
  }

  .tabbar-item-scan {
    position: absolute;
    left: 50%;
    top: -25px;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  .scan {
    cursor: pointer;
    display: block;
    width: 60px;
    height: 60px;
    background: url("./../../assets/images/sao.png") no-repeat center;
    -webkit-background-size: contain;
    background-size: contain;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }

  .scan-text {
    margin-top: -5px;
  }
</style>
