import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
    createReview,
    getReviews,
    deleteReview,
    markReviewHelpful,
    markReviewNotHelpful
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", verifyToken, createReview)
router.get("/:portfolioId", getReviews)
router.delete("/:id", deleteReview)
router.post("/:reviewId/helpful", verifyToken, markReviewHelpful);
router.post("/:reviewId/not-helpful", verifyToken, markReviewNotHelpful);


export default router;