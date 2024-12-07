// const express = require("express");
// const router = express.Router();
// const Booking = require("../models/booking");
// const Room = require("../models/room");
// const { v4: uuidv4 } = require("uuid");
// const stripe = require("stripe")("sk_test_51QQFicDbyunLPozjFJjZ9K6ggS7RuXPVQrZ6mGTZLFYqhkIImQGL6XW1lbTru2C66Td8Egix2Rt47wttVmw4iD7O0050NogSwK");

// // Book Room Route
// router.post("/bookroom", async (req, res) => {
//   const { roomid, userid, fromdate, todate, totalAmount, totalDays, token } = req.body;

//   // Validate input fields
//   if (!roomid || !userid || !fromdate || !todate || !totalAmount || !totalDays || !token) {
//     return res.status(400).json({ message: "All booking details and token are required." });
//   }

//   try {
//     // Fetch room details
//     const room = await Room.findById(roomid);
//     if (!room) return res.status(404).json({ message: "Room not found" });

//     // Create a Stripe customer and handle payment
//     const customer = await stripe.customers.create({
//       email: token.email, // Email from the token
//     });

//     // Attach the payment method to the customer
//     await stripe.paymentMethods.attach(token.id, {
//       customer: customer.id,
//     });

//     // Create a Stripe payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAmount * 100, // Convert amount to smallest currency unit (e.g., cents)
//       currency: "inr",           // Use INR or another valid currency code
//       customer: customer.id,
//       payment_method: token.id,
//       receipt_email: token.email,
//       description: `Booking for room ${roomid}`,
//       confirm: true,
//       automatic_payment_methods: {
//         enabled: true,
//         allow_redirects: 'never', // Prevent redirect-based payment methods
//       },
//     });

//     // Check if the payment is successful
//     if (paymentIntent.status === "succeeded") {
//       // Save booking details in the database
//       const newBooking = new Booking({
//         room: room.name,
//         roomid: room._id,
//         userid,
//         fromdate,
//         todate,
//         totalAmount,
//         totalDays,
//         transactionId: paymentIntent.id, // Use payment intent ID for the transaction
//       });

//       await newBooking.save();

//       // Update room availability
//       room.currentbookings.push({
//         bookingid: newBooking._id,
//         fromdate,
//         todate,
//         userid,
//       });
//       await room.save();

//       res.status(200).json({
//         success: true,
//         message: "Booking successful!",
//       });
//     } else {
//       res.status(500).json({ message: "Payment failed" });
//     }
//   } catch (error) {
//     // console.error("Error during payment or booking:", error);
//     res.status(500).json({
//       message: "An error occurred while processing your request",
//       error: error.message || error.stack,
//     });
//   }
// });

// // Get Bookings by User ID Route
// router.post("/getbookingsbyuserid", async (req, res) => {
//   const { userid } = req.body;

//   // Validate user ID
//   if (!userid) {
//     return res.status(400).json({ message: "User ID is required" });
//   }

//   try {
//     const bookings = await Booking.find({ userid });
//     if (!bookings || bookings.length === 0) {
//       return res.status(404).json({ message: "No bookings found for this user" });
//     }
//     res.status(200).json(bookings);
//   } catch (error) {
//     // console.error("Fetching Bookings Error:", error);
//     res.status(500).json({ message: "An error occurred while fetching bookings", error: error.message });
//   }
// });
// router.post("/cancelbooking", async (req, res) => {
//   const { bookingid, roomid } = req.body;

//   try {
//     // Find the booking by ID
//     const bookingItem = await Booking.findOne({ _id: bookingid });
//     if (!bookingItem) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // Set the status to cancelled
//     bookingItem.status = 'CANCELLED';
//     await bookingItem.save(); // Fix: Add parentheses to call save()

//     // Find the room by ID
//     const room = await Room.findOne({ _id: roomid });
//     if (!room) {
//       return res.status(404).json({ message: "Room not found" });
//     }

