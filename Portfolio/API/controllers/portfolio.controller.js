import createError from "../utils/createError.js";
import portfolio from "../models/portfolio.model.js";


export const createportfolio = async(req, res, next) => {


    const newportfolio = new portfolio({
        userId: req.userId,
        ...req.body,
    });

    try {

        const savedportfolio = await newportfolio.save();
        res.status(201).json(savedportfolio);
    } catch (err) {
        next(err);
    }
};
export const deleteportfolio = async(req, res, next) => {



    try {

        const portfoliodelete = await portfolio.findById(req.params.id);


        if (portfoliodelete.userId !== req.userId)
            return next(createError(403, "You can delete only your portfolio!"));

        await portfolio.findByIdAndDelete(req.params.id);
        res.status(201).send("portfolio has been deleted!");
    } catch (err) {
        next(err);
    }
};
export const getportfolio = async(req, res, next) => {

    try {

        const portfolioget = await portfolio.findById(req.params.Id);
        if (!portfolioget) next(createError(404, "portfolio not found!"));

        res.status(200).send(portfolioget);
        console.log("jjjjjjjjjjj")
    } catch (err) {
        next(err);
    }
};


export const getportfolios = async(req, res, next) => {
    const q = req.query;
    const filters = {
        ...(q.userId && { userId: q.userId }),
        ...(q.cat && { cat: q.cat }),
        ...((q.min || q.max) && {
            price: {
                ...(q.min && { $gt: q.min }),
                ...(q.max && { $lt: q.max }),
            },
        }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };
    try {
        const portfolios = await portfolio.find(filters).sort({
            [q.sort]: -1
        });
        res.status(200).send(portfolios);
    } catch (err) {
        next(err);
    }
};

export const editPortfolio = async(req, res, next) => {
    try {
        const updatedPortfolio = await portfolio.findByIdAndUpdate(
            req.params.id, {
                $set: req.body,
            }, { new: true }
        );
        if (!updatedPortfolio) return next(createError(404, 'Portfolio not found!'));
        res.status(200).json(updatedPortfolio);
    } catch (err) {
        next(err);
    }
};