import { useEffect, useState } from "react";

import {
  EQUIPMENT_OPTIONS,
  STATUS_OPTIONS,
  VENDOR_OPTIONS,
} from "../constants";

import { styles } from "../styles";
import SpreadDeploymentPanel from "../components/SpreadDeploymentPanel";

import SperadDeploymentPanel from "../components/SpreadDeploymentPanel";

function convertFileToPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: reader.result,
      });
    };

    reader.onerror = () => {
      reject(
        new Error("사진을 읽을 수 없습니다.")
      );
    };

    reader.readAsDataURL(file);
  });
}

export default function IssueDetailPage({
  issue,
  currentProfile,
  onBack,
  onUpdate,
  onDelete,
}) {
  const [comment, setComment] =
    useState("");

  const [
    commentPhotos,
    setCommentPhotos,
  ] = useState([]);

  const [
    isUploading,
    setIsUploading,
  ] = useState(false);

  const [
    selectedPhoto,
    setSelectedPhoto,
  ] = useState(null);

  const [isEditing, setIsEditing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [editForm, setEditForm] =
    useState({
      title: "",
      date: "",
      equipment: [],
      occurrenceType: "단발",
      equipmentNumber: "",
      vendor: "HPK",
      status: "Open",
      content: "",
      rootCause: "",
      action: "",
      spread: false,
    });

  useEffect(() => {
    setEditForm({
      title: issue.title || "",
      date: issue.date || "",
      equipment: issue.equipment || [],
      occurrenceType:
        issue.occurrenceType || "단발",
      equipmentNumber:
        issue.equipmentNumber || "",
      vendor: issue.vendor || "HPK",
      status: issue.status || "Open",
      content: issue.content || "",
      rootCause: issue.rootCause || "",
      action: issue.action || "",
      spread: Boolean(issue.spread),
    });
  }, [issue]);

  const changeEditForm = (
    field,
    value
  ) => {
    setEditForm((previousForm) => ({
      ...previousForm,
      [field] : value,
    }));
  };

  const toggleEditEquipment = (
    equipmentName
  ) => {
    const alreadySelected =
      editForm.equipment.includes(
        equipmentName
      );

    if (alreadySelected) {
      changeEditForm(
        "equipment",
        editForm.equipment.filter(
          (item) =>
            item !== equipmentName
        )
      );
    } else {
      changeEditForm("equipment", [
        ...editForm.equipment,
        equipmentName,
      ]);
    }
  };

  const startEditing = () => {
    setEditForm({
      title: issue.title || "",
      date: issue.date || "",
      equipment: issue.equipment || [],
      occurrenceType:
        issue.occurrenceType || "단발",
      equipmentNumber:
        issue.equipmentNumber || "",
      vendor: issue.vendor || "HPK",
      status: issue.status || "Open",
      content: issue.content || "",
      rootCause: issue.rootCause || "",
      action: issue.action || "",
      spread: Boolean(issue.spread),
    });

    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditForm({
      title: issue.title || "",
      date: issue.date || "",
      equipment: issue.equipment || [],
      occurrenceType:
        issue.occurrenceType || "단발",
      equipmentNumber:
        issue.equipmentNumber || "",
      vendor: issue.vendor || "HPK",
      status: issue.status || "Open",
      content: issue.content || "",
      rootCause : issue.rootCause || "",
      action: issue.action || "",
      spread: Boolean(issue.spread),
    });

    setIsEditing(false);
  };

  const saveIssueChanges = async () => {
    if (!editForm.title.trim()) {
      alert(
        "이슈 제목을 입력해 주세요."
      );
      return;
    }

    if (!editForm.date) {
      alert("발생일을 선택해 주세요.");
      return;
    }

    if (
      editForm.equipment.length === 0
    ) {
      alert(
        "발생장비를 한 개 이상 선택해 주세요."
      );
      return;
    }

    if (
      editForm.occurrenceType ===
        "단발" &&
      !editForm.equipmentNumber.trim()
    ) {
      alert(
        "특정 장비 번호 또는 호기를 입력해 주세요."
      );
      return;
    }

    const changedValues = {
      title: editForm.title.trim(),
      date: editForm.date,
      equipment: editForm.equipment,
      occurrenceType:
        editForm.occurrenceType,

      equipmentNumber:
        editForm.occurrenceType ===
        "전체"
          ? ""
          : editForm.equipmentNumber.trim(),

      vendor: editForm.vendor,
      status: editForm.status,
      content: editForm.content,
      rootCause: editForm.rootCause,
      action: editForm.action,
      spread: editForm.spread,
    };

    try {
      setIsSaving(true);

      await onUpdate(changedValues);

      setIsEditing(false);

      alert(
        "이슈 수정 내용이 저장되었습니다."
      );
    } catch (error) {
      console.error(
        "이슈 수정 오류:",
        error
      );

      alert(
        "이슈 수정 저장에 실패했습니다."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommentPhotoSelection =
    async (event) => {
      const selectedFiles = Array.from(
        event.target.files || []
      );

      if (
        selectedFiles.length === 0
      ) {
        return;
      }

      const imageFiles =
        selectedFiles.filter((file) =>
          file.type.startsWith("image/")
        );

      if (
        imageFiles.length !==
        selectedFiles.length
      ) {
        alert(
          "이미지 파일만 첨부할 수 있습니다."
        );
      }

      const oversizedFiles =
        imageFiles.filter(
          (file) =>
            file.size >
            5 * 1024 * 1024
        );

      if (
        oversizedFiles.length > 0
      ) {
        alert(
          "사진 한 장의 크기는 5MB 이하여야 합니다."
        );

        event.target.value = "";
        return;
      }

      if (
        commentPhotos.length +
          imageFiles.length >
        10
      ) {
        alert(
          "댓글 사진은 최대 10장입니다."
        );

        event.target.value = "";
        return;
      }

      try {
        setIsUploading(true);

        const convertedPhotos =
          await Promise.all(
            imageFiles.map(
              convertFileToPhoto
            )
          );

        setCommentPhotos(
          (previousPhotos) => [
            ...previousPhotos,
            ...convertedPhotos,
          ]
        );
      } catch (error) {
        alert(error.message);
      } finally {
        setIsUploading(false);
        event.target.value = "";
      }
    };

  const removeCommentPhoto = (
    photoId
  ) => {
    setCommentPhotos(
      (previousPhotos) =>
        previousPhotos.filter(
          (photo) =>
            photo.id !== photoId
        )
    );
  };

  const addComment = async () => {
    if (
      !comment.trim() &&
      commentPhotos.length === 0
    ) {
      alert(
        "댓글 내용 또는 사진을 입력해 주세요."
      );
      return;
    }

    const nextComment = {
      id: `${Date.now()}-${Math.random()}`,
      writer: 
        `${currentProfile?.name || "사용자"} / ${
        currentProfile?.email || ""
        }`,
      content: comment.trim(),
      photos: commentPhotos,
      createdAt:
        new Date().toLocaleString(
          "ko-KR"
        ),
    };

    try {
      await onUpdate({
        comments: [
          ...(issue.comments || []),
          nextComment,
        ],
      });

      setComment("");
      setCommentPhotos([]);
    } catch (error) {
      console.error(
        "댓글 저장 오류:",
        error
      );

      alert(
        "댓글 저장에 실패했습니다."
      );
    }
  };

  return (
    <div
      style={{
        ...styles.page,
        maxWidth: "1000px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          style={styles.secondary}
          onClick={onBack}
          disabled={isSaving}
        >
          ← 이슈 목록으로
        </button>

        {!isEditing && 
          currentProfile?.role===
          "admin" && (
          <button
            onClick={startEditing}
            style={{
              backgroundColor:
                "#1677ff",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ✏️ 수정
          </button>
        )}

        {isEditing && (
          <>
            <button
              onClick={
                saveIssueChanges
              }
              disabled={isSaving}
              style={{
                backgroundColor:
                  "#16a34a",
                color: "white",
                border: "none",
                padding:
                  "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {isSaving
                ? "저장 중..."
                : "💾 수정 저장"}
            </button>

            <button
              onClick={cancelEditing}
              disabled={isSaving}
              style={{
                backgroundColor:
                  "#e5e7eb",
                color: "#222",
                border: "none",
                padding:
                  "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              수정 취소
            </button>
          </>
        )}

        {!isEditing && 
          currentProfile?.role ===
          "admin" && (
          <button
            onClick={onDelete}
            style={{
              backgroundColor:
                "#ff4d4f",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            🗑 삭제
          </button>
        )}
      </div>

      <div
        style={{
          ...styles.card,
          marginTop: "20px",
        }}
      >
        {isEditing ? (
          <EditIssueForm
            form={editForm}
            change={changeEditForm}
            toggleEquipment={
              toggleEditEquipment
            }
          />
        ) : (
          <IssueView
            issue={issue}
            onUpdate={onUpdate}
            currentProfile={currentProfile}
          />
        )}

        <SpreadDeploymentPanel
          issue={issue}
          currentProfile={currentProfile}
          onUpdate={onUpdate}
          />

        <hr
          style={{
            marginTop: "30px",
          }}
        />

        <h3>진행 현황 댓글</h3>

        {(issue.comments || [])
          .length === 0 && (
          <p style={{ color: "#777" }}>
            등록된 댓글이 없습니다.
          </p>
        )}

        {(issue.comments || []).map(
          (
            savedComment,
            commentIndex
          ) => (
            <div
              key={
                savedComment.id ||
                commentIndex
              }
              style={{
                border:
                  "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "15px",
                }}
              >
                <b>
                  {savedComment.writer}
                </b>

                {savedComment.createdAt && (
                  <span
                    style={{
                      color: "#888",
                      fontSize: "12px",
                    }}
                  >
                    {
                      savedComment.createdAt
                    }
                  </span>
                )}
              </div>

              {savedComment.content && (
                <p
                  style={{
                    whiteSpace:
                      "pre-wrap",

                    marginBottom:
                      (
                        savedComment.photos ||
                        []
                      ).length > 0
                        ? "12px"
                        : 0,
                  }}
                >
                  {
                    savedComment.content
                  }
                </p>
              )}

              {(
                savedComment.photos || []
              ).length > 0 && (
                <PhotoGallery
                  photos={
                    savedComment.photos
                  }
                  onPhotoClick={
                    setSelectedPhoto
                  }
                />
              )}
            </div>
          )
        )}

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border:
              "1px dashed #aaa",
            borderRadius: "8px",
            backgroundColor:
              "#fafafa",
          }}
        >
          <textarea
            rows="4"
            style={styles.textarea}
            value={comment}
            onChange={(event) =>
              setComment(
                event.target.value
              )
            }
            placeholder="진행 현황 또는 검토 결과를 입력하세요"
          />

          <div
            style={{
              marginTop: "12px",
            }}
          >
          </div>

          {isUploading && (
            <p>
              사진을 불러오는 중입니다.
            </p>
          )}

          {commentPhotos.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              {commentPhotos.map(
                (photo) => (
                  <PhotoPreview
                    key={photo.id}
                    photo={photo}
                    onRemove={() =>
                      removeCommentPhoto(
                        photo.id
                      )
                    }
                  />
                )
              )}
            </div>
          )}

          <button
            style={{
              ...styles.primary,
              marginTop: "15px",
            }}
            onClick={addComment}
            disabled={isUploading}
          >
            댓글 등록
          </button>
        </div>
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() =>
            setSelectedPhoto(null)
          }
        />
      )}
    </div>
  );
}

function EditIssueForm({
  form,
  change,
  toggleEquipment,
}) {
  return (
    <div>
      <p
        style={{
          color: "#777",
          marginBottom: "5px",
        }}
      >
        Issue No는 변경할 수
        없습니다.
      </p>

      <h1>{form.title}</h1>

      <hr />

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
        />
      </Field>

      <div style={styles.row}>
        <Field label="발생일 *">
          <input
            type="date"
            style={styles.input}
            value={form.date}
            onChange={(event) =>
              change(
                "date",
                event.target.value
              )
            }
          />
        </Field>

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
      </div>

      <Field label="발생장비 * / 복수 선택 가능">
        <div
          style={{
            ...styles.row,
            padding: "12px",
            marginTop: "8px",
            border:
              "1px solid #ccc",
            backgroundColor: "white",
          }}
        >
          {EQUIPMENT_OPTIONS.map(
            (equipmentName) => (
              <label
                key={equipmentName}
              >
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
              name="editOccurrenceType"
              value="단발"
              checked={
                form.occurrenceType ===
                "단발"
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
              name="editOccurrenceType"
              value="전체"
              checked={
                form.occurrenceType ===
                "전체"
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
      </Field>

      {form.occurrenceType ===
        "단발" && (
        <Field label="특정 장비 번호/호기 *">
          <input
            style={styles.input}
            value={
              form.equipmentNumber
            }
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

      <Field label="이슈 내용">
        <textarea
          rows="5"
          style={styles.textarea}
          value={form.content}
          onChange={(event) =>
            change(
              "content",
              event.target.value
            )
          }
        />
      </Field>

      <Field label="Root Cause Analysis">
        <textarea
          rows="5"
          style={styles.textarea}
          value={form.rootCause}
          onChange={(event) =>
            change(
              "rootCause",
              event.target.value
            )
          }
        />
      </Field>

      <Field label="조치 진행 현황">
        <textarea
          rows="5"
          style={styles.textarea}
          value={form.action}
          onChange={(event) =>
            change(
              "action",
              event.target.value
            )
          }
        />
      </Field>


    </div>
  );
}

function IssueView({
  issue,
  onUpdate,
  currentProfile,
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              color: "#777",
              marginBottom: "4px",
            }}
          >
            {issue.issueNo}
          </p>

          <h1>{issue.title}</h1>
        </div>

        <select
          value={issue.status}
          disabled={
            currentProfile?.role !==
            "admin"
          }
          onChange={(event) =>
            onUpdate({
              status:
                event.target.value,
            })
          }
          style={{
            padding: "10px",
          }}
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
      </div>

      <hr />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <b>발생일</b>
        <span>{issue.date}</span>

        <b>협력사</b>
        <span>{issue.vendor}</span>

        <b>발생장비</b>
        <span>
          {(issue.equipment || []).join(
            ", "
          )}
        </span>

        <b>발생 범위</b>
        <span>
          {issue.occurrenceType}

          {issue.equipmentNumber
            ? ` / ${issue.equipmentNumber}`
            : ""}
        </span>
      </div>

      <hr />

      <h3>이슈 내용</h3>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          whiteSpace: "pre-wrap",
          borderRadius: "6px",
        }}
      >
        {issue.content ||
          "등록된 내용이 없습니다."}
      </div>

      <h3
        style={{
          marginTop: "25px",
        }}
      >
        Root Cause Analysis
      </h3>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          whiteSpace: "pre-wrap",
          borderRadius: "6px",
        }}
      >
        {issue.rootCause ||
          "등록된 내용이 없습니다."}
      </div>

      <h3
        style={{
          marginTop: "25px",
        }}
      >
        조치 진행 현황
      </h3>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          whiteSpace: "pre-wrap",
          borderRadius: "6px",
        }}
      >
        {issue.action ||
          "등록된 내용이 없습니다."}
      </div>
    </>
  );
}

function Field({
  label,
  children,
}) {
  return (
    <div style={styles.item}>
      <label>
        <b>{label}</b>
      </label>

      {children}
    </div>
  );
}

function PhotoGallery({
  photos,
  onPhotoClick,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      {photos.map(
        (photo, index) => (
          <button
            key={photo.id || index}
            type="button"
            onClick={() =>
              onPhotoClick(photo)
            }
            style={{
              width: "150px",
              padding: "8px",
              border:
                "1px solid #ddd",
              borderRadius: "6px",
              backgroundColor: "white",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <img
              src={photo.url}
              alt={photo.name}
              style={{
                width: "100%",
                height: "110px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />

            <div
              style={{
                marginTop: "6px",
                fontSize: "12px",
                overflow: "hidden",
                textOverflow:
                  "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {photo.name}
            </div>
          </button>
        )
      )}
    </div>
  );
}

function PhotoPreview({
  photo,
  onRemove,
}) {
  return (
    <div
      style={{
        width: "150px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "8px",
        backgroundColor: "white",
      }}
    >
      <img
        src={photo.url}
        alt={photo.name}
        style={{
          width: "100%",
          height: "110px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />

      <div
        style={{
          marginTop: "6px",
          fontSize: "12px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {photo.name}
      </div>

      <button
        type="button"
        onClick={onRemove}
        style={{
          width: "100%",
          marginTop: "6px",
          padding: "6px",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#ffe5e5",
          color: "#b00020",
          cursor: "pointer",
        }}
      >
        삭제
      </button>
    </div>
  );
}

function PhotoModal({
  photo,
  onClose,
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor:
          "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "30px",
      }}
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        style={{
          maxWidth: "1100px",
          maxHeight: "90vh",
          backgroundColor: "white",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: "20px",
            marginBottom: "10px",
          }}
        >
          <b>{photo.name}</b>

          <button
            type="button"
            onClick={onClose}
            style={{
              cursor: "pointer",
            }}
          >
            닫기
          </button>
        </div>

        <img
          src={photo.url}
          alt={photo.name}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "78vh",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
}
``