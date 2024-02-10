//ye middleware isliye bnaye hai jb hmme -- ex-->  rotes me jo products route hai ydi isme validation lgani ho ki jaise
// ki jo hmata route -> productRoute -> "getallproducts" wala route hai usko yese kre ki jb user is website pe login ho tabhi iss waale ko access kr skta hai ...

//for cookies -- we use cookie-parser in app.js ...


//isko mainly hmm createProduce, updateProduct, deleteProduct inn sb me lgayenge because yese thode na kr denge ki 
//koi is website pe aaye and oo ye sb functionlity krke chla jaaye .. uske liye sbs epehle login to krna hi padega ..

 


const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchasyncerror");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


// ye waal route hmm isliye bnaye hai ki jb tk hmm login rhenge tbtk hmm data yaani products ko access kr skte hai.... and jb bi hmm logout ho jaayenge to access nhi kr paayenge..
// sbse pehle ek baar login kr le and then aap access kr skte hai .... phir logout bhi hmm kr skte hai and uske liye --> UserController me liye hai ..


exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;  // curley bracket me token ko isliye rkhe hai kyunki jb hmm only token send krenge to ye hmme object ke form me token dega .. ex:-> { token: wejhu3ey93e98e2hdu2ey2},  this type me aayega ...  hmm simple yese hi likh kr and access krne ke liye hmme .token means dot token ka use krna padega jo ki hmm nhi chahenge .... so, isliye token ko simple paane ke liye we use {token} ...
                                   // Cookies ke liye hme app.js me cookiesParser ko require bhi krna padega ...
  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }
     
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);     

  req.user = await User.findById(decodedData.id);   //await User.findById(decodedData.id); iss waale kp req.user me save kr liye hai ... To -->  jb tk hmm login rhenge tbtk hmm reqest me se user ka data acess kr skte hai ...
                                                   // jbb hmm JWT Token bnna rhe the in USerModel me .. to hmm yha pe varify krke and usko hmm decodedData me store kr liye hai ... and jwt create krte time hmm id ka bhi use kiye the to yha pe ussi id ka use kiye hai ..find krne ke liye /\......
  next();
});





exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};