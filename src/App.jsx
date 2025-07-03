import React, { useEffect, useState } from "react";

const genres = [
  { title: "Action", id: 1 },
  { title: "Romance", id: 22 },
  { title: "Horror", id: 14 }
];

function App() {
  const [rows, setRows] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [fontSize, setFontSize] = useState("medium");
  const [coverSize, setCoverSize] = useState("medium");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    async function fetchGenres() {
      const results = await Promise.all(
        genres.map(async (genre) => {
          const res = await fetch(`https://api.jikan.moe/v4/anime?genres=${genre.id}&order_by=score&limit=10`);
          const data = await res.json();
          const animeOnly = data.data.filter(item => item.type === "TV" || item.type === "Movie");
          return { title: genre.title, anime: animeOnly };
        })
      );
      setRows(results);
    }
    fetchGenres();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (anime) => {
    const exists = favorites.find((f) => f.mal_id === anime.mal_id);
    if (exists) {
      setFavorites(favorites.filter((f) => f.mal_id !== anime.mal_id));
    } else {
      setFavorites([...favorites, anime]);
    }
  };

  const isFavorite = (anime) => favorites.some((f) => f.mal_id === anime.mal_id);

  const theme = {
    background: darkMode ? "#0f0f0f" : "#f0f0f0",
    color: darkMode ? "#ffffff" : "#111111",
    cardBg: darkMode ? "#1c1c1c" : "#ffffff",
    overlay: darkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)",
    highlight: "#f85f73"
  };

  const fontSizes = {
    small: "12px",
    medium: "14px",
    large: "16px"
  };

  const coverHeights = {
    small: "180px",
    medium: "240px",
    large: "300px"
  };

  return (
    <div style={{ backgroundColor: theme.background, color: theme.color, minHeight: "100vh", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <header style={{
        backgroundColor: darkMode ? "#1a1a1a" : "#e0e0e0",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ margin: 0, color: theme.highlight }}>shenanimetv</h1>
        <button onClick={() => setShowSettings(!showSettings)} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>⚙️ Settings</button>
      </header>

      {showSettings && (
        <div style={{ padding: "1rem 2rem", backgroundColor: theme.cardBg, borderBottom: `2px solid ${theme.highlight}` }}>
          <div style={{ marginBottom: "10px" }}>
            <label>Theme: </label>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Font Size: </label>
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Cover Size: </label>
            <select value={coverSize} onChange={(e) => setCoverSize(e.target.value)}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <button onClick={() => setFavorites([])}>🗑 Clear Favorites</button>
        </div>
      )}

      <main style={{ padding: "2rem", fontSize: fontSizes[fontSize] }}>
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", borderLeft: `4px solid ${theme.highlight}`, paddingLeft: "0.5rem" }}>❤️ Favorites</h2>
          {favorites.length === 0 ? (
            <p>No favorites yet.</p>
          ) : (
            <div style={{ display: "flex", overflowX: "auto", gap: "1rem" }}>
              {favorites.map((anime) => (
                <AnimeCard
                  key={anime.mal_id}
                  anime={anime}
                  theme={theme}
                  height={coverHeights[coverSize]}
                  isFavorite={true}
                  toggleFavorite={() => toggleFavorite(anime)}
                />
              ))}
            </div>
          )}
        </div>

        {rows.map((row, i) => (
          <div key={i} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", borderLeft: `4px solid ${theme.highlight}`, paddingLeft: "0.5rem" }}>
              {row.title}
            </h2>
            <div style={{ display: "flex", overflowX: "auto", gap: "1rem", paddingBottom: "0.5rem" }}>
              {row.anime.map((anime) => (
                <AnimeCard
                  key={anime.mal_id}
                  anime={anime}
                  theme={theme}
                  height={coverHeights[coverSize]}
                  isFavorite={isFavorite(anime)}
                  toggleFavorite={() => toggleFavorite(anime)}
                />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

function AnimeCard({ anime, theme, height, isFavorite, toggleFavorite }) {
  return (
    <div
      onClick={() => window.open(anime.url, "_blank")}
      style={{
        position: "relative",
        minWidth: "160px",
        backgroundColor: theme.cardBg,
        borderRadius: "10px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.3s ease"
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        style={{ width: "100%", height: height, objectFit: "cover" }}
      />
      <div style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: theme.overlay,
        padding: "6px",
        fontWeight: "bold",
        textAlign: "center",
        color: theme.color,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}>
        {anime.title}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: isFavorite ? theme.highlight : "transparent",
          border: "1px solid white",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        ❤
      </button>
    </div>
  );
}

export default App;
