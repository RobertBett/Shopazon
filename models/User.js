const { getDb } = require('../utils/database');
const { ObjectId } = require('mongodb');
class User {
    constructor( username, email, cart, userId){
        this.username = username;
        this.email = email;
        this.cart = cart;
        this.userId =  ObjectId(userId);
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
        let quantity = 1; 
        const cartProductIndex = this.cart.items.findIndex(cartProduct => {
            return cartProduct.productId.equals(product._id);
        });
        const updatedCartItems = [ ...this.cart.items];
        console.log(updatedCartItems, 'WHATS THIS LOOK LIKE??')
        if(cartProductIndex >= 0){
           quantity = this.cart.items[cartProductIndex].quantity + 1 ;
           updatedCartItems[cartProductIndex].quantity = quantity;
        }
        else{
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity});
        }
        
        const updatedCart = { 
            items: updatedCartItems
        }; 

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