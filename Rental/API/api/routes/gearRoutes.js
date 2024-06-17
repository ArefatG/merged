const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const gearController = require("../controllers/gearControllers");
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/booking-requests', verifyToken, verifyAdmin, gearController.getAllBookingRequests);
router.post("/payment", verifyToken, gearController.initiatePayment);
router.get("/chapa/callback/:tx_ref", gearController.chapaCallback);
router.get("/", gearController.getAllgearsItems);
router.post("/", gearController.postgearsItem);
router.post("/collect", gearController.collectItem);
router.patch("/return/:gearId", gearController.markGearAsReturned);
router.patch("/collect/:gearId", gearController.markGearAsCollected); // Add this route
router.get('/rental-stats', verifyToken, gearController.getRentalStatistics);
router.get('/rental-stats/:email', verifyToken, gearController.getRentalStatsByOwner);
router.get("/search", gearController.searchGears);
router.delete("/:id", gearController.deletegearsItem);
router.get("/:id", gearController.singlegearsItem);
router.get("/email/:email", verifyToken, gearController.getGearByEmail);
router.patch("/:id", gearController.updategearsItem);
router.post("/book/:gearId", gearController.postBookRequest);
router.get("/requests/:email", verifyToken, gearController.getBookingRequestsByOwner);
router.patch("/requests/:gearId/:requestId", verifyToken, gearController.updateBookingRequestStatus);
router.get("/requests/user/:userId", verifyToken, gearController.getBookingRequestsByUserId);
router.delete("/requests/:gearId/:requestId", verifyToken, gearController.deleteBookingRequest);



module.exports = router;
