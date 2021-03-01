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
  // If the message being recieved was sent by a bot, ignore it
  // Might try to find a way to identify that it was sent by this specific bot later, but for now this works
  if (data.event.hasOwnProperty('bot_profile'))
    return;

  // Test to see if the message is an @ mention, a DM, or just a regular message it should ignore
  let messageType;
  if (data.event.type === 'app_mention') 
  {
    messageType = 'app_mention';
  } 
  else if (data.event.type === 'message') 
  {
    if (data.event.channel_type == 'im') 
    {
      messageType = 'DM';
    } 
    else 
    {
      messageType = 'reg_message';
    }
  }
  else if (data.event.type === "app_home_opened")
  {
    messageType = "home_opened";
  }


  switch (messageType)
  {
    // Do anything in here if you want the bot to react to messages in general
    case 'reg_message':
      
      break;

    // Bot will react to @ mentions, both in general chat channels and DM's
    case 'app_mention':
    case 'DM':
      // Regular expressions to decide if a string matches the pattern needed or not.
      let askForTermRE = /(what does) (?<term>[a-zA-Z ]{1,}) (mean|stand for)/i;  // This will match with anything in the form of "what does ___ mean/stand for"

      if (data.event.text.search(askForTermRE) != -1)
      {
        // matchArray will be an array of matching strings to the Regex, and the subgroups. We want the subgroup "term".
        const matchArray = data.event.text.match(askForTermRE);
        let wordToFind = matchArray.groups.term;  // This gets the term out of the array, since it is a named group within the Regex.
        let response = "";
        let desc;

        // desc will get the result from the function. Either the term, null, or -1.
        desc = await getDesc(wordToFind);
       
        if (desc == null) {
          // Term doesn't exist yet
          response = "Sorry, I don't know that yet.";

          // This might be a good spot for asking if they'd like to add the term to the database.
          

        } else if (desc == -1) {
          // Database responded with an error. 
          response = wordToFind +  "Sorry, there was an error.";
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

        console.log("Sent final message");
		return;
      }
	  else if (data.event.text.includes("wake up"))
	  {
		  await sendMessageToSlack("I'm awake!!!", data, 0);
		  return;
	  }
	  
	  else if (data.event.text.includes("edit"))
      {
		//var wordtoEdit = await sendMessageToSlack("What would you like me to edit?",data,1);
		
        //ar startIndex = data.event.text.indexOf("edit") + 10;
        //var leftOvers = data.event.text.slice(startIndex);
        //var endIndex = leftOvers.indexOf(' ');
        //var wordtoEdit = leftOvers.slice(0, endIndex);

        //let desc = await queryDB(wordtoEdit);
        //let response = "";

        //if (desc == null) {
         //response = "beep"
        //} else {
		await sendMessageToSlack("What would you like me to edit?",data, 1);
		//response = ("What would you like me to edit?",data,1);
		let wordToEdit = data.event.text(); 
		//let x = Boolean(queryDB(wordToEdit));
		let y = queryDB(wordToEdit);
		if (Boolean(y) == true){
			response = "Found that term!";
		} else { response = "Term not found *sad beep*."}
		
		await sendMessageToSlack(response, data, 1);
		
		await sendMessageToSlack("Please enter the edited word.", data, 1);
		let newWordEdit = data.event.text();
		
		let newReply = ("TEST: Added " + newWordEdit + "to the database!");
		await sendMessageToSlack(newReply,data,1);
	
        return;
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
    case "home_opened":
      await displayHome(data.event.user);
    break;
  }

}

// Used for pushing data to the home tab of the bot. This could be a good spot for putting the help message, and other commonly needed things
async function displayHome(user)
{
  const params = {
    user_id: user,
    view: await updateHomeView(user)
  };

  const result = await Bot.views.publish(params)
}

async function updateHomeView(user)
{
  let homeBlocks = [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Hi, I'm Cappy!",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "\tI have been added to your workspace, and it's my job to help you! I can fetch definitions for simple terms and acronyms if I know them, or you can tell me what certain acronyms mean to help expand my knowledge base!\n\tBe sure to check back here often, as my feature set is constantly expanding!",
          "emoji": true
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Cappy Bot Help Center",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Need a reminder of how to call me and get my help? Then look no further! Here's a list of the things you can ask me that I can help with!",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "• Need to know what a term means? Send me a message in the form of *\"@Cappy what does __ mean\"*, and if I know it I'll reply to your message with the definition!\n\n• Want to tell me something and help me learn! Then you can send me a message in the form of *\"@Cappy add ILC : I love Cappy!\"*, and I'll make sure to remember that for the next time somebody asks.\n\n• Want a simple help message without leaving the channel you're currently in? Then you can just message me with *\"@Cappy help\"* and I'll send you a short version of this message!"
        }
      }
  ];

  let view = {
    type: 'home',
    blocks: homeBlocks
  };

  return view;

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

// Function for sending messages to slack as the bot. This cleans up the previous way by eliminating the repetitive code.
//  Will probably need to be changed a couple times as we figure stuff out. But I figured it was worth making
// ACCEPTS: text - the message that the bot will say
//          data - the data sent to lambda to describe the  event
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


