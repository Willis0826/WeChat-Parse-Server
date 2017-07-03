//Parse
var Parse = require('parse/node');
const config = require('./config.json');
Parse.initialize(config.PARSE_USER_NAME, null, config.PARSE_MASTER_KEY);
Parse.serverURL = config.PARSE_SERVER_URL;

const Customer = Parse.Object.extend("Customer");
const Organization = Parse.Object.extend("Organization");
const Integration = Parse.Object.extend("Integration");
const Platform = Parse.Object.extend("Platform");

const platformRef = Platform.createWithoutData('wechat');


module.exports = {
//開始Query資料
ReceiveMessage : function(userInfo, messageInfo, targetInfo){
  return Promise.resolve()
    .then(() => {
      //第一個動作
      //查詢是否有相同的使用者在Parse資料庫中
      let query = new Parse.Query(Customer);
      query.equalTo("customerId", userInfo.id);
      //建立一個integration的參考
      let integrationRef = Integration.createWithoutData(targetInfo.id);
      return Promise.all([
        query.first({ useMasterKey: true }),
        integrationRef.fetch({ useMasterKey: true })
      ]);
    })
    .then(([customerObj, integrationObj]) => {
      //第二個動作
      //可以刪去
      if (customerObj !== undefined) {
        return Promise.resolve().then(() => {
          //第三個動作
          //有相同的使用者在資料庫中！
          let displayName = customerObj.get("displayName");
          console.log(`Customer Already Exist ! ${displayName}`);
          return Promise.resolve({customerInfo: customerObj, integrationInfo: integrationObj});
        });
      } else {
        //沒有找到使用者, 建立一個 customer with id & platform & headimgurl & displayName
        return Promise.resolve(integrationObj).then((integrationObj) => {
          console.log("Start Create Customer ! ");
          if (userInfo.id == undefined) {
            return Promise.reject(new Error("Bad User Data : userInfo.id is undefined"));
          }
          if (userInfo.name == undefined) {
            return Promise.reject(new Error("Bad User Data : userInfo.name is undefined"));
          }
          if (userInfo.headimgurl == undefined) {
            return Promise.reject(new Error("Bad User Data : userInfo.headimgurl is undefined"));
          }

          //save user into customer
          let customer = new Customer({
            customerId: userInfo.id,
            displayName: userInfo.name,
            picture: userInfo.headimgurl,
            platform: platformRef,
            organization: integrationObj.get("organization").toPointer(),
            type: 'user',
            updateWhere: {
              objectId: userInfo.id
            }
          });
          return customer.save(null, {useMasterKey: true})
            .then((resObject) => {
              console.log("Save Customer : " + resObject.get("customerId"));
              return Promise.resolve({customerInfo: resObject, integrationInfo: integrationObj});
            })
        });
      }
  })
  .then(({customerInfo, integrationInfo})=>{
    //儲存訊息到Parse Server Message中
    if (messageInfo.type === 'Note') {
      let resolve = Parse.Cloud.run("proxyConversation", {
        from: customerInfo.toPointer(),
        customer: customerInfo.toPointer(),
        integration: integrationInfo.toPointer(),
        message: {
          contentType: `text/plain`,
          data: {
            content: messageInfo.content
          }
        }
        }, {
        useMasterKey: true
      });
      return resolve;
    }
    else if (messageInfo.type === 'Image') {

    }
    else if (messageInfo.type === 'Video') {

    }
    else if (messageInfo.type === 'Audio') {

    }
  })
  .catch(function(error){
    console.log(error);
  });
}

};
