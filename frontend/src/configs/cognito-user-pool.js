import { CognitoUserPool } from "amazon-cognito-identity-js";

const pool = {
  UserPoolId: "us-east-1_ikeaSmzXC",
  ClientId: "2dda31pco8qteveei6mgbd1n74",
};

export default new CognitoUserPool(pool);
