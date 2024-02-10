const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');       //no need to install.. this comes with inbuild module.

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,                                                  // Jab aap Mongoose schema mein select: false set karte hain, toh yeh batata hai ki jab bhi aap documents ko retrieve karte hain (database se data nikal rahe hote hain), to password field ko by default include nahi karna chahiye.
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },                                  // this same as image in products model --- same schema
      url: {                                // isko Array nhi bnayenge .. as Avatar to sirf ek hi hoga ..
        type: String,
        required: true,
      },
    },
    role: {
      type: String,                    // hmm kon sa role dene waale hai ... user ya admin 
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  });

    userSchema.pre("save", async function(next){  // here we will not use arrow function because arrow function me "this." waali property work nhi krti
      if(!this.isModified("password")){   // ye wala isliye ki maan lijiye jb hmm sirf email and name ko update kr rhe hai to hmm password ko update nhi kr rhe hai , but email and name ko bhi update krte time password apne aap update hojaayega and dusri hash apne aap create kr lega jo ki hmm nhi chahenge ... isliye ye wala likhe hia .. !this.isModified("password") --> ye btayega ki password modified hua hai ya nhi ... ydi hua hai then new HAsh create ho jaayega .... and ydi nhi hua hai to purana password hi hash hua rhega new password nhi create hoga..
         next();                              // password ko update krne ke liye dura hmm dekhenge ...
      }

      this.password = await bcrypt.hash(this.password, 10)     //yha pe 10 salt hai to hmm jittna hi bda salt ki value bnate hai uttna hi strong password ko hash krtga hai ... but dhyaan rhe ydi jyda bada salt ki value denge to oo jyda power consumotion bhi krega ...
    });

     // jaise user create krte time hmm ye dekhte hai ki jb hmm name, email, password se create krte hai tb hmm ussi time login ho jate hai ... 
     // To hmm isme kya krenge ki Token generate krke phir usse cookie me save kr denge ...


    //jwt token
       userSchema.methods.getJWTToken = function (){
        return jwt.sign({id:this._id}, process.env.JWT_SECRET, {    // process.env.JWT_SECRET isko hmm dotenv me save krenge , if we write that secret code in this line also .. then it may hackers can access to access in login ... means koi login kr skta hai isse ...
          expiresIn: process.env.JWT_EXPIRE, 
        });                                        // jwt.sign({id:this._id},   -->> jwt token generate krne ke liye sbse pehle id chahiye jo ki this._id --> jo ki yha pe this UserSchema._id hai ...  and iske baad secret key or Private Key  and then iske kuchh options de skte hai ex- ExpiresIn .. --> jb hmm Amazon pe dekhte hai tb jb hmm login krte hai tb uske 2 ya 4 din baad oo expires  kr jata hai means ki uska Token ab expire kr gya hai means ki dubara login and password type krna hai .... to wah issi ExpiresIN- ke kaarn hota hai ..
       };              // jwt.sign()  se hmara jwt Token generate ho jaayega ... 

          // isko bnane ke baad hmm use bhi kr liye hai userController me ...



          // userSchema.methods: This is a way in Mongoose to add instance methods to your schema.
          //  It's a special property where you can attach functions that will be available on each document 
          // instance created from the schema


       //compare password
       userSchema.methods.comparePassword = async function (password) {
        return await bcrypt.compare(password, this.password);      // isme password ko bcrypt kiye hai and then compare kiye hai 
      };                                                        // isko use kiye hai userController me ... in Login User ..
      
      // this.password means ki iss userSchema me jo password hai ohi password .... and only password mtlb entered password which we have entered ...
       
      



    // Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");        // The crypto module in Node.js provides cryptographic functionality, including methods for generating random bytes, hashing, and encryption.

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto     // resetPasswordToken --> isko hmm define kiye hai userSchema me  upper me ....
    .createHash("sha256")         //rypto.createHash ek function hai jo hash object banata hai. "sha256" argument batata hai ki SHA-256 algorithm ka use karna hai. SHA-256 ek cryptographic hash function hai jo ek fixed-size hash generate karta hai.
    .update(resetToken)            // iss resetPasswordToken ko simply hmm userSchema me save kr denge ...
    .digest("hex");
                        // ab hmm iss code ko use krke nodemailer ke through ek link bhenjne ki tyari krenge jisse ki
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;   // user uss link pe click krke phir apna new password 
                                                           // generate kr le .....
  return resetToken;                 
};                                       // isle liye hmm code likhe hai hmm .. controller -> userController ke andar


  // ab hmm yesa krenge ki NodeMailer ka use krke ab hmm ek mail share krenge jisse ki password reset ho skke ... and uss mail me hmm oo wala Toekn dedenge ....



// createHash("sha256"): Create a SHA-256 hash object.
// update(resetToken): Update the hash object's internal state with the content of resetToken.
// digest("hex"): Finalize the hash and obtain the hexadecimal representation of the hash.


  module.exports = mongoose.model("User", userSchema);