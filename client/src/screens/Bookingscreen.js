// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
// import Loader from "../components/Loader";
// import Error from "../components/Error";
// import moment from "moment";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// // Stripe public key
// const stripePromise = loadStripe("pk_test_51QQFicDbyunLPozjf34GNgHlz4A05c8N9Y114UbhgBSqolquwmFExf4NXAmn0CvlUdrApHLPZfBAdZXOxA9Aq33b003aj4JsYU");

// function CheckoutForm({ room, fromdate, todate, totalAmount, totalDays, setBookingSuccess }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     const cardElement = elements.getElement(CardElement);
//     setLoading(true);

//     try {
//       const { error, paymentMethod } = await stripe.createPaymentMethod({
//         type: "card",
//         card: cardElement,
//       });

//       if (error) {
//         setError(error.message);
//         setLoading(false);
//         return;
//       }

//       // Get user info from localStorage
//       const user = JSON.parse(localStorage.getItem("currentUser"));

//       // Prepare booking details
//       const bookingDetails = {
//         roomid: room._id,
//         userid: user._id,
//         fromdate,
//         todate,
//         totalAmount,
//         totalDays,
//         token: {
//           id: paymentMethod.id,
//           email: user.email, // Include user email
//         },
//       };

//       // Post booking details to the backend
//       const bookingResponse = await axios.post("/api/bookings/bookroom", bookingDetails);

//       if (bookingResponse.data.success) {
//         setBookingSuccess(true);
//       } else {
//         setError(bookingResponse.data.message || "Booking failed, please try again.");
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement />
//       <button type="submit" className="btn btn-primary" disabled={!stripe || loading}>
//         {loading ? "Processing..." : `Pay ₹${totalAmount}`}
//       </button>
//       {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
//     </form>
//   );
// }

// function Bookingscreen() {
//   const { roomid, fromdate, todate } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [room, setRoom] = useState();
//   const [bookingSuccess, setBookingSuccess] = useState(false);  // New state for success message
//   const navigate = useNavigate(); // Hook for navigation

//   useEffect(() => {
//     const fetchRoomData = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.post("/api/rooms/getroombyid", { roomid });
//         setRoom(data);
//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//         setError(true);
//       }
//     };

//     fetchRoomData();
//   }, [roomid]);

//   useEffect(() => {
//     if (bookingSuccess) {
//       setTimeout(() => {
//         navigate("/profile"); // Redirect to bookings page after booking is successful
//       }, 2000); // Delay the navigation to show the success message
//     }
//   }, [bookingSuccess, navigate]);

//   if (loading) return <Loader />;
//   if (error) return <Error />;

//   const fromDateMoment = moment(fromdate, "DD-MM-YYYY");
//   const toDateMoment = moment(todate, "DD-MM-YYYY");
//   const totalDays = toDateMoment.diff(fromDateMoment, "days") + 1;
//   const totalAmount = totalDays * (room ? room.rentperday : 0);

//   return (
//     <div className="m-5">
//       {room ? (
//         <div className="row justify-content-center mt-5 bs">
//           <div className="col-md-6">
//             <h1>{room.name}</h1>
//             <img
//               src={room.imageurls && room.imageurls.length > 0 ? room.imageurls[0] : ""}
//               className="bigimg"
//               alt="Room"
//               style={{ width: "100%", height: "auto" }}
//             />
//           </div>

//           <div className="col-md-6">
//             <div style={{ textAlign: "right" }}>
//               <h1>Booking Details</h1>
//               <hr />
//               <b>
//                 <p>Name: {JSON.parse(localStorage.getItem("currentUser")).name}</p>
//                 <p>From Date: {fromdate}</p>
//                 <p>To Date: {todate}</p>
//                 <p>Max Count: {room.maxcount}</p>
//               </b>
//             </div>
//             <div style={{ textAlign: "right" }}>
//               <b>
//                 <h1>Amount</h1>
//                 <hr />
//                 <p>Total days: {totalDays}</p>
//                 <p>Rent per day: ₹{room.rentperday}</p>
//                 <p>Total Amount: ₹{totalAmount}</p>
//               </b>
//             </div>
//             <hr />
//             <Elements stripe={stripePromise}>
//               <CheckoutForm
//                 room={room}
//                 fromdate={fromdate}
//                 todate={todate}
//                 totalAmount={totalAmount}
//                 totalDays={totalDays}
//                 setBookingSuccess={setBookingSuccess}
//               />
//             </Elements>
//             {/* Conditionally render success message below the form */}
//             {bookingSuccess && <div className="alert alert-success mt-3">Booking Successful!</div>}
//           </div>
//         </div>
//       ) : (
//         <Error />
//       )}
//     </div>
//   );
// }

