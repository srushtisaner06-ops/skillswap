import { useState } from "react";

export default function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          style={{
            fontSize: 24,
            cursor: readOnly ? "default" : "pointer",
            color: star <= (hovered || value) ? "#EF9F27" : "#ddd",
            transition: "color 0.1s"
          }}>
          ★
        </span>
      ))}
    </div>
  );
}