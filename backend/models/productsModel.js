const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter Product Name"],   // if it is not true then please enter product price will show..
        trim:true
    },
    description:{
        type:String,
        required:[true, "Please Enter Product Description"]
    },
    price:{
        type:Number,
        required:[true, "Please Enter Price of Products"],
        maxLength:[8, "Price can not exceed 8 characters"]
    },
    ratings:{
          type:Number,
          default: 0
    },
    images:[
        {
            public_id:{                  //for image we upload will image on cloud, so that after uploading we get a
            type:String,                 // one public_id and one url...
            required:true
        },                               // we took a multiple images, so that we took Array and inside array 
        url:{                            // there is various object
            type:String,
            required:true
        }
    }
    ],
    category:{
        type:String,
        required:[true, "please Enter product category"]
    },
    Stock:{
        type:Number,
        required:[true, "Please Enter product Stock"],
        maxLength:[4,"Stock can not exceed 4 character"],
        default:1
    },
    NoOfReviews:{
        type:Number,
        default:0
    },
    Reviews:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
              },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("product", productSchema);