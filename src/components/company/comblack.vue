<template>
  <div class="comblack">
    <el-table :data="tableData" stripe border :height="tableHeigt" style="width: 100%">
      <el-table-column label="序号" width="60">
        <template slot-scope='scope'>
          {{(currentPage - 1) * pageSize + (scope.$index / 1 + 1) }}
        </template>
      </el-table-column>
      <el-table-column prop="companyNo" label="企业编号"></el-table-column>
      <el-table-column prop="companyName" label="企业名称"></el-table-column>
      <el-table-column prop="shortName" label="企业简称"></el-table-column>
      <el-table-column prop="principal" label="负责人"></el-table-column>
      <el-table-column prop="principalTel" label="负责人电话"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button title="移除" circle type="danger" size="mini" icon="el-icon-minus"
                     @click="remove(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
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
    name: "comblack",
    data() {
      return {
        tableHeigt: 0,
        tableData: [],
        searchName: '',
        currentPage: 1,
        pageSize: 20,
        total: 1
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 234 + 47;
        self.getData();
      });
    },
    methods: {
      getData() {
        let self = this;
        let data = {
          currPage: self.currentPage,
          pageSize: self.pageSize
        };
        self.$http.postForm("/sys/company/banList", data).then(function (res) {
          self.tableData = res.data.page.list;
          self.total = res.data.page.totalCount;
        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      remove(index, row) {
        let self = this;
        self.$confirm('此操作将移出黑名单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/company/undoban", row.id).then(function (res) {
            if (res.data.code == 0) {
              self.getData();
              self.$message.success('操作成功');
            } else {
              self.$message.error(res.data.msg);
            }
          });
        }).catch(() => {
          self.$message.info('已取消操作');
        });
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/sys.css";
</style>
