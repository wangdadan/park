<template>
  <div class="mnoticedes">
    <mt-popup class="popup" v-model="isPopup" :modal="false" popup-transition="popup-fade" position="top">获取数据失败
    </mt-popup>
    <p class="title">{{data.title}}</p>
    <div class="info">
      <span>公告</span><span>{{data.newsDate}}</span>
    </div>
    <div class="text ql-editor" v-html="data.content"></div>
  </div>
</template>

<script>
  export default {
    name: "mnoticedes",
    data() {
      return {
        isPopup: false,
        data: {}
      }
    },
    created: function () {
      let self = this;
      self.$http.get("/sys/news/info/" + self.$route.params.id).then(function (res) {
        if (res.data.code == 0) {
          self.data = res.data.sysNews;
        } else {
          self.isPopup = true;
          setTimeout(function () {
            self.isPopup = false;
          }, 1000);
        }
      });
    }
  }
</script>

<style scoped>
  @import "../../assets/editor.css";

  .mnoticedes {
    padding: 30px 15px;
    background: #fff;
  }

  .title {
    font-size: 18px;
    color: #333;
  }

  .info {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .text {
    margin-top: 20px;
  }

  .popup {
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: #fff;
    background: rgba(0, 0, 0, .8);
  }
</style>
