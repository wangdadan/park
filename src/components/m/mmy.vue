<template>
  <div class="mmy">
    <mt-popup class="popup" v-model="isPopup" :modal="false" popup-transition="popup-fade" position="top">更新失败
    </mt-popup>
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false"
                 ref="loadmore">
      <ul>
        <li class="item" @click="jump(i)" :key="i.id" v-for="i in list">
          <span class="title">{{i.name}}</span>
          <span class="time">{{i.createTime.slice(0, 10)}}</span>
        </li>
      </ul>
    </mt-loadmore>
  </div>
</template>

<script>
  export default {
    name: "mmy",
    data() {
      return {
        isPopup: false,
        currentPage: 1,
        list: [],
        allLoaded: false
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData(callback) {
        let self = this;
        let data = {
          currPage: self.currentPage,
          pageSize: 10,
          type: 2
        };
        self.$http.post("/sys/law/frontList", data).then(function (res) {
          if (res.data.code == 0) {
            if (callback != undefined) callback();
            let list = res.data.page.list;
            if (list.length > 0) {
              for (let i in list) {
                self.list.push(list[i]);
              }
              self.currentPage++;
            } else {
              self.allLoaded = true;// 若数据已全部获取完毕
              self.$refs.loadmore.onBottomLoaded();
            }
          } else if (res.data.code == 401) {
            self.$router.push({path: 'mlogin'});
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
      loadBottom() {
        let self = this;
        self.getData();
      },
      jump(o) {
        try{
          window.Android.getFileDate( o.id,o.name);
        }catch(e){
          window.location.href = "getFile://"+o.id+"&"+o.name;
        }
      }
    }
  }
</script>

<style scoped>
  ul {
    padding: 0px 15px;
    background: #fff;
  }

  .item {
    padding: 20px 0;
    border-bottom: 1px solid #E6E6E6;
    display: flex;
    justify-content: space-between;
    line-height: 20px;
  }

  .title {
    color: #333;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .time {
    color: #999;
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
