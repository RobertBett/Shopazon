const { ObjectId } = require('mongodb');

const getDb = require('../utils/database').getDb;


class Product {
    constructor(title, price, imageUrl, description, id){
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl,
        this.description = description;
        this._id = id;
    }

    save(){
        const db = getDb();
        let dbOp;
        if(this._id){
            dbOP = db.collection('products')
                    .updateOne({_id: ObjectId(this._id)}, { $set: this });
        }else{
            dbOp = db.collection('products')
                    .insertOne(this)
        }
        
        return dbOp
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                console.error(err); 
            });
    };

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
        .then((result) => {
            return result;
        }).catch((err) => {
            console.error(err);  
        });
    };

    static findById(id){
        const db = getDb();
        return db.collection('products').findOne({ _id: ObjectId(id) })
        .then((product) => {
            return product
        }).catch((err) => {
            console.error(err);
        });
    }
};

module.exports = Product;