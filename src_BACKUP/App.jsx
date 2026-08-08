import { useState } from "react";

const STATUS_OPTIONS = [
  "Open",
  "Drop",
  "방안 도출 중",
  "설계진행중",
  "제작중",
  "모니터링 중",
  "확산전개중",
  "완료",
];

const EQUIPMENT_OPTIONS = [
  "DAS3",
  "DAS4",
  "DAS5",
  "DAS7",
  "A-HDP",
  "B-HDP",
];

const VENDOR_OPTIONS = [
  "HPK",
  "PROTNC",
  "BZ",
  "JST",
];

function App() {
  const [isLogin, setIsLogin] = useState(false);

  const [showRegisterForm, setShowRegisterForm] =
    useState(false);

  const [selectedIssueNo, setSelectedIssueNo] =
    useState(null);

  const [issues, setIssues] = useState([
    {
      issueNo: "DAS-001",
      title: "Nozzle Clogging",
      date: "2026-08-04",
      equipment: ["DAS3"],
      occurrenceType: "단발",
      equipmentNumber: "DAS3-02호기",
      vendor: "HPK",
      status: "Open",
      content: "DAS Nozzle 막힘이 반복적으로 발생함",
      action: "Filter 교체 및 Cleaning 조건 검토 중",
      spread: false,
      comments: [
        {
          writer: "HPK PM",
          content: "Filter 교체 후 시험을 진행하고 있습니다.",
        },
        {
          writer: "박영진",
          content: "시험 결과와 재발 여부를 공유해 주세요.",
        },
      ],
    },
    {
      issueNo: "DAS-002",
      title: "Vision Bracket Interference",
      date: "2026-08-04",
      equipment: ["DAS4", "DAS5"],
      occurrenceType: "전체",
      equipmentNumber: "",
      vendor: "PROTNC",
      status: "설계진행중",
      content: "Vision 조명 변경 후 Bracket 간섭 발생",
      action: "간섭 회피 설계안 검토 중",
      spread: true,
      comments: [
        {
          writer: "PROTNC PM",
          content: "설계 변경안 2종을 비교 검토 중입니다.",
        },
      ],
    },
    {
      issueNo: "DAS-003",
      title: "SW Release Note Missing",
      date: "2026-08-04",
      equipment: ["A-HDP", "B-HDP"],
      occurrenceType: "전체",
      equipmentNumber: "",
      vendor: "BZ",
      status: "방안 도출 중",
      content: "Software 변경 이력 및 Release Note 누락",
      action: "Release Note 표준 Template 작성 중",
      spread: false,
      comments: [],
    },
  ]);

  const [newIssue, setNewIssue] = useState({
    issueNo: "",
    title: "",
    date: "",
    equipment: [],
    occurrenceType: "단발",
    equipmentNumber: "",
    vendor: "HPK",
    status: "Open",
    content: "",
    action: "",
    spread: false,
  });

  const [newComment, setNewComment] = useState("");

  const selectedIssue = issues.find(
    (issue) => issue.issueNo === selectedIssueNo
  );

  const handleNewIssueChange = (field, value) => {
    setNewIssue({
      ...newIssue,
      [field]: value
  })};

  const handleEquipmentChange = (equipmentName) => {
    const isAlreadySelected =
      newIssue.equipment.includes(equipmentName);

    if (isAlreadySelected) {
      setNewIssue({
        ...newIssue,
        equipment: newIssue.equipment.filter(
          (item) => item !== equipmentName
        ),
      });
    } else {
      setNewIssue({
        ...newIssue,
        equipment: [
          ...newIssue.equipment,
          equipmentName,
        ],
      });
    }
  };

  const addIssue = () => {
    if (newIssue.issueNo.trim() === "") {
      alert("Issue No를 입력해 주세요.");
      return;
    }

    if (newIssue.title.trim() === "") {
      alert("이슈 제목을 입력해 주세요.");
      return;
    }

    if (newIssue.date === "") {
      alert("발생일을 선택해 주세요.");
      return;
    }

    if (newIssue.equipment.length === 0) {
      alert("발생장비를 한 개 이상 선택해 주세요.");
      return;
    }

    if (
      newIssue.occurrenceType === "단발" &&
      newIssue.equipmentNumber.trim() === ""
    ) {
      alert(
        "단발 이슈인 경우 특정 장비 번호 또는 호기를 입력해 주세요."
      );
      return;
    }

    const duplicateIssue = issues.some(
      (issue) =>
        issue.issueNo.toLowerCase() ===
        newIssue.issueNo.trim().toLowerCase()
    );

    if (duplicateIssue) {
      alert("이미 등록된 Issue No입니다.");
      return;
    }

    const issueToAdd = {
      ...newIssue,
      issueNo: newIssue.issueNo.trim(),
      title: newIssue.title.trim(),
      equipmentNumber:
        newIssue.occurrenceType === "전체"
          ? ""
          : newIssue.equipmentNumber.trim(),
      comments: [],
    };

    setIssues([...issues, issueToAdd]);

    setNewIssue({
      issueNo: "",
      title: "",
      date: "",
      equipment: [],
      occurrenceType: "단발",
      equipmentNumber: "",
      vendor: "HPK",
      status: "Open",
      content: "",
      action: "",
      spread: false,
    });

    setShowRegisterForm(false);

    alert("이슈가 등록되었습니다.");
  };

  const updateIssueStatus = (
    issueNo,
    changedStatus
  ) => {
    const updatedIssues = issues.map((issue) =>
      issue.issueNo === issueNo
        ? {
            ...issue,
            status: changedStatus,
          }
        : issue
    );

    setIssues(updatedIssues);
  };

  const updateIssueSpread = (
    issueNo,
    changedSpread
  ) => {
    const updatedIssues = issues.map((issue) =>
      issue.issueNo === issueNo
        ? {
            ...issue,
            spread: changedSpread,
          }
        : issue
    );

    setIssues(updatedIssues);
  };

  const addComment = () => {
    if (newComment.trim() === "") {
      alert("댓글 내용을 입력해 주세요.");
      return;
    }

    const updatedIssues = issues.map((issue) =>
      issue.issueNo === selectedIssueNo
        ? {
            ...issue,
            comments: [
              ...issue.comments,
              {
                writer: "박영진",
                content: newComment.trim(),
              },
            ],
          }
        : issue
    );

    setIssues(updatedIssues);
    setNewComment("");
  };

  const completedCount = issues.filter(
    (issue) => issue.status === "완료"
  ).length;

  const progressingCount = issues.filter(
    (issue) =>
      issue.status !== "완료" &&
      issue.status !== "Drop"
  ).length;

  const spreadCount = issues.filter(
    (issue) => issue.spread
  ).length;

  if (!isLogin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "380px",
            backgroundColor: "white",
            padding: "35px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              marginBottom: "8px",
            }}
          >
            협력사 PM 이슈 관리
          </h1>

          <p
            style={{
              color: "#666",
              marginBottom: "30px",
            }}
          >
            승인된 사용자만 접속할 수 있습니다.
          </p>

          <label>
            <b>이메일</b>
          </label>

          <input
            placeholder="이메일을 입력하세요"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "18px",
              boxSizing: "border-box",
            }}
          />

          <label>
            <b>비밀번호</b>
          </label>

          <input
            placeholder="비밀번호를 입력하세요"
            type="password"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "25px",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={() => setIsLogin(true)}
            style={{
              width: "100%",
              padding: "13px",
              backgroundColor: "#222",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  if (selectedIssue) {
    return (
      <div
        style={{
          padding: "30px",
          maxWidth: "1000px",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <button
          onClick={() => {
            setSelectedIssueNo(null);
            setNewComment("");
          }}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          ← 이슈 목록으로
        </button>

        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#777",
                  margin: 0,
                }}
              >
                {selectedIssue.issueNo}
              </p>

              <h1>{selectedIssue.title}</h1>
            </div>

            <div>
              <select
                value={selectedIssue.status}
                onChange={(event) =>
                  updateIssueStatus(
                    selectedIssue.issueNo,
                    event.target.value
                  )
                }
                style={{
                  padding: "10px",
                }}
              >
                {STATUS_OPTIONS.map((statusItem) => (
                  <option key={statusItem}>
                    {statusItem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr />

          <table
            cellPadding="10"
            style={{
              width: "100%",
            }}
          >
            <tbody>
              <tr>
                <td>
                  <b>발생일</b>
                </td>

                <td>{selectedIssue.date}</td>

                <td>
                  <b>협력사</b>
                </td>

                <td>{selectedIssue.vendor}</td>
              </tr>

              <tr>
                <td>
                  <b>발생장비</b>
                </td>

                <td>
                  {selectedIssue.equipment.join(", ")}
                </td>

                <td>
                  <b>발생 범위</b>
                </td>

                <td>
                  {selectedIssue.occurrenceType}
                </td>
              </tr>

              {selectedIssue.occurrenceType ===
                "단발" && (
                <tr>
                  <td>
                    <b>특정 장비</b>
                  </td>

                  <td colSpan="3">
                    {selectedIssue.equipmentNumber}
                  </td>
                </tr>
              )}

              <tr>
                <td>
                  <b>확산전개</b>
                </td>

                <td colSpan="3">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedIssue.spread}
                      onChange={(event) =>
                        updateIssueSpread(
                          selectedIssue.issueNo,
                          event.target.checked
                        )
                      }
                    />

                    {selectedIssue.spread
                      ? " 확산전개 대상"
                      : " 확산전개 미대상"}
                  </label>
                </td>
              </tr>
            </tbody>
          </table>

          <hr />

          <h3>이슈 내용</h3>

          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "15px",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
            }}
          >
            {selectedIssue.content ||
              "등록된 이슈 내용이 없습니다."}
          </div>

          <h3 style={{ marginTop: "25px" }}>
            조치 진행 현황
          </h3>

          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "15px",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
            }}
          >
            {selectedIssue.action ||
              "등록된 조치 현황이 없습니다."}
          </div>

          <hr style={{ marginTop: "30px" }} />

          <h3>진행 현황 댓글</h3>

          {selectedIssue.comments.length === 0 && (
            <p style={{ color: "#777" }}>
              등록된 댓글이 없습니다.
            </p>
          )}

          {selectedIssue.comments.map(
            (comment, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "12px",
                  marginBottom: "10px",
                }}
              >
                <b>{comment.writer}</b>

                <p
                  style={{
                    marginBottom: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {comment.content}
                </p>
              </div>
            )
          )}

          <textarea
            placeholder="진행 현황 또는 검토 결과를 입력하세요"
            value={newComment}
            onChange={(event) =>
              setNewComment(event.target.value)
            }
            rows="4"
            style={{
              width: "100%",
              padding: "12px",
              boxSizing: "border-box",
              marginTop: "10px",
            }}
          />

          <button
            onClick={addComment}
            style={{
              marginTop: "10px",
              padding: "10px 18px",
              backgroundColor: "#222",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            댓글 등록
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1>협력사 PM 이슈 관리 시스템</h1>

          <p style={{ color: "#666" }}>
            이슈 등록 및 협력사 PM 진행 현황 관리
          </p>
        </div>

        <button
          onClick={() => setIsLogin(false)}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          로그아웃
        </button>
      </div>

      <hr />

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "25px",
          marginBottom: "25px",
        }}
      >
        <div style={dashboardCardStyle}>
          <span style={dashboardLabelStyle}>
            전체 이슈
          </span>

          <b style={dashboardNumberStyle}>
            {issues.length}
          </b>
        </div>

        <div style={dashboardCardStyle}>
          <span style={dashboardLabelStyle}>
            진행 중
          </span>

          <b style={dashboardNumberStyle}>
            {progressingCount}
          </b>
        </div>

        <div style={dashboardCardStyle}>
          <span style={dashboardLabelStyle}>
            완료
          </span>

          <b style={dashboardNumberStyle}>
            {completedCount}
          </b>
        </div>

        <div style={dashboardCardStyle}>
          <span style={dashboardLabelStyle}>
            확산전개
          </span>

          <b style={dashboardNumberStyle}>
            {spreadCount}
          </b>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>이슈 목록</h2>

        <button
          onClick={() =>
            setShowRegisterForm(!showRegisterForm)
          }
          style={{
            padding: "11px 20px",
            backgroundColor: "#222",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {showRegisterForm
            ? "등록 취소"
            : "+ 신규 이슈 등록"}
        </button>
      </div>

      {showRegisterForm && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "22px",
            marginBottom: "25px",
            backgroundColor: "#fafafa",
          }}
        >
          <h2>신규 이슈 등록</h2>

          <div style={formRowStyle}>
            <div style={formItemStyle}>
              <label>
                <b>Issue No *</b>
              </label>

              <input
                placeholder="예: DAS-004"
                value={newIssue.issueNo}
                onChange={(event) =>
                  handleNewIssueChange(
                    "issueNo",
                    event.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            <div style={formItemStyle}>
              <label>
                <b>발생일 *</b>
              </label>

              <input
                type="date"
                value={newIssue.date}
                onChange={(event) =>
                  handleNewIssueChange(
                    "date",
                    event.target.value
                  )
                }
                style={inputStyle}
              />
            </div>
          </div>

          <div style={formItemStyle}>
            <label>
              <b>이슈 제목 *</b>
            </label>

            <input
              placeholder="이슈 목록에 표시될 제목"
              value={newIssue.title}
              onChange={(event) =>
                handleNewIssueChange(
                  "title",
                  event.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          <div style={formItemStyle}>
            <label>
              <b>발생장비 * / 복수 선택 가능</b>
            </label>

            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                padding: "12px",
                marginTop: "8px",
                border: "1px solid #ccc",
                backgroundColor: "white",
              }}
            >
              {EQUIPMENT_OPTIONS.map(
                (equipmentName) => (
                  <label key={equipmentName}>
                    <input
                      type="checkbox"
                      checked={newIssue.equipment.includes(
                        equipmentName
                      )}
                      onChange={() =>
                        handleEquipmentChange(
                          equipmentName
                        )
                      }
                    />

                    {" " + equipmentName}
                  </label>
                )
              )}
            </div>
          </div>

          <div style={formItemStyle}>
            <label>
              <b>발생 범위 *</b>
            </label>

            <div
              style={{
                display: "flex",
                gap: "25px",
                marginTop: "10px",
              }}
            >
              <label>
                <input
                  type="radio"
                  name="occurrenceType"
                  value="단발"
                  checked={
                    newIssue.occurrenceType ===
                    "단발"
                  }
                  onChange={(event) =>
                    handleNewIssueChange(
                      "occurrenceType",
                      event.target.value
                    )
                  }
                />

                {" "}단발
              </label>

              <label>
                <input
                  type="radio"
                  name="occurrenceType"
                  value="전체"
                  checked={
                    newIssue.occurrenceType ===
                    "전체"
                  }
                  onChange={(event) =>
                    handleNewIssueChange(
                      "occurrenceType",
                      event.target.value
                    )
                  }
                />

                {" "}전체
              </label>
            </div>

            <p
              style={{
                color: "#666",
                fontSize: "13px",
              }}
            >
              단발: 특정 장비/호기에서만 발생,
              전체: 선택한 기종의 전체 장비에서 발생
            </p>
          </div>

          {newIssue.occurrenceType === "단발" && (
            <div style={formItemStyle}>
              <label>
                <b>특정 장비 번호/호기 *</b>
              </label>

              <input
                placeholder="예: DAS3-02호기 또는 Line 2 / Machine 3"
                value={newIssue.equipmentNumber}
                onChange={(event) =>
                  handleNewIssueChange(
                    "equipmentNumber",
                    event.target.value
                  )
                }
                style={inputStyle}
              />
            </div>
          )}

          <div style={formRowStyle}>
            <div style={formItemStyle}>
              <label>
                <b>협력사</b>
              </label>

              <select
                value={newIssue.vendor}
                onChange={(event) =>
                  handleNewIssueChange(
                    "vendor",
                    event.target.value
                  )
                }
                style={inputStyle}
              >
                {VENDOR_OPTIONS.map(
                  (vendorName) => (
                    <option key={vendorName}>
                      {vendorName}
                    </option>
                  )
                )}
              </select>
            </div>

            <div style={formItemStyle}>
              <label>
                <b>Status</b>
              </label>

              <select
                value={newIssue.status}
                onChange={(event) =>
                  handleNewIssueChange(
                    "status",
                    event.target.value
                  )
                }
                style={inputStyle}
              >
                {STATUS_OPTIONS.map(
                  (statusItem) => (
                    <option key={statusItem}>
                      {statusItem}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div style={formItemStyle}>
            <label>
              <b>이슈 내용</b>
            </label>

            <textarea
              placeholder="이슈 현상 및 확인 내용을 입력하세요"
              value={newIssue.content}
              onChange={(event) =>
                handleNewIssueChange(
                  "content",
                  event.target.value
                )
              }
              rows="4"
              style={textareaStyle}
            />
          </div>

          <div style={formItemStyle}>
            <label>
              <b>조치 진행 현황</b>
            </label>

            <textarea
              placeholder="현재까지 확인된 조치 진행 현황을 입력하세요"
              value={newIssue.action}
              onChange={(event) =>
                handleNewIssueChange(
                  "action",
                  event.target.value
                )
              }
              rows="4"
              style={textareaStyle}
            />
          </div>

          <label>
            <input
              type="checkbox"
              checked={newIssue.spread}
              onChange={(event) =>
                handleNewIssueChange(
                  "spread",
                  event.target.checked
                )
              }
            />

            {" "}확산전개 대상
          </label>

          <div
            style={{
              marginTop: "25px",
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              onClick={addIssue}
              style={{
                padding: "12px 22px",
                backgroundColor: "#222",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              이슈 등록
            </button>

            <button
              onClick={() =>
                setShowRegisterForm(false)
              }
              style={{
                padding: "12px 22px",
                cursor: "pointer",
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          border="1"
          cellPadding="11"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              backgroundColor: "#f1f1f1",
            }}
          >
            <tr>
              <th>Issue No</th>
              <th>제목</th>
              <th>발생일</th>
              <th>발생장비</th>
              <th>범위</th>
              <th>협력사</th>
              <th>Status</th>
              <th>확산전개</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue) => (
              <tr
                key={issue.issueNo}
                style={{
                  backgroundColor:
                    issue.status === "완료"
                      ? "#e9f8ee"
                      : "white",
                }}
              >
                <td>{issue.issueNo}</td>

                <td>
                  <button
                    onClick={() =>
                      setSelectedIssueNo(
                        issue.issueNo
                      )
                    }
                    style={{
                      border: "none",
                      background: "none",
                      color: "#0066cc",
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {issue.title}
                  </button>
                </td>

                <td>{issue.date}</td>

                <td>
                  {issue.equipment.join(", ")}
                </td>

                <td>
                  {issue.occurrenceType}

                  {issue.occurrenceType ===
                    "단발" &&
                    issue.equipmentNumber && (
                      <div
                        style={{
                          color: "#666",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {issue.equipmentNumber}
                      </div>
                    )}
                </td>

                <td>{issue.vendor}</td>

                <td>
                  <select
                    value={issue.status}
                    onChange={(event) =>
                      updateIssueStatus(
                        issue.issueNo,
                        event.target.value
                      )
                    }
                  >
                    {STATUS_OPTIONS.map(
                      (statusItem) => (
                        <option key={statusItem}>
                          {statusItem}
                        </option>
                      )
                    )}
                  </select>
                </td>

                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={issue.spread}
                    onChange={(event) =>
                      updateIssueSpread(
                        issue.issueNo,
                        event.target.checked
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const dashboardCardStyle = {
  flex: 1,
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "18px",
  backgroundColor: "#fafafa",
};

const dashboardLabelStyle = {
  display: "block",
  color: "#666",
  marginBottom: "8px",
};

const dashboardNumberStyle = {
  display: "block",
  fontSize: "28px",
};

const formRowStyle = {
  display: "flex",
  gap: "20px",
};

const formItemStyle = {
  flex: 1,
  marginBottom: "18px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  boxSizing: "border-box",
};

const textareaStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  boxSizing: "border-box",
};

export default App;