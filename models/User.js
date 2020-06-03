const { getDb } = require('../utils/database');
const { ObjectId } = require('mongodb');
class User {
    constructor( username, email, cart, userId){
        this.username = username;
        this.email = email;
        this.cart = cart;
        this.userId = userId && ObjectId(userId);
    }

    save(){
        const db = getDb();
        db.collection('user').insertOne(this)
            .then()
            .catch((err) => {
                console.error(err);    
            });
    }

    addToCart(product){
        // const cartProduct = this.cart.items.findIndex( cartProduct => {
        //     return cartProduct._id === product._id;
        // });

        const updatedCart = { items: [{productId: ObjectId(product._id) ,quantity:1 }]};
        const db = getDb();

        return db.collection('user')
        .updateOne(
            { _id: this.userId}, 
            { $set:{ cart:updatedCart } } 
        );
    }

    static findById(userId){
        const db = getDb();
        return db.collection('user').findOne({ _id: ObjectId(userId) })
            .then((user) => {
                return user;
            }).catch((err) => {
                console.error(err);
 
            });
    }
}


module.exports = User;