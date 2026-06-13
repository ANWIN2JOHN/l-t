import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AuthListener from "@/features/auth/components/AuthListener";
import { authService } from "@/features/auth/services/authService";

const queryClient = new QueryClient();
import {
  Search,
  FolderOpen,
  BookOpen,
  ChevronRight,
  CheckSquare,
  Settings,
  LogOut,
  CheckCircle,
  Calendar,
  MapPin,
  Filter,
  AlertCircle,
  AlertTriangle,
  Upload,
  Building2,
  ArrowUp,
  Recycle,
  Clock,
  User,
  Zap,
} from "lucide-react";
import LandingPage from "./components/LandingPage";
import { CardNameTooltip } from "./components/CardNameTooltip";
import LoginPage from "./components/LoginPage";
import RoleSelectionPage from "./components/RoleSelectionPage";
import StudentLoginPage from "./components/StudentLoginPage";
import { useCreateFoundItem } from "@/features/foundItems/hooks/useFoundItems";

import StudentDashboard from "./components/StudentDashboard";
import headerLogo from "../imports/WhatsApp_Image_2026-06-01_at_11.03.14_AM-2.jpeg";
import { usePublicFoundItems } from "@/features/foundItems/hooks/useFoundItems";
import PendingApprovalsPage from "./components/PendingApprovalsPage";
import AdminLostItemsPage from "./components/AdminLostItemsPage";
import AdminFoundItemsPage from "./components/AdminFoundItemsPage";
import AdminMatchesPage from "@/features/matching/pages/AdminMatchesPage";


// ─── Scroll To Top ─────────────────────────────────────────────────────────

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center justify-center"
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}

const categories = [
  { name: "Bags & Backpacks", icon: "🎒", count: 24 },
  { name: "Water Bottles", icon: "🍶", count: 18 },
  { name: "Electronics", icon: "💻", count: 31 },
  { name: "Books & Notebooks", icon: "📚", count: 15 },
  { name: "Keys & Keychains", icon: "🔑", count: 22 },
  { name: "Accessories", icon: "⌚", count: 19 },
  { name: "Eyewear", icon: "🕶️", count: 11 },
  { name: "Others", icon: "📦", count: 8 },
];





const collectFromOptions = ["Admin Reception", "Main Reception", "Humanities Reception"];

export type ReturnedLostRecord = {
  id: number;
  name: string;
  reportedDate: string;
  closedDate: string;
  studentName: string;
  rollNo: string;
  location: string;
  reporter: string;
  reporterPhone: string;
  reporterEmail: string;
};

export type DisposedRecord = {
  id: number;
  name: string;
  type: "Lost" | "Found";
  reportedDate: string;
  location: string;
  reporter: string;
  reporterPhone: string;
  reporterEmail: string;
  disposalLocation: string;
  donatedTo: string;
  disposedDate: string;
  notes: string;
};


// ─── Upload Page (Admin) ───────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-gray-700 text-xs font-medium block mb-1.5" style={{ fontFamily: "DM Sans, sans-serif" }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}


