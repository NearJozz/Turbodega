const { MongoClient } = require("mongodb");

module.export = async ()=>{
  try{
    console.log(process.env);
    let uri=process.env.mongodbPath;
    let client = new MongoClient(uri);
    await client.connect()
    let db= client.db(process.env.db)
    return client
  }catch(Ex){
    throw new Error(Ex)
  }
}
