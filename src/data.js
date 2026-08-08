export const INITIAL_ISSUES = [
  {
    issueNo: "DAS-001", title: "Nozzle Clogging", date: "2026-08-04",
    equipment: ["DAS3"], occurrenceType: "단발", equipmentNumber: "DAS3-02호기",
    vendor: "HPK", status: "Open", content: "DAS Nozzle 막힘이 반복적으로 발생함",
    action: "Filter 교체 및 Cleaning 조건 검토 중", spread: false,
    comments: [
      { writer: "HPK PM", content: "Filter 교체 후 시험을 진행하고 있습니다." },
      { writer: "박영진", content: "시험 결과와 재발 여부를 공유해 주세요." },
    ],
  },
  {
    issueNo: "DAS-002", title: "Vision Bracket Interference", date: "2026-08-04",
    equipment: ["DAS4", "DAS5"], occurrenceType: "전체", equipmentNumber: "",
    vendor: "PROTNC", status: "설계진행중", content: "Vision 조명 변경 후 Bracket 간섭 발생",
    action: "간섭 회피 설계안 검토 중", spread: true,
    comments: [{ writer: "PROTNC PM", content: "설계 변경안 2종을 비교 검토 중입니다." }],
  },
];
