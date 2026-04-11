import { useState } from "react";

const TYPE_STYLES = {
  project:     { bg: "#EEEDFE", color: "#534AB7", label: "Project" },
  certificate: { bg: "#E1F5EE", color: "#085041", label: "Certificate" },
  video:       { bg: "#FAEEDA", color: "#633806", label: "Teach demo" }
};

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function isGitHub(url) {
  return url?.includes("github.com");
}

export default function Portfolio({ items = [] }) {
  const [preview, setPreview] = useState(null); // item being previewed

  if (items.length === 0) return null;

  return (
    <div style={{
      background: "#fff", border: "1px solid #eee",
      borderRadius: 14, padding: 24, marginBottom: 24
    }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 4 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>Interactive portfolio</h3>
        <span style={{ fontSize: 12, color: "#888" }}>{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>
      <p style={{ margin: "0 0 20px", fontSize: 13, color: "#888" }}>
        Projects, certificates and teaching demos
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {items.map((item, i) => {
          const style   = TYPE_STYLES[item.type] || TYPE_STYLES.project;
          const ytId    = item.type === "video" ? getYouTubeId(item.url) : null;
          const isGH    = isGitHub(item.url);
          const thumb   = ytId
            ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
            : item.thumbnail || null;

          return (
            <div key={i}
              onClick={() => setPreview(item)}
              style={{
                border: "1px solid #eee", borderRadius: 10,
                overflow: "hidden", cursor: "pointer",
                transition: "border-color 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#AFA9EC"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#eee"}
            >
              {/* Thumbnail / preview area */}
              {thumb ? (
                <div style={{ position: "relative", height: 120, overflow: "hidden",
                  background: "#f5f5f5" }}>
                  <img src={thumb} alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                  {item.type === "video" && (
                    <div style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 36, height: 36, borderRadius: "50%",
                      background: "rgba(0,0,0,0.6)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <span style={{ color: "#fff", fontSize: 14, marginLeft: 3 }}>▶</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  height: 80, background: style.bg,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <span style={{ fontSize: 28 }}>
                    {item.type === "video" ? "🎥" : item.type === "certificate" ? "🏆" : isGH ? "⌨️" : "🌐"}
                  </span>
                </div>
              )}

              {/* Card info */}
              <div style={{ padding: "10px 12px" }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 20,
                    background: style.bg, color: style.color, fontWeight: 500
                  }}>
                    {style.label}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500,
                  color: "#333", lineHeight: 1.3 }}>
                  {item.title}
                </p>
                {item.description && (
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888",
                    lineHeight: 1.4,
                    overflow: "hidden", display: "-webkit-box",
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview modal */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 300
          }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 16, padding: 24,
              width: "90%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto"
            }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 20,
                  background: TYPE_STYLES[preview.type]?.bg,
                  color: TYPE_STYLES[preview.type]?.color,
                  fontWeight: 500, marginBottom: 6, display: "inline-block"
                }}>
                  {TYPE_STYLES[preview.type]?.label}
                </span>
                <h3 style={{ margin: "6px 0 0" }}>{preview.title}</h3>
              </div>
              <button onClick={() => setPreview(null)}
                style={{ background: "none", border: "none",
                  fontSize: 20, cursor: "pointer", color: "#888", padding: 0 }}>
                ✕
              </button>
            </div>

            {preview.description && (
              <p style={{ margin: "0 0 16px", color: "#555", fontSize: 14, lineHeight: 1.6 }}>
                {preview.description}
              </p>
            )}

            {/* YouTube embed */}
            {preview.type === "video" && getYouTubeId(preview.url) && (
              <div style={{ position: "relative", paddingBottom: "56.25%",
                height: 0, marginBottom: 16, borderRadius: 10, overflow: "hidden" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(preview.url)}`}
                  title={preview.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                />
              </div>
            )}

            {/* Website live preview */}
            {preview.type === "project" && preview.url && !isGitHub(preview.url) && (
              <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden",
                border: "1px solid #eee", height: 300 }}>
                <iframe
                  src={preview.url}
                  title={preview.title}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            )}

            {/* Certificate image preview */}
            {preview.type === "certificate" && preview.thumbnail && (
              <img src={preview.thumbnail} alt={preview.title}
                style={{ width: "100%", borderRadius: 10,
                  border: "1px solid #eee", marginBottom: 16 }}/>
            )}

            {/* Open link button */}
            {preview.url && (
              <a href={preview.url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-block", padding: "10px 20px",
                  background: "#534AB7", color: "#fff", borderRadius: 8,
                  textDecoration: "none", fontSize: 14, fontWeight: 500
                }}>
                {preview.type === "video" ? "Watch on YouTube" :
                 isGitHub(preview.url) ? "View on GitHub" :
                 preview.type === "certificate" ? "View certificate" : "Open project"}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}