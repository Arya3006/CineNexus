import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import Loading from "../components/Loading";
import { useFavorites } from "../context/FavoritesContext";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  // 🎬 Fetch movie details
  const fetchMovie = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&append_to_response=credits`
      );
      const data = await res.json();
      setMovie(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🎥 Fetch trailer
  const fetchTrailer = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      const data = await res.json();

      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );

      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovie();
    fetchTrailer();
  }, [id]);

  if (!movie) return <Loading />;

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        
        {/* 🎬 Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt="poster"
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        {/* 🎬 Info */}
        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />

          <p className="text-primary">
            {movie.original_language?.toUpperCase()}
          </p>

          <h1 className="text-4xl font-semibold max-w-96">
            {movie.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} User Rating
          </div>

          <p className="text-gray-400 mt-2 text-sm max-w-xl">
            {movie.overview}
          </p>

          <p>
            {movie.release_date?.split("-")[0]} •{" "}
            {movie.genres?.map((g) => g.name).join(", ")}
          </p>

          {/* 🎬 Buttons */}
          <div className="flex items-center flex-wrap gap-4 mt-4">

            {/* ▶ Trailer */}
            <button
              onClick={() => {
                if (trailerKey) {
                  window.open(
                    `https://www.youtube.com/watch?v=${trailerKey}`,
                    "_blank"
                  );
                } else {
                  alert("Trailer not available");
                }
              }}
              className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 rounded-md"
            >
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>

            {/* 🎟 Booking */}
            <button
              onClick={() => navigate(`/booking/${id}/0`)}
              className="px-10 py-3 text-sm bg-primary rounded-md"
            >
              Buy Tickets
            </button>

            {/* ❤️ Favorite (still pending backend) */}
            <button
  onClick={() => movie && toggleFavorite(movie)}
  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
>
  <Heart
    className={`w-5 h-5 ${
      isFavorite(movie?.id)
        ? "text-red-500 fill-red-500"
        : "text-gray-300"
    }`}
  />
</button>

          </div>
        </div>
      </div>

      {/* 🎭 CAST */}
      <p className="text-lg mt-20">Top Cast</p>

      <div className="flex gap-4 overflow-x-auto mt-6 pb-4">
        {movie.credits?.cast?.slice(0, 10).map((cast) => (
          <div key={cast.id} className="text-center">
            <img
              src={
                cast.profile_path
                  ? `https://image.tmdb.org/t/p/w200${cast.profile_path}`
                  : "https://via.placeholder.com/100"
              }
              className="rounded-full w-20 h-20 object-cover"
            />
            <p className="text-xs mt-2">{cast.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;