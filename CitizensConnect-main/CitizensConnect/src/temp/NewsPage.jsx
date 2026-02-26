import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function NewsPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("news_items");
      if (raw) {
        const arr = JSON.parse(raw);
        const idx = Number(id);
        if (Array.isArray(arr) && arr[idx]) {
          setArticle(arr[idx]);
          return;
        }
      }
    } catch (e) {
      console.error("read news from sessionStorage failed", e);
    }
    setArticle({ title: "Article not available", description: "This article wasn't preserved in the session. Please open the article directly from the ticker again.", url: "#" });
  }, [id]);

  if (!article) return <div style={{padding:40}}>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "48px auto", padding: "0 16px" }}>
      <div style={{ background: "#fff", padding: 28, borderRadius: 12, boxShadow: "0 8px 30px rgba(20,20,20,0.06)" }}>
        <h1 style={{ color: "#6a47f2" }}>{article.title}</h1>
        <p style={{ color: "#777", marginTop: 6 }}>{article.source} — {new Date(article.publishedAt || Date.now()).toLocaleString()}</p>
        <div style={{ marginTop: 18, fontSize: 16, color: "#333" }}>
          {article.description || "No description available."}
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <a href={article.url || "#"} target="_blank" rel="noopener noreferrer" className="btn-primary">Open original</a>
          <Link to="/" className="btn-ghost">Back to home</Link>
        </div>
      </div>
    </div>
  );
}