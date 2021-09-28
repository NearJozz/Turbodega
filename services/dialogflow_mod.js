/*
This module provides the communication method with the Dialog Flow service
*/
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid')
const utils = require('./utils.js')

// A unique identifier for the given session
const sessionId = uuid.v4()
const dialogflowCredentials=require(process.env.dialogflowCredentials)
const key = dialogflowCredentials//JSON.parse(dialogflowCredentials)

// Creates a session client from a Google service account key.
const sessionClient = new dialogflow.SessionsClient({
  projectId: key.project_id,
  credentials: {
    client_email: key.client_email,
    private_key: key.private_key,
  }
})
const sessionPath = sessionClient.projectAgentSessionPath(key.project_id, sessionId)


// The text query request. with current Session
async function dfRequest(message,lenguage){
  try{
    let nOut={Query:null,Intent:null,ResponseText:null,Params:null}
    const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: message,
        // The language used by the client (en-US)
        languageCode: lenguage,
      },
    },
  }

    // Send request and log result
    const responses = await sessionClient.detectIntent(request)
    // console.log('Detected intent')
    let params=utils.structProtoToJson(responses[0].queryResult.parameters)
    // console.log(params);
    nOut.Params=params;
    // console.log(responses[0].queryResult.parameters.fields.item.structValue.fields.IDItem);

    const result = responses[0].queryResult

    // console.log(`Query: ${result.queryText}`)
    nOut.Query = result.queryText
    // console.log(`Response: ${result.fulfillmentText}`)
    nOut.ResponseText = result.fulfillmentText
    if (result.intent) {
      // console.log(`Intent: ${result.intent.displayName}`)
      nOut.Intent=result.intent.displayName;
    } else {
      // console.log(`No intent matched.`)
    }
    return nOut;
  }catch(Ex){
    return new Error(Ex.message)
  }
}


module.exports = dfRequest
