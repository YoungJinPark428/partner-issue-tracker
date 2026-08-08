

import { useState } from "react";

import DashboardCards from "../components/DashboardCards";
import IssueRegister from "../components/IssueRegister";
import IssueTable from "../components/IssueTable";

import { styles } from "../styles";

import {
  createIssue,
  updateIssue,
} from "../services/issueService";

export default function IssueListPage({
  issues,
  setIssues,
  currentProfile,
  onSelect,
  onOpenAdmin,
  onLogout,
}) {
  const [showForm, setShowForm] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("전체");

  const [vendorFilter, setVendorFilter] =
    useState("전체");

  const [equipmentFilter, setEquipmentFilter] =
    useState("전체");

  const add = async (issue) => {
    try {
      setIsSaving(true);

      await createIssue(issue);

      setShowForm(false);

      alert("이슈가 Firestore에 저장되었습니다.");
    } catch (error) {
      console.error(
        "이슈 등록 오류:",
        error
      );

      alert(
        "이슈 저장에 실패했습니다."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatus = async (
    issueNo,
    changedStatus
  ) => {
    const targetIssue = issues.find(
      (issue) =>
        issue.issueNo === issueNo
    );

    if (!targetIssue?.id) {
      return;
    }

    try {
      await updateIssue(
        targetIssue.id,
        {
          status: changedStatus,
        }
      );

      setIssues((previousIssues) =>
        previousIssues.map((issue) =>
          issue.id === targetIssue.id
            ? {
                ...issue,
                status: changedStatus,
              }
            : issue
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const updateSpread = async (
    issueNo,
    changedSpread
  ) => {
    const targetIssue = issues.find(
      (issue) =>
        issue.issueNo === issueNo
    );

    if (!targetIssue?.id) {
      return;
    }

    try {
      await updateIssue(
        targetIssue.id,
        {
          spread: changedSpread,
        }
      );

      setIssues((previousIssues) =>
        previousIssues.map((issue) =>
          issue.id === targetIssue.id
            ? {
                ...issue,
                spread: changedSpread,
              }
            : issue
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredIssues = issues.filter(
    (issue) => {
      const titleMatch =
        issue.title
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          ) || false;

      const statusMatch =
        statusFilter === "전체" ||
        issue.status === statusFilter;

      const vendorMatch =
        vendorFilter === "전체" ||
        issue.vendor === vendorFilter;

      const equipmentMatch =
        equipmentFilter === "전체" ||
        (issue.equipment || []).includes(
          equipmentFilter
        );

      return (
        titleMatch &&
        statusMatch &&
        vendorMatch &&
        equipmentMatch
      );
    }
  );

  return (
    <div style={styles.page}>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div>
          <h1>
            협력사 PM 이슈 관리 시스템
          </h1>

          <p>
            💡문의사항 및 기능개선 접수
          <br/>
            🤓박영진 책임연구원 (PRI조립/접합기술Task)
          <br/>
            ✉️youngjin428.park@lge.com / 📲010-9660-8024
          </p>






        </div>

        <div
  style={{
    display: "flex",
    gap: "10px",
    alignItems: "center",
  }}
>
  <div
    style={{
      textAlign: "right",
      marginRight: "5px",
    }}
  >
    <b>
      {currentProfile?.name}
    </b>

    <div
      style={{
        color: "#666",
        fontSize: "12px",
      }}
    >
      {currentProfile?.company}
      {" / "}
      {currentProfile?.role}
    </div>
  </div>

  {currentProfile?.role ===
    "admin" && (
    <button
      style={{
        ...styles.primary,
        backgroundColor:
          "#2563eb",
      }}
      onClick={onOpenAdmin}
    >
      회원 승인 관리
    </button>
  )}

  <button
    style={styles.secondary}
    onClick={onLogout}
  >
    로그아웃
  </button>
</div>
      </div>

      <DashboardCards issues={issues} />

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <input
          placeholder="제목 검색"
          value={searchText}
          onChange={(e) =>
            setSearchText(
              e.target.value
            )
          }
          style={{
            padding: "10px",
            minWidth: "220px",
          }}
        />

        <select
          value={vendorFilter}
          onChange={(e) =>
            setVendorFilter(
              e.target.value
            )
          }
        >
          <option>전체</option>
          <option>HPK</option>
          <option>PROTNC</option>
          <option>이안시스템</option>
          <option>SRD</option>
          <option>Keyence</option>
          <option>OPT</option>
          <option>기타</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option>전체</option>
          <option>Open</option>
          <option>Drop</option>
          <option>방안 도출 중</option>
          <option>설계진행중</option>
          <option>제작중</option>
          <option>모니터링 중</option>
          <option>확산전개중</option>
          <option>완료</option>
        </select>

        <select
          value={equipmentFilter}
          onChange={(e) =>
            setEquipmentFilter(
              e.target.value
            )
          }
        >
          <option>전체</option>
          <option>DAS3</option>
          <option>DAS4</option>
          <option>DAS5</option>
          <option>DAS7</option>
          <option>A-HDP</option>
          <option>B-HDP</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "15px",
        }}
      >
        <h2>
          이슈 목록 ({filteredIssues.length})
        </h2>

        <button
          style={styles.primary}
          disabled={isSaving}
          onClick={() =>
            setShowForm(
              (previousValue) =>
                !previousValue
            )
          }
        >
          {showForm
            ? "등록 취소"
            : "+ 신규 이슈 등록"}
        </button>
      </div>

      {isSaving && (
        <div
          style={{
            padding: "12px",
            marginBottom: "15px",
            backgroundColor: "#fff8d8",
            border: "1px solid #ead477",
            borderRadius: "6px",
          }}
        >
          Firestore에 저장 중...
        </div>
      )}

      {showForm && (
        <IssueRegister
          issues={issues}
          onAdd={add}
          onCancel={() =>
            setShowForm(false)
          }
        />
      )}

      <IssueTable
        issues={filteredIssues}
        currentProfile={currentProfile}
        onSelect={onSelect}
        onStatusChange={updateStatus}
        onSpreadChange={updateSpread}
      />
    </div>
  );
}