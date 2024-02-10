const express = require('express');
const { getallProducts, createProduct, updateproducts, deleteProducts, getProductDetails, createProductReview, getProductReviews, deleteReview } = require('../controllers/productsController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/products').get( getallProducts)

router.route("/admin/products/new").post( isAuthenticatedUser, authorizeRoles("admin"), createProduct)

router.route("/admin/products/:id").put( isAuthenticatedUser, authorizeRoles("admin"), updateproducts);

router.route("/admin/products/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProducts);

router.route("/products/:id").get( getProductDetails );

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;