<template>
  <div class="userman">
    <div class="tool">
      <el-button size="mini" type="primary" @click="add">添加</el-button>
      <el-button size="mini" type="primary" @click="dels">删除</el-button>
      <el-input class="search" placeholder="请输入" size="mini" v-model="searchName" width="100">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button size="mini" type="primary" @click="getData">搜索</el-button>
    </div>
    <el-table :data="tableData" stripe border :height="tableHeigt" style="width: 100%" ref="multipleTable"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="序号" width="60">
        <template slot-scope='scope'>
          {{(currentPage - 1) * pageSize + (scope.$index / 1 + 1) }}
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色类型"></el-table-column>
      <el-table-column prop="realName" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope='scope'>
          {{scope.row.sex == 0 ? '男' : '女'}}
        </template>
      </el-table-column>
      <el-table-column prop="job" label="职务"></el-table-column>
      <el-table-column prop="deptName" label="所属机构"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button title="编辑" circle type="success" size="mini" icon="el-icon-edit"
                     @click="edit(scope.$index, scope.row)"></el-button>
          <el-button title="删除" circle type="danger" size="mini" icon="el-icon-delete"
                     @click="del(scope.$index, scope.row)"></el-button>
          <el-button title="重置密码" circle type="primary" size="mini" icon="el-icon-setting"
                     @click="repass(scope.$index, scope.row)"></el-button>
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
    <el-dialog :close-on-click-modal="false" title="添加" :visible.sync="addForm" top="50px" :width="'1000px'">
      <el-form :model="addFormData" :rules="rules" ref="addForm">
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="手机号" :label-width="formLabelWidth" prop="username">
              <el-input type="tel" v-model="addFormData.username" placeholder="手机号可作为登录用户名使用" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="密码" :label-width="formLabelWidth" prop="password">
              <el-input type="password" v-model="addFormData.password" placeholder="6到16个数字或字母" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="角色类型" :label-width="formLabelWidth" prop="roleId">
              <el-select v-model="addFormData.roleId" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="addFormData.roleId==6" class="reg-item" label="企业设置" :label-width="formLabelWidth"
                          prop="org2">
              <el-select v-model="addOrg2" style="width: 100%;" filterable placeholder="请选择">
                <el-option
                  v-for="item in orgOptions2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="reg-item" label="职务" :label-width="formLabelWidth">
              <el-input v-model="addFormData.job" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="姓名" :label-width="formLabelWidth" prop="realName">
              <el-input v-model="addFormData.realName" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="身份证号" :label-width="formLabelWidth" prop="idNo">
              <el-input v-model="addFormData.idNo" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="性别" :label-width="formLabelWidth">
              <el-radio v-model="addFormData.sex" :label="0">男</el-radio>
              <el-radio v-model="addFormData.sex" :label="1">女</el-radio>
            </el-form-item>
            <el-form-item class="reg-item" label="年龄" :label-width="formLabelWidth" prop="age">
              <el-input type="number" v-model="addFormData.age" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="工作单位" :label-width="formLabelWidth" prop="work">
              <el-input v-model="addFormData.work" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input type="email" v-model="addFormData.email" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="住址" :label-width="formLabelWidth" prop="address">
              <el-input v-model="addFormData.address" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="editForm" top="50px" :width="'1000px'">
      <el-form :model="editFormData" :rules="rules" ref="editForm">
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="手机号" :label-width="formLabelWidth" prop="username">
              <el-input type="tel" v-model="editFormData.username" placeholder="手机号作为登录用户名使用" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="角色类型" :label-width="formLabelWidth" prop="roleId">
              <el-select v-model="editFormData.roleId" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="editFormData.roleId==6" class="reg-item" label="企业设置" :label-width="formLabelWidth"
                          prop="org2">
              <el-select v-model="editOrg2" style="width: 100%;" filterable placeholder="请选择">
                <el-option
                  v-for="item in orgOptions2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="reg-item" label="职务" :label-width="formLabelWidth">
              <el-input v-model="editFormData.job" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="姓名" :label-width="formLabelWidth" prop="realName">
              <el-input v-model="editFormData.realName" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="身份证号" :label-width="formLabelWidth" prop="idNo">
              <el-input v-model="editFormData.idNo" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="性别" :label-width="formLabelWidth">
              <el-radio v-model="editFormData.sex" :label="0">男</el-radio>
              <el-radio v-model="editFormData.sex" :label="1">女</el-radio>
            </el-form-item>
            <el-form-item class="reg-item" label="年龄" :label-width="formLabelWidth" prop="age">
              <el-input type="number" v-model="editFormData.age" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="工作单位" :label-width="formLabelWidth" prop="work">
              <el-input v-model="editFormData.work" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input type="email" v-model="editFormData.email" clearable></el-input>
            </el-form-item>
            <el-form-item class="reg-item" label="住址" :label-width="formLabelWidth" prop="address">
              <el-input v-model="editFormData.address" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="重置密码" :visible.sync="repassword" :width="'500px'">
      <el-form>
        <el-form-item label="重置密码" :label-width="'80px'">
          <el-input type="password" v-model="repasswordData.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="repassword = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="repassSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "userman",
    data() {
      var validateTel = (rule, value, callback) => {
        let reg = /^1\d[0-9]{9}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      }
      var validatePass = (rule, value, callback) => {
        let reg = /^[a-z0-9]{6,16}$/;
        if (!reg.test(value)) {
          callback(new Error('密码只能由 6 到 16 个数字或字母组成'));
        } else {
          callback();
        }
      };
      var validateIdno = (rule, value, callback) => {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (value == "" || value == null) {
          callback();
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的身份证号'));
        } else {
          callback();
        }
      };
      var validateAge = (rule, value, callback) => {
        if (value == "" || value == null) {
          callback();
        } else if (value < 0 && value > 500) {
          callback(new Error('请输入正确的年龄'));
        } else {
          callback();
        }
      };
      var validateEmail = (rule, value, callback) => {
        let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (value == "" || value == null) {
          callback();
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的电子邮箱'));
        } else {
          callback();
        }
      };
      var validateOrg1 = (rule, value, callback) => {
        if (this.addForm) {
          if (this.addOrg1 == "" || this.addOrg1 == null) {
            callback(new Error('请选择行政区划'));
          } else {
            callback();
          }
        } else if (this.editForm) {
          if (this.editOrg1 == "" || this.editOrg1 == null) {
            callback(new Error('请选择行政区划'));
          } else {
            callback();
          }
        }
      };
      var validateOrg2 = (rule, value, callback) => {
        if (this.addForm) {
          if (this.addOrg2 == "" || this.addOrg2 == null) {
            callback(new Error('请选择机构设置'));
          } else {
            callback();
          }
        } else if (this.editForm) {
          if (this.editOrg2 == "" || this.editOrg2 == null) {
            callback(new Error('请选择机构设置'));
          } else {
            callback();
          }
        }

      };
      return {
        searchName: "",
        addOrg1: "",
        addOrg2: "",
        editOrg1: "",
        editOrg2: "",
        roleList: [],
        orgOptions1: [],
        orgOptions2: [],
        addForm: false,
        editForm: false,
        addFormData: {
          username: "",
          password: "",
          job: "",
          roleId: "",
          deptId: "",
          realName: "",
          sex: "",
          idNo: "",
          age: "",
          work: "",
          email: "",
          address: ""
        },
        editFormData: {
          id: "",
          userId: "",
          username: "",
//          password: "",
          job: "",
          roleId: "",
          deptId: "",
          realName: "",
          sex: "",
          idNo: "",
          age: "",
          work: "",
          email: "",
          address: ""
        },
        rules: {
          username: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: validateTel, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          roleId: [
            {required: true, message: '请选择角色类型', trigger: 'change'}
          ],
          org1: [
            {required: true, validator: validateOrg1, trigger: 'change'}
          ],
          org2: [
            {required: true, validator: validateOrg2, trigger: 'change'}
          ],
          realName: [],
          idNo: [
            {required: false, validator: validateIdno, trigger: 'blur'}
          ],
          age: [
            {required: false, validator: validateAge, trigger: 'blur'}
          ],
          email: [
            {required: false, validator: validateEmail, trigger: 'blur'}
          ],
          work: [
            {required: false, message: '', trigger: 'blur'},
          ],
          address: [
            {required: false, message: '', trigger: 'blur'},
          ]
        },
        tableHeigt: 0,
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        total: 1,
        multipleSelection: [],
        formLabelWidth: "120px",
        repassword: false,
        repasswordData: {
          "id": "",
          "password": ""
        }
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 234;
        self.getData();
        self.$http.get("/sys/role/selectForUser").then(function (res) {
          if (res.data.code == 0) {
            for (let i in res.data.list) {
              self.roleList.push({
                label: res.data.list[i].roleName,
                value: res.data.list[i].roleId
              });
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });
        self.$http.postForm("/sys/company/select").then(function (res) {
          let list = res.data.list;
          for (let i in list) {
            self.orgOptions2.push({value: list[i].id, label: list[i].companyName});
          }
        });
      });
    },
    watch: {
      addOrg1() {
        this.addOrg2 = "";
        this.orgOptions2 = [];
      },
      editOrg1() {
        this.editOrg2 = "";
        this.orgOptions2 = [];
      }
    },
    methods: {
      getData() {
        let self = this;
        let data = {
          searchName: self.searchName,
          currPage: self.currentPage,
          pageSize: self.pageSize
        };
        self.$http.postForm("/sys/user/list", data).then(function (res) {
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      dels() {
        let self = this;
        let ids = [];
        for (var i = 0; i < self.multipleSelection.length; i++) {
          ids.push(self.multipleSelection[i].userId);
        }
        self.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/user/delete", ids.join(",")).then(function (res) {
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
      },
      del(index, row) {
        let self = this;
        self.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/user/delete", row.userId).then(function (res) {
            if (res.data.code == 0) {
              self.getData();
              self.$message.success('删除成功');
            } else {
              self.$message.error(res.data.msg);
            }
          });
        }).catch(() => {
          self.$message.info('已取消删除');
        });
      },
      submitForm(formName) {
        let self = this;
        if (formName == "addForm") {
          self.$refs[formName].validate(function (valid) {
            if (valid) {
              self.addFormData.deptId = self.addOrg2;
              self.$http.post("/sys/user/save", self.addFormData).then(function (res) {
                if (res.data.code == 0) {
                  self.getData();
                  self.$message.success('添加成功');
                  self.addForm = false;
                } else {
                  self.$message.error(res.data.msg);
                }
              });
            } else {
              self.$message.error('添加失败');
              return false;
            }
          });
        } else if (formName == "editForm") {
          self.$refs[formName].validate(function (valid) {
            if (valid) {
              self.editFormData.deptId = self.editOrg2;
              self.$http.post("/sys/user/update", self.editFormData).then(function (res) {
                if (res.data.code == 0) {
                  self.getData();
                  self.$message.success('修改成功');
                  self.editForm = false;
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
      add() {
        this.addForm = true;
        for (let i in this.addFormData) {
          this.addFormData[i] = "";
        }
      },
      edit(index, row) {
        let self = this;
        self.editForm = true;
        self.editFormData = row;
        self.editOrg2 = row.deptId;
//        self.$http.get("/sys/user/info/" + row.userId).then(function (res) {
//          if (res.data.code == 0) {
//            self.editForm = true;
//            for (let key in self.editFormData) {
//              self.editFormData[key] = res.data.user[key];
//            }
//          } else {
//            self.$message.error(res.data.msg);
//          }
//        });
      },
      orgChange(val) {
        let self = this;
        self.$http.get("/sys/dept/listByPId?parent_id=" + val).then(function (res) {
          if (res.data.code == 0) {
            for (let i in res.data.list) {
              self.orgOptions2.push({
                label: res.data.list[i].name,
                value: res.data.list[i].deptId
              });
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });
      },
      repass(index, row) {
        this.repassword = true;
        this.repasswordData.id = row.id;
      },
      repassSubmit() {
        let self = this;
        self.$http.post("", row.userId).then(function (res) {
          if (res.data.code == 0) {
            self.getData();
            self.$message.success('删除成功');
          } else {
            self.$message.error(res.data.msg);
          }
        });
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/sys.css";
</style>
