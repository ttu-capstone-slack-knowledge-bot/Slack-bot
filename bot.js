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

          await handleEvent(dataObject).then(() => {
            callback(null, {
                statusCode: 201,
                body: 'Yay',
                headers: {
                    'Access-Control-Allow-Origin' : '*'
                }
            });
          }).catch((err) => {
              console.error(err);
          });

          response.body = {ok: true};

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

function handleEvent(data)
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
      else if (data.event.text.includes("devops"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle and provide continuous delivery with high software quality. DevOps is complementary with Agile software development; several DevOps aspects came from Agile methodology."
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("+term"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "seo has been successfully added"
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("seo"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "search engine optimization"
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("ftp"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "Sorry, I don't know that term yet."
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("-term"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "http has been removed"
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("help"))
      {
        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "Command formatting:\n@Cappy (term) ------------------------- asks the bot for the definiton\n@Cappy What is (term)? -------------- asks the bot for the defintion\n\n@Cappy +term (term)::(definition) --- adds a term to the bot's dictionary\n@Cappy -term (term) ------------------ removes a term from the bot's dictionary\n\nNote: \n() signify to insert a word/phrase into the formatting.\nFor example, to insert the term \"seo\" into the bot's dictionary, type @Cappy +term seo::search engine optimization"
        };

        Slack.chat.postMessage(params);
        return;
      }
      else if (data.event.text.includes("add"))
      {
        const table = "AcronymData";
        const name = "AWS";
        const desc = "Amazon Web Services";
        
        const params = {
            TableName:table,
            Item:{
                "Name": name,
                "Desc": title,
            }
        };

        const params = {
          token: process.env.AUTH_TOKEN,
          channel: data.event.channel,
          text: "Item has been added."
        };

        Slack.chat.postMessage(params);
        
        return docClient.put(params).promise();
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