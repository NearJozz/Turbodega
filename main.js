require('dotenv').config();
const express = require('express')
const Server = express()
const { MongoClient } = require("mongodb");
const port = process.env.httpPort;
const routes =require('./routes/index')
const ngrok = require('ngrok');

Server.use(express.json());
Server.use(express.urlencoded({ extended: true }));


Server.use('/api', routes);
Server.listen(port,() => {
  console.log(`Server listening at http://localhost:${port}`)
  ngrok.connect(port).then(async url=>{
      console.log("It is necessary to change in your Twilio session the domain where the hook points with this url:");
      console.log(url);
      try{
        let uri=process.env.mongodbPath;
        let client = new MongoClient(uri);
        await client.connect()
        let db= client.db(process.env.db)
        global.MongoClient=db;
        console.log("Mongo conection OK!");
      }catch(Ex){
        throw new Error(Ex)
      }
  }).catch(Ex=>{
    console.log(Ex);
  })

})
