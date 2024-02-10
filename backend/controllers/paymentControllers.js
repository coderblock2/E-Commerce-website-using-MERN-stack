const catchAsyncError = require("../middleware/catchasyncerror")

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.processPayment = catchAsyncError(async (req,res,next) => {

    const myPayment = await stripe.paymentIntents.create({
        amount: req.payment.amount,
        currency: "inr",
        metadata: {
            company: "Ecommerce",
        }
    });

    res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret
    })
})


exports.sendStripeApiKey = catchAsyncError(async (req,res,next) => {
  res.status(200).json({stripeApiKey: process.env.STRIPE_API_KEYS})        // iss function ko sirf isliye bnaya gya hai kyuki stripe api keys hai oo frontend me send kiya ja skke .... as yha .env file me rahega to secure rahega ...
})