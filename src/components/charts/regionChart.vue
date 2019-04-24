<template>
  <div class="regionChart">
    <el-row class="charts" :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <p>各街道行政区域内的路侧占道停车场数量</p>
          <ve-bar :data="chartData1"></ve-bar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <p>各街道行政区域内的停车价格投诉量</p>
          <ve-pie :data="chartData2"></ve-pie>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "regionChart",
    data() {
      return {
        chartData1: {
          columns: ["名称","数量" ],
          rows: []
        },
        chartData2: {
          columns: ["名称", "数量"],
          rows: []
        }
      }
    },
    created() {
      let self = this;
      self.$http.get("/sys/homePage/area1").then(function (res) {
        if (res.data.code == 0) {
          self.chartData1.rows = res.data.rows;
        }
      });
      self.$http.get("/sys/homePage/area2").then(function (res) {
        if (res.data.code == 0) {
          self.chartData2.rows = res.data.rows;
        }
      });
    }
  }
</script>

<style scoped>

</style>
