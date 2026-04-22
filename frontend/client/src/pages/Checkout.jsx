import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

const Checkout = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const { movieId, movieTitle, poster, seats, time } = location.state || {};

  // ❌ protect page
  if (!movieId || !seats || seats.length === 0) {
    return (
      <div className="text-white text-center mt-20">
        Invalid booking data ❌
      </div>
    );
  }

  // 🎯 Seat pricing
  const getSeatPrice = (seat) => {
    const row = seat[0];

    if (["A", "B"].includes(row)) return 150;
    if (["C", "D", "E", "F"].includes(row)) return 200;
    return 300;
  };

  const totalAmount = seats.reduce(
    (total, seat) => total + getSeatPrice(seat),
    0
  );

  // 💳 PAYMENT
  const handlePayment = async () => {
    try {
      if (!user) {
        toast.error("Login first");
        return;
      }

      const orderRes = await fetch(
        "http://localhost:5000/booking/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalAmount }),
        }
      );

      const orderData = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: "INR",
        name: "CineNexus",
        description: "Movie Booking",
        order_id: orderData.order.id,

        handler: async function () {
          try {
            const res = await fetch("http://localhost:5000/booking/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                movie: movieId,
                movieTitle: movieTitle || "Movie", // ✅ no API dependency
                seats,
                date: time,
                user: user.id,
              }),
            });

            if (!res.ok) {
              toast.error("Booking failed");
              return;
            }

            toast.success("Payment Successful 🎉");
            navigate("/my-bookings");

          } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
          }
        },

        method: {
          card: true,
          netbanking: true,
          upi: true,
          wallet: false,
        },

        prefill: {
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
        },

        theme: { color: "#F84565" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  // ✅ UI
  return (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-white px-6">
    <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-lg">

      <h1 className="text-2xl font-semibold mb-6 text-center">
        Checkout
      </h1>

      {/* 🎬 Movie Section */}
      <div className="flex gap-4 items-center mb-4">
        <img
          src={
            poster
              ? `https://image.tmdb.org/t/p/w200${poster}`
              : "https://via.placeholder.com/100x150"
          }
          alt="poster"
          className="w-20 h-28 object-cover rounded"
        />

        <div>
          <p className="text-lg font-semibold">
            {movieTitle}
          </p>
          <p className="text-sm text-gray-400">
            {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* 🎟 Seats */}
      <p className="mt-2">
        🎟 <span className="font-medium">Seats:</span>{" "}
        {seats.join(", ")}
      </p>

      {/* 🎯 Seat Breakdown */}
      <div className="mt-4">
        <p className="font-medium mb-2">Seat Breakdown:</p>

        {seats.map((seat) => (
          <div key={seat} className="flex justify-between text-sm">
            <span>{seat}</span>
            <span>₹{getSeatPrice(seat)}</span>
          </div>
        ))}
      </div>

      {/* 💡 Legend */}
      <p className="text-sm text-gray-400 mt-3">
        🔵 Front: ₹150 | 🟡 Middle: ₹200 | 🔴 Back: ₹300
      </p>

      <hr className="border-gray-700 my-4" />

      {/* 💰 Total */}
      <p className="text-lg font-semibold">
        Total: ₹{totalAmount}
      </p>

      {/* 💳 Button */}
      <button
        onClick={handlePayment}
        className="w-full mt-6 py-3 bg-primary hover:bg-primary-dull rounded-lg font-medium transition"
      >
        Pay Now
      </button>

    </div>
  </div>
);
};

export default Checkout;