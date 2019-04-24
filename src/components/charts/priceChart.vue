<template>
  <div class="priceChart">
    <el-row class="charts" :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="box-card">
          <p>各收费价格区间停车场数量及占比</p>
          <ve-pie :data="chartData1"></ve-pie>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <p>各计价周期的停车场数量及占比</p>
          <ve-pie :data="chartData2"></ve-pie>
        </el-card>
      </el-col>
    </el-row>
    <!--<el-row class="charts" :gutter="20" style="margin-top: 20px;">-->
      <!--<el-col :span="12">-->
        <!--<el-card class="box-card">-->
          <!--<p>	按次收费停车场数量及价格分布</p>-->
          <!--<ve-pie :data="chartData1"></ve-pie>-->
          <!--&lt;!&ndash;<ve-histogram :data="chartData1"></ve-histogram>&ndash;&gt;-->
        <!--</el-card>-->
      <!--</el-col>-->
    <!--</el-row>-->
  </div>
</template>

<script>
  export default {
    name: "priceChart",
    data() {
      return {
        chartData1: {
          columns: ["名称", "数量"],
          rows: []
        },
        chartData2: {
          columns: ["名称", "数量"],
          rows: []
        },
        chartData3: {
          columns: ["名称", "数量"],
          rows: []
        }
      }
    },
    created() {
      let self = this;
      self.$http.get("/sys/homePage/price1").then(function (res) {
        if (res.data.code == 0) {
          self.chartData1.rows = res.data.rows;
        }
      });
      self.$http.get("/sys/homePage/price2").then(function (res) {
        if (res.data.code == 0) {
          self.chartData2.rows = res.data.rows;
        }
      });
//      self.$http.get("/sys/homePage/price3").then(function (res) {
//        if (res.data.code == 0) {
//          self.chartData3.rows = res.data.rows;
//        }
//      });
    }
  }
</script>

<style scoped>

</style>
