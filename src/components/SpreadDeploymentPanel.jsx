import { useEffect, useState } from "react";

const SPREAD_STATUS_OPTIONS = [
  "비대상",
  "대상",
  "완료",
];

const SPREAD_GROUPS = [
  {
    key: "engC",
    title: "ENG. C-side",
    items: [
      "DAS3",
      "DAS4",
      "DAS5",
      "DAS7",
      "A-HDP",
      "B-HDP",
    ],
  },
  {
    key: "engD",
    title: "ENG. D-side",
    items: [
      "DAS3",
      "DAS4",
      "DAS5",
      "DAS7",
      "A-HDP",
      "B-HDP",
    ],
  },
  {
    key: "mp",
    title: "MP",
    items: [
      "DAS3-1",
      "DAS3-2",
      "DAS4-1",
      "DAS4-2",
      "DAS4-3",
      "DAS7-1",
      "DAS7-2",
      "DAS5-1",
      "DAS5-2",
      "DAS5-3",
      "DAS5-4",
      "A-HDP-1",
      "A-HDP-2",
      "B-HDP-1",
      "B-HDP-2",
    ],
  },
];

function createDefaultSpreadDeployment() {
  const result = {};

  SPREAD_GROUPS.forEach((group) => {
    result[group.key] = {};

    group.items.forEach((itemName) => {
      result[group.key][itemName] =
        "비대상";
    });
  });

  return result;
}

function mergeSpreadDeployment(savedData) {
  const mergedData =
    createDefaultSpreadDeployment();

  if (!savedData) {
    return mergedData;
  }

  SPREAD_GROUPS.forEach((group) => {
    group.items.forEach((itemName) => {
      const savedStatus =
        savedData?.[group.key]?.[
          itemName
        ];

      if (
        SPREAD_STATUS_OPTIONS.includes(
          savedStatus
        )
      ) {
        mergedData[group.key][
          itemName
        ] = savedStatus;
      }
    });
  });

  return mergedData;
}

