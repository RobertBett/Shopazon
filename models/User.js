// const { getDb } = require('../utils/database');
// const { ObjectId } = require('mongodb');
// class User {
//     constructor( username, email, cart, userId){
//         this.username = username;
//         this.email = email;
//         this.cart = !cart? {items:[]} :cart;
//         this.userId = userId && ObjectId(userId);
//     }

//     save(){
//         const db = getDb();
//         db.collection('user').insertOne(this)
//             .then()
//             .catch((err) => {
//                 console.error(err);    
//             });
//     }

//     addToCart(product){
//         let quantity = 1; 
//         const cartProductIndex = this.cart.items.findIndex(cartProduct => {
//             return cartProduct.productId.equals(product._id);
//         });
//         const updatedCartItems = [ ...this.cart.items];
//         if(cartProductIndex >= 0){
//            quantity = this.cart.items[cartProductIndex].quantity + 1 ;
//            updatedCartItems[cartProductIndex].quantity = quantity;
//         }
//         else{
//             updatedCartItems.push({ 
//                 productId: new ObjectId(product._id), quantity
//             });
//         }
//         const updatedCart = { 
//             items: updatedCartItems
//         }; 

//         const db = getDb();
//         return db.collection('user')
//         .updateOne(
//             { _id: this.userId}, 
//             { $set:{ cart:updatedCart } } 
//         );
//     }
//     getCart(){
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId
//         }); 
//         return db.collection('products').find({_id: { $in: productIds}}).toArray()
//         .then((products) => {
//             return products.map((product) => { 
//                 return{ 
//                     ...product, 
//                     quantity: this.cart.items.find((cartProduct) => cartProduct.productId.equals(product._id)).quantity 
//                 }})
//         })
//     }

//     deleteCartItem(productId){
//         const updatedCartItems = this.cart.items.filter((item) => item.productId.toString() !== productId.toString())
//         const db = getDb();
//         return db.collection('user')
//         .updateOne(
//             { _id: this.userId}, 
//             { $set:{ cart:{items:updatedCartItems} } } 
//         );
//     }
//     addOrder(){
//         const db = getDb();
//         return this.getCart()
//             .then((products) => {
//                 const order = {
//                     items:products,
//                     user:{
//                         _id: new ObjectId(this.userId),
//                         username:this.username,
//                         email: this.email,
//                     }
//                 }; 
//                 return db.collection('orders').insertOne(order)
//             })
//             .then(() => {
//                 this.cart = { items:[]};
//                 return db.collection('user')
//                 .updateOne(
//                     { _id: this.userId}, 
//                     { $set:{ cart:{ items:[] } } } 
//                 );
//             }).catch((err) => {
//             console.error(err);  
//             });
//     }
//     getOrders(){
//         const db = getDb();
//         return db.collection('orders').find({'user._id': new ObjectId(this.userId)}).toArray();
//     }

//     static findById(userId){
//         const db = getDb();
//         return db.collection('user').findOne({ _id: ObjectId(userId) })
//             .then((user) => {
//                 return user;
//             }).catch((err) => {
//                 console.error(err);
 
//             });
//     }
// }


// module.exports = User;