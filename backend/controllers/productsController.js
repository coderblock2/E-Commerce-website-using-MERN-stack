const Product = require('../models/productsModel');
const Errorhandler = require('../utils/errorhandler');
const catchasyncerror = require('../middleware/catchasyncerror');
const Apifeatures = require('../utils/Apifeatures');


//create Product -- Admin 
exports.createProduct = catchasyncerror(async(req,res,next)=>{

    req.body.user = req.user.id;
    const newproduct = await Product.create(req.body);

    res.status(200).json({                           // as we use async function here .. to isliye async function ke liye 
        success:true,                           // hmme try catch ka bhi use krna jruri hai ... to hmm try catch ko apne issi
        product:newproduct                   // function me direct na likh kr usse ek middleware me code ko likhe 
    })                                    // and then we pass in this code ... isse bhut saare ek hi type ke code and length code likhne se bch jaayenge ..
}); 
                                           // yese hi same baaki sbhi function ke liye kr de...

//Get All Products
exports.getallProducts = catchasyncerror(async (req, res) => {
  
  const resultPerPage = 5;
  const productsCount = await Product.countDocuments();

  const ApiFeatures = new Apifeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);

      // let myproduct = await ApiFeatures.query;

      // let filteredProductsCount = myproduct.length;

      // ApiFeatures.pagination(resultPerPage);

       const myproduct = await ApiFeatures.query; // Add .exec() to execute the query

  res.status(200).json({
      success: true,
      product: myproduct,
      productsCount,
      resultPerPage,
      // filteredProductsCount
  });
});



//Get Product Details

exports.getProductDetails = catchasyncerror(async(req,res,next)=>{

    const findProduct = await Product.findById(req.params.id);

    // if(!findProduct){
    //     return res.status(500).json({
    //         success:false,                   // hmne ittne saare code ko sirf 2 line me kr diya by using 
    //         message:"Product not found"      // error handler in utils and through middleware
    //     })
    // }

    if(!findProduct){
        return next(new Errorhandler("products not found", 404));
    }

    res.status(200).json({
        status:true,
        product:findProduct
    })
});


//Update All Products  -- Admin
exports.updateproducts = catchasyncerror(async (req,res,next)=>{
  
     const foundProduct = await Product.findById(req.params.id);

     if(!foundProduct){
        return next(new Errorhandler("products not found", 404));
    }   

     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {   // req.body ke through hmm update denge jo bhi dena hai ...
        new:true,                            // first argument req.params.id-- it means i have to type id in params and it checks andn then 
        runValidators:true,                 //  second parameter is for give update what we want to give update to users.
        useFindAndModify:false
     })
     
     res.status(200).json({
         success:true,
         product:updatedProduct
     })
});


//Delete Products
exports.deleteProducts = catchasyncerror(async (req,res,next)=>{

    const findProduct = await Product.findById(req.params.id);

    if(!findProduct){
        return next(new Errorhandler("products not found", 404));
    }

    await findProduct.deleteOne({id: "req.params.id"}); 

    res.status(200).json({
        status:true,
        message:"Products deleted successfully"
    })
});




// Create New Review or Update the review   ---  // hmm isi me review ko update bhi kr denge ydi pehle se review de rkha hia to change kr skte hai ... and ydi first time review de rhe ho to aap create bhi kr skte hai review .....
exports.createProductReview = catchasyncerror(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {       // req.user ek custom property hai jo commonly Express.js applications mein authentication ke context mein use hoti hai. Yeh property user ki details ko store karne ke liye hoti hai, jaise ki user ID, email, roles, etc. Is property ko populate karne ka mukhya kaaran usually user ko authenticate karne ka process hota hai.
      user: req.user._id,          // productModel me hmm Reviews waale section me hmm yhi four define kiye hai ...
      name: req.user.name,   
      rating: Number(rating),  //isme rating ko hmm Number me convert kr diye hai ... btw Rating Number me hi rhti hai ..
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.Reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()    // isme hmm id se hi compare krenge as hmmne user me "req.user._id" hi store kiye hai ...
    );                         // ProductModel me hmm review ko ek array ke format me diye hai ... taht's why we will traverse in it by using find or by forEach .. in it.
  
    if (isReviewed) {
      product.Reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
        rev.rating = rating;
        rev.comment = comment;
      });
    } else {
      product.Reviews.push(review);
      product.NoOfReviews = product.Reviews.length;
    }
  
    let avg = 0;
  
    product.Reviews.forEach((rev) => {    // isme hmlog overall rating fid kiye hai .... jo ki productModel ke andr ek sur model hai ratings krke ... ussi me store kr denge ...
      avg += rev.rating;
    });
  
    product.ratings = avg / product.Reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Get All Reviews of a product
  exports.getProductReviews = catchasyncerror(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new Errorhandler("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.Reviews,
    });
  });
  
  // Delete Review
  exports.deleteReview = catchasyncerror(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new Errorhandler("Product not found", 404));
    }
  
    const reviews = product.Reviews.filter(
      (rev) => {
        console.log("rev._id:", rev._id);
         console.log("req.query.id:", req.query.id);
        rev._id.toString() !== req.query.id.toString()
      }
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        Reviews: reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });
  