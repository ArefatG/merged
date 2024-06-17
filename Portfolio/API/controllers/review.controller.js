import createError from "../utils/createError.js";
import Review from "../models/review.model.js";
import portfolio from "../models/portfolio.model.js";

export const createReview = async(req, res, next) => {

    const newReview = new Review({
        userId: req.userId,
        portfolioId: req.body.portfolioId,
        desc: req.body.desc,
        star: req.body.star,
    });

    try {
        const review = await Review.findOne({
            portfolioId: req.body.portfolioId,
            userId: req.userId,
        });

        if (review)
            return next(
                createError(403, "You have already created a review for this portfolio!")
            );



        const savedReview = await newReview.save();

        await portfolio.findByIdAndUpdate(req.body.portfolioId, {
            $inc: { totalStars: req.body.star, starNumber: 1 },
        });
        res.status(201).send(savedReview);
    } catch (err) {
        next(err);
    }
};

export const getReviews = async(req, res, next) => {
    try {
        const reviews = await Review.find({ portfolioId: req.params.portfolioId });
        res.status(200).send(reviews);
    } catch (err) {
        next(err);
    }
};
export const deleteReview = async(req, res, next) => {
    try {} catch (err) {
        next(err);
    }
};
export const markReviewHelpful = async(req, res, next) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.reviewId, { $inc: { helpful: 1 } }, { new: true }
        );
        res.status(200).send(review);
    } catch (err) {
        next(err);
    }
};

export const markReviewNotHelpful = async(req, res, next) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.reviewId, { $inc: { notHelpful: 1 } }, { new: true }
        );
        res.status(200).send(review);
    } catch (err) {
        next(err);
    }
};