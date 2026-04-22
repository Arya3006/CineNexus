import { useEffect, useState } from "react";

const TrailersSection = () => {
  const [trailers, setTrailers] = useState([]);
  const [current, setCurrent] = useState(0);

  // 🎬 Fetch latest trailers
  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );
        const data = await res.json();

        const movies = data.results.slice(0, 5);

        const trailerPromises = movies.map(async (movie) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
          );
          const data = await res.json();

          const trailer = data.results.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          );

          return trailer
            ? {
                key: trailer.key,
                title: movie.title,
                backdrop: movie.backdrop_path,
              }
            : null;
        });

        const results = await Promise.all(trailerPromises);
        setTrailers(results.filter(Boolean));
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrailers();
  }, []);

  if (trailers.length === 0) return null;

  return (
    <div className="px-6 md:px-16 lg:px-40 mt-20 text-white">
      
      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">
        Latest Trailers
      </h2>

      {/* 🎬 MAIN TRAILER */}
      <div className="w-full mb-6 rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${trailers[current].key}`}
          title="Trailer"
          allowFullScreen
          className="w-full h-[400px] md:h-[500px]"
        ></iframe>
      </div>

      {/* 🎞 THUMBNAILS (CENTERED PROPERLY) */}
<div className="flex justify-center">
  <div className="flex gap-4 pb-2">
    {trailers.map((trailer, index) => (
      <div
        key={index}
        onClick={() => setCurrent(index)}
        className={`relative w-[250px] h-[150px] rounded-lg overflow-hidden cursor-pointer ${
          current === index ? "ring-2 ring-primary" : ""
        }`}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${trailer.backdrop}`}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
            ▶
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default TrailersSection;