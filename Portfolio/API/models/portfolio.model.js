import mongoose from "mongoose";
const { Schema } = mongoose;

const portfolioSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    totalStars: {
        type: Number,
        default: 0,
    },
    starNumber: {
        type: Number,
        default: 0,
    },
    cat: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    cover: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: false,
    },
    userId: {
        type: String,
        required: true,
    },
    shortTitle: {
        type: String,
        required: true,
    },
    shortDesc: {
        type: String,
        required: true,
    },
    deliveryTime: {
        type: Number,
        required: false,
    },
    revisionNumber: {
        type: Number,
        required: false,
    },
    skills: {
        type: [String],
        default: [],
    },
    specialties: {
        type: [String],
        default: [],
    },
    experiences: {
        type: [String],
        default: [],
    },
    educations: {
        type: [String],
        default: [],
    },
    features: {
        type: [String],
        required: false,
    },
    education: {
        type: [String],
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    socialMedias: {
        type: [String],
        required: false,
    },
    additionalInfo: [{
        title: { type: String, required: true },
        content: { type: [String], required: true },
    }, ],
    sales: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export default mongoose.model("portfolio", portfolioSchema);