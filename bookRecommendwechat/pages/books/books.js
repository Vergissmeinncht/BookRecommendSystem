// pages/books/books.js
Page({
  data: {
    classifyOnes: {}
  },
  onLoad: function () {
    if (getApp().globalData.user.userCredit >= 90) {
      wx.setNavigationBarTitle({ title: '图书推荐系统' });
    }
    var that = this;
    wx.request({
      url: getApp().globalData.url + 'api-book-classifyone-all',
      data: {},
      method: 'GET',
      success: function (res) {
        that.setData({ classifyOnes: res.data });
      }
    })
  },
  scanBtnOnClick: function () {
    wx.scanCode({
      success: function (res) {
        var msg = JSON.stringify(res.result);
        if (msg.indexOf("book-Recommend-book-id:") != -1) {
          var bookId = msg.replace("book-Recommend-book-id:", "");
          var reg = new RegExp('"',"g");  
          bookId = bookId.replace(reg, "");  
          wx.navigateTo({
            url: '/pages/book-detail/book-detail?scanCode=1&id=' + bookId
          })
        }
      }
    })
  },
  booksListBtn: function (e) {
    var name = e.target.dataset.name;
    wx.navigateTo({
      url: '/pages/books-list/books-list?classifyone=' + name
    })
  },
  changeInput: function(e) {
    var search = e.detail.value;
    if (search != "") {
      wx.navigateTo({
        url: '/pages/books-search/books-search?search=' + search,
      })
    }
  }
})