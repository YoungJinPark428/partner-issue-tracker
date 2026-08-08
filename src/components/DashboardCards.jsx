import { styles } from "../styles";

export default function DashboardCards({
  issues,
}) {
  const cards = [
    [
      "전체",
      issues.length,
      "#333",
    ],
    [
      "방안도출",
      issues.filter(
        (i) =>
          i.status ===
          "방안 도출 중"
      ).length,
      "#ff4d4f",
    ],
    [
      "설계진행",
      issues.filter(
        (i) =>
          i.status ===
          "설계진행중"
      ).length,
      "#faad14",
    ],
    [
      "제작중",
      issues.filter(
        (i) =>
          i.status === "제작중"
      ).length,
      "#1677ff",
    ],
    [
      "모니터링",
      issues.filter(
        (i) =>
          i.status ===
          "모니터링 중"
      ).length,
      "#13c2c2",
    ],
    [
      "확산전개",
      issues.filter(
        (i) =>
          i.status ===
          "확산전개중"
      ).length,
      "#722ed1",
    ],
    [
      "완료",
      issues.filter(
        (i) =>
          i.status === "완료"
      ).length,
      "#52c41a",
    ],
    [
      "Drop",
      issues.filter(
        (i) =>
          i.status === "Drop"
      ).length,
      "#8c8c8c",
    ],
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap : "wrap",
        gap: "8px",
        justifyContent : "start",
        margin: "20px 0",
      }}
    >
      {cards.map(
        ([label, value, color]) => (
          <div
            key={label}
            style={{
              ...styles.dashboard,
              borderTop: `4px solid ${color}`,
              width : "120px",
              minWidth : "100px",
              maxWidth : "140px",
              
              
              padding : "12px",
              minheight : "70px",
            }}
          >
            <span
              style={{
                display: "block",
                color: "#666",
                marginBottom: 8,
              }}
            >
              {label}
            </span>

            <b
              style={{
                fontSize: 28,
                color,
              }}
            >
              {value}
            </b>
          </div>
        )
      )}
    </div>
  );
}