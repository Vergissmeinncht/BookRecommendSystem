// 引入必要的库
const cloud = require('wx-server-sdk');
const WebSocket = require('ws');
const crypto = require('crypto');

// 初始化云环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 适用于多环境
});

// 讯飞语音听写流式 API 配置
const APPID = 'ade89b80';
const API_KEY = '8b0cdb0970155355f037dd96d7f23996';
const API_SECRET = 'MWVhNWM3MmVhZjk4ZTMzZDk4OGUyYzZi';

// 构建 WebSocket URL，并进行鉴权
async function buildWebSocketUrl() {
  const date = new Date().toUTCString();
  const host = 'iat-api.xfyun.cn';
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
  const signatureSha = crypto.createHmac('sha256', API_SECRET).update(signatureOrigin).digest('base64');
  const authorizationOrigin = `api_key="${API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`;
  const authorization = Buffer.from(authorizationOrigin).toString('base64');
  const url = `wss://iat-api.xfyun.cn/v2/iat?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${host}`;

  return url;
}

// WebSocket 连接并发送音频数据
async function startWebSocketConnection(base64Audio) {
  const url = await buildWebSocketUrl();
  const ws = new WebSocket(url);
  const audioBuffer = Buffer.from(base64Audio, 'base64');
  const frameSize = 1280; // 根据API文档，设定每帧的字节大小
  let frameInterval = 40; // 发送间隔，40ms

  return new Promise((resolve, reject) => {
      ws.on('open', () => {
          console.log('WebSocket连接已打开。');
          let index = 0;
          const intervalId = setInterval(() => {
              if (index >= audioBuffer.length) {
                  clearInterval(intervalId);
                  ws.send(JSON.stringify({
                      "common": { "app_id": APPID },
                      "business": { "language": "zh_cn", "domain": "iat" },
                      "data": {
                          "status": 2,  // 最后一帧
                          "format": "audio/L16;rate=16000",
                          "encoding": "raw",  // PCM格式使用raw
                          "audio": ""
                      }
                  }));
                  return;
              }
              const end = Math.min(index + frameSize, audioBuffer.length);
              const frame = audioBuffer.slice(index, end);
              ws.send(JSON.stringify({
                  "common": { "app_id": APPID },
                  "business": { "language": "zh_cn", "domain": "iat" },
                  "data": {
                      "status": index === 0 ? 0 : 1,
                      "format": "audio/L16;rate=16000",
                      "encoding": "raw",
                      "audio": frame.toString('base64')
                  }
              }));
              index += frameSize;
          }, frameInterval);
      });

      ws.on('message', (data) => {
          console.log('接收到数据：', data);
          const results = JSON.parse(data);
          console.log(results);
          if (results.code === 0) {
              resolve(results.data);
          } else {
              reject(new Error('识别错误: ' + results.message));
          }
          if(results.status ===2){
            ws.close();
          }
      });

      ws.on('error', (err) => {
          console.error('WebSocket错误：', err);
          reject(err);
      });

      ws.on('close', () => {
          console.log('WebSocket连接已关闭。');
          resolve('连接已正常关闭');
      });
  });
}



// 云函数入口函数
exports.main = async (event, context) => {
  const audioBase64 = event.audioBase64;
  try {
    const transcriptionResult = await startWebSocketConnection(audioBase64);
    return {
      success: true,
      result: transcriptionResult
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};