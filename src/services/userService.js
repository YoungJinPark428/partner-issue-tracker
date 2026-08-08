import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export function subscribeUsers(
  onSuccess,
  onError
) {
  const usersCollection =
    collection(db, "users");

  return onSnapshot(
    usersCollection,
    (snapshot) => {
      const users =
        snapshot.docs.map(
          (userDocument) => ({
            id: userDocument.id,
            ...userDocument.data(),
          })
        );

      users.sort((firstUser, secondUser) => {
        if (
          firstUser.status === "Pending" &&
          secondUser.status !== "Pending"
        ) {
          return -1;
        }

        if (
          firstUser.status !== "Pending" &&
          secondUser.status === "Pending"
        ) {
          return 1;
        }

        return (
          firstUser.name || ""
        ).localeCompare(
          secondUser.name || ""
        );
      });

      onSuccess(users);
    },
    (error) => {
      console.error(
        "사용자 목록 조회 오류:",
        error
      );

      if (onError) {
        onError(error);
      }
    }
  );
}

export async function approveUser(
  userId
) {
  const userReference = doc(
    db,
    "users",
    userId
  );

  await updateDoc(
    userReference,
    {
      status: "Approved",
      updatedAt: serverTimestamp(),
    }
  );
}

export async function rejectUser(
  userId
) {
  const userReference = doc(
    db,
    "users",
    userId
  );

  await updateDoc(
    userReference,
    {
      status: "Rejected",
      updatedAt: serverTimestamp(),
    }
  );
}

export async function returnUserToPending(
  userId
) {
  const userReference = doc(
    db,
    "users",
    userId
  );

  await updateDoc(
    userReference,
    {
      status: "Pending",
      updatedAt: serverTimestamp(),
    }
  );
}

export async function changeUserRole(
  userId,
  role
) {
  const userReference = doc(
    db,
    "users",
    userId
  );

  await updateDoc(
    userReference,
    {
      role,
      updatedAt: serverTimestamp(),
    }
  );
}
``