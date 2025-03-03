var guiCode = require('../../utils/guiCode.js');
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
    this.formSubmit = this.formSubmit.bind(this);
    console.log(this.guiCode);
    let errorStatus = option.errorStatus;
    if (errorStatus == 1) {
      this.setData({ errorStatus: 1 });
    }
  },
  bindinput() {},
  /**
     * 刷新图形验证码
     */
  guiCodeTap() {
      this.guiCode.refresh()
  },

  formSubmit: function(e){
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
      url: getApp().globalData.url + 'api-scan-admin-login',
      data: { name: e.detail.value.username, password: e.detail.value.password,guiCode: guiCode },
      method: 'GET',
      success: function (res) {
        if (res.data.adminId != null) {
          console.log(res.data);
          //登录成功
          //微信端登录
          var app = getApp();
          app.getUserInfo();
          getApp().globalData.admin = res.data;
          wx.redirectTo({
            url: '/pages/scan-main/scan-main'
          })
        } else {
          //登录失败
          wx.redirectTo({
            url: '/pages/scan-login/scan-login?errorStatus=1'
          })
        }
      }
    });
  },
  returnIndexBtn: function(){
    wx.redirectTo({
      url: '/pages/scan-index/scan-index'
    })
  }
})