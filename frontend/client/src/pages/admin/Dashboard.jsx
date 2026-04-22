import {
  ChartLineIcon,
  CircleDollarSignIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { getBookings, getShows } from "../../lib/api";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookingsRes = await getBookings();
        const showsRes = await getShows();

        // ✅ SAFE extraction
        const bookings =
          bookingsRes.data.bookings ||
          bookingsRes.data ||
          [];

        const shows =
          showsRes.data.shows ||
          showsRes.data ||
          [];

        // ✅ FIX REVENUE (handle all possible keys)
        const getSeatPrice = (seat) => {
  const row = seat[0];

  if (["A", "B"].includes(row)) return 150;
  if (["C", "D", "E", "F"].includes(row)) return 200;
  if (["G", "H", "I", "J"].includes(row)) return 300;

  return 200;
};

const totalRevenue = bookings.reduce((sum, b) => {
  // ✅ If amount exists → use it
  if (b.amount) return sum + b.amount;

  // 🔁 fallback for old bookings
  if (b.seats) {
    let temp = 0;
    b.seats.forEach((seat) => {
      temp += getSeatPrice(seat);
    });
    return sum + temp;
  }

  return sum;
}, 0);
        // ✅ UNIQUE USERS
        const uniqueUsers = new Set(
          bookings.map((b) => b.user || b.userId || "unknown")
        );

        setStats({
          bookings: bookings.length,
          revenue: totalRevenue,
          shows: shows.length,
          users: uniqueUsers.size,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <Loading />;

  const dashboardCards = [
  {
    title: "Total Bookings",
    value: stats.bookings,
    icon: ChartLineIcon,
  },
  {
    title: "Total Revenue",
    value: `${currency}${stats.revenue}`,
    icon: CircleDollarSignIcon,
  },
];

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />

      <div className="flex flex-wrap gap-4 mt-6">
        {dashboardCards.map((card, i) => (
          <div
            key={i}
            className="bg-primary/10 border border-primary/20 p-4 rounded-md w-52"
          >
            <p className="text-sm">{card.title}</p>
            <h2 className="text-xl font-bold mt-1">{card.value}</h2>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;