//     // Filter out the cancelled booking from currentbookings
//     const updatedBookings = room.currentbookings.filter(
//       (booking) => booking.bookingid.toString() !== bookingid.toString()
//     );
//     room.currentbookings = updatedBookings;

//     // Save the updated room
//     await room.save();

//     res.status(200).json({ message: "Your booking has been cancelled" });
//   } catch (error) {
//     console.error("Error during booking cancellation:", error);
//     res.status(400).json({ error: error.message || error.stack });
//   }
// });

// router.get("/getallbookings",async(req,res)=>{
//   try{
//     const bookings = await Booking.find();
//     res.status(200).json(bookings);
//   }
//   catch{
//     res.status(400).json({message:"An error occurred while fetching bookings"})
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const { v4: uuidv4 } = require("uuid");

const stripe = require("stripe")("sk_test_51QQFicDbyunLPozjFJjZ9K6ggS7RuXPVQrZ6mGTZLFYqhkIImQGL6XW1lbTru2C66Td8Egix2Rt47wttVmw4iD7O0050NogSwK");

// Book Room Route
router.post("/bookroom", async (req, res) => {
  const { roomid, userid, fromdate, todate, totalAmount, totalDays, token } = req.body;

  // Validate input fields
  if (!roomid || !userid || !fromdate || !todate || !totalAmount || !totalDays || !token) {
    return res.status(400).json({ message: "All booking details and token are required." });
  }

  try {
    // Fetch room details
    const room = await Room.findById(roomid);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Create a Stripe customer and handle payment
    const customer = await stripe.customers.create({
      email: token.email, // Email from the token
    });

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(token.id, {
      customer: customer.id,
    });

    // Create a Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Convert amount to smallest currency unit (e.g., cents)
      currency: "inr",           // Use INR or another valid currency code
      customer: customer.id,
      payment_method: token.id,
      receipt_email: token.email,
      description: `Booking for room ${roomid}`,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Prevent redirect-based payment methods
      },
    });

    // Check if the payment is successful
    if (paymentIntent.status === "succeeded") {
      // Save booking details in the database
      const newBooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate,
        todate,
        totalAmount,
        totalDays,
        transactionId: paymentIntent.id, // Use payment intent ID for the transaction
      });

      await newBooking.save();

      // Update room availability
      room.currentbookings.push({
        bookingid: newBooking._id,
        fromdate,
        todate,
        userid,
      });
      await room.save();

      res.status(200).json({
        success: true,
        message: "Booking successful!",
      });
    } else {
      res.status(500).json({ message: "Payment failed" });
    }
  } catch (error) {
    // console.error("Error during payment or booking:", error);
    res.status(500).json({
      message: "An error occurred while processing your request",
      error: error.message || error.stack,
    });
  }
});

// Get Bookings by User ID Route
router.post("/getbookingsbyuserid", async (req, res) => {
  const { userid } = req.body;

  // Validate user ID
  if (!userid) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const bookings = await Booking.find({ userid });
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    // console.error("Fetching Bookings Error:", error);
    res.status(500).json({ message: "An error occurred while fetching bookings", error: error.message });
  }
});
router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    // Find the booking by ID
    const bookingItem = await Booking.findOne({ _id: bookingid });
    if (!bookingItem) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Set the status to cancelled
    bookingItem.status = 'CANCELLED';
    await bookingItem.save(); // Fix: Add parentheses to call save()

    // Find the room by ID
    const room = await Room.findOne({ _id: roomid });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Filter out the cancelled booking from currentbookings
    const updatedBookings = room.currentbookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid.toString()
    );
    room.currentbookings = updatedBookings;

    // Save the updated room
    await room.save();

    res.status(200).json({ message: "Your booking has been cancelled" });
  } catch (error) {
    console.error("Error during booking cancellation:", error);
    res.status(400).json({ error: error.message || error.stack });
  }
});

router.get("/getallbookings",async(req,res)=>{
  try{
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  }
  catch{
    res.status(400).json({message:"An error occurred while fetching bookings"})
  }
});

module.exports = router;
