import { useState } from "react";
import { LogOut, Package, Plus, Calendar, MapPin, Clock, CheckCircle, XCircle, Bell, BellDot, Filter, X, Search, History } from "lucide-react";
import ReportLostItemForm from "./ReportLostItemForm";
import ConfirmModal from "./ConfirmModal";
import campusLogo from "../../imports/KJUSYS2-1.png";
import { useMyReports } from "@/features/lostReports/hooks/useLostReports";
import { useMyNotifications, useMarkAsRead, useMarkAllAsRead } from "@/features/notifications/hooks/useNotifications";
import { usePublicFoundItems } from "@/features/foundItems/hooks/useFoundItems";

interface StudentDashboardProps {
  studentData: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

interface Ticket {
  id: string;
  ticketId: string;
  itemName: string;
  category: string;
  description: string;
  location: string;
  dateLost: string;
  imageUrl?: string;
  status: "pending" | "approved" | "rejected" | "found" | "collected";
  createdAt: string;
  collectionLocation?: string;
  foundDate?: string;
  foundTime?: string;
  returnedDate?: string;
  returnedTime?: string;
}

interface Notification {
  id: string;
  type: string;
  itemName: string;
  ticketId: string;
  message: string;
  date: string;
  time: string;
  read: boolean;
  collectionLocation?: string;
  foundDate?: string;
  foundTime?: string;
}

const CATEGORIES = [
  "Bags & Backpacks",
  "Water Bottles",
  "Electronics",
  "Books & Notebooks",
  "Keys & Keychains",
  "Accessories",
  "Eyewear",
  "Others"
];

export default function StudentDashboard({ studentData, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<"my-tickets" | "submit" | "notifications" | "browse-found" | "history">("submit");
  
  const { data: myReports = [], isLoading: loading } = useMyReports();
  const tickets: Ticket[] = myReports.map(r => ({
    id: r.id,
    ticketId: r.id.substring(0, 8).toUpperCase(),
    itemName: r.title,
    category: r.category,
    description: r.description,
    location: r.location_lost,
    dateLost: r.date_lost,
    status: r.status === "SUBMITTED" ? "pending" : r.status === "APPROVED" ? "approved" : r.status === "REJECTED" ? "rejected" : r.status === "MATCHED" ? "found" : "collected",
    createdAt: r.created_at,
  }));

  const { data: rawNotifications = [] } = useMyNotifications();
  const notifications: Notification[] = rawNotifications.map((n) => ({
    id: n.id,
    type: n.type,
    itemName: n.title,
    ticketId: "",
    message: n.message,
    date: new Date(n.created_at).toLocaleDateString(),
    time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: n.is_read
  }));

  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const { data: foundItems = [] } = usePublicFoundItems();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Format ticket ID to KJL26XX format for lost items
  const formatTicketId = (ticketId: string) => {
    // If it's already formatted (contains KJL or KJF), return as-is
    if (ticketId.includes('KJL') || ticketId.includes('KJF')) {
      return ticketId;
    }
    // If it's a number or can be parsed as one, format it
    const numericId = parseInt(ticketId.replace(/\D/g, ''));
    if (!isNaN(numericId)) {
      return `KJL26${String(numericId).padStart(2, '0')}`;
    }
    // Otherwise return as-is
    return ticketId;
  };

  // Format found item ID to KJF26XX format
  const formatFoundItemId = (itemId: string) => {
    // If it's already formatted (contains KJL or KJF), return as-is
    if (itemId.includes('KJL') || itemId.includes('KJF')) {
      return itemId;
    }
    // If it's a number or can be parsed as one, format it
    const numericId = parseInt(itemId.replace(/\D/g, ''));
    if (!isNaN(numericId)) {
      return `KJF26${String(numericId).padStart(2, '0')}`;
    }
    // Otherwise return as-is
    return itemId;
  };

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [ticketSearchQuery, setTicketSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleTicketSubmitted = () => {
    setActiveTab("my-tickets");
  };

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filter found items
  const filteredFoundItems = foundItems.filter(item => {
    const matchesSearch = !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = !filterLocation ||
      item.location_found.toLowerCase().includes(filterLocation.toLowerCase());

    const matchesCategory = !filterCategory || item.category === filterCategory;

    let matchesDate = true;
    if (filterDateFrom || filterDateTo) {
      const itemDate = new Date(item.date_found);
      if (filterDateFrom) {
        matchesDate = matchesDate && itemDate >= new Date(filterDateFrom);
      }
      if (filterDateTo) {
        matchesDate = matchesDate && itemDate <= new Date(filterDateTo);
      }
    }

    return matchesSearch && matchesLocation && matchesCategory && matchesDate;
  });

  const clearFilters = () => {
    setFilterLocation("");
    setFilterCategory("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSearchTerm("");
  };

  const hasActiveFilters = filterLocation || filterCategory || filterDateFrom || filterDateTo || searchTerm;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
            <Clock size={12} />
            Pending Review
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
            <XCircle size={12} />
            Rejected
          </span>
        );
      case "found":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-400">
            <CheckCircle size={12} />
            ✔ Item Found
          </span>
        );
      case "collected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-400">
            <CheckCircle size={12} />
            ✔ Collected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen shrink-0">
        {/* Sidebar Header */}
        <div className="px-5 py-5 border-b-2 border-cyan-200 bg-gradient-to-b from-cyan-50/40 to-white shadow-sm">
          <div className="flex justify-center mb-4">
            <img src={campusLogo} alt="Campus Logo" className="h-8 object-contain drop-shadow-md" />
          </div>
          <div className="flex items-center gap-2.5 justify-center">
            <div className="text-center px-4 py-2 rounded-lg bg-white/60 border border-cyan-100 shadow-sm">
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-cyan-600 font-semibold text-base leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                Student Portal
              </p>
              <p className="text-cyan-600 text-xs leading-tight text-center">Lost & Found</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <button
            onClick={() => setActiveTab("submit")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
              activeTab === "submit"
                ? "bg-cyan-500 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            <Plus size={16} />
            Submit New Ticket
          </button>

          <button
            onClick={() => setActiveTab("my-tickets")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
              activeTab === "my-tickets"
                ? "bg-cyan-500 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            <Package size={16} />
            My Tickets
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
              activeTab === "notifications"
                ? "bg-cyan-500 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            {unreadCount > 0 ? <BellDot size={16} /> : <Bell size={16} />}
            <span className="flex-1 text-left">Notifications</span>
            {unreadCount > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
              activeTab === "history"
                ? "bg-cyan-500 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            <History size={16} />
            Ticket History
          </button>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3">
            <p className="text-gray-900 font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
              {studentData.name}
            </p>
            <p className="text-gray-500 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
              {studentData.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
          {activeTab === "browse-found" ? (
          <div>
            <div className="mb-6">
              <h2 className="text-blue-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.5rem" }}>
                Browse Found Items
              </h2>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Search for your lost items from all found items on campus
              </p>
            </div>

            {/* Search Bar and Filters Button */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by item name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  showFilters || hasActiveFilters
                    ? "bg-cyan-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
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

            {/* Filters Panel */}
            {showFilters && (
              <div className="mb-4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
                    Filter Options
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      Location
                    </label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g., Library, Cafeteria..."
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
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
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
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
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-all"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition-all"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <span className="font-semibold text-gray-900">{filteredFoundItems.length}</span> item{filteredFoundItems.length !== 1 ? 's' : ''} found
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Found Items Grid */}
            {loading ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Loading found items...
                </p>
              </div>
            ) : filteredFoundItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-sm font-medium mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                  No items found
                </p>
                <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFoundItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md hover:border-cyan-200 transition-all cursor-pointer"
                  >
                    <div className="mb-3">
                      <h3 className="text-gray-900 font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        ID: {formatFoundItemId(item.id.substring(0, 8))}
                      </p>
                    </div>

                    <p className="text-gray-600 text-xs mb-4 leading-relaxed line-clamp-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {item.description}
                    </p>

                    <div className="space-y-2 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          Found at: {item.location_found}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {new Date(item.date_found).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package size={12} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-500 mb-0.5" style={{ fontFamily: "DM Sans, sans-serif" }}>
                            Collect From:
                          </p>
                          <p className="text-xs text-emerald-600 font-semibold" style={{ fontFamily: "DM Sans, sans-serif" }}>
                            Designated Reception
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "my-tickets" ? (
          <div>
            <div className="mb-6">
              <h2 className="text-blue-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.5rem" }}>
                My Lost Item Tickets
              </h2>
              <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Track the status of your submitted lost item reports
              </p>

              {/* Search Input */}
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets by item name, location, or ticket ID..."
                  value={ticketSearchQuery}
                  onChange={(e) => setTicketSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
                {ticketSearchQuery && (
                  <button
                    onClick={() => setTicketSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Loading tickets...
                </p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-sm font-medium mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                  No tickets submitted yet
                </p>
                <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Report a lost item to get started
                </p>
                <button
                  onClick={() => setActiveTab("submit")}
                  className="px-6 py-2.5 rounded-full text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Submit Your First Ticket
                </button>
              </div>
            ) : (
              (() => {
                const filteredTickets = tickets.filter((ticket) => {
                  const searchLower = ticketSearchQuery.toLowerCase();
                  return (
                    ticket.itemName.toLowerCase().includes(searchLower) ||
                    ticket.location.toLowerCase().includes(searchLower) ||
                    ticket.ticketId.toLowerCase().includes(searchLower) ||
                    ticket.description.toLowerCase().includes(searchLower)
                  );
                });

                if (filteredTickets.length === 0) {
                  return (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                      <Search size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600 text-sm font-medium mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                        No tickets found
                      </p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        Try adjusting your search terms
                      </p>
                    </div>
                  );
                }

                return (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`bg-white rounded-2xl p-6 border transition-all hover:shadow-md ${
                      ticket.status === "found" ? "border-green-400 bg-gradient-to-br from-green-50/50 to-white" :
                      ticket.status === "collected" ? "border-purple-400 bg-gradient-to-br from-purple-50/50 to-white" :
                      "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem" }}>
                          {ticket.itemName} {(ticket.status === "found" || ticket.status === "collected") && "🎉"}
                        </h3>
                        <p className="text-gray-500 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          Ticket ID: {formatTicketId(ticket.ticketId)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {ticket.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {ticket.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {new Date(ticket.dateLost).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Found Notification */}
                    {ticket.status === "found" && ticket.collectionLocation && (
                      <div className="mt-4 p-4 bg-green-50 border-2 border-green-400 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                            <CheckCircle size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-green-900 font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                              🎉 Great News! Your Item Has Been Found!
                            </p>
                            <p className="text-green-800 text-xs mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                              Please collect your item from:
                            </p>
                            <div className="bg-white rounded-lg p-3 border border-green-300">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin size={14} className="text-green-600" />
                                <span className="text-green-900 font-semibold text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                                  {ticket.collectionLocation}
                                </span>
                              </div>
                              {ticket.foundDate && ticket.foundTime && (
                                <p className="text-gray-600 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                                  Found on: {ticket.foundDate} at {ticket.foundTime}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Collected Success */}
                    {ticket.status === "collected" && (
                      <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-400 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
                            <CheckCircle size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-purple-900 font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                              ✅ Item Collected Successfully
                            </p>
                            <p className="text-purple-800 text-xs mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                              Your lost item has been returned successfully.
                            </p>
                            <div className="bg-white rounded-lg p-3 border border-purple-300">
                              <p className="text-gray-700 text-xs mb-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                                <strong>Collection Location:</strong> {ticket.collectionLocation}
                              </p>
                              {ticket.returnedDate && ticket.returnedTime && (
                                <p className="text-gray-700 text-xs mb-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                                  <strong>Returned On:</strong> {ticket.returnedDate} at {ticket.returnedTime}
                                </p>
                              )}
                              <p className="text-gray-600 text-xs mt-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                                Thank you for using the Lost & Found System.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
                );
              })()
            )}
          </div>
        ) : activeTab === "notifications" ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-blue-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.5rem" }}>
                  Notifications
                </h2>
                <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Stay updated on your lost item tickets
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold transition-all"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  Mark All as Read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-sm font-medium mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                  No notifications yet
                </p>
                <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  You'll receive updates when your tickets are reviewed or items are found
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer hover:shadow-md ${
                      !notification.read ? "border-cyan-300 bg-cyan-50/30" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        notification.type === "collected" ? "bg-purple-100" :
                        notification.type === "found" ? "bg-green-100" :
                        "bg-blue-100"
                      }`}>
                        {notification.type === "collected" ? <CheckCircle size={20} className="text-purple-600" /> :
                         notification.type === "found" ? <CheckCircle size={20} className="text-green-600" /> :
                         <CheckCircle size={20} className="text-blue-600" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-gray-900 font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                              {notification.type === "collected" ? "✅ Item Collected Successfully" :
                               notification.type === "found" ? "🎉 Item Found!" :
                               "✓ Ticket Approved"}
                            </h3>
                            <p className="text-gray-600 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full shrink-0"></span>
                          )}
                        </div>

                        <p className="text-gray-700 text-sm font-semibold mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {notification.itemName}
                        </p>

                        {notification.type === "found" && notification.collectionLocation && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                            <p className="text-green-900 text-xs font-semibold mb-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                              Collection Details:
                            </p>
                            <p className="text-green-800 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                              📍 <strong>Location:</strong> {notification.collectionLocation}
                            </p>
                            {notification.foundDate && notification.foundTime && (
                              <p className="text-green-800 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                                📅 <strong>Found:</strong> {notification.foundDate} at {notification.foundTime}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-gray-400 text-[11px]" style={{ fontFamily: "DM Sans, sans-serif" }}>
                            Ticket: {formatTicketId(notification.ticketId)}
                          </p>
                          <span className="text-gray-300">•</span>
                          <p className="text-gray-400 text-[11px]" style={{ fontFamily: "DM Sans, sans-serif" }}>
                            {notification.date} at {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "history" ? (
          <div>
            <div className="mb-6">
              <h2 className="text-blue-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.5rem" }}>
                Ticket History
              </h2>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                View your returned items and closed tickets
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Loading history...
                </p>
              </div>
            ) : tickets.filter(t => t.status === "collected" || t.status === "rejected").length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <History size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-sm font-medium mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                  No ticket history yet
                </p>
                <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Returned and closed tickets will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.filter(t => t.status === "collected" || t.status === "rejected").map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`bg-white rounded-2xl p-6 border transition-all ${
                      ticket.status === "collected" ? "border-purple-300 bg-gradient-to-br from-purple-50/30 to-white" :
                      "border-gray-300 bg-gradient-to-br from-gray-50/30 to-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem" }}>
                          {ticket.itemName} {ticket.status === "collected" && "✅"}
                        </h3>
                        <p className="text-gray-500 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          Ticket ID: {formatTicketId(ticket.ticketId)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {ticket.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {ticket.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {new Date(ticket.dateLost).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Collected Success Details */}
                    {ticket.status === "collected" && (
                      <div className="mt-4 p-4 bg-purple-50 border border-purple-300 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
                            <CheckCircle size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-purple-900 font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                              ✅ Item Successfully Returned
                            </p>
                            <div className="bg-white rounded-lg p-3 border border-purple-200 mt-2">
                              <p className="text-gray-700 text-xs mb-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                                <strong>Collection Location:</strong> {ticket.collectionLocation}
                              </p>
                              {ticket.returnedDate && ticket.returnedTime && (
                                <p className="text-gray-700 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                                  <strong>Returned On:</strong> {ticket.returnedDate} at {ticket.returnedTime}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rejected/Not Found */}
                    {ticket.status === "rejected" && (
                      <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center shrink-0">
                            <XCircle size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                              Ticket Closed
                            </p>
                            <p className="text-gray-600 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                              This ticket was reviewed and closed. If you still haven't found your item, you can submit a new ticket.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "submit" ? (
          <ReportLostItemForm
            studentData={studentData}
            onSuccess={handleTicketSubmitted}
            onCancel={() => setActiveTab("my-tickets")}
          />
        ) : null}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <ConfirmModal
          title="Logout Confirmation"
          message="Are you sure you want to logout?\n\nYou will be redirected to the login page."
          confirmText="Yes, Logout"
          cancelText="Cancel"
          type="warning"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
}