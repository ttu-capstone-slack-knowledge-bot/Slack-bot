'use strict'
//test test
const { WebClient } = require('@slack/web-api');
const Bot = new WebClient(process.env.AUTH_TOKEN);
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});
const termTable = "AcronymData";
const queryString = require('querystring');
const modalData = require('./modalInfo.js');

module.exports.run = async (data) => {

  let response;

  let method = await figureOutWhatCalledThis(data);
  let dataObject = await getDataObject(data, method);

  // Check to make sure there wasn't an error in the process.
  if (dataObject === -1)
  {
    response = {
      statusCode: 500,
      body: "Looks like we don't know how to handle whatever just happened."
    }
    return response;
  }

  // Based on what we decided the method is, pass it off to it's proper handler.
  if (method === "interaction")
  { 
    response = await handleInterationEvent(dataObject);
  }
  else if (method === "slash")
  {
    response = await handleSlashCommand(dataObject);
  }
  else if (method === "message")
  {
    response = await handleMessage(dataObject, data);
  }

  return response;
};

async function handleInterationEvent(data)
{
  // This is what will tell Slack everything went good. Change/add any fields as needed to reflect the status.
  let giveBack = {
    statusCode: 200,
    body: ""
  }

  const interaction = data.type;

  switch (interaction)
  {
    case "block_actions":
      await postModal(data, modalData.firstModal);
    break;

    case "view_submission":

      if (data.view.callback_id == "getName")
      {
        let nameInput = data.view.state.values.nameInput.nameEntered.value;
        console.log(nameInput);
        console.log("Did that work?");

        let message = "Thanks " + nameInput + ", nice to meet you!";

        let params = {
          channel: data.user.id,
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
      }

    else if (data.view.callback_id == "addTag") {
      
      let termInput = data.view.state.values.termToTag.term.value;
      let tagInput = data.view.state.values.tag.tag.value;

      let message = await applyTagToTerm(termInput, tagInput);

      let params = {
        channel: data.user.id,
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
    }
      else if (data.view.callback_id == "deleteTerm")
      {
        let message = "";
        let termToDelete = data.view.state.values.termInput.termEntered.value;
        console.log(termToDelete);

        message = await deleteTermFromDatabase(termToDelete);
        
        let params = {
          channel: data.user.id,
          text: message
        };
  
        try {
          let val = await Bot.chat.postMessage(params);
          console.log(val);
        }
        catch (error)
        {
          console.error("Error in deleteTerm: ", error)
        }
      }
      else if (data.view.callback_id == "deleteTermConfirmation")
      {
        let termToDelete = data.view.private_metadata;
        let message = await deleteTermFromDatabase(termToDelete);

        let params = {
          channel: data.user.id,
          text: message
        };
  
        try {
          let val = await Bot.chat.postMessage(params);
          console.log(val);
        }
        catch (error)
        {
          console.error("Error in deleteTermConfirmation")
          console.error(error);
        }
      }
      else if (data.view.callback_id == "edit-term") //Clay
      {

        let editTermInput1 = data.view.state.values.editTermInput1.editTermEntered1.value;
        let termExists = await queryDB(editTermInput1); //returns "result"
        if (termExists == null) {
          let message = "Sorry, the term you entered does not exist. I can't edit what is not there. Try /add to create the term.";


          let params = {
            channel: data.user.id,
            text: message
          };
        
          try {
            let val = await Bot.chat.postMessage(params);
            
            console.log(val);
          }
          catch (error) {
            console.error("Error posting message " + error);
          }
          return giveBack;
        }
        //let define = await getDesc(editTermInput1); // check the db if the term is there        
        let dbTermName = termExists.Item.RegName; //Pull out just the term name from the 
        let message;      
        
        //if the two terms match, then continue
        if (editTermInput1 == dbTermName){
          let desc = "";
          //let termFoundMSG = ("(testing) Term Found In DB!");
          //message = termFoundMSG;
          let editTermInput2 = data.view.state.values.editTermInput2.editTermEntered2.value;
          desc = editTermInput2;

          let updateComplete = await updateDesc(editTermInput1,desc);
          
          let params = {
            channel: data.user.id,
            text: updateComplete
          };
        
          try {
              let val = await Bot.chat.postMessage(params);
              console.log(val);
          }
          catch (error) {
            console.error("Error posting message " + error);
          }
        }
        //else if the term isn't in the DB, notify the user.
        else if (termExists == null) {
          message = "Sorry, the term you entered does not exist. I can't edit what is not there. Try /add to create the term.";

          let params = {
            channel: data.user.id,
            text: message
          };
        
          try {
            let val = await Bot.chat.postMessage(params);
            console.log(val);
          }
          catch (error) {
            console.error("Error posting message " + error);
          }
        }

      } 
      else if (data.view.callback_id == "addTerm") //Hannah
      {
        let nameInput = data.view.state.values.nameInput.nameEntered.value;
        let descInput = data.view.state.values.descInput.descEntered.value;

        let checkIfExists = await getDesc(nameInput);
        console.log(checkIfExists);
        
        if (checkIfExists == null) 
        {
          await sendToDB(nameInput, descInput)

          let message = "The term " + nameInput + " has been added to the database";
          console.log(data);

          let params = {
            channel: data.user.id,
            text: message
          };
    
          try {
            let val = await Bot.chat.postMessage(params);
            console.log(val);
          }
          catch (error)
          {
            console.error("Error in 1: ", error);
          }
        }
        else 
        {
          let message = "The term " + nameInput + " already exists in the database";

          let params = {
            channel: data.user.id,
            text: message
          };
    
          try {
            let val = await Bot.chat.postMessage(params);
            console.log(val);
          }
          catch (error)
          {
            console.error("Error in 2: ", error);
          }
        }
      } 
    break;

    break; // Break Edit Block
  } //end of switch block

  // Return the response message
  return giveBack;
}

async function handleSlashCommand(data)
{
  // This is what will tell Slack everything went good. Change/add any fields as needed to reflect the status.
  let giveBack = {
    statusCode: 200,
    body: ""
  }

  // Get the command from the payload so we can decide what to do with it.
  const command = data.command;

  switch (command)
  {
    case "/testing":    
      await postModal(data, modalData.getNameModal);
    break; // out of testing

    case "/delete":
      if (data.text === '')
      {
        await postModal(data, modalData.deleteTermModal);
      }
      else  // User sent a word with the slash command, so skip the modal
      {
        console.log("First line: " + data.text)
        let extraText = data.text;
        let word = '';

        // Make sure that the text given is only one word. If it's more, then just cut it down to one word.
        if (extraText.includes(' '))
        {
          word = extraText.slice(0, extraText.indexOf(' '));
          console.log("Only first word: " + word);
        }
        else
        {
          word = extraText;
          console.log("no space: " + word + " : " + extraText);
        }

        console.log("Word to Delete: " + word);

        // "word" should now hold only one term, so lets delete it
        // But we need to make sure this is what the user actually wants. So we're gonna slap them with a confirmation box.

        // Have to convert the object to a string, and then back to a JSON object to make sure we can get a "clone", and not a reference to it.
        let message = JSON.parse(JSON.stringify(modalData.deleteTermConfirmationModal));
       
        // So we need to put the term inside the message
        message.blocks[0].text.text += (word + "?");

        // Now put the word in the private_metadata field as well, so we'll know what to delete if the user hits yes
        message.private_metadata = word;

        // Now post the confirmation modal. If they click yes, then we'll handle it in the HandleInteractionEvent method.
        console.log(message);

        await postModal(data, message);
      }

      break;

    case "/addtag":
      if (data.view.callback_id == "addTag") {

        let newOptionsArray = []; 
        let i; 
        for (i = 0; i < dataArray.length; i++) {
          let newOption = { 
            type: "plain_text",
            text: dataArray[i]
          },
          value: "Choice "+i
        }; 
        newOptionsArray.push(newOption);
 
        let newModal = JSON.parse(JSON.stringify(modalData.modalWithOptions));
        newModal.blocks[0].element.options=newOptionsArray;
 
        await postModal(data, newModal);
 
        let termInput = data.view.state.values.termToTag.term.value;
        let tagInput = data.view.state.values.tag.tag.value;
 
        let message = await applyTagToTerm(termInput, tagInput);
 
        let params = {
          channel: data.user.id,
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
      }

      break;
    case "/add":

      if(data.text != "") {
        let addTermRE = /(?<name>[a-zA-Z0-9 ]{1,})(:) (?<desc>[_a-zA-Z0-9 -]{1,})/i; // Will match anything in form of "term: desc"

        if (data.text.search(addTermRE) != -1) {
          const matchArray = data.text.match(addTermRE); // will return an array with the groups from the regEx
          let nameInput = matchArray.groups.name;  // This will hold the name the user wishes to add
          let descInput = matchArray.groups.desc;   // This will hold the definition the user wishes to add

          let checkIfExists = await getDesc(nameInput);
          console.log(checkIfExists);
          
          if (checkIfExists == null) 
          {
            await sendToDB(nameInput, descInput)
            
            let message = "The term " + nameInput + " has been added to the database";

            let params = {
              channel: data.user_id,
              text: message
            };
      
            try {
              let val = await Bot.chat.postMessage(params);
              console.log(val);
            }
            catch (error)
            {
              console.error("Error in 1: ", error);
            }
          }
          else 
          {
            let message = "The term " + nameInput + " already exists in the database";

            let params = {
              channel: data.user_id,
              text: message
            };
      
            try {
              let val = await Bot.chat.postMessage(params);
              console.log(val);
            }
            catch (error)
            {
              console.error("Error in 2: ", error);
            }
          }
        } 
        else 
        {
          let message = "Please use \"/add\" OR \"/add term: definition\"";

          let params = {
            channel: data.user_id,
            text: message
          };
    
          try {
            let val = await Bot.chat.postMessage(params);
            console.log(val);
          }
          catch (error)
          {
            console.error("Error in 1: ", error);
          }
        } 
        break;
      } 
      else
      {
        console.log("Text not there");
        await postModal(data, modalData.addTerm);
      }

    break;

    case "/edit":    
      if (data.text == ("" || '')){
        await postModal(data, modalData.editModal);
      }
      else if (data.text != null){
        let editTermRE = /(?<term>[\w]{1,}) (with) (?<desc>[\w ]+)/i; //TESTING edit. @Bot edit term with desc. 
        let response = "";
        //if (data.event.text.search(editTermRE) != -1) {
        console.log ("Shotcut command used (edit)");

        const matchArray = data.text.match(editTermRE); // will return an array with the groups from the regEx
        let wordToEdit = matchArray.groups.term;  // This will hold the term the user wishes to edit
        let descToApply = matchArray.groups.desc; // This will hold the desc the user wishes to apply
        

        let termExists = await getDesc(wordToEdit); // Store data in termExists if the term is in the DB
        if (termExists == null) // Term doesn't exist
        {
          response = "Sorry, the term you entered does not exist. I can't edit what is not there. Try /add to create the term.";

          let params = {
            channel: data.user_id,
            text: response
          };

          try {
            let val = await Bot.chat.postMessage(params);
            console.log(val);
          }
          catch (error)
          {
            console.error("Error in 1: ", error);
          }
        }
        else if (termExists == -1) // There was some sort of database error
        {
          response = "Sorry, there was an error trying to retrieve the term.";

          let params = {
            channel: data.user_id,
            text: response
          };

          try {
            let val = await Bot.chat.postMessage(params);
            console.log(val);
          }
          catch (error)
          {
            console.error("Error in 1: ", error);
          }
        }
        else // Term exists, so apply the new description.
        {
          //console.log("Tag exists: Entering applyTagToTerm");
          response = await updateDesc(wordToEdit, descToApply); //returns "___ is now ____" if the wordToEdit is found.
          console.log("Testing: Sucessfully updated term using shortcut.");
          let params = {
            channel: data.user_id,
            text: response
          };

          try {
            let val = await Bot.chat.postMessage(params);
            console.log(val);
          }
          catch (error)
          {
            console.error("Error in 1: ", error);
          }
        }
      } 
    break; //out of edit
  } // end of switch 

  return giveBack;
} // end of slash function

// Not really a fan of this, but I didn't know how else to do this without changing the whole handleEvent function and making it messy.
async function handleMessage(data, bigData)
{
  let giveBack;

  if ( !('X-Slack-Retry-Num' in bigData.headers) )
  {
    switch (data.type) 
    {
      case 'url_verification':
        giveBack = {
          statusCode: 200,
          body: {}
        };

        giveBack.body = await verifyCall (data);
        break;

      case 'event_callback':
        giveBack = await handleEvent(data);
        break; 
    }
  }
  else  // Slack never got the OK from us, so it tried to resend the event.
  {
    giveBack = {
      statusCode: 500,
      body: "Sorry, something went wrong with your request."
    }
    console.error("Slack retried sending the event.");
    console.error(data);
    console.error(bigData);
  }

  return giveBack;
}

async function verifyCall (data)
{
  return data.challenge;
}

// Need to add the return response. Slack needs to know we got its message and everything is good.
async function handleEvent(data)
{
  // This is what will tell Slack everything went good. Change/add any fields as needed to reflect the status.
  let giveBack = {
    statusCode: 200,
    body: "All good"
  };


  // If the message being recieved was sent by a bot, ignore it
  // Might try to find a way to identify that it was sent by this specific bot later, but for now this works
  if (data.event.hasOwnProperty('bot_profile'))
    return giveBack;

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
      let askForTermRE = /(what does) (?<term>[a-zA-Z0-9 ]{1,}) (mean|stand for)/i;  // Will match anything in the form of "what does ___ mean/stand for"
      let tagTermRE = /(tag) (?<term>[a-zA-Z0-9 ]{1,}) (with) (?<tag>[_a-zA-Z0-9-]{1,})/i; // Will match anything in form of "Tag __ with ___."
      let lookForTagRE = /(terms|acronyms) [a-zA-Z ]*(tagged with) (?<tag>[_a-zA-Z-]{1,})/i;  // Will match anything in the form of "... tagged with ___"

      if (data.event.text.search(askForTermRE) != -1) // What does __ mean?
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
      }
      else if (data.event.text.search(tagTermRE) != -1) // Tag __ with ___
      {
        console.log("We're adding a tag");
      
        const matchArray = data.event.text.match(tagTermRE); // will return an array with the groups from the regEx
        let wordToTag = matchArray.groups.term;  // This will hold the term the user wishes to tag
        let tagToApply = matchArray.groups.tag;   // This will hold the tag the user wishes to apply
        let response = "";

        let termExists = await getDesc(wordToTag);
        if (termExists == null) // Term doesn't exist
        {
          response = "Sorry, that term doesn't exist yet, so I can't tag it.";
        }
        else if (termExists == -1) // There was some sort of database error
        {
          response = "Sorry, there was an error trying to retrieve the term.";
        }
        else // Term exists, so apply the tag.
        {
          console.log("Tag exists: Entering applyTagToTerm");
          response = await applyTagToTerm(wordToTag, tagToApply);
          console.log("Just left: applyTagToTerm");
        }

        // Give the response back to the user in a thread.
        await sendMessageToSlack(response, data, 1);
        
        
      }
      else if (data.event.text.search(lookForTagRE) != -1)
      {
        const matchArray = data.event.text.match(lookForTagRE); // will return an array with the groups from the regEx
        let tagToFind = matchArray.groups.tag;  // This will hold the term the user wishes to tag
        let response = "";

        response = await findTermsWithTag(tagToFind);
        await sendMessageToSlack(response, data, 1);
      }
      else if (data.event.text.includes(" hello") || data.event.text.includes(" hi"))
      {
        const text = "Sup, human.";
        await sendMessageToSlack(text, data, 0);
      }
      else if (data.event.text.includes("how are you"))
      {
        await sendMessageToSlack("You know, just livin' one day at a time.", data, 0);
      }
      else if (data.event.text.includes("color is the sky"))
      {
        await sendMessageToSlack("Probably blue, but I dont have eyes, so who knows", data, 0);
      }
      else if (data.event.text.includes("meaning of life"))
      {
        await sendMessageToSlack("42. It's always 42", data, 0);
      }
      else if (data.event.text.includes("favorite color"))
      {
        await sendMessageToSlack("Purple", data, 0);
      }
      else if (data.event.text.includes(" add"))
      {

        try
        {
          let startIndex = data.event.text.indexOf("add") + 4;
          let fullString = data.event.text.slice(startIndex);
          let splitIndex = fullString.indexOf(':');
          let newTerm = fullString.slice(0, splitIndex - 1);
          let newDef = fullString.slice(splitIndex+2, data.event.text.length);

          await sendMessageToSlack("Adding item to the database...", data, 1);
          await sendToDB(newTerm, newDef);
          await sendMessageToSlack("The item has been added", data, 1);
  
        }
        catch (error)
        {
          console.error(error);
        }
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
          "For a more detailed list of all I can do, check out my Home Page by clicking on my user icon!";
        await sendMessageToSlack(help, data, 0);
      }
      else if (data.event.text.includes("show me the tags"))
      {
        // Tester case for making sure getting the list of tags works. Not for regular use
        let tagArrayItem = await getListOfTags();
        let message = "";

        tagArrayItem.lower.forEach((tag, index) => {
          if (index != tagArrayItem.lower.length - 1)
            message += tag + ", ";
          else
            message += tag;
        });

        await sendMessageToSlack(message, data, 1);
      }
      else 
      {
        await sendMessageToSlack("Sorry, I don't know how to handle that request yet.", data, 0);
      };

    break;
    case "home_opened":
      await displayHome(data.event.user);
    break;
  }

  return giveBack;
}

// Sends a request to the database for all the terms that are tagged with a certain tag, and returns a string with all the terms.
// Ben
async function findTermsWithTag(tag)
{
  let result;
  let response;

  tag = tag.toLowerCase();

  // create the JSON payload
  const params = {
    TableName : termTable,
    FilterExpression: "contains (LowerTags, :tag)",
    ExpressionAttributeValues : {   
      ':tag' : tag
    }
  }

  // Try catch block in case there are errors.
  try 
  {
    // Ask the database for all the terms
    result = await db.scan(params).promise();

    if (result.Count == 0)  // No terms with that tag
    {
      response = "I didn't find any terms tagged with " + tag + ".";
    }
    else    // Found some terms with that tag
    {
      // Start the response 
      if (result.Count == 1) {
        response = "I found " + result.Count + " term tagged with " + tag + ":\n";
      }
      else {
        response = "I found " + result.Count + " terms tagged with " + tag + ":\n";
      }

      // Generate the string of terms
      result.Items.forEach((item) => {
        response += "  - " + item.RegName + "\n";
      });
    } 
  }
  catch (e)
  {
    // Log the error and tell the user there was a problem.
    console.error(e);
    response = "Sorry, there was an error getting that info from the database.";
  }

  // Return the response string back to the calling method
  return response;
}

// Checks to see if a term has any tags, and returns a list of tags if it does.
// Ben
async function getTagsForTerm(term)
{
  let termData;
  let termTags;
  let lowerTermTags;

  // Get everything about the term. 
  termData = await queryDB(term);
  
  // Check to see if it has any tags
  if (termData.Item.hasOwnProperty("LowerTags")) // Already has tags
  {
    console.log("Found tags for the term");
    termTags = Array.from(termData.Item.RegTags);
    lowerTermTags = Array.from(termData.Item.LowerTags);
    console.log(termTags);
    console.log(lowerTermTags);

    let bothTags = {
      reg: termTags,
      lower: lowerTermTags
    };

    return bothTags;
  }
  else // Doesn't have any tags yet.
  {
    console.log("There are no tags for this term");
    return null;
  }
}

//Clay. Used Ben's updateTag function. 
async function updateDesc(term, newDesc)
{
  let desc = newDesc;
  let name = term;
  let response = "";
  let result;
  let sendback;

   const params = {
      TableName: termTable,
      Key: {
        LowerName: name.toLowerCase(),
        //"Desc": desc
      },
      UpdateExpression: 'set #a = :x',
      ExpressionAttributeNames: {
        '#a' : 'Desc',
      },
      ExpressionAttributeValues: {
        ':x' : desc
      }
    };

   result = await db.update(params).promise();
   if (result){
     console.log("Term Desc Updated Successfully");
   }
   sendback = name + " changed to " + desc;
   return sendback;
}
/*
  }
  catch (error)
  {
    console.error(error);
    response = "Sorry, there was an error updating the database.";
  }
*/

// Applys a list of tags to a given term
// Ben
async function applyTagToTerm(term, newTag)
{
  let tagObject = await getTagsForTerm(term);  // Array of all the tags that a term has, if any.
  let regTags;
  let lowerTags;
  let tagExists = false;
  let response = "";
  let result;

  // Check to see if the term's database entry has the tag attribute yet, since it isn't required when putting something in the database.
  if (tagObject === null) // Term doesn't the tag attribute yet
  {
    regTags = [newTag];
    lowerTags = [newTag.toLowerCase()];
    console.log(regTags);
    console.log(lowerTags);
  }
  else  // Term has tag attribute, so just push the new tag onto the array.
  {
    regTags = tagObject.reg;
    lowerTags = tagObject.lower;

    // Check to make sure the tag doesn't already exist
    lowerTags.forEach((item) => {
      if (item === newTag.toLowerCase())
      {
        console.log("Tag already exists on item");
        tagExists = true;
      }
    });

    if (tagExists) // Given tag was already in the list of tags for the term
    {
      // Tell the user that the term they want to tag already has that tag.
      response = term + " has already been tagged with " + newTag + ".\n" + "Currently, it has the tags: ";

      // List out the tags so that they know what the currents tags are
      regTags.forEach((item, index) => {
        if (index != regTags.length - 1)
          response += item + ", ";
        else
          response += item;
      });

      return response;
    }
    else  // This is a new tag for the term
    {
      // Put the new tag on the end of the array.
      regTags.push(newTag);
      lowerTags.push(newTag.toLowerCase());

      // Send this tag to the overall list of tags
      await addTagToListOfTags(newTag);
    }
  }

  // Update the database item with the new tag list
  // This might need to be it's own function? I'm not really sure yet, so I'll just put it here.
  const params = {
      TableName: termTable,
      Key: {
        LowerName: term.toLowerCase()
      },
      UpdateExpression: 'set #a = :x, #b = :y',
      ExpressionAttributeNames: {
        '#a' : 'RegTags',
        '#b' : 'LowerTags'
      },
      ExpressionAttributeValues: {
        ':x' : regTags,
        ':y' : lowerTags
      }
  };

  try 
  {
    result = await db.update(params).promise();
    console.log("Update Complete: \n" + result);

    // Tell the user that the term they want to tag already has that tag.
    response = term + " is now tagged with " + newTag + ".\n" + "It now has the tags: ";

    // List out the tags so that they know what the currents tags are
    regTags.forEach((item, index) => {
      if (index != regTags.length - 1)
        response += item + ", ";
      else
        response += item;
    });
  }
  catch (error)
  {
    console.error(error);
    response = "Sorry, there was an error updating the database.";
  }

  return response;
}

// Used for pushing data to the home tab of the bot. This could be a good spot for putting the help message, and other commonly needed things
// Ben
async function displayHome(user)
{
  const params = {
    user_id: user,
    view: modalData.homeTab,
  };

  try {
    const result = await Bot.views.publish(params);
    console.log("Displayed home tab.");
    console.log(result);
  }
  catch (error)
  {
    console.log("Error displaying the home tab.");
    console.error(error);
  }
}

// Creating and using this instead of queryDB to make it clear that all this does is get the desc of a term, and nothing else.
// Accepts - the term to be looked for
// Returns - either the term, null if not found, or -1 if there was an error thrown.
async function getDesc(term)  // Ben
{
  let response;
  term = term.toLowerCase();

  const params = {
    TableName: termTable,
    Key: {
      LowerName: term
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

// Gets all data/attributes about a single term from the database
// Ben
async function queryDB(term)
{
  // Convert the term to lowercase for checking
  term = term.toLowerCase();

  let params = {
    TableName: termTable,
    Key: {
      LowerName: term
    }
  };

  try{
    console.log("About to call the thing");
    let result = await db.get(params).promise();
    console.log("Got the thing");

    if (JSON.stringify(result) != "{}") 
    {
      console.log(JSON.stringify(result));
    } 
    else 
    {
      result = null;
      console.error("SOMETHING WENT WRONG");
    }

    return result;
  }
  catch (error) {
    console.error("ERROR: " + error);
  }
}

async function readFromDB()
{
  let listOfTerms = "";

  const params = {
    TableName: "AcronymData"
  }

  let result = await db.scan(params).promise();
  if (result) {
    console.log("Thing has been read");
    
    result.Items.forEach(function(item) {
      console.log(item.RegName);
      var tempString = item.RegName + ": " + item.Desc + "\n";
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
        "RegName": name,
        "LowerName": name.toLowerCase(),
        "Desc": desc,
        "LowerTags": [],
        "RegTags": []
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

// Function to be used for deleting a term from the database.
// Accepts the term, returns a string message based on if the term was deleted or not
// Ben
async function deleteTermFromDatabase(term)
{
  // Prepare the return variable
  let message = "";

  // First we gotta check if the term is even in the database
  let define = await getDesc(term);

  if (define == null)   // Term didn't exist in the database
  {
    message = "Sorry, I don't know that term. Guess I can't delete it!";
  }
  else if (define == -1)    // There was an error trying to find it
  {
    message = "Sorry, looks like there was an error finding that in the database. Please try again later.";
    console.error("Error trying to delete a term.");
  }
  else  // Found the term
  {    
    // Prepare the payload to send to Dynamo
    const deleteParams = {
      TableName: termTable,
      Key: {
        LowerName: term.toLowerCase()
      }
    };

    // Try deleteing the term!
    try {
      let result = await db.delete(deleteParams).promise();
      console.log(result);
      message = term + " has officially been deleted! I won't remember that term any more.";
    }
    catch (error)   // Uh oh, there was an error. Log it and notify the user.
    {
      console.error("There was an error deleting a term from the database.");
      console.error(error);
      message = "Sorry, there was an error deleting the term. Please try again later.";
    }
  }

  // Return the message to be sent back to the user
  return message;
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

async function postModal(data, viewData)
{
  let modal = {
    trigger_id: data.trigger_id,
    view: viewData
  }

  try{
    const result = await Bot.views.open(modal);

    console.log("Modal posted successfully!");
    console.log(result);
    return 0;
  }
  catch (error)
  {
    console.log("Error posting the modal");
    console.log(error);
    return -1;
  }
}

// This function is used to determine if we're working with a Slash Event, an interactive event trigger, or just a regular ol' message.
// Returns a string of the calling type to be used in getDataObject and run.
async function figureOutWhatCalledThis(data)
{
  let methodType = "";

  // Since data.body is currently a string, we can look at it and check for certain keywords within it to figure out what we're dealing with.
  if (data.body.includes('payload=%'))  // This is an interactive event, like a button press
  {
    // Leaving these console.logs in for now, since they give some pretty useful information.
    console.log("Payload Event");
    console.log(data);
    console.log(data.body);
    console.log(queryString.parse(data.body))

    methodType = "interaction"
  }
  else if (data.body.includes('token='))  // This is a Slash Command
  {
    console.log("Slash Event");
    console.log(data);
    console.log(data.body);
    console.log(queryString.parse(data.body))

    methodType = "slash"

  }
  else  // This is a regular message
  {
    console.log("Message Event");
    methodType = "message";
  }

  return methodType;
}

// This function will return the data object we need so that we can do work, based on the kind of event that triggered us, since they need to
//  be decoded differently depending on the kind of event.
async function getDataObject(data, method)
{
  // Now that we know what kind of 'payload' we're dealing with, we can parse it the correct way and send it back to the main function
  let dataObject;

  switch (method)
  {
    case "interaction":   // Interaction event, like a button pressed
      
      // Parse the data
      dataObject = JSON.parse(queryString.parse(data.body).payload);

      // Log it for debugging
      console.log("Parsed Data: ");
      console.log(dataObject);
      break;

    case "slash":   // Slash command

      // Parse the data
      dataObject = queryString.parse(data.body);

      // Log it for debugging
      console.log("Parsed Data: ");
      console.log(dataObject);
      break;

    case "message":   // User typed message

      // Parse the data
      dataObject = JSON.parse(data.body);

      // Log it for debugging
      console.log("Parsed Data: ");
      console.log(dataObject);
      break;

    default:  // This should never be reached. If it is, there was a mistake somehwere, so look at the logs and figure out why.
      console.error("There was an error somewhere. I am in the default case of getDataObject.");
      console.error("Method: " + method);
      console.error("Data: ");
      console.error(data);

      dataObject = -1;  // Set it to -1 so the calling method knows there was an error.
      break;
  }

  return dataObject;

}

// This function returns an object holding arrays of all tags applied to the database, both regular and all lowercase. 
// Or it will return null if nothing is found, or -1 if there is an error.
// Ben
async function getListOfTags()
{
  // set up some variables
  let result;

  // First, we gotta send a request to the database for the "TagList" item
  let params = {
    TableName: "Metadata",
    Key: {
      DataType: "TagList"
    }
  };

  try{
    console.log("Requesting item from database");
    result = await db.get(params).promise();
    console.log("Got the item");

    if (JSON.stringify(result) == "{}")  // Nothing was found in the database
    {
      console.log("Didn't get anything from the database");
      console.log(JSON.stringify(result));
      return null;
    } 
  }
  catch (error) {   // Some sort of error within dynamodb
    console.error("There was an error accessing the database.")
    console.error(error);
    return -1;
  }

  // Cool, we have the item. So now we just extract the arrays and return them
  let arrayHolder = {
    lower: result.Item.LowerTags,
    regular: result.Item.RegTags
  };
  console.log("Got the arrays");
  console.log(arrayHolder);

  return arrayHolder;
}

// To be used for updating the overall list of tags. Shouldn't really be called anywhere else other than AddTagToTerm
// Makes sure that getListOfTags is always up to date
// Ben
async function addTagToListOfTags(newTag)
{
  let tagExists = false;

  // First, we gotta get the lists of tags from the database
  let tagLists = await getListOfTags();
  
  // Now we need to make sure that the new tag isn't already inside this list. So compare the new tag (converted to lower case)
  //  to the array of tags that are already converted to lowercase
  tagLists.lower.forEach((item) => {
    if (item == newTag.toLowerCase())
    {
      tagExists = true;
    }
  });

  if (tagExists)  // tag is already in the overall list, no need to add it. Log it and return 0 to leave the function.
  {
    console.log("Tag is already in the list.");
    return 0;
  }

  // If we get here, then this is a totally new tag. So we need to add it to the arrays
  tagLists.regular.push(newTag);
  tagLists.lower.push(newTag.toLowerCase());

  // Now we need to update the database to reflect these new tag lists
  const params = {
    TableName: "Metadata",
    Key: {
      DataType: "TagList"
    },
    UpdateExpression: 'set #a = :x, #b = :y',
    ExpressionAttributeNames: {
      '#a' : 'RegTags',
      '#b' : 'LowerTags'
    },
    ExpressionAttributeValues: {
      ':x' : tagLists.regular,
      ':y' : tagLists.lower
    }
  };

  try 
  {
    result = await db.update(params).promise();
    console.log("Tag List has been updated: \n" + result);
  }
  catch (error)
  {
    console.error("There was an error updating the overall tag list.");
    console.error(error);
  }

  // We did it. So now just return 1 to say success, incase we want to add validation
  return 1;
}