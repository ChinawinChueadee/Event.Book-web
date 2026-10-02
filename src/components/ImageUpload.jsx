import React from "react";
import { useEffect, useRef, useState } from "react";
import { mainApi } from "../api/mainApi";
import { getErrorMessage } from "../utils/event";

// ต้องตรงกับ upload.middleware.js ฝั่ง API
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// เลือกไฟล์ → อัปโหลดไป POST /uploads/image ทันที → ส่ง url กลับผ่าน onChange
// value = url ปัจจุบัน ("" = ไม่มีรูป)
function ImageUpload({
  value,
  onChange,
  onUploadingChange,
  shape = "wide",
  alt = "",
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(""); // object URL ระหว่างอัปโหลด
  const [progress, setProgress] = useState(null); // 0-100 หรือ null = ไม่ได้อัปโหลด
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const uploading = progress !== null;
  const shownImage = preview || value;

  // คืนหน่วยความจำของ object URL เมื่อไม่ใช้แล้ว
  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  const uploadFile = async (file) => {
    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG or WEBP images are allowed");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Image must be 5MB or smaller");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setProgress(0);
    onUploadingChange?.(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const resp = await mainApi.post("/uploads/image", formData, {
        // ต้องระบุ ไม่งั้น axios แปลง FormData เป็น JSON ตาม default header
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) =>
          e.total && setProgress(Math.round((e.loaded / e.total) * 100)),
      });
      onChange(resp.data.url);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "อัปโหลดรูปไม่สำเร็จ"));
    } finally {
      setPreview("");
      setProgress(null);
      onUploadingChange?.(false);
      // ให้เลือกไฟล์เดิมซ้ำได้
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && !uploading) uploadFile(file);
  };

  const frameClass =
    shape === "square" ? "w-32 h-32 sm:w-36 sm:h-36" : "w-full aspect-[16/9]";
  const smallButton =
    "px-3.5 py-2 border border-[#1A1A1A] font-extrabold text-[11px] tracking-wider uppercase transition-colors disabled:opacity-50";

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative ${frameClass} border border-[#1A1A1A] overflow-hidden ${
          dragging ? "ring-2 ring-[#E8491D]" : ""
        } ${shownImage ? "bg-[#1A1A1A]" : "bg-white border-dashed"}`}
      >
        {shownImage ? (
          <img
            src={shownImage}
            alt={alt}
            className={`w-full h-full object-cover ${uploading ? "opacity-50" : ""}`}
          />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-center px-3 hover:bg-[#F4F1EA] transition-colors"
          >
            <span className="text-2xl leading-none">＋</span>
            <span className="text-[11px] font-extrabold tracking-wider uppercase">
              Upload image
            </span>
            <span className="text-[10px] text-[#8A8578]">
              {shape === "square" ? "JPG, PNG, WEBP" : "Click or drop · JPG, PNG, WEBP · max 5MB"}
            </span>
          </button>
        )}

        {/* แถบความคืบหน้าระหว่างอัปโหลด */}
        {uploading && (
          <div className="absolute inset-x-0 bottom-0 bg-[#1A1A1A]/80 text-[#F4F1EA] px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Uploading… {progress}%
            </p>
            <div className="h-1 bg-[#F4F1EA]/30">
              <div
                className="h-full bg-[#E8491D] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {shownImage && (
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={`${smallButton} bg-white hover:bg-[#F4F1EA]`}
          >
            Change
          </button>
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={uploading}
            className={`${smallButton} border-[#E8491D] text-[#E8491D] hover:bg-[#E8491D] hover:text-white`}
          >
            Remove
          </button>
        </div>
      )}

      {error && (
        <p className="text-[10.5px] text-[#E8491D] font-semibold mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}

export default ImageUpload;
