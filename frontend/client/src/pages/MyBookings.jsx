import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // 🎯 Fetch bookings
  const getMyBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/booking/");
      const data = await res.json();

      setBookings(data.bookings || []);

      // 🔥 Fetch movie details for each booking
      const movieData = {};

      for (let booking of data.bookings) {
        if (!movieData[booking.movie]) {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${booking.movie}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
          );
          const movie = await res.json();
          movieData[booking.movie] = movie;
        }
      }

      setMovies(movieData);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />

      <h1 className="text-lg font-semibold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        [...bookings].reverse().map((item, index) => {
          const movie = movies[item.movie];

          return (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-4 bg-primary/8 border border-primary/20 rounded-lg mt-4 p-4 max-w-3xl"
            >
              {/* 🎬 Poster */}
              <img
                src={
                  movie?.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "https://via.placeholder.com/150"
                }
                alt="poster"
                className="w-32 h-44 object-cover rounded"
              />

              {/* 🎬 Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    {movie?.title || "Loading..."}
                  </p>

                  <p className="text-gray-400 text-sm mt-2">
                    Seats: {item.seats.join(", ")}
                  </p>

                  <p className="text-gray-400 text-sm">
                    Date: {new Date(item.date).toLocaleString()}
                  </p>
                </div>

                <p className="text-sm text-primary mt-2">
                  Booking ID: {item._id}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;