export default function SpreadDeploymentPanel({
  issue,
  currentProfile,
  onUpdate,
}) {
  const [
    spreadDeployment,
    setSpreadDeployment,
  ] = useState(
    createDefaultSpreadDeployment()
  );

  const [savingItem, setSavingItem] =
    useState("");

  const isAdmin =
    currentProfile?.role === "admin";

  useEffect(() => {
    setSpreadDeployment(
      mergeSpreadDeployment(
        issue.spreadDeployment
      )
    );
  }, [
    issue.id,
    issue.spreadDeployment,
  ]);

  const changeStatus = async (
    groupKey,
    itemName,
    nextStatus
  ) => {
    if (!isAdmin) {
      alert(
        "관리자만 확산전개 상태를 변경할 수 있습니다."
      );
      return;
    }

    const savingKey = `${groupKey}-${itemName}`;

    const previousDeployment =
      structuredClone(
        spreadDeployment
      );

    const nextDeployment = 
      structuredClone(
        spreadDeployment
      );

    nextDeployment[groupKey][itemName] = 
      nextStatus;

    try {
      setSavingItem(savingKey);

      setSpreadDeployment(
        nextDeployment
      );

      await onUpdate({
        spreadDeployment:
          nextDeployment,
      });
    } catch (error) {
      console.error(
        "확산전개 상태 저장 오류:",
        error
      );

      setSpreadDeployment(
        previousDeployment
      );

      alert(
        "확산전개 상태 저장에 실패했습니다."
      );
    } finally {
      setSavingItem("");
    }
  };

  const statusCounts =
    SPREAD_GROUPS.reduce(
      (counts, group) => {
        group.items.forEach(
          (itemName) => {
            const status =
              spreadDeployment?.[
                group.key
              ]?.[itemName] ||
              "비대상";

            counts[status] =
              (counts[status] || 0) +
              1;
          }
        );

        return counts;
      },
      {
        비대상: 0,
        대상: 0,
        완료: 0,
      }
    );

  return (
    <div
      style={{
        marginTop: "30px",
        border:
          "1px solid #d1d5db",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px",
          backgroundColor:
            "#f8fafc",
          borderBottom:
            "1px solid #d1d5db",
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
            <h3
              style={{
                margin: 0,
              }}
            >
              확산전개 현황
            </h3>

            <p
              style={{
                margin:
                  "6px 0 0 0",
                color: "#666",
                fontSize: "13px",
              }}
            >
              ENG. C-side, ENG.
              D-side 및 MP 장비별
              전개 상태를 관리합니다.
            </p>
          </div>

          <div
            style={{
              padding:
                "6px 10px",
              borderRadius:
                "999px",

              backgroundColor:
                isAdmin
                  ? "#dbeafe"
                  : "#f3f4f6",

              color: isAdmin
                ? "#1d4ed8"
                : "#4b5563",

              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {isAdmin
              ? "Admin 편집 가능"
              : "조회 전용"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >
          <SummaryBadge
            label="비대상"
            value={
              statusCounts["비대상"]
            }
            backgroundColor="#f3f4f6"
            color="#4b5563"
          />

          <SummaryBadge
            label="대상"
            value={
              statusCounts["대상"]
            }
            backgroundColor="#fef3c7"
            color="#92400e"
          />

          <SummaryBadge
            label="완료"
            value={
              statusCounts["완료"]
            }
            backgroundColor="#dcfce7"
            color="#166534"
          />
        </div>
      </div>

      <div
        style={{
          padding: "18px",
        }}
      >
        {SPREAD_GROUPS.map(
          (group) => (
            <section
              key={group.key}
              style={{
                marginBottom:
                  group.key === "mp"
                    ? 0
                    : "25px",
              }}
            >
              <h4
                style={{
                  margin:
                    "0 0 10px 0",

                  paddingBottom:
                    "8px",

                  borderBottom:
                    "2px solid #e5e7eb",

                  color: "#1f2937",
                }}
              >
                {group.title}
              </h4>

              <div
                style={{
                  display: "grid",

                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(190px, 1fr))",

                  gap: "10px",
                }}
              >
                {group.items.map(
                  (itemName) => {
                    const currentStatus =
                      spreadDeployment?.[
                        group.key
                      ]?.[itemName] ||
                      "비대상";

                    const itemKey =
                      `${group.key}-${itemName}`;

                    const isSaving =
                      savingItem ===
                      itemKey;

                    return (
                      <div
                        key={itemName}
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "space-between",

                          gap: "10px",

                          padding:
                            "10px",

                          border:
                            "1px solid #e5e7eb",

                          borderRadius:
                            "7px",

                          backgroundColor:
                            getStatusBackground(
                              currentStatus
                            ),
                        }}
                      >
                        <span
                          style={{
                            fontWeight:
                              "bold",

                            fontSize:
                              "13px",

                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {itemName}
                        </span>

                        <select
                          value={
                            currentStatus
                          }
                          disabled={
                            !isAdmin ||
                            isSaving
                          }
                          onChange={(
                            event
                          ) =>
                            changeStatus(
                              group.key,
                              itemName,
                              event.target
                                .value
                            )
                          }
                          style={{
                            padding:
                              "6px",

                            border:
                              "1px solid #cbd5e1",

                            borderRadius:
                              "5px",

                            backgroundColor:
                              isAdmin
                                ? "white"
                                : "#f3f4f6",

                            cursor:
                              isAdmin
                                ? "pointer"
                                : "not-allowed",
                          }}
                        >
                          {SPREAD_STATUS_OPTIONS.map(
                            (
                              statusName
                            ) => (
                              <option
                                key={
                                  statusName
                                }
                                value={
                                  statusName
                                }
                              >
                                {
                                  statusName
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )
        )}
      </div>
    </div>
  );
}

function getStatusBackground(status) {
  if (status === "완료") {
    return "#f0fdf4";
  }

  if (status === "대상") {
    return "#fffbeb";
  }

  return "#ffffff";
}

function SummaryBadge({
  label,
  value,
  backgroundColor,
  color,
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        borderRadius: "999px",
        backgroundColor,
        color,
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {label}

      <strong>{value}</strong>
    </span>
  );
}