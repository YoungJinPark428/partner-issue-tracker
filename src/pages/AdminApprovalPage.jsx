import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { styles } from "../styles";

import {
  approveUser,
  changeUserRole,
  rejectUser,
  returnUserToPending,
  subscribeUsers,
} from "../services/userService";

export default function AdminApprovalPage({
  currentProfile,
  onBack,
  onLogout,
}) {
  const [users, setUsers] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [processingUserId, setProcessingUserId] =
    useState(null);

  const [statusFilter, setStatusFilter] =
    useState("전체");

  const [searchText, setSearchText] =
    useState("");

  useEffect(() => {
    const unsubscribe =
      subscribeUsers(
        (loadedUsers) => {
          setUsers(loadedUsers);
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);

          alert(
            "사용자 목록을 불러오지 못했습니다."
          );
        }
      );

    return () => unsubscribe();
  }, []);

  const filteredUsers =
    useMemo(() => {
      return users.filter((user) => {
        const keyword =
          searchText
            .trim()
            .toLowerCase();

        const searchMatch =
          !keyword ||
          (
            user.name || ""
          )
            .toLowerCase()
            .includes(keyword) ||
          (
            user.email || ""
          )
            .toLowerCase()
            .includes(keyword) ||
          (
            user.company || ""
          )
            .toLowerCase()
            .includes(keyword);

        const statusMatch =
          statusFilter === "전체" ||
          user.status === statusFilter;

        return (
          searchMatch &&
          statusMatch
        );
      });
    }, [
      users,
      searchText,
      statusFilter,
    ]);

  const pendingCount =
    users.filter(
      (user) =>
        user.status === "Pending"
    ).length;

  const approvedCount =
    users.filter(
      (user) =>
        user.status === "Approved"
    ).length;

  const rejectedCount =
    users.filter(
      (user) =>
        user.status === "Rejected"
    ).length;

  const handleApprove =
    async (user) => {
      const confirmed =
        window.confirm(
          `${user.name} / ${user.company} 사용자를 승인하시겠습니까?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setProcessingUserId(
          user.id
        );

        await approveUser(
          user.id
        );
      } catch (error) {
        console.error(
          "사용자 승인 오류:",
          error
        );

        alert(
          "사용자 승인에 실패했습니다."
        );
      } finally {
        setProcessingUserId(
          null
        );
      }
    };

  const handleReject =
    async (user) => {
      const confirmed =
        window.confirm(
          `${user.name} / ${user.company} 사용자의 가입을 거절하시겠습니까?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setProcessingUserId(
          user.id
        );

        await rejectUser(
          user.id
        );
      } catch (error) {
        console.error(
          "사용자 거절 오류:",
          error
        );

        alert(
          "사용자 거절에 실패했습니다."
        );
      } finally {
        setProcessingUserId(
          null
        );
      }
    };

  const handleReturnToPending =
    async (user) => {
      try {
        setProcessingUserId(
          user.id
        );

        await returnUserToPending(
          user.id
        );
      } catch (error) {
        console.error(
          "승인 대기 전환 오류:",
          error
        );

        alert(
          "승인 상태 변경에 실패했습니다."
        );
      } finally {
        setProcessingUserId(
          null
        );
      }
    };

  const handleRoleChange =
    async (user, role) => {
      if (
        user.id ===
          currentProfile.id &&
        role !== "admin"
      ) {
        alert(
          "현재 로그인한 관리자 자신의 Admin 권한은 해제할 수 없습니다."
        );

        return;
      }

      try {
        setProcessingUserId(
          user.id
        );

        await changeUserRole(
          user.id,
          role
        );
      } catch (error) {
        console.error(
          "사용자 권한 변경 오류:",
          error
        );

        alert(
          "사용자 권한 변경에 실패했습니다."
        );
      } finally {
        setProcessingUserId(
          null
        );
      }
    };

  const getStatusStyle = (
    status
  ) => {
    if (
      status === "Approved"
    ) {
      return {
        backgroundColor:
          "#dcfce7",
        color: "#166534",
      };
    }

    if (
      status === "Rejected"
    ) {
      return {
        backgroundColor:
          "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      backgroundColor:
        "#fef3c7",
      color: "#92400e",
    };
  };

  return (
    <div
      style={{
        ...styles.page,
        maxWidth: "1200px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>
            회원가입 승인 관리
          </h1>

          <p
            style={{
              color: "#666",
            }}
          >
            신규 사용자의 가입
            승인과 역할을 관리합니다.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            style={
              styles.secondary
            }
            onClick={onBack}
          >
            ← 이슈 목록
          </button>

          <button
            style={
              styles.secondary
            }
            onClick={onLogout}
          >
            로그아웃
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          margin: "25px 0",
        }}
      >
        <SummaryCard
          label="승인 대기"
          value={pendingCount}
          color="#d97706"
        />

        <SummaryCard
          label="승인 완료"
          value={approvedCount}
          color="#16a34a"
        />

        <SummaryCard
          label="가입 거절"
          value={rejectedCount}
          color="#dc2626"
        />

        <SummaryCard
          label="전체 사용자"
          value={users.length}
          color="#334155"
        />
      </div>

      <div
        style={{
          ...styles.card,
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <input
            style={{
              ...styles.input,
              width: "300px",
              marginTop: 0,
            }}
            placeholder="이름, 이메일, 회사 검색"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
          />

          <select
            style={{
              ...styles.input,
              width: "170px",
              marginTop: 0,
            }}
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="전체">
              전체
            </option>

            <option value="Pending">
              승인 대기
            </option>

            <option value="Approved">
              승인 완료
            </option>

            <option value="Rejected">
              가입 거절
            </option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div
          style={styles.card}
        >
          사용자 목록을 불러오고
          있습니다.
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
              backgroundColor:
                "white",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor:
                    "#f3f4f6",
                }}
              >
                <TableHeader>
                  이름
                </TableHeader>

                <TableHeader>
                  회사
                </TableHeader>

                <TableHeader>
                  이메일
                </TableHeader>

                <TableHeader>
                  상태
                </TableHeader>

                <TableHeader>
                  권한
                </TableHeader>

                <TableHeader>
                  처리
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(
                (user) => {
                  const isProcessing =
                    processingUserId ===
                    user.id;

                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom:
                          "1px solid #e5e7eb",
                      }}
                    >
                      <TableCell>
                        <b>
                          {user.name}
                        </b>

                        {user.id ===
                          currentProfile.id && (
                          <span
                            style={{
                              display:
                                "block",
                              color:
                                "#2563eb",
                              fontSize:
                                "12px",
                              marginTop:
                                "3px",
                            }}
                          >
                            현재 로그인
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {user.company}
                      </TableCell>

                      <TableCell>
                        {user.email}
                      </TableCell>

                      <TableCell>
                        <span
                          style={{
                            display:
                              "inline-block",
                            padding:
                              "5px 9px",
                            borderRadius:
                              "999px",
                            fontSize:
                              "12px",
                            fontWeight:
                              "bold",
                            ...getStatusStyle(
                              user.status
                            ),
                          }}
                        >
                          {user.status ===
                          "Approved"
                            ? "승인 완료"
                            : user.status ===
                              "Rejected"
                            ? "가입 거절"
                            : "승인 대기"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <select
                          value={
                            user.role ||
                            "partner"
                          }
                          disabled={
                            isProcessing
                          }
                          onChange={(
                            event
                          ) =>
                            handleRoleChange(
                              user,
                              event.target
                                .value
                            )
                          }
                          style={{
                            padding:
                              "7px",
                          }}
                        >
                          <option value="partner">
                            Partner PM
                          </option>

                          <option value="pri">
                            PRI Member
                          </option>

                          <option value="viewer">
                            Viewer
                          </option>

                          <option value="admin">
                            Admin
                          </option>
                        </select>
                      </TableCell>

                      <TableCell>
                        <div
                          style={{
                            display:
                              "flex",
                            gap: "6px",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          {user.status ===
                            "Pending" && (
                            <>
                              <button
                                disabled={
                                  isProcessing
                                }
                                onClick={() =>
                                  handleApprove(
                                    user
                                  )
                                }
                                style={{
                                  padding:
                                    "7px 11px",
                                  border:
                                    "none",
                                  borderRadius:
                                    "5px",
                                  backgroundColor:
                                    "#16a34a",
                                  color:
                                    "white",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                승인
                              </button>

                              <button
                                disabled={
                                  isProcessing
                                }
                                onClick={() =>
                                  handleReject(
                                    user
                                  )
                                }
                                style={{
                                  padding:
                                    "7px 11px",
                                  border:
                                    "none",
                                  borderRadius:
                                    "5px",
                                  backgroundColor:
                                    "#dc2626",
                                  color:
                                    "white",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                거절
                              </button>
                            </>
                          )}

                          {user.status !==
                            "Pending" &&
                            user.id !==
                              currentProfile.id && (
                              <button
                                disabled={
                                  isProcessing
                                }
                                onClick={() =>
                                  handleReturnToPending(
                                    user
                                  )
                                }
                                style={{
                                  padding:
                                    "7px 11px",
                                  border:
                                    "1px solid #ccc",
                                  borderRadius:
                                    "5px",
                                  backgroundColor:
                                    "white",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                승인 대기로
                                변경
                              </button>
                            )}
                        </div>
                      </TableCell>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>

          {filteredUsers.length ===
            0 && (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                backgroundColor:
                  "white",
                color: "#777",
              }}
            >
              조건에 맞는 사용자가
              없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}) {
  return (
    <div
      style={{
        width: "145px",
        padding: "15px",
        border:
          "1px solid #e5e7eb",
        borderTop:
          `4px solid ${color}`,
        borderRadius: "8px",
        backgroundColor: "white",
      }}
    >
      <span
        style={{
          display: "block",
          color: "#666",
          fontSize: "13px",
          marginBottom: "6px",
        }}
      >
        {label}
      </span>

      <b
        style={{
          color,
          fontSize: "26px",
        }}
      >
        {value}
      </b>
    </div>
  );
}

function TableHeader({
  children,
}) {
  return (
    <th
      style={{
        padding: "12px",
        textAlign: "left",
        borderBottom:
          "1px solid #d1d5db",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function TableCell({
  children,
}) {
  return (
    <td
      style={{
        padding: "12px",
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}