function UploadPage({ onBack }: { onBack: () => void }) {
  const [contactType, setContactType] = useState<"student" | "staff">("student");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "", location: "", date: "", collectFrom: "", description: "", image: "",
    studentName: "", rollNo: "", phone: "", email: "",
    staffName: "", employeeId: "", department: "", staffPhone: "", staffEmail: "",
  });

  const isStudent = contactType === "student";
  const accent = "#10b981";
  const btnClass = "bg-emerald-500 hover:bg-emerald-600 text-white";

  const inputCls = "w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all";

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const { mutate: createFoundItem, isPending } = useCreateFoundItem();

  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    
    // Concatenate extra fields into the description
    const reporterInfo = isStudent 
      ? `\n\nReported by Student: ${form.studentName} (Roll: ${form.rollNo}, Email: ${form.email}, Phone: ${form.phone})`
      : `\n\nReported by Staff: ${form.staffName} (ID: ${form.employeeId}, Dept: ${form.department}, Email: ${form.staffEmail}, Phone: ${form.staffPhone})`;

    createFoundItem(
      {
        title: form.name,
        category: form.category,
        description: form.description + reporterInfo,
        location_found: form.location,
        date_found: form.date,
        collectFrom: form.collectFrom,
      },
      {
        onSuccess: () => setSubmitted(true),
      }
    );
  };

  const contactName = isStudent ? form.studentName : form.staffName;
  const contactEmail = isStudent ? form.email : form.staffEmail;

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-emerald-100">
            <CheckCircle size={32} style={{ color: accent }} />
          </div>
          <h2 className="text-gray-900 text-xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            Item Reported Successfully!
          </h2>
          <p className="text-gray-600 text-sm mb-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
            <span className="font-semibold text-gray-900">{form.name || "The item"}</span> has been added to the system.
          </p>
          {contactName && (
            <p className="text-gray-600 text-sm mb-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Contact on file: <span className="font-semibold text-gray-900">{contactEmail}</span>.
            </p>
          )}
          {form.collectFrom && (
            <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Students can collect it from <span className="font-semibold text-gray-900">{form.collectFrom}</span>.
            </p>
          )}
          <button
            onClick={onBack}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${btnClass}`}
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Form header strip */}
          <div className="px-6 py-5 border-b border-gray-200">
            <p className="text-gray-900 font-semibold text-base mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Report Found Item</p>
            <p className="text-gray-400 text-[11px] mt-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Fill in the details below. All fields marked * are required.
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Item Name */}
            <Field label="Item Name" required>
              <input
                required
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Blue Nike Backpack"
                className={inputCls}
                style={{ fontFamily: "DM Sans, sans-serif" }}
              />
            </Field>

            {/* Category */}
            <Field label="Category" required>
              <select
                required
                value={form.category}
                onChange={set("category")}
                className={inputCls + " appearance-none"}
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                <option value="" disabled className="bg-white">Select a category</option>
                <option value="Bags & Backpacks" className="bg-white">Bags & Backpacks</option>
                <option value="Water Bottles" className="bg-white">Water Bottles</option>
                <option value="Electronics" className="bg-white">Electronics</option>
                <option value="Books & Notebooks" className="bg-white">Books & Notebooks</option>
                <option value="Keys & Keychains" className="bg-white">Keys & Keychains</option>
                <option value="Accessories" className="bg-white">Accessories</option>
                <option value="Eyewear" className="bg-white">Eyewear</option>
                <option value="Clothing" className="bg-white">Clothing</option>
                <option value="ID Cards & Documents" className="bg-white">ID Cards & Documents</option>
                <option value="Sports Equipment" className="bg-white">Sports Equipment</option>
                <option value="Wallets & Purses" className="bg-white">Wallets & Purses</option>
                <option value="Umbrellas" className="bg-white">Umbrellas</option>
              </select>
            </Field>

            {/* Location + Date row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Location Found" required>
                <input
                  required
                  value={form.location}
                  onChange={set("location")}
                  placeholder="e.g. Main Cafeteria"
                  className={inputCls}
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
              </Field>
              <Field label="Date Found" required>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={set("date")}
                  max={new Date().toISOString().split("T")[0]}
                  className={inputCls}
                  style={{ colorScheme: "light", fontFamily: "DM Sans, sans-serif" }}
                />
              </Field>
            </div>

            {/* Collect From */}
            <Field label="Where to Receive From" required>
              <select
                required
                value={form.collectFrom}
                onChange={set("collectFrom")}
                className={inputCls + " appearance-none"}
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                <option value="" disabled className="bg-white">Select reception/office</option>
                {collectFromOptions.map((o) => <option key={o} value={o} className="bg-white">{o}</option>)}
              </select>
            </Field>

            {/* Description */}
            <Field label="Description" required>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={set("description")}
                placeholder="Describe the item clearly — colour, size, any distinguishing marks, contents if applicable..."
                className={inputCls + " resize-none"}
                style={{ fontFamily: "DM Sans, sans-serif" }}
              />
            </Field>

            {/* ── Contact Type Switcher ─────────────────────── */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-gray-900 font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
                    Contact Details
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    Reporter contact information
                  </p>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 mt-3">
                <button
                  type="button"
                  onClick={() => setContactType("student")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isStudent ? "bg-cyan-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Student Contact Details
                </button>
                <button
                  type="button"
                  onClick={() => setContactType("staff")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    !isStudent ? "bg-cyan-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  Staff Contact Details
                </button>
              </div>
            </div>

            {/* Student Contact Fields */}
            <div
              style={{
                display: isStudent ? "block" : "none",
                transition: "opacity 0.2s ease",
                opacity: isStudent ? 1 : 0,
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Student Name" required={isStudent}>
                  <input
                    required={isStudent}
                    value={form.studentName}
                    onChange={set("studentName")}
                    placeholder="Enter full name"
                    className={inputCls}
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </Field>
                <Field label="Roll Number" required={isStudent}>
                  <input
                    required={isStudent}
                    value={form.rollNo}
                    onChange={set("rollNo")}
                    placeholder="e.g. STU-2024-001"
                    className={inputCls}
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Field label="Phone Number" required={isStudent}>
                  <input
                    required={isStudent}
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="Enter phone number"
                    className={inputCls}
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </Field>
                <Field label="Email Address" required={isStudent}>
                  <input
                    required={isStudent}
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="Enter email address"
                    className={inputCls}
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </Field>
              </div>
            </div>

            {/* Staff Contact Fields */}
            <div
              style={{
                display: !isStudent ? "block" : "none",
                transition: "opacity 0.2s ease",
                opacity: !isStudent ? 1 : 0,
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Staff Name" required={!isStudent}>
                  <input
                    required={!isStudent}
                    value={form.staffName}
                    onChange={set("staffName")}
                    placeholder="Enter full name"
                    className={inputCls}
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </Field>
                <Field label="Employee ID" required={!isStudent}>
                  <input
                    required={!isStudent}
                    value={form.employeeId}
                    onChange={set("employeeId")}
                    placeholder="e.g. EMP-2024-001"
                    className={inputCls}
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Department" required={!isStudent}>
                  <input
                    required={!isStudent}
                    value={form.department}
                    onChange={set("department")}
                    placeholder="e.g. Engineering, Admin, Library…"
                    className={inputCls}
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Field label="Phone Number" required={!isStudent}>
                  <input
                    required={!isStudent}
                    type="tel"
                    value={form.staffPhone}
                    onChange={set("staffPhone")}
                    placeholder="Enter phone number"
                    className={inputCls}
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </Field>
                <Field label="Email Address" required={!isStudent}>
                  <input
                    required={!isStudent}
                    type="email"
                    value={form.staffEmail}
                    onChange={set("staffEmail")}
                    placeholder="Enter email address"
                    className={inputCls}
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </Field>
              </div>
            </div>

            {/* Info notice */}
          </div>

          {/* Footer buttons */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-all"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                isPending ? "bg-gray-400 cursor-not-allowed" : btnClass
              }`}
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              {isPending ? "Submitting..." : (
                <>
                  <Upload size={14} />
                  Report Found Item
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Public Browse View ────────────────────────────────────────────────────

function PublicBrowseView({ type, onBack, onStudentLogin }: { type: "lost" | "found"; onBack: () => void; onStudentLogin: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full px-6 py-4 flex items-center justify-between border-b-2 border-cyan-200 bg-gradient-to-r from-cyan-50/30 via-white to-cyan-50/30 shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <img src={headerLogo} alt="Campus Logo" className="h-8 object-contain" />
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-cyan-600 font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Campus Lost and Found</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-all text-sm hover:bg-cyan-50 px-3 py-2 rounded-lg border border-transparent hover:border-cyan-200 hover:shadow-md"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >

            Back to Home
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Student Signup/Login Call-to-Action Banner */}
        <div className="mb-6 relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 p-4 shadow-md border border-cyan-500">
          {/* Content */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-white text-base md:text-lg font-bold mb-1 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                Can't find your item? Report it now
              </h2>
              <p className="text-white/90 text-xs md:text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Create a lost item report and get notified when it's found
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onStudentLogin}
                className="group px-4 py-2 rounded-lg bg-white text-cyan-600 font-semibold text-xs hover:shadow-md transition-all flex items-center gap-1.5"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                <User size={14} />
                Login
                <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

            </div>
          </div>
        </div>

        <CombinedItemsPage initialFilter={type} />
      </div>
      <ScrollToTopButton />
    </div>
  );
}

// FIXED CombinedItemsPage function for src/app/App.tsx


const BROWSE_PAGE_SIZE = 6;

function CombinedItemsPage({ initialFilter: _initialFilter = "all" }: { initialFilter?: "all" | "lost" | "found" }) {
  const [searchTerm, setSearchTerm]             = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [countdownFilter, setCountdownFilter]   = useState("");
  const [locationFilter, setLocationFilter]     = useState("");
  const [dateFrom, setDateFrom]                 = useState("");
  const [dateTo, setDateTo]                     = useState("");
  const [currentPage, setCurrentPage]           = useState(1);
  const [showFilters, setShowFilters]           = useState(false);

  // ✅ FIX: Fetch found items from Supabase via hook
  const { data: foundItemsData = [], isLoading, error } = usePublicFoundItems();

  console.log("[CombinedItemsPage] Found items data:", foundItemsData);
  console.log("[CombinedItemsPage] Is loading:", isLoading);
  console.log("[CombinedItemsPage] Error:", error);

  // Map Supabase found_items to expected format
  const foundOnly = (foundItemsData || []).map((item: any) => ({
    id: item.id,
    itemId: item.id,
    name: item.title,
    date: item.date_found,
    location: item.location_found,
    collectFrom: item.reception?.name || "Admin Reception", // Join with receptions table if available
    image: "", // Add image field if implemented later
    category: item.category,
  }));

  console.log("[CombinedItemsPage] Mapped found items:", foundOnly);

  const filtered = foundOnly.filter(item => {
    const matchesSearch   = !searchTerm;
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesCountdown = !countdownFilter || getDaysInfo(item.date).countdownStatus === countdownFilter;
    const matchesLocation = !locationFilter || item.location.toLowerCase().includes(locationFilter.toLowerCase());
    const itemDate = parseDateForCountdown(item.date);
    const matchesDateFrom = !dateFrom || itemDate >= new Date(dateFrom);
    const matchesDateTo   = !dateTo   || itemDate <= new Date(dateTo);
    return matchesSearch && matchesCategory && matchesCountdown && matchesLocation && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / BROWSE_PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * BROWSE_PAGE_SIZE, safePage * BROWSE_PAGE_SIZE);

  const applySearch    = (v: string) => { setSearchTerm(v);       setCurrentPage(1); };
  const applyCategory  = (v: string) => { setSelectedCategory(v); setCurrentPage(1); };
  const applyCountdown = (v: string) => { setCountdownFilter(v);  setCurrentPage(1); };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const hasActiveFilters = selectedCategory || countdownFilter || locationFilter || dateFrom || dateTo;

  const clearAllFilters = () => {
    setSelectedCategory("");
    setCountdownFilter("");
    setLocationFilter("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div>
        <h1
          className="text-2xl text-gray-900"
          style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Campus Found Items
        </h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Browse all found items available for collection across campus.
        </p>
      </div>

      {/* ── Search & Filter Bar ─────────────────────────────── */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-4">
        {/* Search Bar and Filter Button */}
        <div className="flex gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by item name or description…"
              value={searchTerm}
              onChange={e => applySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/15 transition-all"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              showFilters || hasActiveFilters
                ? "bg-[#0891B2] text-white shadow-md"
                : "bg-[#F5F7FA] text-gray-700 hover:bg-gray-200 border border-[#E5E7EB]"
            }`}
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && !showFilters && (
              <span className="w-2 h-2 bg-white rounded-full"></span>
            )}
          </button>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Location
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter by location…"
                    value={locationFilter}
                    onChange={e => { setLocationFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/15 transition-all"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => applyCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/15 transition-all appearance-none"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Date From
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/15 transition-all"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </div>
              </div>

              {/* Date To */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Date To
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/15 transition-all"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </div>
              </div>

              {/* Claim Status */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Claim Status
                </label>
                <select
                  value={countdownFilter}
                  onChange={e => applyCountdown(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/15 transition-all appearance-none"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <option value="">All Claim Status</option>
                  <option value="active">🟢 Active (31–60 days)</option>
                  <option value="expiring">🟡 Expiring Soon (11–30 days)</option>
                  <option value="last10">🔴 Last 10 Days</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={clearAllFilters}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-all"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0891B2] hover:bg-[#0e7490] text-white text-sm font-semibold transition-all"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-400" style={{ fontFamily: "DM Sans, sans-serif" }}>
            <span className="font-semibold text-gray-600">{filtered.length}</span> item{filtered.length !== 1 ? "s" : ""} found
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#0891B2] hover:underline font-medium"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* ── Loading State ───────────────────────────────────── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border-[#E5E7EB] rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0891B2]"></div>
          <p className="text-gray-500 text-sm font-medium mt-4" style={{ fontFamily: "DM Sans, sans-serif" }}>Loading found items...</p>
        </div>
      )}

      {/* ── Error State ─────────────────────────────────────── */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-red-200 rounded-2xl">
          <AlertCircle size={40} className="text-red-400 mb-3" />
          <p className="text-red-600 text-sm font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>Failed to load items</p>
          <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "DM Sans, sans-serif" }}>{error.message}</p>
        </div>
      )}

      {/* ── Cards Grid ──────────────────────────────────────── */}
      {!isLoading && !error && pageItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E5E7EB] rounded-2xl">
          <FolderOpen size={40} className="text-gray-200 mb-3" />
          <p className="text-gray-500 text-sm font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>No items match your search</p>
          <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: "DM Sans, sans-serif" }}>Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pageItems.map(item => (
            <div
              key={`found-${item.id}`}
              className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden cursor-pointer transition-all duration-250 hover:shadow-xl hover:-translate-y-1.5 hover:border-transparent"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              {/* Card body */}
              <div className={`p-4 ${getDaysInfo(item.date).isExpired ? "opacity-70" : ""}`}>
                <div className="mb-2">
                  <CardNameTooltip
                    name={item.name}
                    className="text-gray-900 text-sm leading-snug"
                    style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5 font-mono tracking-wide">
                    {(() => {
                      const numericId = parseInt(String(item.itemId).replace(/\D/g, ''));
                      return !isNaN(numericId) ? `KJF26${String(numericId).padStart(2, '0')}` : item.itemId;
                    })()}
                  </p>
                </div>

                {/* Meta rows */}
                <div className="space-y-1.5 pt-3 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <MapPin size={11} className="text-gray-400 shrink-0" />
                    <span className="text-[11px] text-gray-600 truncate" style={{ fontFamily: "DM Sans, sans-serif" }}>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={11} className="text-gray-400 shrink-0" />
                    <span className="text-[11px] text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={11} className="shrink-0 text-emerald-500" />
                    <span className="text-[11px] font-semibold truncate text-emerald-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {item.collectFrom}
                    </span>
                  </div>
                </div>

                {/* 60-day countdown */}
                <ClaimCountdownBar dateStr={item.date} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ──────────────────────────────────────── */}
      {!isLoading && !error && filtered.length > BROWSE_PAGE_SIZE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E5E7EB]">
          <p className="text-xs text-gray-400 order-2 sm:order-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filtered.length === 0 ? 0 : (safePage - 1) * BROWSE_PAGE_SIZE + 1}
            </span>
            {" – "}
            <span className="font-semibold text-gray-700">{Math.min(safePage * BROWSE_PAGE_SIZE, filtered.length)}</span>
            {" of "}
            <span className="font-semibold text-gray-700">{filtered.length}</span> items
          </p>

          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-gray-600 hover:bg-[#0891B2] hover:text-white hover:border-[#0891B2] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              ← Previous
            </button>

            {pageNumbers.map(n => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-9 h-9 rounded-xl border text-xs font-bold transition-all duration-150 shadow-sm ${
                  safePage === n
                    ? "bg-[#0891B2] border-[#0891B2] text-white shadow-md"
                    : "border-[#E5E7EB] bg-white text-gray-600 hover:bg-[#0891B2] hover:text-white hover:border-[#0891B2]"
                }`}
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-gray-600 hover:bg-[#0891B2] hover:text-white hover:border-[#0891B2] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}


// ─── Logout Confirm Modal ──────────────────────────────────────────────────

function LogoutModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        transition: "background 0.25s, backdrop-filter 0.25s",
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
        background: visible ? "rgba(15,23,42,0.55)" : "rgba(15,23,42,0)",
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          transition: "opacity 0.25s, transform 0.25s",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.93)",
        }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 flex flex-col items-center text-center"
      >
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle size={26} className="text-red-500" />
        </div>

        {/* Title */}
        <h2
          className="text-gray-900 mb-2"
          style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 700 }}
        >
          Confirm Logout
        </h2>

        {/* Message */}
        <p
          className="text-gray-500 text-sm leading-relaxed mb-7"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Are you sure you want to logout from <span className="font-semibold text-gray-700">KJU Lost and Found</span>?
        </p>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 hover:border-gray-300 transition-all duration-150"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-700 text-white text-sm font-semibold hover:bg-red-800 active:bg-red-900 transition-all duration-150 shadow-sm"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── Item History Page ─────────────────────────────────────────────────────

function ItemHistoryPage() {
  return <div className="p-8 text-center text-gray-500">History records are currently empty.</div>;
}

// ─── Expired Items Page ────────────────────────────────────────────────────

function ExpiredItemsPage() {
  return <div className="p-8 text-center text-gray-500">No expired items found.</div>;
}

// ─── Admin View ────────────────────────────────────────────────────────────

function AdminSidebar({ active, setActive, onLogoutRequest }: { active: string; setActive: (s: string) => void; onLogoutRequest: () => void }) {
  const menuItems = [
  { id: "pending-approvals", icon: <Clock size={16} />, label: "Pending Approvals" },
  { id: "lost-items", icon: <AlertCircle size={16} />, label: "Lost Items" },
  { id: "found-items", icon: <CheckSquare size={16} />, label: "Found Items" },

  // NEW
  { id: "matches", icon: <Zap size={16} />, label: "Intelligent Matching" },

  { id: "expired-items", icon: <Recycle size={16} />, label: "Expired Items" },
  { id: "upload-item", icon: <Upload size={16} />, label: "Report Item" },
  { id: "history", icon: <BookOpen size={16} />, label: "Disposed & Returned History" },
  { id: "guidelines", icon: <BookOpen size={16} />, label: "Guidelines" },
  { id: "settings", icon: <Settings size={16} />, label: "Settings" },
];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen shrink-0">
      <div className="px-5 py-5 border-b-2 border-cyan-200 bg-gradient-to-b from-cyan-50/40 to-white shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="h-8 object-contain drop-shadow-md text-cyan-600 font-bold">KJU</div>
        </div>
        <div className="flex items-center gap-2.5 justify-center">
          <div className="text-center px-4 py-2 rounded-lg bg-white/60 border border-cyan-100 shadow-sm">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-cyan-600 font-semibold text-base leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Admin Portal
            </p>
            <p className="text-cyan-600 text-xs leading-tight text-center">Lost & Found</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
              active === item.id
                ? "bg-cyan-500 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-3">
          <p className="text-gray-900 font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
            Admin User
          </p>
          <p className="text-gray-500 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
            admin@kristujayanti.com
          </p>
        </div>
        <button
          onClick={onLogoutRequest}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
}



// ─── 60-Day Countdown Helpers ─────────────────────────────────────────────

function parseDateForCountdown(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11
  };
  const parts = dateStr.trim().split(" ");
  return new Date(Number(parts[2]), months[parts[1]], Number(parts[0]));
}

function getDaysInfo(dateStr: string) {
  const reported = parseDateForCountdown(dateStr);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysElapsed = Math.max(0, Math.floor((today.getTime() - reported.getTime()) / 86400000));
  const daysRemaining = Math.max(0, 60 - daysElapsed);
  const isExpired = daysElapsed >= 60;
  let countdownStatus: "active" | "expiring" | "last10" | "expired";
  if (isExpired) countdownStatus = "expired";
  else if (daysRemaining <= 10) countdownStatus = "last10";
  else if (daysRemaining <= 30) countdownStatus = "expiring";
  else countdownStatus = "active";
  return { daysRemaining, daysElapsed, isExpired, countdownStatus };
}

function ClaimCountdownBar({ dateStr }: { dateStr: string }) {
  const daysInfo = getDaysInfo(dateStr);

  // Safety fallback
  const daysRemaining = Number.isFinite(daysInfo.daysRemaining)
    ? daysInfo.daysRemaining
    : 0;

  const daysElapsed = Number.isFinite(daysInfo.daysElapsed)
    ? daysInfo.daysElapsed
    : 60;

  const isExpired = daysInfo.isExpired;
  const countdownStatus = daysInfo.countdownStatus;

  const barColor = isExpired
    ? "#9ca3af"
    : countdownStatus === "last10"
    ? "#ef4444"
    : countdownStatus === "expiring"
    ? "#f59e0b"
    : "#22c55e";

  const pct = Math.max(
    0,
    Math.min(100, (daysElapsed / 60) * 100)
  );

  const badge = isExpired
    ? {
        label: "Expired",
        bg: "bg-gray-100",
        text: "text-gray-500",
        dot: "bg-gray-400",
      }
    : countdownStatus === "last10"
    ? {
        label: "Last 10 Days",
        bg: "bg-red-50",
        text: "text-red-600",
        dot: "bg-red-500",
      }
    : countdownStatus === "expiring"
    ? {
        label: "Expiring Soon",
        bg: "bg-amber-50",
        text: "text-amber-600",
        dot: "bg-amber-400",
      }
    : {
        label: "Active",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        dot: "bg-emerald-400",
      };

  return (
    <div
      className={`mt-3 pt-3 border-t border-gray-100 ${
        isExpired ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Claim Period
        </span>

        <span
          className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: barColor,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <p
        className="text-[10px] text-gray-400"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        {isExpired
          ? "60-Day Limit Reached · Eligible for University Disposal Policy"
          : `${daysRemaining} / 60 Days Remaining`}
      </p>
    </div>
  );
}




function GuidelinesPage() {
  const [active, setActive] = useState<"lost" | "found">("lost");

  const lostRules = [
    "Verify student ID before releasing any item to ensure proper ownership.",
    "The claimant should correctly describe the item appearance, brand/model, and any special marks or accessories.",
    "For electronic items, students may be asked to unlock the device or verify ownership.",
    "Admin should verify matching details from the Lost Item report before returning the item.",
    "If ownership is unclear, the item should remain under admin review until verification is complete.",
    "Items unclaimed after 6 months will be donated or disposed of responsibly.",
  ];

  const foundRules = [
    "Food items, damaged items, or unsafe materials should not be accepted.",
    "Every found item must be entered into the system immediately after submission.",
    "Admin must collect complete details of the found item: item name, color/brand, location found, and date & time found.",
    "Ensure storage areas are locked and secure at all times.",
  ];

  const RuleList = ({ rules, accent }: { rules: string[]; accent: "cyan" | "amber" }) => (
    <div className="space-y-3">
      {rules.map((g, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${accent === "cyan" ? "bg-cyan-100" : "bg-amber-100"}`}>
            <CheckCircle size={14} className={accent === "cyan" ? "text-cyan-600" : "text-amber-600"} />
          </span>
          <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>{g}</p>
        </div>
      ))}
    </div>
  );

  return (
    <main className="flex-1 overflow-y-auto px-5 py-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Admin Guidelines</h1>
        <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: "DM Sans, sans-serif" }}>Essential protocols for managing lost and found items</p>

        {/* Toggle Switch */}
        <div className="inline-flex rounded-xl border border-gray-200 bg-white shadow-sm p-1 mb-6">
          <button
            onClick={() => setActive("lost")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              active === "lost"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            <AlertCircle size={14} />
            Lost Items Rules
          </button>
          <button
            onClick={() => setActive("found")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              active === "found"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            <CheckSquare size={14} />
            Found Items Rules
          </button>
        </div>

        {/* Active Panel */}
        {active === "lost" ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                <AlertCircle size={18} className="text-cyan-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "Outfit, sans-serif" }}>Lost Items Rules</h2>
                <p className="text-gray-500 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>Protocols for returning lost items to students</p>
              </div>
            </div>
            <RuleList rules={lostRules} accent="cyan" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <CheckSquare size={18} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "Outfit, sans-serif" }}>Found Items Rules</h2>
                <p className="text-gray-500 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>Protocols for accepting and storing found items</p>
              </div>
            </div>
            <RuleList rules={foundRules} accent="amber" />
          </div>
        )}
      </div>
    </main>
  );
}

