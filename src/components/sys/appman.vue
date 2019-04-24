<template>
  <div class="appman">
    <div class="tool">
      <el-button size="mini" type="primary" @click="dialog = true">上传文件</el-button>
      <el-input class="search" placeholder="请输入" size="mini" v-model="searchName" width="100">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button size="mini" type="primary" @click="getData">搜索</el-button>
    </div>
    <el-table :data="tableData" stripe border :height="tableHeigt" style="width: 100%">
      <el-table-column label="序号" fixed="left" width="60">
        <template slot-scope='scope'>
          {{(currentPage - 1) * pageSize + (scope.$index / 1 + 1) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="文件名称" min-width="110" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column prop="remark" label="版本号" min-width="110" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column prop="createTime" label="上传时间" min-width="110" :show-overflow-tooltip="true"
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

    <el-dialog :close-on-click-modal="false" title="上传" :visible.sync="dialog" :width="'600px'">
      <el-form>
        <el-upload
          class="upload"
          :action="uploadUrl"
          :headers="{token:token}"
          :accept="'.apk'"
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
    name: "appman",
    data() {
      return {
        token: null,
        searchName: "",
        tableHeigt: 0,
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        total: 1,
        multipleSelection: [],
        dialog: false,
        uploadUrl: basePath + '/sys/file/appUpload',
        fileList: []
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.token = localStorage.getItem('token');
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
        self.$http.postForm("/sys/file/appList", data).then(function (res) {
          self.tableData = res.data.page.list;
          self.total = res.data.page.totalCount;
        });
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
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/sys.css";
</style>
