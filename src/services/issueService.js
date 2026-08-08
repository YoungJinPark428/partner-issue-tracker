import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

const issuesCollection = collection(db, "issues");

export function subscribeIssues(onSuccess, onError) {
  const issuesQuery = query(
    issuesCollection,
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    issuesQuery,
    (snapshot) => {
      const issues = snapshot.docs.map(
        (document) => ({
          id: document.id,
          ...document.data(),
        })
      );

      onSuccess(issues);
    },
    (error) => {
      console.error(
        "Firestore 이슈 불러오기 오류:",
        error
      );

      if (onError) {
        onError(error);
      }
    }
  );
}

export async function createIssue(issue) {
  const issueDocument = {
    ...issue,
    comments: issue.comments || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const documentReference = await addDoc(
    issuesCollection,
    issueDocument
  );

  return documentReference.id;
}

export async function updateIssue(
  issueId,
  changedValues
) {
  if (!issueId) {
    throw new Error(
      "Firestore 문서 ID가 없습니다."
    );
  }

  const issueReference = doc(
    db,
    "issues",
    issueId
  );

  await updateDoc(issueReference, {
    ...changedValues,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteIssue(issueId) {
  if (!issueId) {
    throw new Error(
      "Firestore 문서 ID가 없습니다."
    );
  }

  const issueReference = doc(
    db,
    "issues",
    issueId
  );

  await deleteDoc(issueReference);
}