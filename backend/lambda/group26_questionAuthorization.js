const aws = require("aws-sdk");
const ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });

var userId = '';
exports.handler = async (event, context) => {
  
  let user_req = JSON.parse(event.body);
  console.log(user_req);
  userId = user_req.user_id;
  
  try {
    const userData = await fetchRecordData(userId);

     var a1 = userData.Item.answer_1.S;
     var a2 = userData.Item.answer_2.S;
     var a3 = userData.Item.answer_3.S;

    if(a1 == user_req.a1 && a2 == user_req.a2 && a3 == user_req.a3) {
      const response = {
        statusCode: "200",
        headers,
        body: "Success",
      };
      return response;
    }
    else{
      const response = {
        statusCode: "200",
        headers,
        body: "Faliure",
      };
      return response;
    }
  } catch (e) {
    const response = {
      statusCode: "500",
      headers,
      body: e.message,
    };
    return response;
  }
};

const fetchRecordData = async(userId) => {
var params = {
  TableName : 'group26_users',
  Key: {
    "user_id": {"S":userId},
  }
};

try {
    const data = await ddb.getItem(params).promise();
    return data;
  } catch (error) {
    throw error;
  }
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
  "Content-Type": "application/json",
};
