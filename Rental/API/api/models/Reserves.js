const mongoose = require('mongoose');
const {Schema} = mongoose;

const reserveSchema = new Schema({
    gearsItemId: String,
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3
    },
    equipment: String,
    image: String, 
    price: Number,
    email:{
        type: String,
        true: true,
        required: true,
    }
})

const Reserves = mongoose.model("Reserve", reserveSchema);

module.exports = Reserves;