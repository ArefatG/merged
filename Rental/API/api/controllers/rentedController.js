const Rented = require('../models/Rented');
const Gear = require('../models/Gear');
const User = require('../models/User');

const getRentedByOwnerEmail = async (req, res) => {
  const email = req.params.email;
  try {
    // Find all gears owned by the user with the specified email
    const ownedGears = await Gear.find({ owner: email }).select('_id');
    const gearIds = ownedGears.map(gear => gear._id);

    // Find all rented items where the gearId is in the list of gear IDs
    const rentedItems = await Rented.find({ 'gearItems.gearId': { $in: gearIds } })
                                    .populate('gearItems.gearId', 'name price startDate endDate');

    res.status(200).json(rentedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRentedByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const rentedItems = await Rented.find({ userId }).populate('gearItems.gearId', 'name price startDate endDate owner');

    const rentalDetails = await Promise.all(rentedItems.map(async (item) => {
      const ownerDetails = await Promise.all(item.gearItems.map(async (gearItem) => {
        const gear = await Gear.findById(gearItem.gearId);
        const owner = await User.findOne({ email: gear.owner }).select('name address phoneNumber');
        return {
          gearName: gearItem.name,
          ownerName: owner ? owner.name : 'Unknown',
          ownerAddress: owner ? owner.address : 'Unknown',
          ownerPhoneNumber: owner ? owner.phoneNumber : 'Unknown',
          ownerEmail: owner ? owner.email : 'Unknown'
        };
      }));

      return {
        _id: item._id,
        userId: item.userId,
        gearItems: item.gearItems.map((gearItem, index) => ({
          ...gearItem._doc,
          ownerName: ownerDetails[index].ownerName,
          ownerAddress: ownerDetails[index].ownerAddress,
          ownerPhoneNumber: ownerDetails[index].ownerPhoneNumber,
          ownerEmail: ownerDetails[index].ownerEmail
        })),
        txRef: item.txRef,
        totalPrice: item.totalPrice,
        uniqueCode: item.uniqueCode,
        createdAt: item.createdAt,
      };
    }));

    res.status(200).json(rentalDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rented.find().populate('gearItems.gearId', 'name owner');
    const rentalDetails = await Promise.all(rentals.map(async rental => {
      const user = await User.findById(rental.userId).select('name email');
      const ownerDetails = await Promise.all(rental.gearItems.map(async item => {
        const gear = await Gear.findById(item.gearId);
        const owner = await User.findOne({ email: gear.owner }).select('name email');
        return {
          gearName: item.name,
          ownerName: owner ? owner.name : 'Unknown',
          ownerEmail: owner ? owner.email : 'Unknown'
        };
      }));

      return {
        _id: rental._id,
        userId: rental.userId,
        userName: user ? user.name : 'Unknown',
        userEmail: user ? user.email : 'Unknown',
        gearItems: rental.gearItems.map((item, index) => ({
          ...item._doc,
          ownerName: ownerDetails[index].ownerName,
          ownerEmail: ownerDetails[index].ownerEmail
        })),
        totalPrice: rental.totalPrice,
        createdAt: rental.createdAt,
      };
    }));
    res.status(200).json(rentalDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getRentedByUserId,
  getRentedByOwnerEmail,
  getAllRentals,
};
