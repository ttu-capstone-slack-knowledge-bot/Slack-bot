'use strict'
//test test
const { WebClient } = require('@slack/web-api');
const Bot = new WebClient(process.env.AUTH_TOKEN);
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});
const termTable = "AcronymData";

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

async function handleEvent(data)
{
  // Test to see if the message is an @ mention, a DM, or just a regular message it should ignore
  let messageType;
  if (data.event.type === 'app_mention') {
    messageType = 'app_mention';
  } else if (data.event.type === 'message') {
    if (data.event.channel == data.event.user) {
      messageType = 'DM';
    } else {
      messageType = 'reg_message';
    }
  }


  switch (messageType)
  {
    // Do anything in here if you want the bot to react to messages in general
    case 'reg_message':
      
      break;

    // Bot will react to @ mentions, both in general chat channels and DM's
    case 'app_mention':
    case 'DM':

      if (data.event.text.includes("what does"))
      {
        let startIndex = data.event.text.indexOf("what does") + 10;
        let leftOvers = data.event.text.slice(startIndex);
        let endIndex = leftOvers.indexOf(' ');
        let wordToFind = leftOvers.slice(0, endIndex);
        let response = "";
        let desc;

        // desc will get the result from the function. Either the term, null, or -1.
        desc = await getDesc(wordToFind);
       

        if (desc == null) {
          response = "Sorry, I don't know that yet.";
        } else if (desc == -1) {
          response = "Sorry, there was an error.";
        } else {
          response = wordToFind + " means " + desc;
        }

        await sendMessageToSlack(response, data, 1);
        return;
      }
      else if (data.event.text.includes(" hello") || data.event.text.includes(" hi"))
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
      else if (data.event.text.includes(" add"))
      {

        try
        {
          let startIndex = data.event.text.indexOf("add") + 4;
          let fullString = data.event.text.slice(startIndex);
          let splitIndex = fullString.indexOf(':');
          let newTerm = fullString.slice(0, splitIndex);
          let newDef = fullString.slice(splitIndex+2, data.event.text.length);

          await sendMessageToSlack("Adding item to the database...", data, 1);
          await sendToDB(newTerm, newDef);
          await sendMessageToSlack("The item has been added", data, 1);
  
        }
        catch (error)
        {
          console.error(error);
        }

        return;
      }
      else if (data.event.text.includes(" give")) 
      {
        await sendMessageToSlack("Here's what is in the database: ", data, 0);
        let message = await readFromDB();
        await sendMessageToSlack(message, data, 0);
      }
      else if (data.event.text.includes(" help") || data.event.text.includes(" how do you work")) // Potential base for the help command to be based off of?
      {
        let help = "Hello! I'm Cappy! Here's how you can let me help you!\n" +
          "In order to get my attention you need to @ me, by saying @Cappy followed by your question. For example:\n" + 
          "Ask me \"what does xxx mean?\" and I'll tell you if I know it!\n" +
          "Ask me to \"give me the whole database\" and I'll tell you everything I know!\n" +
          "Tell me \"learn xxx\" and then I'll ask you what it means. Once you tell me, I'll never forget it!\n" +
          "For a more detailed list of all I can do, reply to this message with \"DM me\" and I'll give you a full list of all my abilities."
        await sendMessageToSlack(help, data, 0);
      }
      else 
      {
        await sendMessageToSlack("Sorry, I don't know how to handle that request yet.", data, 0);
        return;
      };

    break;
  }

}

// Creating and using this instead of queryDB to make it clear that all this does is get the desc of a term, and nothing else.
// Accepts - the term to be looked for
// Returns - either the term, null if not found, or -1 if there was an error thrown.
async function getDesc(term)  // Ben
{
  let response;
  const params = {
    TableName: termTable,
    Key: {
      Name: term
    },
    AttributesToGet: [
      "Desc"
    ]
  };

  // Try-catch block to make sure database function works correctly.
  try {
    let result = await db.get(params).promise();

    // Check to see if the result is just an 'empty set', which means we got nothing back
    if (JSON.stringify(result) != "{}")
    {
      // Found the term
      response = result.Item.Desc;
    } else {
      // Found nothing
      response = null;
    }
  } catch (error) {
    // There was an error
    console.error("There was an error: ", error);
    response = -1;
  }

  return response;
}

// 
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

    if (JSON.stringify(result) != "{}") 
    {
      console.log(JSON.stringify(result))
      response = result.Item.Desc;
      console.log(response);
    } 
    else 
    {
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
  let listOfTerms = "";

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

async function sendToDB(name, desc)
{
  const table = "AcronymData";
  
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
//  Will probably need to be changed a couple times as we figure stuff out. But I figured it was worth making
// ACCEPTS: text - the message that the bot will say
//          data - the data sent to lambda to describe the event
//          method - The kind of message the bot will be sending (0 = regular message, 1 = message reply, 2 = DM)
async function sendMessageToSlack(message, data, method)
{
  let params = {};
  switch (method)
  {
    case 0:   // A regular message
      params = {
        channel: data.event.channel,
        text: message
      }
    
      try 
      {  
        let val = await Bot.chat.postMessage(params);
        console.log(val);
      } 
      catch (error) 
      {
        console.error("Error in 0: ", error);
      }

    break;

    case 1:   // Reply to the message itself, starting a thread

    // This checks to see if the message is a parent message, or a thread reply itself.
    let timeStamp;
    if (data.event.hasOwnProperty('thread_ts')) {
      timeStamp = data.event.thread_ts;
    } else {
      timeStamp = data.event.ts;
    }

      params = {
        channel: data.event.channel,
        text: message,
        thread_ts: timeStamp
      };

      try {
        let val = await Bot.chat.postMessage(params);
        console.log(val);
      }
      catch (error)
      {
        console.error("Error in 1: ", error)
      }

    break;

    case 2:   // Send a DM to the invoking user

    params = {
      channel: data.event.user,
      text: message
    };

    try {
      let val = await Bot.chat.postMessage(params);
      console.log(val);
    }
    catch (error)
    {
      console.error("Error in 1: ", error)
    }

    break;
  }

  
}