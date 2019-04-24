import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    sys: {
      roleId: 0,
      switchRoleMan: true,
      roleIdMan: null
    },
    nav: {
      isCollapse: false,
      index: "1",
      list: {
        home: "1",

        historyman: "2-1",
        advaud: "2-2",
        advman: "2-3",

        comregistered: "3-1",
        comcheck: "3-2",
        comblack: "3-3",
        comnew: "3-4",

        buildingInfo: "4-1",

        chandle: "5-1",
        chistory: "5-2",
        invalid: "5-3",

        news: "6-1",
        ann: "6-2",

        userman: "7-1",
        // agencyman: "7-2",
        roleman: "7-2",
        dictionary: "7-4",
        dataman: "7-5",
        appman: "7-6",

        regionChart: "8-1",
        priceChart: "8-2",
        timeChart: "8-3",
        companyChart: "8-4",

        regionPol: "9-1",
        realPol: "9-2",
        nationPol: "9-3"
      },
      name: {
        home: "首页",

        historyman: "停车价格管理-价格备案管理",
        advaud: "停车价格管理-待审核库",
        advman: "停车价格管理-待提交库",

        comregistered: "企业管理-已登记企业",
        comcheck: "企业管理-待审核企业",
        comblack: "企业管理-企业黑名单",
        comnew: "企业管理-待提交企业",

        buildingInfo: "载体管理-广告载体",

        chandle: "举报投诉管理-待处理案件",
        chistory: "举报投诉管理-已办结案件",
        invalid: "举报投诉管理-无效案件",

        news: "新闻公告-行业新闻",
        ann: "新闻公告-通知公告",

        regionPol: "政策法规-区级政策",
        realPol: "政策法规-市级政策",
        nationPol: "政策法规-国家政策",
        userman: "系统管理-后台用户管理",

        agencyman: "系统管理-行政区划",
        roleman: "系统管理-角色权限管理",
        bannerman: "系统管理-轮播图管理",
        dictionary: "系统管理-字典管理",
        dataman:"系统管理-数据交换",
        appman:"系统管理-APP维护",

        regionChart: "统计分析-区域统计",
        priceChart: "统计分析-价格统计",
        timeChart: "统计分析-时间统计",
        companyChart: "统计分析-企业统计",
      }
    },
    m_home: {
      navName: "mhome",
      bodyH: window.screen.height - 50 - 50,
      bodyH0: window.screen.height - 50
    }
  },
  mutations: {
    setRoleId(state, id) {
      state.sys.roleId = id;
    },
    switchRoleMan(state, id) {
      state.sys.switchRoleMan = !state.sys.switchRoleMan;
      state.sys.roleIdMan = id;
    },
    navSwitch(state) {
      state.nav.isCollapse = !state.nav.isCollapse;
    },
    navIndex(state, index) {
      state.nav.index = index;
    },
    m_navName(name) {
      state.m_home.navName = name;
    }
  }
})

export default store
