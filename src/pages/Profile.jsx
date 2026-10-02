import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { mainApi } from "../api/mainApi";
import PageHeader from "../components/PageHeader";
import ImageUpload from "../components/ImageUpload";
import useUserStore from "../stores/userStore";
import { getErrorMessage } from "../utils/event";

function Profile() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: user?.username || "",
    profileImage: user?.profileImage || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // โหลดข้อมูลล่าสุดจาก server (เช่น role หรือรูปที่เปลี่ยนจากที่อื่น)
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const resp = await mainApi.get("/users/me");
        setUser(resp.data.user);
        setForm({
          username: resp.data.user.username || "",
          profileImage: resp.data.user.profileImage || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchMe();
  }, [setUser]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      // profileImage "" = ลบรูปโปรไฟล์
      const payload = {
        username: form.username,
        profileImage: form.profileImage,
      };
      const resp = await mainApi.patch("/users/me", payload);
      setUser(resp.data.user);
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "บันทึกโปรไฟล์ไม่สำเร็จ"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "ลบบัญชีนี้ใช่ไหม? อีเวนต์และการจองทั้งหมดของคุณจะถูกลบด้วย และย้อนกลับไม่ได้",
      )
    )
      return;
    setDeleting(true);
    try {
      await mainApi.delete("/users/me");
      logout();
      navigate("/");
      toast.success("Account deleted");
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "ลบบัญชีไม่สำเร็จ"));
      setDeleting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-white border border-[#1A1A1A] text-[13.5px] outline-none focus:border-[#E8491D] focus:ring-1 focus:ring-[#E8491D] placeholder:text-gray-400";
  const labelClass =
    "block text-[10.5px] font-bold tracking-wider uppercase mb-1.5";
  const initial = (user?.username || user?.email || "?")[0].toUpperCase();

  return (
    <main className="flex-1 w-full text-[#1A1A1A]">
      <PageHeader
        title="Profile"
        subtitle="Update how you appear to hosts and other attendees."
      />

      <div className="px-6 sm:px-8 lg:px-10 xl:px-14 py-10 pb-16 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-14">
        {/* การ์ดสรุปผู้ใช้ */}
        <aside className="border border-[#1A1A1A] bg-white p-6 flex flex-col items-center text-center self-start">
          {form.profileImage ? (
            <img
              src={form.profileImage}
              alt={user?.username}
              className="w-24 h-24 object-cover border border-[#1A1A1A] mb-4"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-[#1A1A1A] text-[#F4F1EA] font-black text-4xl mb-4">
              {initial}
            </div>
          )}
          <p className="font-black text-xl uppercase leading-tight break-all">
            {user?.username}
          </p>
          <p className="text-xs text-[#8A8578] mt-1 break-all">{user?.email}</p>
          {user?.role === "ADMIN" && (
            <span className="mt-3 text-[10px] font-bold uppercase tracking-wide bg-[#E8491D] text-white px-2.5 py-1">
              Admin
            </span>
          )}
        </aside>

        <div className="max-w-xl">
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex items-baseline gap-2.5 mb-5">
              <span className="text-[26px] font-black text-[#E8491D] leading-none">
                01
              </span>
              <span className="text-[13px] font-extrabold tracking-wider uppercase">
                Account Details
              </span>
            </div>

            <div className="mb-4">
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className={`${inputClass} bg-[#ece8de] text-[#8A8578] cursor-not-allowed`}
              />
            </div>

            <div className="mb-4">
              <label className={labelClass}>Username</label>
              <input
                type="text"
                value={form.username}
                onChange={handleChange("username")}
                required
                className={inputClass}
              />
            </div>

            <div className="mb-6">
              <label className={labelClass}>Profile Image</label>
              <ImageUpload
                shape="square"
                value={form.profileImage}
                onChange={(url) =>
                  setForm((prev) => ({ ...prev, profileImage: url }))
                }
                onUploadingChange={setUploading}
                alt={user?.username}
              />
              {form.profileImage !== (user?.profileImage || "") && (
                <p className="text-[10.5px] text-[#8A8578] font-semibold mt-1.5">
                  Press Save Changes to apply the new image.
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
              disabled={saving || uploading}
              className="w-full sm:w-auto px-10 bg-[#E8491D] text-white border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-3.5 hover:bg-[#c73e17] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {/* Danger zone */}
          <div className="mt-12 border border-[#E8491D] p-5">
            <div className="flex items-baseline gap-2.5 mb-2">
              <span className="text-[26px] font-black text-[#E8491D] leading-none">
                02
              </span>
              <span className="text-[13px] font-extrabold tracking-wider uppercase">
                Delete Account
              </span>
            </div>
            <p className="text-xs leading-5 text-[#4a463c] mb-4">
              This permanently removes your account, the events you host and
              all of your bookings.
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-6 py-3 border border-[#E8491D] text-[#E8491D] font-extrabold text-[11px] tracking-wider uppercase hover:bg-[#E8491D] hover:text-white transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete My Account"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
