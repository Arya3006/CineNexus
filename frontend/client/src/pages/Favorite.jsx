import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import { useFavorites } from "../context/FavoritesContext";

const Favorite = () => {
  const { favorites } = useFavorites();

  return (
    <div className="px-6 md:px-16 lg:px-40 mt-20 text-white">
      <h1 className="text-xl font-semibold mb-6">Your Favorites</h1>

      {favorites.length === 0 ? (
        <p>No favorites added yet</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;