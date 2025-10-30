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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              パスワード変更
            </h1>
            <p className="text-gray-600">
              セキュリティのため、定期的なパスワード変更をおすすめします
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
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
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 ${
                  errors.currentPassword 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="現在のパスワードを入力"
              />
              {errors.currentPassword && (
                <p className="text-red-600 text-sm mt-1 animate-pulse">
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
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 ${
                  errors.newPassword 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="新しいパスワードを入力（8文字以上）"
              />
              {errors.newPassword && (
                <p className="text-red-600 text-sm mt-1 animate-pulse">
                  {getNewPasswordHelperText()}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
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
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 ${
                  errors.confirmPassword 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="新しいパスワードを再入力"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1 animate-pulse">
                  {getConfirmPasswordHelperText()}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  変更中...
                </span>
              ) : (
                "パスワードを変更"
              )}
            </button>
          </form>

          {/* Security Tips */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">セキュリティのヒント</h3>
            <ul className="text-xs text-blue-700 space-y-1">
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
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              ← ダッシュボードに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}