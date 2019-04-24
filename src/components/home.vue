<template>
  <div class="home">
    <el-row :gutter="20" class="block-a">
      <el-col :span="18" class="banner">
        <el-card class="box-card" :body-style="{'padding':0}">
          <el-carousel :interval="5000" :height="'286px'">
            <el-carousel-item key="1">
              <img class="banner-img" src="./../assets/images/banner1.jpg" alt="">
            </el-carousel-item>
            <el-carousel-item key="2">
              <img class="banner-img" src="./../assets/images/banner2.jpg" alt="">
            </el-carousel-item>
            <el-carousel-item key="3">
              <img class="banner-img" src="./../assets/images/banner3.jpg" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-row :gutter="5" style="margin-bottom: 5px;">
          <el-col :span="12" class="tips ac">
            <el-card class="box-card" :body-style="{'padding':0}">
              <div @click="jump(0)" class="tips-a">
                <div class="tips-a-a">
                  <span class="tips-num">{{count.a}}</span>
                </div>
                <p class="tips-a-text">核价待办</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" class="tips ac">
            <el-card class="box-card" :body-style="{'padding':0}">
              <div @click="jump(1)" class="tips-b">
                <div class="tips-b-b">
                  <span class="tips-num">{{count.b}}</span>
                </div>
                <p class="tips-b-text">投诉待办</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12" class="tips ac">
            <el-card class="box-card" :body-style="{'padding':0}">
              <div @click="jump(2)" class="tips-c">
                <div class="tips-c-a">
                  <span class="tips-num">{{count.c}}</span>
                </div>
                <p class="tips-a-text">路侧停车场</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" class="tips ac">
            <el-card class="box-card" :body-style="{'padding':0}">
              <div @click="jump(2)" class="tips-d">
                <div class="tips-d-a">
                  <span class="tips-num">{{count.d}}</span>
                </div>
                <p class="tips-b-text">其他停车场</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="block-b">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <div class="data-title">新核价停车场</div>
            <div class="line" v-for="(item,index) in newestAds.slice(0,5)" :key="index" @click="jump(2)">
              <i class="arrow"></i>
              <span class="content">{{item.name}}</span>
              <span class="date">{{item.createTime == null ? "" : item.createTime.substring(0, 10)}}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <div class="data-title">新报备停车场</div>
            <div class="line" v-for="(item,index) in newestComp.slice(0,5)" :key="index" @click="jump(2)">
              <i class="arrow"></i>
              <span class="content">{{item.name}}</span>
              <span class="date">{{item.createTime == null ? "" : item.createTime.substring(0, 10)}}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-card class="box-card map-box" :body-style="{'padding':'10px'}">
      <el-amap class="map" vid="amapDemo" :zoom="map.zoom" :center="markers[0].position">
        <el-amap-marker v-if="markers.length>0" v-for="(marker, index) in markers" :key="index"
                        :position="marker.position"
                        :events="marker.events"
                        :vid="index" :icon="map.mark_g"></el-amap-marker>
        <el-amap-info-window
          :offset=[0,-15]
          :position="currentWin.position"
          :content="currentWin.content"
          :visible="currentWin.visible"
          :events="currentWin.events">
        </el-amap-info-window>
      </el-amap>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "home",
    data() {
      let self = this;
      this.chartSettings = {
        dimension: ['日期']
      }
      return {
        count: {
          ad: 0,
          complain: 0
        },
        newestAds: [],
        newestComp: [],

        map: {
          center: [116.298331, 39.959956],
          zoom: 15,
          show: false,
          markers_green: [],
          markers_red: [],
          mark_g: require('./../assets/images/mark_g.png'),
          mark_r: require('./../assets/images/mark_r.png')
        },
        markers: [
          {position: [116.298331, 39.959956]}
        ],
        wins: [],
        currentWin: {
          position: [116.298331, 39.959956],
          content: '',
          visible: false,
          events: {}
        }
      };
    },
    created() {
      let self = this;

      self.$http.get("/sys/homePage/statistics").then(function (res) {
        if (res.data.code == 0) {
          self.count = res.data.result;
        }
      });
      self.$http.get("/sys/homePage/newestAd").then(function (res) {
        if (res.data.code == 0) {
          self.newestAds = res.data.list;
        }
      });
      self.$http.get("/sys/homePage/newestComp").then(function (res) {
        if (res.data.code == 0) {
          self.newestComp = res.data.list;
        }
      });
      self.$http.get("/sys/homePage/adMap").then(function (res) {
        if (res.data.code == 0) {
          let list = res.data.list;
          for (let i in list) {
            self.markers.push({
              position: [list[i].position.split(',')[0], list[i].position.split(',')[1]],
              events: {
                click: () => {
                  self.currentWin.visible = false;
                  self.$nextTick(() => {
                    self.currentWin = self.wins[i];
                    self.currentWin.visible = true;
                  });
                }
              }
            });
            self.wins.push({
              position: [list[i].position.split(',')[0], list[i].position.split(',')[1]],
              content: '<p>标题：' + list[i].name + '</p>' + '<p>地址：' + list[i].address + '</p>',
              visible: false,
              events: {}
            });
          }
        }
      })
      ;
    },
    methods: {
      jump(flag) {
        if (flag == 0) {
          this.$router.push("advaud");
        } else if (flag == 1) {
          this.$router.push("chandle");
        } else if (flag == 2) {
          this.$router.push("historyman");
        }
      }
    }
  }
</script>w

<style scoped>
  @import "./../css/home.css";
</style>
