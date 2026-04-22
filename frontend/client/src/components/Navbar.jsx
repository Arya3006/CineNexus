import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import { MenuIcon, TicketPlus, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // 🔍 Search logic
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const debounce = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
        );

        setResults(
          res.data.results
            .filter((m) => m.id && m.poster_path)
            .slice(0, 6)
        );
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      
      {/* Logo */}
      <Link to="/" className="max-md:flex-1">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-primary">Cine</span>
          <span className="text-white">Nexus</span>
        </h1>
      </Link>

      {/* Menu */}
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/movies" onClick={() => setIsOpen(false)}>Movies</Link>
        <Link to="/" onClick={() => setIsOpen(false)}>Theaters</Link>
        <Link to="/" onClick={() => setIsOpen(false)}>Releases</Link>
        <Link to="/favorite" onClick={() => setIsOpen(false)}>Favorites</Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-8">

        {/* 🔍 Search */}
        <div className="relative max-md:hidden">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 rounded-full bg-white/10 border border-gray-300/20 text-white outline-none w-56"
          />

          {results.length > 0 && (
            <div className="absolute top-full mt-2 w-72 bg-gray-900 rounded-lg shadow-lg z-50 overflow-hidden">
              {results.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => {
                    navigate(`/movies/${movie.id}`); // ✅ FIXED ROUTE
                    setQuery("");
                    setResults([]);
                  }}
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-semibold">{movie.title}</p>
                    <p className="text-xs text-gray-400">
                      {movie.release_date?.split("-")[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auth */}
        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      {/* Mobile menu button */}
      <MenuIcon
        onClick={() => setIsOpen(!isOpen)}
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
      />
    </div>
  );
};

export default Navbar;