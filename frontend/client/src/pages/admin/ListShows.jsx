import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import { getShows } from "../../lib/api";

const ListShows = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await getShows();
        setShows(res.data.shows || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchShows();
  }, []);

  return shows.length > 0 ? (
    <>
      <Title text1="List" text2="Shows" />

      <div className="mt-8">
        <div className="grid grid-cols-4 text-gray-400 mb-4">
          <p>Movie</p>
          <p>Bookings</p>
          <p>Revenue</p>
        </div>

        {shows.map((show) => (
          <div
            key={show._id}
            className="grid grid-cols-4 items-center bg-primary/5 p-3 mb-3 rounded"
          >
            {/* 🎬 Movie */}
            <div className="flex items-center gap-3">
              <img
                src={show.poster}
                className="w-12 h-16 object-cover rounded"
              />
              <p>{show.title}</p>
            </div>

            {/* 🎟️ Bookings */}
            <p>{show.bookingsCount}</p>

            {/* 💰 Revenue */}
            <p>₹{show.revenue}</p>
          </div>
        ))}
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListShows;