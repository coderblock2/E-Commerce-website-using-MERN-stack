const ErrorHander = require("../utils/errorhandler");
const catchasyncerror = require("../middleware/catchasyncerror");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const cloudinary = require("cloudinary");

// Register a User
exports.registerUser = catchasyncerror(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    // avatar : {
    //   public_id: "my photo",
    //   url: "any sample url for avatar"
    // }
  });

  // const token = user.getJWTToken();   // isse hmara Token save ho jaayega .. and bnn jaayega .. and isko hmm use bhi kr liye

  // res.status(201).json({
  //     success: true,                   // hmm ittne saare line ki comment krke uske jgh pe sirf ek line me likh diye
  //     token                            // jisse ki hmara code ekdm fresh dikhne lga...
  // });
  //  -->> iska code ko hmm jwtToken.js me likhe huye hai ..
  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchasyncerror(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email: email }).select("+password"); // --> as password ko ->UserModel me -->  (select: false)  kiye hai to isliye hmm (+password) likhe hue hai ...  isse hua ki hmara jo pasword hai usko get kr liye issi ke saath me ..
  // --> isme pehle Email check kremge and then passwod bhi check kr lenge ....
  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password); // here we have checked Password ....  comparePassword ye function hmm logo ne bnaye hai UserModel me ... so it is not a function..

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401)); // yha pe to mainly password hi check kiye hai ... if this gives false and if we return that only Password is incorrect then it may be risky ,, so that i have also gibe invalid email and assword for security reason...
  }

  // const token = user.getJWTToken();
  // res.status(200).json({
  //     success: true,
  //     token
  // });

  sendToken(user, 200, res);
});

//Logout User

exports.logOut = catchasyncerror(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()), // yha pe ye hua hai ki jo hmm login kiye kiye hai oo cookies ke help se kiye hai ..... and jb hmm cookie ko hi null kr denge to hmm apne app logout ho jaayenge ...
    httpOnly: true, // to logout me hmm yha cookie ko hi nulll kr diye hai ..
  }); // cookie ke andr hmm tin chij dete hai ... 1) koi keyword  2) jo token ko oo dete hai .. is case me null kr diye hai.
  // 3) options dete hai -- expires: ......, httpOnly: true  ---->> yhi dete hai options me ..
  //  expires: new Date(Date.now()),     -->> Date.now() --> means ki abhi ke abhi expire kr jaye ..
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
exports.forgotPassword = catchasyncerror(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = User.getResetPasswordToken;

  await user.save({ validateBeforeSave: false }); // jo hmm userModel me resetPasswordToken bnaye the oo to hmne save hi nhi kiya hai ..  kyunki userModel to hmne pehle se hi save kr liye hia ab hmm new userModel to hmne save hi nhi kiya hai ... isliye yha pe save krke userModel me bhi ye wala token save kr denge ...

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host" // http://localhost/api/v1/password/reset/${resetToken}  ... is waale form me url aayega ..
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      // sendEmail route ka use krke ek mail send krenge ....
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false }); // Undefined krne ke baad save bhi to krna padega ... to isiye ye wala code likhe hai ..

    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchasyncerror(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token) // ohi token lenge jo hmm link me share kiye hai .. last me
    .digest("hex");

  // jo ye hash Token apne database me dhundenge ..  ki ye hash token exist krti hai ya nhi ....

  const user = await User.findOne({
    resetPasswordToken, // iss function ko use hmm hash token ko dhundne ke liye hi use kiye hai .....
    resetPasswordExpire: { $gt: Date.now() }, // isme hmm expire time bhi dhundenge .. because hmm database me expire time bhi save kiye huye hai ...  expire time greater than honi chahiye ..
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined; // yha inn dono ko hmm undefined kr denge because iska ab kuchh use nhi rh gya hia ... ydi dubara hmme password reset krni ho to oo dubara se link share krke dubara se token generate kr skta hai ...

  await user.save();

  sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetails = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user.id); // isko id milegi route se ... jha hmm isAuthenticatedUser define kiye hai as a middleware .... isse me se id milegi yha ...

  res.status(200).json({
    success: true, // jb hmmm get krenge tb hmme password nhi dikhegi because hmne Password ko -- select: false; kiya hua hai...
    user,
  });
});

// update User password
exports.updatePassword = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword); //You use the comparePassword method (presumably implemented using bcrypt) to compare the provided old password (req.body.oldPassword) with the hashed password stored in the database.

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update User Profile

exports.updateProfile = catchasyncerror(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email, // yha pe hmm name and email dono ko saath me hi update krna padega because dono ko req kiya gya hai .....  to ye bhi to ho skta hai ki hmme sirf name hi updaye krna hi ya sirf email krna ho ..... but iss route me dono saath me hi update krna padega .... to iski chinta nhi krni hai ... as iska kaam hmm frontend me kr lenge ....
  };

  //we will add cloudnary later ......
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all users(admin)
exports.getAllUser = catchasyncerror(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchasyncerror(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  await user.deleteOne({ id: "req.params.id" });

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
