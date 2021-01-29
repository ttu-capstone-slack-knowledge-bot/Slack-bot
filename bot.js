'use strict'
//test test
const { WebClient } = require('@slack/web-api');
const Bot = new WebClient(process.env.AUTH_TOKEN);
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
        var startIndex = data.event.text.indexOf("what does") + 10;
        var leftOvers = data.event.text.slice(startIndex);
        var endIndex = leftOvers.indexOf(' ');
        var wordToFind = leftOvers.slice(0, endIndex);

        let desc = await queryDB(wordToFind);
        let response = "";

        if (desc == null) {
          response = "Sorry, I don't know that yet."
        } else {
          response = wordToFind + " stands for: " + desc;
        }

        sendMessageToSlack(response, data, 0);
        return;
      }
      else if (data.event.text.includes("hello") || data.event.text.includes("hi"))
      {
        const text = "Sup, human.";
        await sendMessageToSlack(text, data, 0);
        return;
      }
      else if (data.event.text.includes("how are you"))
      {
        await sendMessageToSlack("You know, just livin' one day at a time.", data, 0);
        return;
      }
      else if (data.event.text.includes("color is the sky"))
      {
        await sendMessageToSlack("Probably blue, but I dont have eyes, so who knows", data, 0);
        return;
      }
      else if (data.event.text.includes("meaning of life"))
      {
        await sendMessageToSlack("42. It's always 42", data, 0);
        return;
      }
      else if (data.event.text.includes("favorite color"))
      {
        await sendMessageToSlack("Purple", data, 0);
        return;
      }
      else if (data.event.text.includes("add"))
      {
        await sendMessageToSlack("Adding item to the database...", data, 0);
        await sendToDB();
        await sendMessageToSlack("The item has been added", data, 0);
        return;
      }
      else if (data.event.text.includes("give"))
      {
        console.log("Got here");
        var message = "";
        await sendMessageToSlack("Here's what is in the database: ", data, 0);
        console.log("Sent message to slack");
        message = await readFromDB();
        console.log("Finished awaiting");
        await sendMessageToSlack(message, data, 0);
        console.log("Sent final message");

      }
      else 
      {
        await sendMessageToSlack("Sorry, I don't know how to handle that request yet.", data, 0);
        return;
      };

    break;
  }

}

async function queryDB(term)
{
  var response = "";

  let params = {
    TableName: "AcronymData",
    Key: {
      Name: term
    }
  };

  try{
    console.log("About to call the thing");
    let result = await db.get(params).promise();
    if (JSON.stringify(result) != "{}") {
      console.log(JSON.stringify(result))
      response = result.Item.Desc;
      console.log(response);
    } else {
      response = null;
      console.error("SOMETHING WENT WRONG");
    }
  }
  catch (error) {
    console.error(error);
  }

  return response;

}

async function readFromDB()
{
  var listOfTerms = "";

  const params = {
    TableName: "AcronymData",
    Limit: 10
  }

  let result = await db.scan(params).promise();
  if (result) {
    console.log("Thing has been read");
    
    result.Items.forEach(function(item) {
      console.log(item.Name);
      var tempString = item.Name + ": " + item.Desc + "\n";
      listOfTerms = listOfTerms.concat(tempString);
    })
    console.log(listOfTerms);
    return listOfTerms;
  } else {
    console.error("There was an error");
    return "Error";
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
async function sendMessageToSlack(message, data, method)
{
  switch (method)
  {
    case 0:   // A regular message
      const params = {
        channel: data.event.channel,
        text: message
      }
    
      try {
        console.log("sending message");
        let val = await Bot.chat.postMessage(params);
        console.log("Message sent");
      } catch (error) {
        console.error("Whoops: " + error);
      }

    break;

    case 1:   // Reply to the message itself, starting a thread

    break;

    case 2:   // Send a DM to the invoking user

    break;
  }

  
}