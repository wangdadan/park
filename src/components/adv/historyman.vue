<template>
  <div class="historyman">
    <div class="tool">
      <el-input class="search" style="margin-left: 0;" placeholder="请输入" size="mini" v-model="searchName" width="100">
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
      <el-table-column label="停车场编号" min-width="110" :show-overflow-tooltip="true" resizable>
        <template slot-scope='scope'>
          <span class="tosee" @click="see(scope.$index, scope.row)">{{scope.row.parkNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="停车场备案号" min-width="110" :show-overflow-tooltip="true" resizable>
        <template slot-scope='scope'>
          <span class="tosee" @click="see(scope.$index, scope.row)">{{scope.row.recordNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="停车场名称" min-width="200" :show-overflow-tooltip="true" resizable>
        <template slot-scope='scope'>
          <span class="tosee" @click="see(scope.$index, scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="停车场地址" min-width="200" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column label="收费标准" min-width="160" :show-overflow-tooltip="true" resizable>
        <template slot-scope='scope'>
          <p v-html="scope.row.charges"></p>
        </template>
      </el-table-column>
      <el-table-column label="价格核准日期" min-width="110" :show-overflow-tooltip="true" resizable>
        <template slot-scope='scope'>
          {{scope.row.approvalTime == null ? "" : scope.row.approvalTime.substring(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column prop="streetName" label="行政区域" min-width="110" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column prop="parkTypeName" label="停车场类型" min-width="110" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column prop="typeName" label="地区类别" min-width="110" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column prop="manageCompany" label="经营企业名称" min-width="200" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column prop="contract" label="联系人" min-width="110" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column prop="phone" label="电话" min-width="110" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column prop="totalNum" label="总车位数" min-width="80" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column prop="businessHoursName" label="营业时间" min-width="120" :show-overflow-tooltip="true" resizable>
      </el-table-column>
      <el-table-column prop="name" label="评分" min-width="170" :show-overflow-tooltip="true"
                       resizable>
        <template slot-scope='scope'>
          <el-rate
            v-model="scope.row.rate==null?5:scope.row.rate/1"
            show-score
            text-color="#ff9900"
            :allow-half="true"
            score-template="{value}"
            :disabled="true"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button title="评分" circle type="primary" size="mini" icon="el-icon-star-on"
                     @click="rateBtn(scope.$index, scope.row)"></el-button>
          <el-button title="复核" circle type="primary" size="mini" icon="el-icon-bell"
                     @click="recheck(scope.$index, scope.row)"></el-button>
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

    <el-dialog :close-on-click-modal="false" title="评分" :visible.sync="ratePop" :width="'400px'">
      <el-form>
        <el-form-item label="">
          <el-rate
            v-model="rate"
            show-score
            text-color="#ff9900"
            :allow-half="true"
            score-template="{value}"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
          </el-rate>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="ratePop = false">关 闭</el-button>
        <el-button size="mini" type="primary" @click="rateSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看-->
    <el-dialog :close-on-click-modal="false" :visible.sync="seeForm" :width="'1000px'" fullscreen>
      <div class="seecon">
        <h1 class="seecon-title">{{editFormData.name}}</h1>
        <div class="seecon-a flex">
          <div class="seecon-a-a">
            <el-row>
              <el-col :span="24" class="flex">
                <span class="seecon-row-label">受理编号：</span>
                <span class="seecon-row-value">{{editFormData.acceptanceNo}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="flex">
                <span class="seecon-row-label">停车场编号：</span>
                <span class="seecon-row-value">{{editFormData.parkNo}}</span>
              </el-col>
            </el-row>
            <div class="seecon-row">
              <el-col :span="24" class="flex">
                <span class="seecon-row-label">停车场备案号：</span>
                <span class="seecon-row-value">{{editFormData.recordNo}}</span>
              </el-col>
            </div>
          </div>
          <div class="seecon-a-b flex">
            <div class="qrcode-box">
              <div class="qrcode"><img :src="imgUrl+'?id='+editFormData.attach" alt=""></div>
              <p class="qrcode-des">停车场展示图</p>
            </div>
            <div class="qrcode-box">
              <div class="qrcode"><img :src="qrCodeUrl + editFormData.id" alt=""></div>
              <p class="qrcode-des">停车收费价格核准 <br>二维码，可下载使用</p>
            </div>
          </div>
        </div>

        <hr>

        <div class="seecon-b">
          <el-row>
            <el-col :span="24" class="flex">
              <span class="seecon-row-label">停车场名称：</span>
              <span class="seecon-row-value">{{editFormData.name}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="flex">
              <span class="seecon-row-label">停车场地址：</span>
              <span class="seecon-row-value">{{editFormData.address}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="flex">
              <span class="seecon-row-label">停车场类型：</span>
              <span class="seecon-row-value">{{editFormData.parkTypeName}}</span>
            </el-col>
            <el-col :span="12" class="flex">
              <span class="seecon-row-label">所属街道：</span>
              <span class="seecon-row-value">{{editFormData.streetName}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="flex">
              <span class="seecon-row-label">地区类别：</span>
              <span class="seecon-row-value">{{editFormData.typeName}}</span>
            </el-col>
            <el-col :span="12" class="flex">
              <span class="seecon-row-label">总车位数：</span>
              <span class="seecon-row-value">{{editFormData.totalNum}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="flex">
              <span class="seecon-row-label">车位编号：</span>
              <span class="seecon-row-value">{{editFormData.parkingNo}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="flex">
              <span class="seecon-row-label">经营单位：</span>
              <span class="seecon-row-value">{{editFormData.manageCompany}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="flex">
              <span class="seecon-row-label">联系人：</span>
              <span class="seecon-row-value">{{editFormData.contract}}</span>
            </el-col>
            <el-col :span="12" class="flex">
              <span class="seecon-row-label">电话：</span>
              <span class="seecon-row-value">{{editFormData.phone}}</span>
            </el-col>
          </el-row>
        </div>

        <hr>

        <div class="seecon-c flex">
          <div class="seecon-c-a">
            <el-row>
              <el-col :span="24" class="flex">
                <span class="seecon-row-label">初始备案时间：</span>
                <span
                  class="seecon-row-value">{{editFormData.firstdate != null ? editFormData.firstdate.substring(0, 10) : ''}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="flex">
                <span class="seecon-row-label">年审日期：</span>
                <span
                  class="seecon-row-value">{{editFormData.checkdate != null ? editFormData.checkdate.substring(0, 10) : ''}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="flex">
                <span class="seecon-row-label">价格核准日期：</span>
                <span
                  class="seecon-row-value">{{editFormData.approvalTime != null ? editFormData.approvalTime.substring(0, 10) : ''}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="flex">
                <span class="seecon-row-label">营业时间：</span>
                <span class="seecon-row-value">{{editFormData.businessHoursName}}</span>
              </el-col>
            </el-row>
          </div>
          <div class="seecon-c-b">
            <el-row>
              <el-col :span="12">
                <p class="w" style="margin-left: 56px;margin-bottom: 10px;">收费价格</p>
              </el-col>
            </el-row>
            <el-row v-show="!editFormData.feeIfscenic">
              <el-col class="flex" :span="24" v-if="editFormData.parkType!=35">
                <span class="seecon-row-label">白天：</span>
                <span class="seecon-row-value">
                  <span>{{editFormData.feeDay1}}元</span>
                  <span style="font-size: 16px;padding: 0 10px;">/</span>
                  <span>{{editFormData.feeDay2}}分钟</span>
                  <span v-show="editFormData.parkType==36">（首小时免费）</span>
                </span>
              </el-col>
              <el-col :span="24" v-if="editFormData.parkType==35">
                <el-row>
                  <el-col :span="24" class="flex">
                    <span class="seecon-row-label">白天：</span>
                    <span class="seecon-row-value">
                      <span>（首小时内） {{editFormData.feeDay1}}元</span>
                      <span style="font-size: 16px;padding: 0 10px;">/</span>
                      <span>15分钟</span>
                    </span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="flex">
                    <span class="seecon-row-label"></span>
                    <span class="seecon-row-value">
                      <span>（首小时外）{{editFormData.feeDay3}}元</span>
                      <span style="font-size: 16px;padding: 0 10px;">/</span>
                      <span>15分钟</span>
                    </span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-show="!editFormData.feeIfscenic">
              <el-col :span="24" class="flex">
                <span class="seecon-row-label">夜晚：</span>
                <span class="seecon-row-value">
                  <span>{{editFormData.feeNight1}}元</span>
                  <span style="font-size: 16px;padding: 0 10px;">/</span>
                  <span v-show="editFormData.parkType!=35">{{editFormData.feeNight2}}分钟</span>
                  <span v-show="editFormData.parkType==35">120分钟</span>
                  <span v-show="editFormData.parkType==36">（首小时免费）</span>
                </span>
              </el-col>
            </el-row>
            <el-row v-show="(editFormData.parkType!=35 && editFormData.parkType!=36)">
              <el-col class="flex" :span="24">
                <span class="seecon-row-label">景区：</span>
                <span class="seecon-row-value" v-show="editFormData.feeIfscenic">
                  <span>{{editFormData.feeScenic}}</span>
                  <span style="font-size: 16px;padding: 0 10px;">/</span>
                  <span>次</span>
                </span>
              </el-col>
            </el-row>
            <el-row v-show="(!editFormData.feeIfscenic && editFormData.parkType!=35 && editFormData.parkType!=36)">
              <el-col class="flex" :span="24">
                <span class="seecon-row-label">单日最高限价：</span>
                <span class="seecon-row-value" v-show="editFormData.feeIfhigh">
                  <span>{{editFormData.feeHigh}}/</span>
                  <span style="font-size: 16px;padding: 0 10px;">/</span>
                  <span>天<</span>
                </span>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>

      <el-row>
        <el-col :span="24">
          <p class="map-title">地图坐标：</p>
          <el-amap class="map" vid="amap1" :zoom="map.zoom" :center="map.center">
            <el-amap-marker v-if="markers.length>0" v-for="(marker, index) in markers" :key="index"
                            :position="marker.position"
                            :vid="index" :icon="map.mark_g"></el-amap-marker>
          </el-amap>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="seeForm = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="年检" :visible.sync="dialog" width="400px">
      <el-form>
        <el-form-item label="有效期" :label-width="'100px'">
          <el-date-picker
            v-model="checkForm.effectTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="有效期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="checkSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "historyman",
    data() {
      return {
        token: null,
        imgUrl: basePath + '/sys/file/getFileById',
        uploadUrl: basePath + '/sys/file/upload',
        qrCodeUrl: basePath + '/sys/park/showQRCode?id=',
        fileList: [],
        editFileList: [],

        ratePop: false,
        rateId: "",
        rate: "",
        seeForm: false,
        areaList: [],
        streetList: [],
        parkList: [],
        hoursList: [],
        editFormData: {
          id: "",
          recordNo: "",
          type: "",
          equityCompany: "",
          dmjxcws: "",
          dmfjxcws: "",
          name: "",
          manageCompany: "",
          employees: "",
          dxfjzcws: "",
          dxjxcws: "",
          address: "",
          manager: "",
          mobilePhone: "",
          firstdate: "",
          street: "",
          contract: "",
          phone: "",
          checkdate: "",
          totalNum: "",
          parkType: "",
          memberUnit: "",
          landCertificate: "",
          planNo: "",
          charges: "",
          legalPerson: "",
          remark: "",
          rate: "",

          acceptanceNo: "",
          parkNo: "",
          parkType1: "",
          parkingNo: "",
          approvalTime: "",
          businessHours: "",
          feeDay1: "",
          feeDay2: "",
          feeDay3: "",
          feeDay4: "",
          feeNight1: "",
          feeNight2: "",
          feeIfscenic: "",
          feeScenic: "",
          feeIfhigh: "",
          feeHigh: "",
          attach: "",
          position: "",
          state: ""
        },
        tableHeigt: 0,
        tableData: [],
        searchName: '',
        currentPage: 1,
        pageSize: 20,
        total: 200,
        multipleSelection: [],
        value: "",
        map: {
          center: [116.298331, 39.959956],
          zoom: 15,
          show: false,
          mark_g: require('./../../assets/images/mark_g.png'),
          mark_r: require('./../../assets/images/mark_r.png')
        },
        markers: [],

        dialog: false,
        checkForm: {
          id: "",
          effectTime: ""
        }
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 234;
        self.token = localStorage.getItem('token');
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
        self.$http.postForm("/sys/park/history", data).then(function (res) {
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
      rateBtn(index, row) {
        this.ratePop = true;
        this.rateId = row.id;
      },
      rateSubmit() {
        let self = this;
        self.$http.post("/sys/park/rate", {id: self.rateId, rate: self.rate}).then(function (res) {
          if (res.data.code == 0) {
            self.$message.success("操作成功");
            self.ratePop = false;
            self.getData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
      },
      see(index, row) {
        let self = this;
        self.seeForm = true;
        self.editFormData = row;
        self.editFormData.id = row.id;
        self.editFormData.parkType = row.parkType / 1;
        self.editFormData.street = row.street / 1;
        self.editFormData.type = row.type / 1;

        if (row.position != "" && row.position != null) {
          self.markers = [{position: [row.position.split(",")[0], row.position.split(",")[1]]}];
          self.map.center = self.markers[0].position;
        }

        if (row.feeIfscenic == "false") {
          self.editFormData.feeIfscenic = false;
        } else if (row.feeIfscenic == "true") {
          self.editFormData.feeIfscenic = true;
        }
        if (row.feeIfhigh == "false") {
          self.editFormData.feeIfhigh = false;
        } else if (row.feeIfhigh == "true") {
          self.editFormData.feeIfhigh = true;
        }
        // 文件回显
        if (self.editFormData.attach != "" && self.editFormData.attach != null) {
          let f_arr = self.editFormData.attach.split(",");
          self.editFileList = [];
          for (let i = 0; i < f_arr.length; i++) {
            self.$http.get("/sys/attach/info/" + f_arr[i]).then(function (res) {
              self.editFileList.push({name: res.data.sysAttach.name, fid: f_arr[i]});
            });
          }
        }
      },
      download(file) {
        window.open(basePath + "/sys/file/downloadFileById?id=" + file.fid);
      },
      downCodeImg(index, row) {
        window.open(basePath + "/sys/ad/showQRCode?id=" + row.id);
      },
      check(index, row) {
        this.dialog = true;
        this.checkForm.id = row.id;
        this.checkForm.effectTime = row.effectTime;
      },
      checkSubmit() {
        let self = this;
        self.$http.post("/sys/park/yearCheck", self.checkForm).then(function (res) {
          if (res.data.code == 0) {
            self.$message.success('操作成功');
            self.getData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
      },
      recheck(index, row) {
        let self = this;
        self.$confirm('此操作将提交复核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/park/reCheck", {id: row.id}).then(function (res) {
            if (res.data.code == 0) {
              self.$message.success('操作成功');
              self.getData();
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
          self.$http.post("/sys/park/delete", row.id).then(function (res) {
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
  @import "./../../css/adv.css";
</style>
