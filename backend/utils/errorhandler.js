class Errorhandler extends Error {
   constructor(message, statusCode) {
     super(message);
     this.statusCode = statusCode; // Corrected the case to statusCode
 
     Error.captureStackTrace(this, this.constructor);
   }
 }
 
 module.exports = Errorhandler;
 