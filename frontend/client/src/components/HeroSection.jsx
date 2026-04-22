import { useEffect, useState } from "react";

const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);

  // 🎬 Fetch latest movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_API_KEY}&region=IN`
        );
        const data = await res.json();
        setMovies(data.results.slice(0, 5)); // top 5 movies
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  // 🔁 Auto slide
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 4000); // 4 sec

    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) return null;

  const movie = movies[current];

  return (
    <div
      className="relative min-h-screen flex items-center px-6 md:px-16 lg:px-24 xl:px-44 text-white"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>

      {/* Content */}
      <div className="relative max-w-xl z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {movie.title}
        </h1>

        <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6">
          {movie.overview}
        </p>

        <button
          onClick={() => (window.location.href = `/movies/${movie.id}`)}
          className="px-6 py-3 bg-primary rounded-md font-medium"
        >
          Explore Movie →
        </button>
      </div>
    </div>
  );
};

export default HeroSection;