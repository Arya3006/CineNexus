import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { CheckIcon, StarIcon } from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import { addShow } from "../../lib/api";

const AddShows = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // 🎬 Fetch movies from TMDB
  const fetchNowPlayingMovies = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      const data = await res.json();

      const movies = data.results.map((movie) => ({
        ...movie,
        poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      }));

      setNowPlayingMovies(movies);
    } catch (err) {
      console.error(err);
    }
  };

  // ➕ Add Show
  const handleAddShow = async () => {
    if (!selectedMovie) {
      alert("Please select a movie");
      return;
    }

    try {
      const movie = nowPlayingMovies.find(
        (m) => m.id === selectedMovie
      );

      await addShow({
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster_path,
      });

      alert("Show added successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to add show ❌");
    }
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />

      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>

      <div className="overflow-x-auto pb-4">
        <div className="flex flex-wrap gap-4 mt-4">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative max-w-40 cursor-pointer hover:-translate-y-1 transition duration-300"
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={movie.poster_path}
                  alt="poster"
                  className="w-full object-cover"
                />

                <div className="text-sm flex justify-between p-2 bg-black/70 absolute bottom-0 w-full">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-300">
                    {kConverter(movie.vote_count)} Votes
                  </p>
                </div>
              </div>

              {selectedMovie === movie.id && (
                <div className="absolute top-2 right-2 bg-primary h-6 w-6 flex items-center justify-center rounded">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
              )}

              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">
                {movie.release_date}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ ONLY BUTTON LEFT */}
      <button
        onClick={handleAddShow}
        className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90"
      >
        Add Show
      </button>
    </>
  ) : (
    <Loading />
  );
};

export default AddShows;