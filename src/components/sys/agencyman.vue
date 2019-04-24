<template>
  <div class="agencyman">
    <el-row :gutter="10">
      <el-col :span="10" style="height: 100%;">
        <el-tree class="tree"
                 ref="tree"
                 :props="props"
                 :load="loadNode"
                 lazy
                 node-key="id"
                 @node-click="handleNodeClick"
                 :default-expanded-keys="[1]"
                 :default-expand-all="false"
                 :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button class="tree-btn" title="添加" circle size="mini" icon="el-icon-plus"
                       @click="append(node,data)"></el-button>
            <el-button class="tree-btn" title="编辑" circle size="mini" icon="el-icon-edit"
                       @click="edit(node,data)"></el-button>
            <el-button class="tree-btn" title="删除" circle size="mini" icon="el-icon-delete"
                       @click="remove(node, data)"></el-button>
          </span>
        </span>
        </el-tree>
      </el-col>
      <el-col :span="14">
        <el-table :v-loading="loading" :data="tableData" stripe border :height="tableHeigt" style="width: 100%">
          <el-table-column label="序号" width="60">
            <template slot-scope='scope'>
              {{(currentPage - 1) * pageSize + (scope.$index / 1 + 1) }}
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名"></el-table-column>
          <el-table-column width="50" prop="sex" label="性别">
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
      </el-col>
    </el-row>
    <el-dialog :close-on-click-modal="false" title="添加" :visible.sync="addBox" :width="'600px'">
      <el-form :model="addTreeData" :rules="rules" ref="addTreeData">
        <el-form-item label="名称" :label-width="'100px'" prop="name">
          <el-input class="w400" v-model="addTreeData.name" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addBox = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editBox" :width="'600px'">
      <el-form :model="editTreeData" :rules="rules" ref="editTreeData">
        <el-form-item label="名称" :label-width="'100px'" prop="name">
          <el-input class="w400" v-model="editTreeData.name" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editBox = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "agencyman",
    data() {
      return {
        addBox: false,
        editBox: false,
        props: {
          label: 'name',
          children: 'children'
        },
        addParentNode: "",
        addParentData: "",
        childrenNodeList: [],//暂存添加按钮节点的children
        addTreeData: {
          id: "",
          parentId: "",
          name: "",
          children: []
        },
        editTreeData: {
          id: "",
          parentId: "",
          name: "",
          children: []
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ]
        },
        tableHeigt: 0,
        loading: false,
        tableData: [],
        deptId: "",
        currentPage: 1,
        pageSize: 20,
        total: 1,
        multipleSelection: []
      };
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 225 +47;
      });
    },
    methods: {
      loadNode(node, resolve) {
        if (node.level > 3) return resolve([]);
        if (node.level == 0) {
          this.$http.get("/sys/dept/listByPId", {parent_id: 0}).then(function (res) {
            return resolve([{
              id: res.data.list[0].deptId,
              name: res.data.list[0].name,
              parentId: res.data.list[0].parentId,
              children: []
            }]);
          });
        } else {
          this.$http.get("/sys/dept/listByPId", {parent_id: node.data.id}).then(function (res) {
            let list = res.data.list;
            let data = [];
            if (list.length > 0) {
              for (var i = 0; i < list.length; i++) {
                data.push({
                  id: res.data.list[i].deptId,
                  name: res.data.list[i].name,
                  parentId: res.data.list[i].parentId,
                  children: []
                })
              }
            }
            node.data.children = data;
            resolve(data);
          });
        }
      },
      getData() {
        let self = this;
        let params = {
          currPage: self.currentPage,
          pageSize: self.pageSize,
          deptId: self.deptId
        };
        self.loading = true;
        self.$http.postForm("/sys/user/newList", params).then(function (res) {
          self.tableData = res.data.page.list;
          self.total = res.data.page.totalCount;
          self.loading = false;
        });
      },
      handleNodeClick(data) {
        this.deptId = data.id;
        this.getData();
      },
      append(node, data) {
        this.addTreeData.name = "";
        if (node.level == 4) {
          this.$message.warning("最底层无法添加");
        } else {
          this.addBox = true;
          this.addTreeData.parentId = node.data.id;
          this.addParentNode = node;
          this.addParentData = data;
        }
      },
      addSubmit() {
        let self = this;
        self.$refs["addTreeData"].validate(function (valid) {
          if (valid) {
            self.$http.post("/sys/dept/save", self.addTreeData).then(function (res) {
              if (res.data.code == 0) {
                // id赋值供编辑保存使用
                self.addTreeData.id = res.data.id;

                const tmp = {
                  id: self.addTreeData.id,
                  parentId: self.addTreeData.parentId,
                  name: self.addTreeData.name,
                  children: self.addTreeData.children
                };
                self.addParentData.children.push(tmp);

                self.addBox = false;
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
      edit(node, data) {
        this.editBox = true;
        this.editTreeData = data;
        this.addParentNode = node;
        this.addParentData = data;
      },
      editSubmit() {
        let self = this;
        self.$refs["editTreeData"].validate(function (valid) {
          if (valid) {
            self.$http.post("/sys/dept/update", {
              deptId: self.editTreeData.id,
              name: self.editTreeData.name,
            }).then(function (res) {
              if (res.data.code == 0) {
                self.addParentData.children.push(self.editTreeData);
                // 更新子节点
                self.$refs.tree.updateKeyChildren(self.addParentNode.key, self.addParentData.children);

                self.editBox = false;
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
      },
      remove(node, data) {
        let self = this;
        if (node.level == 1) {
          self.$message.warning("根节点无法删除");
        } else {
          self.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.$http.post("/sys/dept/delete", data.id).then(function (res) {
              if (res.data.code == 0) {
                node.remove();
                self.$message.success('删除成功');
              } else {
                self.$message.error(res.data.msg);
              }
            });
          }).catch(() => {
            self.$message.info('已取消删除');
          });
        }
      },

      handleSizeChange(val) {
        this.pageSize = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/sys.css";
</style>
