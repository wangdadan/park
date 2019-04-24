import Vue from 'vue'
import Router from 'vue-router'
import front from '@/front'
import main from '@/components/main'
import home from '@/components/home'
import login from '@/login'
import redirect from '@/components/common/redirect'

import regionChart from '@/components/charts/regionChart'
import priceChart from '@/components/charts/priceChart'
import timeChart from '@/components/charts/timeChart'
import companyChart from '@/components/charts/companyChart'

import userman from '@/components/sys/userman'
import agencyman from '@/components/sys/agencyman'
import roleman from '@/components/sys/roleman'
import bannerman from '@/components/sys/bannerman'
import dictionary from '@/components/sys/dictionary'
import dataman from '@/components/sys/dataman'
import appman from '@/components/sys/appman'

import regionPol from '@/components/pol/regionPol'
import realPol from '@/components/pol/realPol'
import nationPol from '@/components/pol/nationPol'

import comregistered from '@/components/company/comregistered'
import comcheck from '@/components/company/comcheck'
import comblack from '@/components/company/comblack'
import comnew from '@/components/company/comnew'

import buildingInfo from '@/components/building/buildingInfo'

import news from '@/components/info/newsman'
import ann from '@/components/info/annman'

import advman from '@/components/adv/advman'
import advaud from '@/components/adv/advaud'
import historyman from '@/components/adv/historyman'

import chandle from '@/components/complaint/chandle'
import chistory from '@/components/complaint/chistory'
import invalid from '@/components/complaint/invalid'


import mmain from '@/components/m/mmain'
import mhome from '@/components/m/mhome'
import mnews from '@/components/m/mnews'
import mnotice from '@/components/m/mnotice'
import mmy from '@/components/m/mmy'
import mnewsdes from '@/components/m/mnewsdes'
import mnoticedes from '@/components/m/mnoticedes'
import mlogin from '@/components/m/mlogin'
import mregister from '@/components/m/mregister'
import mcomplainlist from '@/components/m/mcomplainlist'
import mcomplaindes from '@/components/m/mcomplaindes'
import madvinfo from '@/components/m/madvinfo'
import mmap from '@/components/m/mmap'
import mcomplain from '@/components/m/mcomplain'

Vue.use(Router)

let pcRouters = [
  {path: '/', redirect: {name: 'home'}},
  {path: '/home', name: 'home', component: home},
  {path: '/redirect', name: 'redirect', component: redirect},
  {path: '/userman', name: 'userman', component: userman},
  {path: '/agencyman', name: 'agencyman', component: agencyman},
  {path: '/roleman', name: 'roleman', component: roleman},
  {path: '/bannerman', name: 'bannerman', component: bannerman},
  {path: '/dictionary', name: 'dictionary', component: dictionary},
  {path: '/dataman', name: 'dataman', component: dataman},
  {path: '/appman', name: 'appman', component: appman},

  {path: '/comregistered', name: 'comregistered', component: comregistered},
  {path: '/comcheck', name: 'comcheck', component: comcheck},
  {path: '/comblack', name: 'comblack', component: comblack},
  {path: '/comnew', name: 'comnew', component: comnew},

  {path: '/buildingInfo', name: 'buildingInfo', component: buildingInfo},

  {path: '/news', name: 'news', component: news},
  {path: '/ann', name: 'ann', component: ann},

  {path: '/advman', name: 'advman', component: advman},
  {path: '/advaud', name: 'advaud', component: advaud},
  {path: '/historyman', name: 'historyman', component: historyman},

  {path: '/chandle', name: 'chandle', component: chandle},
  {path: '/chistory', name: 'chistory', component: chistory},
  {path: '/invalid', name: 'invalid', component: invalid},

  {path: '/regionPol', name: 'regionPol', component: regionPol},
  {path: '/realPol', name: 'realPol', component: realPol},
  {path: '/nationPol', name: 'nationPol', component: nationPol},

  {path: '/regionChart', name: 'regionChart', component: regionChart},
  {path: '/priceChart', name: 'priceChart', component: priceChart},
  {path: '/timeChart', name: 'timeChart', component: timeChart},
  {path: '/companyChart', name: 'companyChart', component: companyChart}
]

let mRouters = [
  {path: '/', redirect: {name: 'mnews'}},
  {path: '/mhome', name: 'mhome', component: mhome},
  {path: '/mnews', name: 'mnews', component: mnews},
  {path: '/mnotice', name: 'mnotice', component: mnotice},
  {path: '/mmy', name: 'mmy', component: mmy},
  {path: '/mnewsdes', name: 'mnewsdes', component: mnewsdes},
  {path: '/mnoticedes', name: 'mnoticedes', component: mnoticedes},
  {path: '/mlogin', name: 'mlogin', component: mlogin},
  {path: '/mregister', name: 'mregister', component: mregister},
  {path: '/mcomplainlist', name: 'mcomplainlist', component: mcomplainlist},
  {path: '/mcomplaindes', name: 'mcomplaindes', component: mcomplaindes},
  {path: '/madvinfo', name: 'madvinfo', component: madvinfo},
  {path: '/mmap', name: 'mmap', component: mmap},
  {path: '/mcomplain', name: 'mcomplain', component: mcomplain}
]

export default new Router({
  routes: [
    // pc端
    {path: '/', redirect: {name: 'front'}},
    // {path: '*', redirect: {name: 'login'}},
    {path: '/front', name: 'front', component: front},
    {path: '/login', name: 'login', component: login},
    {path: '/main/', component: main, children: pcRouters},
    // 移动端
    {path: '/mmain/', component: mmain, children: mRouters},
  ]
})
