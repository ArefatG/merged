const Gear = require("../models/Gear");
const Rented = require("../models/Rented");
const User = require("../models/User");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const getAllgearsItems = async (req, res) => {
  try {
    const gears = await Gear.find({}).sort({ createdAt: -1 });
    res.status(200).json(gears);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postgearsItem = async (req, res) => {
  const newItem = req.body;
  try {
    const result = await Gear.create(newItem);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletegearsItem = async (req, res) => {
  const gearsId = req.params.id;
  try {
    const deletedItem = await Gear.findByIdAndDelete(gearsId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Gears not found" });
    }
    res.status(200).json({ message: "Gears item deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const singlegearsItem = async (req, res) => {
  const gearsId = req.params.id;
  try {
    const gear = await Gear.findById(gearsId);
    res.status(200).json(gear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGearByEmail = async (req, res) => {
  try {
    const owner = req.params.email;
    const query = { owner: owner };
    const result = await Gear.find(query).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updategearsItem = async (req, res) => {
  const gearsId = req.params.id;
  const { name, equipment, image, category, price } = req.body;
  try {
    const updatedgears = await Gear.findByIdAndUpdate(
      gearsId,
      { name, equipment, image, category, price },
      { new: true, runValidator: true }
    );
    if (!updatedgears) {
      return res.status(404).json({ message: "Gears not found" });
    }
    res.status(200).json(updatedgears);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postBookRequest = async (req, res) => {
  const { userId, startDate, endDate, totalPrice } = req.body;
  const gearId = req.params.gearId;
  try {
    const gear = await Gear.findById(gearId);
    if (!gear) {
      return res.status(404).json({ error: "Gear not found" });
    }
    gear.bookingRequests.push({
      userId,
      status: "pending",
      startDate,
      endDate,
      totalPrice,
    });
    await gear.save();
    res.status(200).json({ message: "Booking request submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateGearAvailability = async (gearId, isAvailable) => {
  try {
    const gear = await Gear.findById(gearId);
    if (!gear) {
      return { success: false, message: "Gear not found" };
    }
    gear.isAvailable = isAvailable;
    await gear.save();
    return { success: true, message: "Gear availability updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const updateBookingRequestStatus = async (req, res) => {
  const { gearId, requestId } = req.params;
  const { status } = req.body;
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  try {
    const gear = await Gear.findById(gearId);
    if (!gear) {
      return res.status(404).json({ message: "Gear not found" });
    }
    const request = gear.bookingRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: "Booking request not found" });
    }
    request.status = status;
    await gear.save();
    if (status === "accepted") {
      const updateGearResult = await updateGearAvailability(gearId, false);
      if (!updateGearResult.success) {
        return res.status(500).json({ message: updateGearResult.message });
      }
    }
    res
      .status(200)
      .json({ message: "Booking request status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingRequestsByOwner = async (req, res) => {
  const ownerEmail = req.params.email;
  try {
    const gears = await Gear.find({ owner: ownerEmail }).select(
      "name bookingRequests"
    );
    const bookingRequests = gears.flatMap((gear) =>
      gear.bookingRequests.map((request) => ({
        gearName: gear.name,
        gearId: gear._id,
        ...request._doc,
      }))
    );
    res.status(200).json(bookingRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingRequestsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const gears = await Gear.find({ "bookingRequests.userId": userId }).select(
      "name bookingRequests"
    );
    const bookingRequests = gears.flatMap((gear) =>
      gear.bookingRequests
        .filter((request) => request.userId === userId)
        .map((request) => ({
          gearName: gear.name,
          gearId: gear._id,
          ...request._doc,
        }))
    );
    res.status(200).json(bookingRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchGears = async (req, res) => {
  try {
    const searchString = req.query.q;
    const searchResults = await Gear.find({
      name: { $regex: searchString, $options: "i" },
    });
    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBookingRequest = async (req, res) => {
  const { gearId, requestId } = req.params;
  try {
    const gear = await Gear.findById(gearId);
    if (!gear) {
      return res.status(404).json({ message: "Gear not found" });
    }
    const request = gear.bookingRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: "Booking request not found" });
    }
    const isAccepted = request.status === "accepted";
    gear.bookingRequests = gear.bookingRequests.filter(
      (req) => req._id.toString() !== requestId
    );
    await gear.save();
    if (isAccepted) {
      const updateGearResult = await updateGearAvailability(gearId, true);
      if (!updateGearResult.success) {
        return res.status(500).json({ message: updateGearResult.message });
      }
    }
    res.status(200).json({ message: "Booking request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const initiatePayment = async (req, res) => {
  const { amount, email, firstName, lastName, requestId, userId, txRef } =
    req.body;

  const chapaUrl = "https://api.chapa.co/v1/transaction/initialize";
  const callbackBaseUrl = new URL(
    `${process.env.CALLBACK_BASE_URL}/gears/chapa/callback/${txRef}`
  );
  callbackBaseUrl.searchParams.append(
    "requestId",
    encodeURIComponent(requestId)
  );
  const callbackUrl = callbackBaseUrl.toString();

  const returnBaseUrl = new URL(`${process.env.RETURN_BASE_URL}/rented/`);
  const returnUrl = returnBaseUrl.toString();

  const payload = {
    amount,
    currency: "ETB",
    email,
    first_name: firstName,
    last_name: lastName,
    tx_ref: txRef,
    callback_url: callbackUrl,
    return_url: returnUrl,
  };

  console.log("Initiating payment with:", payload);

  try {
    const response = await axios.post(chapaUrl, payload, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    });

    if (response.data.status === "success") {
      res.status(200).json(response.data);
    } else {
      console.error("Chapa API Error:", response.data);
      res.status(500).json({
        message: "Failed to initiate payment",
        details: response.data,
      });
    }
  } catch (error) {
    console.error(
      "Payment initiation error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Failed to initiate payment",
      error: error.response ? error.response.data : error.message,
    });
  }
};

const chapaCallback = async (req, res) => {
  const { requestId, status, trx_ref } = req.query;
  const tx_ref = req.params.tx_ref;

  console.log("Received callback with:", {
    requestId,
    tx_ref,
    status,
    trx_ref,
  });

  try {
    if (status === "success" && trx_ref === tx_ref) {
      const gear = await Gear.findOne({ "bookingRequests._id": requestId });
      if (gear) {
        const request = gear.bookingRequests.id(requestId);
        if (request) {
          console.log("Request found:", request);

          // Generate unique code
          const uniqueCode = Math.floor(
            100000 + Math.random() * 900000
          ).toString();

          // Create rented record
          const newRented = new Rented({
            userId: request.userId,
            gearItems: [
              {
                gearId: gear._id,
                name: gear.name,
                price: gear.price,
                startDate: request.startDate,
                endDate: request.endDate,
                uniqueCode: uniqueCode, // Add unique code
              },
            ],
            totalPrice: request.totalPrice,
            txRef: trx_ref,
          });

          await newRented.save();

          // Delete booking request
          gear.bookingRequests = gear.bookingRequests.filter(
            (req) => req._id.toString() !== requestId.toString()
          );
          gear.totalRented += 1;
          await gear.save();

          // Update owner's balance
          const owner = await User.findOne({ email: gear.owner });
          if (owner) {
            owner.balance += request.totalPrice;
            owner.balanceHistory.push({ balance: owner.balance });
            await owner.save();
          }

          return res.redirect(
            `${process.env.RETURN_BASE_URL}/rented/${request.userId}?success=true`
          );
        } else {
          return res.status(404).json({ message: "Booking request not found" });
        }
      } else {
        return res.status(404).json({ message: "Gear not found" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Payment not successful or txRef mismatch" });
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ message: "Failed to process payment", error });
  }
};

const markGearAsReturned = async (req, res) => {
  const gearId = req.params.gearId;
  try {
    const gear = await Gear.findById(gearId);
    if (!gear) {
      return res.status(404).json({ message: "Gear not found" });
    }
    gear.isAvailable = true;
    await gear.save();

    await Rented.findOneAndDelete({ "gearItems.gearId": gearId });

    res
      .status(200)
      .json({ message: "Gear marked as returned and rental history updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markGearAsCollected = async (req, res) => {
  const { gearId } = req.params;
  try {
    const rented = await Rented.findOne({ "gearItems.gearId": gearId });
    if (!rented) {
      return res
        .status(404)
        .json({ message: "Gear not found in rented items" });
    }
    rented.collected = true;
    await rented.save();
    res.status(200).json({ message: "Gear marked as collected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRentalStatistics = async (req, res) => {
  try {
    const stats = await Gear.find().sort({ totalRented: -1 });
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const collectItem = async (req, res) => {
  const { code } = req.body;
  try {
    const rented = await Rented.findOne({ "gearItems.uniqueCode": code });
    if (!rented) {
      return res.status(404).json({ message: "Invalid code" });
    }
    rented.collected = true;
    await rented.save();
    res.status(200).json({ message: "Item collected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRentalStatsByOwner = async (req, res) => {
  const ownerEmail = req.params.email;
  try {
    const gears = await Gear.find({ owner: ownerEmail });
    const stats = gears.map((gear) => ({
      name: gear.name,
      totalRented: gear.totalRented,
      image: gear.image,
    }));
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllBookingRequests = async (req, res) => {
  try {
    const gears = await Gear.find();
    const bookingRequestsNested = await Promise.all(gears.map(async gear => {
      return await Promise.all(gear.bookingRequests.map(async request => {
        const user = await User.findById(request.userId).select('name email');
        const owner = await User.findOne({ email: gear.owner }).select('name email');
        return {
          gearName: gear.name,
          gearId: gear._id,
          userName: user ? user.name : 'Unknown',
          userEmail: user ? user.email : 'Unknown',
          ownerName: owner ? owner.name : 'Unknown',
          ownerEmail: owner ? owner.email : 'Unknown',
          status: request.status,
          startDate: request.startDate,
          endDate: request.endDate,
          totalPrice: request.totalPrice,
          createdAt: request.createdAt,
        };
      }));
    }));
    const bookingRequests = bookingRequestsNested.flat();
    bookingRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(bookingRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  getAllgearsItems,
  postgearsItem,
  deletegearsItem,
  singlegearsItem,
  getGearByEmail,
  updategearsItem,
  postBookRequest,
  getBookingRequestsByOwner,
  updateBookingRequestStatus,
  getBookingRequestsByUserId,
  searchGears,
  deleteBookingRequest,
  initiatePayment,
  chapaCallback,
  markGearAsReturned,
  collectItem,
  getRentalStatistics,
  getRentalStatsByOwner,
  markGearAsCollected,
  getAllBookingRequests,
};
