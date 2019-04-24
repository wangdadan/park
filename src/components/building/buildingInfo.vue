<template>
  <div class="buildingInfo">
    <div class="tool">
      <el-button size="mini" type="primary" @click="add">添加</el-button>
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
      <el-table-column prop="code" label="广告载体编号" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="name" label="广告载体名称" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="address" label="广告载体地址" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="adcount" label="广告备案记录" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="streetName" label="行政区域" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="companyName" label="关联企业" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button title="查看" circle type="primary" size="mini" icon="el-icon-view"
                     @click="see(scope.$index, scope.row)"></el-button>
          <el-button title="编辑" circle type="primary" size="mini" icon="el-icon-edit"
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
    <el-dialog :close-on-click-modal="false" title="添加" :visible.sync="addForm" top="50px" :width="'800px'">
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="广告载体名称" :label-width="'120px'">
              <el-input style="width: 222px;" v-model="addFormData.name" type="text" placeholder="请输入广告载体名称"
                        clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="广告载体地址" :label-width="'120px'">
              <el-input style="width: 222px;" v-model="addFormData.address" type="text" placeholder="请输入广告载体地址"
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="关联企业" :label-width="'120px'">
              <el-select v-model="addFormData.company" placeholder="请选择关联企业" filterable>
                <el-option v-for="item in sel1" :key="item.id" :label="item.label"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="行政区划" :label-width="'120px'">
              <el-select v-model="addFormData.street" placeholder="请选择行政区划" filterable>
                <el-option v-for="item in sel2" :key="item.id" :label="item.label" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="title">地图坐标：</p>
        <el-form-item>
          <baidu-map
            class="map"
            @click="mapclick"
            :center="map.center"
            :zoom="map.zoom"
            :scroll-wheel-zoom="true">
            <bm-marker :position="map.marker"
                       animation="BMAP_ANIMATION_BOUNCE"
                       :icon="{url: map.mark_g, size: {width: 20, height: 25}}" :dragging="true"
                       @click="marker.show=true">
            </bm-marker>
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true"
                            :autoLocation="true"></bm-geolocation>
          </baidu-map>
        </el-form-item>
        <p class="title">图片</p>
        <el-form-item :label-width="'100px'">
          <div class="imgcon">
            <div class="clear">
              <div class="imglist fl clear">
                <div class="imglist-item fl" v-for="(item,index) in addImgData">
                  <img width="100%" height="100%" :src="item" alt="">
                  <div class="imglist-item-tool">
                    <i @click="imgPre(0,index)" class="imglist-item-tool-i el-icon-zoom-in"></i>
                    <i @click="imgDel(index)" class="imglist-item-tool-i el-icon-delete"></i>
                  </div>
                </div>
              </div>
              <div class="imgadd fl" @click="cropDialog=true;loading=false;"><i
                class="el-icon-plus"></i></div>
            </div>
            <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editForm" top="50px" :width="'800px'">
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="广告载体名称" :label-width="'120px'">
              <el-input style="width: 222px;" v-model="editFormData.name" type="text" placeholder="请输入广告载体名称"
                        clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="广告载体地址" :label-width="'120px'">
              <el-input style="width: 222px;" v-model="editFormData.address" type="text" placeholder="请输入广告载体地址"
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="关联企业" :label-width="'120px'">
              <el-select v-model="editFormData.company/1" placeholder="请选择关联企业" filterable>
                <el-option v-for="item in sel1" :key="item.id" :label="item.label"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="行政区划" :label-width="'120px'">
              <el-select v-model="editFormData.street/1" placeholder="请选择行政区划" filterable>
                <el-option v-for="item in sel2" :key="item.id" :label="item.label" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="title">地图坐标：</p>
        <el-form-item>
          <baidu-map
            class="map"
            @click="editMapclick"
            :center="editMap.center"
            :zoom="map.zoom"
            :scroll-wheel-zoom="true">
            <bm-marker :position="editMap.marker"
                       animation="BMAP_ANIMATION_BOUNCE"
                       :icon="{url: map.mark_g, size: {width: 20, height: 25}}" :dragging="true"
                       @click="marker.show=true">
            </bm-marker>
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true"
                            :autoLocation="true"></bm-geolocation>
          </baidu-map>
        </el-form-item>
        <p class="title">图片</p>
        <el-form-item :label-width="'100px'">
          <div class="imgcon">
            <div class="clear">
              <div class="imglist fl clear">
                <div class="imglist-item fl" v-for="(item,index) in editImgId">
                  <img width="100%" height="100%" :src="backImgUrl+item" alt="">
                  <div class="imglist-item-tool">
                    <i @click="imgPre(1,index)" class="imglist-item-tool-i el-icon-zoom-in"></i>
                    <i @click="imgDel(index)" class="imglist-item-tool-i el-icon-delete"></i>
                  </div>
                </div>
              </div>
              <div class="imgadd fl" @click="cropDialog=true;loading=false;"><i
                class="el-icon-plus"></i></div>
            </div>
            <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="seeForm" top="50px" :width="'800px'">
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="广告载体名称" :label-width="'120px'">
              <el-input style="width: 222px;" v-model="seeFormData.name" type="text" placeholder="请输入广告载体名称"
                        readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="广告载体地址" :label-width="'120px'">
              <el-input style="width: 222px;" v-model="seeFormData.address" type="text" placeholder="请输入广告载体地址"
                        readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="reg-item" label="关联企业" :label-width="'120px'">
              <el-select v-model="seeFormData.company/1" placeholder="请选择关联企业" disabled>
                <el-option v-for="item in sel1" :key="item.id" :label="item.label"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="reg-item" label="行政区划" :label-width="'120px'">
              <el-select v-model="seeFormData.street/1" placeholder="请选择行政区划" disabled>
                <el-option v-for="item in sel2" :key="item.id" :label="item.label" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="title">地图坐标：</p>
        <el-form-item>
          <baidu-map
            class="map"
            :center="seeMap.center"
            :zoom="map.zoom"
            :scroll-wheel-zoom="true">
            <bm-marker :position="seeMap.marker"
                       animation="BMAP_ANIMATION_BOUNCE"
                       :icon="{url: map.mark_g, size: {width: 20, height: 25}}" :dragging="false">
            </bm-marker>
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true"
                            :autoLocation="true"></bm-geolocation>
          </baidu-map>
        </el-form-item>
        <p class="title">图片</p>
        <el-form-item :label-width="'100px'">
          <div class="imgcon">
            <div class="clear">
              <div class="imglist fl clear">
                <div class="imglist-item fl" v-for="(item,index) in editImgId">
                  <img width="100%" height="100%" :src="backImgUrl+item" alt="">
                  <div class="imglist-item-tool">
                    <i @click="imgPre(1,index)" class="imglist-item-tool-i el-icon-zoom-in"></i>
                  </div>
                </div>
              </div>
            </div>
            <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="seeForm = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!--图片裁剪弹框-->
    <el-dialog :close-on-click-modal="false" title="添加照片" :visible.sync="cropDialog" :width="'800px'">
      <div v-loading="loading" style="padding: 3px 0">
        <vueCropper
          class="crop"
          ref="cropper"
          :centerBox="true"
          :autoCrop="true"
          :img="option.img"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :original="option.original"
        ></vueCropper>
        <el-button size="mini" type="primary" class="imgbtn"><label for="uploads">上传</label>
        </el-button>
        <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
               accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
        <div slot="footer" style="text-align: right;" class="dialog-footer">
          <el-button size="mini" @click="cropDialog = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="cropConfirm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "buildingInfo",
    data() {
      return {
        token: null,
        uploadUrl: basePath + '/sys/file/upload',
        backImgUrl: basePath + "/sys/file/getFileById?id=",
        dialogImageUrl: '',
        dialogVisible: false,

        addForm: false,
        tableHeigt: 0,
        tableData: [],
        searchName: "",
        currentPage: 1,
        pageSize: 20,
        total: 1,

        addFormData: {
          name: "",
          address: "",
          company: "",
          street: "",
          position: "",
          attach: ""
        },
        sel1: [],
        sel2: [],
        editForm: false,
        editFormData: {
          id: "",
          name: "",
          address: "",
          company: "",
          street: "",
          position: "",
          attach: ""
        },


        seeForm: false,
        seeFormData: {
          name: "",
          address: "",
          company: "",
          street: "",
          position: "",
          attach: ""
        },
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
        editMap: {
          marker: {
            lng: "",
            lat: ""
          },
          center: {
            lng: "",
            lat: ""
          }
        },
        seeMap: {
          marker: {
            lng: "",
            lat: ""
          },
          center: {
            lng: "",
            lat: ""
          }
        },

        cropState: 0,                       //  0 : add   1 : edit
        cropDialog: false,
        loading: false,
        option: {
          img: '',
          full: false,
          outputType: 'png',
          canMove: true,
          original: false
        },
        addImgData: [],
        addImgId: [],
        editImgData: [],
        editImgId: []
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 234;
        self.token = localStorage.getItem('token');
        self.getData();

        self.$http.get("/sys/company/select").then(function (res) {
          let list = res.data.list;
          for (var i in list) {
            self.sel1.push({label: list[i].companyName, id: list[i].id});
          }
        });
        self.$http.get("/sys/dept/select").then(function (res) {
          let list = res.data.list;
          for (var i in list) {
            self.sel2.push({label: list[i].name, id: list[i].deptId});
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
        self.$http.postForm("/sys/building/list", data).then(function (res) {
          self.tableData = res.data.page.list;
          self.total = res.data.page.totalCount;
        });
      },
      add() {
        this.addForm = true;
        for (let i in this.addFormData) {
          this.addFormData[i] = "";
        }
      },
      search() {
        this.getData();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
      },

      mapclick(e) {
        this.map.marker.lng = e.point.lng;
        this.map.marker.lat = e.point.lat;
        this.addFormData.position = e.point.lng + "," + e.point.lat;
      },
      editMapclick(e) {
        this.editMap.marker = e.point;
        this.editFormData.position = e.point.lng + "," + e.point.lat;
      },

      submitForm(flag) {
        let self = this;
        if (flag == "addForm") {
          self.addFormData.attach = self.addImgId.join(",");
          if (self.addFormData.name == "") {
            self.$message.error("广告载体名称不能为空");
          } else if (self.addFormData.address == "") {
            self.$message.error("广告载体地址不能为空");
          } else if (self.addFormData.company == "") {
            self.$message.error("关联企业不能为空");
          } else if (self.addFormData.street == "") {
            self.$message.error("行政区划不能为空");
          } else if (self.addFormData.position == "") {
            self.$message.error("地图坐标不能为空");
          } else {
            self.$http.post("/sys/building/save", self.addFormData).then(function (res) {
              if (res.data.code == 0) {
                self.addForm = false;
                self.getData();
                self.$message.success('添加成功');
              } else {
                self.$message.error(res.data.msg);
              }
            });
          }
        } else if (flag == "editForm") {
          self.editFormData.attach = self.editImgId.join(",");
          if (self.editFormData.name == "") {
            self.$message.error("广告载体名称不能为空");
          } else if (self.editFormData.address == "") {
            self.$message.error("广告载体地址不能为空");
          } else if (self.editFormData.company == "") {
            self.$message.error("关联企业不能为空");
          } else if (self.editFormData.street == "") {
            self.$message.error("行政区划不能为空");
          } else if (self.editFormData.position == "") {
            self.$message.error("地图坐标不能为空");
          } else {
            self.$http.post("/sys/building/update", self.editFormData).then(function (res) {
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
      },
      edit(index, row) {
        let self = this;
        self.editForm = true;
        self.cropState = 1;
        self.editImgId = [];
        self.editImgData = [];
        self.editMap.marker = {};
        self.editMap.center = {};
        for (let i in this.editFormData) {
          self.editFormData[i] = row[i];
        }
        setTimeout(function () {
          self.editMap.marker = {
            lng: row.position.split(",")[0],
            lat: row.position.split(",")[1]
          };
          self.editMap.center = self.editMap.marker;
        }, 500);


        self.editImgId = row.attach.split(",");
        self.editImgData = row.attach.split(",");
      },
      see(index, row) {
        let self = this;
        self.seeForm = true;
        self.editImgId = [];
        self.editImgData = [];
        self.seeMap = {
          marker: {},
          center: {}
        };
        for (let i in self.seeFormData) {
          self.seeFormData[i] = row[i];
        }
        setTimeout(function () {
          self.seeMap.marker = {
            lng: row.position.split(",")[0],
            lat: row.position.split(",")[1]
          };
          self.seeMap.center = self.seeMap.marker;
        }, 500);

        self.editImgId = row.attach.split(",");
        self.editImgData = row.attach.split(",");
      },
      del(index, row) {
        let self = this;
        self.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/building/delete", row.id).then(function (res) {
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

      uploadImg(e, num) {
        //上传图片
        // this.option.img
        var file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if (num === 1) {
            this.option.img = data
          } else if (num === 2) {
            this.example2.img = data
          }
        }
//         转化为base64
        reader.readAsDataURL(file)
//         转化为blob
//        reader.readAsArrayBuffer(file)
      },
      imgPre(state, index) {
        this.dialogVisible = true;
        this.cropState = state;
        if (this.cropState == 0) {
          this.dialogImageUrl = this.addImgData[index];
        } else if (this.cropState == 1) {
          this.dialogImageUrl = this.backImgUrl + this.editImgData[index];
        }
      },
      imgDel(index) {
        if (this.cropState == 0) {
          this.addImgData.splice(index, 1);
          this.addImgId.splice(index, 1);
        } else if (this.cropState == 1) {
          this.editImgData.splice(index, 1);
          this.editImgId.splice(index, 1);
        }
      },
      cropConfirm() {
        let self = this;
        if (self.$refs.cropper.cropW == 0) {
          self.loading = false;
          self.cropDialog = false;
        } else {
          self.loading = true;
          self.$refs.cropper.getCropData((data) => {
            self.$http.post("/sys/file/uploadBase64", {imgStr: data, fileName: ""}).then(function (res) {
              if (res.data.code == 0) {
                if (self.cropState == 0) {
                  self.addImgData.push(data);
                  self.addImgId.push(res.data.fileId);
                } else if (self.cropState == 1) {
                  self.editImgData.push(data);
                  self.editImgId.push(res.data.fileId);
                }
                self.loading = false;
                self.cropDialog = false;
              }
            });
          });
        }
      },
    }
  }
</script>

<style scoped>
  @import "./../../css/sys.css";
  @import "./../../css/buildingInfo.css";
</style>
