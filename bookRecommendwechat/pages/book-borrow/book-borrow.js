// pages/book-borrow/book-borrow.js
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
Page({
  data:{
    codeShow: false,
    progress: true,
    title: "加载中",
    borrowId: 0,
    errorMsg: "",
    credit: 80
  },
  onLoad:function(options){
    var that = this;
    var bookId = options.id;
    var userId = getApp().globalData.user.userId;
    var userCredit = getApp().globalData.user.userCredit;
    this.setData({credit: userCredit});
    wx.request({
      url: `${getApp().globalData.url}api-scan-borrow-book/${userId}/${bookId}`,
      data: {},
      method: 'GET',
      success: function (res) {
        that.setData({borrowId: res.data});
      }
    })    
    var that = this;
    setTimeout(function() {
      that.setData({codeShow: true, progress: false, title: "请向管理员出示下方的借书码", 
        errorMsg: "借书错误！请检查该书是否已被借阅或已超出借书上限"});
        var timer = setInterval(function() {
          wx.request({
            url: `${getApp().globalData.url}api-scan-borrow-byid/${that.data.borrowId}`,
            data: {},
            method: 'GET',
            success: function (res) {
              if (res.data.borrowStatus == 1) {
                clearTimeout(timer);
                wx.showToast({
                  title: '借书成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 2
                  })
                }, 2000)
              }
            },
            fail: function(err) {
              console.error('请求失败：', err);
            }
          })
        }, 1000)
        drawQrcode({
      
          width: 200, // 必须，二维码宽度，与canvas的width保持一致
          
          height: 200, // 必须，二维码高度，与canvas的height保持一致
         
          canvasId: 'myQrcode',
          
          background:'#ffffff', //	非必须，二维码背景颜色，默认值白色
          
          foreground: '#000000', // 非必须，二维码前景色，默认值黑色 	'#000000'
          
          // ctx: wx.createCanvasContext('myQrcode'), // 非必须，绘图上下文，可通过 wx.createCanvasContext('canvasId') 获取，v1.0.0+版本支持
          
          text: 'book-mate-borrow-id:'+that.data.borrowId,  // 必须，二维码内容
          // v1.0.0+版本支持在二维码上绘制图片
    
          image: {
            // imageResource: '../../images/icon.png', // 指定二维码小图标
            dx: 70,
            dy: 70,
            dWidth: 60,
            dHeight: 60
          }
        })
    }, 4000)
  },
  onSave(res) {
    const { value } = res.currentTarget.dataset
    wx.canvasToTempFilePath({
      canvasId: value,
      success: (res) => {
        const tempFilePath = res.tempFilePath;
        // 保存二维码到系统相册
        this.saveImg(tempFilePath);
      },
      fail: function(err) {
        console.log(err);
      }
    });
  },
  saveImg(tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: function (res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: function (err) {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    });
  }
})