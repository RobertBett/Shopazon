const mongoose = require('mongoose'); // Erase if already required
const Product = require('./Product');
const Order = require('./Order');
const Schema = mongoose.Schema;
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    password:{
        type: String,
        required: true,
        unique: true,
    },
    cart:{
        items:[{ 
            productId: { 
                type: Schema.Types.ObjectId, 
                required:true,
                ref: 'Product' 
            }, 
            quantity:{ 
                type: Number, 
                required: true
            }
        }]
    },
});

// methods key allows you to add your own custom methods
userSchema.methods.addToCart = function (product) {
    let quantity = 1; 
    const cartProductIndex = this.cart.items.findIndex(cartProduct => {
            return cartProduct.productId.equals(product._id);
        });

    const updatedCartItems = [ ...this.cart.items];

    if(cartProductIndex >= 0){
        quantity = this.cart.items[cartProductIndex].quantity + 1 ;
        updatedCartItems[cartProductIndex].quantity = quantity;
    }
    else{
        updatedCartItems.push({ 
            productId: product._id, 
            quantity
        });
    }

    const updatedCart = { 
        items: updatedCartItems
    }; 
    this.cart = updatedCart;

    return this.save();
};

userSchema.methods.deleteCartItem = function(productId){
    const updatedCartItems = this.cart.items.filter((item) => item.productId.toString() !== productId.toString())
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  this.save();
}

//Export the model
module.exports = mongoose.model('User', userSchema);