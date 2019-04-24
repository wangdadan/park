<template>
  <div class="mcomplain">
    <mt-field class="cell" label="投诉标题" v-model="title" placeholder="问题描述"></mt-field>
    <mt-field class="cell" label="投诉内容" v-model="detail" type="textarea" rows="4" placeholder="详细说明"></mt-field>
    <mt-field class="cell photo" label="举证图片">
      <el-upload
        :action="uploadUrl"
        list-type="picture-card"
        :data="{'token':token}"
        :on-remove="imgRemove"
        :on-success="uploadSuccess">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </mt-field>
    <mt-button class="btn" type="primary" @click.native="submit">提交</mt-button>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: "mcomplain",
    data() {
      return {
        token: "",
        loading: false,
        point: "",
        address: "",
        title: "",
        detail: "",
        attach: "",
        uploadUrl: basePath + "/sys/file/upload",
        imageUrl: "",
        picList: [],
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    created() {
      this.$nextTick(function () {
        if (this.$route.query.s == "ios") {
          this.token = this.$route.query.token;
        } else {
          this.token = localStorage.getItem('token');
        }
      });
    },
    methods: {
      uploadSuccess(res, file) {
        this.picList.push(res.fileId);
      },
      imgRemove(file, fileList) {
        let i = this.picList.indexOf(file.response.fileId);
        this.picList.splice(i, 1);
      },
      submit() {
        let self = this;
        let params = {
          relatedId: self.$route.query.buildingCode,
          title: self.title,
          detail: self.detail,
          address: self.address,
          position: self.$route.query.position,
          attach: self.picList.join(",")
        }
        self.$http.post("/sys/complain/complain", params).then(function (res) {
          if (res.data.code == 0) {
            setTimeout(function () {
              self.$router.push("mcomplainlist");
            }, 1000);
            Toast("提交成功");
          } else {
            Toast(res.data.msg);
          }
        });
      }
    }
  }
</script>

<style scoped>
  .mcomplain {

  }

  .upload-img {
    margin: 10px 0;
  }

  .btn {
    display: block;
    width: 95%;
    background: #4986D6;
    margin: auto;
    margin-top: 40px;
  }
</style>
