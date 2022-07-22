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

const subscriptionName = "group26_pubsub-sub";
const topicID = "group26_pubsub";
const subscription = pubSubClient.subscription(subscriptionName);

let messageCount = 0;

async function publishMessage ( topicId, data) {
  
  /** data should be in json format
   * data = {
   * userID : "x",
   * messageType: "Request/Response",
   * messageBody: "hotel/tour" }
   */
  const dataBuffer = Buffer.from(data);
  console.log("data buffer: "+dataBuffer);
  console.log(JSON.parse(data));
    try {
      const messageId = await pubSubClient
        .topic(topicId)
        .publishMessage({data: dataBuffer});
      console.log(`Message ${messageId} published.`);
      return true;
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
exports.helloWorld = (req, res) => {
  console.log("message received: "+req.body.message+","+req.body.roomid)
  //  console.log("message body received: "+req.body)
   const data = {
     message : req.body.message,
     path: req.body.path,
    checkin: req.body.checkin,
    checkout:req.body.checkout,
    rooms: req.body.rooms,
    roomid: req.body.roomid,
    user: req.body.user
   }
   console.log("message body received: "+data)
  // const dataBuffer = Buffer.from(data);
  const dataJson = JSON.stringify(data);
  response = publishMessage(topicID, dataJson);
  if (response){
    res.status(200).send("Message published - "+data.message);
  }
  
  // let message = req.query.message || req.body.message || 'Hello World!';
  
};
