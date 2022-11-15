# Bread-and-Breakfast

I have done this project in CSCI 5410 - Serverless Data Processing during my Masters of Applied Computer Science.
This project is about bread and breakfast, where users can book room and breakfast online in the same order. This feature is convenient for customers because they can order two main things in the same order, which is also beneficial for the hotel and its kitchen staff to prepare for the next day. In this project, the whole system is an interconnection of different microservices that use serverless resources from Amazon Web Service and Google Cloud Platform. This project is a multi-cloud deployment model.
In this project, the frontend is made of material UI to make the web application user interface minimal and responsive. In addition, for customer support, the AmplifyChatBot component is used. For the backend, the resources used are Cognito, API Gateway, Lambda, DynamoDB, Pub/Sub topics, Pub/Sub subscriber, GCP Cloud Functions, Firestore, and Amazon Lex. Also, the resources used for trip recommendations in nearby areas are AWS personalize and Lambda functions. The resources utilized for the polarity analysis of customer feedback are Google NLP API, Cloud Function, and Firestore.

## Installation

### Prerequisites
You have to configure and provision the cloud resources which are used in project.
First you have to clone this repository and then open both directory as different project and follow the below commands.

### Installing

After that you have to open the terminal and do

```
npm install
```

after that to run the site you have to type

```
npm start
```

## Built With

- Front-end: [React](https://reactjs.org)
- Styling framework: [Material UI](https://mui.com/)
### Used AWS Services
- Cognito
- Dynamo DB
- S3
- Lambda Functions
- API gateway
- Amazon Lex
- AWS personalize

### Used GCP Services
- Pub/Sub
- Cloud Function
- Firestore
- Google NLP API
- Google container registry
- Google cloud run
