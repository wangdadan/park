<template>
  <div class="advman">
    <div class="tool">
      <el-button size="mini" type="primary" @click="add">添加</el-button>
      <el-input class="search" placeholder="请输入" size="mini" v-model="searchName" width="100">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button size="mini" type="primary" @click="getData">搜索</el-button>
    </div>
    <el-table :data="tableData" stripe border :height="tableHeigt" style="width: 100%" ref="multipleTable"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="序号" fixed="left" width="60">
        <template slot-scope='scope'>
          {{(currentPage - 1) * pageSize + (scope.$index / 1 + 1) }}
        </template>
      </el-table-column>
      <el-table-column label="停车场编号" min-width="110" :show-overflow-tooltip="true" resizable>
        <template slot-scope='scope'>
          <span class="tosee" @click="edit(scope.$index, scope.row,0)">{{scope.row.parkNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="停车场备案号" min-width="110" :show-overflow-tooltip="true" resizable>
        <template slot-scope='scope'>
          <span class="tosee" @click="edit(scope.$index, scope.row,0)">{{scope.row.recordNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="停车场名称" min-width="200" :show-overflow-tooltip="true" resizable>
        <template slot-scope='scope'>
          <span class="tosee" @click="edit(scope.$index, scope.row,0)">{{scope.row.name}}</span>
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
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button title="提交审核" circle type="primary" size="mini" icon="el-icon-check"
                     @click="take(scope.$index, scope.row)"></el-button>
          <el-button title="编辑" circle type="primary" size="mini" icon="el-icon-edit"
                     @click="edit(scope.$index, scope.row,1)"></el-button>
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
    <el-dialog :close-on-click-modal="false" title="添加" :visible.sync="addForm" :width="'1000px'" fullscreen>
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item label="受理编号" :label-width="'125px'">
              <el-input v-model="addFormData.acceptanceNo" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车场备案号" :label-width="'125px'">
              <el-input v-model="addFormData.recordNo" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车场名称" :label-width="'125px'">
              <el-input v-model="addFormData.name" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车场地址" :label-width="'125px'">
              <el-input v-model="addFormData.address" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车场类型" :label-width="'125px'">
              <el-select v-model="addFormData.parkType" class="w" placeholder="请选择" clearable>
                <el-option v-for="item in parkList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属街道" :label-width="'125px'">
              <el-select v-model="addFormData.street" class="w" placeholder="请选择" clearable>
                <el-option v-for="item in streetList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地区类别" :label-width="'125px'">
              <el-select v-model="addFormData.type" class="w" placeholder="请选择" clearable>
                <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总车位数" :label-width="'125px'">
              <el-input v-model="addFormData.totalNum" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车位编号" :label-width="'125px'">
              <el-input v-model="addFormData.parkingNo" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <p style="line-height: 40px;margin-left: -40px;">*说明：路侧占道停车场填写，格式为00000001-000000200</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经营单位" :label-width="'125px'">
              <el-input v-model="addFormData.manageCompany" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" :label-width="'125px'">
              <el-input v-model="addFormData.contract" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话" :label-width="'125px'">
              <el-input v-model="addFormData.phone" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="初始备案时间" :label-width="'125px'">
              <el-date-picker v-model="addFormData.firstdate" type="date" placeholder="选择日期" class="w"
                              value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年审日期" :label-width="'125px'">
              <el-date-picker v-model="addFormData.checkdate" type="date" placeholder="选择日期" class="w"
                              value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <p class="w" style="margin-left: 56px;margin-bottom: 10px;">收费价格</p>
          </el-col>
        </el-row>
        <el-row v-show="!addFormData.feeIfscenic">
          <el-col :span="24" v-if="addFormData.parkType!=35">
            <el-form-item label="白天：" :label-width="'125px'">
              <el-input v-model="addFormData.feeDay1" style="width: 150px;" clearable>
                <template slot="append">元</template>
              </el-input>
              <span style="font-size: 24px;position: relative;top: 6px;padding: 0 10px;">/</span>
              <el-input v-model="addFormData.feeDay2" style="width: 150px;" clearable>
                <template slot="append">分钟</template>
              </el-input>
              <span v-show="addFormData.parkType==36">（首小时免费）</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="addFormData.parkType==35">
            <el-form-item label="白天：(首小时内)" :label-width="'125px'">
              <el-input v-model="addFormData.feeDay1" style="width: 150px;" clearable>
                <template slot="append">元</template>
              </el-input>
              <span style="font-size: 24px;position: relative;top: 6px;padding: 0 10px;">/</span>
              <el-input :value="15" style="width: 150px;" readonly>
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
            <el-form-item label="(首小时外)" :label-width="'125px'">
              <el-input v-model="addFormData.feeDay3" style="width: 150px;" clearable>
                <template slot="append">元</template>
              </el-input>
              <span style="font-size: 24px;position: relative;top: 6px;padding: 0 10px;">/</span>
              <el-input :value="15" style="width: 150px;" readonly>
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="!addFormData.feeIfscenic">
          <el-col :span="24">
            <el-form-item label="夜晚：" :label-width="'125px'">
              <el-input v-model="addFormData.feeNight1" style="width: 150px;" clearable>
                <template slot="append">元</template>
              </el-input>
              <span style="font-size: 24px;position: relative;top: 6px;padding: 0 10px;">/</span>
              <el-input v-show="addFormData.parkType!=35" v-model="addFormData.feeNight2" style="width: 150px;"
                        clearable>
                <template slot="append">分钟</template>
              </el-input>
              <el-input v-show="addFormData.parkType==35" :value="120" style="width: 150px;" readonly>
                <template slot="append">分钟</template>
              </el-input>
              <span v-show="addFormData.parkType==36">（首小时免费）</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="(addFormData.parkType!=35 && addFormData.parkType!=36)">
          <el-col :span="24">
            <el-form-item label="" :label-width="'0px'">
              <el-checkbox v-model="addFormData.feeIfscenic" style="margin-left: 48px;margin-right: 8px;">景区：
              </el-checkbox>
              <el-input v-show="addFormData.feeIfscenic" v-model="addFormData.feeScenic" class="w" clearable>
                <template slot="append">元/次</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="(!addFormData.feeIfscenic && addFormData.parkType!=35 && addFormData.parkType!=36)">
          <el-col :span="24">
            <el-form-item label="" :label-width="'0px'">
              <el-checkbox v-model="addFormData.feeIfhigh" style="margin-left: 48px;margin-right: 8px;">单日最高限价：
              </el-checkbox>
              <el-input v-show="addFormData.feeIfhigh" v-model="addFormData.feeHigh" class="w" clearable>
                <template slot="append">元/天</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="营业时间" :label-width="'125px'">
              <el-select v-model="addFormData.businessHours" class="w" placeholder="请选择" clearable>
                <el-option v-for="item in hoursList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产权单位" :label-width="'125px'">
              <el-input v-model="addFormData.equityCompany" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地面机械车位数" :label-width="'125px'">
              <el-input v-model="addFormData.dmjxcws" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地面非机械车位数" :label-width="'125px'">
              <el-input v-model="addFormData.dmfjxcws" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地下机械数车位数" :label-width="'125px'">
              <el-input v-model="addFormData.dxjxcws" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地下非机械车位数" :label-width="'125px'">
              <el-input v-model="addFormData.dxfjzcws" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会员单位" :label-width="'125px'">
              <el-input v-model="addFormData.memberUnit" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="土地使用证号" :label-width="'125px'">
              <el-input v-model="addFormData.landCertificate" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规划证号" :label-width="'125px'">
              <el-input v-model="addFormData.planNo" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人" :label-width="'125px'">
              <el-input v-model="addFormData.legalPerson" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业经理" :label-width="'125px'">
              <el-input v-model="addFormData.manager" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" :label-width="'125px'">
              <el-input v-model="addFormData.mobilePhone" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="从业人数" :label-width="'125px'">
              <el-input v-model="addFormData.employees" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" :label-width="'125px'">
              <el-input v-model="addFormData.remark" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p class="title">地图坐标：</p>
            <el-form-item>
              <el-amap class="map" vid="amap1" :zoom="map.zoom" :center="map.center" :events="events">
                <el-amap-marker v-if="markers.length>0" v-for="(marker, index) in markers" :key="index"
                                :position="marker.position"
                                :vid="index" :icon="map.mark_g"></el-amap-marker>
              </el-amap>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="附件" :label-width="'100px'">
          <el-upload
            width="400px"
            :action="uploadUrl"
            :headers="{token:token}"
            :on-preview="download"
            :accept="'image/png, image/jpg'"
            :limit="1"
            :before-remove="addremove"
            :on-success="addupload"
            :file-list="addFileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png图片文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="editForm" :width="'1000px'" fullscreen>
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item label="受理编号" :label-width="'125px'">
              <el-input v-model="editFormData.acceptanceNo" class="w" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车场备案号" :label-width="'125px'">
              <el-input v-model="editFormData.recordNo" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车场名称" :label-width="'125px'">
              <el-input v-model="editFormData.name" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车场地址" :label-width="'125px'">
              <el-input v-model="editFormData.address" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车场类型" :label-width="'125px'">
              <el-select v-model="editFormData.parkType" class="w" placeholder="请选择">
                <el-option v-for="item in parkList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属街道" :label-width="'125px'">
              <el-select v-model="editFormData.street" class="w" placeholder="请选择">
                <el-option v-for="item in streetList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地区类别" :label-width="'125px'">
              <el-select v-model="editFormData.type" class="w" placeholder="请选择">
                <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总车位数" :label-width="'125px'">
              <el-input v-model="editFormData.totalNum" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车位编号" :label-width="'125px'">
              <el-input v-model="editFormData.parkingNo" class="w" :disabled="editFormData.parkType!=35"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <p style="line-height: 40px;margin-left: -40px;">*说明：路侧占道停车场填写，格式为00000001-000000200</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经营单位" :label-width="'125px'">
              <el-input v-model="editFormData.manageCompany" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" :label-width="'125px'">
              <el-input v-model="editFormData.contract" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话" :label-width="'125px'">
              <el-input v-model="editFormData.phone" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="初始备案时间" :label-width="'125px'">
              <el-date-picker v-model="editFormData.firstdate" type="date" placeholder="选择日期" class="w"
                              value-format="yyyy-MM-dd HH:mm:ss" :disabled="toggle"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年审日期" :label-width="'125px'">
              <el-date-picker v-model="editFormData.checkdate" type="date" placeholder="选择日期" class="w"
                              value-format="yyyy-MM-dd HH:mm:ss" :disabled="toggle"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <p class="w" style="margin-left: 56px;margin-bottom: 10px;">收费价格</p>
          </el-col>
        </el-row>
        <el-row v-show="!editFormData.feeIfscenic">
          <el-col :span="24" v-if="editFormData.parkType!=35">
            <el-form-item label="白天：" :label-width="'125px'">
              <el-input v-model="editFormData.feeDay1" style="width: 150px;" clearable>
                <template slot="append">元</template>
              </el-input>
              <span style="font-size: 24px;position: relative;top: 6px;padding: 0 10px;">/</span>
              <el-input v-model="editFormData.feeDay2" style="width: 150px;" clearable>
                <template slot="append">分钟</template>
              </el-input>
              <span v-show="editFormData.parkType==36">（首小时免费）</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="editFormData.parkType==35">
            <el-form-item label="白天：(首小时内)" :label-width="'125px'">
              <el-input v-model="editFormData.feeDay1" style="width: 150px;" clearable>
                <template slot="append">元</template>
              </el-input>
              <span style="font-size: 24px;position: relative;top: 6px;padding: 0 10px;">/</span>
              <el-input :value="15" style="width: 150px;" readonly>
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
            <el-form-item label="(首小时外)" :label-width="'125px'">
              <el-input v-model="editFormData.feeDay3" style="width: 150px;" clearable>
                <template slot="append">元</template>
              </el-input>
              <span style="font-size: 24px;position: relative;top: 6px;padding: 0 10px;">/</span>
              <el-input :value="15" style="width: 150px;" readonly>
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="!editFormData.feeIfscenic">
          <el-col :span="24">
            <el-form-item label="夜晚：" :label-width="'125px'">
              <el-input v-model="editFormData.feeNight1" style="width: 150px;" clearable>
                <template slot="append">元</template>
              </el-input>
              <span style="font-size: 24px;position: relative;top: 6px;padding: 0 10px;">/</span>
              <el-input v-show="editFormData.parkType!=35" v-model="editFormData.feeNight2" style="width: 150px;"
                        clearable>
                <template slot="append">分钟</template>
              </el-input>
              <el-input v-show="editFormData.parkType==35" :value="120" style="width: 150px;" readonly>
                <template slot="append">分钟</template>
              </el-input>
              <span v-show="editFormData.parkType==36">（首小时免费）</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="(editFormData.parkType!=35 && editFormData.parkType!=36)">
          <el-col :span="24">
            <el-form-item label="" :label-width="'0px'">
              <el-checkbox v-model="editFormData.feeIfscenic" style="margin-left: 48px;margin-right: 8px;">景区：
              </el-checkbox>
              <el-input v-show="editFormData.feeIfscenic" v-model="editFormData.feeScenic" class="w" clearable>
                <template slot="append">元/次</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="(!editFormData.feeIfscenic && editFormData.parkType!=35 && editFormData.parkType!=36)">
          <el-col :span="24">
            <el-form-item label="" :label-width="'0px'">
              <el-checkbox v-model="editFormData.feeIfhigh" style="margin-left: 48px;margin-right: 8px;">单日最高限价：
              </el-checkbox>
              <el-input v-show="editFormData.feeIfhigh" v-model="editFormData.feeHigh" class="w" clearable>
                <template slot="append">元/天</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="营业时间" :label-width="'125px'">
              <el-select v-model="editFormData.businessHours" class="w" placeholder="请选择">
                <el-option v-for="item in hoursList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产权单位" :label-width="'125px'">
              <el-input v-model="editFormData.equityCompany" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地面机械车位数" :label-width="'125px'">
              <el-input v-model="editFormData.dmjxcws" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地面非机械车位数" :label-width="'125px'">
              <el-input v-model="editFormData.dmfjxcws" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地下机械数车位数" :label-width="'125px'">
              <el-input v-model="editFormData.dxjxcws" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地下非机械车位数" :label-width="'125px'">
              <el-input v-model="editFormData.dxfjzcws" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会员单位" :label-width="'125px'">
              <el-input v-model="editFormData.memberUnit" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="土地使用证号" :label-width="'125px'">
              <el-input v-model="editFormData.landCertificate" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规划证号" :label-width="'125px'">
              <el-input v-model="editFormData.planNo" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人" :label-width="'125px'">
              <el-input v-model="editFormData.legalPerson" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业经理" :label-width="'125px'">
              <el-input v-model="editFormData.manager" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" :label-width="'125px'">
              <el-input v-model="editFormData.mobilePhone" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="从业人数" :label-width="'125px'">
              <el-input v-model="editFormData.employees" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" :label-width="'125px'">
              <el-input v-model="editFormData.remark" class="w" :disabled="toggle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p class="title">地图坐标：</p>
            <el-form-item>
              <el-amap class="map" vid="amap2" :zoom="map.zoom" :center="map.center" :events="events">
                <el-amap-marker v-if="markers.length>0" v-for="(marker, index) in markers" :key="index"
                                :position="marker.position"
                                :vid="index" :icon="map.mark_g"></el-amap-marker>
              </el-amap>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="附件" :label-width="'100px'">
          <el-upload
            width="400px"
            :action="uploadUrl"
            :headers="{token:token}"
            :on-preview="download"
            :before-remove="remove"
            :on-success="editupload"
            :accept="'image/png, image/jpg'"
            :limit="1"
            :file-list="editFileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png图片文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="editSubmit">确 定</el-button>
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
            <!--<div class="qrcode-box">-->
            <!--<div class="qrcode"><img :src="imgUrl+'?id='+editFormData.attach" alt=""></div>-->
            <!--<p class="qrcode-des">停车场展示图</p>-->
            <!--</div>-->
            <!--<div class="qrcode-box">-->
            <!--<div class="qrcode"><img :src="qrCodeUrl + editFormData.id" alt=""></div>-->
            <!--<p class="qrcode-des">停车收费价格核准 <br>二维码，可下载使用</p>-->
            <!--</div>-->
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
  </div>
</template>

<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    components: {ElButton},
    name: "advman",
    data() {
      return {
        token: null,
        imgUrl: basePath + '/sys/file/getFileById',
        uploadUrl: basePath + '/sys/file/upload',
        addFileList: [],
        editFileList: [],

        value: "",
        addForm: false,
        seeForm: false,
        editForm: false,
        toggle: true,
        areaList: [],
        streetList: [],
        parkList: [],
        hoursList: [],
        addFormData: {
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
        options: [],
        map: {
          center: [116.298331, 39.959956],
          zoom: 15,
          show: false,
          mark_g: require('./../../assets/images/mark_g.png'),
          mark_r: require('./../../assets/images/mark_r.png')
        },
        events: {
          'click': (e) => {
            if (this.markers.length == 0) {
              this.markers.push({position: [e.lnglat.lng, e.lnglat.lat]});
            } else {
              this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
            }
          }
        },
        markers: [
          {position: [116.298331, 39.959956]}
        ]
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 234;
        self.token = localStorage.getItem('token');
        self.getData();

        self.$http.get("/sys/dict/listByType?type=parkType").then(function (res) {
          if (res.data.code == 0) {
            let list = res.data.page;
            for (let i in list) {
              self.parkList.push({label: list[i].value, value: list[i].id});
            }
          }
        });
        self.$http.get("/sys/dict/listByType?type=businessHours").then(function (res) {
          if (res.data.code == 0) {
            let list = res.data.page;
            for (let i in list) {
              self.hoursList.push({label: list[i].value, value: list[i].id});
            }
          }
        });
        self.$http.get("/sys/dict/listByType?type=street").then(function (res) {
          if (res.data.code == 0) {
            let list = res.data.page;
            for (let i in list) {
              self.streetList.push({label: list[i].value, value: list[i].id});
            }
          }
        });
        self.$http.get("/sys/dict/listByType?type=areaType").then(function (res) {
          if (res.data.code == 0) {
            let list = res.data.page;
            for (let i in list) {
              self.areaList.push({label: list[i].value, value: list[i].id});
            }
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
        self.$http.postForm("/sys/park/list", data).then(function (res) {
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
      add() {
        this.addForm = true;
        this.addFileList = [];
        for (let i in this.addFormData) {
          this.addFormData[i] = "";
        }
      },
      addSubmit() {
        let self = this;
//        self.$message.error("名称不能为空");
        let params = self.addFormData;
        if (self.markers.length > 0) params.position = self.markers[0].position.join(",");
        if (self.addFormData.feeIfscenic) {
          self.addFormData.feeDay1 = '';
          self.addFormData.feeDay2 = '';
          self.addFormData.feeNight1 = '';
          self.addFormData.feeNight2 = '';
          self.addFormData.feeHigh = '';
        } else {
          self.addFormData.feeScenic = '';
        }
        if (params.parkType == 35) {
          params.feeDay2 = 15;
          params.feeDay4 = 15;
          params.feeNight2 = 120;
        }
        self.$http.post("/sys/park/save", params).then(function (res) {
          if (res.data.code == 0) {
            self.addForm = false;
            self.getData();
            self.$message.success('添加成功');
          } else {
            self.$message.error(res.data.msg);
          }
        });
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
          self.$http.post("/sys/park/delete", ids.join(",")).then(function (res) {
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
      },
      edit(index, row, flag) {
        let self = this;
        if (flag == 0) {
          self.seeForm = true;
        } else if (flag == 1) {
          self.editForm = true;
        }
        self.editFormData = row;
        self.editFormData.id = row.id;
        self.editFormData.parkType = row.parkType / 1;
        self.editFormData.street = row.street / 1;
        self.editFormData.type = row.type / 1;


        if (row.createUserId != 9999) self.toggle = false;
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
        let self = this;
        window.open(basePath + "/sys/file/downloadFileById?id=" + file.fid);
      },
      editSubmit() {
        let self = this;
//        self.$message.error("名称不能为空");
        let params = self.editFormData;
        if (self.markers.length > 0) params.position = self.markers[0].position.join(",");
        if (self.editFormData.feeIfscenic) {
          self.editFormData.feeDay1 = '';
          self.editFormData.feeDay2 = '';
          self.editFormData.feeNight1 = '';
          self.editFormData.feeNight2 = '';
          self.editFormData.feeHigh = '';
        } else {
          self.editFormData.feeScenic = '';
        }
        if (params.parkType == 35) {
          params.feeDay2 = 15;
          params.feeDay4 = 15;
          params.feeNight2 = 120;
        }
        self.$http.post("/sys/park/update", params).then(function (res) {
          if (res.data.code == 0) {
            self.editForm = false;
            self.getData();
            self.$message.success('修改成功');
          } else {
            self.$message.error(res.data.msg);
          }
        });
      },
      addupload(res, file, fileList) {
        let a = [];
        for (let i in fileList) {
          a.push(fileList[i].response.fileId);
        }
        this.addFormData.attach = a.join(",");
      },
      editupload(res, file, fileList) {
        let a = [];
        for (let i in fileList) {
          a.push(fileList[i].response.fileId);
        }
        this.editFormData.attach = a.join(",");
      },
      addremove(file, fileList) {
        let a = [];
        for (let i in fileList) {
          a.push(fileList[i].response.fileId);
        }
        this.addFormData.attach = a.join(",");
      },
      remove(file, fileList) {
        let a = [];
        for (let i in fileList) {
          a.push(fileList[i].fid);
        }
        this.editFormData.attach = a.join(",");
      },
      take(index, row) {
        let self = this;
        self.$confirm('此操作将提交审核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/park/forCheck", {id: row.id}).then(function (res) {
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
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/adv.css";
</style>
