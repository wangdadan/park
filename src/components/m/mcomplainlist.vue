<template>
  <div class="mcomplainlist">
    <div class="list" v-for="item in list" @click="jump(item.id)">
      <p class="title">{{item.title}}</p>
      <div class="bottom">
        {{item.state == 0 ? '未受理' : (item.state == 1 ? '已受理' : (item.state == 4 ? '不受理' : (item.state == 9 ? '已办结' : '')))}}<span></span><span>{{item.time}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: "mcomplaintlist",
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
        self.$http.get("/sys/complain/myList").then(function (res) {
          if (res.data.code == 0) {
            self.list = res.data.list;
          } else {
            Toast(res.data.msg);
          }
        });
      },
      jump(id) {
        this.$router.push({name: "mcomplaindes", query: {id: id}});
      }
    }
  }
</script>

<style scoped>
  .mcomplainlist {
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

  .list:nth-child(1) {
    border-top: none;
  }

  .list {
    cursor: pointer;
    color: #333;
    padding: 10px 0;
    border-top: 1px solid #E6E6E6;
  }

  .title {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 8px 0;
  }

  .bottom {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    color: #666;
  }
</style>
