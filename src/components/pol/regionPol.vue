<template>
  <div class="regionPol">
    <div class="tool">
      <el-button size="mini" type="primary" @click="dialog = true">上传文件</el-button>
      <el-input class="search" placeholder="请输入" size="mini" v-model="searchName" width="100">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button size="mini" type="primary" @click="getData">搜索</el-button>
    </div>
    <el-table :data="tableData" stripe border :height="tableHeigt" style="width: 100%">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="序号" fixed="left" width="60">
        <template slot-scope='scope'>
          {{(currentPage - 1) * pageSize + (scope.$index / 1 + 1) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="文件名称" min-width="110" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column prop="createTime" label="导入时间" min-width="110" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button title="查看" circle type="primary" size="mini" icon="el-icon-view"
                     @click="see(scope.row.id)"></el-button>
          <el-button title="删除" circle type="danger" size="mini" icon="el-icon-delete"
                     @click="del(scope.$index, scope.row)"></el-button>
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

    <el-dialog :close-on-click-modal="false" title="上传" :visible.sync="dialog" :width="'600px'">
      <el-form>
        <el-upload
          class="upload"
          :action="uploadUrl"
          :accept="'.pdf'"
          :on-success="success"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "regionPol",
    data() {
      return {
        searchName: "",
        tableHeigt: 0,
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        total: 1,
        multipleSelection: [],
        dialog: false,
        uploadUrl: basePath + '/sys/law/upload1',
        fileList: []
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 234;
        self.getData();
      });
    },
    methods: {
      getData() {
        let self = this;
        let data = {
          searchName: self.searchName,
          currPage: self.currentPage,
          pageSize: self.pageSize
        };
        self.$http.postForm("/sys/law/list1", data).then(function (res) {
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
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      success(res) {
        if (res.code == 0) {
          this.$message.success('上传成功');
          this.dialog = false;
          this.fileList = [];
          this.getData();
        } else {
          this.$message.error(res.msg);
        }
      },
      see(id) {
        window.open(basePath + '/sys/law/getFileById?id=' + id);
      },
      del(index, row) {
        let self = this;
        self.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/law/delete", row.id).then(function (res) {
            if (res.data.code == 0) {
              self.$message.success('删除成功');
              self.getData();
            } else {
              self.$message.error(res.data.msg);
            }
          });
        }).catch(() => {
          self.$message.info('已取消删除');
        });
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/sys.css";
</style>
