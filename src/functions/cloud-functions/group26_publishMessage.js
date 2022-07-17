/** Author - Pavithra Gunasekaran 
 * GCP Cloud Function to publish messages to pub/sub topics
 * Method to publish message to pub sub 
 * POST request to https://us-central1-sample2-178914.cloudfunctions.net/group26_publishMessage
 * @param - json body
 */


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


const subscriptionName = "group26_pubsub-sub";
const topicID = "group26_pubsub";
const subscription = pubSubClient.subscription(subscriptionName);

let messageCount = 0;

async function publishMessage ( topicId, data) {
  

  const dataBuffer = Buffer.from(data);
    try {
      const messageId = await pubSubClient
        .topic(topicId)
        .publishMessage({data: dataBuffer});
      console.log(`Message ${messageId} published.`);
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
  console.log(req.body.message)
  publishMessage(topicID, req.body.message)
  let message = req.query.message || req.body.message || 'Hello World!';
  res.status(200).send(req.body.message);
};
