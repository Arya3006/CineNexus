import { StarIcon, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66 relative">
      
      {/* 🎬 Poster */}
      <div className="relative">
        <img
          onClick={() => {
            navigate(`/movies/${movie.id}`);
            scrollTo(0, 0);
          }}
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg h-52 w-full object-cover cursor-pointer"
        />

        {/* ❤️ Heart Button (your preferred simple style) */}
        <button
          onClick={() => toggleFavorite(movie)}
          className="absolute top-2 right-2 p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite(movie.id)
                ? "text-red-500 fill-red-500"
                : "text-gray-300"
            }`}
          />
        </button>
      </div>

      {/* 🎥 Title */}
      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      {/* 📅 Year */}
      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()}
      </p>

      {/* ⭐ Bottom Section */}
      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={() => {
            navigate(`/movies/${movie.id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average?.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;