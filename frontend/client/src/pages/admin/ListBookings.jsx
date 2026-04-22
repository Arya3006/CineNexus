import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { getBookings } from "../../lib/api";

const ListBookings = () => {
  const currency = "₹";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatUser = (user) => {
  if (!user) return "Guest";

  if (user === "test-user") return "Test User";

  // shorten long ids
  if (user.startsWith("user_")) {
    return "User " + user.slice(-4); // last 4 chars
  }

  return user;
};

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getBookings();
        const data = res.data.bookings || res.data || [];
        setBookings(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Bookings" />

      <table className="w-full mt-6 text-left">
  <thead>
    <tr className="border-b border-gray-700 text-gray-400">
      <th className="py-3">User</th>
      <th className="py-3">Movie</th>
      <th className="py-3">Seats</th>
      <th className="py-3">Amount</th>
    </tr>
  </thead>

  <tbody>
    {bookings.map((b, i) => (
      <tr
        key={i}
        className="border-b border-gray-800 hover:bg-gray-900 transition"
      >
        <td className="py-3 font-medium">
  👤 Test User
</td>

        <td className="py-3">
  {b.movieTitle && !b.movieTitle.startsWith("Movie")
    ? b.movieTitle
    : "Unknown Movie"}
</td>

        <td className="py-3">
          {Array.isArray(b.seats) ? b.seats.join(", ") : "N/A"}
        </td>

        <td className="py-3 text-primary font-medium">
          ₹ {b.amount}
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </>
  );
};

export default ListBookings;