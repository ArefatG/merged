import express from "express";
import {
    createportfolio,
    deleteportfolio,
    getportfolio,
    getportfolios,
    editPortfolio
} from "../controllers/portfolio.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createportfolio);
router.delete("/:id", verifyToken, deleteportfolio);
router.get("/single/:Id", getportfolio);
router.get("/", getportfolios);
router.put('/:id', editPortfolio);

export default router;