class ItemCtr{
  async getItem(productId){
    try{
      let Products = global.MongoClient.collection('Articulos');
      let Stock = global.MongoClient.collection('Stock');
      let Item = await Products.findOne(
        { codart:productId },
        { projection: {codart:1,descrip:1,peso:1,resto:1} }
      )
      if(Item != null){
        let itemStock = await Stock.findOne(
          { codart : productId},
          { projection : { stock:1 } }
        )
        if(itemStock!=null){
          Item.stock=itemStock.stock;
        }else{
          Item.stock=null;
        }
        Item.cost = Item.peso * Item.resto;
        return Item
      }else{
        return null
      }
    }catch(Ex){
      throw new Error(Ex.message);
    }
  }
  itemToText(item){
    let format=
    `Product id : ${item.codart}\nDescription : ${item.descrip}\nCost : $${item.cost}\nStock : ${(item.stock!=null)?item.stock:"Out of Stock"}`;
    return format.toString();

  }
}
module.exports = ItemCtr;
