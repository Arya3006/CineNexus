import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyDateTimeData } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";

const SeatLayout = () => {

  const [bookedSeats, setBookedSeats] = useState([]);
  
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  // 🎬 Fetch movie + timings
  const getShow = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );

      const data = await res.json();

      setShow({
        movie: data,
        dateTime: dummyDateTimeData,
      });
    } catch (err) {
      console.error(err);
    }
  };

const getBookedSeats = async () => {
  try {
    const res = await fetch("http://localhost:5000/booking/");
    const data = await res.json();

    let allSeats = [];

    data.bookings.forEach((booking) => {
      if (
  String(booking.movie) === String(id) &&
  booking.date === selectedTime?.time
) {
        if (booking.seats) {
          allSeats.push(...booking.seats);
        }
        if (booking.seatNumber) {
          allSeats.push(String(booking.seatNumber));
        }
      }
    });

    setBookedSeats(allSeats);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  getShow();
}, [id]);

useEffect(() => {
  if (selectedTime) {
    getBookedSeats();
  }
}, [selectedTime]);

// 🎟 Seat click
const handleSeatClick = (seatId) => {

  // 🔴 NEW: prevent clicking booked seats
  if (bookedSeats.includes(seatId)) {
    return toast("Seat already booked");
  }

  if (!selectedTime) {
    return toast("Please select time first");
  }

  if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
    return toast("You can only select 5 seats");
  }

  setSelectedSeats((prev) =>
    prev.includes(seatId)
      ? prev.filter((seat) => seat !== seatId)
      : [...prev, seatId]
  );
};

  // 🎟 Booking
  const handleBooking = () => {
  if (!selectedTime) {
    return toast("Please select time");
  }

  if (selectedSeats.length === 0) {
    return toast("Please select seats");
  }

  navigate("/checkout", {
    state: {
      movieId: id,
      movieTitle: show.movie.title,     // ✅ ADD
      poster: show.movie.poster_path,   // ✅ ADD
      seats: selectedSeats,
      time: selectedTime.time,
    },
  });
};

  // 🎟 Render seats
  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
  key={seatId}
  onClick={() => handleSeatClick(seatId)}
  disabled={bookedSeats.includes(seatId)}
  className={`h-8 w-8 rounded border cursor-pointer
    ${
      bookedSeats.includes(seatId)
        ? "bg-red-500 cursor-not-allowed"
        : selectedSeats.includes(seatId)
        ? "bg-primary text-white"
        : "border-primary/60"
    }
  `}
>
  {seatId}
</button>
          );
        })}
      </div>
    </div>
  );

  if (!show) return <Loading />;

  // ✅ SAFE timings extraction
  const timings = Object.values(show.dateTime || {})[0] || [];

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      
      {/* 🎬 TIMINGS */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>

        <div className="mt-5 space-y-1">
          {timings.length === 0 ? (
            <p className="px-6 text-sm text-gray-400">No timings available</p>
          ) : (
            timings.map((item) => (
              <div
                key={item.time}
                onClick={() => {
                  setSelectedTime(item);
                }}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                  selectedTime?.time === item.time
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🎟 SEATS */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        <h1 className="text-2xl font-semibold mb-4">
          Select your seat
        </h1>

        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>

          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map((row) => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        {/* 🎟 BUTTON */}
        <button
          onClick={handleBooking}
          className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SeatLayout;