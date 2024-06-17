const Reserves = require("../models/Reserves");

// get reserves using email
const getReserveByEmail = async(req, res) => {
    try {
        const email = req.query.email;
        // console.log(email);
        const query = {email: email};
        const result = await Reserves.find(query).exec();
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// post a reserve when add-to-reserve btn clicked 
const addToReserve = async(req, res) => {
    const {gearsItemId, name, equipment, image, price, email } = req.body;
    // console.log(email)
    try {
        const existingReserveItem = await Reserves.findOne({email, gearsItemId });
        if(existingReserveItem){
            return res.status(400).json({message: "Product already exists in the reserve!"});
        }

        const reserveItem = await Reserves.create({
            gearsItemId, name, equipment, image, price, email 
        })

        res.status(201).json(reserveItem)

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// delete a reserve item
const deleteReserve =  async (req, res) => {
    const reserveId = req.params.id;
    try {
        const deletedReserve = await Reserves.findByIdAndDelete(reserveId);
        if(!deletedReserve){
            return res.status(401).json({message: "Reserve Items not found!"})
        }
        res.status(200).json({message: "Reserve Item Deleted Successfully!"})
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// updata a reserve item
const updateReserve = async (req, res) => {
    const reserveId = req.params.id;
    const {gearsItemId, name, equipment, image, price,email } = req.body;

    try {
        const updatedReserve = await Reserves.findByIdAndUpdate(
            reserveId, {gearsItemId, name, equipment, image, price, email }, {
                new: true, runValidators: true
            }
        )
        if(!updatedReserve){
            return res.status(404).json({ message: "Reserve Item not found"})
        }
        res.status(200).json(updatedReserve)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// get single equipment
const getSingleReserve = async (req, res) => {
    const reserveId = req.params.id;
    try {
        const reserveItem = await Reserves.findById(reserveId)
        res.status(200).json(reserveItem)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getReserveByEmail,
    addToReserve,
    deleteReserve,
    updateReserve,
    getSingleReserve
}