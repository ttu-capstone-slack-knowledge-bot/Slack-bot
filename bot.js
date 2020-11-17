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
    break;
  }

}