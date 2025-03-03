// pages/books-list/books-list.js
Page({
  data:{
      books: {}
    },
  onLoad: function(options) {
    var classifyOne = options.classifyone;
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: getApp().globalData.url + 'api-book-book-byclassifyone/' + classifyOne,
      data: {},
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
  }
})