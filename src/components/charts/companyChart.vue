<template>
  <div class="companyChart">
    <el-row class="charts" :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="box-card">
          <p>本年度内关联企业累计被投诉量及所辖停车场数量</p>
          <ve-histogram :data="chartData1"></ve-histogram>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "companyChart",
    data() {
      return {
        chartData1: {
          columns: ['日期', '投诉量', '处理量'],
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
    }
  }
</script>

<style scoped>

</style>
