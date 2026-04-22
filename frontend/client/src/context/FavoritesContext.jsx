import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // ✅ Load favorites from localStorage on app start
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);

  // ✅ Save favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  }, [favorites]);

  // ✅ Add / Remove favorite
  const toggleFavorite = (movie) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.find((item) => item.id === movie.id);

      if (exists) {
        // Remove
        return prevFavorites.filter((item) => item.id !== movie.id);
      } else {
        // Add
        return [...prevFavorites, movie];
      }
    });
  };

  // ✅ Check if movie is favorite
  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// ✅ Custom hook
export const useFavorites = () => {
  return useContext(FavoritesContext);
};