import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "../validations/schema";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { mainApi } from "../api/mainApi";
import useUserStore from "../stores/userStore";

function Login() {
  const [tab, setTab] = useState("login");
  const [plan, setPlan] = useState("standard");
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  // ---------- Login form ----------
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

  // ---------- Register form ----------
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (data) => {
    try {
      const resp = await login(data);
      toast(resp.data.message, {
        type: "success",
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message, {
        position: "top-center",
      });
    }
  };

  const onRegisterSubmit = async (data) => {
    console.log(data, "data");
    try {
      const resp = await mainApi.post("/auth/register", data);
      toast(resp.data.message, {
        type: "success",
      });
    } catch (err) {
      console.error(err);
      toast(err.response?.data?.message, {
        type: "error",
      });
    }
  };
  const onSubmit = async (data) => {
    try {
      const resp = await axios.post(
        "http://localhost:5005/auth/register",
        data,
      );
      alert(JSON.stringify(resp.data, null, 2));
    } catch (err) {
      console.error(err);
      alert(JSON.stringify(err, null, 2));
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-white border border-[#1A1A1A] text-[13.5px] outline-none focus:border-[#E8491D] focus:ring-1 focus:ring-[#E8491D] placeholder:text-gray-400";
  const labelClass =
    "block text-[10.5px] font-bold tracking-wider uppercase mb-1.5";
  const errorClass = "text-[10.5px] text-[#E8491D] font-semibold mt-1";

  return (
    <div className="bg-[#0d0d0d] min-h-screen w-full flex font-sans">
      <div className="w-full min-h-screen bg-[#F4F1EA] flex flex-col lg:flex-row">
        {/* LEFT SIDE - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#1A1A1A] text-[#F4F1EA] p-10 xl:p-16 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg">☰</span>
              <span className="font-black text-lg tracking-wide uppercase">
                Event.Book
              </span>
            </div>
            <div className="mt-24 xl:mt-32">
              <p className="text-[#E8491D] font-black text-sm tracking-[0.2em] uppercase mb-5">
                Event Booking System
              </p>
              <h1 className="font-black text-[64px] xl:text-[84px] leading-[0.9] tracking-tight uppercase">
                Discover <br /> Your Next <br /> Event.
              </h1>
              <p className="text-[#cfcabf] mt-8 max-w-md text-sm leading-6">
                Discover events, reserve your seat, and manage your bookings in
                one simple platform.
              </p>
            </div>
          </div>
          <div className="border-t border-[#555] pt-5 flex justify-between text-[10px] tracking-widest uppercase text-[#aaa] max-w-md">
            <span>Discover</span> <span>Book</span> <span>Experience</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 bg-[#F4F1EA] flex flex-col min-h-screen">
          <div className="lg:hidden flex items-center gap-2.5 px-5 py-4 border-b border-[#1A1A1A]">
            <span className="text-base">☰</span>
            <span className="font-black text-[15px] tracking-wide uppercase">
              Event.Book
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto px-6 sm:px-8 lg:px-0 py-8 lg:py-12">
              <h1 className="font-black text-[42px] sm:text-[48px] lg:text-[52px] leading-[0.95] tracking-tight uppercase mb-7">
                {tab === "login" ? (
                  <>
                    Access <br /> Account
                  </>
                ) : (
                  <>
                    Create <br /> Account
                  </>
                )}
              </h1>

              <div className="flex border border-[#1A1A1A] mb-7">
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className={`flex-1 py-3.5 border-r border-[#1A1A1A] font-extrabold text-xs tracking-wider uppercase cursor-pointer transition-colors ${tab === "login" ? "bg-[#1A1A1A] text-[#F4F1EA]" : "bg-white text-[#1A1A1A]"}`}
                >
                  <span className="text-[#E8491D] font-black mr-1.5">01</span>
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className={`flex-1 py-3.5 font-extrabold text-xs tracking-wider uppercase cursor-pointer transition-colors ${tab === "register" ? "bg-[#1A1A1A] text-[#F4F1EA]" : "bg-white text-[#1A1A1A]"}`}
                >
                  <span className="text-[#E8491D] font-black mr-1.5">02</span>
                  Register
                </button>
              </div>

              {/* LOGIN FORM */}
              {tab === "login" && (
                <form onSubmit={handleSubmitLogin(onLoginSubmit)} noValidate>
                  <div className="flex items-baseline gap-2.5 mb-4">
                    <span className="text-[26px] font-black text-[#E8491D] leading-none">
                      01
                    </span>
                    <span className="text-[13px] font-extrabold tracking-wider uppercase">
                      Credentials
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className={inputClass}
                      {...registerLogin("email")}
                    />
                    {loginErrors.email && (
                      <p className={errorClass}>{loginErrors.email.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className={labelClass}>Password</label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      className={inputClass}
                      {...registerLogin("password")}
                    />
                    {loginErrors.password && (
                      <p className={errorClass}>
                        {loginErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-[11.5px] mb-6">
                    <label className="flex items-center gap-1.5 font-semibold">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 accent-[#1A1A1A]"
                      />
                      Remember me
                    </label>
                    <a
                      href="#"
                      className="text-[#E8491D] font-bold no-underline"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E8491D] text-white border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-4 hover:bg-[#c73e17] transition-colors"
                  >
                    Sign In
                  </button>

                  <p className="text-center text-xs mt-6">
                    Don't have an account?
                    <button
                      type="button"
                      onClick={() => setTab("register")}
                      className="text-[#E8491D] font-bold"
                    >
                      Register
                    </button>
                  </p>
                </form>
              )}

              {/* REGISTER FORM */}
              {tab === "register" && (
                <form
                  onSubmit={handleSubmitRegister(onRegisterSubmit)}
                  noValidate
                >
                  <div className="flex items-baseline gap-2.5 mb-4">
                    <span className="text-[26px] font-black text-[#E8491D] leading-none">
                      01
                    </span>
                    <span className="text-[13px] font-extrabold tracking-wider uppercase">
                      Information
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className={labelClass}>Username</label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      className={inputClass}
                      {...registerRegister("username")}
                    />
                    {registerErrors.username && (
                      <p className={errorClass}>
                        {registerErrors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className={inputClass}
                      {...registerRegister("email")}
                    />
                    {registerErrors.email && (
                      <p className={errorClass}>
                        {registerErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    <div className="mb-4">
                      <label className={labelClass}>Password</label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        className={inputClass}
                        {...registerRegister("password")}
                      />
                      {registerErrors.password && (
                        <p className={errorClass}>
                          {registerErrors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className={labelClass}>Confirm</label>
                      <input
                        type="password"
                        placeholder="Confirm password"
                        className={inputClass}
                        {...registerRegister("confirmPassword")}
                      />
                      {registerErrors.confirmPassword && (
                        <p className={errorClass}>
                          {registerErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E8491D] text-white border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-4 hover:bg-[#c73e17] transition-colors"
                  >
                    Create Account
                  </button>
                  <p className="text-center text-xs mt-5">
                    Already registered?
                    <button
                      type="button"
                      onClick={() => setTab("login")}
                      className="text-[#E8491D] font-bold"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>

          <footer className="border-t border-[#1A1A1A] px-6 sm:px-8 lg:px-10 xl:px-14 py-4 flex justify-between items-center">
            <div className="font-black text-[13px] uppercase tracking-wide">
              Event.Book
            </div>
            <div className="flex gap-3.5 text-[9.5px] font-semibold tracking-wide uppercase">
              <span>Terms</span> <span>Privacy</span> <span>Contact</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Login;
