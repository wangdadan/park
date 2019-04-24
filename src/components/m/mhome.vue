<template>
  <div class="mhome">
    <mt-popup class="popup" v-model="isPopup" :modal="false" popup-transition="popup-fade" position="top">
      更新失败
    </mt-popup>
    <div class="bannercon">
      <mt-swipe :auto="3000">
        <mt-swipe-item class="banner" :key="1">
          <div class="banner1"></div>
        </mt-swipe-item>
        <mt-swipe-item class="banner" :key="2">
          <div class="banner2"></div>
        </mt-swipe-item>
        <mt-swipe-item class="banner" :key="3">
          <div class="banner3"></div>
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <mt-loadmore :top-method="loadTop" ref="loadmore">
      <ul>
        <li class="item" @click="jump(i.id)" :key="i.id" v-for="i in list">
          <p class="title">{{i.title}}</p>
          <p class="content">{{i.abst}}</p>
          <p class="type"><span>{{i.type == 1 ? "新闻" : "公告"}}</span><span>{{i.newsDate}}</span></p>
        </li>
      </ul>
    </mt-loadmore>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: "mhome",
    data() {
      return {
        bannerImgH: "",
        isPopup: false,
        list: []
      }
    },
    created() {
      this.$nextTick(function () {
        this.getData();
      });
    },
    methods: {
      getData(callback) {
        let self = this;
        let data = {
          currPage: 1,
          pageSize: 10
        };
        self.$http.post("/sys/news/frontList", data).then(function (res) {
          if (res.data.code == 0) {
            if (callback != undefined) callback();
            self.list = res.data.page.list;
          } else {
            self.isPopup = true;
            setTimeout(function () {
              self.isPopup = false;
            }, 1000);
          }
        });
      },
      loadTop() {
        let self = this;
        self.getData(function () {
          self.$refs.loadmore.onTopLoaded();
        });
      },
      jump(id) {
        this.$router.push({name: "mnewsdes", params: {id: id}});
      }
    }
  }
</script>

<style scoped>
  .mhome {
    height: 100%;
    background: #F1F2F6;
  }

  .bannercon {
    height: 150px;
    overflow: auto;
  }

  .banner {
    height: 150px;
  }

  ul {
    padding: 0px 15px;
    background: #fff;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .item {
    padding: 20px 0;
    border-bottom: 1px solid #E6E6E6;
  }

  .title {
    color: #333;
    font-size: 16px;
    margin-bottom: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .content {
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
  }

  .type {
    margin-top: 20px;
    color: #999;
    display: flex;
    justify-content: space-between;
  }

  .banner1, .banner2, .banner3 {
    width: 100%;
    height: 100%;
  }

  .banner1 {
    background: url("./../../assets/images/banner1.jpg") center;
    -webkit-background-size: cover;
    background-size: cover;
  }

  .banner2 {
    background: url("./../../assets/images/banner2.jpg") center;
    -webkit-background-size: cover;
    background-size: cover;
  }

  .banner3 {
    background: url("./../../assets/images/banner3.jpg") center;
    -webkit-background-size: cover;
    background-size: cover;
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
