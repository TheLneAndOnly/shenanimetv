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
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5em", textAlign: "center", marginBottom: "1em" }}>shenanimetv</h1>
      <div style={{ textAlign: "center", marginBottom: "2em" }}>
        <input
          type="text"
          placeholder="Search anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "80%",
            maxWidth: "500px",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #888",
            backgroundColor: "#1e1e1e",
            color: "#fff"
          }}
        />
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "20px"
      }}>
        {animeList.map(anime => (
          <div
            key={anime.mal_id}
            onClick={() => window.open(anime.url, "_blank")}
            style={{
              cursor: "pointer",
              backgroundColor: "#1c1c1c",
              borderRadius: "10px",
              overflow: "hidden",
              transition: "transform 0.2s"
            }}
          >
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              style={{ width: "100%", height: "220px", objectFit: "cover" }}
            />
            <div style={{ padding: "10px" }}>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>{anime.title}</div>
              <div style={{ fontSize: "12px", color: "#ccc" }}>
                {anime.year || "Unknown"} • {anime.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
