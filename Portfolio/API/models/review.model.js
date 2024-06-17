import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    portfolioId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    star: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5]
    },
    desc: {
        type: String,
        required: true,
    },
    helpful: { type: Number, default: 0 },
    notHelpful: { type: Number, default: 0 }
}, {
    timestamps: true,
});

export default mongoose.model("Review", ReviewSchema);