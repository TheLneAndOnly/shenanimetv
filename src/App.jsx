import React, { useState, useEffect } from "react";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search.length < 2) {
      setAnimeList([]);
      return;
    }
    fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(search)}&limit=20`)
      .then(res => res.json())
      .then(data => setAnimeList(data.data || []))
      .catch(() => setAnimeList([]));
  }, [search]);

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <header style={{
        backgroundColor: "#1c1c1c",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <h1 style={{ margin: 0, fontSize: "1.8rem", color: "#f85f73" }}>shenanimetv</h1>
        <input
          type="text"
          placeholder="Search anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            border: "none",
            outline: "none",
            width: "220px",
            backgroundColor: "#2a2a2a",
            color: "#fff"
          }}
        />
      </header>

      <main style={{ padding: "2rem" }}>
        {animeList.length > 0 && (
          <>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Search Results</h2>
            <div style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              paddingBottom: "1rem"
            }}>
              {animeList.map((anime) => (
                <div
                  key={anime.mal_id}
                  onClick={() => window.open(anime.url, "_blank")}
                  style={{
                    minWidth: "160px",
                    cursor: "pointer",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    transition: "transform 0.2s ease"
                  }}
                >
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    style={{ width: "100%", height: "240px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "0.5rem" }}>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "#fefefe" }}>
                      {anime.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "#aaa" }}>
                      {anime.year || "Unknown"} • {anime.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
