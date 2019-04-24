<template>
  <div class="user" v-show="ishow">
    <div class="tool">
      <el-button size="mini" type="info" @click="$store.commit('switchRoleMan',null)">返回</el-button>
      <el-input class="search" placeholder="请输入" size="mini" v-model="searchName" width="100">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button size="mini" type="primary" @click="getData">搜索</el-button>
    </div>
    <div class="table-name">{{tableName}}</div>
    <el-table :data="tableData" :height="tableHeigt" stripe border style="width: 100%">
      <el-table-column label="序号" width="60">
        <template slot-scope='scope'>
          {{(currentPage - 1) * pageSize + (scope.$index / 1 + 1) }}
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="姓名"></el-table-column>
      <el-table-column width="100" prop="sex" label="性别">
        <template slot-scope='scope'>
          <p>{{scope.row.sex == 0 ? '男' : '女'}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="" label="职务"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      ishow: {
        type: Boolean,
        default: true
      }
    },
    name: "user",
    data() {
      return {
        tableHeigt: 0,
        tableData: [],
        searchName: '',
        currentPage: 1,
        pageSize: 20,
        total: 1,
      }
    },
    created() {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 244;
      });
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val;
      }
      ,
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      getData(id) {
        let self = this;
        let data = {
          searchName: self.searchName,
          currPage: self.currentPage,
          pageSize: self.pageSize,
          roleId: id
        };
        self.$http.postForm("/sys/user/newList", data).then(function (res) {
          if (res.data.code == 0) {
            self.tableData = res.data.page.list;
            self.total = res.data.page.totalCount;
          } else {
            self.$message.error(res.data.msg);
          }
        });
      },
    }
    ,
    computed: {
      tableName() {
        let id = this.$store.state.sys.roleIdMan;
        if (id != null) {
          this.getData(id);
        }
        switch (id) {
          case "1":
            return "超级管理员";
            break;
          case "2":
            return "管理员";
            break;
          case "3":
            return "城管执法大队";
            break;
          case "4":
            return "街道办事处";
            break;
          case "5":
            return "企业";
        }
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/sys.css";
</style>
