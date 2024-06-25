import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// Importing controllers and middlewares
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// Route definitions
router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);

router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(checkId, fetchProductById) // Added checkId middleware to validate ID before fetching
  .put(authenticate, authorizeAdmin, checkId, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, checkId, removeProduct);

router.route("/filtered-products").post(filterProducts);

export default router;
