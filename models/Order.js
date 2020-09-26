const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema({
    products:[{ 
        productData: { 
            type: Object,
            required:true,
            ref: 'Product' 
        }, 
        quantity:{ 
            type: Number, 
            required: true
        }
    }],
    user:{
        userName:{
            type:String,
            required:true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true
        }
    }
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);