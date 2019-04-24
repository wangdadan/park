<template>
  <div class="invalid">
    <div class="tool">
      <el-button size="mini" type="primary" @click="addForm=true">添加</el-button>
      <el-input class="search" placeholder="请输入" size="mini" v-model="searchName" width="100">
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
      <el-table-column prop="acceptNo" label="受理序号" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="time" label="投诉时间" :show-overflow-tooltip="true" resizable>
        <template slot-scope='scope'>
          {{scope.row.time == null ? "" : scope.row.time.substring(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column prop="parkName" label="停车场名称" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="companyName" label="企业名称" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="detail" label="投诉内容" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="source" label="投诉来源" :show-overflow-tooltip="true" resizable>
        <template slot-scope='scope'>
          {{scope.row.source == 0 ? '12358价格举报热线' : (scope.row.source == 1 ? '12345非紧急救助热线' : '')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button title="查看" circle type="primary" size="mini" icon="el-icon-view"
                     @click="see(scope.row)"></el-button>
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
    <el-dialog :close-on-click-modal="false" title="处理" :visible.sync="dealDialog">
      <el-form :model="dealData" :rules="rules" ref="dealData">
        <el-form-item label="" prop="detail">
          <el-input
            required
            type="textarea"
            :rows="3"
            placeholder="请输入处理内容"
            v-model="dealData.detail">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dealDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="dealSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="拒绝" :visible.sync="refuseDialog">
      <el-form :model="refuseData" :rules="rules" ref="refuseData">
        <el-form-item label="" prop="detail">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入处理内容"
            v-model="refuseData.detail">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="refuseDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="refuseSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="处理纪录" :visible.sync="handleDialog">
      <el-table :data="handleData" :default-sort="{prop: 'time', order: 'descending'}">
        <el-table-column sortable property="time" label="日期" width="180"></el-table-column>
        <el-table-column property="userName" label="处理人" width="150"></el-table-column>
        <el-table-column property="detail" label="处理内容"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="添加" :visible.sync="addForm" :width="'1000px'">
      <el-form :model="addFormData" :rules="addrules" ref="addForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="受理序号" :label-width="'120px'" prop="acceptNo">
              <el-input class="seeform-input" v-model="addFormData.acceptNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉时间" :label-width="'120px'" prop="time">
              <el-date-picker class="seeform-input" v-model="addFormData.time" type="date"
                              value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车场名称" :label-width="'120px'" prop="parkId">
              <el-select class="seeform-input" v-model="addFormData.parkId" placeholder="请选择">
                <el-option v-for="item in parkList"
                           :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" :label-width="'120px'" prop="companyId">
              <el-select class="seeform-input" v-model="addFormData.companyId" placeholder="请选择">
                <el-option v-for="item in companyList"
                           :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="投诉来源" :label-width="'120px'" prop="source">
          <el-select class="seeform-input" v-model="addFormData.source" placeholder="请选择">
            <el-option
              key="0" label="12358价格举报热线" value="0"></el-option>
            <el-option
              key="1" label="12345非紧急救助热线" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投诉详情" :label-width="'120px'" prop="detail">
          <el-input type="textarea" v-model="addFormData.detail" style="width: 730px;"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="default" @click="addForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="seeForm" :width="'1000px'">
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item label="受理序号" :label-width="'120px'">
              <el-input class="seeform-input" v-model="form.acceptNo" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉时间" :label-width="'120px'">
              <el-date-picker class="seeform-input" v-model="form.time" type="date"
                              value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" readonly></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车场名称" :label-width="'120px'">
              <el-select class="seeform-input" v-model="form.parkId" placeholder="请选择" disabled>
                <el-option v-for="item in parkList"
                           :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" :label-width="'120px'">
              <el-select class="seeform-input" v-model="form.companyId" placeholder="请选择" disabled>
                <el-option v-for="item in companyList"
                           :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="投诉来源" :label-width="'120px'">
          <el-select class="seeform-input" v-model="form.source" placeholder="请选择" disabled>
            <el-option
              key="0" label="12358价格举报热线" value="0"></el-option>
            <el-option
              key="1" label="12345非紧急救助热线" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投诉详情" :label-width="'120px'">
          <el-input type="textarea" v-model="form.detail" style="width: 730px;" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="seeForm = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "invalid",
    data() {
      return {
        tableHeigt: 0,
        tableData: [],
        searchName: '',
        currentPage: 1,
        pageSize: 20,
        total: 1,
        dealDialog: false,
        dealData: {
          id: "",
          detail: ""
        },
        refuseDialog: false,
        refuseData: {
          id: "",
          detail: ""
        },
        handleDialog: false,
        handleData: [],
        rules: {
          detail: [
            {required: true, message: '请输入处理内容', trigger: 'blur'}
          ]
        },
        addrules: {
          acceptNo: [
            {required: true, message: '请输入受理编号', trigger: 'blur'}
          ],
          time: [
            {required: true, message: '请选择投诉时间', trigger: 'change'}
          ],
          parkId: [
            {required: true, message: '请选择停车场', trigger: 'change'}
          ],
          companyId: [
            {required: true, message: '请选择企业', trigger: 'change'}
          ],
          source: [
            {required: true, message: '请选择投诉来源', trigger: 'change'}
          ],
          detail: [
            {required: true, message: '请输入投诉详情', trigger: 'blur'}
          ]
        },

        parkList: [],
        companyList: [],
        addForm: false,
        addFormData: {
          acceptNo: "",
          time: "",
          parkId: "",
          companyId: "",
          detail: "",
          source: ""
        },
        seeForm: false,
        parkList: [],
        companyList: [],
        form: {},
        fileList: []
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 234;

        self.$http.postForm("/sys/park/select").then(function (res) {
          let list = res.data.list;
          for (let i in list) {
            self.parkList.push({value: list[i].id + "", label: list[i].name});
          }
        });
        self.$http.postForm("/sys/company/select").then(function (res) {
          let list = res.data.list;
          for (let i in list) {
            self.companyList.push({value: list[i].id + "", label: list[i].companyName});
          }
        });

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
        self.$http.postForm("/sys/complain/list1", data).then(function (res) {
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
      accept(row) {
        let self = this;
        self.$http.post("/sys/complain/accept", {id: row.id}).then(function (res) {
          if (res.data.code == 0) {
            self.getData();
            self.$message.success("受理成功");
          } else {
            self.$message.error(res.data.msg);
          }
        });
      },
      deal(row) {
        this.dealDialog = true;
        this.dealData.id = row.id;
      },
      refuse(row) {
        this.refuseDialog = true;
        this.refuseData.id = row.id;
      },
      over(row) {
        let self = this;
        self.$http.post("/sys/complain/done", {id: row.id}).then(function (res) {
          if (res.data.code == 0) {
            self.getData();
            self.$message.success("结束成功");
          } else {
            self.$message.error(res.data.msg);
          }
        });
      },
      dealSubmit() {
        let self = this;
        self.$refs["dealData"].validate(function (valid) {
          if (valid) {
            self.$http.post("/sys/complain/deal", self.dealData).then(function (res) {
              if (res.data.code == 0) {
                self.dealDialog = false;
                self.getData();
                self.$message.success("处理成功");
              } else {
                self.$message.error(res.data.msg);
              }
            });
          } else {
            self.$message.error('处理失败');
            return false;
          }
        });
      },
      refuseSubmit() {
        let self = this;
        self.$refs["refuseData"].validate(function (valid) {
          if (valid) {
            self.$http.post("/sys/complain/refuse", self.refuseData).then(function (res) {
              if (res.data.code == 0) {
                self.refuseDialog = false;
                self.getData();
                self.$message.success("拒绝成功");
              } else {
                self.$message.error(res.data.msg);
              }
            });
          } else {
            self.$message.error('拒绝失败');
            return false;
          }
        });
      },
      history(row) {
        let self = this;
        self.handleDialog = true;
        self.$http.post("/sys/complain/dealList", {id: row.id}).then(function (res) {
          if (res.data.code == 0) {
            self.handleData = res.data.list;
          } else {
            self.$message.error(res.data.msg);
          }
        });
      },
      see(row) {
        let self = this;
        self.form = row;
        self.seeForm = true;
      },
      addSubmit() {
        let self = this;
        self.$refs["addForm"].validate(function (valid) {
          if (valid) {
            self.$http.post("/sys/complain/complain1", self.addFormData).then(function (res) {
              if (res.data.code == 0) {
                self.$message.success("添加成功");
                self.addForm = false;
                self.getData();
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
      del(index, row) {
        let self = this;
        self.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/complain/delete", row.id).then(function (res) {
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
  @import "./../../css/complaint.css";

  .seeform-input {
    width: 250px;
  }

  .title {
    padding-left: 52px;
  }
</style>
