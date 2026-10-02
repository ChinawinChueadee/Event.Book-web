import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { mainApi } from "../api/mainApi";
import PageHeader from "../components/PageHeader";
import { invalidateCategories } from "../hooks/useCategories";
import useUserStore from "../stores/userStore";
import {
  bookingStatusClass,
  bookingStatusLabel,
  formatDate,
  getErrorMessage,
} from "../utils/event";

const PAGE_SIZE = 20;

const smallButton =
  "px-3 py-1.5 border font-extrabold text-[10.5px] tracking-wider uppercase whitespace-nowrap transition-colors disabled:opacity-50";
const selectClass =
  "px-3 py-2.5 bg-white border border-[#1A1A1A] text-xs font-bold tracking-wider uppercase outline-none focus:border-[#E8491D]";
const emptyClass =
  "text-sm font-semibold uppercase tracking-wide py-10 text-center text-[#8A8578]";

function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total } = pagination;
  return (
    <div className="flex items-center justify-between gap-4 pt-5 text-xs font-bold uppercase tracking-wider">
      <span className="text-[#8A8578]">
        Page {page} / {totalPages} · {total} total
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className={`${smallButton} border-[#1A1A1A] hover:bg-white`}
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          className={`${smallButton} border-[#1A1A1A] hover:bg-white`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function UsersTab() {
  const currentUser = useUserStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "", role: "", page: 1 });
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const params = { page: filters.page, limit: PAGE_SIZE };
        if (filters.search) params.search = filters.search;
        if (filters.role) params.role = filters.role;
        const resp = await mainApi.get("/admin/users", { params });
        setUsers(resp.data.data);
        setPagination(resp.data.pagination);
      } catch (err) {
        console.error(err);
        toast.error(getErrorMessage(err, "โหลดรายชื่อผู้ใช้ไม่สำเร็จ"));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [filters, reloadKey]);

  const changeRole = async (user) => {
    const role = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (!window.confirm(`เปลี่ยน ${user.username} เป็น ${role} ใช่ไหม?`)) return;
    setBusyId(user.id);
    try {
      await mainApi.patch(`/admin/users/${user.id}`, { role });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role } : u)),
      );
      toast.success(`${user.username} is now ${role}`);
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "เปลี่ยนสิทธิ์ไม่สำเร็จ"));
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (user) => {
    if (
      !window.confirm(
        `ลบผู้ใช้ ${user.username} ใช่ไหม? อีเวนต์และการจองทั้งหมดของเขาจะถูกลบด้วย`,
      )
    )
      return;
    setBusyId(user.id);
    try {
      await mainApi.delete(`/admin/users/${user.id}`);
      toast.success("User deleted");
      setReloadKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "ลบผู้ใช้ไม่สำเร็จ"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFilters((f) => ({ ...f, search: searchInput.trim(), page: 1 }));
        }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="flex flex-1 max-w-md">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="SEARCH USERNAME OR EMAIL..."
            className="flex-1 min-w-0 bg-white px-4 py-2.5 text-xs tracking-wider uppercase outline-none placeholder:text-gray-400 border border-[#1A1A1A] border-r-0"
          />
          <button
            type="submit"
            className="px-4 bg-[#1A1A1A] text-[#F4F1EA] border border-[#1A1A1A] text-xs font-extrabold tracking-wider uppercase"
          >
            Search
          </button>
        </div>
        <select
          value={filters.role}
          onChange={(e) =>
            setFilters((f) => ({ ...f, role: e.target.value, page: 1 }))
          }
          className={selectClass}
        >
          <option value="">All roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </form>

      {/* หัวตาราง — แสดงเฉพาะจอ md ขึ้นไป */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 pb-2 text-[10px] font-bold tracking-widest uppercase text-[#8A8578]">
        <span>User</span>
        <span>Role</span>
        <span>Activity</span>
        <span>Joined</span>
        <span className="w-[200px]" />
      </div>

      {loading ? (
        <p className={emptyClass}>Loading users...</p>
      ) : users.length === 0 ? (
        <p className={emptyClass}>No users found.</p>
      ) : (
        <ul className="border border-[#1A1A1A] bg-white divide-y divide-[#1A1A1A]">
          {users.map((user) => {
            const isSelf = user.id === currentUser?.id;
            return (
              <li
                key={user.id}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 md:items-center px-4 py-4"
              >
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">
                    {user.username}
                    {isSelf && (
                      <span className="text-[#8A8578] font-semibold">
                        {" "}
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#8A8578] truncate">
                    {user.email}
                  </p>
                </div>
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide border px-2 py-0.5 ${
                      user.role === "ADMIN"
                        ? "bg-[#E8491D] text-white border-[#E8491D]"
                        : "bg-white text-[#1A1A1A] border-[#1A1A1A]"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#4a463c]">
                  {user._count.events} events · {user._count.bookings} bookings
                </p>
                <p className="text-xs font-semibold text-[#4a463c]">
                  <span className="md:hidden text-[#8A8578]">Joined </span>
                  {formatDate(user.createdAt)}
                </p>
                <div className="flex gap-2 md:w-[200px] md:justify-end">
                  {!isSelf && (
                    <>
                      <button
                        type="button"
                        onClick={() => changeRole(user)}
                        disabled={busyId === user.id}
                        className={`${smallButton} border-[#1A1A1A] hover:bg-[#F4F1EA]`}
                      >
                        {user.role === "ADMIN" ? "Make User" : "Make Admin"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(user)}
                        disabled={busyId === user.id}
                        className={`${smallButton} border-[#E8491D] text-[#E8491D] hover:bg-[#E8491D] hover:text-white`}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Pagination
        pagination={pagination}
        onPage={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  );
}

function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", page: 1 });
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const params = { page: filters.page, limit: PAGE_SIZE };
        if (filters.status) params.status = filters.status;
        const resp = await mainApi.get("/admin/bookings", { params });
        setBookings(resp.data.data);
        setPagination(resp.data.pagination);
      } catch (err) {
        console.error(err);
        toast.error(getErrorMessage(err, "โหลดการจองไม่สำเร็จ"));
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [filters]);

  const updateStatus = async (booking, status) => {
    setBusyId(booking.id);
    try {
      await mainApi.patch(`/bookings/${booking.id}`, { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, status } : b)),
      );
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "อัปเดตการจองไม่สำเร็จ"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value, page: 1 })}
          className={selectClass}
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="hidden md:grid grid-cols-[1.5fr_2fr_1fr_1fr_auto] gap-4 px-4 pb-2 text-[10px] font-bold tracking-widest uppercase text-[#8A8578]">
        <span>Attendee</span>
        <span>Event</span>
        <span>Booked</span>
        <span>Status</span>
        <span className="w-[200px]" />
      </div>

      {loading ? (
        <p className={emptyClass}>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className={emptyClass}>No bookings found.</p>
      ) : (
        <ul className="border border-[#1A1A1A] bg-white divide-y divide-[#1A1A1A]">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1fr_1fr_auto] gap-2 md:gap-4 md:items-center px-4 py-4"
            >
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">
                  {booking.user.username}
                </p>
                <p className="text-xs text-[#8A8578] truncate">
                  {booking.user.email}
                </p>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm uppercase truncate">
                  {booking.event.title}
                </p>
                <p className="text-xs text-[#8A8578]">
                  {formatDate(booking.event.eventDate, true)}
                </p>
              </div>
              <p className="text-xs font-semibold text-[#4a463c]">
                <span className="md:hidden text-[#8A8578]">Booked </span>
                {formatDate(booking.bookedAt)}
              </p>
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide border px-2 py-0.5 ${bookingStatusClass[booking.status]}`}
                >
                  {bookingStatusLabel[booking.status]}
                </span>
              </div>
              <div className="flex gap-2 md:w-[200px] md:justify-end">
                {booking.status === "PENDING" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(booking, "CONFIRMED")}
                    disabled={busyId === booking.id}
                    className={`${smallButton} border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#E8491D] hover:border-[#E8491D]`}
                  >
                    Confirm
                  </button>
                )}
                {booking.status !== "CANCELLED" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(booking, "CANCELLED")}
                    disabled={busyId === booking.id}
                    className={`${smallButton} border-[#E8491D] text-[#E8491D] hover:bg-[#E8491D] hover:text-white`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        pagination={pagination}
        onPage={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  );
}

function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await mainApi.get("/admin/categories");
        setCategories(resp.data.data);
      } catch (err) {
        console.error(err);
        toast.error(getErrorMessage(err, "โหลดหมวดหมู่ไม่สำเร็จ"));
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [reloadKey]);

  // โหลดรายการในแท็บนี้ใหม่ + ล้าง cache ของ useCategories ให้หน้าอื่นเห็นรายการล่าสุด
  const refresh = async () => {
    setReloadKey((k) => k + 1);
    await invalidateCategories();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const resp = await mainApi.post("/admin/categories", { name: newName });
      toast.success(`Added ${resp.data.data.name}`);
      setNewName("");
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "เพิ่มหมวดหมู่ไม่สำเร็จ"));
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const handleRename = async (category) => {
    if (!editName.trim() || editName.trim().toUpperCase() === category.name) {
      setEditingId(null);
      return;
    }
    setBusyId(category.id);
    try {
      const resp = await mainApi.patch(`/admin/categories/${category.id}`, {
        name: editName,
      });
      toast.success(`Renamed to ${resp.data.data.name}`);
      setEditingId(null);
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "แก้ชื่อหมวดหมู่ไม่สำเร็จ"));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`ลบหมวด ${category.name} ใช่ไหม?`)) return;
    setBusyId(category.id);
    try {
      await mainApi.delete(`/admin/categories/${category.id}`);
      toast.success(`Deleted ${category.name}`);
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "ลบหมวดหมู่ไม่สำเร็จ"));
    } finally {
      setBusyId(null);
    }
  };

  const inputClass =
    "flex-1 min-w-0 bg-white px-4 py-2.5 text-xs font-bold tracking-wider uppercase outline-none placeholder:text-gray-400 border border-[#1A1A1A] focus:border-[#E8491D]";

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleAdd} className="flex mb-6 max-w-md">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="NEW CATEGORY NAME..."
          maxLength={50}
          className={`${inputClass} border-r-0`}
        />
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="px-5 bg-[#E8491D] text-white border border-[#E8491D] text-xs font-extrabold tracking-wider uppercase whitespace-nowrap hover:bg-[#c73e17] transition-colors disabled:opacity-50"
        >
          {adding ? "Adding..." : "+ Add"}
        </button>
      </form>

      {loading ? (
        <p className={emptyClass}>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className={emptyClass}>No categories yet.</p>
      ) : (
        <ul className="border border-[#1A1A1A] bg-white divide-y divide-[#1A1A1A]">
          {categories.map((category) => {
            const eventCount = category._count?.events ?? 0;
            const isEditing = editingId === category.id;
            const busy = busyId === category.id;
            return (
              <li
                key={category.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4"
              >
                {isEditing ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleRename(category);
                    }}
                    className="flex flex-1 gap-2"
                  >
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && setEditingId(null)}
                      maxLength={50}
                      autoFocus
                      className={inputClass}
                    />
                    <button
                      type="submit"
                      disabled={busy}
                      className={`${smallButton} border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#E8491D] hover:border-[#E8491D]`}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className={`${smallButton} border-[#1A1A1A] hover:bg-[#F4F1EA]`}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm uppercase tracking-wide truncate">
                        {category.name}
                      </p>
                      <p className="text-xs text-[#8A8578]">
                        {eventCount} {eventCount === 1 ? "event" : "events"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        disabled={busy}
                        className={`${smallButton} border-[#1A1A1A] hover:bg-[#F4F1EA]`}
                      >
                        Rename
                      </button>
                      {/* หมวดที่ยังมี event ใช้อยู่ลบไม่ได้ (API ตอบ 409) */}
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        disabled={busy || eventCount > 0}
                        title={
                          eventCount > 0
                            ? "Move its events to another category first"
                            : undefined
                        }
                        className={`${smallButton} border-[#E8491D] text-[#E8491D] hover:bg-[#E8491D] hover:text-white disabled:hover:bg-transparent disabled:hover:text-[#E8491D]`}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-[11px] leading-5 text-[#8A8578] mt-4">
        Renaming a category also updates every event that uses it. A category
        can only be deleted when no events use it.
      </p>
    </div>
  );
}

const tabs = [
  { key: "users", label: "Users" },
  { key: "bookings", label: "Bookings" },
  { key: "categories", label: "Categories" },
];

function Admin() {
  const user = useUserStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = tabs.some((t) => t.key === searchParams.get("tab"))
    ? searchParams.get("tab")
    : "users";

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="flex-1 w-full text-[#1A1A1A]">
      <PageHeader
        title="Admin"
        subtitle="Manage every user and booking across the platform."
      />

      <div className="px-6 sm:px-8 lg:px-10 xl:px-14 pb-16">
        <div className="flex gap-6 sm:gap-8 text-sm font-extrabold tracking-wider uppercase pt-6 sm:pt-8 pb-5 sm:pb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSearchParams({ tab: tab.key })}
              className={`pb-1 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#E8491D] text-[#1A1A1A]"
                  : "border-transparent text-[#8A8578] hover:text-[#1A1A1A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "users" && <UsersTab />}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "categories" && <CategoriesTab />}
      </div>
    </main>
  );
}

export default Admin;
