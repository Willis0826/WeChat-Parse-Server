# WeChat-Parse-Server
WeChat API、Parse Server、Broid-WeChat

# Broid-WeChat 修改
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
