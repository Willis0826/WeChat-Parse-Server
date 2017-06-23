//Parse
var Parse = require('parse/node');
var parseCreateIntergration = require('./parseCreateIntegration');
const config = require('./config.json');
Parse.initialize(config.PARSE_USER_NAME, null, config.PARSE_MASTER_KEY);
Parse.serverURL = config.PARSE_SERVER_URL;

const Integration = Parse.Object.extend("Integration");

module.exports = {
  ReceiveIntegration: function(integrationId){
    return Promise.resolve()
      .then(() => {
        let query = new Parse.Query(Integration);
        query.equalTo("integrationId", integrationId);
        return query.first({ useMasterKey: true });
      })
      .then((IntegrationObject) => {
        if(IntegrationObject == undefined){
          //找不到對應的Integration，呼叫parseCreateIntergration
          return parseCreateIntergration.CreateIntegration(integrationId);
        }
        //找到Integration
        return IntegrationObject.get("organization");
      })
  }
}
