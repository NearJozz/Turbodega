const express = require('express');
const router = express.Router();
const ItemCtr = require('./../modules/ItemCtrl.js')
const OrdersCtrl = require('./../modules/OrdersCtrl.js')
const DialogFlow_Req= require('./../services/dialogflow_mod.js')
const Twilio_Mod=require('./../services/twilio_mod.js')
const Twilio_inst=new Twilio_Mod();

//informative project path
router.get('/', function(req, res, next) {
  res.status(200).json({ version:'1.0.0',descripcion:"Technical test for Turbodega",author:"Ing. Josué Martínez Mondragón",fechaCreacion:"26/09/2021"  })
});
//twilio hook path
router.post('/message',async(req,res,next)=>{
  try{
    //request body validation
    if(req.body.Body!=undefined && req.body.From!=undefined){
      let Body=req.body.Body;
      let From=req.body.From;
      let NN=await DialogFlow_Req(Body,'en-US')
      console.log(NN);
      let message="";
      let Response=null;
      switch (NN.Intent) {
        case "getItem":
          let IC = new ItemCtr()
          let Item = await IC.getItem(NN.Params.item.productId);
          if(Item!=null){
             message=IC.itemToText(Item);
             Response=await Twilio_inst.SendMessage(message,From);
           }else{
             message=`the product you are looking for does not exist, verify your information, please`
             Response=await Twilio_inst.SendMessage(message,From);
           }
             break;
          case "createOrder":
              let OC = new OrdersCtrl(From);
              let statusOrder=await OC.fillOrder(NN.Params.Orders);
              if(statusOrder!=null){
                await OC.saveOrder();
                //message format
                message=`Your order was successfully created with ID:
                ${OC.ticketId}
                `
                Response=await Twilio_inst.SendMessage(message,From);
              }else{
                message=`Your order could not be processed verify your products, please`
                Response=await Twilio_inst.SendMessage(message,From);
              }
                break;
            default:
            Response=await Twilio_inst.SendMessage(NN.ResponseText,From);

      }
      res.status(200).json({});

    }else{
        res.status(400).json({message:"Parametros incompletos o ausentes"})
    }
  }catch(Ex){
    res.status(500).json({message:Ex.message})
  }
});

module.exports = router;
