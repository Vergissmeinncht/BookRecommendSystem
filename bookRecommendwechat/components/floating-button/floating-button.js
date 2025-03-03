Component({
  data: {
    buttonTop:50, // 按钮的初始顶部位置
    buttonLeft: 270, // 按钮的初始左侧位置
    windowHeight: 50, // 窗口高度
    windowWidth: 50, // 窗口宽度
  },
  onLoad: function() {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          buttonTop: res.windowHeight - 60, // 假设按钮高度为50px，底部留10px边距
          buttonLeft: res.windowWidth - 60, // 假设按钮宽度为50px，右侧留10px边距
        });
      }
    });
  },
  methods: {
    buttonStart: function(e) {
      this.setData({
        buttonStartY: e.touches[0].pageY,
      });
    },
    buttonMove: function(e) {
      let buttonTop = e.touches[0].pageY - this.data.buttonStartY + this.data.buttonTop;
      
      // 防止按钮移出屏幕顶部和底部
      if (buttonTop < 0) buttonTop = 0;
      if (buttonTop > this.data.windowHeight - 50) buttonTop = this.data.windowHeight - 50;
    
      this.setData({
        buttonTop: buttonTop,
      });
    },
    buttonEnd: function(e) {
      // 不需要修改按钮的左侧位置，因为我们希望它固定在右侧
    },
    goToPage: function() {
      wx.navigateTo({
        url: '/pages/AI-recommend/AI-recommend', // 修改为你要跳转的页面路径
      });
    }
  }
});
