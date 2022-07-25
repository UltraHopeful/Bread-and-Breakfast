// var express = require("express");
const { PubSub } = require("@google-cloud/pubsub");

const nodemailer = require("nodemailer");

// var app = express();
var bodyParser = require("body-parser");

const port = process.env.PORT || 5002;

const pubSubClient = new PubSub({
  projectId: "sample2-178914",
  keyFilename: "gcp.json",
});
// app.use(bodyParser.json());
// const cors = require("cors");
// app.use(cors());

const subscriptionName = "group26_notifications-sub";
const topicID = "group26_notifications";
const subscription = pubSubClient.subscription(subscriptionName);
var response = false;
var notifications=[];
let messageCount = 0;

async function publishMessage ( topicId, data) {
  
  /** data should be in json format
   * data = {
   * userID : "x",
   * messageType: "Request/Response",
   * messageBody: "hotel/tour" }
   */
  const dataBuffer = Buffer.from(data);
  // console.log("data buffer: "+dataBuffer);
    try {
      const messageId = await pubSubClient
        .topic(topicId)
        .publishMessage({data: dataBuffer});
      console.log(`Message ${messageId} published.`);
      return true
      res.status(200).send(dataBuffer);
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
      process.exitCode = 1;
    }
  }





/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.notification = (req, res) => {
    data = req.body.data;
   
   console.log("notification : "+data)
   response = publishMessage(topicID, data);
   console.log("notification response : "+response)

  if (response){
    res.status(200).send(data.message);
  }
  
};
