const express = require("express")

const {processPayment, sendStripeApiKey } = require("../controllers/paymentControllers")

const router = express.Router();

const {isAuthenticatedUser} = require("../middleware/auth")

// router.route("/payment/process").post(isAuthenticatedUser, processPayment)
router.route("/payment/process").post( processPayment)

// router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey)
router.route("/stripeapikey").get( sendStripeApiKey)

module.exports = router