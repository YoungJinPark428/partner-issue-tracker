import {
  useEffect,
  useState,
} from "react";

import LoginPage from "./pages/LoginPage";
import IssueListPage from "./pages/IssueListPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import AdminApprovalPage from "./pages/AdminApprovalPage";

import {
  deleteIssue,
  subscribeIssues,
  updateIssue,
} from "./services/issueService";

import {
  getUserProfile,
  logoutUser,
  observeAuthState,
} from "./services/authService";

export default function App() {
  const [
    currentProfile,
    setCurrentProfile,
  ] = useState(null);

  const [
    isAuthLoading,
    setIsAuthLoading,
  ] = useState(true);

  const [issues, setIssues] =
    useState([]);

  const [
    selectedIssueNo,
    setSelectedIssueNo,
  ] = useState(null);

  const [currentPage, setCurrentPage] =
    useState("issues");

  useEffect(() => {
    const unsubscribeAuth =
      observeAuthState(
        async (firebaseUser) => {
          if (!firebaseUser) {
            setCurrentProfile(null);
            setIsAuthLoading(false);
            return;
          }

          try {
            const profile =
              await getUserProfile(
                firebaseUser.uid
              );

            if (
              profile?.status ===
              "Approved"
            ) {
              setCurrentProfile(
                profile
              );
            } else {
              setCurrentProfile(null);

              await logoutUser();
            }
          } catch (error) {
            console.error(
              "사용자 정보 확인 오류:",
              error
            );

            setCurrentProfile(null);
          } finally {
            setIsAuthLoading(false);
          }
        }
      );

    return () =>
      unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentProfile) {
      setIssues([]);
      return;
    }

    const unsubscribeIssues =
      subscribeIssues(
        (loadedIssues) => {
          setIssues(loadedIssues);
        },
        (error) => {
          console.error(error);
        }
      );

    return () =>
      unsubscribeIssues();
  }, [currentProfile]);

  const selectedIssue =
    issues.find(
      (issue) =>
        issue.issueNo ===
          selectedIssueNo ||
        issue.id ===
          selectedIssueNo
    );

  const handleLogin = (
    loginResult
  ) => {

    console.log(
        "LOGIN RESULT",
        loginResult
    );

    setCurrentProfile(
      loginResult.profile
    );

    setCurrentPage("issues");
  };

  const handleLogout = async () => {
    await logoutUser();

    setCurrentProfile(null);
    setSelectedIssueNo(null);
    setCurrentPage("issues");
  };

  if (isAuthLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        로그인 정보를 확인하고 있습니다.
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  if (
    currentPage === "admin" &&
    currentProfile.role === "admin"
  ) {
    return (
      <AdminApprovalPage
        currentProfile={
          currentProfile
        }
        onBack={() =>
          setCurrentPage("issues")
        }
        onLogout={handleLogout}
      />
    );
  }

  if (selectedIssue) {
    return (
      <IssueDetailPage
        issue={selectedIssue}
        currentProfile={
          currentProfile
        }
        onBack={() =>
          setSelectedIssueNo(null)
        }
        onDelete={async () => {
          if (
            currentProfile.role !==
            "admin"
          ) {
            alert(
              "관리자만 이슈를 삭제할 수 있습니다."
            );

            return;
          }

          const confirmed =
            window.confirm(
              "이 이슈를 삭제하시겠습니까?"
            );

          if (!confirmed) {
            return;
          }

          try {
            await deleteIssue(
              selectedIssue.id
            );

            setSelectedIssueNo(null);
          } catch (error) {
            console.error(error);

            alert(
              "이슈 삭제에 실패했습니다."
            );
          }
        }}


        






        onUpdate={async (patch) => {
          try {
            await updateIssue(
              selectedIssue.id,
              patch
            );

            setIssues(
              (previousIssues) =>
                previousIssues.map(
                  (issue) =>
                    issue.id ===
                    selectedIssue.id
                      ? {
                          ...issue,
                          ...patch,
                        }
                      : issue
                )
            );
          } catch (error) {
            console.error(error);

            alert(
              "저장에 실패했습니다."
            );

            throw error;
          }
        }}
      />
    );
  }

  return (
    <IssueListPage
      issues={issues}
      setIssues={setIssues}
      currentProfile={
        currentProfile
      }
      onSelect={
        setSelectedIssueNo
      }
      onOpenAdmin={() =>
        setCurrentPage("admin")
      }
      onLogout={handleLogout}
    />
  );
}