const BroidWeChat = require('@broid/wechat');
const config = require('./config.json');
var parseReceiveMessage = require("./parseReceiveMessage");
//Broid WeChat Configure
const wechat  = new BroidWeChat({
  appID: config.WECHAT_APP_ID,
  appSecret: config.WECHAT_APP_SECRET,
  http:{
    host: "localhost",
    port: 8080
  }
});

wechat.connect()
  .subscribe({
    next: data => console.log(data),
    error: err => console.error(`Something went wrong: ${err.message}`),
    complete: () => console.log('complete'),
  });

wechat.listen()
  .subscribe({
    next: data => {
      console.log(data);
      parseReceiveMessage.ReceiveMessage(data.actor, data.object, data.target);
    },
    error: err => console.error(`Something went wrong: ${err.message}`),
    complete: () => console.log('complete'),
  });
