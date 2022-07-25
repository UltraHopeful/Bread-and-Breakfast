const aws = require("aws-sdk");
const ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async (event) => {
  try {
    const result = await insertRecord(event.body);
    const response = {
      statusCode: "200",
      headers,
      body: "Success",
    };

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

const insertRecord = async (body) => {
  const data = JSON.parse(body);

  try {
    const params = {
      TableName: "group26_users",
      Item: {
        "user_id": { "S": data.user_id },
        "answer_1": { "S": data.answer_1 },
        "answer_2": { "S": data.answer_2 },
        "answer_3": { "S": data.answer_3 },
      },
    };

    const result = await ddb.putItem(params).promise();

    return result;
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
