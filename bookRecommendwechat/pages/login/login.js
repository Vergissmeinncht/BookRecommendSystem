// pages/login/login.js

const guiCode = require('../../utils/guiCode.js');

Page({
  data: {
    errorStatus: 0,
    guiCode: ''
  },
  onLoad: function (option) {
    this.guiCode = new guiCode({
      el: '#guiCodeCanvas',
      width: 70,
      height: 50,
      createCodeImg: ""
    });
    console.log(this.guiCode);
    this.formSubmit = this.formSubmit.bind(this); 
    let errorStatus = option.errorStatus;
    if (errorStatus == 1) {
      this.setData({
        errorStatus: 1
      });
    }
  },

  bindinput() {},
  /**
   * 刷新图形验证码
   */
  guiCodeTap() {
    this.guiCode.refresh()
  },

  /**
   * 使用普通函数来确保可以使用.bind绑定this
   */
  formSubmit: function(e) {
    const guiCode = e.detail.value.guiCode;
    console.log(guiCode);
    if (!guiCode) {
      wx.showToast({
        title: '请输入图形验证码',
        icon: 'none'
      });
      return;
    }
    let res = this.guiCode.validate(guiCode);
    if (!res) {
      wx.showToast({
        title: '图形验证码错误',
        icon: 'none'
      });
      this.guiCode.refresh();
      return;
    }
    wx.request({
      url: getApp().globalData.url + 'api-user-login',
      data: {
        username: e.detail.value.username,
        password: e.detail.value.password
      },
      method: 'GET',
      success: function (res) {
        if (res.data.userId != null) {
          console.log(res.data);
          //登录成功
          var app = getApp();
          app.getUserInfo();
          getApp().globalData.user = res.data;
          wx.switchTab({
            url: '/pages/main/main'
          });
        } else {
          //登录失败
          wx.redirectTo({
            url: '/pages/login/login?errorStatus=1'
          });
        }
      }
    });
  },
  navBtnOnClick: function() {
    wx.redirectTo({
      url: '/pages/register/register'
    });
  },
  forgetBtnOnClick:function(){
    wx.redirectTo({
      url: '/pages/user-forget/user-forget',
    })
  }

});
