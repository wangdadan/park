<template>
  <div class="mcomplaindes">
    <div class="item" v-for="i in list">
      <div class="date"><i class="cicle"></i>{{i.time}}<span
        class="state">状态：{{i.state == 0 ? '未处理' : (i.state == 1 ? '已接收' : (i.state == 4 ? '未接受' : '处理结束'))}}</span>
      </div>
      <div class="info">{{i.detail}}</div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: "mcomplaindes",
    data() {
      return {
        list: []
      }
    },
    created() {
      let self = this;
      self.$nextTick(function () {
        self.getData();
      });
    },
    methods: {
      getData() {
        let self = this;
        self.$http.post("/sys/complain/dealList", {id: self.$route.query.id}).then(function (res) {
          if (res.data.code == 0) {
            self.list = res.data.list;
          } else {
            Toast(res.data.msg);
          }
        });
      },
    }
  }
</script>

<style scoped>
  .mcomplaindes {
    background: #fff;
    padding: 20px;
  }

  .date {
    font-weight: bold;
    position: relative;
    padding-left: 20px;
  }

  .state {
    float: right;
    font-size: 12px;
  }

  .cicle {
    display: block;
    border: 1px solid #5A93DA;
    border-radius: 50%;
    width: 13px;
    height: 13px;
    position: absolute;
    left: 0;
    top: 2px;
  }

  .info {
    padding: 20px 0;
    padding-left: 20px;
    margin-left: 6px;
    margin-top: -2px;
    border-left: 1px solid #ccc;
  }
</style>
