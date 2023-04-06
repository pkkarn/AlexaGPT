const Alexa = require('ask-sdk-core');
const axios = require('axios')


const gpt = async (prompt) => {
    const token = 'xxx'
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": prompt}]
        }, {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    })

    // console.log(response.data)
    return response.data.choices[0].message.content;
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to A-One GPT';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Welcome to A-One GPT. Ask me anything', speechText)
      .getResponse();
  }
};

const SearchQueryHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SearchQuery'
    },

    async handle(handlerInput) {
        const promptSlotValue = handlerInput.requestEnvelope.request.intent.slots.prompt.value;
        const responseSpeec = await gpt(promptSlotValue)
        return handlerInput.responseBuilder
            .speak(responseSpeec)
            .reprompt(responseSpeec)
            .withSimpleCard('Bro', responseSpeec)
            .getResponse();
    }
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask me anything';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('You can ask me anything', speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Goodbye!', speechText)
      .withShouldEndSession(true)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    // Any clean-up logic goes here.
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(`Error handled: ${error.message}`)
      .reprompt(`Error handled: ${error.message}`)
      .getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    SearchQueryHandler,
    AskWeatherIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();