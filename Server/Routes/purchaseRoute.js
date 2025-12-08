import express from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getCourseDetailWithPurchaseStatus,
  stripeWebhook,
} from "../Controller/purchaseCourseController.js";

const router = express.Router();

router.post("/checkout/create-checkout-session", isAuthenticated, createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
router.get("/course/:courseId/detail-with-status", isAuthenticated, getCourseDetailWithPurchaseStatus);
router.get('/',isAuthenticated,getAllPurchasedCourse);

export default router;
