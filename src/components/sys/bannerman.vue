<template>
  <div class="bannerman">
    <img src="" alt="">
    <div class="tool">
      <el-button size="mini" type="primary" @click="addForm=true">添加</el-button>
      <el-button size="mini" type="primary" @click="">删除</el-button>
    </div>
    <el-table :data="tableData" stripe border :height="tableHeigt" style="width: 100%" ref="multipleTable"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="sort" width="150" label="排序"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="remark" label="描述"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button title="编辑" circle type="success" size="mini" icon="el-icon-edit"
                     @click="editForm=true"></el-button>
          <el-button title="删除" circle type="danger" size="mini" icon="el-icon-delete"
                     @click="handleDelete(scope.$index, scope.row)"></el-button>
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
    <el-dialog title="添加" :visible.sync="addForm" :width="'600px'">
      <el-form>
        <el-form-item label="名称" :label-width="'100px'">
          <el-input class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="'100px'">
          <el-input class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="'100px'">
          <el-input class="w400" type="number" placeholder="整数类型，数值越大，排序位置越靠前" clearable></el-input>
        </el-form-item>
        <el-form-item label="" :label-width="'100px'">
          <el-switch
            v-model="state"
            active-text="状态启用"
            inactive-text="状态禁用">
          </el-switch>
        </el-form-item>
        <el-form-item label="图片" :label-width="'100px'">
          <el-upload
            v-loading="loading"
            class="avatar-uploader"
            :action="uploadUrl"
            :data="{'token':token}"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addForm = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="editForm" :width="'600px'">
      <el-form>
        <el-form-item label="名称" :label-width="'100px'">
          <el-input class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="'100px'">
          <el-input class="w400" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="'100px'">
          <el-input class="w400" type="number" placeholder="整数类型，数值越大，排序位置越靠前" clearable></el-input>
        </el-form-item>
        <el-form-item label="" :label-width="'100px'">
          <el-switch
            v-model="state"
            active-text="状态启用"
            inactive-text="状态禁用">
          </el-switch>
        </el-form-item>
        <el-form-item label="图片" :label-width="'100px'">
          <el-upload
            v-loading="loading"
            class="avatar-uploader"
            :action="uploadUrl"
            :data="{'token':token}"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="editForm = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "bannerman",
    data() {
      return {
        loading: false,
        token: null,
        addForm: false,
        editForm: false,
        tableHeigt: 0,
        tableData: [
          {
            id: "001",
            name: 'banner1',
            remark: "轮播图1",
            sort: 1,
            state: 0
          }, {
            id: "001",
            name: 'banner1',
            remark: "轮播图1",
            sort: 1,
            state: 0
          }, {
            id: "001",
            name: 'banner1',
            remark: "轮播图1",
            sort: 1,
            state: 0
          }
        ],
        currentPage: 1,
        pageSize: 20,
        total: 200,
        multipleSelection: [],
        state: true,
        uploadUrl: basePath + "/sys/file/upload",
        imageUrl: ""
      }
    },
    created: function () {
      this.$nextTick(function () {
        this.token = localStorage.getItem('token');
        this.tableHeigt = document.body.clientHeight - 234;
      });
    },
    methods: {
      handleSizeChange(val) {
        this.pagesize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
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
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      beforeUpload(res, file) {
        this.loading = true;
      },
      uploadSuccess(res, file) {
        this.loading = false;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      uploadError(res, file) {
        this.loading = false;
        this.$message.error('图片插入失败');
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/sys.css";

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
</style>
