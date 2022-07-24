const { PubSub } = require("@google-cloud/pubsub");

const nodemailer = require("nodemailer");

// var app = express();
var bodyParser = require("body-parser");
var user ='';
const port = process.env.PORT || 5002;
var messageReceived = ""
 var m='';
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
      console.log("type: "+typeof( message.data))
      messageReceived= message.data;
      // m = String(message.data);
      // console.log("msg rcvd: "+m);
      messageCount += 1;
  
      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };
  
    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);
  
    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
      // console.log("message recvd: "+messageReceived['user']);
    }, timeout * 1000);
    
    return true;
   
  }
  


/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.pullNotification = (req, res) => {
  response = pullMessages('group26_notifications-sub','group26_notifications')
  // let message = req.query.message || req.body.message || 'Hello World!';
  if (response){
    res.status(200).send(messageReceived);
  }
  else{
    console.log("Error in pulling");
  }
  
};
