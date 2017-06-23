//Parse
var Parse = require('parse/node');
const config = require('./config.json');
Parse.initialize(config.PARSE_USER_NAME, null, config.PARSE_MASTER_KEY);
Parse.serverURL = config.PARSE_SERVER_URL;

const Integration = Parse.Object.extend("Integration");

const Organization = Parse.Object.extend("Organization");
const organizationRef = Organization.createWithoutData('UE7EMNfURp');

const Platform = Parse.Object.extend("Platform");
const platformRef = Platform.createWithoutData('wechat');

module.exports = {
  CreateIntegration: function(integrationId){
    console.log(`CreateIntegration with integrationId : ${integrationId}`);
    let integrationData = Parse.Cloud.run("integrate", {
      integrationName: '可口可樂 公眾號',
      integrationId,
      organization: organizationRef.toPointer(),
      platform: platformRef.toPointer(),
      token: 'We9uisGX7sGw5jPDm02lvdLyodxZ2zHEyVLdxudvcX0se2zkjIRtmtJ7ieUNgVu8OQjhtdj6HzMAKRPhm-3wLW-SxBt73n_lxP796T5w2Sk76y-CXWfcTj1rlgYq4q7WJWCjAHAWJP',
      secret: config.WECHAT_APP_SECRET,
    },{
      useMasterKey: true
    });
    return integrationData;
  }
}
