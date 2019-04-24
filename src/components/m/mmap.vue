<template>
  <div class="mmap">
    <div class="map-icons clear">
      <div class="map-icons-a fl">未备案</div>
      <div class="map-icons-b fl">已备案</div>
    </div>
    <baidu-map
      class="mmapbox"
      :center="map.center"
      :zoom="map.zoom"
      :scroll-wheel-zoom="true"
      @ready="mapReady">
      <bm-marker :key="index" v-for="(marker,index) in map.markers_green" :position="marker.position"
                 :icon="{url: map.mark_g, size: {width: 20, height: 25}}" :dragging="false"
                 @click="handleClick(marker.id)">
      </bm-marker>

      <bm-marker :key="index" v-for="(marker,index) in map.markers_red" :position="marker.position"
                 :icon="{url: map.mark_r, size: {width: 20, height: 25}}" :dragging="false"
                 @click="handleClick(marker.id)">
      </bm-marker>
    </baidu-map>
  </div>
</template>

<script>
  export default {
    name: "mmap",
    data() {
      return {
        map: {
          center: {lng: 116.304782, lat: 39.966128},
          zoom: 13,
          show: false,
          markers_green: [],
          markers_red: [],
          mark_g: require('./../../assets/images/mark_g.png'),
          mark_r: require('./../../assets/images/mark_r.png')
        }
      }
    },
    methods: {
      mapReady({BMap, map}) {
        let self = this;
        self.$http.get("/sys/homePage/adMap").then(function (res) {
          if (res.data.code == 0) {
            let list = res.data.list;
            for (let i in list) {
              if (list[i].state == 9) {
                self.map.markers_green.push({
                  id: list[i].id,
                  name: list[i].title,
                  buildingName: list[i].buildingName,
                  address: list[i].address,
                  show: false,
                  position: {lng: list[i].position.split(",")[0], lat: list[i].position.split(",")[1]}
                })
              } else {
                self.map.markers_red.push({
                  id: list[i].id,
                  name: list[i].title,
                  buildingName: list[i].buildingName,
                  address: list[i].address,
                  show: false,
                  position: {lng: list[i].position.split(",")[0], lat: list[i].position.split(",")[1]}
                })
              }
            }
          }
        });
      },
      handleClick(id) {
        this.$router.push({
          name: 'madvinfo', query: {id: id}
        });
      }
    }
  }
</script>

<style scoped>
  body{
    height: auto;
  }
  .mmap {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .mmapbox {
    width: 100%;
    height: 100%;
  }

  .map-icons {
    position: absolute;
    z-index: 100;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, .5);
  }

  .map-icons-a, .map-icons-b {
    cursor: pointer;
    text-align: center;
    width: 70px;
    height: 60px;
    line-height: 94px;
    font-size: 12px;
  }

  .map-icons-a {
    background: url("./../../assets/images/mark_r.png") no-repeat center 10px;
    color: #bf010e;
  }

  .map-icons-b {
    background: url("./../../assets/images/mark_g.png") no-repeat center 10px;
    color: #00a173;
  }

</style>
