/** Author - Pavithra Gunasekaran 
 * GCP Cloud Function to pull messages from pub/sub and acknowledge  them
 * Method to pull messages from pub sub 
 * GET request to https://us-central1-sample2-178914.cloudfunctions.net/group26_pullMessage
 * 
 */


const { PubSub } = require("@google-cloud/pubsub");

const nodemailer = require("nodemailer");

// var app = express();
var bodyParser = require("body-parser");

const port = process.env.PORT || 5002;
var messageReceived = ""
const pubSubClient = new PubSub({
  projectId: "sample2-178914",
  keyFilename: "gcp.json",
});

async function pullMessages(subscriptionId, topicId) {
    // References an existing subscription
    const subscription = await pubSubClient.subscription(subscriptionId);
  
    // Create an event handler to handle messages
    let messageCount = 0;
    const timeout = 60;
    const messageHandler = message => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      messageReceived= message.data;
      messageCount += 1;
  
      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };
  
    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);
  
    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
    }, timeout * 1000);
   
  }
  


/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.pull = (req, res) => {
  pullMessages('group26_pubsub-sub','group26_pubsub')
  // let message = req.query.message || req.body.message || 'Hello World!';
  res.status(200).send(messageReceived);
};
