# WeChat-Parse-Server
WeChat API、Parse Server、Broid-WeChat

# Broid-WeChat 修改
/lib/core/Parser.js 修改 line:51 getUserName Function
```javascript
getUserName(openid) {
        if (this.userCache[openid]) {
            return Promise.resolve(this.userCache[openid]);
        }
        return this.wechatClient.getUserAsync(openid)
            .then(({ nickname, headimgurl }) => {
            var user = {};
            this.userCache[openid] = { nickname, headimgurl };
            user.nickname = nickname;
            user.headimgurl = headimgurl;
            return user;
        });
    }
```

# NPM 執行
提供環境變數，Script執行```serverless invoke local --function < Function Name >```，並且提供 Event 內容。<br>
```env $(cat < ENV File > ) npm run < Script Name > -- --path < Lambda Event File >```<br>

參考:
* [NPM Run Script](https://docs.npmjs.com/cli/run-script)
* [Invoke Local Lambda](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/)
* [Passing ENV Bariables](https://www.digitalocean.com/community/questions/passing-environment-variables-to-node-js-using-pm2)
