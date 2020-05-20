const getDb = require('../utils/database');

class CartItem {
    constructor(quantity, price){
        this.quantity = quantity,
        this.price = price
    }

    save(){
        const db = getDb();
        db.collection('cart')
            .insertOne(this)
            .then((result) => {
                console.log(result)
            }).catch((err) => {
                console.error(err);
                
            });
    }
}

module.exports = CartItem;