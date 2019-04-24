<template>
  <div class="ann">
    <div class="tool">
      <el-button size="mini" type="primary" @click="add">添加</el-button>
      <el-button size="mini" type="primary" @click="dels">删除</el-button>
      <el-input class="search" size="mini" v-model="searchName" placeholder="请输入" clearable></el-input>
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
      <el-table-column prop="title" label="标题" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="newsDate" label="时间" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="author" label="作者" min-width="50" :show-overflow-tooltip="true"
                       resizable></el-table-column>
      <el-table-column prop="source" label="来源" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="abst" label="内容" :show-overflow-tooltip="true" resizable></el-table-column>
      <el-table-column prop="state" label="状态" width="100" resizable>
        <template slot-scope='scope'>
          <p>{{scope.row.state == 0 ? '启用' : '未启用'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button title="编辑" circle type="success" size="mini" icon="el-icon-edit"
                     @click="edit(scope.row)"></el-button>
          <el-button title="删除" circle type="danger" size="mini" icon="el-icon-delete"
                     @click="del(scope.row)"></el-button>
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
        <el-form-item label="标题" :label-width="'100px'">
          <el-input v-model="addFormData.title" class="w800" clearable></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="来源" :label-width="'100px'">
              <el-input v-model="addFormData.source" style="width: 330px;" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间" :label-width="'100px'">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 330px;"
                v-model="addFormData.newsDate"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作者" :label-width="'100px'">
              <el-input v-model="addFormData.author" style="width: 330px;" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" :label-width="'100px'">
              <el-switch
                v-model="addFormData.state"
                active-value="0"
                inactive-value="1"
                :active-color="'#13ce66'"
                :inactive-color="'#ff4949'"
                active-text="启用"
                inactive-text="禁用">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="" :label-width="'0px'">
            <el-checkbox v-model="addFormData.ifBan" style="margin-left: 62px;margin-right: 8px;">是否屏蔽企业
            </el-checkbox>
            <el-select v-model="addFormData.banCompany" v-show="addFormData.ifBan" class="w">
              <el-option v-for="item in companyList"
                         :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <!-- 图片上传组件辅助-->
        <el-upload
          class="avatar-uploader"
          v-show="false"
          :action="uploadUrl"
          :data="{'token':token}"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-row v-loading="quillUpdateImg">
          <quill-editor
            class="editor"
            v-model="addFormData.content"
            ref="myQuillEditor"
            @change="addEditorChange($event)"
            :options="editorOption">
          </quill-editor>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="editForm" :width="'1000px'" fullscreen>
      <el-form>
        <el-form-item label="标题" :label-width="'100px'">
          <el-input v-model="editFormData.title" class="w800" clearable></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="来源" :label-width="'100px'">
              <el-input v-model="editFormData.source" style="width: 330px;" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间" :label-width="'100px'">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 330px;"
                v-model="editFormData.newsDate"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作者" :label-width="'100px'">
              <el-input v-model="editFormData.author" style="width: 330px;" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" :label-width="'100px'">
              <el-switch
                v-model="editFormData.state"
                active-value="0"
                inactive-value="1"
                :active-color="'#13ce66'"
                :inactive-color="'#ff4949'"
                active-text="启用"
                inactive-text="禁用">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="" :label-width="'0px'">
            <el-checkbox v-model="editFormData.ifBan" style="margin-left: 62px;margin-right: 8px;">是否屏蔽企业
            </el-checkbox>
            <el-select v-model="editFormData.banCompany" v-show="editFormData.ifBan" class="w">
              <el-option v-for="item in companyList"
                         :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <!-- 图片上传组件辅助-->
        <el-upload
          class="avatar-uploader"
          v-show="false"
          :action="uploadUrl"
          :data="{'token':token}"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-row v-loading="quillUpdateImg">
          <quill-editor
            class="editor"
            v-model="editFormData.content"
            ref="myQuillEditor"
            @change="editEditorChange($event)"
            :options="editorOption">
          </quill-editor>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // 工具栏配置
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction

    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['link', 'image', 'video'],
    ['clean']                                         // remove formatting button
  ]

  export default {
    name: "ann",
    data() {
      return {
        token: null,
        // 富文本属性数据
        quillUpdateImg: false,
        uploadUrl: basePath + '/sys/file/upload',
        editorOption: {
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {   // 富文本编辑器配置
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    document.querySelector('.avatar-uploader input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        },

        addForm: false,
        editForm: false,
        companyList: [],
        addFormData: {
          title: "",
          source: "",
          newsDate: "",
          author: "",
          content: "",
          abst: "",
          type: 2,
          state: "",
          ifBan: false,
          banCompany: ""
        },
        editFormData: {
          id: "",
          title: "",
          source: "",
          newsDate: "",
          author: "",
          content: "",
          abst: "",
          type: 1,
          state: "",
          ifBan: false,
          banCompany: ""
        },
        tableHeigt: 0,
        tableData: null,
        searchName: "",
        currentPage: 1,
        pageSize: 20,
        total: 1,
        multipleSelection: [],
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        }
      }
    },
    created: function () {
      let self = this;
      self.$nextTick(function () {
        self.tableHeigt = document.body.firstElementChild.clientHeight - 234;
        self.token = localStorage.getItem('token');
        self.getData();

        self.$http.postForm("/sys/company/select").then(function (res) {
          let list = res.data.list;
          for (let i in list) {
            self.companyList.push({value: list[i].id + "", label: list[i].companyName});
          }
        });
      });
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    methods: {
      getData() {
        let self = this;
        let data = {
          searchName: self.searchName,
          currPage: self.currentPage,
          pageSize: self.pageSize,
          type: 2
        };
        self.$http.postForm("/sys/news/list", data).then(function (res) {
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
        this.addFormData = {
          title: "",
          source: "",
          newsDate: "",
          author: "",
          content: "",
          abst: "",
          type: 2,
          state: "",
          ifBan: false,
          banCompany: ""
        };
      },
      edit(row) {
        this.editForm = true;
        this.editFormData = row;

        if (row.ifBan == "true") {
          this.editFormData.ifBan = true;
        } else if (row.ifBan == "false") {
          this.editFormData.ifBan = false;
        }
      },
      dels() {
        let self = this;
        let ids = [];
        for (var i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        self.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/news/delete", ids.join(",")).then(function (res) {
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
      del(row) {
        let self = this;
        self.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post("/sys/news/delete", row.id).then(function (res) {
            if (res.data.code == 0) {
              self.editForm = false;
              self.getData();
              self.$message.success("删除成功");
            } else {
              self.$message.error(res.data.msg);
            }
          });
        }).catch(() => {
          self.$message.info('已取消删除');
        });
      },
      // 上传图片前
      beforeUpload(res, file) {
        // 显示loading动画
        this.quillUpdateImg = true
      },
      // 上传图片成功
      uploadSuccess(res, file) {
        // res为图片服务器返回的数据
        // 获取富文本组件实例
        let quill = this.$refs.myQuillEditor.quill
        // 如果上传成功
        if (res.code == 0) {
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  res.info为服务器返回的图片地址
          quill.insertEmbed(length, 'image', basePath + "/sys/file/getFileById?id=" + res.fileId);
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          this.$message.error('图片插入失败')
        }
        // loading动画消失
        this.quillUpdateImg = false
      },
      // 上传图片失败
      uploadError(res, file) {
        // loading动画消失
        this.quillUpdateImg = false
        this.$message.error('图片插入失败')
      },
      addEditorChange({quill, html, text}) {
        this.addFormData.abst = text;
      },
      editEditorChange({quill, html, text}) {
        this.editFormData.abst = text;
      },
      addSubmit() {
        let self = this;
        self.$http.post("/sys/news/save", self.addFormData).then(function (res) {
          if (res.data.code == 0) {
            self.addForm = false;
            self.getData();
            self.$message.success("添加成功");
          } else {
            self.$message.error(res.data.msg);
          }
        });
      },
      editSubmit() {
        let self = this;
        self.$http.post("/sys/news/update", self.editFormData).then(function (res) {
          if (res.data.code == 0) {
            self.editForm = false;
            self.getData();
            self.$message.success("修改成功");
          } else {
            self.$message.error(res.data.msg);
          }
        });
      }
    }
  }
</script>

<style scoped>
  @import "./../../css/info.css";
</style>
