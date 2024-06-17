const User = require("../models/User");
const Rented = require("../models/Rented");
const Gear = require("../models/Gear");

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const useremail = req.params.email;
    const query = { email: useremail };
    const result = await User.find(query).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  try {
    const existingUser = await User.findOne(query);
    if (existingUser) {
      return res.status(200).json({ message: "User already exists!" });
    }
    const result = await User.create(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdmin = async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  try {
    const user = await User.findOne(query);
    if (email !== req.decoded.email) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    let admin = false;
    if (user) {
      admin = user?.role === "admin";
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const makeAdmin = async (req, res) => {
  const userId = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User approved", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const disapproveUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User disapproved", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { name, photoURL, address, phoneNumber } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, photoURL, address, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserBalanceHistory = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const balanceHistory = user.balanceHistory || []; // Assuming balance history is stored in the user document
    res.status(200).json(balanceHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserBalance = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const withdrawBalance = async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    user.balance -= amount;
    user.balanceHistory.push({ balance: user.balance });
    await user.save();
    res.status(200).json({ message: "Balance withdrawn successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllUsersWithBalances = async (req, res) => {
  try {
    const users = await User.find().select('name email balance').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
const getRecentActivities = async (req, res) => {
  try {
    const recentRentals = await Rented.find().sort({ createdAt: -1 }).limit(10).populate('gearItems.gearId', 'name');
    const userIds = recentRentals.map(rental => rental.userId);

    const users = await User.find({ _id: { $in: userIds } }).select('name email');
    const usersMap = users.reduce((map, user) => {
      map[user._id] = user;
      return map;
    }, {});

    const recentRentalsWithUserDetails = recentRentals.map(rental => ({
      ...rental._doc,
      userName: usersMap[rental.userId]?.name || 'Unknown',
      userEmail: usersMap[rental.userId]?.email || 'Unknown',
    }));

    res.status(200).json(recentRentalsWithUserDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopUsers = async (req, res) => {
  try {
    // Aggregate the number of rentals for each user
    const topUsersAggregation = await Rented.aggregate([
      {
        $group: {
          _id: "$userId",
          rentalsCount: { $sum: 1 },
        },
      },
      {
        $sort: { rentalsCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Extract user IDs
    const userIds = topUsersAggregation.map(user => user._id);

    // Fetch user details for the top users
    const users = await User.find({ _id: { $in: userIds } }).select('name email');

    // Map user details to the aggregation results
    const topUsers = topUsersAggregation.map(user => {
      const userDetails = users.find(u => u._id.toString() === user._id.toString());
      return {
        ...user,
        name: userDetails ? userDetails.name : 'Unknown',
        email: userDetails ? userDetails.email : 'Unknown',
      };
    });

    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopGears = async (req, res) => {
  try {
    const topGears = await Gear.find().sort({ totalRented: -1 }).limit(10);
    res.status(200).json(topGears);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  getAdmin,
  makeAdmin,
  getUserByEmail,
  getUserById,
  approveUser,
  disapproveUser,
  updateUserProfile,
  getUserBalanceHistory,
  getUserBalance,
  withdrawBalance,
  getAllUsersWithBalances,
  getRecentActivities,
  getTopUsers,
  getTopGears,
};
