// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();    // yha se hmme Token mil jaayega.....
   
    // options for cookie   -- isme hmm Token ko Cookies me Store krenge ....
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000   // is used to convert day into time ..    -> 
      ),                                                             // isse btayega ki cookie kittne time baad exoire hogi ...
      httpOnly: true,
    };
  
    res.status(statusCode).cookie("token", token, options).json({  // isme phle parameter koi ek keyWord hogi jo ki isme "token hi hai", and then Token, and then options
      success: true,
      user,
      token,
    });
  };
  
  module.exports = sendToken;
  