<template>
  <div class="role" v-show="ishow">
    <el-table :data="tableData" ref="multipleTable" border style="width: 100%">
      <el-table-column prop="roleName" label="角色名称" width="500"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button title="查看" circle type="success" size="mini" icon="el-icon-view"
                     @click="toUser(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      ishow: {
        type: Boolean,
        default: true,
      }
    },
    name: "role",
    data() {
      return {
        tableData: []
      }
    },
    created() {
      let self = this;
      self.$http.get("/sys/role/list").then(function (res) {
        if (res.data.code == 0) {
          self.tableData = res.data.page.list;
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },
    methods: {
      toUser: function (row) {
        this.$store.commit('switchRoleMan', row.roleId);
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/sys.css";
</style>