function SettingsPage({ onLogoutRequest }: { onLogoutRequest: () => void }) {
  return (
    <main className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Settings</h1>
        <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: "DM Sans, sans-serif" }}>Manage your account and preferences</p>

        <div className="space-y-4">
          {/* Account Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Account</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900" style={{ fontFamily: "DM Sans, sans-serif" }}>Email</p>
                  <p className="text-xs text-gray-500">admin@campus.edu</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900" style={{ fontFamily: "DM Sans, sans-serif" }}>Role</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Session</h2>
            <button
              onClick={onLogoutRequest}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 font-medium text-sm transition-all duration-150 w-full justify-center border border-red-200"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminView({ onLogout }: { onLogout: () => void }) {
  const [activeNav, setActiveNav] = useState("lost-items");
  const [showLogoutModal, setShowLogoutModal] = useState(false);



  const handleNavChange = (page: string) => {
    setActiveNav(page);
  };

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);
  const confirmLogout = () => { setShowLogoutModal(false); onLogout(); };

  const renderMain = () => {
    if (activeNav === "pending-approvals") {
      return <PendingApprovalsPage />;
    }
    if (activeNav === "upload-item") {
      return <UploadPage onBack={() => setActiveNav("lost-items")} />;
    }
    if (activeNav === "lost-items") {
      return <AdminLostItemsPage />;
    }
    if (activeNav === "found-items") {
      return <AdminFoundItemsPage />;
    }
    if (activeNav === "matches") {
  return <AdminMatchesPage />;
    }
    if (activeNav === "expired-items") {
      return <ExpiredItemsPage />;
    }
    if (activeNav === "history") {
      return <ItemHistoryPage />;
    }
    if (activeNav === "guidelines") {
      return <GuidelinesPage />;
    }
    if (activeNav === "settings") {
      return <SettingsPage onLogoutRequest={openLogoutModal} />;
    }
    return <AdminLostItemsPage />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar active={activeNav} setActive={handleNavChange} onLogoutRequest={openLogoutModal} />
      <div className="flex-1 flex flex-col min-w-0">
        {renderMain()}
      </div>
      {showLogoutModal && (
        <LogoutModal onConfirm={confirmLogout} onClose={closeLogoutModal} />
      )}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────

function AppRoutes() {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const handleBrowseLost = () => navigate(ROUTES.BROWSE_LOST);
  const handleBrowseFound = () => navigate(ROUTES.BROWSE_FOUND);
  const handleAdminLogin = () => navigate(ROUTES.LOGIN);
  
  const handleRoleSelect = (role: "student" | "admin") => {
    if (role === "student") navigate(ROUTES.STUDENT_LOGIN);
    else navigate(ROUTES.LOGIN);
  };

  const handleBackToLanding = () => navigate(ROUTES.HOME);
  const handleNavigateToStudentLogin = () => navigate(ROUTES.STUDENT_LOGIN);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    navigate(ROUTES.HOME);
  };

  const studentData = profile ? {
    name: profile.full_name || user?.email?.split('@')[0] || "Student",
    email: user?.email || "",
  } : null;

  return (
    <Routes>
      <Route path={ROUTES.HOME} element={
        <LandingPage
          onBrowseLost={handleBrowseLost}
          onBrowseFound={handleBrowseFound}
          onAdminLogin={handleAdminLogin}
          onBrowseItems={handleBrowseFound}
        />
      } />

      <Route path={ROUTES.ROLE_SELECTION} element={
        <RoleSelectionPage onSelectRole={handleRoleSelect} onBack={handleBackToLanding} />
      } />

      <Route path={ROUTES.STUDENT_LOGIN} element={
        <StudentLoginPage onBack={handleBackToLanding} />
      } />



      <Route path={ROUTES.LOGIN} element={
        <LoginPage onBack={handleBackToLanding} />
      } />

      <Route path={ROUTES.BROWSE_LOST} element={
        <PublicBrowseView type="lost" onBack={handleBackToLanding} onStudentLogin={handleNavigateToStudentLogin} />
      } />

      <Route path={ROUTES.BROWSE_FOUND} element={
        <PublicBrowseView type="found" onBack={handleBackToLanding} onStudentLogin={handleNavigateToStudentLogin} />
      } />


      {/* Protected Routes */}
      <Route element={<ProtectedRoute requiredRole="student" />}>
        <Route path={ROUTES.STUDENT_DASHBOARD} element={
          studentData ? <StudentDashboard studentData={studentData} onLogout={handleLogout} /> : null
        } />
      </Route>

      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path={ROUTES.ADMIN_DASHBOARD} element={
          <AdminView onLogout={handleLogout} />
        } />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}



export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthListener>
          <AppRoutes />
        </AuthListener>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
