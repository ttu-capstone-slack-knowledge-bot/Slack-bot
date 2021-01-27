'use strict'
//test test
const Slack = require('slack');
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

module.exports.run = async (data) => {
  const dataObject = JSON.parse (data.body);

  let response = {
      statusCode: 200,
      body : {},
      //headers : {'X-Slack-No-Retry' : 1}
  };

  try {
    if ( !('X-Slack-Retry-Num' in data.headers) )
    {
      switch (dataObject.type) {
        case 'url_verification':
          response.body = verifyCall (dataObject);
          break;
        case 'event_callback':

         await handleEvent(dataObject, data);

          break;
              
      }
    }
  }
  catch ( err ) {

  }
  finally {
    return response;
  }

};

function verifyCall (data)
{
  return data.challenge;
}

async function handleEvent(data, extra)
{
  switch (data.event.type)
  {
    // Do anything in here if you want the bot to react to messages in general
    case 'message':
      
      break;

    // Bot will react to @ mentions
    case 'app_mention':

      if (data.event.text.includes("what does"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "Lol, heck if I know. Just google it."
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("hello") || data.event.text.includes("hi"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "Sup, human."
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("how are you"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "you know. Just livin' one day at a time."
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("color is the sky"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "Probably blue. But I don't have eyes, so who knows."
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("meaning of life"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "42. It's always 42."
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("favorite color"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "purple"
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("add"))
      {
        console.log("Entering the add...");
        await sendToDB();
        
        console.log("Done adding item");

        const msg = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "Item has been added."
        };

        Slack.chat.postMessage(msg);
      }
      else 
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "Sorry, I don't know how to handle that question yet."
        }

        Slack.chat.postMessage(params);
        return;
          
      };

    break;
  }

}

async function sendToDB()
{
  const table = "AcronymData";
  const name = "OOP";
  const desc = "Object Oriented Programming";
  
  console.log("Creating the dbData...");

  const params = {
      TableName: table,
      Item:{
        "Name": name,
        "Desc": desc
      }
  };

  console.log("Adding a new item...");
  let result = await db.put(params).promise();
  if (result) {
    console.log("THING HAS BEEN ADDED", result);
  } else {
    console.error("THERE WAS AN ERROR: ", result);
  }
  console.log("Done adding item");
}