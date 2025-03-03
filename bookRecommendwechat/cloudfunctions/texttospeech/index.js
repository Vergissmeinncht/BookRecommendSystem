const cloud = require('wx-server-sdk');
const crypto = require('crypto');
const WebSocket = require('ws');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

async function buildWebSocketUrl(apiKey, apiSecret) {
  const url = 'wss://tts-api.xfyun.cn/v2/tts';
  const date = new Date().toUTCString();
  const host = 'tts-api.xfyun.cn';
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`;
  const signature = crypto.createHmac('sha256', apiSecret).update(signatureOrigin).digest('base64');
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  const authorization = Buffer.from(authorizationOrigin).toString('base64');
  const websocketUrl = `${url}?host=${host}&date=${encodeURIComponent(date)}&authorization=${encodeURIComponent(authorization)}`;
  return websocketUrl;
}

exports.main = async (event, context) => {
  const text = event.text;
  const base64Text = Buffer.from(text).toString('base64');
  const APPID = 'ade89b80';
  const API_KEY = '8b0cdb0970155355f037dd96d7f23996';
  const API_SECRET = 'MWVhNWM3MmVhZjk4ZTMzZDk4OGUyYzZi';
  const url = await buildWebSocketUrl(API_KEY, API_SECRET);
  let ansBuffer = Buffer.alloc(0);
  console.log('调用云函数成功');
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.on('open', function open() {
      console.log('WebSocket connection opened');
      ws.send(JSON.stringify({
        "common": {"app_id": APPID},
        "business": {"aue": "lame", "sfl": 1, "vcn": "x4_lingxiaoxuan_en", "tte": "UTF8"},
        "data": {"status": 2, "text": base64Text}
      }));
    });
    ws.on('message', function incoming(data) {
      const res = JSON.parse(data);
      console.log(res);
      if (res.code === 0 && res.data) {
        if (res.data.audio) {
          const audioBuffer = Buffer.from(res.data.audio, 'base64');
          ansBuffer = Buffer.concat([ansBuffer,audioBuffer]);
          console.log(ansBuffer);
        }
        if (res.data.status === 2) { // Check if synthesis is complete
          ws.close(); // Close WebSocket connection
        }
      } else {
        reject(new Error(res.message));
      }
    });
    ws.on('close', () => {
      console.log('WebSocket connection closed'); // Ensure file path is resolved when connection is closed
      resolve({ansBuffer:ansBuffer});
    });
    ws.on('error', (err) => {
      reject(err);
    });
  });
};