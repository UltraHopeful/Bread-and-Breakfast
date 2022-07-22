const aws = require("aws-sdk");
const ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });


exports.handler = async (event, context) => {
  
  try {
    const data = await fetchRecordData();
    console.log(data);
    const response = {
      statusCode: "200",
      headers,
      body: data,
    }
    return response;
  } catch (e) {
    const response = {
      statusCode: "500",
      headers,
      body: e.message,
    };
    return response;
  }
};

const params = {
  TableName : 'group26_users'
}

const fetchRecordData = async() => {
  try {
    const data = await ddb.scan(params).promise();
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
