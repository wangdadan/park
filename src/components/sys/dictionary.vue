<template>
  <div class="dictionary">
    <div class="tool">
      <el-button size="mini" type="primary" @click="addForm=true">添加</el-button>
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
      <el-table-column prop="name" label="字典名称"></el-table-column>
      <el-table-column prop="type" label="字典类型"></el-table-column>
      <el-table-column prop="code" label="字典码"></el-table-column>
      <el-table-column prop="value" label="字典值"></el-table-column>
      <el-table-column prop="remark" label="描述"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button title="编辑" circle type="success" size="mini" icon="el-icon-edit"
                     @click="edit(scope.$index, scope.row)"></el-button>
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
    <el-dialog :close-on-click-modal="false" title="添加" :visible.sync="addForm" :width="'600px'">
      <el-form :model="addFormData" :rules="rules" ref="addFormData">
        <el-form-item label="字典名称" :label-width="'100px'" prop="name">
          <el-input v-model="addFormData.name" class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="字典类型" :label-width="'100px'" prop="type">
          <el-input v-model="addFormData.type" class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="字典码" :label-width="'100px'" prop="code">
          <el-input v-model="addFormData.code" class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="字典值" :label-width="'100px'" prop="value">
          <el-input v-model="addFormData.value" class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="'100px'">
          <el-input v-model="addFormData.remark" class="w400" clearable=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addFormSubmit('addFormData')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="editForm" :width="'600px'">
      <el-form>
        <el-form-item label="字典名称" :label-width="'100px'">
          <el-input v-model="editFormData.name" class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="字典类型" :label-width="'100px'">
          <el-input v-model="editFormData.type" class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="字典码" :label-width="'100px'">
          <el-input v-model="editFormData.code" class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="字典值" :label-width="'100px'">
          <el-input v-model="editFormData.value" class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="'100px'">
          <el-input v-model="editFormData.remark" class="w400" clearable=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="editFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "dictionary",
    data() {
      return {
        addForm: false,
        editForm: false,
        addFormData: {
          name: "",
          type: "",
          code: "",
          value: "",
          orderNum: "",
          remark: "",
          delFlag: 0
        },
        editFormData: {
          id: "",
          name: "",
          type: "",
          code: "",
          value: "",
          orderNum: "",
          remark: "",
          delFlag: 0
        },
        tableHeigt: 0,
        tableData: [],
        searchName: '',
        currentPage: 1,
        pageSize: 20,
        total: 1,
        multipleSelection: [],
        rules: {
          name: [
            {required: true, message: '请输入字典名称', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请输入字典类型', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入字典码', trigger: 'blur'}
          ],
          value: [
            {required: true, message: '请输入字典值', trigger: 'blur'}
          ]
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
        self.$http.postForm("/sys/dict/list", data).then(function (res) {
          if (res.data.code == 0) {
            self.tableData = res.data.page.list;
            self.total = res.data.page.totalCount;
          } else {
            self.$message.error(res.data.msg);
          }
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
          ids.push(self.multipleSelection[i].id);
        }
        self.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/dict/delete", ids.join(",")).then(function (res) {
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
          self.$http.post("/sys/dict/delete", row.id).then(function (res) {
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
      edit(index, row) {
        console.log(row)
        this.editForm = true;
        for (let key in this.editFormData) {
          this.editFormData[key] = row[key];
        }
      },
      addFormSubmit(formName) {
        let self = this;
        self.$refs[formName].validate(function (valid) {
          if (valid) {
            self.$http.post("/sys/dict/save", self.addFormData).then(function (res) {
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
      },
      editFormSubmit() {
        let self = this;
        self.$http.post("/sys/dict/update", self.editFormData).then(function (res) {
          if (res.data.code == 0) {
            self.editForm = false;
            self.getData();
            self.$message.success('修改成功');
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
