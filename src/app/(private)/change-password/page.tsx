"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notify } from "@/utils/sweetalertHelp";
import { changePasswordClient } from "@/api/auth/changePasswordClient";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // ✅ Live password matching validation
  const handleConfirmPasswordChange = (value: string) => {
    setFormData({
      ...formData,
      confirmPassword: value,
    });
    
    if (formData.newPassword && value && value !== formData.newPassword) {
      setErrors({
        ...errors,
        confirmPassword: "Passwords do not match",
      });
    } else {
      setErrors({
        ...errors,
        confirmPassword: "",
      });
    }
  };

  // ✅ Validate fields before submission
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password should not be empty";
      valid = false;
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Password should not be empty";
      valid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
      valid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const getCurrentPasswordHelperText = () => {
    if (errors.currentPassword === "Current password should not be empty") return "現在のパスワードを入力してください";
    return errors.currentPassword;
  };

  const getNewPasswordHelperText = () => {
    if (errors.newPassword === "Password should not be empty") return "新しいパスワードを入力してください";
    if (errors.newPassword === "Password must be at least 8 characters long") return "パスワードは8文字以上で入力してください";
    if (errors.newPassword === "New password must be different from current password") return "新しいパスワードは現在のパスワードと異なるものを設定してください";
    return errors.newPassword;
  };

  const getConfirmPasswordHelperText = () => {
    if (errors.confirmPassword === "Please confirm your password") return "パスワードを再入力してください";
    if (errors.confirmPassword === "Passwords do not match") return "パスワードが一致しません";
    return errors.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      await changePasswordClient({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      notify("success", "成功", "パスワードが正常に変更されました。");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // Redirect based on user role
      setTimeout(() => {
        const userRole = localStorage.getItem("user_role");
        if (userRole === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
      }, 2000);
    } catch (error: any) {
      notify("error", "エラー", error.message || "パスワードの変更に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center mt-5">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Main Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 background-animate-morph"></div>
        
        {/* Floating Shapes */}
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow animation-delay-4000"></div>
        
        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
      </div>

      <div className="max-w-md w-full">
        {/* Main Card with Glass Effect */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Background Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl opacity-20 blur-lg animate-pulse"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                パスワード変更
              </h1>
              <p className="text-gray-600 backdrop-blur-sm bg-white/50 rounded-lg px-3 py-1 inline-block">
                セキュリティのため、定期的なパスワード変更をおすすめします
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  現在のパスワード
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border border-white/30 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-600 ${
                    errors.currentPassword 
                      ? "border-red-400 focus:ring-red-400 focus:border-red-400" 
                      : "focus:ring-green-500 focus:border-green-500"
                  }`}
                  placeholder="現在のパスワードを入力"
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1 animate-pulse backdrop-blur-sm bg-red-50/80 rounded-lg px-3 py-1 border border-red-200/50">
                    {getCurrentPasswordHelperText()}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  新しいパスワード
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className={`w-full px-4 py-3 border border-white/30 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-600 ${
                    errors.newPassword 
                      ? "border-red-400 focus:ring-red-400 focus:border-red-400" 
                      : "focus:ring-green-500 focus:border-green-500"
                  }`}
                  placeholder="新しいパスワードを入力（8文字以上）"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1 animate-pulse backdrop-blur-sm bg-red-50/80 rounded-lg px-3 py-1 border border-red-200/50">
                    {getNewPasswordHelperText()}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1 backdrop-blur-sm bg-white/50 rounded-lg px-2 py-1 inline-block">
                  8文字以上のパスワードを設定してください
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  新しいパスワード（確認）
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  required
                  className={`w-full px-4 py-3 border border-white/30 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-600 ${
                    errors.confirmPassword 
                      ? "border-red-400 focus:ring-red-400 focus:border-red-400" 
                      : "focus:ring-green-500 focus:border-green-500"
                  }`}
                  placeholder="新しいパスワードを再入力"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 animate-pulse backdrop-blur-sm bg-red-50/80 rounded-lg px-3 py-1 border border-red-200/50">
                    {getConfirmPasswordHelperText()}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                )}
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>変更中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>パスワードを変更</span>
                  </>
                )}
              </button>
            </form>

            {/* Security Tips */}
            <div className="mt-8 p-4 bg-green-50/80 backdrop-blur-sm rounded-xl border border-green-200/50">
              <h3 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                セキュリティのヒント
              </h3>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• 8文字以上のパスワードを設定してください</li>
                <li>• 大文字・小文字・数字・記号を組み合わせるとより安全です</li>
                <li>• 定期的なパスワード変更をおすすめします</li>
              </ul>
            </div>

            {/* Navigation */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  const userRole = localStorage.getItem("user_role");
                  if (userRole === "ADMIN") {
                    router.push("/admin");
                  } else {
                    router.push("/user");
                  }
                }}
                className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 backdrop-blur-sm bg-white/50 rounded-lg px-4 py-2 border border-white/30 hover:border-green-400/50"
              >
                ← ダッシュボードに戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}