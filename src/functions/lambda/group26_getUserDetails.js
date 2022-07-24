const aws = require("aws-sdk");
const ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async (event, context) => {

  try {
    const userData = await fetchRecordData();

      const response = {
        statusCode: "200",
        body: userData,
      };
      return response;

  } catch (e) {
    const response = {
      statusCode: "500",
      body: e.message,
    };
    return response;
  }
};

var params = {
  TableName : 'group26_users',
};
const fetchRecordData = async() => {
try {
    const data = await ddb.scan(params).promise();
    return data;
  } catch (error) {
    throw error;
  }
};
