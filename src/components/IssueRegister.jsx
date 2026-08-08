import { useState } from "react";
import {
  EQUIPMENT_OPTIONS,
  STATUS_OPTIONS,
  VENDOR_OPTIONS,
} from "../constants";
import { styles } from "../styles";

const EMPTY_FORM = {
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
};

export default function IssueRegister({
  issues,
  onAdd,
  onCancel,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const change = (field, value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field] : value,
    }));
  };

  const toggleEquipment = (equipmentName) => {
    const alreadySelected =
      form.equipment.includes(equipmentName);

    if (alreadySelected) {
      change(
        "equipment",
        form.equipment.filter(
          (item) => item !== equipmentName
        )
      );
    } else {
      change("equipment", [
        ...form.equipment,
        equipmentName,
      ]);
    }
  };

  const submit = () => {
    if (!form.issueNo.trim()) {
      alert("Issue No를 입력해 주세요.");
      return;
    }

    if (!form.title.trim()) {
      alert("이슈 제목을 입력해 주세요.");
      return;
    }

    if (!form.date) {
      alert("발생일을 선택해 주세요.");
      return;
    }

    if (form.equipment.length === 0) {
      alert(
        "발생장비를 한 개 이상 선택해 주세요."
      );
      return;
    }

    if (
      form.occurrenceType === "단발" &&
      !form.equipmentNumber.trim()
    ) {
      alert(
        "특정 장비 번호 또는 호기를 입력해 주세요."
      );
      return;
    }

    const duplicateIssue = issues.some(
      (issue) =>
        issue.issueNo.toLowerCase() ===
        form.issueNo.trim().toLowerCase()
    );

    if (duplicateIssue) {
      alert("이미 등록된 Issue No입니다.");
      return;
    }

    const issueToAdd = {
      ...form,
      issueNo: form.issueNo.trim(),
      title: form.title.trim(),
      equipmentNumber:
        form.occurrenceType === "전체"
          ? ""
          : form.equipmentNumber.trim(),
      comments: [],
    };

    onAdd(issueToAdd);
  };

  return (
    <div
      style={{
        ...styles.card,
        backgroundColor: "#fafafa",
        marginBottom: "25px",
      }}
    >
      <h2>신규 이슈 등록</h2>

      <div style={styles.row}>
        <Field label="Issue No *">
          <input
            style={styles.input}
            value={form.issueNo}
            onChange={(event) =>
              change(
                "issueNo",
                event.target.value
              )
            }
            placeholder="예: DAS-004"
          />
        </Field>

        <Field label="발생일 *">
          <input
            style={styles.input}
            type="date"
            value={form.date}
            onChange={(event) =>
              change(
                "date",
                event.target.value
              )
            }
          />
        </Field>
      </div>

      <Field label="이슈 제목 *">
        <input
          style={styles.input}
          value={form.title}
          onChange={(event) =>
            change(
              "title",
              event.target.value
            )
          }
          placeholder="이슈 목록에 표시될 제목"
        />
      </Field>

      <Field label="발생장비 * / 복수 선택 가능">
        <div
          style={{
            ...styles.row,
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
                  checked={form.equipment.includes(
                    equipmentName
                  )}
                  onChange={() =>
                    toggleEquipment(
                      equipmentName
                    )
                  }
                />

                {" " + equipmentName}
              </label>
            )
          )}
        </div>
      </Field>

      <Field label="발생 범위 *">
        <div
          style={{
            ...styles.row,
            marginTop: "10px",
          }}
        >
          <label>
            <input
              type="radio"
              name="occurrenceType"
              value="단발"
              checked={
                form.occurrenceType === "단발"
              }
              onChange={(event) =>
                change(
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
                form.occurrenceType === "전체"
              }
              onChange={(event) =>
                change(
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
          단발: 특정 장비에서만 발생 / 전체:
          선택한 기종의 전체 장비에서 발생
        </p>
      </Field>

      {form.occurrenceType === "단발" && (
        <Field label="특정 장비 번호/호기 *">
          <input
            style={styles.input}
            value={form.equipmentNumber}
            onChange={(event) =>
              change(
                "equipmentNumber",
                event.target.value
              )
            }
            placeholder="예: DAS3-02호기"
          />
        </Field>
      )}

      <div style={styles.row}>
        <Field label="협력사">
          <select
            style={styles.input}
            value={form.vendor}
            onChange={(event) =>
              change(
                "vendor",
                event.target.value
              )
            }
          >
            {VENDOR_OPTIONS.map(
              (vendorName) => (
                <option
                  key={vendorName}
                  value={vendorName}
                >
                  {vendorName}
                </option>
              )
            )}
          </select>
        </Field>

        <Field label="Status">
          <select
            style={styles.input}
            value={form.status}
            onChange={(event) =>
              change(
                "status",
                event.target.value
              )
            }
          >
            {STATUS_OPTIONS.map(
              (statusName) => (
                <option
                  key={statusName}
                  value={statusName}
                >
                  {statusName}
                </option>
              )
            )}
          </select>
        </Field>
      </div>

      <Field label="이슈 내용">
        <textarea
          rows="4"
          style={styles.textarea}
          value={form.content}
          onChange={(event) =>
            change(
              "content",
              event.target.value
            )
          }
          placeholder="이슈 현상 및 확인 내용을 입력하세요"
        />
      </Field>

      <Field label="조치 진행 현황">
        <textarea
          rows="4"
          style={styles.textarea}
          value={form.action}
          onChange={(event) =>
            change(
              "action",
              event.target.value
            )
          }
          placeholder="현재까지 확인된 조치 진행 현황을 입력하세요"
        />
      </Field>

      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "5px",
        }}
      >
        <input
          type="checkbox"
          checked={form.spread}
          onChange={(event) =>
            change(
              "spread",
              event.target.checked
            )
          }
        />

        확산전개 대상
      </label>

      <div
        style={{
          ...styles.row,
          marginTop: "25px",
        }}
      >
        <button
          style={styles.primary}
          onClick={submit}
        >
          이슈 등록
        </button>

        <button
          style={styles.secondary}
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={styles.item}>
      <label>
        <b>{label}</b>
      </label>

      {children}
    </div>
  );
}
``