// export default Bookingscreen;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Stripe public key
const stripePromise = loadStripe("pk_test_51QQFicDbyunLPozjf34GNgHlz4A05c8N9Y114UbhgBSqolquwmFExf4NXAmn0CvlUdrApHLPZfBAdZXOxA9Aq33b003aj4JsYU");

function CheckoutForm({ room, fromdate, todate, totalAmount, totalDays, setBookingSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    setLoading(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem("currentUser"));

      // Prepare booking details
      const bookingDetails = {
        roomid: room._id,
        userid: user._id,
        fromdate,
        todate,
        totalAmount,
        totalDays,
        token: {
          id: paymentMethod.id,
          email: user.email, // Include user email
        },
      };

      // Post booking details to the backend
      const bookingResponse = await axios.post("/api/bookings/bookroom", bookingDetails);

      if (bookingResponse.data.success) {
        setBookingSuccess(true);
      } else {
        setError(bookingResponse.data.message || "Booking failed, please try again.");
      }
    } catch (err) {
      console.error("Error in payment processing:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" className="btn btn-primary" disabled={!stripe || loading}>
        {loading ? "Processing..." : `Pay ₹${totalAmount}`}
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </form>
  );
}

function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Set error to a string to hold message
  const [room, setRoom] = useState();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post("/api/rooms/getroombyid", { roomid });

        if (!data) {
          setError("Room not available");
        } else {
          setRoom(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room data:", error);
        setLoading(false);
        setError(error.response?.data?.message || "There was an error fetching your bookings.");
      }
    };

    fetchRoomData();
  }, [roomid]);

  useEffect(() => {
    if (bookingSuccess) {
      setTimeout(() => {
        navigate("/profile"); // Redirect to bookings page after booking is successful
      }, 2000); // Delay the navigation to show the success message
    }
  }, [bookingSuccess, navigate]);

  if (loading) return <Loader />;
  if (error) return <div className="alert alert-info">{error}</div>;  // Display a custom error message here

  const fromDateMoment = moment(fromdate, "DD-MM-YYYY");
  const toDateMoment = moment(todate, "DD-MM-YYYY");
  const totalDays = toDateMoment.diff(fromDateMoment, "days") + 1;
  const totalAmount = totalDays * (room ? room.rentperday : 0);

  return (
    <div className="m-5">
      {room ? (
        <div className="row justify-content-center mt-5 bs">
          <div className="col-md-6">
            <h1>{room.name}</h1>
            <img
              src={room.imageurls && room.imageurls.length > 0 ? room.imageurls[0] : ""}
              className="bigimg"
              alt="Room"
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          <div className="col-md-6">
            <div style={{ textAlign: "right" }}>
              <h1>Booking Details</h1>
              <hr />
              <b>
                <p>Name: {JSON.parse(localStorage.getItem("currentUser")).name}</p>
                <p>From Date: {fromdate}</p>
                <p>To Date: {todate}</p>
                <p>Max Count: {room.maxcount}</p>
              </b>
            </div>
            <div style={{ textAlign: "right" }}>
              <b>
                <h1>Amount</h1>
                <hr />
                <p>Total days: {totalDays}</p>
                <p>Rent per day: ₹{room.rentperday}</p>
                <p>Total Amount: ₹{totalAmount}</p>
              </b>
            </div>
            <hr />
            <Elements stripe={stripePromise}>
              <CheckoutForm
                room={room}
                fromdate={fromdate}
                todate={todate}
                totalAmount={totalAmount}
                totalDays={totalDays}
                setBookingSuccess={setBookingSuccess}
              />
            </Elements>
            {bookingSuccess && <div className="alert alert-success mt-3">Booking Successful!</div>}
          </div>
        </div>
      ) : (
        <div className="alert alert-info">No bookings available</div>  // If no room data is available
      )}
    </div>
  );
}

export default Bookingscreen;
