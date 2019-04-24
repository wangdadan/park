<template>
  <div class="madvinfo">
    <div class="imgcon">
      <img :src="imgUrl+'?id='+data.attach" alt="">
    </div>
    <mt-cell class="cell" title="受理编号" :value="data.acceptanceNo"></mt-cell>
    <mt-cell class="cell" title="停车场编号" :value="data.parkNo"></mt-cell>
    <mt-cell class="cell" title="备案号" :value="data.recordNo"></mt-cell>
    <mt-cell class="cell" title="停车场名称" :value="data.name"></mt-cell>
    <mt-cell class="cell" title="停车场地址" :value="data.address"></mt-cell>
    <mt-cell class="cell" title="行政区域" :value="data.street"></mt-cell>
    <mt-cell class="cell" title="停车场类别" :value="data.parkType"></mt-cell>
    <mt-cell class="cell" title="经营企业" :value="data.manageCompany"></mt-cell>
    <mt-cell class="cell" title="联系人" :value="data.contract"></mt-cell>
    <mt-cell class="cell" title="电话" :value="data.phone"></mt-cell>
    <mt-cell class="cell" title="车位数" :value="data.totalNum"></mt-cell>
    <mt-cell class="cell" title="车位编号" :value="data.parkingNo"></mt-cell>
    <mt-cell class="cell" title="核准时间" :value="data.approvalTime"></mt-cell>
    <mt-cell class="cell" title="营业时间" :value="data.businessHoursName"></mt-cell>
    <mt-cell class="cell" title="收费标准">
      <span v-html="data.charges" style="text-align: right;padding: 6px 0;"></span>
    </mt-cell>
    <a class="btn" href="tel:12358">去投诉</a>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: "madvinfo",
    data() {
      return {
        data: {},
        imgUrl: basePath + '/sys/file/getFileById',
        uploadUrl: "",
        editImgList: [],
        editPhotoList: [],
        dialogImageUrl: "",
        dialogVisible: false
      }
    },
    created() {
      let self = this;
      self.$http.get("/sys/park/frontInfo/" + self.$route.query.id).then(function (res) {
        if (res.data.code == 0) {
          self.data = res.data.sysPark;
        } else {
          Toast(res.data.msg);
        }
      });
    },
    methods: {
      handleClick() {
      }
    }
  }
</script>

<style scoped>
  .btn {
    display: block;
    color: #fff;
    text-decoration: none;
    width: 95%;
    background: #4986D6;
    margin: 40px auto;
    text-align: center;
    height: 40px;
    line-height: 40px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }

  .imgcon {
    background: #fff;
    min-height: 160px;
    padding: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .imgcon img {
    width: 100%;
  }
</style>
