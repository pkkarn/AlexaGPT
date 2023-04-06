# AlexaGPT
AWS Lambda code for ChatGPT Api with Alexa Integration...

## Handler for Custom SearchQuery Intent

```js
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
```

- If requestType is `IntentRequest` and IntentName is `SearchQuery` (custom defined intent)
- then receive {prompt} passed as an argument e.g `Alexa ask gpt to search {prompt}`, etc.
- And then fetch response from GPT using OpenAI and send response back to alexa.
