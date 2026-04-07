import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from "recharts";

const LEVEL_SCORES = { Beginner: 33, Intermediate: 66, Advanced: 100 };

export default function SkillDNA({ skillsToTeach = [], skillsToLearn = [], sessionsTeught = 0, sessionsLearned = 0 }) {

  // Build radar data from teach skills
  const radarData = skillsToTeach.map(s => ({
    skill:      s.name.length > 10 ? s.name.slice(0, 10) + "…" : s.name,
    confidence: LEVEL_SCORES[s.level] || 33
  }));

  // Learning velocity — sessions learned per teach skill added
  const velocity = skillsToTeach.length > 0
    ? Math.min(100, Math.round((sessionsLearned / Math.max(skillsToTeach.length, 1)) * 20))
    : 0;

  // Average confidence across all teach skills
  const avgConfidence = skillsToTeach.length > 0
    ? Math.round(
        skillsToTeach.reduce((sum, s) => sum + (LEVEL_SCORES[s.level] || 33), 0)
        / skillsToTeach.length
      )
    : 0;

  const statCard = (label, value, color) => (
    <div style={{
      background: "#f9f9fc", border: "1px solid #eee",
      borderRadius: 10, padding: "12px 16px", textAlign: "center", flex: 1
    }}>
      <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 500, color }}>{value}</p>
    </div>
  );

  return (
    <div style={{
      background: "#fff", border: "1px solid #eee",
      borderRadius: 14, padding: 24, marginBottom: 24
    }}>
      <div style={{ display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 4 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>Skill DNA</h3>
        <span style={{ fontSize: 12, color: "#888" }}>
          Your unique skill identity
        </span>
      </div>
      <p style={{ margin: "0 0 20px", fontSize: 13, color: "#888" }}>
        Based on your teaching skills and activity
      </p>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {statCard("Skill confidence", `${avgConfidence}%`, "#534AB7")}
        {statCard("Learning velocity", `${velocity}%`, "#1D9E75")}
        {statCard("Sessions taught", sessionsTeught, "#BA7517")}
        {statCard("Sessions learned", sessionsLearned, "#D85A30")}
      </div>

      {/* Radar chart */}
      {radarData.length >= 3 ? (
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#eee" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fontSize: 12, fill: "#555" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#aaa" }}
                tickCount={4}
              />
              <Radar
                name="Confidence"
                dataKey="confidence"
                stroke="#534AB7"
                fill="#534AB7"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "Confidence"]}
                contentStyle={{
                  borderRadius: 8, border: "1px solid #eee",
                  fontSize: 13, padding: "6px 12px"
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{
          height: 200, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#f9f9fc", borderRadius: 10, border: "1px dashed #ddd"
        }}>
          <p style={{ margin: 0, color: "#888", fontSize: 14 }}>
            Add at least 3 teaching skills to unlock your Skill DNA chart
          </p>
          <p style={{ margin: "4px 0 0", color: "#aaa", fontSize: 12 }}>
            {radarData.length}/3 skills added
          </p>
        </div>
      )}

      {/* Skill confidence bars */}
      {skillsToTeach.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 500, color: "#555" }}>
            Skill breakdown
          </p>
          {skillsToTeach.map((s, i) => {
            const pct = LEVEL_SCORES[s.level] || 33;
            const barColor = pct === 100 ? "#1D9E75" : pct === 66 ? "#534AB7" : "#BA7517";
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between",
                  marginBottom: 4, fontSize: 13 }}>
                  <span style={{ color: "#333" }}>{s.name}</span>
                  <span style={{ color: barColor, fontWeight: 500 }}>{s.level} — {pct}%</span>
                </div>
                <div style={{ background: "#f0f0f0", borderRadius: 20, height: 8 }}>
                  <div style={{
                    width: `${pct}%`, height: "100%",
                    borderRadius: 20, background: barColor,
                    transition: "width 0.6s ease"
                  }}/>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Learning wants */}
      {skillsToLearn.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500, color: "#555" }}>
            Skills I'm learning
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {skillsToLearn.map((s, i) => (
              <span key={i} style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 13,
                background: "#EEEDFE", color: "#534AB7",
                border: "1px solid #AFA9EC"
              }}>
                {s.name}
                <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>
                  {s.level}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}