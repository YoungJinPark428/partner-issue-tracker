import { useState } from "react";

import { styles } from "../styles";

import {
  loginUser,
  registerUser,
} from "../services/authService";

const COMPANY_OPTIONS = [
  "PRI",
  "HPK",
  "SRD",
  "PROTNC",
  "이안시스템",
  "KEYENCE",
  "OPT",
  "기타",
];

export default function LoginPage({
  onLogin,
}) {
  const [mode, setMode] =
    useState("login");

  const [name, setName] =
    useState("");

  const [company, setCompany] =
    useState("HPK");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const resetMessages = () => {
    setMessage("");
    setErrorMessage("");
  };

  const handleRegister = async () => {
    resetMessages();

    if (!name.trim()) {
      setErrorMessage(
        "이름을 입력해 주세요."
      );
      return;
    }

    if (!email.trim()) {
      setErrorMessage(
        "이메일을 입력해 주세요."
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        "비밀번호는 6자리 이상이어야 합니다."
      );
      return;
    }

    try {
      setIsLoading(true);

      await registerUser({
        name,
        company,
        email,
        password,
      });

      setMessage(
        "회원가입 신청이 완료되었습니다. 관리자 승인 후 로그인할 수 있습니다."
      );

      setPassword("");
      setMode("login");
    } catch (error) {
      console.error(
        "회원가입 오류:",
        error
      );

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {
        setErrorMessage(
          "이미 사용 중인 이메일입니다."
        );
      } else if (
        error.code ===
        "auth/invalid-email"
      ) {
        setErrorMessage(
          "이메일 형식이 올바르지 않습니다."
        );
      } else {
        setErrorMessage(
          error.message
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    resetMessages();

    if (!email.trim()) {
      setErrorMessage(
        "이메일을 입력해 주세요."
      );
      return;
    }

    if (!password.trim()) {
      setErrorMessage(
        "비밀번호를 입력해 주세요."
      );
      return;
    }

    try {
      setIsLoading(true);

      const loginResult =
        await loginUser(
          email,
          password
        );

      onLogin(loginResult);
    } catch (error) {
      console.error(
        "로그인 오류:",
        error
      );

      if (
        error.code ===
          "auth/invalid-credential" ||
        error.code ===
          "auth/wrong-password" ||
        error.code ===
          "auth/user-not-found"
      ) {
        setErrorMessage(
          "이메일 또는 비밀번호가 올바르지 않습니다."
        );
      } else {
        setErrorMessage(
          error.message
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        display: "grid",
        placeItems: "center",
        fontFamily:
          "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          ...styles.card,
          width: "420px",
          maxWidth: "100%",
        }}
      >
        <h1>
          협력사 PM 이슈 관리
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "24px",
          }}
        >
          {mode === "login"
            ? "승인된 사용자만 접속할 수 있습니다."
            : "회원가입 신청 후 관리자 승인이 필요합니다."}
        </p>

        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "6px",
              backgroundColor:
                "#ecfdf3",
              color: "#166534",
              border:
                "1px solid #bbf7d0",
            }}
          >
            {message}
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "6px",
              backgroundColor:
                "#fff1f2",
              color: "#be123c",
              border:
                "1px solid #fecdd3",
            }}
          >
            {errorMessage}
          </div>
        )}

        {mode === "register" && (
          <>
            <label>
              <b>이름</b>
            </label>

            <input
              style={styles.input}
              placeholder="이름"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
            />

            <label>
              <b>회사</b>
            </label>

            <select
              style={styles.input}
              value={company}
              onChange={(event) =>
                setCompany(
                  event.target.value
                )
              }
            >
              {COMPANY_OPTIONS.map(
                (companyName) => (
                  <option
                    key={companyName}
                    value={companyName}
                  >
                    {companyName}
                  </option>
                )
              )}
            </select>
          </>
        )}

        <label>
          <b>이메일</b>
        </label>

        <input
          style={styles.input}
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
        />

        <label>
          <b>비밀번호</b>
        </label>

        <input
          style={styles.input}
          type="password"
          placeholder="6자리 이상"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              mode === "login"
            ) {
              handleLogin();
            }
          }}
        />

        {mode === "login" ? (
          <>
            <button
              style={{
                ...styles.primary,
                width: "100%",
                marginTop: "20px",
              }}
              disabled={isLoading}
              onClick={handleLogin}
            >
              {isLoading
                ? "로그인 중..."
                : "로그인"}
            </button>

            <button
              style={{
                ...styles.secondary,
                width: "100%",
                marginTop: "10px",
              }}
              disabled={isLoading}
              onClick={() => {
                resetMessages();
                setMode("register");
              }}
            >
              회원가입 신청
            </button>
          </>
        ) : (
          <>
            <button
              style={{
                ...styles.primary,
                width: "100%",
                marginTop: "20px",
              }}
              disabled={isLoading}
              onClick={handleRegister}
            >
              {isLoading
                ? "신청 중..."
                : "회원가입 승인 요청"}
            </button>

            <button
              style={{
                ...styles.secondary,
                width: "100%",
                marginTop: "10px",
              }}
              disabled={isLoading}
              onClick={() => {
                resetMessages();
                setMode("login");
              }}
            >
              로그인으로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}