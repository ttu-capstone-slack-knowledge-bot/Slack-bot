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
        const text = "Lol, heck if I know. Just google it";
        sendMessageToSlack(text, data, 0);
        return;
      }
      else if (data.event.text.includes("hello") || data.event.text.includes("hi"))
      {
        const text = "Sup, human.";
        sendMessageToSlack(text, data, 0);
        return;
      }
      else if (data.event.text.includes("how are you"))
      {
        sendMessageToSlack("You know, just livin' one day at a time.");
        return;
      }
      else if (data.event.text.includes("color is the sky"))
      {
        sendMessageToSlack("Probably blue, but I dont have eyes, so who knows", data, 0);
        return;
      }
      else if (data.event.text.includes("meaning of life"))
      {
        sendMessageToSlack("42. It's always 42", data, 0);
        return;
      }
      else if (data.event.text.includes("favorite color"))
      {
        sendMessageToSlack("Purple", data, 0);
        return;
      }
      else if (data.event.text.includes("add"))
      {
        sendMessageToSlack("Adding item to the database...", data, 0);
        await sendToDB();
        sendMessageToSlack("The item has been added", data, 0);
        return;
      }
      else 
      {
        sendMessageToSlack("Sorry, I don't know how to handle that request yet.", data, 0);
        return;
      };

    break;
  }

}

async function sendToDB()
{
  const table = "AcronymData";
  const name = "API";
  const desc = "Aplication Program Interface";
  
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

// Function for sending messages to slack as the bot. This cleans up the previoius way by elimating the repative code.
// ACCEPTS: text - the message that the bot will say
//          data - the data sent to lambda to describe the event
//          method - The kind of message the bot will be sending (0 = regular message, 1 = message reply, 2 = DM)
function sendMessageToSlack(message, data, method)
{
  switch (method)
  {
    case 0:   // A regular message
      const params = {
        token: process.env.AUTH_TOKEN,
        channel: data.event.channel,
        text: message
      }
    
      Slack.chat.postMessage(params);
    break;

    case 1:   // Reply to the message itself, starting a thread

    break;

    case 2:   // Send a DM to the invoking user

    break;
  }

  
}