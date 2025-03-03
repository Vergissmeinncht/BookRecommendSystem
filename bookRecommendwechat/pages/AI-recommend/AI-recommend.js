// pages/gpt-chat/gpt-chat.js
const plugin = requirePlugin('WechatSI');

const manager = plugin.getRecordRecognitionManager();
Page({

  data: {
    inputText: '', // 用户输入的文本
    chatHistory: [], // 聊天记录
    isRecording: false, // 录音状态标志
    recordState: 0, 
  },
  onInputChange: function(e) {
    this.setData({
      inputText: e.detail.value
    });
  },
  onSend: function() {
    if (!wx.cloud) {
      console.error('请确保在 app.js 中已调用 wx.cloud.init() 初始化云环境');
    }
    const inputText = this.data.inputText.trim();
    if (!inputText) {
      return;
    }
    const chatHistory = this.data.chatHistory;
    chatHistory.push({ text: inputText, isUser: true, avatar: '../../images/user/admin.png', nickname: 'User' });
    this.setData({
      chatHistory,
      inputText: '',
      scrollToView: 'msg_' + (chatHistory.length - 1) // 设置滚动到最新消息的 ID
    });
    this.callGPT4API(inputText);
  },

  sendQuestion: function(event) {
    const question = event.currentTarget.dataset.question;
    this.setData({
      inputText: question // 设置输入框的文本为按钮上的问题
    });
    this.onSend(); // 调用现有的 onSend 方法发送问题
  },

  callGPT4API: function(inputText) {
    const that = this;
    wx.request({
      url: 'https://api.chatanywhere.com.cn/v1/chat/completions', 
      method: 'POST',
      data: {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: inputText }
        ],
      },
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-mjyGjH2sS4eT4WBYklhTdmTd86fjp3XNMox59NpSRpEyKlrk' // 替换为你的 API 密钥
      },
      success: function(res) {
        if (res.data && res.data.choices && res.data.choices.length > 0) {
          const responseText = res.data.choices[0].message.content.trim();
          const chatHistory = that.data.chatHistory;
          chatHistory.push({ text: responseText, isUser: false, avatar: '../../images/AI-recommend/ChatGPT.png', nickname: 'AI' });
          that.setData({ chatHistory });
          wx.request({
            url: getApp().globalData.url + 'api-record-book-recommend',
            data: {
              userId: getApp().globalData.user.userId,
              content: responseText
            },
            method: 'GET'
        })
      }
    },
      fail: function(err) {
        console.error('API 调用失败:', err);
      }
    });
  },

  onPlayText: function() {
    const that = this;
    const fs = wx.getFileSystemManager();
    const mp3Url = `${wx.env.USER_DATA_PATH}/tts.mp3`;

    wx.cloud.callFunction({
      name: 'texttospeech',
      data: {
        text: this.data.chatHistory[this.data.chatHistory.length - 1].text
      },
      success: function(res) {
        console.log('云函数调用成功', res);
        const buffer = res.result.ansBuffer; // 假设这里返回的是 {type: "Buffer", data: Array}
        fs.writeFile({
          filePath: mp3Url,
          data: buffer,
          success: function() {
            console.log('文件写入成功');
            that.playAudio(mp3Url);
          },
          fail: function(error) {
            console.error('文件写入失败:', error);
          }
        });
      },
      fail: function(err) {
        console.error('云函数调用失败:', err);
      }
    });
  },

  // 播放音频的辅助函数
  playAudio: function(mp3Url) {
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = mp3Url;
    innerAudioContext.onPlay(() => {
      console.log('开始播放');
    });
    innerAudioContext.onError((res) => {
      console.error('播放失败:', res.errMsg);
    });
    innerAudioContext.play();
  },

  onLoad: function(options) {
    this.initRecord();
    // 添加智能推荐小助手的欢迎消息
  const initialMessage = {
    text: '我是智能推荐小助手，有什么需要我帮助的吗？',
    isUser: false,
    avatar: '../../images/AI-recommend/ChatGPT.png', // 请确保路径正确
    nickname: 'AI'
  };
  this.data.chatHistory.push(initialMessage); // 将消息加入聊天历史
  this.setData({ 
    chatHistory: this.data.chatHistory
  });
  },
  // 点击按钮触发的方法
toggleRecording() {
  if (this.data.isRecording) {
    this.manager.stop(); // 如果正在录音，则停止
  } else {
    this.manager.start({
      duration: 30000, // 最长录音时间，单位 ms
      lang: 'zh_CN'
    }); // 如果不在录音，则开始
  }
},

initRecord: function() {
  const that = this;
  this.manager = plugin.getRecordRecognitionManager();

  this.manager.onRecognize = function(res) {
    console.log('识别结果：', res);
  };

  this.manager.onStop = function(res) {
    console.log('结束录音', res);
    if (res.result === '') { // 修改条件判断
      wx.showModal({
        title: '提示',
        content: '听不清楚，请重新说一遍！',
        showCancel: false
      });
      return;
    }
    that.setData({
      inputText: res.result,
      isRecording: false // 更新录音状态
    });
  };

  this.manager.onStart = () => {
    console.log('开始录音');
    that.setData({ isRecording: true }); // 更新录音状态
  };

  this.manager.onError = (err) => {
    console.error('录音错误', err);
    that.setData({ isRecording: false }); // 更新录音状态
    wx.showToast({
      title: '录音错误，请重试',
      icon: 'none'
    });
  };
}
});