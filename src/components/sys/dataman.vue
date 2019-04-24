<template>
  <div class="dataman">
    <div class="tool">
      <el-button size="mini" type="primary" @click="dialog = true">备案信息导入</el-button>
      <el-button size="mini" type="primary" @click="download">备案信息导出</el-button>
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
      <el-table-column prop="remark" label="导入状态" min-width="110" :show-overflow-tooltip="true"
                       resizable></el-table-column>
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

    <el-dialog :close-on-click-modal="false" title="备案信息导入" :visible.sync="dialog" :width="'600px'">
      <el-form>
        <el-upload
          class="upload"
          :action="uploadUrl"
          multiple
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
    name: "dataman",
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
        uploadUrl: basePath + '/sys/basedata/upload',
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
        self.$http.postForm("/sys/basedata/list", data).then(function (res) {
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
      download(){
        window.open("/api/sys/basedata/export");
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/sys.css";
</style>
