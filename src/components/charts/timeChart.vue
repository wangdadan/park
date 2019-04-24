<template>
  <div class="timeChart">
    <el-row class="charts" :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="box-card">
          <p>最近12个月停车价格投诉量及办结量</p>
          <ve-histogram :data="chartData1"></ve-histogram>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <p>	上周停车价格投诉量及办结量</p>
          <ve-histogram :data="chartData2"></ve-histogram>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "timeChart",
    data() {
      return {
        chartData1: {
          columns: ['日期', '投诉量', '处理量'],
          rows: []
        },
        chartData2: {
          columns: ['日期', '报送量', '审核量'],
          rows: []
        }
      }
    },
    created() {
      let self = this;
      self.$http.get("/sys/homePage/compMonthStatistics").then(function (res) {
        if (res.data.code == 0) {
          self.chartData1.rows = res.data.rows;
        }
      });
      self.$http.get("/sys/homePage/compWeekStatistics").then(function (res) {
        if (res.data.code == 0) {
          self.chartData2.rows = res.data.rows;
        }
      });
    }
  }
</script>

<style scoped>

</style>
