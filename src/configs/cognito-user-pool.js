import { CognitoUserPool } from "amazon-cognito-identity-js";

const pool = {
  UserPoolId: "us-east-1_M7YP2TeKK",
  ClientId: "4nn9l5dlfhj9c3hvbt0ejeq752",
};

export default new CognitoUserPool(pool);
