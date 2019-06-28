'use strict';

//const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const dateNow = () => {
  let now = new Date().toLocaleString("pt-br", { timeZone: "America/Sao_Paulo" })
  now = now.split(' ')
  now[0] = now[0].split('-').reverse().join('-')
  return `${now[0]} ${now[1]}`
  }

  module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    if (typeof data.text !== 'string')  {
      console.error('Validation Failed');
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the service item',
      });
      return;
    }
  
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: data.id,
        text: data.text,
        createdAt: dateNow(),
      },
    };
  
    // write the todo to the database
    dynamoDb.put(params, (error) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create the service item',
        });
        return;
      }
  
      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item),
      };
      callback(null, response);
    });
  };