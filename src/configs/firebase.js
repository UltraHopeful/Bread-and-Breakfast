import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVNYjzHQRk4CTz3FpiiiBgsWwtZewA-gU",
  authDomain: "csci5410-serverless-356113.firebaseapp.com",
  projectId: "csci5410-serverless-356113",
  storageBucket: "csci5410-serverless-356113.appspot.com",
  messagingSenderId: "71370344904",
  appId: "1:71370344904:web:47d5b2537cbf627200d8fd",
  measurementId: "G-0MQQJWQ81M",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
