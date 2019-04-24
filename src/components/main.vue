<template>
  <div class="main" id="main">
    <vheader></vheader>
    <el-container class="container">
      <el-aside style="width: auto">
        <vnav></vnav>
      </el-aside>
      <el-container>
        <el-main>
          <breadcrumb></breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import vheader from "./common/vheader"
  import breadcrumb from "./common/breadcrumb"
  import vnav from "./common/vnav"

  export default {
    components: {
      vheader, breadcrumb, vnav
    },
    name: "vmain",
    data() {
      return {}
    }
  }
</script>

<style>
  @import "./../css/main.css";
</style>
