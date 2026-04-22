import { useEffect, useState } from "react";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";

const Movies = () => {
  const [movies, setMovies] = useState([]);

  // 🎬 Fetch real movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );
        const data = await res.json();

        setMovies(data.results);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  return movies.length > 0 ? (
  <div className="relative my-40 mb-60 max-w-7xl mx-auto px-6 overflow-hidden min-h-[80vh]">
    
    <BlurCircle top="150px" left="0" />
    <BlurCircle bottom="50px" right="50px" />

    <h1 className="text-lg font-medium my-4">Now Showing</h1>

    {/* ✅ CENTERED GRID */}
    <div className="flex flex-wrap justify-center gap-8">
      {movies.map((movie) => (
        <MovieCard movie={movie} key={movie.id} />
      ))}
    </div>

  </div>
) : (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-3xl font-bold text-center">No movies available</h1>
  </div>
);
};

export default Movies;