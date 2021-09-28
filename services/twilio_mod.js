/*
This Service provides us with the method of communication with twilio
*/
const accountSid = process.env.twilioAccountSID;
const authToken = process.env.twilioAuthToken;

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);
class Twilio_Client{
  //Using client Instance
  constructor(){
    this.client=client;
  }
  //Method to call the Twilio API
  async SendMessage(body,to){
    try{
    let Msg=await client.messages
      .create({
        body: body,
        to: to,
        from: process.env.twilioValidNumber
      })

      return Msg
    }catch(ex){
      console.log(ex);
      return new Error(ex.message);
    }
  }
}


module.exports = Twilio_Client
