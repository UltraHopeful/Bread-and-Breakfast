const Firestore = require("@google-cloud/firestore");

const PROJECTID = "csci5410-serverless-356113";
const COLLECTION_NAME = "users";

const firestore = new Firestore({
  projectId: PROJECTID,
});

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.addCipherKey = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    // store/insert a new document
    const cipher_key = req.body.cipher_key;
    const user_id = req.body.user_id;

    try {
      const doc = await firestore.collection(COLLECTION_NAME).doc(user_id).set({
        cipher_key,
      });

      return res.status(200).send(doc);
    } catch (error) {
      console.log(error);
      return res.status(404).send({
        error: error.message,
      });
    }
  }
};

/**
 * package.json
{
  "name": "sample-http",
  "version": "0.0.1",
  "dependencies": {
    "@google-cloud/firestore": "5.0.2"
  }
}
 */
