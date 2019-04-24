<template>
  <div class="comnew">
    <div class="tool">
      <el-button size="mini" type="primary" @click="add">添加</el-button>
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
      <el-table-column prop="companyName" label="企业名称" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="shortName" label="企业简称" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="principal" label="负责人" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="principalTel" label="负责人电话" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button title="编辑" circle type="primary" size="mini" icon="el-icon-edit"
                     @click="edit(scope.$index, scope.row)"></el-button>
          <el-button title="提交审核" circle type="primary" size="mini" icon="el-icon-check"
                     @click="take(scope.$index, scope.row)"></el-button>
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
    <!--新增-->
    <el-dialog :close-on-click-modal="false" title="添加" :visible.sync="addForm" top="50px" :width="'1000px'">
      <el-form :model="addFormData" :rules="rules" ref="addForm">
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="企业名称" :label-width="'120px'" prop="companyName">
              <el-input v-model="addFormData.companyName" type="text" placeholder="请输入企业名称" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="企业简称" :label-width="'120px'">
              <el-input v-model="addFormData.shortName" type="text" placeholder="请输入简称" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="登录密码" :label-width="'120px'">
              <el-input v-model="addFormData.password" type="password" placeholder="请输入登录密码" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="企业性质" :label-width="'120px'">
              <el-select v-model="addFormData.nature" placeholder="请选择企业性质">
                <el-option v-for="item in sel1" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="reg-item" label="注册资金" :label-width="'120px'">
              <el-input v-model="addFormData.registeredCapital" type="text" placeholder="请输入注册资金" clearable>
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="注册地址" :label-width="'120px'">
              <el-input v-model="addFormData.registeredAdd" type="text" placeholder="请输入注册地址" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="办公地址" :label-width="'120px'">
              <el-input v-model="addFormData.address" type="text" placeholder="请输入办公地址" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="法人代表" :label-width="'120px'">
              <el-input v-model="addFormData.artificialPerson" type="text" placeholder="请输入法人代表" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="统一社会信用代码证" :label-width="'160px'" prop="licenseNo">
              <el-input v-model="addFormData.licenseNo" type="text" placeholder="请输入统一社会信用代码证" clearable></el-input>
              <el-upload
                class="upload"
                :action="uploadUrl"
                :data="{'token':token}"
                :on-remove="handleRemove1"
                :before-remove="beforeRemove1"
                :on-success="uploadSuccess1"
                :file-list="fileList1">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item class="reg-item" label="负责人" :label-width="'160px'">
              <el-input v-model="addFormData.principal" type="text" placeholder="请输入经营负责人" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="负责人手机" :label-width="'160px'">
              <el-input v-model="addFormData.principalTel" type="tel" placeholder="请输入负责人手机" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="监督电话" :label-width="'160px'">
              <el-input v-model="addFormData.supervisionTel" type="tel" placeholder="请输入监督电话" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑-->
    <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editForm" top="50px" :width="'1000px'">
      <el-form :model="editFormData" :rules="rules" ref="editForm">
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="企业名称" :label-width="'120px'" prop="companyName">
              <el-input v-model="editFormData.companyName" type="text" placeholder="请输入企业名称" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="企业简称" :label-width="'120px'">
              <el-input v-model="editFormData.shortName" type="text" placeholder="请输入简称" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="企业性质" :label-width="'120px'">
              <el-select v-model="editFormData.nature/1" placeholder="请选择企业性质">
                <el-option v-for="item in sel1" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="reg-item" label="注册资金" :label-width="'120px'">
              <el-input v-model="editFormData.registeredCapital" type="text" placeholder="请输入注册资金" clearable>
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="注册地址" :label-width="'120px'">
              <el-input v-model="editFormData.registeredAdd" type="text" placeholder="请输入注册地址" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="办公地址" :label-width="'120px'">
              <el-input v-model="editFormData.address" type="text" placeholder="请输入办公地址" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="法人代表" :label-width="'120px'">
              <el-input v-model="editFormData.artificialPerson" type="text" placeholder="请输入法人代表" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="统一社会信用代码证" :label-width="'160px'" prop="licenseNo">
              <el-input v-model="editFormData.licenseNo" type="text" placeholder="请输入统一社会信用代码证" clearable></el-input>
              <el-upload
                class="upload"
                :action="uploadUrl"
                :data="{'token':token}"
                :on-remove="handleRemove1"
                :before-remove="beforeRemove1"
                :on-success="uploadSuccess1"
                :on-preview="download"
                :file-list="fileList1">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item class="reg-item" label="负责人" :label-width="'120px'">
              <el-input v-model="editFormData.principal" type="text" placeholder="请输入经营负责人" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="负责人手机" :label-width="'120px'">
              <el-input v-model="editFormData.principalTel" type="tel" placeholder="请输入负责人手机" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="监督电话" :label-width="'120px'">
              <el-input v-model="editFormData.supervisionTel" type="tel" placeholder="请输入监督电话" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: "comnew",
    data() {
      return {
        rules: {
          companyName: [
            {required: true, message: '请输入单位名称', trigger: 'blur'}
          ],
          licenseNo: [
            {required: true, message: '请输入营业执照注册号', trigger: 'blur'}
          ]
        },

        tableHeigt: 0,
        tableData: [],
        searchName: '',
        currentPage: 1,
        pageSize: 20,
        total: 1,

        sel1: [],
        sel2: [],
        token: window.localStorage.getItem("token"),
        addForm: false,
        addFormData: {
          companyNo: "",
          companyName: "",
          shortName: "",
          password: "",
          nature: "",
          registeredCapital: "",
          registeredAdd: "",
          address: "",
          artificialPerson: "",
          licenseType: "",
          licenseNo: "",
          license: "",
          principal: "",
          principalTel: "",
          supervisionTel: "",
          serviceFile: "",
          operatingFile: "",
          securityFile: "",
        },
        uploadUrl: basePath + '/sys/file/upload',
        fileList1: [],               // 营业执照
        fileList2: [],
        fileList3: [],
        fileList4: [],

        editForm: false,
        editFormData: {
          id: "",
          companyNo: "",
          companyName: "",
          shortName: "",
          nature: "",
          registeredCapital: "",
          registeredAdd: "",
          address: "",
          artificialPerson: "",
          licenseType: "",
          licenseNo: "",
          license: "",
          principal: "",
          principalTel: "",
          supervisionTel: "",
          serviceFile: "",
          operatingFile: "",
          securityFile: "",
        },
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 234;
        self.getData();

        self.$http.get("/sys/dict/listByType?type=companyType").then(function (res) {
          self.sel1 = res.data.page;
        });
//        self.$http.get("/sys/dict/listByType?type=licence").then(function (res) {
//          self.sel2 = res.data.page;
//        });
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
        self.$http.postForm("/sys/company/list", data).then(function (res) {
          self.tableData = res.data.page.list;
          self.total = res.data.page.totalCount;
        });
      },
      add() {
        this.addForm = true;
        this.fileList1 = [];
        this.fileList2 = [];
        this.fileList3 = [];
        this.fileList4 = [];
        for (let i in this.addFormData) {
          this.addFormData[i] = "";
        }
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      handleRemove1(file, fileList) {
        this.fileList1 = fileList;
      },
      beforeRemove1(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      uploadSuccess1(file, fileList) {
        this.fileList1.push({name: fileList.name, fid: file.fileId});
      },
      handleRemove2(file, fileList) {
        this.fileList2 = fileList;
      },
      beforeRemove2(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      uploadSuccess2(file, fileList) {
        this.fileList2.push({name: "", fid: file.fileId});
      },
      handleRemove3(file, fileList) {
        this.fileList3 = fileList;
      },
      beforeRemove3(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      uploadSuccess3(file, fileList) {
        this.fileList3.push({name: "", fid: file.fileId});
      },
      handleRemove4(file, fileList) {
        this.fileList4 = fileList;
      },
      beforeRemove4(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      uploadSuccess4(file, fileList) {
        this.fileList4.push({name: "", fid: file.fileId});
      },
      download(file) {
        window.open(basePath + "/sys/file/downloadFileById?id=" + file.fid);
      },
      submitForm(flag) {
        let self = this;
        if (flag == "addForm") {
          self.$refs[flag].validate(function (valid) {
            if (valid) {
              self.addFormData.license = self.getFileId(self.fileList1);
              self.addFormData.serviceFile = self.getFileId(self.fileList2);
              self.addFormData.operatingFile = self.getFileId(self.fileList3);
              self.addFormData.securityFile = self.getFileId(self.fileList4);
              self.$http.post("/sys/company/save", self.addFormData).then(function (res) {
                if (res.data.code == 0) {
                  self.addForm = false;
                  self.getData();
                  self.$message.success('添加成功');
                } else {
                  self.$message.error(res.data.msg);
                }
              });
            } else {
              self.$message.error('添加失败');
              return false;
            }
          });
        } else if (flag == "editForm") {
          self.$refs[flag].validate(function (valid) {
            if (valid) {
              self.editFormData.license = self.getFileId(self.fileList1);
              self.editFormData.serviceFile = self.getFileId(self.fileList2);
              self.editFormData.operatingFile = self.getFileId(self.fileList3);
              self.editFormData.securityFile = self.getFileId(self.fileList4);
              self.$http.post("/sys/company/update", self.editFormData).then(function (res) {
                if (res.data.code == 0) {
                  self.editForm = false;
                  self.getData();
                  self.$message.success('修改成功');
                } else {
                  self.$message.error(res.data.msg);
                }
              });
            } else {
              self.$message.error('修改失败');
              return false;
            }
          });
        }
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
      getFileId(list) {
        let ids = [];
        for (let i in list) {
          ids.push(list[i].fid);
        }
        return ids.join(",");
      },
      edit: function (index, row) {
        let self = this;
        self.editForm = true;
        self.fileList1 = [];
        self.fileList2 = [];
        self.fileList3 = [];
        self.fileList4 = [];
        for (let i in self.editFormData) {
          self.editFormData[i] = row[i];
        }
        self.getFileName(1, row.license.split(","));
        self.getFileName(2, row.serviceFile.split(","));
        self.getFileName(3, row.operatingFile.split(","));
        self.getFileName(4, row.securityFile.split(","));
      },
      take(index, row) {
        let self = this;
        self.$confirm('此操作将提交审核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/company/forCheck", row.id).then(function (res) {
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
      del(index, row) {
        let self = this;
        self.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/company/delete", row.id).then(function (res) {
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
