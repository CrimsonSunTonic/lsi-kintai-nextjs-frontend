"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../../../api/auth/signupClient";

const SignupForm = () => {
  const router = useRouter();

  // 🔹 Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  // 🔹 Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [error, setError] = useState("");

  // 🔹 Loading and dialog
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // ✅ Live password matching validation
  const handleRepeatPasswordChange = (value: string) => {
    setRepeatPassword(value);
    if (password && value && value !== password) {
      setRepeatPasswordError("Passwords do not match");
    } else {
      setRepeatPasswordError("");
    }
  };

  // ✅ Validate fields before signup
  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setRepeatPasswordError("");
    setFirstnameError("");
    setLastnameError("");

    if (!email.trim()) {
      setEmailError("Email should not be empty");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Email must be a valid email address");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password should not be empty");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      valid = false;
    }

    if (!repeatPassword.trim()) {
      setRepeatPasswordError("Please confirm your password");
      valid = false;
    } else if (repeatPassword !== password) {
      setRepeatPasswordError("Passwords do not match");
      valid = false;
    }

    if (!firstname.trim()) {
      setFirstnameError("First name should not be empty");
      valid = false;
    }

    if (!lastname.trim()) {
      setLastnameError("Last name should not be empty");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(email, password, firstname, lastname);
      setOpenDialog(true);
    } catch (err: unknown) {
      console.error("Signup error:", err);
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    router.push("/signin");
  };

  const getEmailHelperText = () => {
    if (emailError === "Email should not be empty") return "メールアドレスを入力してください";
    if (emailError === "Email must be a valid email address") return "有効なメールアドレスを入力してください";
    return emailError;
  };

  const getPasswordHelperText = () => {
    if (passwordError === "Password should not be empty") return "パスワードを入力してください";
    if (passwordError === "Password must be at least 8 characters long") return "パスワードは8文字以上で入力してください";
    return passwordError;
  };

  const getRepeatPasswordHelperText = () => {
    if (repeatPasswordError === "Please confirm your password") return "パスワードを再入力してください";
    if (repeatPasswordError === "Passwords do not match") return "パスワードが一致しません";
    return repeatPasswordError;
  };

  const getFirstnameHelperText = () => {
    if (firstnameError === "First name should not be empty") return "名を入力してください";
    return firstnameError;
  };

  const getLastnameHelperText = () => {
    if (lastnameError === "Last name should not be empty") return "姓を入力してください";
    return lastnameError;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            新規登録
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 transition-all duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                placeholder="tarou@email.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 ${
                  emailError 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                }`}
              />
              {emailError && (
                <p className="text-red-600 text-sm mt-1 animate-pulse">
                  {getEmailHelperText()}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 ${
                  passwordError 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                }`}
              />
              {passwordError && (
                <p className="text-red-600 text-sm mt-1 animate-pulse">
                  {getPasswordHelperText()}
                </p>
              )}
            </div>

            {/* Repeat Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                パスワード（確認）
              </label>
              <input
                type="password"
                placeholder="もう一度パスワードを入力してください"
                required
                value={repeatPassword}
                onChange={(e) => handleRepeatPasswordChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 ${
                  repeatPasswordError 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                }`}
              />
              {repeatPasswordError && (
                <p className="text-red-600 text-sm mt-1 animate-pulse">
                  {getRepeatPasswordHelperText()}
                </p>
              )}
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                名
              </label>
              <input
                placeholder="名を入力してください"
                required
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 ${
                  firstnameError 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                }`}
              />
              {firstnameError && (
                <p className="text-red-600 text-sm mt-1 animate-pulse">
                  {getFirstnameHelperText()}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                姓
              </label>
              <input
                placeholder="姓を入力してください"
                required
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 ${
                  lastnameError 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                }`}
              />
              {lastnameError && (
                <p className="text-red-600 text-sm mt-1 animate-pulse">
                  {getLastnameHelperText()}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登録中...
                </span>
              ) : (
                "新規登録"
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600 text-sm">
              すでにアカウントをお持ちですか？
            </p>
            <a 
              href="/signin" 
              className="inline-block text-green-600 hover:text-green-800 font-medium transition-colors duration-200 hover:underline"
            >
              ログイン
            </a>
          </div>
        </div>
      </div>

      {/* ✅ Success Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full transform animate-scaleIn">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                登録が完了しました！
              </h3>
              <p className="text-gray-600 mb-6">
                アカウントが正常に作成されました。
              </p>
              <button
                onClick={handleDialogClose}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ログイン画面へ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;