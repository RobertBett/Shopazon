const getDb = require('../utils/database');

class Cart {
    constructor(){
        
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

module.exports = Cart;