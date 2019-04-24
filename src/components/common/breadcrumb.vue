<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="'home'">首页</el-breadcrumb-item>
      <div v-if="$route.name!='home'">
        <el-breadcrumb-item>{{name[$route.name].split('-')[0]}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{name[$route.name].split('-')[1]}}</el-breadcrumb-item>
      </div>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: "breadcrumb",
    data() {
      return {}
    },
    computed: {
      name() {
        return this.$store.state.nav.name;
      }
    }
  }
</script>

<style scoped>
  .breadcrumb {
    padding: 10px 0;
    background: #fff;
    margin-bottom: 20px;
  }
</style>
