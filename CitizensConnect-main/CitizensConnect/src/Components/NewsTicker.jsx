import React, { useEffect, useState, useRef } from "react";
import "./NewsTicker.css";

const PROXY_URL = "/api/news";
const FALLBACK = [
  { title: "Andhra Pradesh government launches new digital literacy program for rural areas", url: "https://telugu.way2news.com/", source: "Government" },
  { title: "Citizens urged to report potholes and infrastructure issues through CitizensConnect", url: "https://telugu.way2news.com/", source: "Public Notice" },
  { title: "Local MLA addresses water scarcity concerns in Vijayawada district", url: "https://telugu.way2news.com/", source: "Politics" },
  { title: "New traffic management system implemented in major cities", url: "https://telugu.way2news.com/", source: "Infrastructure" },
  { title: "Community health camp scheduled for next weekend in rural areas", url: "https://telugu.way2news.com/", source: "Health" },
];

export default function NewsTicker() {
  const [items, setItems] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function fetchFromProxy() {
      try {
        setUsingFallback(false);
        const base = (window.location.hostname === "localhost" ? "http://localhost:4000" : "");
        const url = base + PROXY_URL;
        console.log("[NewsTicker] requesting proxy:", url);
        const r = await fetch(url);
        console.log("[NewsTicker] proxy status:", r.status);
        if (!r.ok) throw new Error("proxy returned " + r.status);
        const json = await r.json();
        const arr = (json && json.items) || [];
        if (!mounted.current) return;
        if (!arr.length) throw new Error("proxy returned empty list");
        setItems(arr.slice(0, 20));
      } catch (err) {
        console.error("[NewsTicker] proxy fetch failed:", err);
        if (!mounted.current) return;
        setItems(FALLBACK);
        setUsingFallback(true);
      }
    }

    fetchFromProxy();
    const t = setInterval(fetchFromProxy, 1000 * 60 * 2);
    return () => { mounted.current = false; clearInterval(t); };
  }, []);

  if (!items || !items.length) return null;
  const track = [...items, ...items];

  function openExternal(idx) {
    const article = items[idx];
    if (!article || !article.url) return;
    let url = article.url;
    if (url.startsWith("/")) url = "https://telugu.way2news.com" + url;
    window.open(url, "_blank", "noopener");
  }

  return (
    <div className="news-ticker" role="region" aria-label="Latest Telugu news">
      <div className="news-inner">
        <div className="news-track" aria-hidden>
          {track.map((it, i) => {
            const idx = i % items.length;
            return (
              <button key={i} className="news-item" onClick={() => openExternal(idx)} type="button" title={it.title}>
                <span className="news-dot">•</span>
                <strong>{it.source || "news"}</strong> {it.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
