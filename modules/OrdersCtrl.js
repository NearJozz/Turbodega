const { Parser } = require('json2csv');
const fs = require('fs')

class OrderCtrl{
  constructor(phone){
    this.ticketId=new Date().getTime();
    this.phone=phone;
    this.order=null

  }
  async fillOrder(_items){
    try{
      let Articulos=await global.MongoClient.collection('Articulos');
      let arrIds=[]
      _items.map((d)=>{
        arrIds.push(d.item.productId);
      })
      let items=await Articulos.find(
        {codart : {$in:arrIds} },
        {projection : {_id:0,codart:1,descrip:1,valor:1,resto:1,peso:1}} ).toArray();
        if(items.length!=0){
          items.map(d=>{
            d.ticketId=this.ticketId.toString();
            let itemRequest=_items.filter(e=>e.item.productId==d.codart)
            d.netPrice=(d.resto*d.peso)*itemRequest[0].count;
            d.quantity=itemRequest[0].count;
            d.phone=this.phone.replace("whatsapp:","");
          })
          this.order=items;
          return true;
        }else{
          return null;
        }
    }catch(Ex){
      throw new Error(Ex.message);
    }
  }
  async saveOrder(){
    try{
      let Orders=await global.MongoClient.collection('Ordenes');
      let resp= await Orders.insertMany(this.order)
      let csv=jsonToCsv(this.order);
      saveFile(csv,`${process.env.outputCsvOrders}Order_${this.ticketId.toString()}.csv`)
      .then(res=>{
        console.log('Orden Csv creada');
      }).catch(Ex=>{
        throw new Error(Ex.message)
      })
      return resp;
    }catch(Ex){
      throw new Error(Ex.message)
    }
  }

}

module.exports = OrderCtrl;

function jsonToCsv(data,header=true){
  let json2csvParser = new Parser({header:header,quote:"'"});
  let csv = json2csvParser.parse(data);
  return csv;

}
function saveFile(content,path){
  return new Promise((resolve, reject)=>{
    fs.writeFile(path, content,{flag: 'a+'}, err => {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve();
    })

  });
}
