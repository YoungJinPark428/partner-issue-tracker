import { STATUS_OPTIONS } from "../constants";

export default function IssueTable({ issues, currentProfile, onSelect, onStatusChange }) {
  return <div style={{ overflowX: "auto" }}><table border="1" cellPadding="11" style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead style={{ background: "#f1f1f1" }}><tr>
      <th>Issue No</th><th>제목</th><th>발생일</th><th>발생장비</th><th>범위</th><th>협력사</th><th>Status</th>
    </tr></thead>
    <tbody>{issues.map(issue => <tr key={issue.issueNo} style={{ background: issue.status === "완료" ? "#e9f8ee" : "white" }}>
      <td>{issue.issueNo}</td>
      <td><button onClick={() => onSelect(issue.issueNo)} style={{ border: 0, background: "none", color: "#06c", textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}>{issue.title}</button></td>
      <td>{issue.date}</td><td>{issue.equipment.join(", ")}</td>
      <td>{issue.occurrenceType}{issue.occurrenceType === "단발" && issue.equipmentNumber && <small style={{ display: "block", color: "#666" }}>{issue.equipmentNumber}</small>}</td>
      <td>{issue.vendor}</td>
      
<td>
  <select
    value={issue.status}
    disabled={
      currentProfile?.role !==
      "admin"
    }
    onChange={e =>
      onStatusChange(
        issue.issueNo,
        e.target.value
      )
    }
    style={{
      backgroundColor:
        currentProfile?.role ===
        "admin"
          ? "white"
          : "#f3f4f6",
      cursor:
        currentProfile?.role ===
        "admin"
          ? "pointer"
          : "not-allowed",
    }}
  >
    {STATUS_OPTIONS.map(
      (s) => (
        <option
          key={s}
          value={s}
        >
          {s}
        </option>
      )
    )}
  </select>
</td>



    </tr>)}</tbody>
  </table></div>;
}
