// pages/user-recommend/user-recommend.js
Page({
  data: {
    books: {}
  },

  onLoad: function(options) {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: getApp().globalData.url + 'api-user-recommended-history',
      data: {userId: getApp().globalData.user.userId},
      method: 'GET',
      success: function(res){
        that.setData({books: res.data});
        console.log(res.data);
      }
    })
    wx.hideNavigationBarLoading();
  },
  bookDetailBtn: function (event) {
    var bookId = event.currentTarget.id;
    wx.navigateTo({
      url: '/pages/book-detail/book-detail?scanCode=0&id=' + bookId
    })
  },
  deleteBtn: function(event) {
    var bookId = event.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '确认删除吗?',
      confirmColor: '#4db6ac',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + "api-user-remove-recommend",
            data: {bookId:bookId,userId:getApp().globalData.user.userId},
            method: 'GET',
            success: function (res) {
              wx.redirectTo({
                url: '/pages/user-recommend/user-recommend'
              })
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  }
})