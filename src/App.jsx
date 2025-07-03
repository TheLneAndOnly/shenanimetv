import React, { useEffect, useState } from "react";

const sections = [
  { title: "Top Airing", endpoint: "https://api.jikan.moe/v4/top/anime?filter=airing&limit=10" },
  { title: "Most Popular", endpoint: "https://api.jikan.moe/v4/top/anime?limit=10" },
  { title: "Upcoming", endpoint: "https://api.jikan.moe/v4/top/anime?filter=upcoming&limit=10" }
];

function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const results = await Promise.all(
        sections.map(async (section) => {
          const res = await fetch(section.endpoint);
          const data = await res.json();
          return { title: section.title, anime: data.data || [] };
        })
      );
      setRows(results);
    }
    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: "#0f0f0f", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif" }}>
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
                    minWidth: "160px",
                    backgroundColor: "#1c1c1c",
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out"
                  }}
                >
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    style={{ width: "100%", height: "230px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "0.5rem" }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>{anime.title}</div>
                    <div style={{ fontSize: "11px", color: "#aaa" }}>{anime.status}</div>
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
