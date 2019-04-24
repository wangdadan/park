<template>
  <div class="chistory">
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
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button title="查看处理记录" circle type="primary" size="mini" icon="el-icon-search"
                     @click="history(scope.row)"></el-button>
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
    <el-dialog :close-on-click-modal="false" title="处理纪录" :visible.sync="handleDialog">
      <el-table :data="handleData" :default-sort="{prop: 'time', order: 'descending'}">
        <el-table-column sortable property="time" label="日期" width="180"></el-table-column>
        <el-table-column property="userName" label="处理人" width="150"></el-table-column>
        <el-table-column property="detail" label="处理内容"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="isform" :width="'1000px'">
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
        <el-button size="mini" type="primary" @click="isform = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "chistory",
    data() {
      return {
        tableHeigt: 0,
        tableData: [],
        handleData: "",
        searchName: '',
        currentPage: 1,
        pageSize: 20,
        total: 1,

        parkList: [],
        companyList: [],
        isform: false,
        form: {},
        map: {
          center: {lng: 116.339487, lat: 39.72835},
          zoom: 16,
          show: false,
          marker: {
            lng: "",
            lat: ""
          },
          mark_g: require('./../../assets/images/mark_g.png')
        },
        handleDialog: false,
        dialogImageUrl: '',
        dialogVisible: false,
        fileList: []
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 234;
        self.getData();

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
        self.$http.postForm("/sys/complain/history", data).then(function (res) {
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
        self.isform = true;
        self.map.marker = {
          lng: row.position.split(",")[0],
          lat: row.position.split(",")[1]
        }
        self.map.center = self.map.marker;

        let ids = row.attach.split(",");
        for (let i in ids) {
          self.$http.get("/sys/file/getFileName", {id: ids[i]}).then(function (res) {
            if (res.data.code == 0) {
              self.fileList.push({url: basePath + "/sys/file/getFileById?id=" + ids[i]});
            }
          });
        }
      },
      imgPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
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
</style>
