import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase";

export async function registerUser({
  name,
  company,
  email,
  password,
}) {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const firebaseUser =
    userCredential.user;

  

  await setDoc(
    doc(
      db,
      "users",
      firebaseUser.uid
    ),
    {
      uid: firebaseUser.uid,
      name: name.trim(),
      company,
      email: email.trim(),
      role: "partner",
      status: "Pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  await signOut(auth);

  return firebaseUser;
}

export async function loginUser(
  email,
  password
) {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  const firebaseUser =
    userCredential.user;

  const profile =
    await getUserProfile(
      firebaseUser.uid
    );

  if (!profile) {
    await signOut(auth);

    throw new Error(
      "사용자 프로필이 없습니다. 관리자에게 문의해 주세요."
    );
  }

  if (profile.status !== "Approved") {
    await signOut(auth);

    throw new Error(
      profile.status === "Rejected"
        ? "회원가입이 거절된 계정입니다."
        : "관리자 승인 대기 중입니다."
    );
  }

  return {
    firebaseUser,
    profile,
  };
}

export async function getUserProfile(
  uid
) {
  const userDocument =
    await getDoc(
      doc(
        db,
        "users",
        uid
      )
    );

  if (!userDocument.exists()) {
    return null;
  }

  return {
    id: userDocument.id,
    ...userDocument.data(),
  };
}

export function observeAuthState(
  callback
) {
  return onAuthStateChanged(
    auth,
    callback
  );
}

export async function logoutUser() {
  await signOut(auth);
}