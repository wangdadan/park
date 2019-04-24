<template>
  <div class="comregistered">
    <div class="tool">
      <el-input class="search" style="margin-left: 0;" placeholder="请输入" size="mini" v-model="searchName" width="100">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button size="mini" type="primary" @click="getData">搜索</el-button>
    </div>
    <el-table :data="tableData" stripe border :height="tableHeigt" style="width: 100%">
      <el-table-column label="序号" width="60">
        <template slot-scope='scope'>
          {{(currentPage - 1) * pageSize + (scope.$index / 1 + 1) }}
        </template>
      </el-table-column>
      <el-table-column prop="companyNo" label="企业编号" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="companyName" label="企业全称" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="shortName" label="企业简称" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="parkingNum" label="经营停车场数量" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="principal" label="企业负责人" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="principalTel" label="联系电话" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button title="查看" circle type="primary" size="mini" icon="el-icon-view"
                     @click="see(scope.$index, scope.row)"></el-button>
          <el-button title="撤销登记" circle type="info" size="mini" icon="el-icon-back"
                     @click="undopass(scope.$index, scope.row)"></el-button>
          <el-button title="重新复核" circle type="primary" size="mini" icon="el-icon-refresh"
                     @click="reCheck(scope.$index, scope.row)"></el-button>
          <!--<el-button title="重置密码" circle type="primary" size="mini" icon="el-icon-setting"-->
          <!--@click="repass(scope.$index, scope.row)"></el-button>-->
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

    <!--查看-->
    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="seeForm" top="50px" :width="'1000px'">
      <el-form :model="editFormData">
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="企业全称" :label-width="'120px'" prop="companyName">
              <el-input v-model="editFormData.companyName" type="text" placeholder="请输入企业名称" readonly></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="企业简称" :label-width="'120px'">
              <el-input v-model="editFormData.shortName" type="text" placeholder="请输入简称" readonly></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="管理停车场数量" :label-width="'120px'">
              <el-input v-model="editFormData.parkingNum" type="text" placeholder="请输入管理停车场数量" readonly></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="注册资金" :label-width="'120px'">
              <el-input v-model="editFormData.registeredCapital" type="text" placeholder="请输入注册资金" readonly>
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="企业地址" :label-width="'120px'">
              <el-input v-model="editFormData.registeredAdd" type="text" placeholder="请输入注册地址" readonly></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="法人代表" :label-width="'120px'">
              <el-input v-model="editFormData.artificialPerson" type="text" placeholder="请输入法人代表" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="统一社会信用代码证" :label-width="'120px'" prop="licenseNo">
              <el-input v-model="editFormData.licenseNo" type="text" placeholder="请输入统一社会信用代码证" readonly></el-input>
              <el-upload
                class="upload"
                action=""
                :on-preview="download"
                disabled
                :file-list="fileList1">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item class="reg-item" label="企业负责人" :label-width="'120px'">
              <el-input v-model="editFormData.principal" type="text" placeholder="请输入经营负责人" readonly></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="联系电话" :label-width="'120px'">
              <el-input v-model="editFormData.principalTel" type="tel" placeholder="请输入负责人手机" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="seeForm = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "comregistered",
    data() {
      return {
        tableHeigt: 0,
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        searchName: '',
        total: 1,
        seeForm: false,
        editFormData: {},
        fileList1: [],               // 营业执照
        fileList2: [],
        fileList3: [],
        fileList4: [],

        repasswordData: {
          "id": ""
        }
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
        self.$http.postForm("/sys/company/passList", data).then(function (res) {
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
      getFileName(type, ids) {
        let self = this;
        for (let i in ids) {
          self.$http.get("/sys/file/getFileName", {id: ids[i]}).then(function (res) {
            if (res.data.code == 0) {
              if (type == 1) {
                self.fileList1.push({name: res.data.name, fid: ids[i]});
              } else if (type == 2) {
                self.fileList2.push({name: res.data.name, fid: ids[i]});
              } else if (type == 3) {
                self.fileList3.push({name: res.data.name, fid: ids[i]});
              } else if (type == 4) {
                self.fileList4.push({name: res.data.name, fid: ids[i]});
              }
            }
          });
        }
      },
      see(index, row) {
        let self = this;
        self.seeForm = true;
        self.editFormData = row;
        self.fileList1 = [];
        self.fileList2 = [];
        self.fileList3 = [];
        self.fileList4 = [];

        self.getFileName(1, row.license.split(","));
        self.getFileName(2, row.serviceFile.split(","));
        self.getFileName(3, row.operatingFile.split(","));
        self.getFileName(4, row.securityFile.split(","));
      },
      download(file) {
        let self = this;
        window.open(basePath + "/sys/file/downloadFileById?id=" + file.fid);
      },
      repass(index, row) {
        this.repasswordData.id = row.id;
        let self = this;
        self.$confirm('此操作将重置密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/company/resetPassword", self.repasswordData).then(function (res) {
            if (res.data.code == 0) {
              self.getData();
              self.$message.success('操作成功');
              self.repassword = false;
            } else {
              self.$message.error(res.data.msg);
            }
          });
        }).catch(() => {
          self.$message.info('已取消操作');
        });
      },
      undopass(index, row) {
        let self = this;
        self.$confirm('此操作将撤销登记, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/company/undopass", row.id).then(function (res) {
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
      },
      reCheck(index, row) {
        let self = this;
        self.$confirm('此操作将重新复核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/company/reCheck", row.id).then(function (res) {
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
