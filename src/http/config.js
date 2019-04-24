'use strict'

import axios from 'axios'
import qs from 'qs'
import {Message, Loading} from 'element-ui'

// var loadingInstance
axios.interceptors.request.use(config => {    // 这里的config包含每次请求的内容
  // loadingInstance = Loading.service({
  //   lock: true,
  //   text: '数据加载中，请稍后...',
  //   spinner: 'el-icon-loading',
  //   background: 'rgba(0, 0, 0, 0.6)'
  // });
  //  存在将token写入 request header

  if (location.hash.replace("#/", "")[0] == "m") {
    if (location.href.indexOf("s=ios") != -1) {
      var a = location.href;
      config.headers.token = a.substring(a.indexOf("token") / 1 + 6, a.indexOf("s=ios") - 1);
    } else {
      if (localStorage.getItem('token')) {
        config.headers.token = localStorage.getItem('token');
      }
    }
  } else {
    if (localStorage.getItem('token')) {
      config.headers.token = localStorage.getItem('token');
    }
  }
  return config;
}, err => {
  return Promise.reject(err);
});

axios.interceptors.response.use(response => {
  // loadingInstance.close()
  return response
}, error => {
  return Promise.resolve(error.response)
});

function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 ||
      response.status === 400)) {
    return response
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  // alert(response.status)
  if (res.status === -404) {
    Message.error('请求失败，请刷新后再试')
  }
  if (res.data.code == 401) {
    console.log("登录已过期，请重新登录");
    if (location.href.indexOf("mmy") == -1) {
      if (location.hash.replace("#/", "")[0] == "m") {
        var str = location.href.split("?")[1];
        location.href = location.origin + "/#/mlogin" + (str == undefined ? "" : "?" + str);
      } else if (location.hash != "#/login") {
        location.href = location.origin + "/#/front";
      }
    }
  }
  if (res.data && (!res.data.success)) {
    // alert(res.data.error_msg)
  }
  return res
}

// 请求方式的配置
export default {
  post(url, data) {  //  post
    return axios({
      method: 'post',
      baseURL: '/api',
      url,
      // data: qs.stringify(data),
      data: data,
      timeout: 20000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8'
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  postForm(url, data) {  //  post
    return axios({
      method: 'post',
      baseURL: '/api',
      url,
      data: qs.stringify(data),
      timeout: 20000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get(url, params) {  // get
    return axios({
      method: 'get',
      baseURL: '/api',
      url,
      params, // get 请求时带的参数
      timeout: 20000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
