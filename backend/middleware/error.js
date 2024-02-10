const Errorhandler = require('../utils/errorhandler');

module.exports = (err, req, res, next)=>{
   err.statusCode = err.statusCode || 500;
   err.message = err.message || "Internal server error";

  //wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ID: ${err.value}`;
    err = new Errorhandler(message, 400 );
   
  }


    // Mongoose duplicate key error
    if (err.code === 11000) {            // yese jb hmm postman pe testing kr rhe the  and jb yese error aate hai the oo 11000 code hi show ho rha tha ... that's why..
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new Errorhandler(message, 400);
    }



    // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

  
    
   res.status(err.statusCode).json({
    success: false,
    message: err.message,
         // is we use error:err.stack   ---> then it will show all of yours error, kha error aa rha hai ...
   });
};