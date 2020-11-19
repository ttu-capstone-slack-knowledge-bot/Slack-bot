'use strict'


const Slack = require('slack');

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

          handleEvent(dataObject);

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
          text: "blue"
        };

        Slack.chat.postMessage(params);
        return;
      }
    break;
  }

}