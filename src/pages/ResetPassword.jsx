import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { mainApi } from "../api/mainApi";
import { resetPasswordSchema } from "../validations/schema";
import { getErrorMessage } from "../utils/event";

// เปิดจากลิงก์ /reset-password?token=... ที่ได้จาก Forgot password
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    setError("");
    try {
      const resp = await mainApi.post("/auth/reset-password", {
        token,
        ...data,
      });
      toast.success(resp.data.message);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "ตั้งรหัสผ่านใหม่ไม่สำเร็จ"));
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-white border border-[#1A1A1A] text-[13.5px] outline-none focus:border-[#E8491D] focus:ring-1 focus:ring-[#E8491D] placeholder:text-gray-400";
  const labelClass =
    "block text-[10.5px] font-bold tracking-wider uppercase mb-1.5";
  const errorClass = "text-[10.5px] text-[#E8491D] font-semibold mt-1";

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] flex flex-col font-sans">
      <div className="flex items-center gap-2.5 px-6 sm:px-8 lg:px-10 xl:px-14 py-4 border-b border-[#1A1A1A]">
        <span className="text-base">☰</span>
        <Link to="/" className="font-black text-[15px] tracking-wide uppercase">
          Event.Book
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto px-6 sm:px-8 py-10">
          <h1 className="font-black text-[42px] sm:text-[52px] leading-[0.95] tracking-tight uppercase mb-7">
            New <br /> Password
          </h1>

          {!token ? (
            <div>
              <p className="text-sm text-[#E8491D] font-semibold mb-6">
                This reset link is missing its token. Please request a new one.
              </p>
              <Link
                to="/"
                className="block text-center w-full border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-4 hover:bg-white transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex items-baseline gap-2.5 mb-4">
                <span className="text-[26px] font-black text-[#E8491D] leading-none">
                  01
                </span>
                <span className="text-[13px] font-extrabold tracking-wider uppercase">
                  Choose a new password
                </span>
              </div>

              <div className="mb-4">
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className={inputClass}
                  {...register("password")}
                />
                {errors.password && (
                  <p className={errorClass}>{errors.password.message}</p>
                )}
              </div>

              <div className="mb-6">
                <label className={labelClass}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className={inputClass}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className={errorClass}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-[11px] text-[#E8491D] font-semibold mb-4">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E8491D] text-white border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-4 hover:bg-[#c73e17] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Set New Password"}
              </button>

              <p className="text-center text-xs mt-6">
                <Link to="/" className="text-[#E8491D] font-bold">
                  Back to Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
