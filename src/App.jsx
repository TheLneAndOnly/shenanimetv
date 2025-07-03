import React, { useEffect, useState } from "react";

const genres = [
  { title: "Action", id: 1 },
  { title: "Romance", id: 22 },
  { title: "Horror", id: 14 }
];

function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchGenres() {
      const results = await Promise.all(
        genres.map(async (genre) => {
          const res = await fetch(`https://api.jikan.moe/v4/anime?genres=${genre.id}&order_by=score&limit=10`);
          const data = await res.json();
          return { title: genre.title, anime: data.data || [] };
        })
      );
      setRows(results);
    }
    fetchGenres();
  }, []);

  return (
    <div style={{ backgroundColor: "#0f0f0f", minHeight: "100vh", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <header style={{
        backgroundColor: "#1a1a1a",
        padding: "1rem 2rem",
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#f85f73"
      }}>
        shenanimetv
      </header>

      <main style={{ padding: "2rem" }}>
        {rows.map((row, i) => (
          <div key={i} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", borderLeft: "4px solid #f85f73", paddingLeft: "0.5rem" }}>
              {row.title}
            </h2>
            <div style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              paddingBottom: "0.5rem",
              scrollbarWidth: "none"
            }}>
              {row.anime.map((anime) => (
                <div
                  key={anime.mal_id}
                  onClick={() => window.open(anime.url, "_blank")}
                  style={{
                    position: "relative",
                    minWidth: "160px",
                    backgroundColor: "#1c1c1c",
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    style={{ width: "100%", height: "240px", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    background: "rgba(0,0,0,0.6)",
                    padding: "6px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#fff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {anime.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
